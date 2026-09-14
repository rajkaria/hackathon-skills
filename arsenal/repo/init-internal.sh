#!/usr/bin/env bash
# init-internal.sh — hour-0 setup for a PUBLIC hackathon repo. Idempotent: run it again any time.
#
#   bash init-internal.sh <project-dir> [--internal-dir DIR] [--no-hook] [--no-gitignore]
#
# 1. Creates the sibling <project>-internal/ folder (NOT a git repo) with a boundary README
#    and hackathon/ submission/ video/ notes/ folders. Never overwrites an existing README.
#    For a git worktree, the sibling is taken from the MAIN checkout, so every worktree
#    shares one internal folder.
# 2. Appends gitignore-public.txt to <project>/.gitignore unless its marker line is present.
# 3. Installs guard-commit.sh as the pre-commit hook (worktree-safe via `git rev-parse
#    --git-path hooks`), chaining to an existing pre-commit hook instead of clobbering it.
# 4. Warns about files ALREADY tracked that match internal-doc / secret-file patterns.
#
# Portable: bash 3.2 (macOS), BSD tools.

export LC_ALL=C
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd -P)
GUARD_SRC="$SCRIPT_DIR/guard-commit.sh"
GITIGNORE_SRC="$SCRIPT_DIR/gitignore-public.txt"
CHAIN_MARKER="# hackathon-guard-chain"

usage() { sed -n '2,15p' "$0" | sed 's/^# \{0,1\}//'; exit "${1:-0}"; }
ok()   { printf '  ✓ %s\n' "$*"; }
warn() { printf '  ! %s\n' "$*"; }
die()  { printf '  ✗ %s\n' "$*" >&2; exit 1; }

PROJECT=""; INTERNAL=""; DO_HOOK=1; DO_GITIGNORE=1
while [ $# -gt 0 ]; do
  case "$1" in
    -h|--help) usage 0 ;;
    --internal-dir) INTERNAL="$2"; shift ;;
    --internal-dir=*) INTERNAL="${1#*=}" ;;
    --no-hook) DO_HOOK="" ;;
    --no-gitignore) DO_GITIGNORE="" ;;
    -*) echo "unknown flag: $1" >&2; usage 2 ;;
    *) [ -n "$PROJECT" ] && usage 2; PROJECT="$1" ;;
  esac
  shift
done
[ -z "$PROJECT" ] && usage 2
[ -f "$GUARD_SRC" ] || die "missing $GUARD_SRC"
[ -f "$GITIGNORE_SRC" ] || die "missing $GITIGNORE_SRC"
[ -d "$PROJECT" ] || die "project dir not found: $PROJECT"
PROJECT=$(cd "$PROJECT" && pwd -P)

HG_LIB_ONLY=1 . "$GUARD_SRC"

IS_GIT=""
if git -C "$PROJECT" rev-parse --git-dir >/dev/null 2>&1; then IS_GIT=1; fi

# ---- Resolve the internal folder ------------------------------------------------------
if [ -z "$INTERNAL" ]; then
  base="$PROJECT"
  if [ -n "$IS_GIT" ]; then
    top=$(git -C "$PROJECT" rev-parse --show-toplevel 2>/dev/null)
    [ -n "$top" ] && base=$(cd "$top" && pwd -P)
    common=$(git -C "$PROJECT" rev-parse --git-common-dir 2>/dev/null)
    case "$common" in /*) ;; *) common="$PROJECT/$common" ;; esac
    common=$(cd "$common" 2>/dev/null && pwd -P)
    # In a linked worktree the common dir is <main-checkout>/.git
    case "$common" in */.git) main=$(dirname "$common"); [ -d "$main" ] && base="$main" ;; esac
  fi
  INTERNAL="$(dirname "$base")/$(basename "$base")-internal"
