// Minimal SEO helpers for a Vite SPA (brief §9). Per-page <title> is handled by
// @vueuse/core's useTitle; these set the meta description and a JSON-LD block.
// NOTE: this app is client-rendered, so this metadata is populated by JS — it
// is not server-prerendered. Documented honestly in README.

export function setMetaDescription(desc) {
  if (typeof document === 'undefined') return;
  let el = document.querySelector('meta[name="description"]');
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', 'description');
    document.head.appendChild(el);
  }
  el.setAttribute('content', desc || '');
}

// Inject/replace a JSON-LD <script> by id. NEVER pass a private address or a
// personal contact in `obj` (brief §1/§9).
export function setJsonLd(id, obj) {
  if (typeof document === 'undefined') return;
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(obj);
}

export function clearJsonLd(id) {
  if (typeof document === 'undefined') return;
  document.getElementById(id)?.remove();
}

// Build privacy-safe schema.org data for a listing. Area only — no coordinates,
// no street address, no personal contact.
export function listingJsonLd(r, url) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: r.name,
    description: r.shortDescription || r.description || '',
    areaServed: [r.neighbourhood, r.city].filter(Boolean).join(', ') || 'East Bay',
    url,
  };
  if (r.sourceUrl) data.sameAs = [r.sourceUrl];
  return data;
}
