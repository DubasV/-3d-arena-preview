# Task 8 — local verification report

Base commit: `f09179273727a3d35d3c8a743805c0f015fea7bd`.
Final verified HEAD: `21cbceb8a57bb261b6b6d5d59d507bc002ff4142`.

## Automated suite

Command:

```sh
/Users/vladimir/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/morning-page.test.mjs tests/morning-segment.test.mjs tests/morning-marketing.test.mjs
```

Result: exit code 0; 32 passed, 0 failed, 0 skipped, 0 todo.

## Static checks

- `rg -n "TBD|TODO|placeholder|example\\.com" utro assets/js/morning.js assets/css/morning.css marketing tests`: no matches (exit code 1, the expected `rg` status for no matches).
- Required files exist: `assets/brand/mark.svg`, `images/gallery/hall-01.jpg`, `images/gallery/hall-15.jpg`, `favicon.ico` (exit code 0).
- `git diff --check`: no output; exit code 0.

## Browser QA

Controller verification completed against the final HEAD.

- At 390×844, all five explicit segments changed only the lead text; the H1, prices and registration disclosure stayed unchanged. `scrollWidth` and `innerWidth` were both 390. There were no broken images or console warnings/errors.
- Primary LANGAME links preserved the exact segment UTM values. Phone and Telegram destinations were correct.
- Runtime competitor copy initially contained unverified claims; this was removed in `510c480`. A stale cache key was then corrected in `21cbceb`; the browser loaded `morning.js?v=20260808-1`. The final competitor copy contains only the 300 Hz, 2K, 5 h and 540 facts.
- At 1440×900, DOM layout width was 1440 with no horizontal overflow; prices and registration disclosure were correct; there were no errors or broken images.
- The homepage teaser is outside `#prices`, has one analytics owner, preserves allowlisted UTM parameters, and an actual click opened `/utro/` with the student segment when the popup was disabled.
- Server logs for `/utro/` resources returned 200/304, with no landing-page 404s.

Known local-server limitation: the root homepage requested repository-prefixed favicon paths that returned 404 because localhost did not emulate the GitHub Pages base path. This is existing preview behavior, not a `/utro/` landing regression.

## External boundary

No push, pull request, publication, campaign, bid, budget, production, or other external-system change was made.
