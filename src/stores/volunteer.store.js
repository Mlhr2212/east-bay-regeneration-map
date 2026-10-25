import { defineStore } from 'pinia';

/**
 * Returning-volunteer state (Phase 2B): self-reported skill levels and
 * communication preferences. PRIVATE — this is for the volunteer and their
 * organiser only, and is never shown on any public page, listing, or structured
 * data. Persisted to localStorage so a volunteer's plan survives a reload
 * without a server round-trip; nothing here is published.
 */

const KEY = 'regen-volunteer';

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
}

export const useVolunteerStore = defineStore({
  id: 'volunteer',
  state: () => {
    const saved = load();
    return {
      // { [skillKey]: 'learning' | 'confident' | 'teach' }
      skills: saved.skills || {},
      // { channel: 'email'|'sms'|'both', frequency: 'events'|'monthly' }
      contact: saved.contact || { channel: 'email', frequency: 'events' },
    };
  },
  actions: {
    setSkill(key, level) {
      if (level) this.skills[key] = level;
      else delete this.skills[key];
      this.persist();
    },
    setContact(patch) {
      this.contact = { ...this.contact, ...patch };
      this.persist();
    },
    persist() {
      localStorage.setItem(KEY, JSON.stringify({ skills: this.skills, contact: this.contact }));
    },
  },
});
