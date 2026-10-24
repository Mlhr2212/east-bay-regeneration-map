import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers';
import { approximateCenter } from '@/helpers/location-privacy';
import { familyOf } from '@/_config/RegenConfig';

// Privacy-safe public feed (steward-bank §1): /projects/map returns only
// resource_type listings, whitelisted fields, and coords already coarsened for
// private locations — exact coordinates never leave the backend.
const baseUrl = `${import.meta.env.VITE_API_URL}/api/projects/map`;

/**
 * Adapt a Strapi `Project` (flat v5 entry) into the Regeneration Map resource
 * shape (brief §5). Only projects carrying a `resource_type` are map resources,
 * so garden/infrastructure projects stay off the public map.
 *
 * Private locations (brief §1): never expose exact coordinates — the pin is
 * moved to an approximate neighbourhood centre and flagged so the UI shows
 * neighbourhood only.
 */
export function projectToResource(p) {
  if (!p || !p.resource_type) return null;

  const isPrivate = !!p.is_private_location;
  let latitude = p.latitude ?? null;
  let longitude = p.longitude ?? null;
  if (isPrivate && latitude != null && longitude != null) {
    const approx = approximateCenter(latitude, longitude, p.slug || p.documentId);
    if (approx) {
      latitude = approx.latitude;
      longitude = approx.longitude;
    }
  }

  return {
    id: p.slug || p.documentId || String(p.id),
    slug: p.slug,
    documentId: p.documentId,
    name: p.title,
    type: p.resource_type,
    family: familyOf(p.resource_type),
    neighbourhood: p.neighbourhood || '',
    city: p.location_city || '',
    region: p.region || 'east-bay',
    status: p.map_status || 'active',
    description: p.description || p.short_description || '',
    shortDescription: p.short_description || '',
    serves: p.serves || '',
    participate: Array.isArray(p.participate) ? p.participate : [],
    hours: p.hours || '',
    contactUrl: p.contact_url || '',
    sourceUrl: p.source_url || '',
    sourceType: p.source_type || 'community',
    lastChecked: p.last_checked || null,
    isPrivate,
    scenarioTags: Array.isArray(p.scenario_tags) ? p.scenario_tags : [],
    stewardClaimed: !!p.steward_claimed,
    latitude,
    longitude,
    gardenSlug: p.garden?.slug || null,
    heroUrl: p.hero_image?.url || null,
  };
}

export const useResourcesStore = defineStore({
  id: 'resources',
  state: () => ({
    resources: [],
    loading: false,
    error: null,
    // 'api' when served live from Strapi, 'fallback' when the bundled JSON was used.
    source: null,
  }),
  getters: {
    // Only active/needs_verification shown by default; inactive is opt-in.
    activeResources: (state) => state.resources.filter((r) => r.status !== 'inactive'),
    neighbourhoods: (state) =>
      [...new Set(state.resources.map((r) => r.neighbourhood).filter(Boolean))].sort(),
    cities: (state) => [...new Set(state.resources.map((r) => r.city).filter(Boolean))].sort(),
    bySlug: (state) => (slug) => state.resources.find((r) => r.slug === slug) || null,
  },
  actions: {
    async fetchAll() {
      this.loading = true;
      this.error = null;
      try {
        const res = await fetchWrapper.get(baseUrl);
        const rows = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        const mapped = rows.map(projectToResource).filter(Boolean);
        if (!mapped.length) throw new Error('No map resources returned from API');
        this.resources = mapped;
        this.source = 'api';
      } catch (err) {
        // Backend off/unreachable or empty — fall back to the bundled dataset so
        // the demo never shows a blank map (brief §7).
        try {
          const fallback = (await import('@/data/resources.json')).default;
          this.resources = fallback.map(projectToResource).filter(Boolean);
          this.source = 'fallback';
          this.error = null;
        } catch (fallbackErr) {
          this.resources = [];
          this.error = err?.message || 'Could not load resources';
          this.source = null;
        }
      } finally {
        this.loading = false;
      }
    },
    // --- Demo moderation mutations (client-side; in production an approval is a
    // pull request / Strapi review_status change — stated honestly in the UI). ---

    // Stamp a listing as checked today; clears a needs_verification flag.
    markChecked(slug) {
      const r = this.resources.find((x) => x.slug === slug);
      if (!r) return;
      r.lastChecked = new Date().toISOString().slice(0, 10);
      if (r.status === 'needs_verification') r.status = 'active';
    },
    markInactive(slug) {
      const r = this.resources.find((x) => x.slug === slug);
      if (r) r.status = 'inactive';
    },
    // Steward edits (Flow 3) — patch allowed fields on a listing.
    updateListing(slug, patch = {}) {
      const r = this.resources.find((x) => x.slug === slug);
      if (!r) return;
      const allowed = ['hours', 'description', 'shortDescription', 'serves', 'status'];
      for (const k of allowed) if (k in patch) r[k] = patch[k];
      r.lastChecked = new Date().toISOString().slice(0, 10);
    },
    claimListing(slug) {
      const r = this.resources.find((x) => x.slug === slug);
      if (r) r.stewardClaimed = true;
    },
    // Reflect an approved proposal onto the public listings.
    applyProposal(p) {
      if (!p) return;
      const today = new Date().toISOString().slice(0, 10);
      if (p.kind === 'correction' && p.targetSlug) {
        const r = this.resources.find((x) => x.slug === p.targetSlug);
        if (!r) return;
        const f = p.fields || {};
        if (f.hours?.new) r.hours = f.hours.new;
        if (f.map_status?.new) r.status = f.map_status.new;
        r.lastChecked = today;
      } else if (p.fields?.name) {
        // New suggestion or approved candidate → add a minimal public listing.
        const slug = (p.fields.name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        if (this.resources.some((x) => x.slug === slug)) return;
        this.resources.unshift({
          id: slug, slug, name: p.fields.name, type: p.fields.type || 'neighbourhood-group',
          family: 'gather', neighbourhood: p.fields.neighbourhood || '', city: p.fields.city || '',
          region: 'east-bay', status: 'active', description: p.fields.serves || '', shortDescription: p.fields.serves || '',
          serves: p.fields.serves || '', participate: p.fields.participate || [], hours: '', contactUrl: '',
          sourceUrl: p.sourceType === 'crawl-candidate' ? p.source : '', sourceType: p.sourceType || 'community',
          lastChecked: today, isPrivate: false, scenarioTags: [], stewardClaimed: false,
          latitude: null, longitude: null, gardenSlug: null, heroUrl: null,
        });
      }
    },

    // Haversine distance in km — for the "near me" sort (mirrors location-tracking.store).
    haversineDistance(lat1, lng1, lat2, lng2) {
      const R = 6371;
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLng = ((lng2 - lng1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    },
  },
});
