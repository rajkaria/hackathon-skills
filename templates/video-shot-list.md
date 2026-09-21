# Demo Video Shot List: [Project Name]

> Draft this at G5 (about 25% into the event), not at T-4h. The shot list decides what the product has to show, so writing it early keeps the build honest. Record at G10. Store the script in `<project>-internal/video/`; it's not a public-repo file.
>
> Built from what worked: the Benchpress `DEMO-SCRIPT.md` (≤ 2:00, a shot list with exact lines, "never round up") and the Hunch VPM `VIDEO-SCRIPT.md` (3:35, 8 beats, "three things to land", "do not show"). Built against what failed: Humanline had no video at the end of the transcripts, VPM's script came at T-4h, and Benchpress asked "which screen should I open… answer fast" at T-80m. At the Casper final, Hunch's video was unscripted, spent 0:00–0:40 on a different product (Hunch Cup, paper money) and went up 3.5 hours after the form was submitted. Faktura, which placed 1st, uploaded six days early: user pain at 0:00, a contract refusing an AI-approved invoice at 0:45.

---

## Constraints

- **Max length (from event contract):** ___ · **Target:** ___ (aim 10–15% under the max)
- **Voice pace:** ~150–155 words/min → **word budget:** ___
- **Rubric weight carried by the video:** Demo ___% + (Usefulness/Originality it must also carry) ___%
- **Recorded against:** live deployment `<url>` at build `<sha>` on `<network>`, with real transactions

## The first 20 seconds (a screener may stop here)

- [ ] Says the brief's noun and names the user: "<Name> is an <noun> that <does what> for <user>"
- [ ] No coined term before it's shown (Hunch VPM opened "Every parimutuel pool has one flaw…" over a four-statistic card)
- [ ] The proof moment starts before 0:45
- [ ] About *this entry* only: no other product, other chain or earlier event before 1:00
- [ ] Every sentence is scripted; the recording follows the script (an ad-libbed take is a draft)
- [ ] The transcript's first 60 words pass `arsenal/copy/first-screen.sh --noun <noun> --words 60`

## The three things the video has to land

1. **The insight / mechanism**, in one sentence a judge will repeat: ___
2. **It is real, now:** the proof moment (a tx on camera, a grader result, a live metric): ___
3. **Why it matters / who needs it:** ___

Everything that doesn't serve one of these three is cut.

## Do not show

- Architecture diagrams longer than 3s, formulas, comparison tables with more than 3 rows
- Loading spinners, wallet modals (connect before recording, or cut the modal out)
- Anything not backed by a number in `FACTS.md` / `reports/`
- Features that aren't in the golden path

## Before you record

- [ ] 1920×1080, 30 fps; browser at 125% zoom, bookmarks bar hidden, notifications off (Do Not Disturb)
- [ ] Terminal: 18 pt, dark theme, short prompt (`❯`), history cleared
- [ ] Tabs open **in shot order**: 1) ___ 2) ___ 3) ___ 4) ___
- [ ] Wallet connected, funded, on the right network; approvals pre-granted where honest
- [ ] Live state checked: markets open, leaderboards populated, health 200, no expired items
- [ ] Re-seed/reset command ready if a take fails: `___`
- [ ] Captions burned in for every number (judges may watch muted)
- [ ] B-roll cards pre-rendered (title, numbers card, results card, URL card)

## Shot list

| # | t (start–end) | Screen (exact tab/page/element) | Say (exact words) | Cut | Evidence for any number |
|---|---|---|---|---|---|
| 1 | 0:00–0:10 | Cold open: the painful before-state | | hard cut | |
| 2 | | Problem in one sentence / numbers card | | | |
| 3 | | Product name + one-liner card (≤ 4s) | | | |
| 4 | | Primary action on the live product | | continuous take | tx hash |
| 5 | | Proof moment (explorer / grader / metric) | | ≤ 4s on explorer | |
| 6 | | Differentiator (what nobody else can show) | | | |
| 7 | | Honest limit / disclosure lower-third | | | |
| 8 | | Close: URL, repo, install command, one-line takeaway | | | |

## Recording cues (read while recording)

- Hold the mouse still while talking; move only on the action.
- Say the line, *then* cut. Don't narrate while typing.
- Keep a disclosure lower-third on screen for the whole proof shot.
- Pre-scroll every page to the frame you need.

## Rules for the cut

1. **Never round up.** If a shot's number isn't in `FACTS.md` / `reports/`, cut the shot.
2. **Name the comparator precisely** (e.g. "unmodified grader on local copies of the apps", never "passed the benchmark").
3. **Keep the disclosed failure** in the results card. Judges reward it.
4. Upload as **unlisted/public** (never private), test the link from an incognito window, paste it into README + form + FACTS.md.
5. **Upload before the form goes in**, never after it. Title it with the one-liner rather than "demo". The YouTube description carries the live URL, repo, contract hash and chapters, as Faktura's did.

## 60-second cut (for pitch variants / social)

Beats 1 → 4 → 5 → 8, ≤ 150 words.

## Fallback

If live recording fails at G10: record the golden-path screen capture from G4 with voice-over, rather than a TTS or slide-only video. Benchpress's TTS fallback was built and never used.
