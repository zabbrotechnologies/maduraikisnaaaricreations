/**
 * AARI WORKS — PREMIUM AARI EMBROIDERY WEBSITE
 * Navigation Module (navigation.js)
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('main-header');
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const sections = document.querySelectorAll('main section[id]');

  // --------------------------------------------------------------------------
  // 1. Sticky Header Backdrop & Shadow on Scroll
  // --------------------------------------------------------------------------
  const handleScrollHeader = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScrollHeader, { passive: true });
  handleScrollHeader(); // Check on load

  // --------------------------------------------------------------------------
  // 2. Mobile Menu Toggle & Behavior
  // --------------------------------------------------------------------------
  const toggleMobileMenu = () => {
    const isOpen = mobileMenu.classList.contains('open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  };

  const openMobileMenu = () => {
    mobileMenu.classList.add('open');
    if (mobileBtn) {
      mobileBtn.setAttribute('aria-expanded', 'true');
      const icon = mobileBtn.querySelector('.material-symbols-outlined');
      if (icon) icon.textContent = 'close';
    }
  };

  const closeMobileMenu = () => {
    mobileMenu.classList.remove('open');
    if (mobileBtn) {
      mobileBtn.setAttribute('aria-expanded', 'false');
      const icon = mobileBtn.querySelector('.material-symbols-outlined');
      if (icon) icon.textContent = 'menu';
    }
  };

  if (mobileBtn) {
    mobileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });
  }

  // Close menu when clicking any mobile nav link
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (mobileMenu && mobileMenu.classList.contains('open')) {
      if (!mobileMenu.contains(e.target) && !mobileBtn.contains(e.target)) {
        closeMobileMenu();
      }
    }
  });

  // Close menu on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  // --------------------------------------------------------------------------
  // 3. ScrollSpy: Highlight Active Navbar Link
  // --------------------------------------------------------------------------
  const highlightActiveNav = () => {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 120; // Offset for header

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    // Update Desktop Nav Links
    desktopNavLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });

    // Update Mobile Nav Links
    mobileNavLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', highlightActiveNav, { passive: true });
  highlightActiveNav(); // Check on load
});
