import { useEffect, useRef, useState } from "react";
import { Camera, ChevronLeft, ChevronRight, Images } from "lucide-react";
import "./GallerySection.css";

import couple1 from "./assets/gallery/one.webp";
import couple2 from "./assets/gallery/two.webp";
import couple3 from "./assets/gallery/three.webp";
import couple4 from "./assets/gallery/four.webp";
import couple5 from "./assets/gallery/five.webp";
import couple6 from "./assets/gallery/six.webp";

const photos = [
  { src: couple1, alt: "A beautiful couple moment", number: "01" },
  { src: couple2, alt: "Wedding memories", number: "02" },
  { src: couple3, alt: "A romantic moment", number: "03" },
  { src: couple4, alt: "Celebrating together", number: "04" },
  { src: couple5, alt: "Beautiful wedding memories", number: "05" },
  { src: couple6, alt: "A moment to remember", number: "06" },
];

export default function GallerySection({ language = "en" }) {
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const isHindi = language === "hi";
  const maxIndex = Math.max(0, photos.length - visibleCount);

  const getStep = () => {
    const carousel = carouselRef.current;
    const firstCard = carousel?.querySelector(".gallery-card");
    if (!carousel || !firstCard) return 0;
    const gap = parseFloat(getComputedStyle(carousel).columnGap) || 0;
    return firstCard.getBoundingClientRect().width + gap;
  };

  const goToIndex = (index, behavior = "smooth") => {
    const carousel = carouselRef.current;
    const step = getStep();
    if (!carousel || !step) return;
    const target = Math.max(0, Math.min(index, maxIndex));
    setActiveIndex(target);
    carousel.scrollTo({ left: target * step, behavior });
  };

  const handleScroll = () => {
    const carousel = carouselRef.current;
    const step = getStep();
    if (!carousel || !step) return;
    setActiveIndex(Math.max(0, Math.min(Math.round(carousel.scrollLeft / step), maxIndex)));
  };

  useEffect(() => {
    const updateVisibleCount = () => {
      const width = window.innerWidth;
      setVisibleCount(width <= 600 ? 1 : width <= 900 ? 2 : 3);
    };
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const firstCard = carousel.querySelector(".gallery-card");
    if (!firstCard) return;
    const gap = parseFloat(getComputedStyle(carousel).columnGap) || 0;
    const step = firstCard.getBoundingClientRect().width + gap;
    const target = Math.min(activeIndex, maxIndex);
    carousel.scrollTo({ left: target * step, behavior: "instant" });
    if (target !== activeIndex) setActiveIndex(target);
    // Align carousel only when the number of visible cards changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleCount, maxIndex]);

  return (
    <section id="gallery" className="gallery-section">
      <div className="gallery-container">
        <div className="gallery-heading">
          <span className="gallery-eyebrow">
            <Camera size={15} />
            {isHindi ? "हमारी यादें" : "OUR MEMORIES"}
          </span>
          <h2 className="gallery-title">
            {isHindi ? (
              <>
                खूबसूरत <span>यादें</span>
              </>
            ) : (
              <>
                Moments to <span>Cherish</span>
              </>
            )}
          </h2>
          <p className="gallery-description">
            {isHindi
              ? "हमारे खूबसूरत सफर की कुछ अनमोल झलकियाँ"
              : "A collection of little moments, beautiful memories, and a love story worth celebrating."}
          </p>
          <div className="gallery-heading-divider">
            <span />
            <Images size={17} />
            <span />
          </div>
        </div>

        <div className="gallery-carousel-wrapper">
          <button
            type="button"
            className="gallery-arrow gallery-arrow-left"
            onClick={() => goToIndex(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous photos"
          >
            <ChevronLeft size={23} />
          </button>

          <div className="gallery-carousel" ref={carouselRef} onScroll={handleScroll}>
            {photos.map((photo) => (
              <div className="gallery-card" key={photo.src}>
                <div className="gallery-image-wrap">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    decoding="async"
                    draggable="false"
                  />
                  <div className="gallery-image-overlay">
                    <span className="gallery-photo-number">{photo.number}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="gallery-arrow gallery-arrow-right"
            onClick={() => goToIndex(activeIndex + 1)}
            disabled={activeIndex >= maxIndex}
            aria-label="Next photos"
          >
            <ChevronRight size={23} />
          </button>
        </div>

        <div className="gallery-bottom">
          <div className="gallery-progress">
            {Array.from({ length: maxIndex + 1 }, (_, index) => (
              <button
                type="button"
                key={index}
                className={`gallery-dot ${index === activeIndex ? "active" : ""}`}
                onClick={() => goToIndex(index)}
                aria-label={`Go to gallery position ${index + 1}`}
                aria-current={index === activeIndex ? "true" : undefined}
              />
            ))}
          </div>
          <p className="gallery-count">
            <span>{String(activeIndex + 1).padStart(2, "0")}</span>
            {" / "}
            {String(maxIndex + 1).padStart(2, "0")}
          </p>
        </div>
      </div>
    </section>
  );
}
