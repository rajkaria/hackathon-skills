#!/usr/bin/env bash
# Tests for install.sh, run entirely inside a mktemp sandbox (HOME and the install target are both
# redirected there, so nothing touches your real ~/.claude).
#
#   bash install.test.sh
#
# Checks: a fresh install links every SKILL.md target; a re-install keeps the user's local/ files,
# removes files the skill no longer ships, and backs up the previous install.
set -uo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
SANDBOX="$(mktemp -d)"
export HOME="$SANDBOX/home"
export HACKATHON_SKILL_DEST="$SANDBOX/home/.claude/skills/hackathon"
mkdir -p "$HOME"
pass=0
fail=0
check() {
  if eval "$2"; then pass=$((pass + 1)); else fail=$((fail + 1)); echo "FAIL: $1"; fi
}

out1="$(bash "$HERE/install.sh" 2>&1)"
check "first install exits 0" '[ $? -eq 0 ]'
check "SKILL.md installed" '[ -f "$HACKATHON_SKILL_DEST/SKILL.md" ]'
check "every SKILL.md link target present" 'grep -q "all SKILL.md link targets present" <<<"$out1"'
check "maintainer-only files not installed" '[ ! -e "$HACKATHON_SKILL_DEST/CLAUDE.md" ] && [ ! -e "$HACKATHON_SKILL_DEST/install.sh" ] && [ ! -e "$HACKATHON_SKILL_DEST/docs/context" ]'
check "the repo ships no local/" '[ ! -e "$HACKATHON_SKILL_DEST/local" ]'

mkdir -p "$HACKATHON_SKILL_DEST/local/retro"
echo "my retro" >"$HACKATHON_SKILL_DEST/local/retro/2026-01-01-my-event.md"
echo '{"events":[1]}' >"$HACKATHON_SKILL_DEST/local/score-ledger.json"
echo "old" >"$HACKATHON_SKILL_DEST/stale-file-the-skill-no-longer-ships.md"

out2="$(bash "$HERE/install.sh" 2>&1)"
check "re-install exits 0" '[ $? -eq 0 ]'
check "local retro kept" '[ "$(cat "$HACKATHON_SKILL_DEST/local/retro/2026-01-01-my-event.md")" = "my retro" ]'
check "local ledger kept" '[ "$(cat "$HACKATHON_SKILL_DEST/local/score-ledger.json")" = "{\"events\":[1]}" ]'
check "stale shipped file removed" '[ ! -e "$HACKATHON_SKILL_DEST/stale-file-the-skill-no-longer-ships.md" ]'
check "previous install backed up outside skills/" 'ls -d "$HOME"/.claude/skill-backups/hackathon-* >/dev/null 2>&1'
check "backup includes local/" 'ls "$HOME"/.claude/skill-backups/hackathon-*/local/retro/2026-01-01-my-event.md >/dev/null 2>&1'

bash "$HERE/install.sh" --dry-run >/dev/null 2>&1
check "dry run keeps local/" '[ -f "$HACKATHON_SKILL_DEST/local/score-ledger.json" ]'

mv "$SANDBOX" "$SANDBOX.done" 2>/dev/null || true
echo "install tests: $pass passed, $fail failed"
[ "$fail" -eq 0 ]
