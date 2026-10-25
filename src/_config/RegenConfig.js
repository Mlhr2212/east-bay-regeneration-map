/**
 * Regeneration Map constants (brief §5 taxonomy + §8 design tokens).
 * Single source of truth shared by the map, detail, suggest, and moderation views.
 */

// Type families for the filter bar (Hick's/Miller: 5 groups, full list behind "more").
export const TYPE_FAMILIES = [
  { key: 'grow', label: 'Grow', color: '#2D5A3D' },   // moss
  { key: 'eat', label: 'Eat', color: '#C96F4A' },     // clay
  { key: 'share', label: 'Share', color: '#5A7A68' }, // sage-dark
  { key: 'learn', label: 'Learn', color: '#8A6D3B' }, // earth
  { key: 'gather', label: 'Gather', color: '#6B7A6F' }, // muted
];

// Primary resource types → { label, family }. Keys match the backend enum.
export const RESOURCE_TYPES = {
  'community-garden': { label: 'Community garden', family: 'grow' },
  'demonstration-project': { label: 'Demonstration project', family: 'grow' },
  'regenerative-business': { label: 'Regenerative business', family: 'grow' },
  'community-fridge': { label: 'Community fridge', family: 'eat' },
  'food-pantry': { label: 'Food pantry', family: 'eat' },
  'food-bank': { label: 'Food bank', family: 'eat' },
  'tool-library': { label: 'Tool library', family: 'share' },
  'seed-library': { label: 'Seed library', family: 'share' },
  'mutual-aid': { label: 'Mutual aid', family: 'share' },
  'training': { label: 'Training', family: 'learn' },
  'school': { label: 'School garden', family: 'learn' },
  'resilience-hub': { label: 'Resilience hub', family: 'gather' },
  'community-space': { label: 'Community space', family: 'gather' },
  'community-center': { label: 'Community center', family: 'gather' },
  'nonprofit': { label: 'Nonprofit', family: 'gather' },
  'neighbourhood-group': { label: 'Neighbourhood group', family: 'gather' },
};

const FAMILY_COLOR = Object.fromEntries(TYPE_FAMILIES.map((f) => [f.key, f.color]));

export function typeLabel(type) {
  return RESOURCE_TYPES[type]?.label || type || 'Resource';
}
export function familyOf(type) {
  return RESOURCE_TYPES[type]?.family || 'gather';
}
/** Map pin / legend colour for a resource type (never the only signal — pair with a text label). */
export function typeColor(type) {
  return FAMILY_COLOR[familyOf(type)] || '#6B7A6F';
}

// Status badge: colour AND text (brief §8 — never colour alone).
export const STATUS_META = {
  active: { label: 'Active', fg: '#15603A', bg: '#E4F0E8', dot: '#2D7D4F' },
  needs_verification: { label: 'Needs verification', fg: '#8A5A12', bg: '#FBF0DC', dot: '#B7791F' },
  inactive: { label: 'Inactive', fg: '#7A2A22', bg: '#F7E3E0', dot: '#B42318' },
};
export function statusMeta(status) {
  return STATUS_META[status] || STATUS_META.active;
}

// Provenance of a listing (brief §1 — never present unverified as verified).
export const SOURCE_META = {
  verified: { label: 'Verified', note: 'Checked against a public source.' },
  community: { label: 'Community-submitted', note: 'Sample / community data — not independently verified.' },
  'crawl-candidate': { label: 'Unverified candidate', note: 'Found by a crawl — awaiting human review. Not published.' },
};
export function sourceMeta(sourceType) {
  return SOURCE_META[sourceType] || SOURCE_META.community;
}

// Ways to participate (brief §4/§5).
export const PARTICIPATE = {
  visit: { label: 'Visit', icon: 'fa-location-dot' },
  volunteer: { label: 'Volunteer', icon: 'fa-hands-helping' },
  donate: { label: 'Donate', icon: 'fa-gift' },
  learn: { label: 'Learn', icon: 'fa-book-open' },
  contact: { label: 'Get in touch', icon: 'fa-envelope' },
};

