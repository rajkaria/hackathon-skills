#!/usr/bin/env bash
# voice-lint.sh: flag the tells that make copy read as AI-written.
#
# Origin: humanline (September 2026) spent two extra sessions at the deadline to
# "remove em dashes, make the copy more humane and not ai voice". The benchpress
# outreach DM had the same note: it "shouldn't look like ai generated". Both
# were caught by a human reading at the last minute. This catches them at the
# first draft.
#
#   voice-lint.sh [--strict] [--no-suggest] [paths...]
#
# Default paths: README.md docs site app web/app src/app (missing ones skipped).
# Scans *.md *.mdx *.tsx *.jsx *.html *.txt, skipping node_modules .next dist
# build out .git .vercel .turbo. Explicitly named files are always scanned.
#
# Rules
#   FAIL  em-dash          any "—"
#   WARN  en-dash          " – " used as a dash (ranges like 5–10 are fine)
#   WARN  phrase:<word>    hype words and stock AI phrasing (list below)
#   WARN  emoji-overuse    more than 3 rockets in one file
#
# Skipped automatically: fenced code blocks in Markdown, comment lines in
# .tsx/.jsx, HTML comment lines, and any line containing "voice-lint-ignore".
# Paths (or globs) listed in .voice-lint-ignore are skipped entirely.
#
# Output:  file:line: [FAIL|WARN] rule — snippet
# Exit:    1 if any FAIL (or any WARN with --strict), 0 otherwise, 2 on bad usage.
# It never edits files. For em dashes it prints a rewrite to consider, because
# a blind " — " to ", " swap changes meaning more often than it fixes it.
set -uo pipefail

STRICT=0
SUGGEST=1
PATHS=()
for arg in "$@"; do
  case "$arg" in
    --strict) STRICT=1 ;;
    --no-suggest) SUGGEST=0 ;;
    -h|--help) sed -n '2,/^set -uo pipefail/p' "$0" | sed '$d' | sed 's/^# \{0,1\}//'; exit 0 ;;
    --fix-dashes) echo "voice-lint: --fix-dashes is deliberately not supported; rewrite by hand using the suggestions" >&2; exit 2 ;;
    --*) echo "voice-lint: unknown flag $arg (see --help)" >&2; exit 2 ;;
    *) PATHS+=("$arg") ;;
  esac
done

