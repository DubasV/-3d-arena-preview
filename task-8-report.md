# Task 8 — local verification report

Final fix base: `9376239b8ea99f1d30567b10eef3167dd5318c95`.
Final fix implementation commit: `92a33143f2877d605df49d9f2d42b074efc3f6e7`.

## Final fix wave — 2026-08-08

### TDD evidence

- RED: the complete suite reported 22 passed, 8 failed, plus the expected missing exports for `getMorningSourceCode` and `getNewDisclosureGoals` before implementation.
- GREEN command: `/Users/vladimir/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/morning-page.test.mjs tests/morning-segment.test.mjs tests/morning-marketing.test.mjs`.
- GREEN result: exit code 0; 40 passed, 0 failed, 0 skipped, 0 todo.

### Final-review coverage

- Homepage and `/utro/` contain public Yandex Metrica ID `110895058`, VK Pixel ID `3781383`, the official async Metrica `tag.js` loader, init settings `clickmap`, `trackLinks`, `accurateTrackBounce`, `webvisor`, and noscript images. Tests assert IDs, config and loader order before page runtimes.
- `/utro/` maps the five paid segments to `UTRO-STUDENT`, `UTRO-SHIFT`, `UTRO-LOCAL`, `UTRO-COMP`, `UTRO-RETURN`; unknown or absent segment uses `UTRO-WEB`. The matrix now tells the administrator to copy the shown code exactly at registration or payment.
- `/utro/` links to the current Yandex Maps organization card without a fixed rating and states the confirmed address, metro and parking-behind-barrier call procedure.
- Homepage stylesheet cache key is `style.css?v=20260808-1`; changed morning CSS and JS use `20260808-2`.
- The named unverified or evaluative phrases are absent from `/utro/` and its runtime copy.
- Bonus conditions use `details`/`summary`; `morning_bonus_terms` is emitted only on the first open toggle.

### Static evidence

- `git diff --check`: no output, exit code 0.
- `rg -n "TBD|TODO|placeholder|example\\.com" utro assets/js/morning.js assets/css/morning.css marketing tests`: no matches.
- `rg -n -i "спокойное утро|максимальная плавность|пока в клубе спокойно|без компромиссов|мощные ПК" utro/index.html assets/js/morning.js`: no matches.
- Required brand, gallery and favicon files exist.

### Boundary

No server delivery, push, pull request, production publication, campaign, bid, budget or external-cabinet change was performed in this wave.

## Earlier Task 8 verification

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
- Final Pages-base QA served the repository under `/tmp/.../-3d-arena-preview` and opened `http://127.0.0.1:8766/-3d-arena-preview/?popup=0&utm_source=vk&utm_medium=cpc&utm_campaign=morning&utm_content=student`. At 390 px there was no overflow, no broken images and no console warnings/errors; the favicon resolved from the repository base path.
- Pages-base server logs returned 200 for the homepage, CSS, JavaScript, images and favicon, with no 404s. The teaser href was `/-3d-arena-preview/utro/?...student`; an actual click opened it, loaded the student lead and returned 200 for the landing CSS and JavaScript.

The earlier localhost-root favicon 404 was a false result caused by a server that did not emulate the GitHub Pages base path; Pages-base QA closes it.

## External boundary

No push, pull request, publication, campaign, bid, budget, production, or other external-system change was made.
