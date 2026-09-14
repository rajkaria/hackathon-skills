#!/usr/bin/env bash
# first-screen.sh: check what a screening judge actually reads before deciding.
#
# Origin: September 2026. Benchpress (Multi-App AI Agent Hackathon) and Hunch VPM
# (ETHOnline) were both called "the best entry" by Claude and neither advanced
# past screening. The brief asked for "one useful, multi-step AI agent"; the
# Benchpress README opened with 11 badges and called itself a "task-agnostic
# control loop" and a "reliability layer". The Hunch VPM hero said "A parimutuel
# that pays for being early" and "Stake vests the moment it lands". ETHGlobal's
# first round is an async screen (about the top 20% advance) and the one-day
# event judged every entry in 40 minutes. A screen that short is decided by the
# first sentences, so this lints exactly those sentences.
#
#   first-screen.sh --noun agent [--noun app] [--jargon FILE] [--words 80]
#                   [--max-jargon 2] [--max-badges 5] [--strict] [--quiet] paths...
#
# --noun        the thing the brief literally asks for ("agent", "app", "dApp",
#               "game"). Repeatable. Plurals match. Required: write it down at
#               hour 0 from the brief, verbatim.
# --jargon      file with project-internal terms, one per line, # comments ok.
#               Write it at spec time: every word the team invented or that only
#               specialists use (e.g. "vested parimutuel", "policy sweep").
#               A small built-in list from past events is always applied.
# --words       how many prose words count as the first screen (default 80,
#               roughly the first 20 seconds of reading).
#
# Rules (applied to the first N prose words of each file; badges, images, code
# fences, HTML tags and URLs are stripped first)
#   FAIL  brief-noun       none of the --noun words appear in the first screen
#   FAIL  jargon-density   more than --max-jargon distinct jargon terms
#   WARN  jargon:<term>    each jargon term found
#   WARN  meta-framing     the first screen describes a layer/scaffold/SDK/framework
#                          while the brief noun is something else (Benchpress)
#   WARN  badge-wall       more than --max-badges badges before the first prose
#   WARN  long-opener      first prose sentence longer than 25 words
#
# Output:  file: [FAIL|WARN] rule — detail, then the extracted first screen
#          (unless --quiet) so a human can read exactly what a judge reads.
# Exit:    1 if any FAIL (or any WARN with --strict), 0 otherwise, 2 on bad usage.
# Works on .md, .txt and .html. For a React hero, paste the rendered text into a
# .txt (or run it on the submission description file).
set -uo pipefail

NOUNS=""
JARGON_FILE=""
WORDS=80
MAX_JARGON=2
MAX_BADGES=5
STRICT=0
QUIET=0
PATHS=()

need_val() { [ $# -ge 2 ] && [ -n "$2" ] || { echo "first-screen: $1 needs a value" >&2; exit 2; }; }

while [ $# -gt 0 ]; do
  case "$1" in
    --noun) need_val "$@"; NOUNS="${NOUNS}${NOUNS:+|}$2"; shift 2 ;;
    --jargon) need_val "$@"; JARGON_FILE="$2"; shift 2 ;;
    --words) need_val "$@"; WORDS="$2"; shift 2 ;;
    --max-jargon) need_val "$@"; MAX_JARGON="$2"; shift 2 ;;
    --max-badges) need_val "$@"; MAX_BADGES="$2"; shift 2 ;;
    --strict) STRICT=1; shift ;;
    --quiet) QUIET=1; shift ;;
    -h|--help) sed -n '2,/^set -uo pipefail/p' "$0" | sed '$d' | sed 's/^# \{0,1\}//'; exit 0 ;;
    --*) echo "first-screen: unknown flag $1 (see --help)" >&2; exit 2 ;;
    *) PATHS+=("$1"); shift ;;
  esac
done

for n in "$WORDS" "$MAX_JARGON" "$MAX_BADGES"; do
  case "$n" in ''|*[!0-9]*) echo "first-screen: numeric flags need a whole number (got '$n')" >&2; exit 2 ;; esac
