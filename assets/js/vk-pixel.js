(() => {
  const pixelId = String(window.ARENA_VK_PIXEL_ID || "").trim();
  if (!pixelId) return;
  const queue = [];
  let pixel = null;
  const normalize = value => String(value || "event").toLowerCase().replace(/[^a-z0-9_-]+/g, "_").slice(0, 64);
  window.arenaVkTrack = action => { const eventName = normalize(action); if (pixel) pixel.Event(eventName); else queue.push(eventName); };
  const previousInit = window.vkAsyncInit;
  window.vkAsyncInit = () => {
    if (typeof previousInit === "function") previousInit();
    if (!window.VK || !window.VK.Pixel) return;
    pixel = new window.VK.Pixel(pixelId);
    pixel.Hit();
    queue.splice(0).forEach(eventName => pixel.Event(eventName));
  };
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://vk.com/js/api/openapi.js?159";
  document.head.appendChild(script);
})();
