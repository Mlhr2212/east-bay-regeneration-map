import { defineStore } from 'pinia';

/**
 * Newsletter for Guild attendees & community subscribers (brief Flow 8).
 *
 * Subscriber emails are PRIVATE — never shown on any public page or in
 * structured data. For this demo the list lives client-side and is seeded with
 * clearly-fake addresses. Sending: if a real provider were wired on the backend
 * (steward-bank uses Resend) a volunteer send would go out for real; with none
 * configured here, a send is marked "Sent (demo)" with the date and recipient
 * count and the rendered HTML is offered for manual sending. The UI always says
 * which mode it is in. Never fake a real send; never email anyone who didn't
 * opt in.
 */

const today = () => new Date().toISOString().slice(0, 10);

function seedSubscribers() {
  // Clearly fake addresses (never a real person) so compose/preview/history are
  // demoable on first load.
  return Array.from({ length: 12 }, (_, i) => ({
    id: `s${i + 1}`,
    email: `demo-subscriber-${String(i + 1).padStart(2, '0')}@example.org`,
    name: i % 3 === 0 ? `Demo Neighbour ${i + 1}` : '',
    consentAt: '2026-09-15',
    status: 'subscribed',
  }));
}

function seedNewsletters() {
  return [
    {
      id: 'n1',
      subject: 'Welcome to the East Bay Regeneration Map',
      body: 'Thanks for joining the Guild list. Each month we share new places on the map, upcoming work parties, and ways to get involved near you.',
      featured: ['fruitvale-community-garden', 'west-oakland-fridge'],
      status: 'sent',
      sentAt: '2026-10-01',
      recipientCount: 12,
    },
    {
      id: 'n2',
      subject: 'October work parties + three new listings',
      body: 'A draft newsletter — not yet sent. Add featured listings from the map, preview, then send.',
      featured: ['temescal-tool-library'],
      status: 'draft',
      sentAt: null,
      recipientCount: 0,
    },
  ];
}

export const useNewsletterStore = defineStore({
  id: 'newsletter',
  state: () => ({
    subscribers: seedSubscribers(),
    newsletters: seedNewsletters(),
  }),
  getters: {
    activeSubscribers: (state) => state.subscribers.filter((s) => s.status === 'subscribed'),
    subscriberCount() { return this.activeSubscribers.length; },
    drafts: (state) => state.newsletters.filter((n) => n.status === 'draft'),
    sent: (state) => state.newsletters.filter((n) => n.status === 'sent'),
  },
  actions: {
    // Public signup — explicit opt-in only.
    subscribe({ email, name = '' }) {
      const clean = String(email || '').trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) return { ok: false, error: 'Enter a valid email address.' };
      const existing = this.subscribers.find((s) => s.email === clean);
      if (existing) {
        existing.status = 'subscribed';
        existing.name = name || existing.name;
      } else {
        this.subscribers.push({ id: `s${Date.now()}`, email: clean, name, consentAt: today(), status: 'subscribed' });
      }
      return { ok: true };
    },
    // One-click unsubscribe (brief §4d) — immediate, by email.
    unsubscribe(email) {
      const s = this.subscribers.find((x) => x.email === String(email || '').trim().toLowerCase());
      if (s) s.status = 'unsubscribed';
      return !!s;
    },
    saveDraft({ id = null, subject, body, featured = [] }) {
      if (id) {
        const n = this.newsletters.find((x) => x.id === id);
        if (n) Object.assign(n, { subject, body, featured });
        return id;
      }
      const newId = `n${Date.now()}`;
      this.newsletters.unshift({ id: newId, subject, body, featured, status: 'draft', sentAt: null, recipientCount: 0 });
      return newId;
    },
    // Demo send: mark sent with today's date + recipient count. No real provider
    // is wired client-side, so this never actually emails anyone.
    send(id) {
      const n = this.newsletters.find((x) => x.id === id);
      if (!n) return null;
      n.status = 'sent';
      n.sentAt = today();
      n.recipientCount = this.subscriberCount;
      return { recipientCount: n.recipientCount, mode: 'demo' };
    },
    reset() {
      this.subscribers = seedSubscribers();
      this.newsletters = seedNewsletters();
    },
  },
});
