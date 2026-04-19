/* ============================================
   ART — Aquitaine Racing Team
   Main JS (Alpine.js + utilities)
   ============================================ */

// ── Navbar scroll effect ──────────────────────
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.nav');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
});

// ── Active nav link ───────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && path.endsWith(href.replace(/^\.\//, '').replace(/^\//, ''))) {
      link.classList.add('active');
    }
  });
});

// ── Load events from JSON ─────────────────────
async function loadEvents() {
  // Detect if we're inside a subfolder (events/) or at root
  const inSubfolder = window.location.pathname.includes('/events/');
  const base = inSubfolder ? '../' : './';
  try {
    const res = await fetch(base + 'events.json');
    return await res.json();
  } catch (e) {
    console.error('Could not load events.json', e);
    return [];
  }
}

// ── Render event cards ────────────────────────
function renderEventCard(ev, base = './') {
  const isUpcoming = ev.status === 'upcoming';
  const thumbSrc = ev.thumbnail
    ? base + ev.thumbnail
    : null;

  const thumbHtml = thumbSrc
    ? `<img src="${thumbSrc}" alt="${ev.title}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'event-card__thumb-placeholder\\'><svg width=\\'48\\' height=\\'48\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'1.5\\' viewBox=\\'0 0 24 24\\'><path d=\\'M3 7l9-4 9 4v13H3V7z\\'/></svg></div>'">`
    : `<div class="event-card__thumb-placeholder"><svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M3 7l9-4 9 4v13H3V7z"/></svg></div>`;

  const formBtn = isUpcoming && ev.googleForm
    ? `<a href="${ev.googleForm}" target="_blank" rel="noopener" class="event-card__link">S'inscrire <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>`
    : '';

  const photosBtn = ev.hasPhotos
    ? `<a href="${base}events/photos-${ev.id}.html" class="event-card__link">Photos <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>`
    : '';

  return `
    <div class="event-card">
      <div class="event-card__thumb">
        ${thumbHtml}
        <span class="event-card__badge ${isUpcoming ? 'badge--upcoming' : 'badge--past'}">
          ${isUpcoming ? '🏁 À venir' : 'Terminé'}
        </span>
      </div>
      <div class="event-card__body">
        <div class="event-card__date">${ev.dateDisplay}</div>
        <div class="event-card__title">${ev.title}</div>
        <div class="event-card__subtitle">${ev.subtitle}</div>
        <p class="event-card__desc">${ev.description}</p>
        <div class="event-card__footer">
          <a href="${base}events/event-${ev.id}.html" class="event-card__link">
            En savoir plus
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          ${formBtn}
          ${photosBtn}
        </div>
      </div>
    </div>`;
}

// ── Render album cards (gallery index) ────────
function renderAlbumCard(ev, base = './') {
  if (!ev.hasPhotos && ev.status !== 'upcoming') return '';
  const thumbSrc = ev.thumbnail ? base + ev.thumbnail : null;
  const thumbHtml = thumbSrc
    ? `<img src="${thumbSrc}" alt="${ev.title}" loading="lazy">`
    : `<div style="width:100%;height:100%;background:var(--gray-200)"></div>`;

  return `
    <a href="${base}events/photos-${ev.id}.html" class="album-card">
      <div class="album-card__thumb">
        ${thumbHtml}
        <div class="album-card__overlay"></div>
      </div>
      <div class="album-card__body">
        <div class="album-card__date">${ev.dateDisplay}</div>
        <div class="album-card__title">${ev.title}</div>
      </div>
    </a>`;
}

// ── Lightbox ───────────────────────────────────
function initLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;

  const lbImg = lb.querySelector('.lightbox__img');
  const lbCounter = lb.querySelector('.lightbox__counter');
  const items = [...document.querySelectorAll('.gallery-item')];
  let current = 0;

  function open(idx) {
    current = idx;
    const img = items[idx].querySelector('img');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    if (lbCounter) lbCounter.textContent = `${idx + 1} / ${items.length}`;
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.classList.remove('active');
    document.body.style.overflow = '';
  }

  function prev() { open((current - 1 + items.length) % items.length); }
  function next() { open((current + 1) % items.length); }

  items.forEach((item, i) => item.addEventListener('click', () => open(i)));
  lb.querySelector('.lightbox__close')?.addEventListener('click', close);
  lb.querySelector('.lightbox__prev')?.addEventListener('click', prev);
  lb.querySelector('.lightbox__next')?.addEventListener('click', next);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });
}

// ── Contact form (Formspree) ──────────────────
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    const original = btn.textContent;
    btn.textContent = 'Envoi en cours…';
    btn.disabled = true;

    try {
      // Replace YOUR_FORMSPREE_ID with your actual Formspree form ID
      const res = await fetch('https://formspree.io/f/xkgjndyk', {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        form.reset();
        showToast('Message envoyé ! Nous vous répondrons rapidement.');
      } else {
        showToast('Erreur lors de l\'envoi. Essayez par email directement.');
      }
    } catch {
      showToast('Erreur réseau. Essayez par email directement.');
    }
    btn.textContent = original;
    btn.disabled = false;
  });
}

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.style.display = 'block';
  setTimeout(() => t.style.display = 'none', 4000);
}

// Init everything on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initLightbox();
  initContactForm();
});
