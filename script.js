/* ============================================================
   DESTINATION POINT — script.js
   ============================================================ */

'use strict';

// ---------- LOADER ----------
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1800);
});

// ---------- NAVBAR ----------
const navbar  = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
const navLinkItems = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  updateActiveNav();
  toggleBackToTop();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinkItems.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Active nav highlight on scroll
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinkItems.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}

// ---------- HERO SLIDER ----------
const slides = document.querySelectorAll('.slide');
const indicatorsWrap = document.getElementById('heroIndicators');
let currentSlide = 0;
let sliderTimer;

// Build indicators
slides.forEach((_, i) => {
  const dot = document.createElement('div');
  dot.className = 'hi-dot' + (i === 0 ? ' active' : '');
  dot.addEventListener('click', () => goToSlide(i));
  indicatorsWrap.appendChild(dot);
});

function getDots() { return indicatorsWrap.querySelectorAll('.hi-dot'); }

function goToSlide(n) {
  slides[currentSlide].classList.remove('active');
  getDots()[currentSlide].classList.remove('active');
  currentSlide = (n + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  getDots()[currentSlide].classList.add('active');
  resetSliderTimer();
}

function nextSlide() { goToSlide(currentSlide + 1); }
function prevSlide() { goToSlide(currentSlide - 1); }

function resetSliderTimer() {
  clearInterval(sliderTimer);
  sliderTimer = setInterval(nextSlide, 5000);
}

document.getElementById('heroNext').addEventListener('click', nextSlide);
document.getElementById('heroPrev').addEventListener('click', prevSlide);

// Touch / swipe
let touchStartX = 0;
const heroEl = document.querySelector('.hero');
heroEl.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
heroEl.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].screenX;
  if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : prevSlide();
});

resetSliderTimer();

// ---------- COUNTER ANIMATION ----------
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = +el.dataset.target;
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.round(current);
      if (current >= target) clearInterval(timer);
    }, 16);
  });
}

let countersAnimated = false;
const heroSection = document.getElementById('home');

const counterObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !countersAnimated) {
    countersAnimated = true;
    animateCounters();
  }
}, { threshold: 0.3 });
counterObserver.observe(heroSection);

// ---------- COURSE TABS ----------
document.querySelectorAll('.ctab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.ctab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.course-grid').forEach(g => g.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('group-' + tab.dataset.group).classList.add('active');
  });
});

// ---------- SCROLL ANIMATIONS ----------
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

// Add animate class to cards and sections
const animateEls = document.querySelectorAll(
  '.course-card, .feature-card, .batch-card, .gallery-item, .about-grid, .ci-item'
);
animateEls.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = `opacity 0.55s ease ${(i % 6) * 0.08}s, transform 0.55s ease ${(i % 6) * 0.08}s`;
  observer.observe(el);
});

document.addEventListener('DOMContentLoaded', () => {});

// Override IntersectionObserver callback to handle animation
const styleObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      styleObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

animateEls.forEach(el => styleObserver.observe(el));

// ---------- GALLERY LIGHTBOX ----------
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbCaption = document.getElementById('lbCaption');

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    lbImg.src = item.querySelector('img').src;
    lbImg.alt = item.querySelector('img').alt;
    lbCaption.textContent = item.dataset.caption || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

document.getElementById('lbClose').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

// ---------- TESTIMONIAL SLIDER ----------
const tSlides = document.querySelectorAll('.tslide');
const tDotsWrap = document.getElementById('testDots');
let tCurrent = 0;
let tTimer;

tSlides.forEach((_, i) => {
  const dot = document.createElement('div');
  dot.className = 'hi-dot' + (i === 0 ? ' active' : '');
  dot.addEventListener('click', () => goToTestimonial(i));
  tDotsWrap.appendChild(dot);
});

function getTDots() { return tDotsWrap.querySelectorAll('.hi-dot'); }

function goToTestimonial(n) {
  tSlides[tCurrent].classList.remove('active');
  getTDots()[tCurrent].classList.remove('active');
  tCurrent = (n + tSlides.length) % tSlides.length;
  tSlides[tCurrent].classList.add('active');
  getTDots()[tCurrent].classList.add('active');
}

tTimer = setInterval(() => goToTestimonial(tCurrent + 1), 4000);

// ---------- CONTACT FORM ----------
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const formSubmitBtn = document.getElementById('formSubmitBtn');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name  = document.getElementById('fname').value.trim();
  const cls   = document.getElementById('fclass').value;
  const phone = document.getElementById('fphone').value.trim();

  if (!name || !cls || !phone) {
    // Shake invalid fields
    [document.getElementById('fname'), document.getElementById('fclass'), document.getElementById('fphone')].forEach(el => {
      if (!el.value.trim()) {
        el.style.borderColor = '#e53e3e';
        el.style.animation = 'shake 0.4s ease';
        setTimeout(() => { el.style.animation = ''; el.style.borderColor = ''; }, 400);
      }
    });
    return;
  }

  formSubmitBtn.textContent = '⏳ Sending...';
  formSubmitBtn.disabled = true;

  setTimeout(() => {
    contactForm.reset();
    formSuccess.style.display = 'block';
    formSubmitBtn.textContent = '📤 Submit Enquiry';
    formSubmitBtn.disabled = false;
    setTimeout(() => { formSuccess.style.display = 'none'; }, 6000);
  }, 1500);
});

// ---------- BACK TO TOP ----------
const btt = document.getElementById('backToTop');
function toggleBackToTop() { btt.classList.toggle('visible', window.scrollY > 400); }
btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ---------- SHAKE KEYFRAME (dynamic) ----------
const styleEl = document.createElement('style');
styleEl.textContent = `
  @keyframes shake {
    0%,100%{transform:translateX(0)}
    25%{transform:translateX(-6px)}
    75%{transform:translateX(6px)}
  }
`;
document.head.appendChild(styleEl);

// ---------- SMOOTH SCROLL OFFSET ----------
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});

console.log('%c🎓 Destination Point Website Loaded Successfully!', 'color:#8b2be2;font-weight:bold;font-size:14px;');