// Resilience scenarios (brief §5) — filters carry a disclaimer, never an emergency claim.
export const SCENARIOS = {
  flooding: { label: 'Flooding', icon: 'fa-water' },
  'extreme-heat': { label: 'Extreme heat', icon: 'fa-temperature-high' },
  wildfire: { label: 'Wildfire / smoke', icon: 'fa-fire' },
  earthquake: { label: 'Earthquake', icon: 'fa-house-crack' },
};
export const SCENARIO_DISCLAIMER =
  'Scenario filters help you discover places that may be relevant — they are not a claim that any listing is an emergency service or is open right now. Always check before you go, and call 911 in an emergency.';

// Brief §1/§4: public submissions must never carry a private street address or
// a personal phone number. The suggest form blocks (not silently strips) text
// that looks like one, with a clear message. Deliberately conservative — a few
// false positives are fine; leaking a private address is not.
const PHONE_RE = /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
const STREET_RE = /\b\d{1,5}\s+\w+(?:\s+\w+)?\s+(?:st|street|ave|avenue|rd|road|blvd|boulevard|dr|drive|ln|lane|way|ct|court|pl|place|ter|terrace)\b/i;
export function containsPrivateData(text) {
  const s = String(text || '');
  return PHONE_RE.test(s) || STREET_RE.test(s);
}

// --- Volunteer learning & retention (Phase 2B) ---------------------------
// Everything here that looks like instruction is a DRAFT pending Guild/expert
// review — never presented as approved procedure. The Guild's real workday SOP
// and V2 briefs were not provided; see docs/workday-sop-notes.md.
export const TRAINING_REVIEW_DEFAULT = 'draft'; // 'guild-reviewed' only if the Guild actually reviewed it
export const REVIEW_LABELS = {
  'guild-reviewed': { label: 'Guild-reviewed', fg: '#15603A', bg: '#E4F0E8' },
  draft: { label: 'Draft — needs expert review', fg: '#8A5A12', bg: '#FBF0DC' },
};

// Generic, safe "what to bring / expect" items. NOT project-specific, NOT SOP.
export const WORKDAY_TEMPLATE = {
  review: 'draft',
  items: [
    'A water bottle',
    'Sun protection (hat, sunscreen)',
    'Closed-toe shoes',
    'Gloves, if you have them',
    'Arrive about 15 minutes early to sign in',
  ],
};

// Self-reported volunteer skills — private to the volunteer and organiser, never
// public, never auto-assessed.
export const VOLUNTEER_SKILLS = [
  { key: 'planting', label: 'Planting & transplanting' },
  { key: 'watering', label: 'Watering & irrigation' },
  { key: 'tools', label: 'Tool use & basic repair' },
  { key: 'food', label: 'Food handling & distribution' },
  { key: 'welcoming', label: 'Welcoming newcomers' },
];
export const SKILL_LEVELS = [
  { key: 'learning', label: 'Learning' },
  { key: 'confident', label: 'Confident' },
  { key: 'teach', label: 'Can teach others' },
];

// Communication preferences (Phase 2B consent). Defaults are the quietest:
// email only, event updates only. No preference = no contact beyond a specific
// RSVP/confirmation.
export const CONTACT_CHANNELS = [
  { key: 'email', label: 'Email only' },
  { key: 'sms', label: 'SMS only' },
  { key: 'both', label: 'Both' },
];
export const CONTACT_FREQUENCY = [
  { key: 'events', label: 'Event updates only' },
  { key: 'monthly', label: 'Monthly digest' },
];

/** Days since an ISO date (used for the stale / 90-day view). */
export function daysSince(isoDate) {
  if (!isoDate) return Infinity;
  const then = new Date(isoDate).getTime();
  if (Number.isNaN(then)) return Infinity;
  return Math.floor((Date.now() - then) / 86400000);
}
export const STALE_DAYS = 90;
