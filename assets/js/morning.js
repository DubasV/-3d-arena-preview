const allowedSegments = new Set(["student", "shift", "local", "competitor", "returning"]);

export function getMorningSegment(search = "") {
  const value = new URLSearchParams(search).get("utm_content") || "";
  return allowedSegments.has(value) ? value : "default";
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
