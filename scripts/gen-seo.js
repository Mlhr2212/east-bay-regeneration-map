// Generate public/sitemap.xml from the regeneration listings so every listing
// page is crawlable. Runs as a prebuild step, so a data change keeps SEO in
// sync (brief §7/§9). Override the host with SITE_URL at build time.
const fs = require('fs');
const path = require('path');

const SITE = (process.env.SITE_URL || 'https://garden-vue-hack.vercel.app').replace(/\/$/, '');
const resources = require(path.join(__dirname, '..', 'src', 'data', 'resources.json'));

const staticPaths = ['/regeneration', '/regeneration/suggest', '/regeneration/replicate'];
const listingPaths = resources
  .filter((r) => r.slug && r.map_status !== 'inactive')
  .map((r) => `/regeneration/${r.slug}`);

const urls = [...staticPaths, ...listingPaths]
  .map((p) => `  <url><loc>${SITE}${p}</loc></url>`)
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

const out = path.join(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(out, xml);
console.log(`sitemap.xml: ${staticPaths.length + listingPaths.length} urls → ${out}`);
