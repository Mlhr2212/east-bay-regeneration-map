<script setup>
import { ref } from 'vue';
import { useTitle } from '@vueuse/core';
import { useReveal } from '@/composables/useReveal';

// Regeneration Map help — the product being demoed — plus the existing
// Garden Steward SMS answers, kept but grouped.
const mapFaqs = ref([
  { q: 'What is the East Bay Regeneration Map?', a: "A community-kept map of local regeneration projects across the East Bay — community gardens, seed and tool libraries, fridges, pantries, mutual-aid, resilience hubs, and more — with who each place serves, whether it's active, and clear ways to get involved.", open: true },
  { q: 'How do I find something near me?', a: 'Open the map, search by name or neighbourhood, or filter by Grow / Eat / Share / Learn / Gather, by participation (Visit, Volunteer, Donate, Learn), or by scenario. Use "Near me" to sort by distance, then open any listing for the details.', open: false },
  { q: 'What does "sample data (offline)" mean?', a: "When the live backend isn't connected (for example on the public demo link), the map falls back to a bundled community dataset so it's never blank. Every listing shows its source and the date it was last checked, so you always know how fresh it is.", open: false },
  { q: 'How do I suggest a place or a correction?', a: 'Use "Suggest a place" or "Suggest a correction" on a listing. A Guild volunteer reviews every submission before it appears — nothing is published automatically. Please don\'t submit private home addresses or personal contact details.', open: false },
  { q: 'I run a project — can I manage its listing?', a: 'Yes. Open the listing and choose "Claim this listing" (a clearly-labelled demo claim this weekend), then edit hours, description, or status, and see any pending suggestions for your listing.', open: false },
  { q: 'I volunteer — where is "My next step"?', a: 'It\'s in the top navigation and the map footer. It shows your next work party, a "what to bring" checklist, and a private self-reported skill list, so you can return without being re-onboarded.', open: false },
  { q: 'Are the scenario filters an emergency service?', a: 'No. Flooding, heat, wildfire, and earthquake filters help you discover places that may be relevant — they never imply guaranteed access, real-time availability, or emergency response. Always check before you go, and call 911 in an emergency.', open: false },
  { q: 'Can another community reuse this map?', a: 'Yes — it\'s open and community-controlled. Fork it on GitHub, edit one data file (src/data/resources.json), and deploy. See "Replicate this map" for the three steps.', open: false },
]);

const smsFaqs = ref([
  { q: 'What is Garden Steward?', a: "Garden Steward is an SMS app for managing communal gardens, making it easier to create publicly accessible gardens with abundant, foragable plants. It's the platform the Regeneration Map is built on.", open: false },
  { q: 'How do I use Garden Steward?', a: "Once you're associated with a garden and have gone through SMS registration, wait for the volunteer-day reminders. RSVP by replying YES to any volunteer day.", open: false },
  { q: 'Do I need to reply in ALL CAPS?', a: "No — it's case-insensitive. Caps just make the accepted commands clear, so 'yes' or 'no' work fine.", open: false },
  { q: 'How do I sign up to a garden?', a: "Message Garden Steward with the garden name. If it isn't already in your account, it will be added for you.", open: false },
  { q: "What if I'm a member of multiple gardens?", a: "Switch between them by messaging the garden name. The last one you message becomes your 'Active Garden'.", open: false },
  { q: 'I want to STOP receiving texts', a: 'Message STOP. You\'ll be removed from all gardens, and our SMS partner Twilio ensures you no longer receive texts from the app.', open: false },
  { q: "I've been assigned a task I can't do", a: 'That\'s fine — reply NO to get a list of other volunteers to reassign to, or SKIP if the task doesn\'t need doing.', open: false },
  { q: "I'm about to go on vacation", a: 'Message VACATION to pause receiving tasks. When you return, message BACK.', open: false },
]);

const toggle = (list, i) => { list.value[i].open = !list.value[i].open; };

useTitle('Help & FAQ — East Bay Regeneration Map');
useReveal();
</script>

