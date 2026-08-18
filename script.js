// Light / dark mode preference
const savedTheme = localStorage.getItem('depadua-theme');
const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
document.documentElement.dataset.theme = initialTheme;

const projects = {
  'flower-bar': {
    title: 'The Flower Bar', year: '2025 / HOSPITALITY', location: 'Balayan, Batangas',
    copy: 'Where specialty coffee meets fresh flowers in a warm, thoughtfully designed space. Rooted in vintage charm and modern simplicity, it is a place to slow down, sip, browse seasonal blooms, and find beauty in the everyday.',
    images: [2,3,4,5,6,7,8,9,10]
  },
  'porch-house': {
    title: 'Porch House', year: '2025 / RESIDENTIAL', location: 'Calaca, Batangas',
    copy: 'Rooted in simplicity and shaped by nature, this bungalow celebrates honest materials, warm textures, and a timeless palette. Its bold yet understated identity creates spaces that feel calm, welcoming, and deeply connected to the landscape.',
    images: [11,12,13,14,15,16,17,18,19,20,21,22,23]
  },
  'gallery-house': {
    title: 'Gallery House', year: '2026 / RESIDENTIAL', location: 'Nasugbu, Batangas',
    copy: 'A sculptural approach to modern living. Strong architectural forms, contemporary brick textures, and a seamless dialogue with nature come together to create a residence that is confident in identity, rich in materiality, and designed to leave a lasting impression.',
    images: [24,25,26,27,28,29,30,31]
  }
};

const gallery = document.querySelector('.lightbox');
const img = document.getElementById('lightbox-image');
const title = document.getElementById('lightbox-project-title');
const year = document.getElementById('lightbox-project-year');
const copy = document.getElementById('lightbox-project-copy');
const current = document.getElementById('lightbox-count-current');
const total = document.getElementById('lightbox-count-total');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
let active = null;
let index = 0;
let isLoading = false;
let slideDirection = 1;

// Works on GitHub Pages subpaths, Netlify, localhost, etc.
function asset(n) {
  return new URL(`assets/projects/${String(n).padStart(2, '0')}.webp`, document.baseURI).href;
}

function preload(n) {
  const image = new Image();
  image.src = asset(n);
  return image;
}

function setControlsDisabled(disabled) {
  prevButton.disabled = disabled;
  nextButton.disabled = disabled;
}

function updateMeta(p) {
  title.textContent = p.title;
  year.textContent = `${p.year} · ${p.location}`;
  copy.textContent = p.copy;
  total.textContent = p.images.length;
  current.textContent = index + 1;
}

function renderSlide({instant = false, direction = 1} = {}) {
  const p = projects[active];
  const n = p.images[index];
  const src = asset(n);

  updateMeta(p);
  img.alt = `${p.title} project image ${index + 1}`;

  if (instant) {
    img.src = src;
    img.classList.remove('slide-in', 'slide-in-reverse', 'slide-next-out', 'slide-prev-out');
    void img.offsetWidth;
    img.classList.add('slide-in');
    preloadAdjacent();
    return;
  }

  isLoading = true;
  setControlsDisabled(true);
  img.classList.remove('slide-in', 'slide-in-reverse');
  img.classList.add(direction > 0 ? 'slide-next-out' : 'slide-prev-out');

  const nextImage = new Image();
  nextImage.onload = () => {
    if (!active) return;
    img.src = src;
    img.classList.remove('slide-next-out', 'slide-prev-out');
    void img.offsetWidth;
    img.classList.add(direction > 0 ? 'slide-in' : 'slide-in-reverse');
    isLoading = false;
    setControlsDisabled(false);
    preloadAdjacent();
  };
  nextImage.onerror = () => {
    img.classList.remove('slide-next-out', 'slide-prev-out');
    isLoading = false;
    setControlsDisabled(false);
    img.alt = `${p.title} project image ${index + 1} (image unavailable)`;
  };
  nextImage.src = src;
}

function preloadAdjacent() {
  if (!active) return;
  const images = projects[active].images;
  preload(images[(index + 1) % images.length]);
  preload(images[(index - 1 + images.length) % images.length]);
}

function openProject(slug) {
  if (!projects[slug]) return;
  active = slug;
  index = 0;
  gallery.hidden = false;
  document.body.style.overflow = 'hidden';
  updateMeta(projects[active]);
  renderSlide();
  history.replaceState(null, '', `#${slug}`);
}

function closeProject() {
  gallery.hidden = true;
  document.body.style.overflow = '';
  active = null;
  isLoading = false;
  setControlsDisabled(false);
  history.replaceState(null, '', `${location.pathname}${location.search}`);
}

function changeSlide(direction) {
  if (!active || isLoading) return;
  const images = projects[active].images;
  index = (index + direction + images.length) % images.length;
  slideDirection = direction;
  renderSlide({direction});
}

document.querySelectorAll('.project-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    openProject(link.closest('.project').dataset.project);
  });
});

document.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeProject));
prevButton.addEventListener('click', () => changeSlide(-1));
nextButton.addEventListener('click', () => changeSlide(1));

document.addEventListener('keydown', e => {
  if (gallery.hidden) return;
  if (e.key === 'Escape') closeProject();
  if (e.key === 'ArrowRight') changeSlide(1);
  if (e.key === 'ArrowLeft') changeSlide(-1);
});

// Mobile swipe navigation.
let touchStartX = null;
gallery.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].clientX;
}, {passive: true});
gallery.addEventListener('touchend', e => {
  if (touchStartX === null || isLoading) return;
  const delta = e.changedTouches[0].clientX - touchStartX;
  touchStartX = null;
  if (Math.abs(delta) < 45) return;
  changeSlide(delta < 0 ? 1 : -1);
}, {passive: true});

// Mobile navigation
const header = document.querySelector('.site-header');
const toggle = document.querySelector('.menu-toggle');
toggle.addEventListener('click',()=>{ const on=header.classList.toggle('nav-open'); document.body.classList.toggle('menu-open',on); toggle.setAttribute('aria-expanded',String(on)); });
document.querySelectorAll('.main-nav a').forEach(a=>a.addEventListener('click',()=>{ header.classList.remove('nav-open'); document.body.classList.remove('menu-open'); toggle.setAttribute('aria-expanded','false'); }));

// Light / dark mode toggle
const themeToggle = document.getElementById('theme-toggle');
function updateThemeToggle() {
  const dark = document.documentElement.dataset.theme === 'dark';
  themeToggle.setAttribute('aria-pressed', String(dark));
  themeToggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
}
themeToggle.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('depadua-theme', next);
  updateThemeToggle();
});
updateThemeToggle();

// Scroll reveal
const revealItems = document.querySelectorAll('.reveal, .reveal-photo');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries=>entries.forEach(entry=>{ if(entry.isIntersecting){ entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }}),{threshold:.12, rootMargin:'0px 0px -8% 0px'});
  revealItems.forEach((el,i)=>{ if(!el.classList.contains('delay-1')) el.style.transitionDelay = `${Math.min((i % 4) * 70, 210)}ms`; observer.observe(el); });
} else {
  revealItems.forEach(el=>el.classList.add('is-visible'));
}

document.getElementById('year').textContent = new Date().getFullYear();

// Optional hash deep-link support
const hash = location.hash.slice(1); if(projects[hash]) openProject(hash);
