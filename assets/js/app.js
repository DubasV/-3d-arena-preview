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


  // Сохраняем UTM-метки для будущей аналитики и попапа
  const params = new URLSearchParams(window.location.search);
  const utm = {};
  ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach(key => {
    const value = params.get(key);
    if (value) utm[key] = value;
  });
  if (Object.keys(utm).length) localStorage.setItem("arena_utm", JSON.stringify(utm));

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

  // Release 06: confirmed prices, promotions, loyalty and first-visit offer.
  const release06 = document.createElement("script");
  release06.src = "assets/js/release-06.js?v=20260720-5";
  release06.defer = true;
  document.body.appendChild(release06);
