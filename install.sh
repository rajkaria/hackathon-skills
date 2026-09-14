#!/usr/bin/env bash
# Install (or update) the hackathon skill into ~/.claude/skills/hackathon.
#
# Copies the WHOLE skill directory: SKILL.md links to templates/, tactics/ and arsenal/,
# and a single-file install leaves those links dead. That happened between Apr and Sep 2026:
# four events ran on a stale single SKILL.md with none of Sprints 1-7 on disk.
#
#   bash install.sh            # install/update
#   bash install.sh --dry-run  # show what would change
#
# The previous install is backed up to ~/.claude/skill-backups/hackathon-<timestamp>/
# (outside ~/.claude/skills so it isn't loaded as a second skill).
set -euo pipefail

SRC="$(cd "$(dirname "$0")" && pwd)"
DEST="${HACKATHON_SKILL_DEST:-$HOME/.claude/skills/hackathon}"
BACKUPS="$HOME/.claude/skill-backups"
DRY=""
[ "${1:-}" = "--dry-run" ] && DRY="--dry-run"

[ -f "$SRC/SKILL.md" ] || { echo "SKILL.md not found next to install.sh" >&2; exit 1; }

EXCLUDES=(
  --exclude .git --exclude .gitignore --exclude .claude --exclude .burn-rate --exclude .ocean
  --exclude CLAUDE.md --exclude hackathon.skill --exclude install.sh
  --exclude node_modules --exclude bun.lock --exclude .DS_Store
)

if [ -d "$DEST" ] && [ -z "$DRY" ]; then
  stamp="$(date +%Y%m%d-%H%M%S)"
  mkdir -p "$BACKUPS"
  cp -R "$DEST" "$BACKUPS/hackathon-$stamp"
  echo "backed up previous install → $BACKUPS/hackathon-$stamp"
fi

mkdir -p "$DEST"
rsync -a --delete $DRY --itemize-changes "${EXCLUDES[@]}" "$SRC/" "$DEST/" | sed 's/^/  /' | tail -n 40

if [ -z "$DRY" ]; then
  chmod +x "$DEST"/arsenal/*/*.sh 2>/dev/null || true
  files=$(find "$DEST" -type f | wc -l | tr -d ' ')
  echo "installed $files files → $DEST"
  # Sanity: every relative link target in SKILL.md exists on disk.
  missing=0
  while IFS= read -r target; do
    [ -e "$DEST/$target" ] || { echo "  missing link target: $target"; missing=1; }
  # Image links belong to the README template embedded in SKILL.md, not to the skill.
  done < <(grep -oE '\]\(([a-z][a-z0-9_./-]+)\)' "$DEST/SKILL.md" | sed -E 's/^\]\((.*)\)$/\1/' \
           | grep -vE '\.(png|jpe?g|gif|svg|webp)$' | sort -u)
  [ "$missing" -eq 0 ] && echo "all SKILL.md link targets present" || { echo "some link targets are missing" >&2; exit 1; }
fi
