(() => {
  "use strict";
  if (document.documentElement.dataset.release06 === "ready") return;
  document.documentElement.dataset.release06 = "ready";

  const PHONE_HREF = "tel:+79259359344";
  const PHONE_TEXT = "+7 (925) 935-93-44";
  const LANGAME_URL = "https://langame.ru/799456996_computerniy_club_3d-arena_moskva";
  const TELEGRAM_URL = "https://t.me/IIIDArena";
  const VK_URL = "https://vk.com/3d_arena";
  const BOOKING_URL = `${LANGAME_URL}/booking`;

  const style = document.createElement("link");
  style.rel = "stylesheet";
  style.href = "assets/css/release-06.css?v=20260720-4";
  document.head.appendChild(style);

  document.querySelectorAll('a[href="tel:+79774192736"]').forEach(link => {
    link.href = PHONE_HREF;
    if (link.textContent.trim().startsWith("+7")) link.textContent = PHONE_TEXT;
  });

  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = "Компьютерный клуб «3D АРЕНА» у метро Молодёжная: 20 игровых мест, два зала, RTX 5060, PS5, работа 24/7. Новым гостям — 500 бонусов при регистрации.";

  const addMeta = (attribute, name, content) => {
    let meta = document.querySelector(`meta[${attribute}="${name}"]`);
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute(attribute, name);
      document.head.appendChild(meta);
    }
    meta.content = content;
  };
  addMeta("name", "theme-color", "#070A12");
  addMeta("property", "og:title", "3D АРЕНА — компьютерный клуб у метро Молодёжная");
  addMeta("property", "og:description", "20 игровых мест, два зала, RTX 5060, PS5, работа 24/7 и 500 бонусов новым гостям.");
  addMeta("property", "og:type", "website");
  addMeta("property", "og:url", "https://3d-arena.ru/");
  addMeta("property", "og:image", "https://3d-arena.ru/images/gallery/hall-02.jpg");
  addMeta("name", "twitter:card", "summary_large_image");

  if (!document.getElementById("arenaStructuredData")) {
    const structuredData = document.createElement("script");
    structuredData.id = "arenaStructuredData";
    structuredData.type = "application/ld+json";
    structuredData.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Компьютерный клуб 3D АРЕНА",
      url: "https://3d-arena.ru/",
      telephone: "+7 925 935-93-44",
      image: "https://3d-arena.ru/images/gallery/hall-02.jpg",
      priceRange: "₽₽",
      openingHours: "Mo-Su 00:00-23:59",
      address: { "@type": "PostalAddress", streetAddress: "Оршанская улица, 9", addressLocality: "Москва", addressCountry: "RU" },
      sameAs: ["https://vk.com/3d_arena", TELEGRAM_URL, "https://yandex.ru/maps/org/3d_arena/107910722858/"]
    });
    document.head.appendChild(structuredData);
  }

  const pricePlaceholder = document.querySelector(".price-update");
  if (pricePlaceholder) {
    pricePlaceholder.outerHTML = `
      <p class="prices__lead reveal visible">Стоимость зависит от зала, времени и пакета. Ниже — ключевые условия; точную цену на выбранное время смотрите в LANGAME.</p>
      <div class="price-highlights">
        <article class="price-card price-card--night reveal visible">
          <div class="price-card__tag">Ночной пакет</div>
          <div class="price-card__price">800 ₽</div>
          <div class="price-card__period">12 часов · 21:00–09:00</div>
          <ul class="price-card__list"><li>RTX 5060 и клубные аккаунты</li><li>Подходит для длинной ночной сессии</li><li>Ночной пакет бонусами не оплачивается</li></ul>
          <a class="price-card__cta" data-track="night_package_booking" href="#booking">Забронировать ночь</a>
        </article>
        <article class="price-card reveal visible">
          <div class="price-card__tag">Полный прайс</div><h3>Залы и пакеты</h3>
          <p>Выберите зал «Киберспорт» или «Комфорт», дату и продолжительность — LANGAME покажет актуальную стоимость до бронирования.</p>
          <div class="price-card__actions"><a class="btn-primary" data-track="langame_prices" href="${LANGAME_URL}" rel="noopener" target="_blank">Открыть LANGAME</a><a class="btn-outline" href="${PHONE_HREF}">Позвонить</a></div>
        </article>
        <article class="price-card reveal visible">
          <div class="price-card__tag">Бонусная оплата</div><h3>До 50% стоимости бонусами</h3>
          <p>Бонусами можно оплачивать игровое время и пакеты в пропорции 50/50 с рублями. Исключение — ночные пакеты.</p>
          <a class="price-card__cta" href="#loyalty">Как получать больше бонусов</a>
        </article>
      </div>
      <div class="price-note reveal visible">Актуальные условия и наличие мест подтверждаются в LANGAME или у администратора.</div>`;
  }

  const bookingWays = document.querySelector("#booking .booking__ways");
  if (bookingWays) {
    bookingWays.innerHTML = `
      <div class="bw-card bw-card--primary reveal visible">
        <div class="bw-card__tag">Самый быстрый способ</div><h3>Забронировать в LANGAME</h3>
        <p>Выберите зал, соседние места и время. Перед подтверждением вы увидите актуальную стоимость.</p>
        <div class="bw-btns"><a class="bw-btn--accent" data-track="langame_booking" href="${BOOKING_URL}" rel="noopener" target="_blank">Выбрать место</a><a href="${LANGAME_URL}" rel="noopener" target="_blank">Страница клуба</a></div>
      </div>
      <div class="bw-card reveal visible">
        <div class="bw-card__tag">Поможет администратор</div><h3>Позвонить или написать</h3>
        <p>Сообщите дату, время и количество гостей — подберём подходящий зал и места рядом.</p>
        <div class="bw-btns"><a data-track="booking_call" href="${PHONE_HREF}">${PHONE_TEXT}</a><a data-track="booking_telegram" href="${TELEGRAM_URL}" rel="noopener" target="_blank">Telegram</a></div>
      </div>`;
  }

  const promoInner = document.querySelector("#promo .promo__inner");
  if (promoInner) {
    promoInner.innerHTML = `
      <div class="sec-label reveal visible">Акции</div>
      <h2 class="sec-title reveal visible">Больше игры — <em>меньше расходов</em></h2>
      <p class="promo__lead reveal visible">Действующие предложения клуба. Начисление бонусов подтверждает администратор.</p>
      <div class="promo__grid">
        <article class="pcard pcard--hot reveal visible"><div class="pcard-tag">Новым гостям</div><div class="pcard-icon">500</div><h3 class="pcard-title">500 бонусов за регистрацию</h3><p class="pcard-text">Пройдите полную регистрацию у администратора с подтверждением личности и возраста — после этого стартовые бонусы станут доступны.</p><a class="pcard-cta" data-track="promo_registration_500" href="#booking">Получить бонус</a></article>
        <article class="pcard reveal visible"><div class="pcard-tag">Приглашение</div><div class="pcard-icon">100</div><h3 class="pcard-title">100 бонусов за друга</h3><p class="pcard-text">Приглашайте нового гостя и получайте бонусы. Детали начисления уточняйте у администратора клуба.</p><a class="pcard-cta" data-track="promo_friend_100" href="${TELEGRAM_URL}" rel="noopener" target="_blank">Уточнить условия</a></article>
        <article class="pcard reveal visible"><div class="pcard-tag">Сообщества клуба</div><div class="pcard-icon">200</div><h3 class="pcard-title">До 200 бонусов за подписки</h3><p class="pcard-text">Получите 100 бонусов за подписку на Telegram и ещё 100 бонусов за подписку на VK. Подтверждение подписок покажите администратору.</p><div class="pcard-links"><a class="pcard-cta" data-track="promo_telegram_100" href="${TELEGRAM_URL}" rel="noopener" target="_blank">Telegram</a><a class="pcard-cta" data-track="promo_vk_100" href="${VK_URL}" rel="noopener" target="_blank">VK</a></div></article>
      </div>
      <div class="promo__note reveal visible">Бонусами можно оплатить до 50% игрового времени и пакетов. Ночные пакеты бонусами не оплачиваются. Для активации бонусов требуется полная регистрация у администратора с подтверждением личности и возраста.</div>`;
  }

  const promoSection = document.getElementById("promo");
  if (promoSection && !document.getElementById("loyalty")) {
    promoSection.insertAdjacentHTML("afterend", `
      <section class="section loyalty" id="loyalty"><div class="loyalty__inner">
        <div class="sec-label reveal visible">Программа лояльности</div><h2 class="sec-title reveal visible">Пополняйте баланс — <em>получайте больше</em></h2>
        <div class="loyalty__rule reveal visible"><strong>50/50</strong><span>До половины стоимости игрового времени и пакетов можно закрыть бонусами, остальное — рублями. Ночные пакеты не участвуют.</span></div>
        <div class="loyalty__grid">
          <article class="loyalty-card reveal visible"><div class="loyalty-card__head"><div><span>Автобонусы</span><h3>За разовое пополнение</h3></div><b>Бонус</b></div><div class="loyalty-row"><span>от 1 000 ₽</span><strong>+150</strong></div><div class="loyalty-row"><span>от 2 000 ₽</span><strong>+350</strong></div><div class="loyalty-row"><span>от 3 000 ₽</span><strong>+600</strong></div><div class="loyalty-row"><span>от 4 000 ₽</span><strong>+900</strong></div><div class="loyalty-row"><span>от 5 000 ₽</span><strong>+1 250</strong></div></article>
          <article class="loyalty-card reveal visible"><div class="loyalty-card__head"><div><span>Накопительная система</span><h3>Постоянная скидка</h3></div><b>Скидка</b></div><div class="loyalty-row"><span>от 5 000 ₽</span><strong>1%</strong></div><div class="loyalty-row"><span>от 10 001 ₽</span><strong>2%</strong></div><div class="loyalty-row"><span>от 20 001 ₽</span><strong>3%</strong></div><div class="loyalty-row"><span>от 30 001 ₽</span><strong>4%</strong></div><div class="loyalty-row"><span>от 40 001 ₽</span><strong>5%</strong></div></article>
        </div>
        <div class="status-block reveal visible"><div><span class="status-block__label">Статусы игрока</span><h3>Путь от новичка до легенды</h3></div><div class="status-list"><span>Новичок клуба</span><span>Постоянный игрок</span><span>Продвинутый геймер</span><span>Элита арены</span><span>Легенда клуба</span></div></div>
      </div></section>`);
  }

  const faqList = document.querySelector("#faq .faq__list");
  if (faqList && !faqList.querySelector('[data-faq="bonuses"]')) {
    faqList.insertAdjacentHTML("beforeend", `<details class="faq__item" data-faq="bonuses"><summary>Как активировать и использовать бонусы?</summary><p>Сначала пройдите полную регистрацию у администратора и предъявите любой документ, подтверждающий личность и возраст. После активации бонусами можно оплатить до 50% стоимости игрового времени и пакетов, вторую половину — рублями. Для ночных пакетов бонусная оплата не действует.</p></details><details class="faq__item" data-faq="topup"><summary>Как получить автобонус за пополнение?</summary><p>Бонус начисляется при разовом пополнении от 1 000 ₽. Чем выше сумма пополнения, тем больше бонус — до 1 250 бонусов при пополнении от 5 000 ₽.</p></details>`);
  }

  const track = (action, details = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "arena_event", action, ...details });
    const id = window.ARENA_METRIKA_ID;
    if (id && typeof window.ym === "function") {
      window.ym(id, "reachGoal", action, details);
      if (action.includes("booking") && action !== "langame_booking") window.ym(id, "reachGoal", "langame_booking", { source: action, ...details });
    }
    if (typeof window.arenaVkTrack === "function") window.arenaVkTrack(action);
  };
  const storedUtm = (() => {
    try { return JSON.parse(localStorage.getItem("arena_utm") || "{}"); }
    catch { return {}; }
  })();
  if (!sessionStorage.getItem("arena_page_view")) {
    sessionStorage.setItem("arena_page_view", "1");
    track("page_view", { path: location.pathname, referrer: document.referrer || "direct", ...storedUtm });
  }
  document.querySelectorAll("[data-track]").forEach(element => {
    if (element.dataset.release06Tracked) return;
    element.dataset.release06Tracked = "1";
    element.addEventListener("click", () => track(element.dataset.track));
  });
  document.querySelectorAll(".faq__item").forEach((item, index) => item.addEventListener("toggle", () => {
    if (item.open) track("faq_open", { item: item.dataset.faq || String(index + 1) });
  }));
  const reached = new Set();
  const trackDepth = () => {
    const pageHeight = document.documentElement.scrollHeight - innerHeight;
    if (pageHeight <= 0) return;
    const depth = Math.round((scrollY / pageHeight) * 100);
    [50, 90].forEach(mark => {
      if (depth >= mark && !reached.has(mark)) { reached.add(mark); track(`scroll_${mark}`); }
    });
  };
  addEventListener("scroll", trackDepth, { passive: true });

  if (!document.getElementById("welcomePopup")) {
    document.body.insertAdjacentHTML("beforeend", `
      <div class="welcome-popup" id="welcomePopup" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="welcomePopupTitle"><div class="welcome-popup__backdrop" data-popup-close></div><div class="welcome-popup__dialog"><button class="welcome-popup__close" type="button" aria-label="Закрыть" data-popup-close>×</button><div class="welcome-popup__visual" aria-hidden="true"><span>Новый гость</span><strong>500</strong><small>бонусов</small></div><div class="welcome-popup__content"><div class="welcome-popup__eyebrow">Первое посещение</div><h2 id="welcomePopupTitle">Получите 500 бонусов за регистрацию</h2><p>Пройдите полную регистрацию у администратора. Бонусами можно оплатить до 50% игрового времени и пакетов, кроме ночных.</p><fieldset class="traffic-source"><legend>Откуда вы узнали о клубе?</legend><div class="traffic-source__grid"><button type="button" data-source="yandex_search">Яндекс</button><button type="button" data-source="yandex_maps">Яндекс Карты</button><button type="button" data-source="vk">VK</button><button type="button" data-source="telegram">Telegram</button><button type="button" data-source="friend">Друг</button><button type="button" data-source="signboard">Увидел рядом</button><button type="button" data-source="other">Другое</button></div></fieldset><div class="welcome-popup__actions"><a class="btn-primary" href="${BOOKING_URL}" rel="noopener" target="_blank" data-popup-action data-track="welcome_booking">Забронировать и получить бонус</a><a class="btn-outline" href="${TELEGRAM_URL}" rel="noopener" target="_blank" data-popup-action data-track="welcome_question">Задать вопрос</a></div><div class="welcome-popup__fineprint">Для активации нужен документ, подтверждающий личность и возраст. Это необходимо для соблюдения ночных возрастных ограничений и правил продажи энергетиков.</div></div></div></div>`);
  }

  const popup = document.getElementById("welcomePopup");
  if (popup) {
    const params = new URLSearchParams(window.location.search);
    const key = "arena_welcome_popup_closed_at";
    const force = params.get("welcome") === "1";
    const disabled = params.get("popup") === "0";
    const lastClosed = Number(localStorage.getItem(key) || 0);
    const mayShow = force || (!disabled && (!lastClosed || Date.now() - lastClosed > 14 * 24 * 60 * 60 * 1000));
    const open = () => { popup.classList.add("open"); popup.setAttribute("aria-hidden", "false"); document.body.classList.add("popup-open"); track("welcome_popup_open", { forced: force }); };
    const close = () => { popup.classList.remove("open"); popup.setAttribute("aria-hidden", "true"); document.body.classList.remove("popup-open"); if (!force) localStorage.setItem(key, String(Date.now())); track("welcome_popup_close"); };
    popup.querySelectorAll("[data-popup-close],[data-popup-action]").forEach(element => element.addEventListener("click", close));
    popup.querySelectorAll("[data-source]").forEach(button => button.addEventListener("click", () => { popup.querySelectorAll("[data-source]").forEach(item => item.classList.remove("selected")); button.classList.add("selected"); localStorage.setItem("arena_declared_source", button.dataset.source); track("traffic_source_selected", { source: button.dataset.source }); }));
    document.addEventListener("keydown", event => { if (event.key === "Escape" && popup.classList.contains("open")) close(); });
    if (mayShow) window.setTimeout(open, force ? 300 : 6000);
  }
})();
