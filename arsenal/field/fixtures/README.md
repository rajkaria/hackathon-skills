# Fixtures

Every file here is a trimmed copy of a live DoraHacks response, captured on 2026-09-16 with the
same user-agent `dorahacks-field.ts` sends. None are hand-written (SKILL.md Build Gates: probe
before mocking).

| File | Captured from | Trimmed how |
|---|---|---|
| `hackathons-search-casper.json` | `GET /api/v1/hub/hackathons?page=1&page_size=50&search=casper` | Re-indented only |
| `hackathon-2316-detail.html` | `GET /hackathon/casper-agentic-buildathon-finals/detail` | Only the `__NUXT_DATA__` script is kept |
| `buidl-46441.html` | `GET /buidl/46441` (Faktura, 1st place) | Only the `__NUXT_DATA__` script is kept |
| `winners-2316.json` | `GET /api/v1/hub/hackathon-winner-assignments?hackathon=casper-agentic-buildathon-finals` | Unchanged |
| `buidls-2316-page1.json`, `buidls-2316-page2.json` | `GET /api/v1/hub/hackathons/2316/buidls?page=1&page_size=50` | The first four public submissions and the private one (46801) from that live page, split into two pages with `count: 5`. The `next` links keep the live shape, which drops `/api/v1` |

Added 2026-09-21 for `render-check` (BUIDL CTC 2026 Fall, `retro/2026-09-21-buidl-ctc-final-results.md`):

| File | Captured from | Trimmed how |
|---|---|---|
| `buidl-48709.html` | `GET /buidl/48709` (Humanline Credit, not placed), 2026-09-21 | Only the `__NUXT_DATA__` script is kept. Its description is what judges read: 0 tables, 0 images, 4 "Show Image" placeholders |
| `source-48709-at-submit.md` | `docs/BUIDL_DETAILS.md` at humanline `0c5a101` (2026-09-14 00:18 UTC), the last version before the 00:25 UTC submission | Unchanged. 7 tables, 5 images |
| `source-48709-final.md` | The same file at `3af7046` (00:42 UTC), after the last DoraHacks edit at 00:27 UTC | Unchanged. Adds "What personhood does not solve", which never reached the page |

To refresh after DoraHacks changes shape: run `bun dorahacks-field.ts pull <uname> --out /tmp/x`
against the live site, compare it with these files, and re-capture the ones that differ.