EXPLICIT=1
if [ ${#PATHS[@]} -eq 0 ]; then
  EXPLICIT=0
  PATHS=(README.md docs site app web/app src/app)
fi

LIST="$(mktemp -t voice-lint.XXXXXX)"
trap 'rm -f "$LIST" "$LIST.sorted"' EXIT

IGNORE_FILE="${VOICE_LINT_IGNORE:-.voice-lint-ignore}"
IGNORES=()
if [ -f "$IGNORE_FILE" ]; then
  while IFS= read -r pat || [ -n "$pat" ]; do
    pat="${pat%%#*}"
    pat="$(printf '%s' "$pat" | sed 's/^[[:space:]]*//; s/[[:space:]]*$//; s#^\./##; s#/$##')"
    [ -n "$pat" ] && IGNORES+=("$pat")
  done < "$IGNORE_FILE"
fi

is_ignored() {
  local f="${1#./}" pat
  for pat in ${IGNORES[@]+"${IGNORES[@]}"}; do
    # Unquoted $pat on purpose: entries may be globs like docs/drafts/*.md.
    # shellcheck disable=SC2254
    case "$f" in $pat|$pat/*) return 0 ;; esac
  done
  return 1
}

MISSING=0
for p in "${PATHS[@]}"; do
  if [ -f "$p" ]; then
    printf '%s\n' "$p" >> "$LIST"
  elif [ -d "$p" ]; then
    find "$p" \( -name node_modules -o -name .next -o -name dist -o -name build -o -name out \
                 -o -name .git -o -name .vercel -o -name .turbo \) -prune -o -type f \
              \( -name '*.md' -o -name '*.mdx' -o -name '*.tsx' -o -name '*.jsx' \
                 -o -name '*.html' -o -name '*.txt' \) -print >> "$LIST"
  elif [ "$EXPLICIT" = 1 ]; then
    echo "voice-lint: no such file or directory: $p" >&2
    MISSING=$((MISSING + 1))
  fi
done

sort -u "$LIST" > "$LIST.sorted"
: > "$LIST"
FILE_COUNT=0
while IFS= read -r f; do
  is_ignored "$f" && continue
  printf '%s\n' "$f" >> "$LIST"
  FILE_COUNT=$((FILE_COUNT + 1))
done < "$LIST.sorted"

if [ "$FILE_COUNT" -eq 0 ]; then
  echo "voice-lint: no files to lint"
  [ "$MISSING" -gt 0 ] && exit 2
  exit 0
fi

OUTPUT="$(LC_ALL=C awk -v listfile="$LIST" -v suggest="$SUGGEST" '
function trim(s) { sub(/^[ \t]+/, "", s); sub(/[ \t\r]+$/, "", s); return s }
function iscont(c) { return c >= "\200" && c < "\300" }
# A readable window of at most ~110 bytes around byte position pos, never
# cutting a UTF-8 character in half.
function snippet(s, pos,    start, end, n) {
  s = trim(s); n = length(s)
  if (n <= 110) return s
  start = pos - 40; if (start < 1) start = 1
  end = start + 109; if (end > n) { end = n; start = n - 109; if (start < 1) start = 1 }
  while (start > 1 && iscont(substr(s, start, 1))) start++
  while (end < n && iscont(substr(s, end + 1, 1))) end--
  return (start > 1 ? "..." : "") substr(s, start, end - start + 1) (end < n ? "..." : "")
}
function upfirst(s) { return toupper(substr(s, 1, 1)) substr(s, 2) }
function report(file, lineno, level, rule, text, pos) {
  printf "%s:%d: [%s] %s — %s\n", file, lineno, level, rule, snippet(text, pos)
}
function dash_suggestion(line,    t, a, b, left, mid, right, rest) {
  t = trim(line)
  a = index(t, EM)
  left = trim(substr(t, 1, a - 1))
  rest = substr(t, a + length(EM))
  b = index(rest, EM)
  if (b > 0) {
    mid = trim(substr(rest, 1, b - 1)); right = trim(substr(rest, b + length(EM)))
    if (left != "" && mid != "")
      return "try parentheses: \"" left " (" mid ")" (right != "" ? " " right : "") "\""
  }
  right = trim(rest)
  if (left == "") return "try dropping the dash, or start the line with the words"
  if (right == "") return "try ending the sentence with a period"
  if (substr(left, length(left), 1) ~ /[.!?:]/) return "try deleting the dash"
  return "try two sentences: \"" left ". " upfirst(right) "\" or a colon: \"" left ": " right "\""
}
BEGIN {
  EM = "\342\200\224"; EN = " \342\200\223 "; ROCKET = "\360\237\232\200"; APOS = "(\047|\342\200\231)"
  # [^a-z] word boundaries on the lowercased line. Order is output order.
  np = 0
  P[++np] = "delve";              R[np] = "(^|[^a-z])delv(e|es|ed|ing)([^a-z]|$)"
  P[++np] = "seamless";           R[np] = "(^|[^a-z])seamless(ly)?([^a-z]|$)"
  P[++np] = "leverage";           R[np] = "(^|[^a-z])leverag(e|es|ed|ing)([^a-z]|$)"
  P[++np] = "robust";             R[np] = "(^|[^a-z])robust(ly|ness)?([^a-z]|$)"
  P[++np] = "cutting-edge";       R[np] = "cutting[- ]edge"
  P[++np] = "game-changer";       R[np] = "game[- ]chang(er|ers|ing)"
  P[++np] = "revolutionize";      R[np] = "(^|[^a-z])revolutioni[sz](e|es|ed|ing)([^a-z]|$)"
  P[++np] = "unlock";             R[np] = "(^|[^a-z])unlock(s|ed|ing)?([^a-z]|$)"
  P[++np] = "empower";            R[np] = "(^|[^a-z])empower(s|ed|ing|ment)?([^a-z]|$)"
  P[++np] = "elevate";            R[np] = "(^|[^a-z])elevat(e|es|ed|ing)([^a-z]|$)"
  P[++np] = "supercharge";        R[np] = "(^|[^a-z])supercharg(e|es|ed|ing)([^a-z]|$)"
  P[++np] = "harness the power";  R[np] = "harness(es|ing)? the power"
  P[++np] = "in today" "\047" "s"; R[np] = "(^|[^a-z])in today" APOS "s"
  P[++np] = "fast-paced";         R[np] = "fast[- ]paced"
  P[++np] = "ever-evolving";      R[np] = "ever[- ]evolving"
  P[++np] = "landscape";          R[np] = "(^|[^a-z])landscapes?([^a-z:]|$)"
  P[++np] = "tapestry";           R[np] = "(^|[^a-z])tapestr(y|ies)([^a-z]|$)"
  P[++np] = "testament to";       R[np] = "testament to"
  P[++np] = "it" "\047" "s not just"; R[np] = "(^|[^a-z])(it" APOS "s|it is) not just"
  P[++np] = "not only ... but also"; R[np] = "not only .*but also"
  P[++np] = "whether you" "\047" "re"; R[np] = "(^|[^a-z])whether you" APOS "re"
  P[++np] = "say goodbye to";     R[np] = "say goodbye to"
  P[++np] = "look no further";    R[np] = "look no further"
  P[++np] = "at the end of the day"; R[np] = "at the end of the day"
  P[++np] = "in conclusion";      R[np] = "(^|[^a-z])in conclusion"

  while ((getline file < listfile) > 0) {
    ext = tolower(file); sub(/^.*\./, "", ext)
    markdown = (ext == "md" || ext == "mdx")
    code = (ext == "tsx" || ext == "jsx")
    fence = 0; rockets = 0; lineno = 0
    while ((getline line < file) > 0) {
      lineno++
      t = trim(line)
      if (markdown && t ~ /^(```|~~~)/) { fence = !fence; continue }
      if (fence) continue
      if (code && (t ~ /^\/\// || t ~ /^\/?\*/ || t ~ /^\{\/\*/)) continue
      if (t ~ /^<!--/) continue
      if (index(line, "voice-lint-ignore")) continue

      if ((p = index(line, EM)) > 0) {
        report(file, lineno, "FAIL", "em-dash", line, p)
        if (suggest == 1) printf "    %s\n", dash_suggestion(line)
      }
      if ((p = index(line, EN)) > 0) report(file, lineno, "WARN", "en-dash", line, p)

      lc = tolower(line)
      for (i = 1; i <= np; i++)
        if (match(lc, R[i])) report(file, lineno, "WARN", "phrase:" P[i], line, RSTART)

      tmp = line; n = gsub(ROCKET, "", tmp)
      if (n > 0) {
        before = rockets; rockets += n
        if (before <= 3 && rockets > 3)
          report(file, lineno, "WARN", "emoji-overuse", "rocket #" rockets " in this file (max 3): " line, 1)
      }
    }
    close(file)
  }
}')"

[ -n "$OUTPUT" ] && printf '%s\n' "$OUTPUT"
FAILS="$(printf '%s\n' "$OUTPUT" | grep -c '^[^ ].*: \[FAIL\] ' || true)"
WARNS="$(printf '%s\n' "$OUTPUT" | grep -c '^[^ ].*: \[WARN\] ' || true)"
printf 'voice-lint: %d file(s), %d FAIL, %d WARN\n' "$FILE_COUNT" "$FAILS" "$WARNS"

[ "$FAILS" -gt 0 ] && exit 1
[ "$STRICT" = 1 ] && [ "$WARNS" -gt 0 ] && exit 1
[ "$MISSING" -gt 0 ] && exit 2
exit 0
