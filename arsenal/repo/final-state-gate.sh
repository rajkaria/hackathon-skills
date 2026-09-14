#!/usr/bin/env bash
# final-state-gate.sh — what will judges ACTUALLY see? Run at T-2h and right after submitting.
#
#   bash final-state-gate.sh [repo-dir] [--remote origin] [--branch main] [--no-fetch] [--no-gh]
#
# Inspects the REMOTE branch (what GitHub shows), not your working tree. Read-only:
# never checks out, commits, or pushes. The only write is `git fetch` updating the
# remote-tracking ref — skip it with --no-fetch (uses the ref you already have).
#
# Prints ✓ / ✗ / ! per check. Exit 1 if any ✗.
#   1. remote tree: no internal docs, no .env / key files      (benchpress, hunch-vpm)
#   2. local vs remote: unpushed fixes, remote-only commits, dirty tree (hunch-vpm cleanup never pushed)
#   3. placeholders in docs on the remote tree: {{...}}, TODO, TBD, "paste YouTube link", lorem ipsum, 0x0 address
#   4. secrets anywhere in the remote branch HISTORY (masked), and secret/internal files ever added
#   5. commit cadence: same-minute bursts, single giant commits, reset histories (ETHGlobal DQ rule)
#   6. open PRs (unmerged fixes = judges see stale main)       [needs authenticated gh]
#   7. README at root with a live-demo URL in the first 40 lines
#
# Portable: bash 3.2 (macOS), BSD tools. No node, no jq.

export LC_ALL=C
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd -P)
HG_LIB_ONLY=1 . "$SCRIPT_DIR/guard-commit.sh" || { echo "cannot load guard-commit.sh" >&2; exit 2; }

REPO="."; REMOTE="origin"; BRANCH=""; FETCH=1; USE_GH=1
while [ $# -gt 0 ]; do
  case "$1" in
    -h|--help) sed -n '2,19p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    --remote) REMOTE="$2"; shift ;;
    --remote=*) REMOTE="${1#*=}" ;;
    --branch) BRANCH="$2"; shift ;;
    --branch=*) BRANCH="${1#*=}" ;;
    --no-fetch) FETCH="" ;;
    --no-gh) USE_GH="" ;;
    -*) echo "unknown flag: $1" >&2; exit 2 ;;
    *) REPO="$1" ;;
  esac
  shift
done

cd "$REPO" 2>/dev/null || { echo "repo dir not found: $REPO" >&2; exit 2; }
git rev-parse --git-dir >/dev/null 2>&1 || { echo "not a git repo: $REPO" >&2; exit 2; }
G="git --no-optional-locks"

TMP=$(mktemp -d "${TMPDIR:-/tmp}/final-gate.XXXXXX") || exit 2
trap 'rm -rf "$TMP"' EXIT

NPASS=0; NFAIL=0; NWARN=0
pass()    { printf '  ✓ %s\n' "$*"; NPASS=$((NPASS + 1)); }
fail()    { printf '  ✗ %s\n' "$*"; NFAIL=$((NFAIL + 1)); }
warn()    { printf '  ! %s\n' "$*"; NWARN=$((NWARN + 1)); }
detail()  { printf '      %s\n' "$*"; }
section() { printf '\n%s\n' "$*"; }
# print at most N lines of a file as details
details() { local f="$1" n="${2:-10}" total; total=$(wc -l < "$f" | tr -d ' ')
  head -n "$n" "$f" | while IFS= read -r l; do detail "$l"; done
  [ "$total" -gt "$n" ] && detail "… and $((total - n)) more"; return 0; }

# ---- 0. Resolve the remote ref ---------------------------------------------------------
if [ -z "$BRANCH" ]; then
  BRANCH=$($G symbolic-ref -q --short "refs/remotes/$REMOTE/HEAD" 2>/dev/null)
  BRANCH="${BRANCH#"$REMOTE"/}"
  if [ -z "$BRANCH" ]; then
    if $G show-ref -q --verify "refs/remotes/$REMOTE/main"; then BRANCH=main
    elif $G show-ref -q --verify "refs/remotes/$REMOTE/master"; then BRANCH=master
    else BRANCH=main; fi
  fi
