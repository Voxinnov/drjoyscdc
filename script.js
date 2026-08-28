/* ======================================================
   DR JOYS CDC — JAVASCRIPT
   Handles: sticky header, mobile nav, scroll animations,
   active nav link highlighting
   ====================================================== */

(function () {
  'use strict';

  // ── Sticky Header ─────────────────────────────────
  const header = document.getElementById('header');
  function handleScroll() {
    if (window.scrollY > 20) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ── Mobile hamburger ──────────────────────────────
  const hamburger  = document.getElementById('hamburger-btn');
  const mobileNav  = document.getElementById('mobile-nav');
  const mobileLinks = mobileNav ? mobileNav.querySelectorAll('.mobile-nav__link, .btn') : [];

  function toggleMenu(open) {
    const isOpen = (typeof open !== 'undefined') ? open : !mobileNav.classList.contains('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    mobileNav.classList.toggle('open', isOpen);
  }

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () { toggleMenu(); });
    // Close on link click
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () { toggleMenu(false); });
    });
    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!header.contains(e.target)) toggleMenu(false);
    });
  }

  // ── Smooth-scroll anchor clicks ───────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h') || '72');
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  // ── Active nav link on scroll ─────────────────────
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav__link');

  function updateActiveNav() {
    let current = '';
    const scrollY = window.scrollY + 100;
    sections.forEach(function (section) {
      if (scrollY >= section.offsetTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ── Intersection Observer – fade-in animations ────
  const fadeEls = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback for older browsers
    fadeEls.forEach(function (el) { el.classList.add('visible'); });
  }

  // ── Animate hero section immediately ─────────────
  document.querySelectorAll('.hero .fade-in').forEach(function (el) {
    setTimeout(function () { el.classList.add('visible'); }, 100);
  });

})();
