import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { buildMorningOfferUrl } from "../assets/js/morning-transition.js";

const html = await readFile(new URL("../utro/index.html", import.meta.url), "utf8");
const css = await readFile(new URL("../assets/css/morning.css", import.meta.url), "utf8");
const home = await readFile(new URL("../index.html", import.meta.url), "utf8");
const app = await readFile(new URL("../assets/js/app.js", import.meta.url), "utf8");
const release = await readFile(new URL("../assets/js/release-06.js", import.meta.url), "utf8");
const morningRuntime = await readFile(new URL("../assets/js/morning.js", import.meta.url), "utf8");
const vkPixel = await readFile(new URL("../assets/js/vk-pixel.js", import.meta.url), "utf8");

function assertAnalyticsWiring(page, runtimePath) {
  const compact = page.replace(/\s+/g, "");
  const configIndex = compact.indexOf('window.ARENA_METRIKA_ID=110895058;window.ARENA_VK_PIXEL_ID="3781383";');
  const loaderIndex = compact.indexOf('(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");');
  const initIndex = compact.indexOf('ym(110895058,"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});');
  const vkIndex = compact.indexOf(runtimePath.includes("../") ? '<scriptsrc="../assets/js/vk-pixel.js' : '<scriptsrc="assets/js/vk-pixel.js');
  const runtimeIndex = compact.indexOf(`src="${runtimePath}`);

  assert.ok(configIndex >= 0, "analytics IDs must be configured");
  assert.ok(loaderIndex > configIndex, "Metrica loader must follow analytics IDs");
  assert.ok(initIndex > loaderIndex, "Metrica init must follow its async loader stub");
  assert.ok(vkIndex > initIndex, "VK pixel runtime must load after analytics config");
  assert.ok(runtimeIndex > vkIndex, "page runtime must load after analytics runtimes");
  assert.match(page, /<noscript><div><img src="https:\/\/mc\.yandex\.ru\/watch\/110895058"[^>]*alt=""><\/div><\/noscript>/);
  assert.match(page, /<noscript><div><img src="https:\/\/top-fwz1\.mail\.ru\/counter\?id=3781383;js=na"[^>]*alt=""><\/div><\/noscript>/);
}

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

test("loads the fixed morning assets with fresh cache keys", () => {
  assert.match(html, /assets\/css\/morning\.css\?v=20260808-2/);
  assert.match(html, /<script type="module" src="\.\.\/assets\/js\/morning\.js\?v=20260808-2"><\/script>/);
});

test("homepage and morning page wire confirmed analytics before page runtimes", () => {
  assertAnalyticsWiring(home, "assets/js/app.js");
  assertAnalyticsWiring(html, "../assets/js/morning.js");
  assert.match(vkPixel, /type:\s*"pageView"/);
  assert.match(vkPixel, /https:\/\/top-fwz1\.mail\.ru\/js\/code\.js/);
  assert.match(vkPixel, /script\.async\s*=\s*true/);
});

test("homepage refreshes the stylesheet cache key after the morning teaser styles", () => {
  assert.match(home, /assets\/css\/style\.css\?v=20260808-1/);
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

test("bonus conditions use an accessible disclosure tracked on first open", () => {
  assert.match(html, /<details class="morning-disclosure" data-track-on-open="morning_bonus_terms">\s*<summary>Условия получения и использования 500 бонусов<\/summary>/);
  assert.doesNotMatch(html, /<p[^>]*data-track="morning_bonus_terms"/);
  assert.match(morningRuntime, /addEventListener\("toggle"/);
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

test("shows source code, current reviews and confirmed route details", () => {
  assert.match(html, /data-source-code>UTRO-WEB<\/code>/);
  assert.match(html, /data-copy-source[^>]*>Скопировать код<\/button>/);
  assert.match(html, /Код нужен для уч[её]та источника и не да[её]т отдельную скидку/i);

  const proof = html.split('id="morning-proof"')[1]?.split('id="morning-route"')[0] || "";
  assert.match(proof, /https:\/\/yandex\.ru\/maps\/org\/3d_arena\/107910722858\//);
  assert.match(proof, /актуальн[а-я]+ оценк[а-я]+.*отзыв/i);
  assert.doesNotMatch(proof, /(?:рейтинг|оценка)\s*[—:]?\s*[1-5](?:[.,]\d)?/i);

  const route = html.split('id="morning-route"')[1]?.split('id="morning-faq"')[0] || "";
  assert.match(route, /Оршанская улица, 9/i);
  assert.match(route, /метро «Молодёжная»/i);
  assert.match(route, /парковк[а-я]*.*за шлагбаумом/i);
  assert.match(route, /перед въездом.*позвоните администратору/i);
  assert.match(route, /https:\/\/yandex\.ru\/maps\/org\/3d_arena\/107910722858\//);
});

test("morning page and runtime use factual copy only", () => {
  const copyUnderTest = `${html}\n${morningRuntime}`;
  for (const claim of ["спокойное утро", "максимальная плавность", "пока в клубе спокойно", "без компромиссов", "мощные ПК"]) {
    assert.ok(!copyUnderTest.toLowerCase().includes(claim), `unverified copy remains: ${claim}`);
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