fi
case "$INTERNAL" in /*) ;; *) INTERNAL="$PWD/$INTERNAL" ;; esac
PROJECT_NAME=$(basename "${base:-$PROJECT}")

echo "hackathon repo setup: $PROJECT"
echo

case "$INTERNAL/" in "$PROJECT"/*) die "internal dir $INTERNAL is inside the project — it must live outside the public repo" ;; esac

mkdir -p "$INTERNAL/hackathon" "$INTERNAL/submission" "$INTERNAL/video" "$INTERNAL/notes" \
  || die "could not create $INTERNAL"
if [ -f "$INTERNAL/README.md" ]; then
  ok "internal folder exists: $INTERNAL (README kept)"
else
  cat > "$INTERNAL/README.md" <<EOF
# $PROJECT_NAME — internal working docs

**Not a git repository. Never copy anything from here into \`$PROJECT\`.**

The project repo is public from its first push. Judges, sponsors and competitors can read
every file *and every commit in its history*. Everything in this folder is internal.

| Folder | What goes here |
|---|---|
| \`hackathon/\` | event rules, prize list, our picks, judging criteria, raw page scrapes, sponsor research |
| \`submission/\` | form answers, submission checklist, track-claim framing, links to paste |
| \`video/\` | demo video script, shot list, voiceover drafts |
| \`notes/\` | strategy, competitor and judge notes, handoffs, agent task lists, personal contacts |

## What may cross into the public repo

Technical facts only, **restated in the repo's own voice**: contract addresses, chain IDs,
architecture, mechanism descriptions, setup steps, honest what's-real / what's-mocked notes.

## Never

- prize picks or which tracks we are targeting
- money targets or winnings math
- track-claim framing ("this is our Track 1 claim")
- competitor notes or judge notes (names, preferences, what they liked)
- submission form answers and checklists
- video scripts
- personal emails, phone numbers, founder outreach drafts
- verbatim sponsor or organizer copy
- secrets of any kind — those live in \`.env\` (gitignored) or the host's env settings

## Guard rails in the public repo

- \`.gitignore\` carries the hackathon public-repo block (secrets, internal docs, agent state).
- A pre-commit hook (hackathon-guard) blocks internal-doc paths and token-shaped strings.
  Bypass only consciously: \`HACKATHON_GUARD=off git commit ...\`
- At T-2h and right after submitting, run \`final-state-gate.sh\` against the public repo.

_Created by arsenal/repo/init-internal.sh on $(date '+%Y-%m-%d %H:%M')._
EOF
  ok "created internal folder: $INTERNAL (README + hackathon/ submission/ video/ notes/)"
fi
if git -C "$INTERNAL" rev-parse --show-toplevel >/dev/null 2>&1; then
  warn "internal folder is inside a git work tree ($(git -C "$INTERNAL" rev-parse --show-toplevel)) — its files could be committed there"
fi

# ---- .gitignore block ----------------------------------------------------------------------
if [ -n "$DO_GITIGNORE" ]; then
  marker=$(head -n 1 "$GITIGNORE_SRC")
  gi="$PROJECT/.gitignore"
  if [ -f "$gi" ] && grep -qF -e "$marker" "$gi"; then
    ok ".gitignore already has the public-repo block"
  else
    if [ -s "$gi" ] && [ -n "$(tail -c 1 "$gi")" ]; then printf '\n' >> "$gi"; fi
    [ -s "$gi" ] && printf '\n' >> "$gi"
    cat "$GITIGNORE_SRC" >> "$gi"
    ok "appended public-repo block to .gitignore"
  fi
fi

# ---- pre-commit hook ------------------------------------------------------------------------
if [ -z "$DO_HOOK" ]; then
  :
elif [ -z "$IS_GIT" ]; then
  warn "not a git repo yet — hook skipped. Run 'git init' then re-run this script."
else
  hooks=$(git -C "$PROJECT" rev-parse --git-path hooks)
  case "$hooks" in /*) ;; *) hooks="$PROJECT/$hooks" ;; esac
  mkdir -p "$hooks" || die "cannot create hooks dir $hooks"
  hooks=$(cd "$hooks" && pwd -P)
  hp=$(git -C "$PROJECT" config --get core.hooksPath)
  [ -n "$hp" ] && warn "core.hooksPath is set ($hp) — installing there; tools like husky may regenerate it"

  cp "$GUARD_SRC" "$hooks/hackathon-guard.sh" && chmod +x "$hooks/hackathon-guard.sh"
  pc="$hooks/pre-commit"
  if [ -f "$pc" ] && grep -qF -e "$CHAIN_MARKER" "$pc"; then
    ok "pre-commit guard already installed ($pc) — guard script refreshed"
  else
    chained=""
    if [ -e "$pc" ]; then
      chained="pre-commit.pre-hackathon"
      [ -e "$hooks/$chained" ] && chained="pre-commit.pre-hackathon.$(date +%Y%m%d%H%M%S)"
      mv "$pc" "$hooks/$chained" || die "could not move existing hook aside"
    fi
    cat > "$pc" <<EOF
#!/usr/bin/env bash
$CHAIN_MARKER v$HG_VERSION — installed by arsenal/repo/init-internal.sh
# Runs the previous pre-commit hook first (so it can finish editing the index),
# then the hackathon guard. Bypass consciously: HACKATHON_GUARD=off git commit ...
hookdir=\$(cd "\$(dirname "\$0")" && pwd)
chained="$chained"
if [ -n "\$chained" ] && [ -x "\$hookdir/\$chained" ]; then
  "\$hookdir/\$chained" "\$@" || exit \$?
fi
exec bash "\$hookdir/hackathon-guard.sh" "\$@"
EOF
    chmod +x "$pc"
    if [ -n "$chained" ]; then
      ok "installed pre-commit guard; existing hook chained as $hooks/$chained"
    else
      ok "installed pre-commit guard: $pc"
    fi
  fi

  # ---- already-tracked offenders (benchpress: STRATEGY.md was public for 6 hours) ----
  [ -f "$PROJECT/.hackathon-guard" ] && hg_load_config < "$PROJECT/.hackathon-guard"
  found=0
  lsf=$(mktemp "${TMPDIR:-/tmp}/hg-init.XXXXXX")
  git -C "$PROJECT" ls-files -z > "$lsf"
  while IFS= read -r -d '' f; do
    c=$(hg_classify_path "$f")
    case "$c" in
      block-*) found=$((found + 1))
               [ "$found" -le 25 ] && warn "already tracked: $f  (pattern $(printf '%s' "$c" | cut -f2))" ;;
    esac
  done < "$lsf"
  rm -f "$lsf"
  if [ "$found" -gt 0 ]; then
    warn "$found tracked file(s) should not be public. Untrack: git rm --cached <path> (then move to $INTERNAL)."
    warn "If already pushed, they stay in history — judges can browse it. Rotate any secret; consider a history rewrite BEFORE judging."
  else
    ok "no tracked internal docs or secret files"
  fi
fi

echo
echo "Next: keep strategy/prizes/scripts in $INTERNAL; run final-state-gate.sh at T-2h and after submitting."
