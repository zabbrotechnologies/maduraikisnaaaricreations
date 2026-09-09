/**
 * AARI WORKS — PREMIUM AARI EMBROIDERY WEBSITE
 * Cinematic 3D Movie-Card Stack Carousel & Combined Scroll Motion Engine (gallery.js)
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const allCards = Array.from(document.querySelectorAll('.gallery-card'));
  const gallerySection = document.getElementById('gallery');
  const galleryTrack = document.getElementById('gallery-track');
  const galleryPrev = document.getElementById('gallery-prev');
  const galleryNext = document.getElementById('gallery-next');

  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxMeta = document.getElementById('lightbox-meta');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let activeCategoryCards = [...allCards];
  let activeIndex = 0;
  let targetScrollRank = 0;
  let currentScrollRank = 0;
  let autoPlayTimer = null;
  let isDragging = false;
  let startX = 0;
  let currentDragOffset = 0;

  // --------------------------------------------------------------------------
  // 1. 3D MOVIE-CARD CAROUSEL RECALCULATION ENGINE
  // --------------------------------------------------------------------------
  const update3DCarousel = (customOffset = 0) => {
    if (!activeCategoryCards || activeCategoryCards.length === 0) return;

    const isMobile = window.innerWidth <= 640;
    const stepX = isMobile ? 140 : 230; // Horizontal pixel shift between card ranks
    const baseRank = isDragging ? activeIndex : currentScrollRank;

    // Convert pixel drag offset into fractional card rank shift
    const fractionalShift = customOffset / (stepX * 1.15);

    activeCategoryCards.forEach((card, index) => {
      // Calculate continuous offset relative to base active rank
      const effOffset = (index - baseRank) + fractionalShift;
      const absOffset = Math.abs(effOffset);

      // Hide cards that are far outside visible view (rank offset >= 3.5)
      if (absOffset >= 3.5) {
        card.style.opacity = '0';
        card.style.pointerEvents = 'none';
        card.style.transform = `translate3d(${effOffset > 0 ? 550 : -550}px, 0px, -300px) scale(0.4) rotateY(${effOffset > 0 ? -60 : 60}deg)`;
        card.classList.remove('is-active-poster');
        return;
      }

      // 3D Perspective Transformations
      const translateX = effOffset * stepX;
      const translateZ = Math.round(120 - absOffset * 105);
      
      // Y-axis perspective rotation: left cards face right (+Y), right cards face left (-Y)
      let rotateY = effOffset * -28;
      if (rotateY > 65) rotateY = 65;
      if (rotateY < -65) rotateY = -65;

      const scale = Math.max(0.45, 1.05 - absOffset * 0.16);
      const opacity = Math.max(0, 1 - absOffset * 0.32);
      const brightness = Math.max(0.25, 1.08 - absOffset * 0.28);
      const contrast = Math.max(0.85, 1.05 - absOffset * 0.08);
      const zIndex = Math.round(100 - absOffset * 15);

      // Active center card spotlight state
      if (absOffset < 0.45) {
        card.classList.add('is-active-poster');
        activeIndex = index;
      } else {
        card.classList.remove('is-active-poster');
      }

      // Apply 3D matrix properties
      card.style.display = 'block';
      card.style.pointerEvents = 'auto';
      card.style.zIndex = zIndex;
      card.style.opacity = opacity;
      card.style.filter = `brightness(${brightness}) contrast(${contrast})`;
      card.style.transform = `translate3d(${translateX}px, 0px, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
    });
  };

  // --------------------------------------------------------------------------
  // 2. COMBINED SMOOTH PAGE SCROLL 3D CAROUSEL MOTION
  // --------------------------------------------------------------------------
  const updateScrollLinkedCarousel = () => {
    if (!gallerySection || isDragging) return;

    const rect = gallerySection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Check if gallery section is visible in viewport
    if (rect.top <= windowHeight && rect.bottom >= 0) {
      const scrollableRange = rect.height + windowHeight * 0.4;
      const scrollPosition = windowHeight - rect.top;
      const progress = Math.max(0, Math.min(1, scrollPosition / scrollableRange));

      // Calculate target card rank based on scroll depth
      targetScrollRank = progress * (activeCategoryCards.length - 1);
    }
  };

  // Smooth LERP loop for silky scroll transitions
  const renderLoop = () => {
    if (!isDragging) {
      // Linear interpolation towards target scroll rank
      currentScrollRank += (targetScrollRank - currentScrollRank) * 0.12;
      if (Math.abs(targetScrollRank - currentScrollRank) > 0.001) {
        update3DCarousel(0);
      }
    }
    window.requestAnimationFrame(renderLoop);
  };

  window.requestAnimationFrame(renderLoop);
  window.addEventListener('scroll', updateScrollLinkedCarousel, { passive: true });

  // --------------------------------------------------------------------------
  // 3. CAROUSEL NAVIGATION CONTROLS
  // --------------------------------------------------------------------------
  const nextCard = () => {
    if (activeCategoryCards.length === 0) return;
    activeIndex = (activeIndex + 1) % activeCategoryCards.length;
    targetScrollRank = activeIndex;
    currentScrollRank = activeIndex;
    update3DCarousel(0);
  };

  const prevCard = () => {
    if (activeCategoryCards.length === 0) return;
    activeIndex = (activeIndex - 1 + activeCategoryCards.length) % activeCategoryCards.length;
    targetScrollRank = activeIndex;
    currentScrollRank = activeIndex;
    update3DCarousel(0);
  };

  if (galleryNext) galleryNext.addEventListener('click', nextCard);
  if (galleryPrev) galleryPrev.addEventListener('click', prevCard);

  // --------------------------------------------------------------------------
  // 4. CATEGORY FILTER TABS
  // --------------------------------------------------------------------------
  filterTabs.forEach(tab => {
    tab.addEventListener('click', function () {
      const selectedCategory = this.getAttribute('data-category');

      // Update Active Tab Styling
      filterTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      // Filter visible cards
      activeCategoryCards = [];
      allCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (selectedCategory === 'all' || categories.includes(selectedCategory)) {
          card.style.display = 'block';
          activeCategoryCards.push(card);
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
          card.classList.remove('is-active-poster');
        }
      });

      // Reset center index to 0
      activeIndex = 0;
      targetScrollRank = 0;
      currentScrollRank = 0;
      update3DCarousel(0);
    });
  });

  // --------------------------------------------------------------------------
  // 5. MOUSE DRAG & TOUCH SWIPE GESTURES
  // --------------------------------------------------------------------------
  const handleDragStart = (e) => {
    isDragging = true;
    startX = e.touches ? e.touches[0].clientX : e.clientX;
    currentDragOffset = 0;
    stopAutoplay();

    activeCategoryCards.forEach(card => {
      card.style.transition = 'none';
    });
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    currentDragOffset = x - startX;
    update3DCarousel(currentDragOffset);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    isDragging = false;

    activeCategoryCards.forEach(card => {
      card.style.transition = 'transform 0.55s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.55s cubic-bezier(0.25, 1, 0.5, 1), filter 0.55s cubic-bezier(0.25, 1, 0.5, 1)';
    });

    if (currentDragOffset < -50) {
      nextCard();
    } else if (currentDragOffset > 50) {
      prevCard();
    } else {
      update3DCarousel(0);
    }
    startAutoplay();
  };

  if (galleryTrack) {
    galleryTrack.addEventListener('mousedown', handleDragStart);
    galleryTrack.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);

    galleryTrack.addEventListener('touchstart', handleDragStart, { passive: true });
    galleryTrack.addEventListener('touchmove', handleDragMove, { passive: true });
    window.addEventListener('touchend', handleDragEnd);
  }

  // --------------------------------------------------------------------------
  // 6. DIRECT CARD CLICK SELECTION & LIGHTBOX MODAL
  // --------------------------------------------------------------------------
  allCards.forEach(card => {
    card.addEventListener('click', () => {
      const idxInActive = activeCategoryCards.indexOf(card);
      if (idxInActive === -1) return;

      if (idxInActive === activeIndex) {
        openLightbox(idxInActive);
      } else {
        activeIndex = idxInActive;
        targetScrollRank = idxInActive;
        currentScrollRank = idxInActive;
        update3DCarousel(0);
      }
    });
  });

  // --------------------------------------------------------------------------
  // 7. AUTOPLAY & HOVER PAUSE
  // --------------------------------------------------------------------------
  const startAutoplay = () => {
    if (autoPlayTimer) return;
    autoPlayTimer = setInterval(nextCard, 4500);
  };

  const stopAutoplay = () => {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  };

  if (galleryTrack) {
    galleryTrack.addEventListener('mouseenter', stopAutoplay);
    galleryTrack.addEventListener('mouseleave', startAutoplay);
    startAutoplay();
  }

  // --------------------------------------------------------------------------
  // 8. LIGHTBOX MODAL SYSTEM
  // --------------------------------------------------------------------------
  const openLightbox = (cardIndex) => {
    const card = activeCategoryCards[cardIndex];
    if (!card) return;

    const img = card.querySelector('img');
    const title = card.querySelector('.gallery-card-title');
    const desc = card.querySelector('.checklist-desc') || card.querySelector('p');
    const meta = card.querySelector('.gallery-card-meta');

    if (lightboxImg && img) lightboxImg.src = img.src;
    if (lightboxTitle && title) lightboxTitle.textContent = title.textContent;
    if (lightboxDesc && desc) lightboxDesc.textContent = desc.textContent;
    if (lightboxMeta && meta) lightboxMeta.textContent = meta.textContent;

    if (lightbox) {
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeLightbox = () => {
    if (lightbox) {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', () => {
    if (activeCategoryCards.length === 0) return;
    activeIndex = (activeIndex + 1) % activeCategoryCards.length;
    targetScrollRank = activeIndex;
    currentScrollRank = activeIndex;
    update3DCarousel(0);
    openLightbox(activeIndex);
  });
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => {
    if (activeCategoryCards.length === 0) return;
    activeIndex = (activeIndex - 1 + activeCategoryCards.length) % activeCategoryCards.length;
    targetScrollRank = activeIndex;
    currentScrollRank = activeIndex;
    update3DCarousel(0);
    openLightbox(activeIndex);
  });

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
  });

  window.addEventListener('resize', () => update3DCarousel(0), { passive: true });

  // Initial trigger
  updateScrollLinkedCarousel();
  update3DCarousel(0);
});
