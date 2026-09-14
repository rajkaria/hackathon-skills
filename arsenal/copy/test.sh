#!/usr/bin/env bash
# test.sh: tests for arsenal/copy/first-screen.sh, run in a throwaway dir under $TMPDIR.
#
#   bash test.sh          # PASS/FAIL per case, exit 1 on any FAIL
#   KEEP=1 bash test.sh   # keep the scratch dir
#
# Fixtures are the real first screens that did not advance in September 2026
# (Benchpress one-liner and site hero, Hunch VPM site hero), plus clean rewrites.
export LC_ALL=C
HERE=$(cd "$(dirname "$0")" && pwd -P)
LINT="$HERE/first-screen.sh"
ROOT=$(mktemp -d "${TMPDIR:-/tmp}/first-screen-test.XXXXXX") || { echo "mktemp failed" >&2; exit 99; }
cleanup() { if [ -n "${KEEP:-}" ]; then echo "kept: $ROOT"; else rm -rf "$ROOT"; fi; }
trap cleanup EXIT
cd "$ROOT" || exit 99

pass=0; fail=0
check() { # check <name> <expected-exit> <grep-pattern or -> <cmd...>
  local name="$1" want="$2" pat="$3"; shift 3
  local out code
  out=$("$@" 2>&1); code=$?
  if [ "$code" != "$want" ]; then
    echo "FAIL $name: exit $code, want $want"; echo "$out" | sed 's/^/    /'; fail=$((fail + 1)); return
  fi
  if [ "$pat" != "-" ] && ! printf '%s\n' "$out" | grep -q -- "$pat"; then
    echo "FAIL $name: output missing /$pat/"; echo "$out" | sed 's/^/    /'; fail=$((fail + 1)); return
  fi
  echo "PASS $name"; pass=$((pass + 1))
}
refute() { # refute <name> <grep-pattern> <cmd...>
  local name="$1" pat="$2"; shift 2
  local out; out=$("$@" 2>&1)
  if printf '%s\n' "$out" | grep -q -- "$pat"; then
    echo "FAIL $name: output unexpectedly has /$pat/"; echo "$out" | sed 's/^/    /'; fail=$((fail + 1)); return
  fi
  echo "PASS $name"; pass=$((pass + 1))
}

cat > vpm-hero.txt <<'EOF'
Back your hunch.
A parimutuel that pays for being early instead of pretending timing never happened.
Stake vests the moment it lands, into the opposing books.
EOF

cat > bp-oneliner.md <<'EOF'
# Benchpress

Benchpress: the reliability layer for AI agents with write access. Same model, different loop: it reads the rules first, locks look-alike records in code, reads back every write, and proves it with the benchmark judges' own grader.
EOF

cat > bp-hero.txt <<'EOF'
Agents can write to your billing system now. Benchpress checks their work.
A small, strict loop you wrap around any tool-using model.
EOF

cat > clean.md <<'EOF'
# Renewal Rescue

[![ci](https://img.shields.io/badge/ci-green.svg)](https://example.com)

Renewal Rescue is an AI agent for customer success managers. When a renewal is at risk it reads the account in HubSpot, checks usage in Stripe, drafts the save email in Gmail and posts the plan to Slack for the owner to approve.
EOF

{
  echo '# Wall'
  for i in 1 2 3 4 5 6 7; do echo "![b$i](https://img.shields.io/badge/b$i-x-blue.svg)"; done
  echo
  echo 'Our agent books meetings for recruiters across Gmail, Calendar and Greenhouse without double-booking anyone.'
} > badges.md

cat > long.md <<'EOF'
This agent is a system that coordinates a large number of steps across many different applications in order to make sure that every single action it takes is checked twice before anything happens.
EOF

cat > fenced.md <<'EOF'
```
agent agent agent
```
We made a tool that tidies spreadsheets.
EOF

printf 'policy sweep\n# invented at spec time\nreceipt chain\n' > jargon.txt
cat > custom.md <<'EOF'
Our agent runs a policy sweep and writes a receipt chain for every step it takes.
EOF

printf 'The agent helps.\n' > tiny.md

cat > plural.md <<'EOF'
Three agents that file your expenses from Gmail receipts into Ramp and ping you on Slack.
EOF

# --- real September 2026 first screens ---------------------------------------------------
check "vpm hero fails brief-noun"       1 "\[FAIL\] brief-noun"  bash "$LINT" --noun "prediction market" --noun app vpm-hero.txt
check "vpm hero flags parimutuel"       1 "jargon:parimutuel"    bash "$LINT" --noun "prediction market" vpm-hero.txt
check "vpm hero flags vests"            1 "jargon:vests"         bash "$LINT" --noun "prediction market" vpm-hero.txt
check "vpm hero jargon-density"         1 "jargon-density"       bash "$LINT" --noun "prediction market" vpm-hero.txt
check "bp one-liner meta-framing"       0 "meta-framing"         bash "$LINT" --noun agent bp-oneliner.md
check "bp one-liner strict fails"       1 "meta-framing"         bash "$LINT" --noun agent --strict bp-oneliner.md
check "bp hero wrap around"             0 "wrap around"          bash "$LINT" --noun agent bp-hero.txt
# --- rules ------------------------------------------------------------------------------
check "clean passes strict"             0 "0 FAIL, 0 WARN"       bash "$LINT" --noun agent --strict clean.md
check "badge wall"                      0 "badge-wall — 7 badges" bash "$LINT" --noun agent badges.md
check "max-badges override"             0 "0 WARN"               bash "$LINT" --noun agent --max-badges 7 badges.md
check "long opener"                     0 "long-opener"          bash "$LINT" --noun agent long.md
check "fenced code ignored"             1 "\[FAIL\] brief-noun"  bash "$LINT" --noun agent fenced.md
check "custom jargon file"              0 "jargon:receipt chain" bash "$LINT" --noun agent --jargon jargon.txt custom.md
check "custom jargon max-jargon 1"      1 "jargon-density"       bash "$LINT" --noun agent --jargon jargon.txt --max-jargon 1 custom.md
check "plural noun matches"             0 "0 FAIL"               bash "$LINT" --noun agent plural.md
check "words limit cuts screen"         1 "\[FAIL\] brief-noun"  bash "$LINT" --noun "customer success" --words 5 clean.md
check "noun that is itself meta"        0 "0 WARN"               bash "$LINT" --noun sdk --noun layer --strict bp-oneliner.md
check "quiet hides screen"              0 "-"                    bash "$LINT" --noun agent --quiet tiny.md
refute "quiet has no screen line"       "first screen ("         bash "$LINT" --noun agent --quiet tiny.md
check "screen shown by default"         0 "first screen ("       bash "$LINT" --noun agent tiny.md
check "bash 3.2 portable"               1 "\[FAIL\] brief-noun"  /bin/bash "$LINT" --noun "prediction market" vpm-hero.txt
# --- usage -------------------------------------------------------------------------------
check "missing --noun"                  2 "--noun is required"   bash "$LINT" clean.md
check "missing path"                    2 "at least one file"    bash "$LINT" --noun agent
check "not a file"                      2 "not a file"           bash "$LINT" --noun agent nope.md
check "bad number"                      2 "whole number"         bash "$LINT" --noun agent --words ten clean.md
check "unknown flag"                    2 "unknown flag"         bash "$LINT" --noun agent --fix clean.md
check "missing jargon file"             2 "jargon file not found" bash "$LINT" --noun agent --jargon none.txt clean.md
check "help"                            0 "screening judge"      bash "$LINT" --help

echo "first-screen tests: $pass passed, $fail failed"
[ "$fail" -eq 0 ]
