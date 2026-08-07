# Morning Demand System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Создать в preview измеримую посадочную страницу утреннего пакета и полный комплект материалов для раздельного теста пяти аудиторий без публикации рекламы и изменения бюджета.

**Architecture:** Статическая страница `utro/index.html` использует существующую систему бренда, общие изображения и отдельные небольшие CSS/JS-файлы. Основное предложение и условия находятся в HTML; JavaScript отвечает только за сегментную вариацию вводного текста, сохранение атрибуции и события аналитики. Рекламная матрица и задания на креативы хранятся рядом с кодом как проверяемые документы.

**Tech Stack:** HTML5, CSS3, JavaScript ES modules, Node.js built-in test runner, GitHub Pages, Яндекс Метрика, VK Pixel, LANGAME.

## Global Constraints

- Утренний пакет: 08:00–13:00, 5 часов.
- Будни: «Киберспорт» 540 ₽, «Комфорт» 600 ₽.
- Выходные: «Киберспорт» 600 ₽, «Комфорт» 660 ₽.
- 500 бонусов доступны только после полной регистрации у администратора и подтверждения личности и возраста документом.
- Бонусами можно оплатить до 50% игрового времени и пакетов, кроме ночных.
- Для несовершеннолетних не рекламировать ночное посещение и энергетики.
- Основной CTA ведёт в LANGAME; телефон и Telegram — дополнительные пути.
- Preview сохраняет `noindex,nofollow,noarchive`; production не изменяется.
- Рекламные кампании, ставки и бюджеты не публикуются и не меняются без отдельного подтверждения владельца.
- Основная бизнес-метрика: первый оплаченный визит и повторный визит в течение 30 дней.

---

## File Structure

- `utro/index.html` — статическое содержание посадочной страницы и SEO/preview-метаданные.
- `assets/css/morning.css` — стили только утренней страницы поверх общих токенов `landing.css`.
- `assets/js/morning.js` — чистая функция определения сегмента, вариация вводного сообщения и события глубины просмотра.
- `tests/morning-page.test.mjs` — контракт подтверждённых текстов, цен, ссылок и ограничений.
- `tests/morning-segment.test.mjs` — модульные тесты определения сегмента по UTM.
- `marketing/morning-campaign-matrix.md` — готовые группы, география, расписание, UTM и тексты.
- `marketing/morning-creative-briefs.md` — точные задания на десять креативов.
- `index.html` — статическая ссылка на утреннее предложение.
- `CHANGELOG.md` — запись о готовом preview-пакете.

### Task 1: Контракт подтверждённых фактов

**Files:**
- Create: `tests/morning-page.test.mjs`
- Create: `utro/index.html`

**Interfaces:**
- Consumes: подтверждённые цены и условия из дизайн-спецификации.
- Produces: HTML-контракт, который все последующие задачи обязаны сохранять.

- [ ] **Step 1: Write the failing content contract**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../utro/index.html", import.meta.url), "utf8");

