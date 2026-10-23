import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  MapPin,
  Clock3,
  Heart,
  Menu,
  X,
  CalendarDays,
} from "lucide-react";
import { WEDDING_CONFIG } from "./config.js";

const copy = {
  nav: [
    { href: "#home", en: "Home", hi: "मुख्य पृष्ठ" },
    { href: "#story", en: "Our Story", hi: "हमारी कहानी" },
    { href: "#events", en: "Events", hi: "विवाह के कार्यक्रम" },
    { href: "#venue", en: "Venue", hi: "विवाह स्थल" },
  ],

  shayari: [
    {
      icon: "✿",
      en: "With you, every moment is a celebration, with you, life glows bright. Where would I go without you? You are my sky, my everything.",
      hi: "तुम हो तो हर पल में जश्न है, तुम हो तो ज़िंदगी रोशन है। कहाँ जाऊँगा बिन तुम्हारे मैं, तुम ही तो मेरा आसमान हो।।",
    },
    {
      icon: "❁",
      en: "Your name brings a smile to my lips, lost in your memory are all my dreams. Love doesn't happen by chance, it blooms when two hearts meet as one.",
      hi: "नाम लिया तुम्हारा तो होंठों पे खिली मुस्कान, तुम्हारी याद में खो गया हर अरमान, मोहब्बत यूँ ही नहीं होती यारों, मिलते हैं जब दो दिल एक समान।।",
    },
    {
      icon: "♥",
      en: "Not just a day, not just a celebration — a lifetime of choosing each other, again and again.",
      hi: "सिर्फ एक दिन नहीं, सिर्फ एक जश्न नहीं — हर दिन, हर पल, एक-दूसरे को चुनने का वादा।",
    },
    {
      icon: "◈",
      en: "Two families, two journeys, one beautiful beginning. May our days be filled with love and our home with laughter.",
      hi: "दो परिवार, दो सफ़र, एक खूबसूरत शुरुआत। हमारी ज़िंदगी प्यार और हमारा घर खुशियों से भरा रहे।",
    },
  ],

  events: [
    {
      id: "haldi",
      icon: "🌼",
      ribbon: ["The festivities begin", "समारोह की शुरुआत"],
      name: ["Haldi Ceremony", "हल्दी समारोह"],
      desc: [
        "A joyful celebration filled with sunshine, laughter, blessings, and shades of yellow.",
        "धूप, हँसी, आशीर्वाद और पीले रंगों से सजा खुशियों भरा समारोह।",
      ],
    },
    {
      id: "sangeet",
      icon: "🎵",
      ribbon: ["A Musical Celebration", "संगीतमय उत्सव"],
      name: ["Sangeet Night", "संगीत संध्या"],
      desc: [
        "Join us for a night of music, dance, laughter, and memories with the people we love.",
        "संगीत, नृत्य, हँसी और अपनों के साथ यादगार पलों से भरी शाम में हमारे साथ शामिल हों।",
      ],
    },
    {
      id: "reception",
      icon: "✨",
      ribbon: ["An evening of joy", "खुशियों भरी शाम"],
      name: ["Reception", "स्वागत समारोह"],
      desc: [
        "An evening of warm wishes, delicious food, music, and memories to treasure.",
        "शुभकामनाओं, स्वादिष्ट भोजन, संगीत और यादगार लम्हों से भरी शाम।",
      ],
      featured: true,
    },
  ],
};

function formatDate(date, options, locale = "en-IN") {
  return new Intl.DateTimeFormat(locale, options).format(date);
}

function getHindiTime(time) {
  if (!time) return "समय जल्द घोषित होगा";

  return time.replace(/\bAM\b/gi, "सुबह").replace(/\bPM\b/gi, "शाम");
}

function Petals() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const canvas = document.getElementById("petals-canvas");
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    let width = 0;
    let height = 0;
    let frame = 0;

    const count = window.innerWidth < 700 ? 14 : 25;
    const petals = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const makePetal = (randomY = false) => ({
      x: Math.random() * width,
      y: randomY ? Math.random() * height : -20,
      size: 3 + Math.random() * 5,
      speedY: 0.35 + Math.random() * 0.9,
      speedX: -0.35 + Math.random() * 0.7,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: -0.015 + Math.random() * 0.03,
      alpha: 0.22 + Math.random() * 0.38,
      sway: Math.random() * 0.02,
    });

    const reset = () => {
      petals.length = 0;

      for (let i = 0; i < count; i++) {
        petals.push(makePetal(true));
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      petals.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.y * p.sway) * 0.35;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = "#D8B66A";

        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.55, p.size, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (p.y > height + 20 || p.x < -20 || p.x > width + 20) {
          Object.assign(p, makePetal(false), {
            x: Math.random() * width,
          });
        }
      });

      frame = requestAnimationFrame(draw);
    };

    resize();
    reset();
    draw();

    const onResize = () => {
      resize();
      reset();
    };

    const onVisibility = () => {
      cancelAnimationFrame(frame);

      if (!document.hidden) {
        draw();
      }
    };

    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas id="petals-canvas" aria-hidden="true" />;
}

