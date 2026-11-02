const WA_SVG = '<svg aria-hidden="true" viewBox="0 0 32 32"><path fill="currentColor" d="M16 3C8.8 3 3 8.7 3 15.7c0 2.5.7 4.8 2 6.8L3.6 28.6l6.3-1.6c1.8 1 3.9 1.5 6.1 1.5 7.2 0 13-5.7 13-12.7S23.2 3 16 3zm0 23.2c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-3.7 1 1-3.6-.3-.4c-1.1-1.7-1.7-3.7-1.7-5.7C5.5 10 10.2 5.4 16 5.4s10.5 4.6 10.5 10.3S21.8 26.2 16 26.2z"/><path fill="currentColor" d="M21.8 18.5c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.7s1.2 3.2 1.4 3.4c.2.2 2.4 3.6 5.7 5 2.8 1.1 3.4.9 4 .8.6-.1 1.9-.8 2.2-1.5.3-.8.3-1.4.2-1.5-.1-.1-.3-.2-.6-.4z"/></svg>';
const money = value => new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL', maximumFractionDigits: 0}).format(value);
const priceOf = p => p.price ? money(p.price) : (p.priceText || 'Sob consulta');
const waLink = text => `https://wa.me/${window.WHATSAPP}?text=${encodeURIComponent(text)}`;
const pageUrl = p => `imovel.html?id=${p.id}`;

function cardHTML(p) {
  return `<article class="property-card">
    <a class="property-image" href="${pageUrl(p)}" aria-label="Ver ${p.title}"><img src="${p.images[0]}" alt="${p.category} — ${p.location}" loading="lazy"><span class="property-tag">${p.tag}</span>${p.images.length > 1 ? `<span class="photo-count">${p.images.length} fotos</span>` : ''}</a>
    <div class="property-info">
      <div class="property-meta"><div class="property-features">${p.facts.map(f => `<span>${f}</span>`).join('')}</div><span>${p.city}</span></div>
      <h3><a href="${pageUrl(p)}">${p.title}</a></h3>
      <p class="property-category">${p.category} · ${p.location}</p>
      <p class="property-price">${priceOf(p)}</p>
      <a class="button property-cta" href="${pageUrl(p)}">Ver detalhes <span aria-hidden="true">→</span></a>
    </div>
  </article>`;
}

/* Home: catálogo com filtros */
const grid = document.querySelector('#property-grid');
if (grid) {
  const render = filter => {
    const list = window.properties.filter(p => filter === 'todos' || p.type === filter);
    grid.innerHTML = list.map(cardHTML).join('');
    document.querySelector('.catalog-count').textContent = `${String(list.length).padStart(2, '0')} imóveis selecionados`;
  };
  const setFilter = filter => {
    document.querySelectorAll('[data-filter]').forEach(b => {
      const active = b.dataset.filter === filter;
      b.classList.toggle('active', active);
      b.setAttribute('aria-pressed', String(active));
    });
    render(filter);
  };
  document.querySelectorAll('[data-filter]').forEach(b => b.addEventListener('click', () => setFilter(b.dataset.filter)));
  const launches = document.querySelector('#see-launches');
  if (launches) launches.addEventListener('click', () => { setFilter('lancamento'); document.querySelector('#imoveis').scrollIntoView({behavior: 'smooth'}); });
  render('todos');
}