fi
REF="refs/remotes/$REMOTE/$BRANCH"

echo "final-state gate: $(pwd -P)  →  $REMOTE/$BRANCH"
section "0. Remote ref"
if [ -n "$FETCH" ]; then
  if git fetch --quiet "$REMOTE" "$BRANCH" 2>"$TMP/fetch.err"; then
    pass "fetched $REMOTE/$BRANCH"
  else
    warn "git fetch failed — results reflect the LAST fetched state, which may be stale"
    details "$TMP/fetch.err" 3
  fi
else
  warn "--no-fetch: using cached $REMOTE/$BRANCH (last fetched $(stat -f '%Sm' -t '%Y-%m-%d %H:%M' "$(git rev-parse --git-path FETCH_HEAD)" 2>/dev/null || echo 'unknown'))"
fi
if ! $G rev-parse -q --verify "$REF^{commit}" >/dev/null; then
  fail "remote ref $REF not found (push the branch, or pass --remote/--branch)"
  printf '\nResult: %d passed, %d warnings, %d FAILED\n' "$NPASS" "$NWARN" "$NFAIL"
  exit 1
fi
pass "$REF at $($G log -1 --format='%h %s' "$REF" | cut -c1-80)"

# Guard config as the remote sees it, plus the local one if different
{ $G show "$REF:.hackathon-guard" 2>/dev/null; [ -f .hackathon-guard ] && cat .hackathon-guard; } > "$TMP/guardcfg"
hg_load_config < "$TMP/guardcfg"

# ---- 1. Remote tree --------------------------------------------------------------------
section "1. Files judges can see on $REMOTE/$BRANCH"
$G ls-tree -r -z --name-only "$REF" > "$TMP/tree"
tr '\0' '\n' < "$TMP/tree" > "$TMP/treelist"
: > "$TMP/tree.block"; : > "$TMP/tree.warn"
ntree=0
while IFS= read -r -d '' p; do
  ntree=$((ntree + 1))
  c=$(hg_classify_path "$p")
  case "$c" in
    block-secret-file*) printf 'secret file: %s  (pattern %s)\n' "$p" "$(printf '%s' "$c" | cut -f2)" >> "$TMP/tree.block" ;;
    block-internal*)    printf 'internal doc: %s  (pattern %s)\n' "$p" "$(printf '%s' "$c" | cut -f2)" >> "$TMP/tree.block" ;;
    warn-operator*)     printf '%s  (pattern %s)\n' "$p" "$(printf '%s' "$c" | cut -f2)" >> "$TMP/tree.warn" ;;
  esac
done < "$TMP/tree"
if [ -s "$TMP/tree.block" ]; then
  fail "$(wc -l < "$TMP/tree.block" | tr -d ' ') internal/secret file(s) are public right now:"
  details "$TMP/tree.block" 20
  detail "fix: git rm --cached <path> && commit && PUSH (then see check 4: history still has them)"
else
  pass "no internal docs or secret files in $ntree tracked paths"
fi
if [ -s "$TMP/tree.warn" ]; then
  warn "operator-doc-looking files are public — intended?"
  details "$TMP/tree.warn" 10
fi

# ---- 2. Local vs remote ----------------------------------------------------------------
section "2. Local vs remote"
LOCAL="refs/heads/$BRANCH"
if $G show-ref -q --verify "$LOCAL"; then
  ahead=$($G rev-list --count "$REF..$LOCAL")
  behind=$($G rev-list --count "$LOCAL..$REF")
  if [ "$ahead" -gt 0 ]; then
    fail "$ahead local commit(s) on $BRANCH NOT pushed — judges see the old state"
    $G log --format='%h %s' "$REF..$LOCAL" | cut -c1-90 > "$TMP/ahead"; details "$TMP/ahead" 8
    detail "fix: git push $REMOTE $BRANCH"
  else
    pass "no unpushed commits on local $BRANCH"
  fi
  [ "$behind" -gt 0 ] && warn "$behind remote commit(s) not in local $BRANCH (pull before editing further)"