function EventCard({ event, language, index }) {
  const isHindi = language === "hi";

  // Get event details from the selected language
  const languageConfig = WEDDING_CONFIG.languages[language];
  const details = languageConfig?.events?.[event.id];

  const eventTime =
    details?.time ||
    {
      haldi: "11:00 AM",
      sangeet: "7:00 PM",
      reception: "9:00 PM",
    }[event.id];

  const venueName = details?.place || languageConfig?.venueName || "M20 Garden and Resort";

  // Format the date for the selected language
  const eventDate = details?.date
    ? new Date(`${details.date}T12:00:00`).toLocaleDateString(isHindi ? "hi-IN" : "en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <article
      className={`event-card reveal-up ${event.featured ? "featured" : ""} delay-${index}`}
      data-reveal
    >
      <div className="event-icon-wrap">
        <span className="event-icon" aria-hidden="true">
          {event.icon}
        </span>
      </div>

      <p className="event-ribbon">{event.ribbon[isHindi ? 1 : 0]}</p>

      <h3 className="event-name">{event.name[isHindi ? 1 : 0]}</h3>

      <p className="event-desc">{event.desc[isHindi ? 1 : 0]}</p>

      <div className="event-meta">
        {eventDate && (
          <div className="event-meta-item">
            <CalendarDays size={15} />
            <span>{eventDate}</span>
          </div>
        )}

        <div className="event-meta-item">
          <Clock3 size={15} />
          <span>
            {eventTime
              ? isHindi
                ? eventTime.replace(/\bAM\b/gi, "सुबह").replace(/\bPM\b/gi, "शाम")
                : eventTime
              : isHindi
                ? "समय जल्द घोषित होगा"
                : "Time to be announced"}
          </span>
        </div>

        <div className="event-meta-item">
          <MapPin size={15} />
          <span>{venueName}</span>
        </div>
      </div>
    </article>
  );
}