/* Página interna do imóvel */
const detail = document.querySelector('#property-page');
if (detail) {
  const id = new URLSearchParams(location.search).get('id');
  const p = window.properties.find(item => item.id === id) || window.properties[0];
  const msg = `Olá, Matheus! Tenho interesse no imóvel "${p.title}" (${p.location}). Pode me passar mais informações?`;
  document.title = `${p.title} | Matheus Cardoso Imóveis`;

  detail.innerHTML = `
    <nav class="breadcrumb" aria-label="Você está em"><a href="index.html">Início</a><span>/</span><a href="index.html#imoveis">Imóveis</a><span>/</span><span>${p.category}</span></nav>
    <div class="detail-head">
      <div><span class="tag"><i></i>${p.tag}</span><h1>${p.title}</h1><p class="detail-location">${p.location} · ${p.city}</p></div>
    </div>
    <div class="detail-grid">
      <div class="detail-main">
        <div class="gallery">
          <div class="gallery-stage" style="--bg:url('${p.images[0]}')">
            <img id="gallery-main" src="${p.images[0]}" alt="${p.title} — foto 1">
            ${p.images.length > 1 ? `<button class="gallery-nav prev" aria-label="Foto anterior">‹</button><button class="gallery-nav next" aria-label="Próxima foto">›</button>` : ''}
            <span class="gallery-count"><span id="gallery-index">1</span> / ${p.images.length}</span>
          </div>
          ${p.images.length > 1 ? `<div class="gallery-thumbs">${p.images.map((src, i) => `<button class="${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Ver foto ${i + 1}"><img src="${src}" alt=""></button>`).join('')}</div>` : ''}
        </div>

        <div class="detail-price-mobile"><span>Valor</span><strong>${priceOf(p)}</strong></div>

        <section class="detail-block"><h2>Detalhes</h2><dl class="specs">${p.specs.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl></section>
        <section class="detail-block"><h2>Descrição</h2><p>${p.description}</p></section>
        <section class="detail-block"><h2>Diferenciais</h2><ul class="checklist">${p.features.map(f => `<li>${f}</li>`).join('')}</ul></section>
        <section class="detail-block"><h2>Localização</h2><p class="detail-place"><strong>${p.location}</strong><br>${p.city}</p><p class="detail-note">O endereço completo é informado no atendimento.</p></section>
      </div>

      <aside class="contact-card" aria-label="Contato">
        <span class="contact-card-label">Valor</span>
        <strong class="contact-card-price">${priceOf(p)}</strong>
        <p class="contact-card-sub">Valores e disponibilidade sujeitos a confirmação.</p>
        <a class="button whatsapp-button" href="${waLink(msg)}" target="_blank" rel="noopener noreferrer">${WA_SVG}Falar no WhatsApp</a>
        <a class="button button-outline" href="${p.post}" target="_blank" rel="noopener noreferrer">Ver vídeo no Instagram <span aria-hidden="true">→</span></a>
        <div class="agent"><span class="monogram">MC</span><div><strong>Matheus Cardoso</strong><small>Corretor de imóveis · Goiânia</small></div></div>
      </aside>
    </div>`;

  const related = window.properties.filter(item => item.id !== p.id).slice(0, 3);
  document.querySelector('#related-grid').innerHTML = related.map(cardHTML).join('');
  document.querySelector('#mobile-wa').href = waLink(msg);

  let index = 0;
  const main = document.querySelector('#gallery-main');
  const stage = document.querySelector('.gallery-stage');
  const show = i => {
    index = (i + p.images.length) % p.images.length;
    main.src = p.images[index];
    main.alt = `${p.title} — foto ${index + 1}`;
    stage.style.setProperty('--bg', `url('${p.images[index]}')`);
    document.querySelector('#gallery-index').textContent = index + 1;
    document.querySelectorAll('.gallery-thumbs button').forEach((b, n) => b.classList.toggle('active', n === index));
  };
  document.querySelector('.gallery-nav.prev')?.addEventListener('click', () => show(index - 1));
  document.querySelector('.gallery-nav.next')?.addEventListener('click', () => show(index + 1));
  document.querySelectorAll('.gallery-thumbs button').forEach(b => b.addEventListener('click', () => show(Number(b.dataset.index))));
}

/* Menu mobile */
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
if (toggle && nav) {
  const setOpen = open => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    nav.classList.toggle('open', open);
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
}

/* Acordeões: um aberto por vez */
document.querySelectorAll('.faq-list, .steps-list').forEach(group => group.querySelectorAll('details').forEach(d => d.addEventListener('toggle', () => {
  if (d.open) group.querySelectorAll('details').forEach(o => { if (o !== d) o.open = false; });
})));

/* Botão flutuante de WhatsApp (todas as páginas) */
const floating = document.createElement('a');
floating.className = 'whatsapp-float';
floating.href = waLink('Olá, Matheus! Vim pelo site e gostaria de ajuda para encontrar um imóvel.');
floating.target = '_blank';
floating.rel = 'noopener noreferrer';
floating.setAttribute('aria-label', 'Conversar com Matheus no WhatsApp');
floating.innerHTML = `${WA_SVG}`;
document.body.appendChild(floating);

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
