import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const matrix = await readFile(new URL("../marketing/morning-campaign-matrix.md", import.meta.url), "utf8");

test("matrix covers every tracked segment", () => {
  for (const segment of ["student", "shift", "local", "competitor", "returning"]) {
    assert.match(matrix, new RegExp(`utm_content=${segment}`));
  }
});

test("matrix contains every source code", () => {
  for (const code of ["UTRO-STUDENT", "UTRO-SHIFT", "UTRO-LOCAL", "UTRO-COMP", "UTRO-RETURN"]) {
    assert.match(matrix, new RegExp(code));
  }
});