export default function App() {
  const [language, setLanguage] = useState(WEDDING_CONFIG.defaultLanguage === "hi" ? "hi" : "en");

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [now, setNow] = useState(Date.now());

  const weddingDate = useMemo(() => new Date(WEDDING_CONFIG.weddingDate), []);

  const validDate = !Number.isNaN(weddingDate.getTime());
  const isHindi = language === "hi";
  const locale = isHindi ? "hi-IN" : "en-IN";

  const t = (en, hi) => (isHindi ? hi : en);

  const dateText = validDate
    ? formatDate(
        weddingDate,
        {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        },
        locale,
      )
    : t("Please set the wedding date in config.js", "कृपया config.js में शादी की तारीख सेट करें");

  const mapQuery = encodeURIComponent(
    `${WEDDING_CONFIG.venueName}, ${WEDDING_CONFIG.venueAddress}`,
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    const onScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.body.classList.toggle("en-mode", language === "en");
  }, [language]);

  useEffect(() => {
    const nodes = document.querySelectorAll("[data-reveal]");

    const navSections = ["home", "story", "events", "venue"]
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("visible"));
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    nodes.forEach((node) => revealObserver.observe(node));

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );

    navSections.forEach((section) => sectionObserver.observe(section));

    return () => {
      revealObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, []);

  const daysLeft = validDate ? weddingDate.getTime() - now : NaN;
  const totalSeconds = Math.max(0, Math.floor(daysLeft / 1000));

  const countdown = {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };

  const isPast = validDate && daysLeft <= 0;

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <Petals />

      <header id="navbar" className={scrolled ? "scrolled" : ""}>
        <a
          className="nav-brand"
          href="#home"
          aria-label="Navneet and Muskan home"
          onClick={closeMenu}
        >
          N <span>&amp;</span> M
        </a>

        <button
          className="nav-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="navLinks"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <nav
          className={`nav-links ${menuOpen ? "open" : ""}`}
          id="navLinks"
          aria-label="Main navigation"
        >
          {copy.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={activeSection === item.href.slice(1) ? "active" : ""}
              aria-current={activeSection === item.href.slice(1) ? "location" : undefined}
              onClick={closeMenu}
            >
              {t(item.en, item.hi)}
            </a>
          ))}
        </nav>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-overlay" aria-hidden="true" />
          <div className="hero-particles" aria-hidden="true" />

          <div className="hero-content reveal-up" data-reveal>
            <p className="hero-subtitle">
              {t("Together with our families", "अपने परिवारों के आशीर्वाद के साथ")}
            </p>

            <div className="hero-names">
              <h1 className="groom-name">{t("Navneet", "नवनीत")}</h1>

              <div className="ampersand-wrap">
                <span className="ampersand">&amp;</span>
                <div className="rings-icon">
                  <span className="sparkle">💍</span>
                </div>
              </div>

              <h1 className="bride-name">{t("Muskan", "मुस्कान")}</h1>
            </div>

            <p className="hero-last-names">{t("Two hearts, one forever", "दो दिल, एक जीवन")}</p>

            <div className="hero-date">
              <div className="date-box">
                <span className="day">
                  {validDate ? formatDate(weddingDate, { day: "2-digit" }, locale) : "DD"}
                </span>

                <span className="month-year">
                  {validDate
                    ? formatDate(weddingDate, { month: "long", year: "numeric" }, locale)
                    : t("SET WEDDING DATE", "तारीख तय करें")}
                </span>
              </div>
            </div>

            <a className="hero-btn" href="#events">
              <span>{t("Celebrate with us", "हमारे साथ जश्न मनाएँ")}</span>
              <ArrowDown />
            </a>
          </div>

          <div className="hero-image-wrap reveal-right" data-reveal>
            <img
              className="hero-img"
              src={`${import.meta.env.BASE_URL}hero.png`}
              alt={t("Navneet and Muskan", "नवनीत और मुस्कान")}
            />
          </div>

          <a
            className="scroll-indicator"
            href="#story"
            aria-label={t("Scroll to our story", "हमारी कहानी देखें")}
          >
            <span className="scroll-dot" />
          </a>
        </section>

        <section className="story-section" id="story">
          <div className="section-header reveal-up" data-reveal>
            <p className="section-tag">
              {t("A little poetry, a lot of love", "थोड़ी शायरी, ढेर सारा प्यार")}
            </p>

            <h2 className="section-title">{t("Our Story in Shayari", "शायरी में हमारी कहानी")}</h2>

            <div className="divider">
              <span className="divider-icon">✦</span>
            </div>
          </div>

          <div className="shayari-grid">
            {copy.shayari.map((item, i) => (
              <article
                key={item.icon}
                className={`shayari-card reveal-up delay-${i + 1}`}
                data-reveal
              >
                <div className="shayari-deco">{item.icon}</div>
                <p className="shayari-text">{t(item.en, item.hi)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="events-section" id="events">
          <div className="events-bg-overlay" aria-hidden="true" />

          <div className="section-header light reveal-up" data-reveal>
            <p className="section-tag">{t("Save the moments", "यादगार पलों के लिए")}</p>

            <h2 className="section-title">{t("Wedding Celebrations", "शादी के समारोह")}</h2>

            <div className="divider">
              <span className="divider-icon">✦</span>
            </div>
          </div>

          <div className="events-grid">
            {copy.events.map((event, index) => (
              <EventCard key={event.id} event={event} language={language} index={index + 1} />
            ))}
          </div>
        </section>

        <section className="venue-section" id="venue">
          <div className="venue-container">
            <div className="venue-image reveal-left" data-reveal>
              <img
                src={`${import.meta.env.BASE_URL}decor.png`}
                alt={t("Wedding venue for Navneet and Muskan", "नवनीत और मुस्कान का विवाह स्थल")}
                loading="lazy"
              />

              <div className="venue-image-caption">
                <span>{t("OUR SPECIAL DAY", "हमारा खास दिन")}</span>
              </div>
            </div>

            <div className="venue-content reveal-right" data-reveal>
              <p className="section-tag">{t("Where we celebrate", "जश्न का खूबसूरत ठिकाना")}</p>

              <h2 className="section-title">{t("A Beautiful Beginning", "एक खूबसूरत शुरुआत")}</h2>

              <div className="divider">
                <span className="divider-icon">✦</span>
              </div>

              <p className="venue-description">
                {t(
                  "With the blessings of our families, we invite you to join us as we celebrate the beginning of our forever in a beautiful setting filled with love, laughter, and cherished memories.",
                  "अपने परिवारों के आशीर्वाद के साथ, हम आपको अपने जीवन की इस खूबसूरत शुरुआत में शामिल होने के लिए सादर आमंत्रित करते हैं।",
                )}
              </p>

              <div className="venue-details">
                <div className="venue-detail">
                  <span className="venue-detail-icon">
                    <Heart />
                  </span>

                  <div>
                    <h3>{t("Wedding Day", "विवाह का दिन")}</h3>
                    <p>{dateText}</p>
                  </div>
                </div>

                <div className="venue-detail">
                  <span className="venue-detail-icon">
                    <MapPin />
                  </span>

                  <div>
                    <h3>{t("Venue", "विवाह स्थल")}</h3>

                    <p>
                      {isHindi
                        ? `${WEDDING_CONFIG.languages.hi.venueName}, ${WEDDING_CONFIG.languages.hi.venueAddress}`
                        : `${WEDDING_CONFIG.languages.en.venueName}, ${WEDDING_CONFIG.languages.en.venueAddress}`}
                    </p>
                  </div>
                </div>

                <div className="venue-detail">
                  <span className="venue-detail-icon">
                    <Clock3 />
                  </span>

                  <div>
                    <h3>{t("Ceremony Time", "समारोह का समय")}</h3>

                    <p>
                      {isHindi
                        ? WEDDING_CONFIG.languages.hi.ceremonyTime
                        : WEDDING_CONFIG.languages.en.ceremonyTime}
                    </p>
                  </div>
                </div>
              </div>

              <a
                className="venue-btn"
                href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{t("Get Directions", "रास्ता देखें")}</span>
                <ArrowUpRight />
              </a>
            </div>
          </div>
        </section>

        <section className="countdown-section" id="countdown">
          <div className="section-header reveal-up" data-reveal>
            <p className="section-tag">{t("The countdown begins", "उल्टी गिनती शुरू")}</p>

            <h2 className="section-title">{t("Until We Say “I Do”", "उस खास पल तक")}</h2>

            <div className="divider">
              <span className="divider-icon">✦</span>
            </div>
          </div>

          <div
            className="countdown-grid reveal-up"
            data-reveal
            aria-label={t("Wedding countdown", "शादी की उलटी गिनती")}
          >
            {["days", "hours", "minutes", "seconds"].map((unit, i) => (
              <div className="countdown-unit" key={unit}>
                <div className="countdown-box">
                  <span className="count-num">
                    {validDate ? String(countdown[unit]).padStart(2, "0") : "--"}
                  </span>

                  <span className="count-label">
                    {t(
                      {
                        days: "Days",
                        hours: "Hours",
                        minutes: "Minutes",
                        seconds: "Seconds",
                      }[unit],
                      {
                        days: "दिन",
                        hours: "घंटे",
                        minutes: "मिनट",
                        seconds: "सेकंड",
                      }[unit],
                    )}
                  </span>
                </div>

                {i < 3 && <span className="countdown-separator">:</span>}
              </div>
            ))}
          </div>

          <p className="countdown-note reveal-up" data-reveal>
            {!validDate
              ? t(
                  "Please set the wedding date in config.js",
                  "कृपया config.js में शादी की तारीख सेट करें",
                )
              : isPast
                ? t("Today marks the beginning of forever!", "आज से हमेशा साथ रहने की शुरुआत!")
                : t("A lifetime of love awaits", "प्यार भरी ज़िंदगी हमारा इंतज़ार कर रही है")}
          </p>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-mandala" aria-hidden="true">
          <span className="mandala-ring r1" />
          <span className="mandala-ring r2" />
          <span className="mandala-ring r3" />
          <span className="mandala-center">N &amp; M</span>
        </div>

        <p className="footer-names">
          {t("Navneet", "नवनीत")} <span>&amp;</span> {t("Muskan", "मुस्कान")}
        </p>

        <p className="footer-date">
          {validDate
            ? formatDate(weddingDate, { day: "numeric", month: "long", year: "numeric" }, locale)
            : t("Together forever", "सदा के लिए साथ")}
        </p>

        <p className="footer-quote">
          {t(
            "“Two souls, one heart, one beautiful forever.”",
            "“दो रूहें, एक दिल, एक खूबसूरत हमेशा”",
          )}
        </p>

        <div className="footer-divider" />

        <p className="footer-copy">
          {t("MADE WITH LOVE · NAVNEET & MUSKAN", "प्यार से बनाया गया · नवनीत और मुस्कान")}
        </p>
      </footer>

      <button
        className="lang-fab"
        type="button"
        aria-label={t("Switch to Hindi", "Switch to English")}
        onClick={() => setLanguage((current) => (current === "en" ? "hi" : "en"))}
      >
        {language === "en" ? <span>🇮🇳 हिंदी</span> : <span>🇬🇧 English</span>}
      </button>
    </>
  );
}
