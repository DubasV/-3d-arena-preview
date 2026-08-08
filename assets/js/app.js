// NAV scroll
  const nav = document.getElementById("nav");
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 60);
  });

  // Burger
  const burger = document.getElementById("burger");
  const navLinks = document.getElementById("navLinks");
  burger.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    const spans = burger.querySelectorAll("span");
    if (navLinks.classList.contains("open")) {
      spans[0].style.transform = "translateY(7px) rotate(45deg)";
      spans[1].style.opacity = "0";
      spans[2].style.transform = "translateY(-7px) rotate(-45deg)";
    } else {
      spans.forEach(s => { s.style.transform = ""; s.style.opacity = ""; });
    }
  });
  navLinks.querySelectorAll("a").forEach(l => l.addEventListener("click", () => {
    navLinks.classList.remove("open");
    burger.querySelectorAll("span").forEach(s => { s.style.transform = ""; s.style.opacity = ""; });
  }));

  // Тарифы переключатель
  document.querySelectorAll(".toggle-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".toggle-btn").forEach(b => b.classList.remove("on"));
      document.querySelectorAll(".ptable").forEach(t => t.classList.remove("on"));
      btn.classList.add("on");
      document.getElementById("tab-" + btn.dataset.tab).classList.add("on");
    });
  });

  // Reveal при скролле
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight) {
      el.style.transition = "none";
      el.classList.add("visible");
      requestAnimationFrame(() => { el.style.transition = ""; });
    } else {
      observer.observe(el);
    }
  });


  // Сохраняем только разрешённые рекламные метки и передаём их в LANGAME.
  const params = new URLSearchParams(window.location.search);
  const attribution = {};
  const attributionKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "yclid", "rb_clickid", "gclid", "vk_click_id"];
  attributionKeys.forEach(key => {
    const value = params.get(key);
    if (value) attribution[key] = value.slice(0, 300);
  });
  try {
    const saved = JSON.parse(localStorage.getItem("arena_attribution") || "{}");
    Object.assign(saved, attribution);
    if (Object.keys(saved).length) {
      localStorage.setItem("arena_attribution", JSON.stringify(saved));
      document.querySelectorAll('a[href*="langame.ru"]').forEach(link => {
        const url = new URL(link.href);
        Object.entries(saved).forEach(([key, value]) => {
          if (attributionKeys.includes(key) && value && !url.searchParams.has(key)) url.searchParams.set(key, value);
        });
        link.href = url.toString();
      });
    }
  } catch (_) {
    // Storage can be unavailable in privacy modes; booking remains usable.
  }

  // Лайтбокс галереи
  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    const lightboxImage = lightbox.querySelector(".lightbox__image");
    const closeLightbox = () => {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      lightboxImage.removeAttribute("src");
    };
    document.querySelectorAll('[data-lightbox="gallery"]').forEach(link => {
      link.addEventListener("click", event => {
        event.preventDefault();
        lightboxImage.src = link.href;
        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
      });
    });
    lightbox.querySelector(".lightbox__close").addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", event => { if (event.target === lightbox) closeLightbox(); });
    document.addEventListener("keydown", event => { if (event.key === "Escape") closeLightbox(); });
  }

  // Analytics is intentionally isolated from content: HTML remains the source of truth.
  const canonicalGoal = action => {
    if (action.includes("call")) return "booking_call";
    if (action.includes("telegram") || action === "welcome_question") return "booking_telegram";
    if (action.includes("booking")) return "langame_booking";
    return action;
  };
  const track = (action, details = {}) => {
    const goal = canonicalGoal(action);
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "arena_event", action, goal, ...details });
    if (window.ARENA_METRIKA_ID && typeof window.ym === "function") {
      window.ym(window.ARENA_METRIKA_ID, "reachGoal", action, details);
      if (goal !== action) window.ym(window.ARENA_METRIKA_ID, "reachGoal", goal, { source: action, ...details });
    }
    if (typeof window.arenaVkTrack === "function") {
      window.arenaVkTrack(action);
      if (goal !== action) window.arenaVkTrack(goal);
    }
  };

  // Offer for new guests. The declared source is stored locally and sent only
  // as an analytics event; the visitor can still book without answering.
  if (!document.getElementById("welcomePopup")) {
    const popupBookingUrl = new URL("https://langame.ru/799456996_computerniy_club_3d-arena_moskva/booking");
    try {
      const savedAttribution = JSON.parse(localStorage.getItem("arena_attribution") || "{}");
      Object.entries(savedAttribution).forEach(([key, value]) => {
        if (attributionKeys.includes(key) && value) popupBookingUrl.searchParams.set(key, value);
      });
    } catch (_) {
      // Booking remains usable when storage is unavailable.
    }
    document.body.insertAdjacentHTML("beforeend", `
      <div class="welcome-popup" id="welcomePopup" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="welcomePopupTitle">
        <div class="welcome-popup__backdrop" data-popup-close></div>
        <div class="welcome-popup__dialog">
          <button class="welcome-popup__close" type="button" aria-label="Закрыть" data-popup-close>×</button>
          <div class="welcome-popup__visual" aria-hidden="true"><span>Новый гость</span><strong>500</strong><small>бонусов</small></div>
          <div class="welcome-popup__content">
            <div class="welcome-popup__eyebrow">Первое посещение</div>
            <h2 id="welcomePopupTitle">Получите 500 бонусов за регистрацию</h2>
            <p>Пройдите полную регистрацию у администратора. Бонусами можно оплатить до 50% игрового времени и пакетов, кроме ночных.</p>
            <fieldset class="traffic-source">
              <legend>Откуда вы узнали о клубе?</legend>
              <div class="traffic-source__grid">
                <button type="button" data-source="yandex_search">Яндекс</button>
                <button type="button" data-source="yandex_maps">Яндекс Карты</button>
                <button type="button" data-source="vk">VK</button>
                <button type="button" data-source="telegram">Telegram</button>
                <button type="button" data-source="friend">Друг</button>
                <button type="button" data-source="signboard">Увидел рядом</button>
                <button type="button" data-source="other">Другое</button>
              </div>
            </fieldset>
            <div class="welcome-popup__actions">
              <a class="btn-primary" href="${popupBookingUrl.toString()}" rel="noopener" target="_blank" data-popup-action data-track="welcome_booking">Забронировать и получить бонус</a>
              <a class="btn-outline" href="https://t.me/IIIDArena" rel="noopener" target="_blank" data-popup-action data-track="welcome_question">Задать вопрос</a>
            </div>
            <div class="welcome-popup__fineprint">Для активации нужен документ, подтверждающий личность и возраст. Это необходимо для соблюдения ночных возрастных ограничений и правил продажи энергетиков.</div>
          </div>
        </div>
      </div>`);
  }

  document.querySelectorAll("[data-track]").forEach(element => {
    if (element.dataset.trackOwner) return;
    element.dataset.trackOwner = "app";
    element.addEventListener("click", () => track(element.dataset.track));
  });

  const welcomePopup = document.getElementById("welcomePopup");
  if (welcomePopup) {
    const popupParams = new URLSearchParams(window.location.search);
    const closedKey = "arena_welcome_popup_closed_at";
    const forcePopup = popupParams.get("welcome") === "1";
    const disablePopup = popupParams.get("popup") === "0";
    const lastClosed = Number(localStorage.getItem(closedKey) || 0);
    const mayShow = forcePopup || (!disablePopup && (!lastClosed || Date.now() - lastClosed > 14 * 24 * 60 * 60 * 1000));
    const openPopup = () => {
      welcomePopup.classList.add("open");
      welcomePopup.setAttribute("aria-hidden", "false");
      document.body.classList.add("popup-open");
      track("welcome_popup_open", { forced: forcePopup });
    };
    const closePopup = () => {
      welcomePopup.classList.remove("open");
      welcomePopup.setAttribute("aria-hidden", "true");
      document.body.classList.remove("popup-open");
      if (!forcePopup) localStorage.setItem(closedKey, String(Date.now()));
      track("welcome_popup_close");
    };
    welcomePopup.querySelectorAll("[data-popup-close],[data-popup-action]").forEach(element => element.addEventListener("click", closePopup));
    welcomePopup.querySelectorAll("[data-source]").forEach(button => button.addEventListener("click", () => {
      welcomePopup.querySelectorAll("[data-source]").forEach(item => item.classList.remove("selected"));
      button.classList.add("selected");
      localStorage.setItem("arena_declared_source", button.dataset.source);
      track("traffic_source_selected", { source: button.dataset.source });
    }));
    document.addEventListener("keydown", event => { if (event.key === "Escape" && welcomePopup.classList.contains("open")) closePopup(); });
    if (mayShow) window.setTimeout(openPopup, forcePopup ? 300 : 6000);
  }

  // Hall picker: progressive enhancement; all hall pages remain directly linked in HTML.
  const hallPicker = document.getElementById("hallPicker");
  if (hallPicker) {
    const result = document.getElementById("hallResult");
    const title = document.getElementById("hallResultTitle");
    const copy = document.getElementById("hallResultText");
    const details = document.getElementById("hallResultDetails");
    const options = {
      speed: { title: "Зал «Киберспорт»", text: "10 мест · 25″ · Full HD · 300 Гц", href: "esports.html", goal: "esports" },
      detail: { title: "Зал «Комфорт»", text: "10 мест · 27″ · 2K · 180 Гц", href: "comfort.html", goal: "comfort" },
      console: { title: "Зона PlayStation 5", text: "PS5 · телевизор 65″ · 4K · до 288 Гц в игровом режиме", href: "ps5.html", goal: "ps5" }
    };
    hallPicker.addEventListener("submit", event => {
      event.preventDefault();
      const data = new FormData(hallPicker);
      const selected = options[data.get("priority")] || options.speed;
      title.textContent = selected.title;
      copy.textContent = selected.text;
      details.href = selected.href;
      details.dataset.track = `select_hall_${selected.goal}_picker`;
      details.onclick = () => track(details.dataset.track);
      result.hidden = false;
      track("hall_picker_result", { hall: selected.goal, group: String(data.get("group") || "") });
      result.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }
