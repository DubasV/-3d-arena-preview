import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const matrix = await readFile(new URL("../marketing/morning-campaign-matrix.md", import.meta.url), "utf8");
const briefs = await readFile(new URL("../marketing/morning-creative-briefs.md", import.meta.url), "utf8");

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

test("matrix measures repeat paid visits with an honest manual cohort", () => {
  assert.match(matrix, /доля повторных оплаченных визитов в течение 30 дней/i);
  assert.match(matrix, /администратор фиксирует код источника.*первом оплач[её]нном визите/i);
  assert.match(matrix, /LANGAME.*уч[её]т/i);
  assert.match(matrix, /того же зарегистрированного гост[яеи].*30 дней/i);
  assert.match(matrix, /не принимать решение о масштабировании.*30 дней/i);
  assert.doesNotMatch(matrix, /целев[а-я]+.*%|процентн[а-я]+.*цель/i);
});

test("matrix defines planned placements without presenting them as live settings", () => {
  for (const section of ["Student 18+", "Shift workers", "Local residents", "Competitor demand", "Returning visitors"]) {
    const content = matrix.split(`## ${section}`)[1]?.split("## ")[0] || "";
    assert.match(content, /VK.*лента.*истори.*коротк/i);
    assert.match(content, /Direct.*поиск.*РСЯ/i);
    assert.match(content, /гипотез|план теста/i);
    assert.match(content, /не живая настройка/i);
  }
});

test("matrix keeps the morning package inside its verified hours", () => {
  assert.match(matrix, /Утренний пакет действует только с 08:00 до 13:00/i);
  for (const window of ["07:00–08:00", "13:00–15:00", "06:00–08:00", "13:00–16:00", "13:00–23:00"]) {
    assert.match(matrix, new RegExp(`${window}.*предварительного бронирования и предварительного маркетинга`));
  }
});

test("matrix uses only confirmed product claims", () => {
  assert.doesNotMatch(matrix, /тихо|чисто|свежий воздух/i);
  assert.match(matrix, /5 часов игры от 540 ₽/);
  assert.match(matrix, /300 Гц/);
  assert.match(matrix, /2K/);
});

test("matrix requires separate owner confirmation for every external action", () => {
  for (const action of [
    "создания кампании или группы",
    "загрузки креативов",
    "публикации или включения",
    "изменения бюджетов или ставок",
    "подключения интеграции или передачи данных"
  ]) {
    assert.match(matrix, new RegExp(`${action}.*отдельн[а-я]+ подтверждени[ея] владельца`, "i"));
  }
});

test("contains ten numbered creative briefs", () => {
  const headings = briefs.match(/^## Creative \d+:/gm) || [];
  assert.equal(headings.length, 10);
});

test("every brief names a real source image", () => {
  const imageRefs = briefs.match(/images\/gallery\/hall-\d{2}\.jpg/g) || [];
  assert.equal(imageRefs.length, 10);
});

test("every creative brief keeps VK and Direct attribution within its segment", () => {
  const segments = ["student", "shift", "local", "competitor", "returning"];
  const blocks = briefs.split(/^## Creative \d+: /m).slice(1);

  assert.equal(blocks.length, 10);

  for (const block of blocks) {
    const segment = block.split(" — ")[0].toLowerCase();
    assert.ok(segments.includes(segment), `unexpected segment: ${segment}`);
    assert.ok(block.includes(`https://3d-arena.ru/utro/?utm_source=vk&utm_medium=cpc&utm_campaign=morning&utm_content=${segment}`));
    assert.ok(block.includes(`https://3d-arena.ru/utro/?utm_source=yandex&utm_medium=cpc&utm_campaign=morning&utm_content=${segment}`));

    for (const otherSegment of segments.filter((item) => item !== segment)) {
      assert.ok(!block.includes(`utm_content=${otherSegment}`), `${segment} brief contains ${otherSegment} attribution`);
    }
  }
});
