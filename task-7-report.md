# Task 7 report

Base commit: `1365713ba56578e60e51e4bf97a4f94626aa5100`.

Created `marketing/morning-creative-briefs.md` with ten production briefs: two for each segment from the campaign matrix. Each brief specifies format, real gallery image, headline, support line, CTA, logo placement, ornament rule, description and forbidden claims. The document is explicitly a production brief and does not authorize external action.

The supplied draft contained two unsupported atmosphere claims. They were not used: Creative 4 uses `300 ГЦ ИЛИ 2K`; Creative 8 uses `300 ГЦ. 2K.`. This matches the verified product claims in the current matrix and landing pages.

Added the creative-count and source-image contract tests to `tests/morning-marketing.test.mjs`.

Verification:

- Visually inspected `hall-01.jpg`, `hall-15.jpg` and `hall-12.jpg`; their crops are suitable respectively for horizontal gaming-hall layouts and a vertical PS5 layout.
- Structural check passed: 10 numbered briefs, 10 gallery-image references, 10 CTAs, every referenced image exists, no unsupported atmosphere claim, and `git diff --check` has no output.
- `node --test tests/morning-marketing.test.mjs` could not run because this environment has no `node` executable (`command not found: node`). No dependency was installed and no external system was changed.

## Review round 1

Added the verified VK and Direct destination URLs to each of the ten briefs. Every pair exactly matches the relevant segment in `morning-campaign-matrix.md` and retains `utm_content` for that brief's segment.

Added a contract test that requires both URLs in every brief and rejects another segment's `utm_content` within that brief.

Verification used the bundled Node runtime: `node --test tests/morning-*.test.mjs` — 30 passed, 0 failed. `git diff --check` returned no output.
