# Task 8 — local verification report

Base commit: `f09179273727a3d35d3c8a743805c0f015fea7bd`.

## Automated suite

Command:

```sh
/Users/vladimir/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/morning-page.test.mjs tests/morning-segment.test.mjs tests/morning-marketing.test.mjs
```

Result: exit code 0; 30 passed, 0 failed, 0 skipped, 0 todo.

## Static checks

- `rg -n "TBD|TODO|placeholder|example\\.com" utro assets/js/morning.js assets/css/morning.css marketing tests`: no matches (exit code 1, the expected `rg` status for no matches).
- Required files exist: `assets/brand/mark.svg`, `images/gallery/hall-01.jpg`, `images/gallery/hall-15.jpg`, `favicon.ico` (exit code 0).
- `git diff --check`: no output; exit code 0.

## Browser QA

Not claimed in this report. Controller-led browser QA was outside this local-only work; no browser evidence was supplied to record here.

Open items:

- Check `/utro/` at 390×844 and 1440×900 for horizontal scrolling and readable prices.
- Check CTA destinations, registration disclosure, segment lead-text switching, homepage `/utro/` link, clean console and no CSS/JS/image/favicon 404s.

## External boundary

No push, pull request, publication, campaign, bid, budget, production, or other external-system change was made.