test("shows the verified morning package", () => {
  for (const value of ["08:00–13:00", "5 часов", "540 ₽", "600 ₽", "660 ₽"]) {
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
```

- [ ] **Step 2: Run the contract and verify it fails**

Run: `node --test tests/morning-page.test.mjs`  
Expected: FAIL with `ENOENT` for `utro/index.html`.

- [ ] **Step 3: Create the minimum HTML shell**

Create `utro/index.html` with the exact head and core offer below; subsequent tasks extend the body without changing facts:

```html
<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <meta name="theme-color" content="#070a12">
  <title>Утренний пакет — 5 часов от 540 ₽ | 3D АРЕНА</title>
  <meta name="description" content="Утренний пакет 3D АРЕНЫ: 5 часов с 08:00 до 13:00 от 540 ₽. Два игровых зала у метро Молодёжная.">
  <link rel="canonical" href="https://3d-arena.ru/utro/">
  <link rel="icon" href="../favicon.ico">
  <link rel="stylesheet" href="../assets/css/landing.css?v=20260807-1">
  <link rel="stylesheet" href="../assets/css/morning.css?v=20260807-1">
</head>
<body data-page="morning">
  <main>
    <h1>5 часов игры утром от 540 ₽</h1>
    <p>Ежедневно с 08:00 до 13:00.</p>
    <table>
      <thead><tr><th>День</th><th>Киберспорт</th><th>Комфорт</th></tr></thead>
      <tbody>
        <tr><td>Будни</td><td>540 ₽</td><td>600 ₽</td></tr>
        <tr><td>Выходные</td><td>600 ₽</td><td>660 ₽</td></tr>
      </tbody>
    </table>
    <p>500 бонусов доступны после полной регистрации у администратора и подтверждения личности и возраста документом. Бонусами можно оплатить до 50% игрового времени и пакетов, кроме ночных.</p>
    <a href="https://langame.ru/799456996_computerniy_club_3d-arena_moskva/booking">Забронировать</a>
    <a href="tel:+79259359344">Позвонить</a>
    <a href="https://t.me/IIIDArena">Telegram</a>
  </main>
</body>
</html>
```

- [ ] **Step 4: Run the contract and verify it passes**

Run: `node --test tests/morning-page.test.mjs`  
Expected: 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add utro/index.html tests/morning-page.test.mjs
git commit -m "test: lock verified morning offer"
```

### Task 2: Полная посадочная страница и адаптивный дизайн

**Files:**
- Modify: `utro/index.html`
- Create: `assets/css/morning.css`
- Modify: `tests/morning-page.test.mjs`

**Interfaces:**
- Consumes: HTML-контракт Task 1 и существующие `assets/brand/mark.svg`, `images/gallery/hall-01.jpg`, `images/gallery/hall-15.jpg`.
- Produces: готовую адаптивную страницу с устойчивыми идентификаторами `morning-offer`, `morning-prices`, `morning-bonus`, `morning-faq`.

- [ ] **Step 1: Extend the failing contract for page structure**

Append:

```js
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
```

- [ ] **Step 2: Run tests and verify the two new tests fail**

Run: `node --test tests/morning-page.test.mjs`  
Expected: 4 PASS, 2 FAIL because sections and images are absent.

- [ ] **Step 3: Build the complete static page**

Use this fixed section order:

```html
<nav class="lp-nav">...</nav>
<main>
  <section class="morning-hero" id="morning-offer">...</section>
  <section class="morning-section" id="morning-prices">...</section>
  <section class="morning-section" id="morning-halls">...</section>
  <section class="morning-section" id="morning-audiences">...</section>
  <section class="morning-section" id="morning-bonus">...</section>
  <section class="morning-section" id="morning-proof">...</section>
  <section class="morning-section" id="morning-route">...</section>
  <section class="morning-section" id="morning-faq">...</section>
  <section class="morning-final">...</section>
</main>
```

Hero copy:

```html
<div class="eyebrow">Утренний пакет · ежедневно 08:00–13:00</div>
<h1>5 часов игры <em>от 540 ₽</em></h1>
<p class="morning-lead" data-segment-copy>Спокойное утро, мощные ПК и два зала рядом с метро «Молодёжная».</p>
<div class="facts"><span>5 часов</span><span>от 540 ₽</span><span>300 Гц или 2K</span><span>24/7</span></div>
<a class="btn btn--primary" data-track="morning_booking_top" href="https://langame.ru/799456996_computerniy_club_3d-arena_moskva/booking">Выбрать место</a>
```

Bonus disclosure:

```html
<p class="morning-disclosure">Для активации 500 бонусов пройдите полную регистрацию у администратора и предъявите документ, подтверждающий личность и возраст. Бонусами можно оплатить до 50% игрового времени и пакетов, кроме ночных.</p>
```

- [ ] **Step 4: Add page-specific CSS**

Create tokens and layouts without changing `landing.css`:

```css
.morning-hero{position:relative;min-height:760px;display:grid;align-items:end;padding:150px clamp(20px,8vw,130px) 90px;overflow:hidden}
.morning-hero__media{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.morning-hero__veil{position:absolute;inset:0;background:linear-gradient(90deg,rgba(4,7,14,.98),rgba(4,7,14,.62) 62%,rgba(4,7,14,.22)),linear-gradient(0deg,#070a12,transparent 58%)}
.morning-hero__copy{position:relative;z-index:1;max-width:780px}
.morning-hero h1{margin:18px 0;font-family:var(--head);font-size:clamp(44px,7vw,88px);line-height:1}
.morning-hero h1 em{color:var(--glow);font-style:normal}
.morning-section{padding:clamp(70px,9vw,120px) clamp(20px,8vw,130px)}
.morning-price-grid,.morning-hall-grid,.morning-audience-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;max-width:1180px;margin:36px auto 0}
.morning-card{padding:clamp(24px,4vw,42px);border:1px solid var(--border);border-radius:18px;background:var(--panel)}
.morning-disclosure{max-width:850px;color:var(--muted);font-size:13px;line-height:1.7}
@media(max-width:760px){.morning-price-grid,.morning-hall-grid,.morning-audience-grid{grid-template-columns:1fr}.morning-hero{min-height:720px;padding-top:130px}.morning-hero__veil{background:linear-gradient(180deg,rgba(4,7,14,.38),#070a12 72%)}}
```

- [ ] **Step 5: Run tests and serve preview locally**

Run: `node --test tests/morning-page.test.mjs`  
Expected: 6 tests PASS.

Run: `python3 -m http.server 8080`  
Open: `http://localhost:8080/utro/`  
Expected: hero, all sections, real photos and CTA render at 390 px and 1440 px widths without horizontal scrolling.

- [ ] **Step 6: Commit**

```bash
git add utro/index.html assets/css/morning.css tests/morning-page.test.mjs
git commit -m "feat: add morning package landing page"
```

### Task 3: Сегментная вариация без подмены фактов

**Files:**
- Create: `assets/js/morning.js`
- Create: `tests/morning-segment.test.mjs`
- Modify: `utro/index.html`

**Interfaces:**
- Produces: `getMorningSegment(search: string): "student" | "shift" | "local" | "competitor" | "returning" | "default"`.
- Consumes: query parameter `utm_content` with one of the exact values above.

- [ ] **Step 1: Write failing segment tests**

```js
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
```

- [ ] **Step 2: Run tests and verify import failure**

Run: `node --test tests/morning-segment.test.mjs`  
Expected: FAIL with module-not-found for `assets/js/morning.js`.

- [ ] **Step 3: Implement pure segment selection and browser enhancement**

```js
export function getMorningSegment(search = "") {
  const allowed = new Set(["student", "shift", "local", "competitor", "returning"]);
  const value = new URLSearchParams(search).get("utm_content") || "";
  return allowed.has(value) ? value : "default";
}

const copy = {
  student: "Нет первой пары или появилось окно? Проведите его за игрой рядом с метро «Молодёжная».",
  shift: "Закончилась смена? Спокойное утро, мощные ПК и 5 часов игры от 540 ₽.",
  local: "Свободное утро рядом с домом: два игровых зала и 5 часов игры от 540 ₽.",
  competitor: "Чистый зал, свежий воздух и выбор между 300 Гц и 2K рядом с метро «Молодёжная».",
  returning: "Вернитесь в 3D АРЕНУ утром: 5 часов игры от 540 ₽.",
  default: "Спокойное утро, мощные ПК и два зала рядом с метро «Молодёжная»."
};

if (typeof document !== "undefined") {
  const segment = getMorningSegment(location.search);
  const node = document.querySelector("[data-segment-copy]");
  if (node) node.textContent = copy[segment];
  document.body.dataset.segment = segment;
}
```

- [ ] **Step 4: Load scripts in the page**

Before `</body>`:

```html
<script src="../assets/js/vk-pixel.js?v=20260721-2"></script>
<script src="../assets/js/landing.js?v=20260725-1"></script>
<script type="module" src="../assets/js/morning.js?v=20260807-1"></script>
```

- [ ] **Step 5: Run unit and content tests**

Run: `node --test tests/morning-segment.test.mjs tests/morning-page.test.mjs`  
Expected: all tests PASS.

- [ ] **Step 6: Commit**

```bash
git add assets/js/morning.js tests/morning-segment.test.mjs utro/index.html
git commit -m "feat: adapt morning message by campaign segment"
```

### Task 4: Аналитика конверсий и глубины страницы

**Files:**
- Modify: `assets/js/morning.js`
- Modify: `tests/morning-segment.test.mjs`
- Modify: `utro/index.html`

**Interfaces:**
- Produces events: `morning_view`, `morning_scroll_50`, `morning_scroll_90`, `morning_bonus_terms`, `morning_booking_top`, `morning_booking_bottom`, `morning_call`, `morning_telegram`.
- Consumes existing `data-track`, `window.dataLayer`, `window.ym`, `window.ARENA_METRIKA_ID`, `window.arenaVkTrack`.

- [ ] **Step 1: Add a failing test for threshold state**

Extend the module to export a pure function and test first:

```js
import { getNewScrollGoals } from "../assets/js/morning.js";

test("scroll goals fire once when thresholds are crossed", () => {
  const sent = new Set();
  assert.deepEqual(getNewScrollGoals(0.49, sent), []);
  assert.deepEqual(getNewScrollGoals(0.50, sent), ["morning_scroll_50"]);
  sent.add("morning_scroll_50");
  assert.deepEqual(getNewScrollGoals(0.91, sent), ["morning_scroll_90"]);
});
```

- [ ] **Step 2: Run and verify failure**

Run: `node --test tests/morning-segment.test.mjs`  
Expected: FAIL because `getNewScrollGoals` is not exported.

- [ ] **Step 3: Implement scroll goals and shared dispatch**

```js
export function getNewScrollGoals(ratio, sent) {
  const goals = [];
  if (ratio >= 0.5 && !sent.has("morning_scroll_50")) goals.push("morning_scroll_50");
  if (ratio >= 0.9 && !sent.has("morning_scroll_90")) goals.push("morning_scroll_90");
  return goals;
}

function dispatch(action, details = {}) {
  const payload = { event: "arena_event", action, page: "morning", segment: document.body.dataset.segment || "default", ...details };
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
  if (window.ARENA_METRIKA_ID && typeof window.ym === "function") window.ym(window.ARENA_METRIKA_ID, "reachGoal", action, payload);
  if (typeof window.arenaVkTrack === "function") window.arenaVkTrack(action);
}
```

On `DOMContentLoaded`, dispatch `morning_view`. On a passive scroll listener calculate:

```js
const ratio = (scrollY + innerHeight) / document.documentElement.scrollHeight;
```

Send returned goals once and add each to `sent`.

- [ ] **Step 4: Add exact data-track attributes**

```html
data-track="morning_booking_top"
data-track="morning_booking_bottom"
data-track="morning_call"
data-track="morning_telegram"
data-track="morning_bonus_terms"
```

- [ ] **Step 5: Verify tests and browser events**

Run: `node --test tests/morning-segment.test.mjs tests/morning-page.test.mjs`  
Expected: all tests PASS.

Browser console check at `http://localhost:8080/utro/?utm_content=student&utm_source=vk&utm_medium=cpc&utm_campaign=morning`:

```js
window.dataLayer.filter(x => x.event === "arena_event")
```

Expected after scrolling and one CTA click: `morning_view`, `morning_scroll_50`, `morning_scroll_90`, and the clicked CTA event, all with `segment: "student"`.

- [ ] **Step 6: Commit**

```bash
git add assets/js/morning.js tests/morning-segment.test.mjs utro/index.html
git commit -m "feat: measure morning landing conversions"
```

### Task 5: Внутренняя ссылка и preview-навигация

**Files:**
- Modify: `index.html`
- Modify: `assets/css/style.css`
- Modify: `tests/morning-page.test.mjs`

**Interfaces:**
- Consumes: public preview route `utro/`.
- Produces: visible path from the homepage without changing the main booking flow.

- [ ] **Step 1: Add a failing homepage-link test**

```js
const home = await readFile(new URL("../index.html", import.meta.url), "utf8");

test("homepage links to the morning offer", () => {
  assert.match(home, /href="utro\/"/);
  assert.match(home, /5 часов утром от 540 ₽/);
});
```

- [ ] **Step 2: Run and verify failure**

Run: `node --test tests/morning-page.test.mjs`  
Expected: new test FAIL because homepage has no `utro/` link.

- [ ] **Step 3: Add a static morning teaser after the prices section**

```html
<aside class="morning-teaser reveal" aria-label="Утренний пакет">
  <div><span>Ежедневно · 08:00–13:00</span><strong>5 часов утром от 540 ₽</strong></div>
  <a class="btn-primary" data-track="morning_landing" href="utro/">Подробнее об утреннем пакете</a>
</aside>
```

Do not insert it inside an element replaced by `assets/js/release-06.js`.

- [ ] **Step 4: Style the teaser**

```css
.morning-teaser{display:flex;justify-content:space-between;align-items:center;gap:24px;margin:26px auto 0;padding:24px 28px;border:1px solid rgba(77,184,255,.28);border-radius:16px;background:linear-gradient(135deg,rgba(26,110,255,.16),rgba(13,22,40,.84))}
.morning-teaser span{display:block;margin-bottom:6px;color:var(--glow);font-size:10px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}
.morning-teaser strong{font-family:var(--font-h);font-size:clamp(20px,3vw,30px)}
@media(max-width:760px){.morning-teaser{align-items:stretch;flex-direction:column}.morning-teaser .btn-primary{text-align:center}}
```

- [ ] **Step 5: Run tests and visual check**

Run: `node --test tests/morning-page.test.mjs tests/morning-segment.test.mjs`  
Expected: all tests PASS.

Verify homepage at 390 px and 1440 px: teaser does not overlap the dynamic price block and opens `/utro/`.

- [ ] **Step 6: Commit**

```bash
git add index.html assets/css/style.css tests/morning-page.test.mjs
git commit -m "feat: link homepage to morning offer"
```

### Task 6: Рекламная матрица и UTM-контракт

**Files:**
- Create: `marketing/morning-campaign-matrix.md`
- Create: `tests/morning-marketing.test.mjs`

**Interfaces:**
- Produces five exact `utm_content` values consumed by `getMorningSegment`: `student`, `shift`, `local`, `competitor`, `returning`.
- Produces five source codes: `UTRO-STUDENT`, `UTRO-SHIFT`, `UTRO-LOCAL`, `UTRO-COMP`, `UTRO-RETURN`.

- [ ] **Step 1: Write the failing document contract**

```js
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
```

- [ ] **Step 2: Run and verify missing-file failure**

Run: `node --test tests/morning-marketing.test.mjs`  
Expected: FAIL with `ENOENT`.

- [ ] **Step 3: Create the campaign matrix**

For each segment include these exact fields:

```markdown
## Student 18+
- Геозоны: МГЭУ, МИИГАиК, Медицинский колледж и маршруты до Молодёжной
- Возраст: 18–25
- Расписание: 07:00–15:00
- Оффер: Нет первой пары? 5 часов игры утром от 540 ₽.
- URL VK: https://3d-arena.ru/utro/?utm_source=vk&utm_medium=cpc&utm_campaign=morning&utm_content=student
- URL Direct: https://3d-arena.ru/utro/?utm_source=yandex&utm_medium=cpc&utm_campaign=morning&utm_content=student
- Код источника: UTRO-STUDENT
- Исключения: школьный возраст, ночные офферы, энергетики
```

Add four more complete sections with these exact values:

| Section | Geography | Age | Schedule | Offer | `utm_content` | Source code |
|---|---|---:|---|---|---|---|
| Shift workers | Кунцево Плаза, ЦКБ, общепит, фитнес и службы доставки | 18–40 | 06:00–15:00 | После смены — 5 часов игры от 540 ₽. Тихо, чисто, свежий воздух. | `shift` | `UTRO-SHIFT` |
| Local residents | Кунцево и Крылатское, радиус до 4 км | 18–35 | 07:00–16:00 | Свободное утро рядом с домом: 5 часов игры от 540 ₽. | `local` | `UTRO-LOCAL` |
| Competitor demand | геозоны компьютерных клубов в радиусе 2–8 км | 18–35 | 08:00–23:00 | Чистый зал, свежий воздух и выбор между 300 Гц и 2K. | `competitor` | `UTRO-COMP` |
| Returning visitors | посетители `/utro/` и взаимодействовавшие с рекламой | 18–40 | 07:00–16:00 | Вернитесь утром: 5 часов игры от 540 ₽. | `returning` | `UTRO-RETURN` |

Write these exact URLs in the document:

```text
https://3d-arena.ru/utro/?utm_source=vk&utm_medium=cpc&utm_campaign=morning&utm_content=student
https://3d-arena.ru/utro/?utm_source=yandex&utm_medium=cpc&utm_campaign=morning&utm_content=student
https://3d-arena.ru/utro/?utm_source=vk&utm_medium=cpc&utm_campaign=morning&utm_content=shift
https://3d-arena.ru/utro/?utm_source=yandex&utm_medium=cpc&utm_campaign=morning&utm_content=shift
https://3d-arena.ru/utro/?utm_source=vk&utm_medium=cpc&utm_campaign=morning&utm_content=local
https://3d-arena.ru/utro/?utm_source=yandex&utm_medium=cpc&utm_campaign=morning&utm_content=local
https://3d-arena.ru/utro/?utm_source=vk&utm_medium=cpc&utm_campaign=morning&utm_content=competitor
https://3d-arena.ru/utro/?utm_source=yandex&utm_medium=cpc&utm_campaign=morning&utm_content=competitor
https://3d-arena.ru/utro/?utm_source=vk&utm_medium=cpc&utm_campaign=morning&utm_content=returning
https://3d-arena.ru/utro/?utm_source=yandex&utm_medium=cpc&utm_campaign=morning&utm_content=returning
```

For every group specify the exclusions from the design spec, primary KPI `стоимость первого оплаченного визита`, and the common stop condition `не масштабировать по CTR без подтверждённых оплаченных визитов`.

- [ ] **Step 4: Run the document contract**

Run: `node --test tests/morning-marketing.test.mjs`  
Expected: 2 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add marketing/morning-campaign-matrix.md tests/morning-marketing.test.mjs
git commit -m "docs: define morning campaign matrix"
```

### Task 7: Технические задания на десять креативов

**Files:**
- Create: `marketing/morning-creative-briefs.md`
- Modify: `tests/morning-marketing.test.mjs`

**Interfaces:**
- Consumes: five segments from Task 6 and verified photos from `images/gallery/`.
- Produces: two briefs per segment, each with headline, image source, format, CTA and forbidden claims.

- [ ] **Step 1: Add a failing creative-count test**

```js
const briefs = await readFile(new URL("../marketing/morning-creative-briefs.md", import.meta.url), "utf8");

test("contains ten numbered creative briefs", () => {
  const headings = briefs.match(/^## Creative \d+:/gm) || [];
  assert.equal(headings.length, 10);
});

test("every brief names a real source image", () => {
  const imageRefs = briefs.match(/images\/gallery\/hall-\d{2}\.jpg/g) || [];
  assert.equal(imageRefs.length, 10);
});
```

- [ ] **Step 2: Run and verify missing-file failure**

Run: `node --test tests/morning-marketing.test.mjs`  
Expected: matrix tests PASS, creative tests FAIL with `ENOENT`.

- [ ] **Step 3: Write ten complete briefs**

Create the following exact ten-brief matrix:

| № | Segment | Concept | Source image | Headline | Support line |
|---:|---|---|---|---|---|
| 1 | student | price | `images/gallery/hall-01.jpg` | `5 ЧАСОВ ОТ 540 ₽` | `08:00–13:00 · МОЛОДЁЖНАЯ` |
| 2 | student | product | `images/gallery/hall-01.jpg` | `300 ГЦ ДО ПЕРВОЙ ПАРЫ` | `5 ЧАСОВ УТРОМ` |
| 3 | shift | price | `images/gallery/hall-15.jpg` | `ПОСЛЕ СМЕНЫ — ОТ 540 ₽` | `5 ЧАСОВ ИГРЫ` |
| 4 | shift | product | `images/gallery/hall-15.jpg` | `ТИХО. ЧИСТО. 2K.` | `УТРО В 3D АРЕНЕ` |
| 5 | local | price | `images/gallery/hall-01.jpg` | `5 ЧАСОВ РЯДОМ С ДОМОМ` | `ОТ 540 ₽ · МОЛОДЁЖНАЯ` |
| 6 | local | product | `images/gallery/hall-15.jpg` | `ДВА ЗАЛА НА ВЫБОР` | `300 ГЦ ИЛИ 2K` |
| 7 | competitor | price | `images/gallery/hall-01.jpg` | `УТРО: 5 ЧАСОВ ОТ 540 ₽` | `М. МОЛОДЁЖНАЯ` |
| 8 | competitor | product | `images/gallery/hall-01.jpg` | `300 ГЦ. СВЕЖИЙ ВОЗДУХ.` | `ЧИСТЫЙ ИГРОВОЙ ЗАЛ` |
| 9 | returning | price | `images/gallery/hall-15.jpg` | `ВЕРНИТЕСЬ УТРОМ` | `5 ЧАСОВ ОТ 540 ₽` |
| 10 | returning | product | `images/gallery/hall-12.jpg` | `ПК ИЛИ PS5` | `ВЫБЕРИТЕ СВОЙ ФОРМАТ` |

All ten briefs use CTA `ЗАБРОНИРОВАТЬ`.

Each brief must contain:

```markdown
## Creative 1: Student — price
- Formats: 1080×1080, 1080×1350, 1080×1920
- Source image: images/gallery/hall-01.jpg
- Headline on image: 5 ЧАСОВ ОТ 540 ₽
- Support line: 08:00–13:00 · МОЛОДЁЖНАЯ
- CTA: ЗАБРОНИРОВАТЬ
- Logo: assets/brand/mark.svg, top-left, clear-space 32 px at 1080 px
- Ornament: only the approved corrected pattern
- Description: Нет первой пары? Проведите окно за игрой рядом с метро «Молодёжная».
- Forbidden: «бесплатно», unverified ratings, energy drinks, night access for minors
```

Use only `hall-01.jpg`, `hall-15.jpg` and `hall-12.jpg`; these images are already used by the current verified hall landing pages. Visually inspect all three before finalizing crops.

- [ ] **Step 4: Run the creative contract**

Run: `node --test tests/morning-marketing.test.mjs`  
Expected: 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add marketing/morning-creative-briefs.md tests/morning-marketing.test.mjs
git commit -m "docs: add morning creative briefs"
```

### Task 8: Финальная проверка preview-пакета

**Files:**
- Modify: `CHANGELOG.md`
- Verify: `utro/index.html`, `index.html`, `assets/css/morning.css`, `assets/js/morning.js`, `marketing/*.md`, `tests/*.mjs`

**Interfaces:**
- Consumes: all previous tasks.
- Produces: проверенный preview-коммит, готовый к push и визуальному согласованию; production remains untouched.

- [ ] **Step 1: Run the complete automated suite**

Run:

```bash
node --test tests/morning-page.test.mjs tests/morning-segment.test.mjs tests/morning-marketing.test.mjs
```

Expected: all tests PASS, zero skipped tests.

- [ ] **Step 2: Check static references and forbidden placeholders**

Run:

```bash
rg -n "TBD|TODO|placeholder|example\.com" utro assets/js/morning.js assets/css/morning.css marketing tests
```

Expected: no output.

Run:

```bash
test -f assets/brand/mark.svg && test -f images/gallery/hall-01.jpg && test -f images/gallery/hall-15.jpg && test -f favicon.ico
```

Expected: exit code 0.

- [ ] **Step 3: Perform browser QA**

Serve with `python3 -m http.server 8080` and verify:

- `http://localhost:8080/utro/` at 390×844 and 1440×900;
- no horizontal scrolling;
- all CTA links open correct destinations;
- prices remain readable without zoom;
- registration disclosure is visible;
- `?utm_content=student`, `shift`, `local`, `competitor`, `returning` changes only the lead text;
- the main homepage opens `/utro/`;
- console has no errors;
- network has no 404 responses for CSS, JS, images or favicon.

- [ ] **Step 4: Update changelog**

Add:

```markdown
## 2026-08-07
- Added a preview-only morning package landing page with verified prices and transparent bonus conditions.
- Added segment-aware campaign messaging, conversion events, UTM matrix and ten creative briefs.
- Kept production, live campaigns, bids and budgets unchanged.
```

- [ ] **Step 5: Review diff and commit**

Run: `git diff --check`  
Expected: no output.

```bash
git add CHANGELOG.md
git commit -m "docs: record morning demand preview package"
```

- [ ] **Step 6: Push preview branch only after local verification**

Run: `git status --short --branch`  
Expected: clean working tree on the feature branch.

Push the feature branch and open a draft pull request against the preview repository. Do not merge into production and do not publish ads. The pull request description must list test results, preview URL, the unchanged production boundary and the separate approval required for budgets/publication.

---

## Post-Implementation Approval Gates

After the preview is visually approved, request separate confirmations for:

1. Merge and publish the preview route.
2. Copy the approved route to production.
3. Create or edit VK Ads groups.
4. Create or edit Yandex Direct groups.
5. Set budgets and bids.
6. Publish campaigns.
7. Add any automated LANGAME or messaging integration.
