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

  // ── Gallery Lightbox Modal ────────────────────────
  const galleryItems = document.querySelectorAll('.gallery__item');
  const modal = document.getElementById('gallery-modal');
  const modalImg = document.getElementById('gallery-modal-img');
  const modalCaption = document.getElementById('gallery-modal-caption');
  const modalClose = document.getElementById('gallery-modal-close');
  const modalBackdrop = document.getElementById('gallery-modal-backdrop');
  const modalPrev = document.getElementById('gallery-modal-prev');
  const modalNext = document.getElementById('gallery-modal-next');

  let currentGalleryIdx = 0;
  const galleryData = Array.from(galleryItems).map(function (item) {
    return {
      src: item.getAttribute('data-src'),
      caption: item.getAttribute('data-caption') || ''
    };
  });

  function openGalleryModal(index) {
    if (!galleryData[index] || !modal || !modalImg) return;
    currentGalleryIdx = index;
    modalImg.src = galleryData[currentGalleryIdx].src;
    modalImg.alt = galleryData[currentGalleryIdx].caption;
    if (modalCaption) {
      modalCaption.textContent = galleryData[currentGalleryIdx].caption;
    }
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeGalleryModal() {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function prevGalleryImage() {
    currentGalleryIdx = (currentGalleryIdx - 1 + galleryData.length) % galleryData.length;
    openGalleryModal(currentGalleryIdx);
  }

  function nextGalleryImage() {
    currentGalleryIdx = (currentGalleryIdx + 1) % galleryData.length;
    openGalleryModal(currentGalleryIdx);
  }

  if (galleryItems.length && modal) {
    galleryItems.forEach(function (item, idx) {
      item.addEventListener('click', function () {
        openGalleryModal(idx);
      });
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openGalleryModal(idx);
        }
      });
    });

    if (modalClose) modalClose.addEventListener('click', closeGalleryModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeGalleryModal);
    if (modalPrev) modalPrev.addEventListener('click', prevGalleryImage);
    if (modalNext) modalNext.addEventListener('click', nextGalleryImage);

    document.addEventListener('keydown', function (e) {
      if (!modal.classList.contains('active')) return;
      if (e.key === 'Escape') {
        closeGalleryModal();
      } else if (e.key === 'ArrowLeft') {
        prevGalleryImage();
      } else if (e.key === 'ArrowRight') {
        nextGalleryImage();
      }
    });
  }

})();
