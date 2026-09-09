/**
 * AARI WORKS — PREMIUM AARI EMBROIDERY WEBSITE
 * Testimonials Slider Module (testimonials.js)
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('testimonials-container');
  const cards = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');

  if (!cards.length) return;

  let currentIndex = 0;
  let autoplayTimer = null;
  const AUTOPLAY_INTERVAL = 6000; // 6 seconds

  const updateSliderPosition = () => {
    cards.forEach((card, index) => {
      if (window.innerWidth <= 768) {
        // On mobile, show one card at a time if slider is enabled
        card.style.display = index === currentIndex ? 'flex' : 'none';
      } else {
        // On desktop, show all 3 in grid layout
        card.style.display = 'flex';
      }
    });
  };

  const nextSlide = () => {
    currentIndex = (currentIndex + 1) % cards.length;
    updateSliderPosition();
  };

  const prevSlide = () => {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    updateSliderPosition();
  };

  const startAutoplay = () => {
    if (window.innerWidth <= 768 && !autoplayTimer) {
      autoplayTimer = setInterval(nextSlide, AUTOPLAY_INTERVAL);
    }
  };

  const stopAutoplay = () => {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  };

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      stopAutoplay();
      nextSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      stopAutoplay();
      prevSlide();
    });
  }

  if (container) {
    container.addEventListener('mouseenter', stopAutoplay);
    container.addEventListener('mouseleave', startAutoplay);
    container.addEventListener('touchstart', stopAutoplay, { passive: true });
  }

  window.addEventListener('resize', updateSliderPosition);
  updateSliderPosition();
  startAutoplay();
});