else
  warn "no local branch $BRANCH to compare"
fi
cur=$($G symbolic-ref -q --short HEAD 2>/dev/null)
if [ -n "$cur" ] && [ "$cur" != "$BRANCH" ]; then
  nb=$($G rev-list --count "$REF..HEAD")
  [ "$nb" -gt 0 ] && warn "checked-out branch '$cur' has $nb commit(s) not on $REMOTE/$BRANCH — unmerged fixes?"
fi
if [ "$($G rev-parse --is-bare-repository)" = false ]; then
  $G status --porcelain 2>/dev/null > "$TMP/dirty"
  if [ -s "$TMP/dirty" ]; then
    warn "working tree is dirty ($(wc -l < "$TMP/dirty" | tr -d ' ') path(s)) — uncommitted work is invisible to judges"
    details "$TMP/dirty" 5
  else
    pass "working tree clean"
  fi
fi

# ---- 3. Placeholders in docs -----------------------------------------------------------
section "3. Placeholders in docs on $REMOTE/$BRANCH"
DOCSPEC="-- *.md *.mdx *.markdown *.txt *.rst :(exclude,glob)**/node_modules/** :(exclude,glob)**/vendor/** :(exclude,glob)**/CHANGELOG* :(exclude,glob)**/LICENSE*"
# gg <label> <severity> <git grep args...>
gg() {
  local label="$1" sev="$2"; shift 2
  # shellcheck disable=SC2086
  set -f; $G grep -I -n "$@" "$REF" $DOCSPEC > "$TMP/gg" 2>/dev/null; set +f
  [ -s "$TMP/gg" ] || return 1
  sed -e "s#^$REF:##" "$TMP/gg" | cut -c1-110 > "$TMP/gg.out"
  if [ "$sev" = fail ]; then fail "$label: $(wc -l < "$TMP/gg.out" | tr -d ' ') hit(s)"
  else warn "$label: $(wc -l < "$TMP/gg.out" | tr -d ' ') hit(s)"; fi
  details "$TMP/gg.out" 6
  return 0
}
hits=0
gg '{{template}} placeholder' fail -E -e '(^|[^$])\{\{[^}]*\}\}' && hits=1
gg 'TODO'                     fail -w -e 'TODO' && hits=1
gg 'TBD'                      fail -w -e 'TBD' && hits=1
gg '"paste YouTube link"'     fail -i -F -e 'paste YouTube link' && hits=1
gg 'lorem ipsum'              fail -i -F -e 'lorem ipsum' && hits=1
gg 'zero address (unfilled contract address?)' warn -F -e '0x0000000000000000000000000000000000000000' && hits=1
[ "$hits" = 0 ] && pass "no placeholders in tracked docs"

# ---- 4. Secrets in history -------------------------------------------------------------
section "4. Secrets across the full history of $REMOTE/$BRANCH"
$G log -p -U0 --no-color --no-ext-diff --no-textconv --format='commit %H' "$REF" \
  -- . ':(exclude,glob)**/*lock*' ':(exclude,glob)**/*.svg' ':(exclude,glob)**/*.min.js' \
  | hg_diff_to_stream > "$TMP/hist"
hg_scan_stream "$TMP/hist" | sort -u > "$TMP/hist.find"
grep '^block' "$TMP/hist.find" | awk -F '\t' '{ print $2 " in " $3 ": " $4 }' > "$TMP/hist.block"
grep '^warn'  "$TMP/hist.find" | awk -F '\t' '{ print $2 " in " $3 ": " $4 }' > "$TMP/hist.warn"
if [ -s "$TMP/hist.block" ]; then
  fail "$(wc -l < "$TMP/hist.block" | tr -d ' ') secret-shaped string(s) in history (commit file: masked):"
  details "$TMP/hist.block" 15
  detail "fix: ROTATE each key first (deleting the line does not un-leak it), then consider history rewrite"
