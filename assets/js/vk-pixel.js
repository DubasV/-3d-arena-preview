(() => {
  const pixelId = String(window.ARENA_VK_PIXEL_ID || "").trim();
  if (!pixelId) return;

  const normalize = value => String(value || "event").toLowerCase().replace(/[^a-z0-9_-]+/g, "_").slice(0, 64);

  window._tmr = window._tmr || [];
  window.arenaVkTrack = action => {
    window._tmr.push({ id: pixelId, type: "reachGoal", goal: normalize(action) });
  };
})();
