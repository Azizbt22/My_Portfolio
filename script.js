const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());

const links = [...document.querySelectorAll('nav a[href^="#"]')];
const sections = links.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    links.forEach((link) => {
      link.toggleAttribute('aria-current', link.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { rootMargin: '-30% 0px -60% 0px' });

sections.forEach((section) => observer.observe(section));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

if (document.body.classList.contains('project-page') && !document.querySelector('.scroll-progress')) {
  const track = document.createElement('div');
  track.className = 'scroll-progress';
  track.setAttribute('aria-hidden', 'true');
  track.appendChild(document.createElement('span'));
  document.body.prepend(track);
}
const progress = document.querySelector('.scroll-progress span');
if (progress) {
  const updateProgress = () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${total > 0 ? (window.scrollY / total) * 100 : 0}%`;
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
}

document.querySelectorAll('[data-carousel]').forEach((carousel) => {
  const slides = [...carousel.querySelectorAll('[data-slide]')];
  const dots = [...carousel.querySelectorAll('[data-carousel-dot]')];
  const previous = carousel.querySelector('[data-carousel-prev]');
  const next = carousel.querySelector('[data-carousel-next]');
  let activeIndex = 0;

  const showSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === activeIndex);
      slide.setAttribute('aria-hidden', String(slideIndex !== activeIndex));
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === activeIndex);
      dot.setAttribute('aria-selected', String(dotIndex === activeIndex));
    });
  };

  previous?.addEventListener('click', () => showSlide(activeIndex - 1));
  next?.addEventListener('click', () => showSlide(activeIndex + 1));
  dots.forEach((dot) => dot.addEventListener('click', () => showSlide(Number(dot.dataset.carouselDot))));
  showSlide(0);
});

const chapterLinks = [...document.querySelectorAll('.case-toc a[href^="#"]')];
const chapters = chapterLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
if (chapterLinks.length && chapters.length) {
  const chapterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      chapterLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-25% 0px -65% 0px' });
  chapters.forEach((chapter) => chapterObserver.observe(chapter));
}

document.querySelectorAll('[data-case-stepper]').forEach((stepper) => {
  const tabs = [...stepper.querySelectorAll('[data-case-step-tab]')];
  const panels = [...stepper.querySelectorAll('[data-case-step-panel]')];
  let active = 0;
  let touchStart = 0;
  const show = (index) => {
    active = (index + tabs.length) % tabs.length;
    tabs.forEach((tab, i) => {
      tab.classList.toggle('is-active', i === active);
      tab.setAttribute('aria-selected', String(i === active));
      tab.setAttribute('tabindex', i === active ? '0' : '-1');
    });
    panels.forEach((panel, i) => {
      panel.classList.toggle('is-active', i === active);
      panel.hidden = i !== active;
    });
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => show(i));
    tab.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        show(active + (event.key === 'ArrowRight' ? 1 : -1));
        tabs[active].focus();
      }
    });
  });
  const panelArea = stepper.querySelector('.step-panels');
  panelArea?.addEventListener('touchstart', (event) => { touchStart = event.changedTouches[0].clientX; }, { passive: true });
  panelArea?.addEventListener('touchend', (event) => {
    const distance = event.changedTouches[0].clientX - touchStart;
    if (Math.abs(distance) > 55) show(active + (distance < 0 ? 1 : -1));
  }, { passive: true });
  show(0);
});
