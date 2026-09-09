/**
 * AARI WORKS — PREMIUM AARI EMBROIDERY WEBSITE
 * Motion.dev Inspired Comprehensive Scroll-Driven Animation Suite (animations.js)
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    document.querySelectorAll('.reveal-on-scroll, .motion-card-reveal, .motion-slide-left, .motion-slide-right, .motion-scale-reveal').forEach(el => {
      el.classList.add('is-visible');
    });
    return;
  }

  // --------------------------------------------------------------------------
  // 1. TOP SCROLL PROGRESS INDICATOR BAR
  // --------------------------------------------------------------------------
  const scrollProgressBar = document.getElementById('scroll-progress');
  const updateScrollProgress = () => {
    if (!scrollProgressBar) return;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return;
    const progress = Math.max(0, Math.min(1, window.scrollY / totalHeight));
    scrollProgressBar.style.transform = `scaleX(${progress})`;
  };

  // --------------------------------------------------------------------------
  // 2. HERO PARALLAX & SCROLL DISSOLVE EFFECT
  // --------------------------------------------------------------------------
  const heroSection = document.getElementById('home');
  const heroGlow = document.querySelector('.video-hero-glow');
  const heroBadge = document.querySelector('.hero-badge');
  const heroTitle = document.querySelector('.hero-title');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  const heroCards = document.querySelector('.hero-cards-slider');

  const updateHeroParallax = () => {
    if (!heroSection) return;
    const scrollY = window.scrollY;
    const heroHeight = heroSection.offsetHeight;
    if (scrollY > heroHeight) return;

    const progress = scrollY / heroHeight;

    if (heroGlow) {
      heroGlow.style.transform = `translateY(${scrollY * 0.35}px) scale(${1 + progress * 0.08})`;
    }
    if (heroBadge) {
      heroBadge.style.transform = `translateY(${scrollY * 0.18}px)`;
      heroBadge.style.opacity = `${1 - progress * 1.5}`;
    }
    if (heroTitle) {
      heroTitle.style.transform = `translateY(${scrollY * 0.22}px)`;
      heroTitle.style.opacity = `${1 - progress * 1.3}`;
    }
    if (heroSubtitle) {
      heroSubtitle.style.transform = `translateY(${scrollY * 0.25}px)`;
      heroSubtitle.style.opacity = `${1 - progress * 1.4}`;
    }
    if (heroCards) {
      heroCards.style.transform = `translateY(${scrollY * 0.15}px)`;
      heroCards.style.opacity = `${1 - progress * 1.2}`;
    }
  };

  // (Gallery 3D Movie Carousel is managed exclusively in gallery.js)


  // --------------------------------------------------------------------------
  // 4. ANIMATED CRAFT STATISTICS COUNT-UP ON SCROLL
  // --------------------------------------------------------------------------
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  const animateCountUp = (el) => {
    const rawText = el.textContent.trim();
    const targetValue = parseInt(rawText.replace(/[^0-9]/g, ''), 10);
    const suffix = rawText.replace(/[0-9]/g, ''); // Preserve '+' or '%'
    if (isNaN(targetValue)) return;

    let startTimestamp = null;
    const duration = 2200; // 2.2 seconds

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic function
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easeProgress * targetValue);
      el.textContent = currentVal.toLocaleString() + suffix;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = targetValue.toLocaleString() + suffix;
      }
    };

    window.requestAnimationFrame(step);
  };

  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        statNumbers.forEach(stat => animateCountUp(stat));
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const statsContainer = document.querySelector('.stats-grid');
  if (statsContainer) statsObserver.observe(statsContainer);

  // --------------------------------------------------------------------------
  // 5. MOTION.DEV INSPIRED SCROLL REVEAL OBSERVER
  // --------------------------------------------------------------------------
  // Attach 3D tilt cascade classes to services & pillars
  document.querySelectorAll('.service-card, .pillar-card').forEach((card, idx) => {
    card.classList.add('motion-card-reveal', `stagger-${(idx % 6) + 1}`);
  });

  // Attach alternating slide left/right to occasions cards
  document.querySelectorAll('.occasion-card').forEach((card, idx) => {
    if (idx % 2 === 0) {
      card.classList.add('motion-slide-left');
    } else {
      card.classList.add('motion-slide-right');
    }
  });

  // Attach scale mask reveal to artisan spotlight card & spotlight gallery
  document.querySelectorAll('.artisan-card, .featured-creation').forEach(el => {
    el.classList.add('motion-scale-reveal');
  });

  const scrollRevealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.12 });

  document.querySelectorAll('.reveal-on-scroll, .motion-card-reveal, .motion-slide-left, .motion-slide-right, .motion-scale-reveal').forEach(el => {
    scrollRevealObserver.observe(el);
  });

  // Also wire the new Stitch design 'in-view' class for stitch-specific elements
  const stitchRevealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -50px 0px', threshold: 0.1 });

  document.querySelectorAll('.motion-slide-left, .motion-slide-right, .motion-card-reveal').forEach(el => {
    stitchRevealObserver.observe(el);
  });

  // Wire stitch-gallery filter tabs to existing gallery filtering logic
  document.querySelectorAll('.stitch-filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.stitch-filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.category;
      document.querySelectorAll('.gallery-card').forEach(card => {
        const cardCats = (card.dataset.category || '').split(' ');
        card.style.display = (cat === 'all' || cardCats.includes(cat)) ? '' : 'none';
      });
    });
  });


  // --------------------------------------------------------------------------
  // 6. PROCESS TIMELINE GOLDEN THREAD SCROLL PROGRESS FILL
  // --------------------------------------------------------------------------
  const processGrid = document.querySelector('.process-grid');
  let timelineFillInner = null;

  if (processGrid) {
    const fillLineTrack = document.createElement('div');
    fillLineTrack.className = 'timeline-progress-fill-line';
    timelineFillInner = document.createElement('div');
    timelineFillInner.className = 'timeline-progress-fill-inner';
    fillLineTrack.appendChild(timelineFillInner);
    processGrid.appendChild(fillLineTrack);
  }

  const updateTimelineProgress = () => {
    if (!processGrid || !timelineFillInner) return;
    const rect = processGrid.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top <= windowHeight && rect.bottom >= 0) {
      const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (rect.height + windowHeight * 0.5)));
      timelineFillInner.style.transform = `scaleY(${progress})`;

      // Highlight active step based on scroll position
      const processCards = processGrid.querySelectorAll('.process-card');
      processCards.forEach(card => {
        const cardRect = card.getBoundingClientRect();
        if (cardRect.top < windowHeight * 0.65 && cardRect.bottom > windowHeight * 0.25) {
          card.classList.add('is-active-step');
        } else {
          card.classList.remove('is-active-step');
        }
      });
    }
  };

  // --------------------------------------------------------------------------
  // 7. FLOATING WHATSAPP BUTTON ELASTIC POP-IN ON SCROLL
  // --------------------------------------------------------------------------
  const floatingWhatsapp = document.querySelector('.floating-whatsapp');
  const updateFloatingButtons = () => {
    if (!floatingWhatsapp) return;
    if (window.scrollY > 300) {
      floatingWhatsapp.style.opacity = '1';
      floatingWhatsapp.style.transform = 'scale(1)';
    } else {
      floatingWhatsapp.style.opacity = '0';
      floatingWhatsapp.style.transform = 'scale(0)';
    }
  };

  if (floatingWhatsapp) {
    floatingWhatsapp.style.transition = 'opacity 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    floatingWhatsapp.style.opacity = '0';
    floatingWhatsapp.style.transform = 'scale(0)';
  }

  // --------------------------------------------------------------------------
  // 8. CONSOLIDATED TICKER (REQUESTANIMATIONFRAME SCROLL LISTENER)
  // --------------------------------------------------------------------------
  let ticking = false;

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateScrollProgress();
        updateHeroParallax();
        updateTimelineProgress();
        updateFloatingButtons();
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  // Initial trigger
  onScroll();
});
