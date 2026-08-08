const allowedSegments = new Set(["student", "shift", "local", "competitor", "returning"]);

export function getMorningSegment(search = "") {
  const value = new URLSearchParams(search).get("utm_content") || "";
  return allowedSegments.has(value) ? value : "default";
}

export function getNewScrollGoals(ratio, sent) {
  const goals = [];

  if (ratio >= 0.5 && !sent.has("morning_scroll_50")) goals.push("morning_scroll_50");
  if (ratio >= 0.9 && !sent.has("morning_scroll_90")) goals.push("morning_scroll_90");

  return goals;
}

const copy = {
  student: "Нет первой пары или появилось окно? Проведите его за игрой рядом с метро «Молодёжная».",
  shift: "Закончилась смена? Спокойное утро, мощные ПК и 5 часов игры от 540 ₽.",
  local: "Свободное утро рядом с домом: два игровых зала и 5 часов игры от 540 ₽.",
  competitor: "Чистый зал, свежий воздух и выбор между 300 Гц и 2K рядом с метро «Молодёжная».",
  returning: "Вернитесь в 3D АРЕНУ утром: 5 часов игры от 540 ₽.",
  default: "Спокойное утро, мощные ПК и два зала рядом с метро «Молодёжная»."
};

function dispatch(action, details = {}) {
  const payload = {
    event: "arena_event",
    action,
    page: "morning",
    segment: document.body.dataset.segment || "default",
    ...details
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
  if (window.ARENA_METRIKA_ID && typeof window.ym === "function") {
    window.ym(window.ARENA_METRIKA_ID, "reachGoal", action, payload);
  }
  if (typeof window.arenaVkTrack === "function") window.arenaVkTrack(action);
}

function initializeAnalytics() {
  const sent = new Set();

  dispatch("morning_view");
  window.addEventListener("scroll", () => {
    const ratio = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
    for (const goal of getNewScrollGoals(ratio, sent)) {
      dispatch(goal);
      sent.add(goal);
    }
  }, { passive: true });

  document.addEventListener("click", event => {
    const target = event.target.closest("[data-track]");
    if (!target) return;

    dispatch(target.dataset.track);
    event.stopImmediatePropagation();
  }, { capture: true });
}

if (typeof document !== "undefined") {
  const segment = getMorningSegment(location.search);
  const node = document.querySelector("[data-segment-copy]");

  if (node) node.textContent = copy[segment];
  document.body.dataset.segment = segment;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeAnalytics, { once: true });
  } else {
    initializeAnalytics();
  }
}
