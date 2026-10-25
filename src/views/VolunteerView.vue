<template>
  <div class="min-h-screen bg-regen-paper font-inter text-regen-ink">
    <div class="mx-auto max-w-[760px] px-6 py-8">
      <RouterLink to="/regeneration" class="inline-flex items-center gap-2 font-inter text-sm font-semibold text-regen-moss hover:underline">
        <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Back to the map
      </RouterLink>

      <p class="mt-4 font-inter text-[12px] font-semibold uppercase tracking-[0.08em] text-regen-moss">Learn &amp; get ready</p>
      <h1 class="mt-1 font-fraunces text-[32px] font-700 leading-[1.15] text-regen-ink">My next step</h1>
      <p class="mt-2 font-inter text-regen-ink-soft">
        Come back without starting over. Here's your next work party, what to bring, and the skills you're building.
      </p>

      <p v-if="!auth.isLoggedIn" class="mt-3 flex items-start gap-2 rounded-xl border border-regen-line bg-regen-surface px-4 py-3 font-inter text-[13px] leading-relaxed text-regen-ink-soft">
        <i class="fa-solid fa-circle-info mt-0.5 text-regen-moss" aria-hidden="true"></i>
        Your plan is saved on this device. <RouterLink to="/login" class="font-semibold text-regen-moss underline">Sign in</RouterLink> to see your RSVPs and sync across devices — no separate account needed.
      </p>

      <!-- Next work party -->
      <section class="rm-reveal mt-6">
        <h2 class="font-inter text-[12px] font-semibold uppercase tracking-[0.08em] text-regen-muted">Your next work party</h2>
        <div v-if="loadingEvents" class="mt-2 h-20 animate-pulse rounded-2xl bg-regen-line/40"></div>
        <ul v-else-if="myEvents.length" class="mt-2 space-y-2">
          <li v-for="e in myEvents" :key="e.id" class="flex items-center justify-between gap-3 rounded-2xl border border-regen-line bg-regen-surface p-4">
            <div>
              <p class="font-fraunces text-[16px] font-600 text-regen-ink">{{ e.title || e.name || 'Work party' }}</p>
              <p class="font-inter text-xs text-regen-muted">{{ formatDate(e.date_start || e.start || e.date) }}</p>
            </div>
            <RouterLink :to="`/d/${e.id}`" class="shrink-0 rounded-xl bg-regen-moss px-3.5 py-2 font-inter text-sm font-semibold text-white hover:bg-regen-moss-dark">View &amp; RSVP</RouterLink>
          </li>
        </ul>
        <!-- Honest empty state — never an invented event -->
        <div v-else class="mt-2 rounded-2xl border border-dashed border-regen-line bg-regen-surface p-6 text-center">
          <p class="font-inter text-regen-ink-soft">No work party booked yet.</p>
          <button type="button" class="mt-3 inline-flex items-center gap-2 rounded-xl bg-regen-moss px-4 py-2.5 font-inter text-sm font-semibold text-white hover:bg-regen-moss-dark" @click="findWorkParties">
            <i class="fa-solid fa-hands-helping" aria-hidden="true"></i> Find a work party
          </button>
        </div>
      </section>

      <!-- What to bring (draft template) -->
      <section class="rm-reveal mt-8">
        <div class="flex items-center gap-2">
          <h2 class="font-inter text-[12px] font-semibold uppercase tracking-[0.08em] text-regen-muted">What to bring &amp; expect</h2>
          <ReviewBadge :review="template.review" />
        </div>
        <ul class="mt-2 space-y-1.5">
          <li v-for="(item, i) in template.items" :key="i" class="flex items-center gap-2 font-inter text-[15px] text-regen-ink-soft">
            <i class="fa-solid fa-check text-regen-moss" aria-hidden="true"></i>{{ item }}
          </li>
        </ul>
      </section>

      <!-- Skill self-report (private) -->
      <section class="rm-reveal mt-8">
        <div class="flex items-center gap-2">
          <h2 class="font-inter text-[12px] font-semibold uppercase tracking-[0.08em] text-regen-muted">Your skills</h2>
          <ReviewBadge review="draft" />
        </div>
        <p class="mt-1 font-inter text-[13px] text-regen-muted">Self-reported, for you and your organiser only — never shown publicly.</p>
        <div class="mt-3 space-y-2">
          <div v-for="skill in skills" :key="skill.key" class="flex flex-col gap-2 rounded-2xl border border-regen-line bg-regen-surface p-3 sm:flex-row sm:items-center sm:justify-between">
            <span :id="`skill-${skill.key}`" class="font-inter text-sm font-semibold text-regen-ink">{{ skill.label }}</span>
            <div class="flex gap-1.5" role="group" :aria-labelledby="`skill-${skill.key}`">
              <button
                v-for="lvl in levels"
                :key="lvl.key"
                type="button"
                class="rm-press rounded-full px-3 py-1.5 font-inter text-xs font-semibold transition"
                :class="volunteer.skills[skill.key] === lvl.key ? 'bg-regen-moss text-white' : 'border border-regen-line text-regen-ink hover:border-regen-moss'"
                :aria-pressed="volunteer.skills[skill.key] === lvl.key"
                :aria-label="`${skill.label}: ${lvl.label}`"
                @click="setSkill(skill.key, lvl.key)"
              >{{ lvl.label }}</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Communication preferences -->
      <section class="rm-reveal mt-8">
        <h2 class="font-inter text-[12px] font-semibold uppercase tracking-[0.08em] text-regen-muted">How we keep in touch</h2>
        <p class="mt-1 font-inter text-[13px] text-regen-muted">We only contact you the way you choose. No preference means nothing beyond a confirmation for something you RSVP to.</p>
        <div class="mt-3 grid gap-4 sm:grid-cols-2">
          <div>
            <span id="pref-channel" class="mb-1.5 block font-inter text-[12px] font-semibold uppercase tracking-[0.08em] text-regen-muted">Channel</span>
            <div class="flex flex-wrap gap-1.5" role="group" aria-labelledby="pref-channel">
              <button v-for="c in channels" :key="c.key" type="button"
                class="rm-press rounded-full px-3 py-1.5 font-inter text-xs font-semibold transition"
                :class="volunteer.contact.channel === c.key ? 'bg-regen-moss text-white' : 'border border-regen-line text-regen-ink hover:border-regen-moss'"
                :aria-pressed="volunteer.contact.channel === c.key"
                @click="volunteer.setContact({ channel: c.key })">{{ c.label }}</button>
            </div>
          </div>
          <div>
            <span id="pref-frequency" class="mb-1.5 block font-inter text-[12px] font-semibold uppercase tracking-[0.08em] text-regen-muted">Frequency</span>
            <div class="flex flex-wrap gap-1.5" role="group" aria-labelledby="pref-frequency">
              <button v-for="f in frequencies" :key="f.key" type="button"
                class="rm-press rounded-full px-3 py-1.5 font-inter text-xs font-semibold transition"
                :class="volunteer.contact.frequency === f.key ? 'bg-regen-moss text-white' : 'border border-regen-line text-regen-ink hover:border-regen-moss'"
                :aria-pressed="volunteer.contact.frequency === f.key"
                @click="volunteer.setContact({ frequency: f.key })">{{ f.label }}</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, h } from 'vue';