else
  pass "no secret-shaped strings in $($G rev-list --count "$REF") commits of added lines"
fi
[ -s "$TMP/hist.warn" ] && { warn "lower-risk key material in history:"; details "$TMP/hist.warn" 5; }

$G log --format='commit %h' --name-only --diff-filter=A "$REF" \
  | awk '/^commit /{ sha = $2; next } NF { print sha "\t" $0 }' > "$TMP/added"
: > "$TMP/added.secret"; : > "$TMP/added.internal"
while IFS=$'\t' read -r sha p; do
  c=$(hg_classify_path "$p")
  case "$c" in
    block-secret-file*) printf '%s %s\n' "$sha" "$p" >> "$TMP/added.secret" ;;
    block-internal*)    grep -qxF -e "$p" "$TMP/treelist" 2>/dev/null || printf '%s %s\n' "$sha" "$p" >> "$TMP/added.internal" ;;
  esac
done < "$TMP/added"
if [ -s "$TMP/added.secret" ]; then
  fail "secret file(s) were committed at some point (still readable in history):"
  details "$TMP/added.secret" 10
else
  pass "no .env / key files ever committed"
fi
if [ -s "$TMP/added.internal" ]; then
  warn "internal doc(s) were committed at some point — deleted files stay browsable in history:"
  details "$TMP/added.internal" 10
fi

# ---- 5. Commit cadence -----------------------------------------------------------------
section "5. Commit history authenticity (judges check this)"
total=$($G rev-list --count "$REF")
first=$($G log --reverse --format='%ad' --date=format-local:'%Y-%m-%d %H:%M' "$REF" | head -n 1)
last=$($G log -1 --format='%ad' --date=format-local:'%Y-%m-%d %H:%M' "$REF")
detail "$total commits, first $first, last $last (author dates, local time)"
burst() { # $1 = format for the date: %ad or %cd
  $G log --format="%an|$1" --date=format-local:'%Y-%m-%d %H:%M' "$REF" | sort | uniq -c | sort -rn | head -n 1
}
top=$(burst '%ad'); topn=$(printf '%s' "$top" | awk '{print $1}'); topk=$(printf '%s' "$top" | sed 's/^ *[0-9]* //')
if [ "${topn:-0}" -ge 5 ]; then
  fail "$topn commits by the same author in one minute ($topk) — reads as a dumped/fabricated history"
  detail "ETHGlobal: 'large single commits or missing histories may be disqualified'"
elif [ "${topn:-0}" -ge 3 ]; then
  warn "$topn commits by the same author in one minute ($topk)"
else
  pass "max ${topn:-0} commit(s) per author-minute"
fi
ctop=$(burst '%cd'); ctopn=$(printf '%s' "$ctop" | awk '{print $1}')
if [ "${ctopn:-0}" -ge 5 ] && [ "${topn:-0}" -lt 5 ]; then
  warn "$ctopn commits share one COMMITTER minute ($(printf '%s' "$ctop" | sed 's/^ *[0-9]* //')) — rebased/recreated history?"
fi
roots=$($G rev-list --max-parents=0 --count "$REF")
[ "$roots" -gt 1 ] && warn "$roots root commits — history was reset or unrelated histories merged"
[ "$total" -lt 5 ] && warn "only $total commit(s) — judges may read this as a code dump"
$G log --shortstat --format='C %h %s' "$REF" -- . ':(exclude,glob)**/*lock*' \
  | awk '/^C /{ sha = $2; subj = substr($0, length($2) + 4); next }
         /insertion/ { n = 0; for (i = 1; i <= NF; i++) if ($i ~ /^insertion/) n = $(i-1)
                       tot += n; if (n > max) { max = n; msha = sha; msubj = subj } }
         END { printf "%d %d %s %s\n", tot, max, msha, msubj }' > "$TMP/big"