done
[ -n "$NOUNS" ] || { echo "first-screen: --noun is required (the word the brief uses for what to build)" >&2; exit 2; }
[ ${#PATHS[@]} -gt 0 ] || { echo "first-screen: name at least one file (README.md, submission.txt, hero.txt)" >&2; exit 2; }
if [ -n "$JARGON_FILE" ] && [ ! -f "$JARGON_FILE" ]; then
  echo "first-screen: jargon file not found: $JARGON_FILE" >&2; exit 2
fi

# Built-in jargon: terms that cost a screening judge real seconds in past events.
BUILTIN_JARGON="parimutuel|vested|vests|vesting|opposing books|control loop|policy sweep|protected set|mutation gate|read-back|deny-list|candidate enumeration|task-agnostic|grader-faithful|twins|substrate|ablation|ablations|trustless|permissionless|composable|primitive|primitives|orchestration|idempotent|attestation|bonding curve|restaking"
# Meta-framing: describing a tool for builders instead of the thing itself.
META_TERMS="layer|scaffold|framework|sdk|middleware|infrastructure|infra|toolkit|harness|control loop|wrapper|wrap around|plumbing|protocol"

JARGON="$BUILTIN_JARGON"
if [ -n "$JARGON_FILE" ]; then
  while IFS= read -r t || [ -n "$t" ]; do
    t="${t%%#*}"
    t="$(printf '%s' "$t" | sed 's/^[[:space:]]*//; s/[[:space:]]*$//')"
    [ -n "$t" ] && JARGON="$JARGON|$t"
  done < "$JARGON_FILE"
fi

fails=0; warns=0; files=0
for f in "${PATHS[@]}"; do
  if [ ! -f "$f" ]; then echo "first-screen: not a file: $f" >&2; exit 2; fi
  files=$((files + 1))
  out="$(LC_ALL=C awk -v limit="$WORDS" -v nouns="$NOUNS" -v jargon="$JARGON" -v meta="$META_TERMS" \
        -v maxj="$MAX_JARGON" -v maxb="$MAX_BADGES" '
    function norm(s) { s = tolower(s); gsub(/[^a-z0-9]+/, " ", s); return " " s " " }
    function has(hay, term,   t) {
      t = norm(term); sub(/^ /, "", t); sub(/ $/, "", t)
      if (t == "") return 0
      return index(hay, " " t " ") || index(hay, " " t "s ") || index(hay, " " t "es ")
    }
    {
      line = $0
      if (line ~ /^[[:space:]]*(```|~~~)/) { infence = !infence; next }
      if (infence || done) next
      if (line ~ /^[[:space:]]*(---|\*\*\*)[[:space:]]*$/) next
      if (!started) {
        tmp = line; badges += gsub(/img\.shields\.io|badge\.svg/, "", tmp)
      }
      heading = (line ~ /^[[:space:]]*#/)
      gsub(/<!--.*-->/, " ", line)
      gsub(/!\[[^]]*\]\([^)]*\)/, " ", line)
      while (match(line, /\[[^]]*\]\([^)]*\)/)) {
        seg = substr(line, RSTART, RLENGTH); sub(/^\[/, "", seg); sub(/\]\(.*$/, "", seg)
        line = substr(line, 1, RSTART - 1) seg substr(line, RSTART + RLENGTH)
      }
      gsub(/<[^>]*>/, " ", line)
      gsub(/https?:\/\/[^ )"]*/, " ", line)
      gsub(/&[a-z]+;/, " ", line)
      gsub(/[`*_>#|{}]/, " ", line)
      n = split(line, w, /[[:space:]]+/)
      got = 0
      for (i = 1; i <= n; i++) {
        if (w[i] == "") continue
        if (count >= limit) { done = 1; break }
        text = text (text == "" ? "" : " ") w[i]; count++; got++
      }
      if (got > 0) {
        if (!heading) started = 1
        if (!heading && opener == "" && got >= 5) {
          s = line; gsub(/^[[:space:]]+/, "", s)
          if (match(s, /[.!?]([[:space:]]|$)/)) s = substr(s, 1, RSTART)
          opener = s
        }
        if (heading) text = text " /"
      }
    }
    END {
      hay = norm(text)
      k = split(nouns, ns, "|"); found = 0; nounmeta = 0
      for (i = 1; i <= k; i++) {
        if (has(hay, ns[i])) found = 1
        if (has(norm(meta), ns[i])) nounmeta = 1
      }
      if (!found) printf "FAIL\tbrief-noun\tnone of [%s] in the first %d words; a judge cannot tell this is the thing the brief asked for\n", nouns, count
      k = split(jargon, js, "|"); nj = 0; seen = ""
      for (i = 1; i <= k; i++) {
        key = norm(js[i])
        if (js[i] != "" && index(seen, "|" key "|") == 0 && has(hay, js[i])) {
          seen = seen "|" key "|"; nj++
          printf "WARN\tjargon:%s\tdefine it in plain words or move it below the first screen\n", js[i]
        }
      }
      if (nj > maxj) printf "FAIL\tjargon-density\t%d distinct jargon terms in the first screen (max %d)\n", nj, maxj
      if (!nounmeta) {
        k = split(meta, ms, "|"); hits = ""
        for (i = 1; i <= k; i++) if (has(hay, ms[i])) hits = hits (hits == "" ? "" : ", ") ms[i]
        if (hits != "") printf "WARN\tmeta-framing\tfirst screen pitches a %s; the brief asks for [%s]. Lead with what it does for a user\n", hits, nouns
      }
      if (badges > maxb) printf "WARN\tbadge-wall\t%d badges before the first sentence (max %d)\n", badges, maxb
      m = split(opener, ow, /[[:space:]]+/)
      if (m > 25) printf "WARN\tlong-opener\tfirst sentence is %d words (max 25)\n", m
      if (text == "") printf "FAIL\tbrief-noun\tno prose found\n"
      printf "SCREEN\t%d\t%s\n", count, text
    }' "$f")"

  while IFS="$(printf '\t')" read -r level rule detail; do
    case "$level" in
      FAIL) echo "$f: [FAIL] $rule — $detail"; fails=$((fails + 1)) ;;
      WARN) echo "$f: [WARN] $rule — $detail"; warns=$((warns + 1)) ;;
      SCREEN) [ "$QUIET" = 1 ] || echo "$f: first screen ($rule words): \"$detail\"" ;;
    esac
  done <<EOF
$out
EOF
done

echo "first-screen: $files file(s), $fails FAIL, $warns WARN"
if [ "$fails" -gt 0 ] || { [ "$STRICT" = 1 ] && [ "$warns" -gt 0 ]; }; then exit 1; fi
exit 0