import { useRouter } from 'vue-router';
import { useTitle } from '@vueuse/core';
import { useAuthStore, useEventStore } from '@/stores';
import { useVolunteerStore } from '@/stores/volunteer.store';
import { useReveal } from '@/composables/useReveal';
import {
  WORKDAY_TEMPLATE, VOLUNTEER_SKILLS, SKILL_LEVELS, CONTACT_CHANNELS, CONTACT_FREQUENCY, REVIEW_LABELS,
} from '@/_config/RegenConfig';

useReveal();

// Tiny inline review-status badge (brief addendum §2B.3).
const ReviewBadge = (props) => {
  const m = REVIEW_LABELS[props.review] || REVIEW_LABELS.draft;
  return h('span', { class: 'rounded-full px-2 py-0.5 font-inter text-[11px] font-semibold', style: { color: m.fg, backgroundColor: m.bg } }, m.label);
};
ReviewBadge.props = ['review'];

const router = useRouter();
const auth = useAuthStore();
const events = useEventStore();
const volunteer = useVolunteerStore();

const template = WORKDAY_TEMPLATE;
const skills = VOLUNTEER_SKILLS;
const levels = SKILL_LEVELS;
const channels = CONTACT_CHANNELS;
const frequencies = CONTACT_FREQUENCY;

const myEvents = ref([]);
const loadingEvents = ref(false);

function setSkill(key, level) {
  // Toggle off if re-clicking the same level.
  volunteer.setSkill(key, volunteer.skills[key] === level ? null : level);
}
function formatDate(d) {
  if (!d) return 'Date to be confirmed';
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? String(d) : dt.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}
function findWorkParties() {
  router.push('/regeneration?participate=volunteer');
}

onMounted(async () => {
  if (!auth.isLoggedIn) return; // no RSVPs to show when signed out
  loadingEvents.value = true;
  try {
    const res = await events.getUserEvents();
    const rows = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
    myEvents.value = rows.slice(0, 3);
  } catch {
    myEvents.value = []; // backend off → honest empty state, never invented
  } finally {
    loadingEvents.value = false;
  }
});

useTitle('My next step — East Bay Regeneration Map');
</script>
