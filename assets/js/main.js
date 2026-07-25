/*
 * Instant — vanilla JS (no jQuery)
 * uiCookies / Divilab
 */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Loader */
  function initLoader() {
    var loader = document.getElementById('pb_loader');
    if (!loader) return;
    setTimeout(function () { loader.classList.remove('show'); }, 700);
  }

  /* Navbar scroll state */
  function initNavbarState() {
    var navbar = document.querySelector('.pb_navbar');
    if (!navbar) return;
    var scrollWraps = document.querySelectorAll('.js-scroll-wrap');
    function onScroll() {
      var st = window.pageYOffset || document.documentElement.scrollTop;
      if (st > 150) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled', 'sleep');
      }
      if (st > 350) {
        navbar.classList.add('awake');
        scrollWraps.forEach(function (el) { el.classList.add('sleep'); });
      } else {
        if (navbar.classList.contains('awake')) {
          navbar.classList.remove('awake');
          navbar.classList.add('sleep');
        }
        scrollWraps.forEach(function (el) { el.classList.remove('sleep'); });
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* Smooth scroll for in-page anchors + close mobile nav */
  function initSmoothScroll() {
    var links = document.querySelectorAll(".smoothscroll[href^='#'], #probootstrap-navbar ul li a[href^='#']");
    var collapseEl = document.getElementById('probootstrap-navbar');
    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var hash = link.getAttribute('href');
        if (!hash || hash === '#') return;
        var target = document.querySelector(hash);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
        if (history.replaceState) { history.replaceState(null, '', hash); }
        // Close the mobile navbar if open
        if (collapseEl && collapseEl.classList.contains('show') && window.bootstrap) {
          var inst = window.bootstrap.Collapse.getInstance(collapseEl);
          if (inst) inst.hide();
        }
      });
    });
  }

  /* Lightbox — replaces Magnific Popup (images + video iframe) */
  function initLightbox() {
    var imageLinks = Array.prototype.slice.call(document.querySelectorAll('.image-popup'));
    var videoLinks = Array.prototype.slice.call(document.querySelectorAll('.popup-vimeo, .popup-youtube, .popup-gmaps'));
    if (!imageLinks.length && !videoLinks.length) return;

    var lb = document.createElement('div');
    lb.className = 'uic-lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.innerHTML =
      '<button class="lb-close" aria-label="Close">&times;</button>' +
      '<button class="lb-prev" aria-label="Previous">&#8249;</button>' +
      '<div class="lb-stage"></div>' +
      '<button class="lb-next" aria-label="Next">&#8250;</button>';
    document.body.appendChild(lb);
    var stage = lb.querySelector('.lb-stage');
    var prevBtn = lb.querySelector('.lb-prev');
    var nextBtn = lb.querySelector('.lb-next');
    var current = 0;

    function toEmbed(url) {
      var m;
      if ((m = url.match(/vimeo\.com\/(?:channels\/[\w]+\/|video\/)?(\d+)/))) {
        return 'https://player.vimeo.com/video/' + m[1];
      }
      if ((m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/))) {
        return 'https://www.youtube.com/embed/' + m[1];
      }
      return url;
    }

    function showImage(n) {
      current = (n + imageLinks.length) % imageLinks.length;
      prevBtn.style.display = nextBtn.style.display = imageLinks.length > 1 ? '' : 'none';
      var src = imageLinks[current].getAttribute('href');
      stage.innerHTML = '<img alt="" src="' + src + '">';
      lb.classList.add('open');
    }

    function showVideo(url) {
      prevBtn.style.display = nextBtn.style.display = 'none';
      stage.innerHTML = '<div class="lb-video"><iframe src="' + toEmbed(url) +
        '" allow="autoplay; fullscreen" allowfullscreen frameborder="0"></iframe></div>';
      lb.classList.add('open');
    }

    function close() {
      lb.classList.remove('open');
      stage.innerHTML = '';
    }

    imageLinks.forEach(function (link, i) {
      link.addEventListener('click', function (e) { e.preventDefault(); showImage(i); });
    });
    videoLinks.forEach(function (link) {
      link.addEventListener('click', function (e) { e.preventDefault(); showVideo(link.getAttribute('href')); });
    });

    lb.querySelector('.lb-close').addEventListener('click', close);
    prevBtn.addEventListener('click', function () { showImage(current - 1); });
    nextBtn.addEventListener('click', function () { showImage(current + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keyup', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft' && prevBtn.style.display !== 'none') showImage(current - 1);
      else if (e.key === 'ArrowRight' && nextBtn.style.display !== 'none') showImage(current + 1);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initLoader();
    initNavbarState();
    initSmoothScroll();
    initLightbox();
  });
})();
