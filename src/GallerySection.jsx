import { useEffect, useRef, useState } from "react";
import { Camera, ChevronLeft, ChevronRight, Images, RotateCcw } from "lucide-react";
import "./GallerySection.css";

import couple1 from "./assets/gallery/one.png";
import couple2 from "./assets/gallery/two.png";
import couple3 from "./assets/gallery/three.png";
import couple4 from "./assets/gallery/four.png";
import couple5 from "./assets/gallery/five.png";
import couple6 from "./assets/gallery/six.png";

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
  const lightboxRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [zoom, setZoom] = useState(1);

  const isHindi = language === "hi";

  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 1));
  const resetZoom = () => setZoom(1);

  const openPhoto = (photo) => {
    setZoom(1);
    setSelectedPhoto(photo);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
    setZoom(1);
  };

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth <= 600) {
        setVisibleCount(1);
      } else if (window.innerWidth <= 900) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const scrollCarousel = (direction) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const firstCard = carousel.querySelector(".gallery-card");
    if (!firstCard) return;

    const gap = parseFloat(getComputedStyle(carousel).columnGap) || 0;
    const distance = firstCard.getBoundingClientRect().width + gap;
    carousel.scrollBy({ left: direction * distance, behavior: "smooth" });
  };

  const handleScroll = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const firstCard = carousel.querySelector(".gallery-card");
    if (!firstCard) return;

    const gap = parseFloat(getComputedStyle(carousel).columnGap) || 0;
    const distance = firstCard.getBoundingClientRect().width + gap;
    if (distance > 0) {
      setActiveIndex(Math.round(carousel.scrollLeft / distance));
    }
  };

  const maxIndex = Math.max(0, photos.length - visibleCount);

  useEffect(() => {
    if (activeIndex > maxIndex) setActiveIndex(maxIndex);
  }, [activeIndex, maxIndex]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const firstCard = carousel.querySelector(".gallery-card");
    if (!firstCard) return;

    const gap = parseFloat(getComputedStyle(carousel).columnGap) || 0;
    const distance = firstCard.getBoundingClientRect().width + gap;
    carousel.scrollTo({ left: activeIndex * distance, behavior: "smooth" });
  }, [visibleCount]); // Keep the carousel position aligned after breakpoint changes.

  const moveLightbox = (direction) => {
    if (!selectedPhoto) return;
    const index = photos.findIndex((photo) => photo.src === selectedPhoto.src);
    setZoom(1);
    setSelectedPhoto(photos[(index + direction + photos.length) % photos.length]);
  };

  // Keep the lightbox fitted to the *visual* viewport, including when the
  // visitor has pinch-zoomed the webpage before opening the image.
  useEffect(() => {
    if (!selectedPhoto) return undefined;

    const lightbox = lightboxRef.current;
    const viewport = window.visualViewport;

    const updateVisualViewport = () => {
      if (!lightbox) return;

      if (window.visualViewport) {
        const vv = window.visualViewport;
        lightbox.style.setProperty("--lightbox-left", `${vv.offsetLeft}px`);
        lightbox.style.setProperty("--lightbox-top", `${vv.offsetTop}px`);
        lightbox.style.setProperty("--lightbox-width", `${vv.width}px`);
        lightbox.style.setProperty("--lightbox-height", `${vv.height}px`);
      } else {
        lightbox.style.setProperty("--lightbox-left", "0px");
        lightbox.style.setProperty("--lightbox-top", "0px");
        lightbox.style.setProperty("--lightbox-width", "100vw");
        lightbox.style.setProperty("--lightbox-height", "100dvh");
      }
    };

    updateVisualViewport();
    viewport?.addEventListener("resize", updateVisualViewport);
    viewport?.addEventListener("scroll", updateVisualViewport);
    window.addEventListener("resize", updateVisualViewport);

    return () => {
      viewport?.removeEventListener("resize", updateVisualViewport);
      viewport?.removeEventListener("scroll", updateVisualViewport);
      window.removeEventListener("resize", updateVisualViewport);
    };
  }, [selectedPhoto]);

  useEffect(() => {
    if (!selectedPhoto) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowRight") moveLightbox(1);
      if (event.key === "ArrowLeft") moveLightbox(-1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhoto]);

  // Lock background scrolling while preserving the exact page position.
  useEffect(() => {
    if (!selectedPhoto) return undefined;

    const scrollY = window.scrollY;
    const body = document.body;
    const html = document.documentElement;

    const previousBodyStyles = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    const previousHtmlOverflow = html.style.overflow;

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";
    html.style.overflow = "hidden";

    return () => {
      Object.assign(body.style, previousBodyStyles);
      html.style.overflow = previousHtmlOverflow;
      window.scrollTo({ top: scrollY, left: 0, behavior: "auto" });
    };
  }, [selectedPhoto]);

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
            onClick={() => scrollCarousel(-1)}
            disabled={activeIndex === 0}
            aria-label="Previous photos"
          >
            <ChevronLeft size={23} />
          </button>

          <div className="gallery-carousel" ref={carouselRef} onScroll={handleScroll}>
            {photos.map((photo) => (
              <button
                type="button"
                className="gallery-card"
                key={photo.src}
                onClick={() => openPhoto(photo)}
                aria-label={`View ${photo.alt}`}
              >
                <div className="gallery-image-wrap">
                  <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
                  <div className="gallery-image-overlay">
                    <span className="gallery-photo-number">{photo.number}</span>
                    <span className="gallery-view-label">
                      {isHindi ? "तस्वीर देखें" : "VIEW PHOTO"}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button
            type="button"
            className="gallery-arrow gallery-arrow-right"
            onClick={() => scrollCarousel(1)}
            disabled={activeIndex >= maxIndex}
            aria-label="Next photos"
          >
            <ChevronRight size={23} />
          </button>
        </div>

        <div className="gallery-bottom">
          <div className="gallery-progress">
            {photos.map((photo, index) => (
              <button
                type="button"
                key={photo.src}
                className={`gallery-dot ${index === activeIndex ? "active" : ""}`}
                onClick={() => {
                  const carousel = carouselRef.current;
                  const card = carousel?.querySelector(".gallery-card");
                  if (!carousel || !card) return;

                  const gap = parseFloat(getComputedStyle(carousel).columnGap) || 0;
                  carousel.scrollTo({
                    left: index * (card.getBoundingClientRect().width + gap),
                    behavior: "smooth",
                  });
                }}
                aria-label={`Go to photo ${index + 1}`}
              />
            ))}
          </div>

          <p className="gallery-count">
            <span>{String(Math.min(activeIndex + 1, maxIndex + 1)).padStart(2, "0")}</span>
            {" / "}
            {String(maxIndex + 1).padStart(2, "0")}
          </p>
        </div>
      </div>

      {selectedPhoto && (
        <div
          ref={lightboxRef}
          className="gallery-lightbox"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
        >
          <button
            type="button"
            className="gallery-lightbox-close"
            onClick={(event) => {
              event.stopPropagation();
              closeLightbox();
            }}
            aria-label="Close photo"
            title="Close photo"
          >
            ×
          </button>

          <button
            type="button"
            className="gallery-lightbox-arrow gallery-lightbox-prev"
            onClick={(event) => {
              event.stopPropagation();
              moveLightbox(-1);
            }}
            aria-label="Previous photo"
          >
            <ChevronLeft size={30} />
          </button>

          <img
            src={selectedPhoto.src}
            alt={selectedPhoto.alt}
            className="lightbox-image"
            style={{ transform: `scale(${zoom})` }}
            onClick={(event) => event.stopPropagation()}
            draggable="false"
          />

          <div className="gallery-zoom-controls" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={zoomOut}
              disabled={zoom <= 1}
              aria-label="Zoom out"
              title="Zoom out"
            >
              −
            </button>

            <span>{Math.round(zoom * 100)}%</span>

            <button
              type="button"
              onClick={zoomIn}
              disabled={zoom >= 3}
              aria-label="Zoom in"
              title="Zoom in"
            >
              +
            </button>

            <button
              type="button"
              className="gallery-control-reset"
              onClick={resetZoom}
              aria-label="Reset zoom"
              title="Reset zoom"
            >
              <RotateCcw size={18} />
            </button>
          </div>

          <button
            type="button"
            className="gallery-lightbox-arrow gallery-lightbox-next"
            onClick={(event) => {
              event.stopPropagation();
              moveLightbox(1);
            }}
            aria-label="Next photo"
          >
            <ChevronRight size={30} />
          </button>
        </div>
      )}
    </section>
  );
}
