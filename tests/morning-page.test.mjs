import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../utro/index.html", import.meta.url), "utf8");

test("shows the verified morning package", () => {
  for (const value of ["08:00 до 13:00", "5 часов", "540 ₽", "600 ₽", "660 ₽"]) {
    assert.match(html, new RegExp(value.replace(" ₽", "\\s*₽")));
  }
});

test("explains bonus registration honestly", () => {
  assert.match(html, /500 бонусов/);
  assert.match(html, /полной регистрации у администратора/i);
  assert.match(html, /документ/i);
  assert.match(html, /личност.*возраст/i);
  assert.match(html, /до 50%/i);
  assert.match(html, /кроме ночных/i);
});

test("contains booking and contact paths", () => {
  assert.match(html, /langame\.ru\/799456996_computerniy_club_3d-arena_moskva\/booking/);
  assert.match(html, /tel:\+79259359344/);
  assert.match(html, /https:\/\/t\.me\/IIIDArena/);
});

test("keeps preview out of search results", () => {
  assert.match(html, /name="robots" content="noindex,nofollow,noarchive"/);
});
