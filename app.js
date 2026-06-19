/* Nirvaan Wellness — app.js
   All page content is driven by content.json.
   Edit that file to update text, prices, images, colours, booking links. */

(async function () {
  const ROMAN = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];

  // Set by each layout's index.html: window.NIRVAAN_LAYOUT and window.NIRVAAN_BASE
  const LAYOUT = window.NIRVAAN_LAYOUT || 'table';
  const BASE   = window.NIRVAAN_BASE   || '';

  const FAB_ICONS = {
    heygoldie: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>`,
    whatsapp: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12c0 1.77.46 3.43 1.27 4.88L2 22l5.25-1.26A9.944 9.944 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm5.08 13.6c-.21.6-1.22 1.14-1.68 1.21-.43.06-.97.09-1.57-.1-.36-.12-.82-.27-1.41-.53-2.48-1.07-4.1-3.56-4.22-3.73-.12-.17-1-1.33-1-2.54 0-1.21.63-1.8.86-2.05.21-.23.46-.29.62-.29.16 0 .31 0 .45.01.14.01.34-.05.53.41.2.47.68 1.66.74 1.78.06.12.1.27.02.43-.08.16-.12.26-.24.4-.12.14-.25.31-.36.42-.12.12-.24.24-.1.47.14.23.62.99 1.33 1.6.91.81 1.68 1.06 1.91 1.18.23.12.37.1.51-.06.14-.16.59-.69.75-.92.16-.23.32-.19.54-.11.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.57-.15 1.17z"/>
    </svg>`,
    instagram: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>`,
  };

  const data = await fetch(window.NIRVAAN_CONTENT || 'content.json').then(r => r.json());

  applyTheme(data.theme);
  document.title = data.meta.siteTitle;
  setMeta('description', data.meta.description);

  renderNav(data.nav);
  renderHeaderCta(data.booking);
  renderHero(data);
  renderManifesto(data.manifesto);
  renderPhilosophy(data.philosophy, data.images.philosophy);
  renderVirtuesIntro(data.servicesSection);

  if (data.display?.showFullMenu !== false) {
    if (LAYOUT === 'cards') {
      renderServiceCards(data.serviceCategories);
    } else {
      renderServiceChapters(data.serviceCategories);
    }
  } else {
    renderServicesRedirect(data.servicesSection, data.display, data.booking);
  }

  renderPolicies(data.policies);
  renderHours(data.hours);
  renderContact(data.contact, data.booking);
  renderFooter(data.footer);
  setBackgrounds(data.images);
  renderFab(data.fab);

  initScrollReveal();
  initHeaderScroll();
  initNavToggle();

  // ── helpers ──────────────────────────────────────────────────

  function setMeta(name, content) {
    const el = document.querySelector(`meta[name="${name}"]`);
    if (el) el.setAttribute('content', content);
  }

  function applyTheme(theme = {}) {
    const root = document.documentElement;
    const map = {
      gold:       '--color-gold',
      goldDark:   '--color-gold-dark',
      goldLight:  '--color-gold-light',
      cream:      '--color-cream',
      brownDark:  '--color-brown-dark',
      brownMid:   '--color-brown-mid',
      sage:       '--color-sage',
      sageLight:  '--color-sage-light',
      sageDark:   '--color-sage-dark',
      tan:        '--color-tan',
    };
    Object.entries(theme.colors || {}).forEach(([k, v]) => {
      if (map[k]) root.style.setProperty(map[k], v);
    });
    if (theme.fonts?.heading) root.style.setProperty('--font-heading', theme.fonts.heading);
    if (theme.fonts?.body)    root.style.setProperty('--font-body',    theme.fonts.body);
  }

  function enabledChannels(booking) {
    return (booking?.channels || [])
      .filter(c => c.enabled)
      .sort((a, b) => (b.primary ? 1 : 0) - (a.primary ? 1 : 0));
  }

  function visibleItems(items) {
    return (items || []).filter(item => item.visible !== false);
  }

  // ── Nav ──────────────────────────────────────────────────────

  function renderNav(nav) {
    document.getElementById('nav-links').innerHTML =
      (nav || []).map(n => `<li><a href="${n.href}">${n.label}</a></li>`).join('');
  }

  function renderHeaderCta(booking) {
    const ch = enabledChannels(booking);
    const primary = ch.find(c => c.primary) || ch[0];
    const el = document.getElementById('header-cta');
    if (!primary) { el.style.display = 'none'; return; }
    el.href = primary.url;
  }

  // ── Hero ─────────────────────────────────────────────────────

  function renderHero(data) {
    const ch = enabledChannels(data.booking);
    const primary = ch.find(c => c.primary) || ch[0];

    document.getElementById('hero-tagline').textContent =
      data.brand?.tagline || '';

    const cta = document.getElementById('hero-cta');
    if (primary) { cta.href = primary.url; } else { cta.style.display = 'none'; }

    // Secondary channels hidden when FAB is enabled — avoids duplication
    const secEl = document.getElementById('hero-secondary');
    const showSecondary = data.display?.showHeroChannels !== false && !data.fab?.enabled;
    if (showSecondary) {
      const secondary = ch.filter(c => !c.primary);
      if (secondary.length) {
        secEl.innerHTML = 'or connect via ' +
          secondary.map(c =>
            `<a href="${c.url}" target="_blank" rel="noopener">${c.label}</a>`
          ).join(' &nbsp;·&nbsp; ');
        return;
      }
    }
    secEl.style.display = 'none';
  }

  // ── Manifesto ────────────────────────────────────────────────

  function renderManifesto(manifesto) {
    const el = document.getElementById('manifesto-quote');
    if (!el) return;
    el.textContent = manifesto?.quote || '';
  }

  // ── Philosophy ───────────────────────────────────────────────

  function renderPhilosophy(philosophy, imgUrl) {
    document.getElementById('philosophy-heading').textContent = philosophy.heading || '';
    const img = document.getElementById('philosophy-img');
    if (imgUrl) { img.src = imgUrl; img.alt = 'Meditation at sunrise'; }
    document.getElementById('philosophy-paragraphs').innerHTML =
      (philosophy.paragraphs || []).map(p => `<p>${p}</p>`).join('');
  }

  // ── Virtues intro + chapter nav ───────────────────────────────

  function renderVirtuesIntro(ss) {
    if (!ss) return;
    document.getElementById('virtues-heading').textContent = ss.heading || '';
    document.getElementById('virtues-intro-text').textContent = ss.intro || '';
  }

  // ── Service chapters — table layout ───────────────────────────

  function renderServiceChapters(categories) {
    const chaptersEl = document.getElementById('service-chapters');
    const navEl = document.getElementById('chapter-nav');
    const cats = categories.filter(cat => visibleItems(cat.items).length > 0);

    navEl.innerHTML = cats.map((cat, i) => {
      const shortName = cat.name.replace('Virtues Ritual — ', '').replace('Virtues Massages', 'Massages');
      return (i > 0 ? '<span class="sep" aria-hidden="true">·</span>' : '') +
        `<a href="#cat-${cat.id}">${shortName}</a>`;
    }).join('');

    chaptersEl.innerHTML = cats.map((cat, i) => {
      const isCompact = cat.displayStyle === 'compact';
      const subtitleHtml = cat.subtitle ? `<p class="chapter-subtitle">${cat.subtitle}</p>` : '';
      const noteHtml = cat.note ? `<p class="chapter-note">${cat.note}</p>` : '';
      const contentHtml = isCompact
        ? renderCompact(cat.items)
        : renderMenuTable(cat.items);

      return `
        <section class="service-chapter reveal" id="cat-${cat.id}">
          <div class="chapter-inner">
            <p class="chapter-numeral" aria-hidden="true">${ROMAN[i] || i + 1}</p>
            <h2 class="chapter-name">${cat.name}</h2>
            ${subtitleHtml}
            <div class="chapter-rule" aria-hidden="true"></div>
            ${noteHtml}
            ${contentHtml}
          </div>
        </section>`;
    }).join('');
  }

  function renderMenuTable(items) {
    const rows = visibleItems(items).flatMap(item => {
      const v = item.variants;
      if (!v || !v.length) return [];
      const descHtml = item.description
        ? `<span class="item-desc">${item.description}</span>` : '';
      const first = `
        <tr class="variant-row">
          <td class="col-name">${item.name}${descHtml}</td>
          <td class="col-duration">${v[0].duration || ''}</td>
          <td class="col-price">${v[0].price}</td>
        </tr>`;
      const rest = v.slice(1).map(vv => `
        <tr class="variant-row variant-extra">
          <td class="col-name" aria-hidden="true">&nbsp;</td>
          <td class="col-duration">${vv.duration || ''}</td>
          <td class="col-price">${vv.price}</td>
        </tr>`).join('');
      return [first + rest];
    }).join('');
    return `<table class="service-menu" role="list"><tbody>${rows}</tbody></table>`;
  }

  function renderCompact(items) {
    return '<div class="service-compact">' +
      visibleItems(items).map(item => {
        const price = item.variants?.[0]?.price || '';
        return `<div class="compact-item">
          <span class="item-name">${item.name}</span>
          <span class="item-price">${price}</span>
        </div>`;
      }).join('') +
      '</div>';
  }

  // ── Service chapters — cards layout ───────────────────────────

  function renderServiceCards(categories) {
    const chaptersEl = document.getElementById('service-chapters');
    const navEl = document.getElementById('chapter-nav');
    const cats = categories.filter(cat => visibleItems(cat.items).length > 0);

    navEl.innerHTML = cats.map((cat, i) => {
      const shortName = cat.name.replace('Virtues Ritual — ', '').replace('Virtues Massages', 'Massages');
      return (i > 0 ? '<span class="sep" aria-hidden="true">·</span>' : '') +
        `<a href="#cat-${cat.id}">${shortName}</a>`;
    }).join('');

    chaptersEl.innerHTML = cats.map((cat, i) => {
      const isCompact = cat.displayStyle === 'compact';
      const subtitleHtml = cat.subtitle ? `<p class="chapter-subtitle">${cat.subtitle}</p>` : '';
      const noteHtml = cat.note ? `<p class="chapter-note">${cat.note}</p>` : '';
      const contentHtml = isCompact
        ? renderCompact(cat.items)
        : renderCardGrid(cat.items);

      return `
        <section class="service-chapter reveal" id="cat-${cat.id}">
          <div class="chapter-inner">
            <p class="chapter-numeral" aria-hidden="true">${ROMAN[i] || i + 1}</p>
            <h2 class="chapter-name">${cat.name}</h2>
            ${subtitleHtml}
            <div class="chapter-rule" aria-hidden="true"></div>
            ${noteHtml}
            ${contentHtml}
          </div>
        </section>`;
    }).join('');
  }

  function renderCardGrid(items) {
    const cards = visibleItems(items).map(item => {
      const variantHtml = (item.variants || []).map(v => `
        <div class="card-variant">
          ${v.duration ? `<span class="card-duration">${v.duration}</span>` : ''}
          <span class="card-price">${v.price}</span>
        </div>`).join('');
      const descHtml = item.description
        ? `<p class="card-description">${item.description}</p>` : '';
      return `
        <div class="service-card">
          <h3 class="card-name">${item.name}</h3>
          <div class="card-variants">${variantHtml}</div>
          ${descHtml}
        </div>`;
    }).join('');
    return `<div class="service-card-grid">${cards}</div>`;
  }

  // ── Services redirect (showFullMenu: false) ───────────────────

  function renderServicesRedirect(ss, display, booking) {
    const ch = enabledChannels(booking);
    const primary = ch.find(c => c.primary) || ch[0];
    const chaptersEl = document.getElementById('service-chapters');
    chaptersEl.innerHTML = `
      <section class="services-redirect reveal" id="virtues">
        <div class="container">
          <p class="section-label">Our Services</p>
          <h2>${ss?.heading || 'The Virtues'}</h2>
          <p class="services-redirect-note">${display?.menuRedirectNote || ''}</p>
          ${primary ? `<a href="${primary.url}" class="btn-services-redirect" target="_blank" rel="noopener">${primary.label}</a>` : ''}
        </div>
      </section>`;
  }

  // ── Policies ─────────────────────────────────────────────────

  function renderPolicies(policies) {
    document.getElementById('policies-list').innerHTML =
      (policies || []).map(p => `
        <div class="policy-card">
          <h3>${p.heading}</h3>
          ${p.paragraphs.map(t => `<p>${t}</p>`).join('')}
        </div>`).join('');
  }

  // ── Hours ────────────────────────────────────────────────────

  function renderHours(hours) {
    document.getElementById('hours-table').innerHTML =
      (hours || []).map(r =>
        `<tr><td>${r.days}</td><td>${r.time}</td></tr>`
      ).join('');
  }

  // ── Contact ──────────────────────────────────────────────────

  function renderContact(contact, booking) {
    document.getElementById('contact-details').innerHTML = `
      <li>
        <span class="label">Location</span>
        ${contact.location}
      </li>
      <li>
        <span class="label">Phone &amp; WhatsApp</span>
        <a href="${contact.whatsapp}" target="_blank" rel="noopener">${contact.phone}</a>
      </li>
      <li>
        <span class="label">Instagram</span>
        <a href="${contact.instagramUrl}" target="_blank" rel="noopener">${contact.instagramHandle}</a>
      </li>`;

    const ch = enabledChannels(booking);
    document.getElementById('contact-actions').innerHTML =
      ch.map(c =>
        `<a href="${c.url}" target="_blank" rel="noopener"
            class="btn-contact ${c.primary ? 'btn-contact-primary' : 'btn-contact-secondary'}">
          ${c.label}
        </a>`
      ).join('');
  }

  // ── Footer ───────────────────────────────────────────────────

  function renderFooter(footer) {
    const el = document.getElementById('footer-text');
    if (el) el.textContent = footer?.text || '';
  }

  // ── Background images ─────────────────────────────────────────

  function setBackgrounds(images) {
    setBg('hero-bg',    images.hero);
    setBg('contact-bg', images.contact);
    setImg('philosophy-img', images.philosophy);
    setImg('services-img',   images.services);

    const heroBg = document.getElementById('hero-bg');
    if (heroBg) setTimeout(() => heroBg.classList.add('loaded'), 100);
  }

  function setBg(id, url) {
    if (!url) return;
    const el = document.getElementById(id);
    if (el) el.style.backgroundImage = `url('${BASE}${url}')`;
  }

  function setImg(id, url) {
    if (!url) return;
    const el = document.getElementById(id);
    if (el) el.src = `${BASE}${url}`;
  }

  // ── FAB (floating action button) ─────────────────────────────

  function renderFab(fab) {
    if (!fab?.enabled) return;
    const channels = (fab.channels || []).filter(c => c.enabled);
    if (!channels.length) return;

    const fabEl = document.getElementById('fab');
    if (!fabEl) return;

    fabEl.innerHTML = `
      <div class="fab-channels" id="fab-channels">
        ${channels.map(c => `
          <a href="${c.url}" target="_blank" rel="noopener"
             class="fab-action fab-${c.id}" aria-label="${c.label}">
            ${FAB_ICONS[c.id] || ''}
          </a>`).join('')}
      </div>
      <button class="fab-toggle" id="fab-toggle"
              aria-label="Connect with us" aria-expanded="false">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
             stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
          <line x1="9" y1="2" x2="9" y2="16"/>
          <line x1="2" y1="9" x2="16" y2="9"/>
        </svg>
      </button>`;

    const toggle = document.getElementById('fab-toggle');
    toggle.addEventListener('click', () => {
      const open = fabEl.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    document.addEventListener('click', e => {
      if (!fabEl.contains(e.target)) {
        fabEl.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ── Scroll reveal ─────────────────────────────────────────────

  function initScrollReveal() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }

  // ── Header scroll ─────────────────────────────────────────────

  function initHeaderScroll() {
    const header = document.getElementById('site-header');
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ── Mobile nav ────────────────────────────────────────────────

  function initNavToggle() {
    const header   = document.getElementById('site-header');
    const toggle   = document.getElementById('nav-toggle');
    const backdrop = document.getElementById('nav-backdrop');

    function closeNav() {
      header.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
      backdrop?.classList.remove('active');
    }

    toggle.addEventListener('click', () => {
      const open = header.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', String(open));
      backdrop?.classList.toggle('active', open);
    });

    backdrop?.addEventListener('click', closeNav);

    document.querySelectorAll('#main-nav a').forEach(a =>
      a.addEventListener('click', closeNav)
    );
  }
})();
