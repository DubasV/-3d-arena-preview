import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { buildMorningOfferUrl } from "../assets/js/morning-transition.js";

const html = await readFile(new URL("../utro/index.html", import.meta.url), "utf8");
const css = await readFile(new URL("../assets/css/morning.css", import.meta.url), "utf8");
const home = await readFile(new URL("../index.html", import.meta.url), "utf8");
const app = await readFile(new URL("../assets/js/app.js", import.meta.url), "utf8");
const release = await readFile(new URL("../assets/js/release-06.js", import.meta.url), "utf8");

test("homepage links to the morning offer", () => {
  assert.match(home, /data-morning-offer data-track="morning_landing" href="utro\/"/);
  assert.match(home, /assets\/js\/morning-transition\.js/);
  assert.match(home, /5 часов утром от 540 ₽/);
});

test("morning transition preserves only allowed attribution", () => {
  assert.equal(
    buildMorningOfferUrl("?utm_source=vk&utm_content=student&yclid=abc123&unsafe=drop"),
    "utro/?utm_source=vk&utm_content=student&yclid=abc123"
  );
});

test("homepage analytics assigns each tracked link to one owner", () => {
  assert.match(app, /if \(element\.dataset\.trackOwner\) return;/);
  assert.match(release, /if \(element\.dataset\.trackOwner\) return;/);
});

test("shows the verified morning package", () => {
  for (const value of ["08:00 до 13:00", "5 часов"]) {
    assert.match(html, new RegExp(value.replace(" ₽", "\\s*₽")));
  }
});

test("loads the fixed morning runtime with a fresh cache key", () => {
  assert.match(html, /<script type="module" src="\.\.\/assets\/js\/morning\.js\?v=20260808-1"><\/script>/);
});

test("binds each morning tariff to its day and hall", () => {
  assert.match(html, /Будни[\s\S]*?Киберспорт<\/dt><dd>540\s*₽[\s\S]*?Комфорт<\/dt><dd>600\s*₽/);
  assert.match(html, /Выходные[\s\S]*?Киберспорт<\/dt><dd>600\s*₽[\s\S]*?Комфорт<\/dt><dd>660\s*₽/);
});

test("keeps LANGAME as the only primary conversion CTA", () => {
  assert.doesNotMatch(html, /class="btn btn--primary" href="tel:\+79259359344"/);
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

test("contains every conversion section", () => {
  for (const id of ["morning-offer", "morning-prices", "morning-halls", "morning-bonus", "morning-proof", "morning-route", "morning-faq"]) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
});

test("uses real club images and accessible labels", () => {
  assert.match(html, /\.\.\/images\/gallery\/hall-01\.jpg/);
  assert.match(html, /\.\.\/images\/gallery\/hall-15\.jpg/);
  assert.doesNotMatch(html, /<img(?![^>]*alt=)[^>]*>/);
});

test("keeps hall photos responsive despite their HTML dimensions", () => {
  assert.match(css, /\.morning-hall-card img\{[^}]*width:100%[^}]*height:auto[^}]*aspect-ratio:16\/10[^}]*object-fit:cover/);
});
