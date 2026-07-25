(() => {
  "use strict";
  const allowed = ["utm_source","utm_medium","utm_campaign","utm_content","utm_term","yclid","rb_clickid","gclid","vk_click_id"];
  const current = new URLSearchParams(location.search);
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem("arena_attribution") || "{}"); } catch (_) {}
  allowed.forEach(key => { const value = current.get(key); if (value) saved[key] = value.slice(0,300); });
  try { if (Object.keys(saved).length) localStorage.setItem("arena_attribution", JSON.stringify(saved)); } catch (_) {}
  document.querySelectorAll('a[href*="langame.ru"]').forEach(link => {
    const url = new URL(link.href);
    Object.entries(saved).forEach(([key,value]) => { if (allowed.includes(key) && value) url.searchParams.set(key,value); });
    link.href = url.toString();
  });
  const track = action => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({event:"arena_event",action,page:document.body.dataset.page || "landing"});
    if (window.ARENA_METRIKA_ID && typeof window.ym === "function") window.ym(window.ARENA_METRIKA_ID,"reachGoal",action);
    if (typeof window.arenaVkTrack === "function") window.arenaVkTrack(action);
  };
  document.querySelectorAll("[data-track]").forEach(link => link.addEventListener("click", () => track(link.dataset.track)));
})();
