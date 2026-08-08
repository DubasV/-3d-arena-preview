const allowedSegments = new Set(["student", "shift", "local", "competitor", "returning"]);
const sourceCodes = {
  student: "UTRO-STUDENT",
  shift: "UTRO-SHIFT",
  local: "UTRO-LOCAL",
  competitor: "UTRO-COMP",
  returning: "UTRO-RETURN",
  default: "UTRO-WEB"
};

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

export function getMorningSourceCode(search = "") {
  return sourceCodes[getMorningSegment(search)];
}

export function getNewDisclosureGoals(isOpen, sent) {
  const goal = "morning_bonus_terms";
  return isOpen && !sent.has(goal) ? [goal] : [];
}

const copy = {
  student: "Нет первой пары или появилось окно? Проведите его за игрой рядом с метро «Молодёжная».",
  shift: "После смены: 5 часов игры от 540 ₽ в двух залах у метро «Молодёжная».",
  local: "Свободное утро рядом с домом: два игровых зала и 5 часов игры от 540 ₽.",
  competitor: "Выбирайте свой формат: 300 Гц или 2K и 5 часов игры от 540 ₽ рядом с метро «Молодёжная».",
  returning: "Вернитесь в 3D АРЕНУ утром: 5 часов игры от 540 ₽.",
  default: "Два игровых зала у метро «Молодёжная»: 300 Гц или 2K."
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
  const disclosureGoals = new Set();

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

  document.querySelectorAll("details[data-track-on-open]").forEach(details => {
    details.addEventListener("toggle", () => {
      for (const goal of getNewDisclosureGoals(details.open, disclosureGoals)) {
        dispatch(goal);
        disclosureGoals.add(goal);
      }
    });
  });

  const copyButton = document.querySelector("[data-copy-source]");
  const sourceCodeNode = document.querySelector("[data-source-code]");
  if (copyButton && sourceCodeNode && navigator.clipboard?.writeText) {
    copyButton.addEventListener("click", async () => {
      await navigator.clipboard.writeText(sourceCodeNode.textContent);
      copyButton.textContent = "Код скопирован";
      dispatch("morning_source_copy", { sourceCode: sourceCodeNode.textContent });
    });
  }
}

if (typeof document !== "undefined") {
  const segment = getMorningSegment(location.search);
  const node = document.querySelector("[data-segment-copy]");
  const sourceCodeNode = document.querySelector("[data-source-code]");

  if (node) node.textContent = copy[segment];
  if (sourceCodeNode) sourceCodeNode.textContent = sourceCodes[segment];
  document.body.dataset.segment = segment;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeAnalytics, { once: true });
  } else {
    initializeAnalytics();
  }
}
