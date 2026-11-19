// Interacciones pequeñas para el portafolio.
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#main-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const designCarousel = document.querySelector("#diseno [data-design-carousel]");

  if (designCarousel) {
    const viewport = designCarousel.querySelector("[data-carousel-viewport]");
    const track = designCarousel.querySelector("[data-carousel-track]");
    const slides = Array.from(track.children);
    const previousButton = designCarousel.querySelector("[data-carousel-previous]");
    const nextButton = designCarousel.querySelector("[data-carousel-next]");
    const currentCount = designCarousel.querySelector("[data-carousel-current]");
    const dots = Array.from(designCarousel.querySelectorAll("[data-carousel-to]"));
    let currentIndex = 0;
    let pointerStartX = null;
    let touchStartX = null;

    const showSlide = (nextIndex) => {
      currentIndex = (nextIndex + slides.length) % slides.length;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      currentCount.textContent = String(currentIndex + 1).padStart(2, "0");

      slides.forEach((slide, index) => {
        const isCurrent = index === currentIndex;
        slide.setAttribute("aria-hidden", String(!isCurrent));
        slide.tabIndex = isCurrent ? 0 : -1;
      });

      dots.forEach((dot, index) => {
        dot.setAttribute("aria-current", String(index === currentIndex));
      });
    };

    previousButton.addEventListener("click", () => showSlide(currentIndex - 1));
    nextButton.addEventListener("click", () => showSlide(currentIndex + 1));
    dots.forEach((dot) => {
      dot.addEventListener("click", () => showSlide(Number(dot.dataset.carouselTo)));
    });

    viewport.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        showSlide(currentIndex + (event.key === "ArrowRight" ? 1 : -1));
        viewport.focus({ preventScroll: true });
      }
    });

    viewport.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      pointerStartX = event.clientX;
    });

    viewport.addEventListener("pointerup", (event) => {
      if (pointerStartX === null) return;
      const swipeDistance = event.clientX - pointerStartX;
      if (Math.abs(swipeDistance) > 45) {
        showSlide(currentIndex + (swipeDistance < 0 ? 1 : -1));
      }
      pointerStartX = null;
    });

    viewport.addEventListener("pointercancel", () => {
      pointerStartX = null;
    });

    viewport.addEventListener("touchstart", (event) => {
      touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });

    viewport.addEventListener("touchend", (event) => {
      if (touchStartX === null) return;
      const swipeDistance = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(swipeDistance) > 45) {
        showSlide(currentIndex + (swipeDistance < 0 ? 1 : -1));
      }
      touchStartX = null;
    }, { passive: true });

    viewport.addEventListener("touchcancel", () => {
      touchStartX = null;
    }, { passive: true });

    showSlide(0);
  }

  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();
});
