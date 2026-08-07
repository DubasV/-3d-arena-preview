import test from "node:test";
import assert from "node:assert/strict";
import { getMorningSegment } from "../assets/js/morning.js";

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