<template>
  <div class="min-h-screen bg-regen-paper font-inter text-regen-ink">
    <header class="border-b border-regen-line bg-regen-surface">
      <div class="rm-enter mx-auto max-w-[760px] px-6 py-10">
        <p class="font-inter text-[12px] font-semibold uppercase tracking-[0.08em] text-regen-moss">Help</p>
        <h1 class="mt-2 font-fraunces text-[36px] font-700 leading-[1.1] text-regen-ink">Help &amp; FAQ</h1>
        <p class="mt-3 max-w-2xl font-inter text-[16px] leading-relaxed text-regen-ink-soft">
          How the East Bay Regeneration Map works, and how the Garden Steward SMS system behind it works. Tap any question to open it.
        </p>
      </div>
    </header>

    <div class="mx-auto max-w-[760px] px-6 py-8">
      <!-- Regeneration Map -->
      <section class="rm-reveal">
        <h2 class="font-inter text-[12px] font-semibold uppercase tracking-[0.08em] text-regen-muted">The Regeneration Map</h2>
        <div class="mt-3 space-y-2">
          <div v-for="(item, i) in mapFaqs" :key="`m${i}`" class="overflow-hidden rounded-2xl border border-regen-line bg-regen-surface">
            <h3 class="m-0">
              <button
                type="button"
                class="rm-field flex w-full items-center justify-between gap-3 px-5 py-4 text-left font-inter text-[16px] font-600 text-regen-ink transition hover:bg-regen-paper"
                :aria-expanded="item.open"
                @click="toggle(mapFaqs, i)"
              >
                <span>{{ item.q }}</span>
                <i class="fa-solid fa-chevron-down shrink-0 text-regen-moss transition-transform duration-200" :class="{ 'rotate-180': item.open }" aria-hidden="true"></i>
              </button>
            </h3>
            <p v-show="item.open" class="px-5 pb-4 font-inter text-[15px] leading-relaxed text-regen-ink-soft">{{ item.a }}</p>
          </div>
        </div>
      </section>

      <!-- Garden Steward SMS -->
      <section class="rm-reveal mt-10">
        <h2 class="font-inter text-[12px] font-semibold uppercase tracking-[0.08em] text-regen-muted">Garden Steward (SMS)</h2>
        <div class="mt-3 space-y-2">
          <div v-for="(item, i) in smsFaqs" :key="`s${i}`" class="overflow-hidden rounded-2xl border border-regen-line bg-regen-surface">
            <h3 class="m-0">
              <button
                type="button"
                class="rm-field flex w-full items-center justify-between gap-3 px-5 py-4 text-left font-inter text-[16px] font-600 text-regen-ink transition hover:bg-regen-paper"
                :aria-expanded="item.open"
                @click="toggle(smsFaqs, i)"
              >
                <span>{{ item.q }}</span>
                <i class="fa-solid fa-chevron-down shrink-0 text-regen-moss transition-transform duration-200" :class="{ 'rotate-180': item.open }" aria-hidden="true"></i>
              </button>
            </h3>
            <p v-show="item.open" class="px-5 pb-4 font-inter text-[15px] leading-relaxed text-regen-ink-soft">{{ item.a }}</p>
          </div>
        </div>
      </section>

      <div class="mt-10 flex flex-wrap gap-3 border-t border-regen-line pt-6">
        <RouterLink to="/regeneration" class="rm-press inline-flex h-11 items-center gap-2 rounded-xl bg-regen-moss px-5 font-inter text-sm font-semibold text-white transition hover:bg-regen-moss-dark">Back to the map</RouterLink>
        <RouterLink to="/regeneration/suggest" class="rm-press inline-flex h-11 items-center gap-2 rounded-xl border border-regen-line bg-regen-surface px-5 font-inter text-sm font-semibold text-regen-ink transition hover:border-regen-moss">Suggest a place</RouterLink>
      </div>
    </div>
  </div>
</template>
