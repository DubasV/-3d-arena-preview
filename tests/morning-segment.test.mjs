import test from "node:test";
import assert from "node:assert/strict";
import { getMorningSegment, getNewScrollGoals } from "../assets/js/morning.js";

const cases = [
  ["?utm_content=student", "student"],
  ["?utm_content=shift", "shift"],
  ["?utm_content=local", "local"],
  ["?utm_content=competitor", "competitor"],
  ["?utm_content=returning", "returning"],
  ["?utm_content=unknown", "default"],
  ["", "default"]
];

for (const [search, expected] of cases) {
  test(`${search || "empty"} maps to ${expected}`, () => {
    assert.equal(getMorningSegment(search), expected);
  });
}

test("scroll goals fire once when thresholds are crossed", () => {
  const sent = new Set();

  assert.deepEqual(getNewScrollGoals(0.49, sent), []);
  assert.deepEqual(getNewScrollGoals(0.50, sent), ["morning_scroll_50"]);
  sent.add("morning_scroll_50");
  assert.deepEqual(getNewScrollGoals(0.91, sent), ["morning_scroll_90"]);
});

test("runtime segment copy uses only verified competitor facts", async () => {
  const node = { textContent: "" };
  const body = { dataset: {} };

  globalThis.document = {
    body,
    readyState: "loading",
    querySelector: selector => selector === "[data-segment-copy]" ? node : null,
    addEventListener() {}
  };

  try {
    const runtimeCopy = {};

    for (const segment of ["student", "shift", "local", "competitor", "returning", "default"]) {
      globalThis.location = { search: segment === "default" ? "" : `?utm_content=${segment}` };
      await import(`../assets/js/morning.js?runtime-copy=${segment}`);
      runtimeCopy[segment] = node.textContent;
    }

    for (const text of Object.values(runtimeCopy)) {
      assert.doesNotMatch(text, /чистый зал|свежий воздух|тихо/i);
    }

    assert.match(runtimeCopy.competitor, /300 Гц/);
    assert.match(runtimeCopy.competitor, /2K/);
    assert.match(runtimeCopy.competitor, /540 ₽/);
  } finally {
    delete globalThis.document;
    delete globalThis.location;
  }
});
