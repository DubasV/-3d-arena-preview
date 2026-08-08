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