read -r tot max msha msubj < "$TMP/big"
if [ "${tot:-0}" -gt 0 ] && [ "$total" -ge 2 ]; then
  pct=$((max * 100 / tot))
  if [ "$pct" -ge 60 ]; then
    warn "one commit holds ${pct}% of all inserted lines ($msha: $(printf '%s' "$msubj" | cut -c1-60)) — large single commit"
  else
    pass "largest commit is ${pct}% of inserted lines (no single dump commit)"
  fi
fi

# ---- 6. Open PRs -----------------------------------------------------------------------
section "6. Open pull requests"
url=$($G remote get-url "$REMOTE" 2>/dev/null)
slug=$(printf '%s' "$url" | sed -n -E 's#^(https?://([^@/]+@)?github\.com/|git@github\.com:|ssh://git@github\.com/)([^/]+/[^/]+)$#\3#p' | sed 's/\.git$//')
if [ -z "$USE_GH" ]; then
  warn "skipped (--no-gh)"
elif [ -z "$slug" ]; then
  warn "skipped: $REMOTE is not a github.com remote"
elif ! command -v gh >/dev/null 2>&1; then
  warn "skipped: gh not installed"
elif ! gh auth status >/dev/null 2>&1; then
  warn "skipped: gh not authenticated (gh auth login)"
elif gh pr list -R "$slug" --state open --json number,title,baseRefName \
       --jq '.[] | "#\(.number) [\(.baseRefName)] \(.title)"' > "$TMP/prs" 2>"$TMP/prs.err"; then
  if [ -s "$TMP/prs" ]; then
    grep -F "[$BRANCH]" "$TMP/prs" > "$TMP/prs.base"
    if [ -s "$TMP/prs.base" ]; then
      fail "$(wc -l < "$TMP/prs.base" | tr -d ' ') open PR(s) into $BRANCH on $slug — unmerged fixes mean judges see stale $BRANCH:"
      details "$TMP/prs.base" 10
    fi
    grep -vF "[$BRANCH]" "$TMP/prs" > "$TMP/prs.other"
    [ -s "$TMP/prs.other" ] && { warn "open PR(s) into other branches:"; details "$TMP/prs.other" 5; }
  else
    pass "no open PRs on $slug"
  fi
else
  warn "gh pr list failed:"; details "$TMP/prs.err" 3
fi

# ---- 7. README -------------------------------------------------------------------------
section "7. README on $REMOTE/$BRANCH"
readme=$($G ls-tree --name-only "$REF" | grep -i '^readme\(\.[a-z]*\)\{0,1\}$' | head -n 1)
if [ -z "$readme" ]; then
  warn "no README at repo root — the first thing a judge opens"
else
  $G show "$REF:$readme" | head -n 40 | grep -oE 'https?://[^] )>"'"'"'`]+' \
    | grep -viE 'shields\.io|badge|/actions/workflows/|img\.|\.(png|jpe?g|gif|svg|webp)$' > "$TMP/urls"
  if [ -s "$TMP/urls" ]; then
    pass "$readme has a link in its first 40 lines: $(head -n 1 "$TMP/urls")"
  else
    warn "$readme has no live-demo URL in its first 40 lines (badges don't count)"
  fi
fi

# ---- Summary ---------------------------------------------------------------------------
echo
if [ "$NFAIL" -gt 0 ]; then
  printf 'Result: %d passed, %d warnings, %d FAILED — fix the ✗ lines, push, and re-run.\n' "$NPASS" "$NWARN" "$NFAIL"
  exit 1
fi
printf 'Result: %d passed, %d warnings, 0 failed — %s/%s is judge-ready.\n' "$NPASS" "$NWARN" "$REMOTE" "$BRANCH"
exit 0
