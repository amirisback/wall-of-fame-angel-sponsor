/**
 * Wall of Fame - Dynamic Content Renderer
 * Loads content from data/content.json and renders all sections dynamically.
 */

document.addEventListener('DOMContentLoaded', () => {
  fetchContent();
});

async function fetchContent() {
  try {
    const response = await fetch('data/content.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    renderAll(data);
  } catch (error) {
    console.error('Failed to load content.json:', error);
  }
}

function renderAll(data) {
  renderHeader(data.site);
  renderBanner(data.banner);
  renderSponsors(data.sponsors);
  renderFooter(data.footer);
  document.title = data.site.title;
}

// ─── Header ──────────────────────────────────────────────
function renderHeader(site) {
  const heading = document.querySelector('header .heading-section h4');
  if (heading) heading.textContent = site.brandName;
}

// ─── Banner / Hero ───────────────────────────────────────
function renderBanner(banner) {
  const section = document.querySelector('.main-banner .header-text');
  if (!section) return;

  section.innerHTML = `
    <h6>${banner.subtitle}</h6>
    <h4>${banner.title}</h4>
    <div class="main-button">
      <a href="${banner.buttonUrl}">${banner.buttonText}</a>
    </div>
  `;
}

// ─── Sponsors ────────────────────────────────────────────
function renderSponsors(sponsors) {
  const container = document.getElementById('sponsors-container');
  if (!container) return;

  // Section heading
  const headingDiv = document.createElement('div');
  headingDiv.className = 'col-lg-12';
  headingDiv.innerHTML = `
    <div class="heading-section">
      <h4>${sponsors.sectionTitle}</h4>
    </div>
  `;

  // Build sponsor cards in rows of 4
  const list = sponsors.list;
  let rowsHTML = '';
  for (let i = 0; i < list.length; i += 4) {
    const chunk = list.slice(i, i + 4);
    const cardsHTML = chunk.map(sponsor => `
      <div class="col-lg-3 col-sm-6">
        <div class="item">
          <a href="${sponsor.url}">
            <img src="${sponsor.avatar}" alt="${sponsor.name}">
            <h4>${sponsor.name}<br><span>github.com/${sponsor.username}</span></h4>
          </a>
        </div>
      </div>
    `).join('');
    rowsHTML += `<div class="row">${cardsHTML}</div>`;
  }

  // CTA button
  const ctaHTML = `
    <div class="row">
      <div class="col-lg-12">
        <div class="main-button">
          <a href="${sponsors.ctaButtonUrl}">${sponsors.ctaButtonText}</a>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = '';
  container.appendChild(headingDiv);
  container.insertAdjacentHTML('beforeend', rowsHTML + ctaHTML);
}

// ─── Footer ──────────────────────────────────────────────
function renderFooter(footer) {
  const footerEl = document.querySelector('footer .col-lg-12 p');
  if (footerEl) footerEl.innerHTML = footer.copyright;
}
