import { defineStore } from 'pinia';

/**
 * Moderation queue (brief Flows 4–6). Kept entirely separate from the public
 * resource listings: a suggestion/correction/candidate is NEVER public until a
 * volunteer approves it. For this demo the queue lives client-side and seeded;
 * in production an approval becomes a pull request / a Strapi review_status
 * change on the Project (stated honestly in the UI).
 */

const today = () => new Date().toISOString().slice(0, 10);

function seedProposals() {
  return [
    {
      id: 'p1',
      kind: 'new', // brand-new resource suggestion
      status: 'pending',
      submittedAt: '2026-10-21',
      source: 'https://example.org/berkeley-repair-cafe',
      sourceType: 'community',
      fields: {
        name: 'South Berkeley Repair Café',
        type: 'community-space',
        neighbourhood: 'South Berkeley',
        city: 'Berkeley',
        participate: ['visit', 'learn'],
        serves: 'Anyone with something to mend — tools, textiles, electronics.',
      },
    },
    {
      id: 'p2',
      kind: 'correction', // change to an existing listing
      status: 'pending',
      submittedAt: '2026-10-22',
      targetSlug: 'temescal-tool-library',
      source: 'I volunteer here',
      sourceType: 'community',
      fields: {
        hours: { old: 'Wed–Sat 11am–5pm', new: 'Tue–Sat 10am–6pm' },
      },
    },
    {
      id: 'p3',
      kind: 'correction',
      status: 'pending',
      submittedAt: '2026-10-19',
      targetSlug: 'fremont-seed-swap',
      source: 'https://example.org/niles-seed-swap-returns',
      sourceType: 'community',
      fields: {
        map_status: { old: 'inactive', new: 'active' },
      },
    },
    {
      id: 'c1',
      kind: 'candidate', // re-crawl finding — unverified, never auto-published
      status: 'pending',
      submittedAt: '2026-10-23',
      source: 'https://example.org/oakland-community-fridge-network',
      sourceType: 'crawl-candidate',
      fields: {
        name: 'Laurel District Fridge',
        type: 'community-fridge',
        neighbourhood: 'Laurel',
        city: 'Oakland',
      },
    },
    {
      id: 'c2',
      kind: 'candidate',
      status: 'pending',
      submittedAt: '2026-10-23',
      source: 'https://example.org/hayward-tool-lending',
      sourceType: 'crawl-candidate',
      fields: {
        name: 'Hayward Tool Lending Shed',
        type: 'tool-library',
        neighbourhood: 'Downtown Hayward',
        city: 'Hayward',
      },
    },
  ];
}

export const useProposalsStore = defineStore({
  id: 'proposals',
  state: () => ({
    proposals: seedProposals(),
    activityLog: [],
  }),
  getters: {
    pending: (state) => state.proposals.filter((p) => p.status === 'pending'),
    pendingSuggestions: (state) =>
      state.proposals.filter((p) => p.status === 'pending' && p.kind !== 'candidate'),
    pendingCandidates: (state) =>
      state.proposals.filter((p) => p.status === 'pending' && p.kind === 'candidate'),
    pendingCount: (state) => state.proposals.filter((p) => p.status === 'pending').length,
  },
  actions: {
    /** A public submission from the suggest/correct form — enters pending, never public. */
    submit({ kind = 'new', targetSlug = null, source = '', sourceType = 'community', fields = {} }) {
      const id = `u${Date.now()}`;
      this.proposals.unshift({
        id,
        kind,
        status: 'pending',
        submittedAt: today(),
        targetSlug,
        source,
        sourceType,
        fields,
      });
      return id;
    },
    approve(id, edits = null) {
      const p = this.proposals.find((x) => x.id === id);
      if (!p) return;
      if (edits) p.fields = { ...p.fields, ...edits };
      p.status = 'approved';
      p.reviewedAt = today();
      this.activityLog.unshift({
        at: today(),
        action: edits ? 'edited & approved' : 'approved',
        id,
        label: this.labelFor(p),
      });
    },
    reject(id, reason = '') {
      const p = this.proposals.find((x) => x.id === id);
      if (!p) return;
      p.status = 'rejected';
      p.reviewedAt = today();
      p.rejectReason = reason;
      this.activityLog.unshift({
        at: today(),
        action: 'rejected',
        id,
        label: this.labelFor(p),
        reason,
      });
    },
    labelFor(p) {
      if (p.kind === 'correction') return `Correction to ${p.targetSlug}`;
      return p.fields?.name || 'Suggestion';
    },
    reset() {
      this.proposals = seedProposals();
      this.activityLog = [];
    },
  },
});
