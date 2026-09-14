#!/usr/bin/env bash
# test.sh — end-to-end tests for arsenal/repo tooling, in throwaway repos under $TMPDIR.
#
#   bash test.sh            # run everything, print PASS/FAIL per case, exit 1 on any FAIL
#   KEEP=1 bash test.sh     # keep the scratch dir for inspection
#
# Isolated from your git config: GIT_CONFIG_GLOBAL points at a scratch file, system config off.
# Fake tokens are assembled at runtime so this file itself never trips a secret scanner.

export LC_ALL=C
HERE=$(cd "$(dirname "$0")" && pwd -P)
BASH32=/bin/bash   # macOS system bash 3.2 — proves portability
ROOT=$(mktemp -d "${TMPDIR:-/tmp}/hackathon-repo-test.XXXXXX") || { echo "SAFETY: mktemp failed" >&2; exit 99; }
ROOT=$(cd "$ROOT" && pwd -P) || { echo "SAFETY: cannot enter scratch dir" >&2; exit 99; }
cleanup() { if [ -n "${KEEP:-}" ]; then echo "kept: $ROOT"; else rm -rf "$ROOT"; fi; }
trap cleanup EXIT

# ---- Safety: every git write must land inside $ROOT, never in a real repo -------------------
# Resolve the repo this test file lives in (the skill repo), so we can refuse to touch it.
HOST_REPO=$(cd "$HERE" && command git rev-parse --show-toplevel 2>/dev/null)
HOST_COMMON=$(cd "$HERE" && command git rev-parse --path-format=absolute --git-common-dir 2>/dev/null)
HOST_MAIN=${HOST_COMMON%/.git}
die_safety() { echo "SAFETY: refusing '$*' — outside scratch dir $ROOT" >&2; exit 99; }
scratch_only() { # scratch_only <path>... : abort unless every path is inside $ROOT and no real repo
  local p
  for p in "$@"; do
    case "$p" in /*) ;; *) p="$PWD/$p" ;; esac
    case "$p/" in "$ROOT"/*) ;; *) die_safety "$p" ;; esac
    for h in "$HOST_REPO" "$HOST_MAIN" "$HERE"; do
      [ -n "$h" ] && case "$p/" in "$h"/*) die_safety "$p (inside $h)" ;; esac
    done
  done
}
case "$ROOT" in "$HOST_MAIN"*|"$HOST_REPO"*|/Users/rajkaria/Projects/*) die_safety "scratch root $ROOT" ;; esac
if command git -C "$ROOT" rev-parse --git-dir >/dev/null 2>&1; then die_safety "scratch root is inside a git repo"; fi
cd "$ROOT" || die_safety "cd $ROOT"

# Wrap git: the target dir (-C <dir>, else $PWD) and any path argument of init/clone/worktree
# must be inside $ROOT. Scripts under test are separate processes; their inputs are checked
# with scratch_only in run_init / run_gate below.
git() {
  local dir="$PWD" a skip="" sub="" args=""
  for a in "$@"; do
    if [ -n "$skip" ]; then
      [ "$skip" = C ] && case "$a" in /*) dir="$a" ;; *) dir="$dir/$a" ;; esac
      skip=""; continue
    fi
    case "$a" in
      -C) skip=C; continue ;;
      -c) skip=c; continue ;;
      -*) continue ;;
    esac
    if [ -z "$sub" ]; then sub="$a"; else args="$args $a"; fi
  done
  scratch_only "$dir"
  case "$sub" in
    init|clone|worktree)
      for a in $args; do case "$a" in /*) scratch_only "$a" ;; esac; done ;;
  esac
  command git "$@"
}
run_init() { scratch_only "$1"; $BASH32 "$HERE"/init-internal.sh "$@"; }
run_gate() { scratch_only "$1"; $BASH32 "$HERE"/final-state-gate.sh "$@"; }

export GIT_CONFIG_GLOBAL="$ROOT/gitconfig" GIT_CONFIG_NOSYSTEM=1
unset HACKATHON_GUARD GUARD_EMAILS GIT_DIR GIT_WORK_TREE
git config --global user.name "Test Hacker"
git config --global user.email "hacker@example.com"
git config --global init.defaultBranch main
git config --global commit.gpgsign false
git config --global advice.detachedHead false

FAKE_GHP="gh""p_$(printf 'Z9%.0s' 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20)"   # ghp_ + 40 chars
FAKE_PEM_HEAD="-----BEGIN RSA PRIV""ATE KEY-----"
FAKE_STRIPE_TEST="sk_""test_$(printf 'q%.0s' 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24)"

NPASS=0; NFAIL=0; LOG="$ROOT/case.log"
run_case() { # run_case "<description>" <function>
  local desc="$1" fn="$2"
  if ( set +e; "$fn" ) > "$LOG" 2>&1; then
    printf 'PASS  %s\n' "$desc"; NPASS=$((NPASS + 1))
  else
    printf 'FAIL  %s\n' "$desc"; NFAIL=$((NFAIL + 1))
    sed 's/^/      | /' "$LOG" | tail -n 40
  fi
}
assert() { if ! eval "$1"; then echo "assertion failed: $1"; return 1; fi; }
commit_ok()   { git -C "$1" commit -q -m "$2" > "$ROOT/commit.out" 2>&1; }
count_lines() { grep -cF -e "$2" "$1" 2>/dev/null || true; }

MARKER=$(head -n 1 "$HERE/gitignore-public.txt")

# ---------------------------------------------------------------------------------------
setup_project() { # fresh repo "proj" with an existing .gitignore and an existing pre-commit hook
  P="$ROOT/proj"
  [ -d "$P" ] && return 0
  git init -q "$P"
  printf 'node_modules/' > "$P/.gitignore"          # no trailing newline on purpose
  echo "# proj" > "$P/README.md"
  git -C "$P" add -A && git -C "$P" commit -q -m "initial"
  mkdir -p "$P/.git/hooks"
  printf '#!/bin/sh\ntouch "%s/prehook-ran"\nexit 0\n' "$ROOT" > "$P/.git/hooks/pre-commit"
  chmod +x "$P/.git/hooks/pre-commit"
}

t_init_idempotent() {
  setup_project
  run_init "$P" > "$ROOT/init1.out" 2>&1 || { cat "$ROOT/init1.out"; return 1; }
  cksum "$ROOT/proj-internal/README.md" > "$ROOT/readme.sum"
  run_init "$P" > "$ROOT/init2.out" 2>&1 || { cat "$ROOT/init2.out"; return 1; }
  cat "$ROOT/init1.out" "$ROOT/init2.out"
  assert '[ "$(count_lines "$P/.gitignore" "$MARKER")" = 1 ]'
  assert 'grep -qx "node_modules/" "$P/.gitignore"'                       # no line-gluing
  assert '[ "$(grep -c "hackathon-guard-chain" "$P/.git/hooks/pre-commit")" = 1 ]'
  assert '[ -x "$P/.git/hooks/pre-commit.pre-hackathon" ]'
  assert '! ls "$P/.git/hooks/" | grep -q "pre-hackathon\."'               # chained exactly once
  assert 'grep -q prehook-ran "$P/.git/hooks/pre-commit.pre-hackathon"'   # original hook preserved
  assert '[ -x "$P/.git/hooks/hackathon-guard.sh" ]'
  for d in hackathon submission video notes; do assert '[ -d "$ROOT/proj-internal/$d" ]' || return 1; done
  assert '! git -C "$ROOT/proj-internal" rev-parse --git-dir >/dev/null 2>&1'
  assert 'grep -q "What may cross" "$ROOT/proj-internal/README.md"'
  assert 'grep -q "prize picks" "$ROOT/proj-internal/README.md"'
  assert 'cksum "$ROOT/proj-internal/README.md" | cmp -s - "$ROOT/readme.sum"'
  assert 'grep -q "already has the public-repo block" "$ROOT/init2.out"'
  assert 'grep -q "already installed" "$ROOT/init2.out"'
}

t_block_strategy() {
  setup_project; rm -f "$ROOT/prehook-ran"
  echo "judges: ..." > "$P/STRATEGY.md"
  git -C "$P" add -f STRATEGY.md                   # -f simulates a repo made before the .gitignore existed
  if commit_ok "$P" "add strategy"; then cat "$ROOT/commit.out"; return 1; fi
  cat "$ROOT/commit.out"
  assert 'grep -q "COMMIT BLOCKED" "$ROOT/commit.out"'
  assert 'grep -q "internal doc staged: STRATEGY.md" "$ROOT/commit.out"'
  assert 'grep -q "HACKATHON_GUARD=off" "$ROOT/commit.out"'
  assert '[ -f "$ROOT/prehook-ran" ]'              # chained hook still runs
  git -C "$P" rm -q --cached STRATEGY.md; rm -f "$P/STRATEGY.md"
}

t_block_env_file() {
  setup_project
  echo "API=1" > "$P/.env.local"; git -C "$P" add -f .env.local
  if commit_ok "$P" "env"; then return 1; fi
  cat "$ROOT/commit.out"
  assert 'grep -q "secret file staged: .env.local" "$ROOT/commit.out"'
  git -C "$P" rm -q --cached .env.local; rm -f "$P/.env.local"
}

t_block_github_token() {
  setup_project; mkdir -p "$P/src"
  printf 'export const token = "%s";\n' "$FAKE_GHP" > "$P/src/config.ts"
  git -C "$P" add src/config.ts
  if commit_ok "$P" "token"; then return 1; fi
  cat "$ROOT/commit.out"
  assert 'grep -q "github-token added in src/config.ts" "$ROOT/commit.out"'
  assert '! grep -qF "$FAKE_GHP" "$ROOT/commit.out"'   # masked, never echoed
  git -C "$P" rm -q --cached src/config.ts; rm -f "$P/src/config.ts"
}

t_block_pem() {
  setup_project; mkdir -p "$P/deploy"
  printf '%s\nMIIEow\n' "$FAKE_PEM_HEAD" > "$P/deploy/notes.txt"
  git -C "$P" add deploy/notes.txt
  if commit_ok "$P" "pem"; then return 1; fi
  cat "$ROOT/commit.out"
  assert 'grep -q "private-key-block added in deploy/notes.txt" "$ROOT/commit.out"'
  git -C "$P" rm -q --cached deploy/notes.txt; rm -rf "$P/deploy"
}

t_allow_normal() {
  setup_project; mkdir -p "$P/src/app/notes" "$P/internal-tools"
  echo 'export const x = 1;' > "$P/src/app.ts"
  echo 'export default function Notes() { return null }' > "$P/src/app/notes/page.tsx"   # not /notes/
  echo 'API_KEY=' > "$P/.env.example"
  echo 'ok' > "$P/internal-tools/README.md"
  git -C "$P" add -A
  commit_ok "$P" "normal work" || { cat "$ROOT/commit.out"; return 1; }
  assert '[ -z "$(git -C "$P" status --porcelain)" ]'
}

t_bypass() {
  setup_project
  echo "public strategy, on purpose" > "$P/STRATEGY.md"; git -C "$P" add -f STRATEGY.md
  HACKATHON_GUARD=off git -C "$P" commit -q -m "conscious bypass" > "$ROOT/commit.out" 2>&1 || { cat "$ROOT/commit.out"; return 1; }
  cat "$ROOT/commit.out"
  assert 'grep -q "bypassed" "$ROOT/commit.out"'
  assert 'git -C "$P" ls-files --error-unmatch STRATEGY.md >/dev/null'
  git -C "$P" rm -q STRATEGY.md && HACKATHON_GUARD=off git -C "$P" commit -q -m "remove"
}

t_warnings_dont_block() {
  setup_project; mkdir -p "$P/docs"
  printf 'Contact: Founder@Gmail.com\nSTRIPE=%s\n' "$FAKE_STRIPE_TEST" > "$P/docs/setup.md"
  git -C "$P" add docs/setup.md
  GUARD_EMAILS="founder@gmail.com, other@proton.me" git -C "$P" commit -q -m "docs" > "$ROOT/commit.out" 2>&1 \
    || { cat "$ROOT/commit.out"; return 1; }
  cat "$ROOT/commit.out"
  assert 'grep -q "! personal email founder@gmail.com added in docs/setup.md" "$ROOT/commit.out"'
  assert 'grep -q "! stripe-test-key" "$ROOT/commit.out"'
}

t_custom_config() {
  setup_project; mkdir -p "$P/docs/notes" "$P/drafts"
  printf '# local rules\n/drafts/\nPITCH-NOTES.md\n!docs/notes/\n' > "$P/.hackathon-guard"
  echo a > "$P/drafts/a.md"; echo b > "$P/PITCH-NOTES.md"
  git -C "$P" add .hackathon-guard drafts/a.md PITCH-NOTES.md
  if commit_ok "$P" "custom"; then return 1; fi
  cat "$ROOT/commit.out"
  assert 'grep -q "internal doc staged: drafts/a.md" "$ROOT/commit.out"'
  assert 'grep -q "internal doc staged: PITCH-NOTES.md" "$ROOT/commit.out"'
  git -C "$P" rm -q --cached drafts/a.md PITCH-NOTES.md; rm -rf "$P/drafts" "$P/PITCH-NOTES.md"
  echo "public architecture notes" > "$P/docs/notes/arch.md"
  git -C "$P" add docs/notes/arch.md
  commit_ok "$P" "allowed by !docs/notes/" || { cat "$ROOT/commit.out"; return 1; }
}

t_worktree() {
  local W="$ROOT/wtmain" WT="$ROOT/wtmain-feature"
  git init -q "$W"; echo "# w" > "$W/README.md"; git -C "$W" add -A; git -C "$W" commit -q -m init
  git -C "$W" worktree add -q -b feature "$WT"
  run_init "$WT" > "$ROOT/wt-init.out" 2>&1 || { cat "$ROOT/wt-init.out"; return 1; }
  cat "$ROOT/wt-init.out"
  assert '[ -f "$WT/.git" ]'                                                    # really a linked worktree
  assert 'grep -q "hackathon-guard-chain" "$W/.git/hooks/pre-commit"'          # installed in COMMON hooks dir
  assert '[ -d "$ROOT/wtmain-internal/hackathon" ]'                             # sibling of the main checkout
  assert '[ ! -d "$ROOT/wtmain-feature-internal" ]'
  assert 'grep -qF "$MARKER" "$WT/.gitignore"'
  echo x > "$WT/HANDOFF.md"; git -C "$WT" add -f HANDOFF.md
  if commit_ok "$WT" "handoff"; then return 1; fi
  assert 'grep -q "internal doc staged: HANDOFF.md" "$ROOT/commit.out"'
  git -C "$WT" rm -q --cached HANDOFF.md; rm -f "$WT/HANDOFF.md"
  git -C "$WT" add .gitignore
  commit_ok "$WT" "gitignore in worktree" || { cat "$ROOT/commit.out"; return 1; }
  run_init "$W" > "$ROOT/wt-init2.out" 2>&1              # main checkout re-run: same hook
  assert '[ "$(grep -c hackathon-guard-chain "$W/.git/hooks/pre-commit")" = 1 ]'
  assert '! ls "$W/.git/hooks/" | grep -q pre-hackathon'
}

t_init_warns_tracked() {
  local R="$ROOT/leaky"
  git init -q "$R"; echo s > "$R/STRATEGY.md"; echo "K=1" > "$R/.env"; git -C "$R" add -A; git -C "$R" commit -q -m leaky
  run_init "$R" > "$ROOT/leaky.out" 2>&1 || { cat "$ROOT/leaky.out"; return 1; }
  cat "$ROOT/leaky.out"
  assert 'grep -q "already tracked: STRATEGY.md" "$ROOT/leaky.out"'
  assert 'grep -q "already tracked: .env" "$ROOT/leaky.out"'
}

# ---------------------------------------------------------------------------------------
dated_commit() { # dated_commit <repo> <iso-date> <msg>
  GIT_AUTHOR_DATE="$2" GIT_COMMITTER_DATE="$2" git -C "$1" commit -q -m "$3"
}

t_gate_dirty() {
  local B="$ROOT/bad-remote.git" R="$ROOT/bad"
  git init -q --bare "$B"; git init -q "$R"; git -C "$R" remote add origin "$B"
  printf '# Bad\n\nLive demo: {{DEMO_URL}}\n\nTODO: record video\n' > "$R/README.md"
  git -C "$R" add -A; dated_commit "$R" "2026-09-13T09:00:00 +0000" "readme"
  echo "judge X likes infra" > "$R/STRATEGY.md"; git -C "$R" add -A; dated_commit "$R" "2026-09-13T10:00:01 +0000" "strategy"
  printf 'GITHUB_TOKEN=%s\n' "$FAKE_GHP" > "$R/.env"; git -C "$R" add -f .env; dated_commit "$R" "2026-09-13T10:00:10 +0000" "env"
  git -C "$R" rm -q --cached .env; rm "$R/.env"; dated_commit "$R" "2026-09-13T10:00:20 +0000" "remove env"
  for i in 1 2 3; do echo "$i" > "$R/f$i.ts"; git -C "$R" add -A; dated_commit "$R" "2026-09-13T10:00:3$i +0000" "feat $i"; done
  git -C "$R" push -q -u origin main 2>/dev/null
  echo "fix" > "$R/fix.ts"; git -C "$R" add -A; dated_commit "$R" "2026-09-13T12:00:00 +0000" "unpushed fix"

  run_gate "$R" --no-gh > "$ROOT/gate-bad.out" 2>&1; local rc=$?
  cat "$ROOT/gate-bad.out"
  assert '[ "$rc" = 1 ]'
  assert 'grep -q "✗ 1 internal/secret file(s) are public" "$ROOT/gate-bad.out"'
  assert 'grep -q "internal doc: STRATEGY.md" "$ROOT/gate-bad.out"'
  assert 'grep -q "✗ 1 local commit(s) on main NOT pushed" "$ROOT/gate-bad.out"'
  assert 'grep -q "✗ {{template}} placeholder" "$ROOT/gate-bad.out"'
  assert 'grep -q "✗ TODO" "$ROOT/gate-bad.out"'
  assert 'grep -q "✗ .*secret-shaped string" "$ROOT/gate-bad.out"'
  assert 'grep -q "github-token in [0-9a-f]\{7\} .env" "$ROOT/gate-bad.out"'
  assert '! grep -qF "$FAKE_GHP" "$ROOT/gate-bad.out"'
  assert 'grep -q "✗ secret file(s) were committed" "$ROOT/gate-bad.out"'
  assert 'grep -q "✗ 6 commits by the same author in one minute" "$ROOT/gate-bad.out"'
  assert 'grep -q "! README.md has no live-demo URL" "$ROOT/gate-bad.out"'
}

t_gate_clean() {
  local B="$ROOT/good-remote.git" S="$ROOT/good-seed" R="$ROOT/good"
  git init -q --bare "$B"; git init -q "$S"; git -C "$S" remote add origin "$B"
  printf '# Good\n\n**Live demo:** https://good-demo.example.com\n\nSetup: `pnpm i && pnpm dev`\n' > "$S/README.md"
  echo 'API_KEY=' > "$S/.env.example"
  git -C "$S" add -A; dated_commit "$S" "2026-09-12T09:00:00 +0000" "scaffold"
  for i in 1 2 3 4 5; do
    mkdir -p "$S/src"; printf 'export const f%s = () => %s;\n' "$i" "$i" > "$S/src/f$i.ts"
    git -C "$S" add -A; dated_commit "$S" "2026-09-12T1$i:1$i:00 +0000" "feature $i"
  done
  git -C "$S" push -q origin main 2>/dev/null
  git clone -q "$B" "$R"

  git -C "$R" for-each-ref > "$ROOT/refs.before"; git -C "$R" rev-parse HEAD > "$ROOT/head.before"
  run_gate "$R" --no-gh > "$ROOT/gate-good.out" 2>&1; local rc=$?
  cat "$ROOT/gate-good.out"
  assert '[ "$rc" = 0 ]'
  assert '! grep -q "✗" "$ROOT/gate-good.out"'
  assert 'grep -q "✓ README.md has a link" "$ROOT/gate-good.out"'
  assert 'grep -q "judge-ready" "$ROOT/gate-good.out"'
  run_gate "$R" --no-fetch --no-gh > /dev/null 2>&1 || return 1
  git -C "$R" for-each-ref | cmp -s - "$ROOT/refs.before" || { echo "refs changed"; return 1; }
  git -C "$R" rev-parse HEAD | cmp -s - "$ROOT/head.before" || { echo "HEAD changed"; return 1; }
  assert '[ -z "$(git -C "$R" status --porcelain)" ]'
}

t_gate_missing_ref() {
  local R="$ROOT/noremote"
  git init -q "$R"; echo a > "$R/a"; git -C "$R" add -A; git -C "$R" commit -q -m a
  git -C "$R" remote add origin "$ROOT/does-not-exist.git"
  run_gate "$R" --no-fetch --no-gh > "$ROOT/gate-miss.out" 2>&1; local rc=$?
  cat "$ROOT/gate-miss.out"
  assert '[ "$rc" = 1 ]'
  assert 'grep -q "remote ref refs/remotes/origin/main not found" "$ROOT/gate-miss.out"'
}

t_safety_refuses_real_repos() {
  # Every refusal must exit 99 BEFORE `command git` runs. rev-parse is read-only anyway.
  ( git -C "$HERE" rev-parse HEAD ) >/dev/null 2>&1;            assert '[ $? = 99 ]' || return 1
  ( cd "$HERE" && git rev-parse HEAD ) >/dev/null 2>&1;         assert '[ $? = 99 ]' || return 1
  ( git init -q "$HERE/should-not-exist" ) >/dev/null 2>&1;     assert '[ $? = 99 ]' || return 1
  ( run_init "$HERE" ) >/dev/null 2>&1;                          assert '[ $? = 99 ]' || return 1
  ( run_gate "${HOST_REPO:-$HERE}" --no-fetch ) >/dev/null 2>&1; assert '[ $? = 99 ]' || return 1
  assert '[ ! -e "$HERE/should-not-exist" ]'
  ( git -C "$ROOT" --version ) >/dev/null 2>&1 || { echo "wrapper wrongly refused scratch dir"; return 1; }
}

echo "arsenal/repo tests  (scratch: $ROOT, bash: $($BASH32 -c 'echo $BASH_VERSION'))"
[ -n "$HOST_REPO" ] && echo "safety: git writes refused outside scratch; host repo $HOST_REPO is off-limits"
run_case "safety wrapper refuses git/init/gate targets outside the scratch dir"               t_safety_refuses_real_repos
run_case "init-internal.sh is idempotent (1 gitignore block, hook chained once, README kept)" t_init_idempotent
run_case "guard blocks staged STRATEGY.md (and chained hook still runs)"                    t_block_strategy
run_case "guard blocks staged .env.local"                                                    t_block_env_file
run_case "guard blocks fake ghp_ token in added line (masked in output)"                    t_block_github_token
run_case "guard blocks PEM private key header in a .txt file"                               t_block_pem
run_case "guard allows a normal commit (app/notes route, .env.example)"                     t_allow_normal
run_case "guard honors HACKATHON_GUARD=off"                                                  t_bypass
run_case "guard warns but does not block (GUARD_EMAILS match, sk_test_ key)"                t_warnings_dont_block
run_case "guard honors .hackathon-guard block and !allow lines"                              t_custom_config
run_case "init + guard work inside a git worktree (common hooks dir, shared internal/)"     t_worktree
run_case "init warns about already-tracked internal docs and .env"                           t_init_warns_tracked
run_case "final-state-gate flags internal doc, placeholders, history secret, burst, unpushed" t_gate_dirty
run_case "final-state-gate passes a clean repo and is read-only"                             t_gate_clean
run_case "final-state-gate fails clearly when the remote ref is missing"                     t_gate_missing_ref
echo
echo "$NPASS passed, $NFAIL failed"
[ "$NFAIL" -eq 0 ]
