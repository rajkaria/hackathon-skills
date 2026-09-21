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

To refresh after DoraHacks changes shape: run `bun dorahacks-field.ts pull <uname> --out /tmp/x`
against the live site, compare it with these files, and re-capture the ones that differ.
