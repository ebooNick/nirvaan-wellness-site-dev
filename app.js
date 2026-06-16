/* Nirvaan Wellness — app.js
   All page content is driven by content.json.
   Edit that file to update text, prices, images, colours, booking links. */

(async function () {
  const ROMAN = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];

  const data = await fetch('content.json').then(r => r.json());

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
    renderServiceChapters(data.serviceCategories);
  } else {
    renderServicesRedirect(data.servicesSection, data.display, data.booking);
  }
  renderPolicies(data.policies);
  renderHours(data.hours);
  renderContact(data.contact, data.booking);
  renderFooter(data.footer);
  setBackgrounds(data.images);

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

    const secondary = ch.filter(c => !c.primary);
    const secEl = document.getElementById('hero-secondary');
    if (secondary.length) {
      secEl.innerHTML = 'or connect via ' +
        secondary.map(c =>
          `<a href="${c.url}" target="_blank" rel="noopener">${c.label}</a>`
        ).join(' &nbsp;·&nbsp; ');
    } else {
      secEl.style.display = 'none';
    }
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

  // ── Service chapters ──────────────────────────────────────────

  function renderServiceChapters(categories) {
    const chaptersEl = document.getElementById('service-chapters');
    const navEl = document.getElementById('chapter-nav');

    // Chapter navigation links
    navEl.innerHTML = categories.map((cat, i) => {
      const shortName = cat.name.replace('Virtues Ritual — ', '').replace('Virtues Massages', 'Massages');
      return (i > 0 ? '<span class="sep" aria-hidden="true">·</span>' : '') +
        `<a href="#cat-${cat.id}">${shortName}</a>`;
    }).join('');

    // Chapter sections
    chaptersEl.innerHTML = categories.map((cat, i) => {
      const isCompact = cat.displayStyle === 'compact';
      const subtitleHtml = cat.subtitle
        ? `<p class="chapter-subtitle">${cat.subtitle}</p>` : '';
      const noteHtml = cat.note
        ? `<p class="chapter-note">${cat.note}</p>` : '';
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
    const rows = items.flatMap(item => {
      const v = item.variants;
      if (!v || !v.length) return [];
      // First variant row
      const first = `
        <tr class="variant-row">
          <td class="col-name">${item.name}</td>
          <td class="col-duration">${v[0].duration || ''}</td>
          <td class="col-price">${v[0].price}</td>
        </tr>`;
      // Additional variant rows
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
      items.map(item => {
        const price = item.variants?.[0]?.price || '';
        return `<div class="compact-item">
          <span class="item-name">${item.name}</span>
          <span class="item-price">${price}</span>
        </div>`;
      }).join('') +
      '</div>';
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

    // Ken Burns effect on hero
    const heroBg = document.getElementById('hero-bg');
    if (heroBg) setTimeout(() => heroBg.classList.add('loaded'), 100);
  }

  function setBg(id, url) {
    if (!url) return;
    const el = document.getElementById(id);
    if (el) el.style.backgroundImage = `url('${url}')`;
  }

  function setImg(id, url) {
    if (!url) return;
    const el = document.getElementById(id);
    if (el) el.src = url;
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
