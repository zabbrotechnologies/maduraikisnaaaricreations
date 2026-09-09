/**
 * KISNA AARI WORKS — FUNNEL.JS
 * High-Converting Lead Funnel: Multi-Step Form, Modal, Carousel, FAQ, Sticky CTA
 */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* -------------------------------------------------------------------------
     1. SCROLL PROGRESS BAR
     ---------------------------------------------------------------------- */
  const progressBar = $('#scroll-progress');
  function updateScrollProgress() {
    if (!progressBar) return;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = total > 0 ? Math.min(1, window.scrollY / total) : 0;
    progressBar.style.transform = `scaleX(${pct})`;
  }

  /* -------------------------------------------------------------------------
     2. STICKY NAV
     ---------------------------------------------------------------------- */
  const nav = $('#f-nav');
  function updateNav() {
    if (!nav) return;
    if (window.scrollY > 60) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  }

  /* -------------------------------------------------------------------------
     3. STICKY BOTTOM CTA BAR
     ---------------------------------------------------------------------- */
  const stickyBar = $('#f-sticky-bar');
  let heroDone = false;
  function updateStickyBar() {
    if (!stickyBar) return;
    const heroH = ($('#home') || {}).offsetHeight || window.innerHeight;
    if (window.scrollY > heroH * 0.7) {
      stickyBar.classList.add('is-visible');
      heroDone = true;
    } else {
      stickyBar.classList.remove('is-visible');
      heroDone = false;
    }
  }

  /* -------------------------------------------------------------------------
     4. SCROLL REVEAL (IntersectionObserver)
     ---------------------------------------------------------------------- */
  const revealObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        obs.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });
  $$('.f-reveal').forEach(el => revealObs.observe(el));

  /* -------------------------------------------------------------------------
     5. ANIMATED STAT COUNT-UP
     ---------------------------------------------------------------------- */
  let statsDone = false;
  function countUp(el) {
    const raw = el.dataset.target || el.textContent;
    const target = parseInt(raw.replace(/[^\d]/g, ''), 10);
    const suffix = raw.replace(/[\d]/g, '');
    if (isNaN(target)) return;
    const duration = 1800;
    let start = null;
    function step(ts) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(ease * target).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString() + suffix;
    }
    requestAnimationFrame(step);
  }
  const statsObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting && !statsDone) {
        statsDone = true;
        $$('.f-stat-num').forEach(countUp);
        obs.disconnect();
      }
    });
  }, { threshold: 0.4 });
  const statsRow = $('.f-stats-row');
  if (statsRow) statsObs.observe(statsRow);

  /* -------------------------------------------------------------------------
     6. MOBILE NAV MENU
     ---------------------------------------------------------------------- */
  const hamburger = $('#f-hamburger');
  const mobileMenu = $('#f-mobile-menu');
  function toggleMobileMenu(open) {
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.toggle('is-open', open);
    mobileMenu.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (hamburger) hamburger.addEventListener('click', () => toggleMobileMenu(!mobileMenu.classList.contains('is-open')));
  const mobileClose = $('#f-mobile-close');
  if (mobileClose) mobileClose.addEventListener('click', () => toggleMobileMenu(false));
  $$('.f-mobile-link').forEach(l => l.addEventListener('click', () => toggleMobileMenu(false)));

  /* -------------------------------------------------------------------------
     7. MULTI-STEP FORM STATE MACHINE
     ---------------------------------------------------------------------- */
  const TOTAL_STEPS = 5;
  let currentStep = 1;
  const formData = {
    service: '',
    occasion: '',
    timeline: '',
    budget: '',
    quantity: '',
    notes: '',
    name: '',
    phone: '',
    email: '',
    whatsapp: '',
  };

  // Find all multi-step form instances (section + modal)
  function initMultiStepForm(container) {
    if (!container) return;

    const steps = $$('.f-form-step', container);
    const progressSteps = $$('.f-progress-step', container);
    const progressFill = $('.f-progress-fill', container);
    const successView = $('.f-form-success', container);

    let localStep = 1;

    function updateProgress(step) {
      const pct = ((step - 1) / (TOTAL_STEPS - 1)) * 100;
      if (progressFill) progressFill.style.width = `${pct}%`;
      progressSteps.forEach((ps, i) => {
        ps.classList.remove('is-active', 'is-done');
        if (i + 1 === step) ps.classList.add('is-active');
        else if (i + 1 < step) ps.classList.add('is-done');
        const num = ps.querySelector('.f-ps-num');
        if (num && i + 1 < step) num.textContent = '✓';
        else if (num) num.textContent = i + 1;
      });
    }

    function showStep(step) {
      steps.forEach((s, i) => {
        s.classList.remove('is-active');
        if (i + 1 === step) s.classList.add('is-active');
      });
      updateProgress(step);
      localStep = step;
      // Sync summary if on step 5
      if (step === 5) syncSummary(container);
    }

    function syncSummary(container) {
      const rows = {
        'sum-service': formData.service || '—',
        'sum-occasion': formData.occasion || '—',
        'sum-timeline': formData.timeline || '—',
        'sum-budget': formData.budget || '—',
        'sum-name': formData.name || '—',
        'sum-phone': formData.phone || '—',
      };
      Object.entries(rows).forEach(([id, val]) => {
        const el = $('#' + id, container);
        if (el) el.textContent = val;
      });
    }

    // Service card selection
    $$('.f-svc-card', container).forEach(card => {
      card.addEventListener('click', () => {
        $$('.f-svc-card', container).forEach(c => c.classList.remove('is-sel'));
        card.classList.add('is-sel');
        formData.service = card.dataset.service || card.querySelector('.f-svc-name')?.textContent || '';
      });
    });

    // Occasion/chip selection
    $$('.f-chip', container).forEach(chip => {
      chip.addEventListener('click', () => {
        if (chip.dataset.group) {
          $$(`[data-group="${chip.dataset.group}"]`, container).forEach(c => c.classList.remove('is-sel'));
        }
        chip.classList.toggle('is-sel');
        const group = chip.dataset.group;
        if (group === 'occasion') formData.occasion = chip.textContent;
        if (group === 'timeline') formData.timeline = chip.textContent;
        if (group === 'budget') formData.budget = chip.textContent;
      });
    });

    // Field sync
    const fieldMap = {
      'f-name': 'name', 'f-phone': 'phone',
      'f-email': 'email', 'f-whatsapp': 'whatsapp',
      'f-notes': 'notes', 'f-quantity': 'quantity',
    };
    Object.entries(fieldMap).forEach(([cls, key]) => {
      $$('.' + cls, container).forEach(inp => {
        inp.addEventListener('input', () => { formData[key] = inp.value; });
      });
    });

    // Next buttons
    $$('.f-btn-next', container).forEach(btn => {
      btn.addEventListener('click', () => {
        if (localStep < TOTAL_STEPS) showStep(localStep + 1);
      });
    });

    // Back buttons
    $$('.f-btn-back', container).forEach(btn => {
      btn.addEventListener('click', () => {
        if (localStep > 1) showStep(localStep - 1);
      });
    });

    // Submit button
    const submitBtn = $('.f-btn-submit', container);
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        const name = formData.name.trim() || 'a customer';
        const phone = formData.phone.trim();
        if (!phone) {
          const phoneInput = $('.f-phone', container);
          if (phoneInput) phoneInput.focus();
          return;
        }
        const msg = [
          `Hello Kisna Aari Works! 🙏`,
          ``,
          `*Enquiry Details:*`,
          `Service: ${formData.service || 'Not specified'}`,
          `Occasion: ${formData.occasion || 'Not specified'}`,
          `Timeline: ${formData.timeline || 'Not specified'}`,
          `Budget: ${formData.budget || 'Not specified'}`,
          ``,
          `*Contact:*`,
          `Name: ${formData.name}`,
          `Phone: ${formData.phone}`,
          `Email: ${formData.email || 'Not provided'}`,
          formData.notes ? `Notes: ${formData.notes}` : '',
        ].filter(Boolean).join('\n');

        const waUrl = `https://wa.me/919842102938?text=${encodeURIComponent(msg)}`;
        window.open(waUrl, '_blank', 'noopener,noreferrer');

        // Show success
        const stepsWrap = $('.f-progress-wrap', container);
        const stepsDiv = $('.f-form-steps-wrap', container) || container;
        $$('.f-form-step', container).forEach(s => { s.style.display = 'none'; });
        if (stepsWrap) stepsWrap.style.display = 'none';
        if (successView) successView.classList.add('is-visible');
      });
    }

    showStep(1);
  }

  // Init section form
  initMultiStepForm($('#f-section-form'));
  // Modal form will be inited when modal opens (same HTML reused)

  /* -------------------------------------------------------------------------
     8. LEAD FORM MODAL
     ---------------------------------------------------------------------- */
  const modalOverlay = $('#f-modal-overlay');
  const modalClose = $('#f-modal-close');

  function openModal(servicePreset) {
    if (!modalOverlay) return;
    modalOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    if (servicePreset) {
      // Pre-select service
      formData.service = servicePreset;
      $$('.f-svc-card', modalOverlay).forEach(c => {
        c.classList.toggle('is-sel', c.dataset.service === servicePreset);
      });
    }
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  // Wire modal form
  initMultiStepForm($('#f-modal-form'));

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', e => {
      if (e.target === modalOverlay) closeModal();
    });
  }
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  // Wire ALL CTAs to open modal
  $$('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const preset = btn.dataset.openModal !== 'true' ? btn.dataset.openModal : '';
      openModal(preset);
    });
  });

  // Service card CTAs open modal with preset
  $$('.f-service-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      openModal(btn.dataset.service || '');
    });
  });

  /* -------------------------------------------------------------------------
     9. STITCH ATELIER SIGNATURE BENTO GALLERY & DYNAMIC FILTER SWITCHER
     ---------------------------------------------------------------------- */
  const stitchCards = $$('.stitch-card');
  const filterBtns = $$('.stitch-filter-btn');

  // Curated 5-card sets for every category maintaining exact bento alignment
  const GALLERY_DATA = {
    all: [
      {
        img: 'images/stitch-gallery/bridal-crimson.jpg',
        tag: 'BRIDAL COLLECTION',
        title: 'Royal Crimson Zardozi Blouse',
        alt: 'Royal Crimson Zardozi Blouse',
        service: 'Bridal Blouse Couture'
      },
      {
        img: 'images/stitch-gallery/pastel-mint-sleeve.jpg',
        tag: 'ENGAGEMENT',
        title: 'Pastel Mint Sleeve Detailing',
        alt: 'Pastel Mint Sleeve Detailing',
        service: 'Bridal Blouse Couture'
      },
      {
        img: 'images/IMG-20260907-WA0058.jpg',
        tag: 'RECEPTION',
        title: 'Scalloped Pearl & Gold Neckline',
        alt: 'Scalloped Pearl & Gold Neckline',
        service: 'Stone, Crystal & Bead Work'
      },
      {
        img: 'images/IMG-20260907-WA0031.jpg',
        tag: 'THREAD WORK',
        title: 'Sacred Lotus Aari Needlework',
        alt: 'Sacred Lotus Aari Needlework',
        service: 'Traditional Aari Embroidery'
      },
      {
        img: 'images/stitch-gallery/emerald-polki.jpg',
        tag: 'ZARI & STONE',
        title: 'Emerald Polki Embellished Blouse',
        alt: 'Emerald Polki Embellished Blouse',
        service: 'Heavy Zari & Zardozi Work'
      }
    ],
    bridal: [
      {
        img: 'images/IMG-20260907-WA0065.jpg',
        tag: 'MUHURTHAM COUTURE',
        title: 'Heirloom Bridal Back Portrait',
        alt: 'Heirloom Bridal Back Portrait',
        service: 'Bridal Blouse Couture'
      },
      {
        img: 'images/IMG-20260907-WA0036.jpg',
        tag: 'TEMPLE BRIDAL',
        title: 'Grand Temple Arch Muhurtham Blouse',
        alt: 'Grand Temple Arch Muhurtham Blouse',
        service: 'Bridal Blouse Couture'
      },
      {
        img: 'images/IMG-20260907-WA0011.jpg',
        tag: 'ROYAL HERITAGE',
        title: 'Antique Gold Temple Arch Blouse',
        alt: 'Antique Gold Temple Arch Blouse',
        service: 'Bridal Blouse Couture'
      },
      {
        img: 'images/IMG-20260907-WA0025.jpg',
        tag: 'KANCHIPURAM MATCH',
        title: 'Classic Crimson Silk Zardozi',
        alt: 'Classic Crimson Silk Zardozi',
        service: 'Bridal Blouse Couture'
      },
      {
        img: 'images/IMG-20260907-WA0084.jpg',
        tag: 'BRIDAL EMBROIDERY',
        title: 'Maharani Royal Bridal Ensemble',
        alt: 'Maharani Royal Bridal Ensemble',
        service: 'Bridal Blouse Couture'
      }
    ],
    reception: [
      {
        img: 'images/IMG-20260907-WA0040.jpg',
        tag: 'RECEPTION GLAM',
        title: 'Pastel Flora & French Knot Blouse',
        alt: 'Pastel Flora & French Knot Blouse',
        service: 'Custom Couture & Ensembles'
      },
      {
        img: 'images/IMG-20260907-WA0046.jpg',
        tag: 'EVENING SANGEET',
        title: 'Contemporary Zari Sleeve Band',
        alt: 'Contemporary Zari Sleeve Band',
        service: 'Custom Couture & Ensembles'
      },
      {
        img: 'images/IMG-20260907-WA0058.jpg',
        tag: 'COCKTAIL SILK',
        title: 'Scalloped Pearl Illusion Neckline',
        alt: 'Scalloped Pearl Illusion Neckline',
        service: 'Stone, Crystal & Bead Work'
      },
      {
        img: 'images/IMG-20260907-WA0075.jpg',
        tag: 'MODERN BRIDE',
        title: 'Deep Sweetheart Crystal Neckline',
        alt: 'Deep Sweetheart Crystal Neckline',
        service: 'Custom Couture & Ensembles'
      },
      {
        img: 'images/IMG-20260907-WA0035.jpg',
        tag: 'RECEPTION ROYALE',
        title: '3D Metallic Bullion & Crystal Sleeve',
        alt: '3D Metallic Bullion & Crystal Sleeve',
        service: 'Heavy Zari & Zardozi Work'
      }
    ],
    zari: [
      {
        img: 'images/IMG-20260907-WA0012.jpg',
        tag: 'ANTIQUE ZARI',
        title: 'Pure Metallic Kasab & Zari Work',
        alt: 'Pure Metallic Kasab & Zari Work',
        service: 'Heavy Zari & Zardozi Work'
      },
      {
        img: 'images/IMG-20260907-WA0035.jpg',
        tag: '3D ZARDOZI',
        title: 'Heavy Dabka & Bullion Sleeve Work',
        alt: 'Heavy Dabka & Bullion Sleeve Work',
        service: 'Heavy Zari & Zardozi Work'
      },
      {
        img: 'images/IMG-20260907-WA0023.jpg',
        tag: 'GOLD NAKSHI',
        title: 'Intricate Gold Wire Neckline',
        alt: 'Intricate Gold Wire Neckline',
        service: 'Heavy Zari & Zardozi Work'
      },
      {
        img: 'images/IMG-20260907-WA0034.jpg',
        tag: 'TEMPLE ZARI',
        title: 'Sacred Chariot Zari Medallion',
        alt: 'Sacred Chariot Zari Medallion',
        service: 'Heavy Zari & Zardozi Work'
      },
      {
        img: 'images/stitch-gallery/emerald-polki.jpg',
        tag: 'ROYAL ZARI',
        title: 'Emerald Polki & Antique Zardozi',
        alt: 'Emerald Polki & Antique Zardozi',
        service: 'Heavy Zari & Zardozi Work'
      }
    ],
    stone: [
      {
        img: 'images/IMG-20260907-WA0026.jpg',
        tag: 'KUNDAN ART',
        title: 'Faceted Kundan & Seed Pearl Blouse',
        alt: 'Faceted Kundan & Seed Pearl Blouse',
        service: 'Stone, Crystal & Bead Work'
      },
      {
        img: 'images/IMG-20260907-WA0061.jpg',
        tag: 'CRYSTAL SHIMMER',
        title: 'Swarovski & Glass Bead Sleeve Trim',
        alt: 'Swarovski & Glass Bead Sleeve Trim',
        service: 'Stone, Crystal & Bead Work'
      },
      {
        img: 'images/IMG-20260907-WA0033.jpg',
        tag: 'CUTDANA WORK',
        title: 'Hand-Anchored Cutdana Neckline',
        alt: 'Hand-Anchored Cutdana Neckline',
        service: 'Stone, Crystal & Bead Work'
      },
      {
        img: 'images/IMG-20260907-WA0058.jpg',
        tag: 'PEARL EMBED',
        title: 'Lustrous Pearl Scallop Border',
        alt: 'Lustrous Pearl Scallop Border',
        service: 'Stone, Crystal & Bead Work'
      },
      {
        img: 'images/stitch-gallery/emerald-polki.jpg',
        tag: 'POLKI LUXURY',
        title: 'Emerald Polki & Gemstone Blouse',
        alt: 'Emerald Polki & Gemstone Blouse',
        service: 'Stone, Crystal & Bead Work'
      }
    ],
    thread: [
      {
        img: 'images/IMG-20260907-WA0009.jpg',
        tag: 'RESHAM SILK',
        title: 'Peacock Plume Silk Thread Shading',
        alt: 'Peacock Plume Silk Thread Shading',
        service: 'Traditional Aari Embroidery'
      },
      {
        img: 'images/stitch-gallery/pastel-mint-sleeve.jpg',
        tag: 'FLORAL THREAD',
        title: 'Pastel Floral Chain-Stitch Sleeve',
        alt: 'Pastel Floral Chain-Stitch Sleeve',
        service: 'Traditional Aari Embroidery'
      },
      {
        img: 'images/IMG-20260907-WA0031.jpg',
        tag: 'AARI NEEDLE',
        title: 'Sacred Lotus Petal Needlework',
        alt: 'Sacred Lotus Petal Needlework',
        service: 'Traditional Aari Embroidery'
      },
      {
        img: 'images/IMG-20260907-WA0029.jpg',
        tag: 'TEMPLE MOTIF',
        title: 'Traditional Aari Bird & Vine Work',
        alt: 'Traditional Aari Bird & Vine Work',
        service: 'Traditional Aari Embroidery'
      },
      {
        img: 'images/IMG-20260907-WA0086.jpg',
        tag: 'CUTWORK & THREAD',
        title: 'Intricate Silk Cutwork Bridal Back',
        alt: 'Intricate Silk Cutwork Bridal Back',
        service: 'Traditional Aari Embroidery'
      }
    ]
  };

  let isFilterSwitching = false;
  function updateGalleryCategory(categoryKey) {
    const data = GALLERY_DATA[categoryKey] || GALLERY_DATA.all;
    if (isFilterSwitching) return;
    isFilterSwitching = true;

    // Smooth exit transition
    stitchCards.forEach(card => {
      card.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      card.style.opacity = '0';
      card.style.transform = 'scale(0.96) translateY(8px)';
    });

    setTimeout(() => {
      stitchCards.forEach((card, idx) => {
        const item = data[idx];
        if (!item) return;

        const imgEl = card.querySelector('.stitch-card-bg');
        const tagEl = card.querySelector('.stitch-card-tag');
        const titleEl = card.querySelector('.stitch-card-title');

        if (imgEl) {
          imgEl.src = item.img;
          imgEl.alt = item.alt;
        }
        if (tagEl) tagEl.textContent = item.tag;
        if (titleEl) titleEl.textContent = item.title;
        card.dataset.service = item.service;
        card.dataset.cat = categoryKey;
        card.classList.remove('is-dimmed');

        // Staggered entrance transition
        setTimeout(() => {
          card.style.transition = 'opacity 0.35s var(--f-ease), transform 0.35s var(--f-ease), box-shadow 0.35s var(--f-ease)';
          card.style.opacity = '1';
          card.style.transform = 'scale(1) translateY(0)';
          if (idx === stitchCards.length - 1) {
            isFilterSwitching = false;
          }
        }, idx * 40);
      });
    }, 200);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('is-active')) return;
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const cat = (btn.dataset.cat || 'all').toLowerCase();
      updateGalleryCategory(cat);
    });
  });

  // Clicking on any gallery card or View Design opens lead modal with prefilled design
  stitchCards.forEach(card => {
    card.addEventListener('click', () => {
      const designTitle = card.querySelector('.stitch-card-title')?.textContent || '';
      const servicePreset = card.dataset.service || 'Bridal Blouse Couture';
      openModal(servicePreset);
      if (designTitle && modalOverlay) {
        const notesInput = $('.f-notes', modalOverlay);
        if (notesInput) {
          notesInput.value = `Enquiring about design: ${designTitle}`;
          formData.notes = notesInput.value;
        }
      }
    });
  });


  /* -------------------------------------------------------------------------
     10. FAQ ACCORDION
     ---------------------------------------------------------------------- */
  $$('.f-faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.f-faq-item');
      const isOpen = item.classList.contains('is-open');
      // Close all
      $$('.f-faq-item.is-open').forEach(i => i.classList.remove('is-open'));
      // Toggle current
      if (!isOpen) item.classList.add('is-open');
    });
  });

  /* -------------------------------------------------------------------------
     11. UNIFIED SCROLL HANDLER (rAF throttled)
     ---------------------------------------------------------------------- */
  const heroBg = $('#f-hero-parallax-bg');
  const heroContent = $('.f-hero-content');

  function updateHeroParallax() {
    const y = window.scrollY;
    const h = window.innerHeight;
    if (y <= h * 1.25) {
      if (heroBg) {
        heroBg.style.transform = `translate3d(0, ${(y * 0.36).toFixed(1)}px, 0) scale(${(1.05 + y * 0.00015).toFixed(3)})`;
      }
      if (heroContent) {
        heroContent.style.transform = `translate3d(0, ${(y * 0.16).toFixed(1)}px, 0)`;
        heroContent.style.opacity = `${Math.max(0, 1 - (y / (h * 0.72))).toFixed(2)}`;
      }
    }
  }

  let rafPending = false;
  window.addEventListener('scroll', () => {
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(() => {
        updateScrollProgress();
        updateNav();
        updateStickyBar();
        updateHeroParallax();
        rafPending = false;
      });
    }
  }, { passive: true });

  // Initial calls
  updateScrollProgress();
  updateNav();
  updateStickyBar();
  updateHeroParallax();

  /* -------------------------------------------------------------------------
     12. SMOOTH SCROLL for anchor nav links
     ---------------------------------------------------------------------- */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.getElementById(a.getAttribute('href').slice(1));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
