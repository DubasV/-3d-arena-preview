const attributionKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "yclid", "rb_clickid", "gclid", "vk_click_id"];

export function buildMorningOfferUrl(search = "") {
  const source = new URLSearchParams(search);
  const target = new URL("utro/", "https://3d-arena.local/");

  attributionKeys.forEach(key => {
    const value = source.get(key);
    if (value) target.searchParams.set(key, value.slice(0, 300));
  });

  return `${target.pathname.slice(1)}${target.search}`;
}

if (typeof document !== "undefined") {
  document.querySelectorAll("[data-morning-offer]").forEach(link => {
    link.href = buildMorningOfferUrl(location.search);
  });
}
