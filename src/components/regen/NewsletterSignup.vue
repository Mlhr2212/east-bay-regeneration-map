<template>
  <div class="rounded-2xl border border-regen-line bg-regen-surface p-5">
    <div v-if="done" class="flex items-center gap-2 font-inter text-sm font-semibold text-regen-success" role="status">
      <i class="rm-pop fa-solid fa-circle-check inline-block" aria-hidden="true"></i> You're on the list — thank you!
    </div>
    <form v-else @submit.prevent="onSubmit">
      <h3 class="font-fraunces text-[18px] font-600 text-regen-ink">{{ heading }}</h3>
      <p class="mt-1 font-inter text-sm text-regen-ink-soft">Monthly updates on new places, work parties, and ways to help. Unsubscribe any time.</p>
      <p class="mt-2 font-inter text-[12px] text-regen-muted">Fields marked <span class="font-semibold text-regen-danger">*</span> are required.</p>
      <div class="mt-2 grid gap-2 sm:grid-cols-[10rem_1fr_auto] sm:items-end">
        <div class="flex flex-col gap-1">
          <label :for="nameId" class="font-inter text-[11px] font-semibold uppercase tracking-[0.08em] text-regen-muted">Name (optional)</label>
          <input :id="nameId" v-model.trim="name" type="text" autocomplete="name" placeholder="e.g. Maya" class="rm-field h-11 rounded-xl border border-regen-line bg-regen-paper px-3 font-inter text-sm outline-none focus:border-regen-moss focus:ring-2 focus:ring-regen-moss/30" />
        </div>
        <div class="flex flex-col gap-1">
          <label :for="emailId" class="font-inter text-[11px] font-semibold uppercase tracking-[0.08em] text-regen-muted">Email address <span class="text-regen-danger" aria-hidden="true">*</span></label>
          <input :id="emailId" v-model.trim="email" type="email" autocomplete="email" placeholder="you@example.org" aria-required="true" :aria-invalid="!!error" :aria-describedby="error ? errId : undefined" class="rm-field h-11 rounded-xl border border-regen-line bg-regen-paper px-3 font-inter text-sm outline-none focus:border-regen-moss focus:ring-2 focus:ring-regen-moss/30" />
        </div>
        <button type="submit" class="rm-press inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-regen-moss px-4 font-inter text-sm font-semibold text-white hover:bg-regen-moss-dark">
          <i class="fa-solid fa-envelope" aria-hidden="true"></i> Sign up
        </button>
      </div>
      <p v-if="error" :id="errId" role="alert" class="mt-1.5 font-inter text-[13px] font-semibold text-regen-danger">{{ error }}</p>
      <!-- Communication preferences (consent) -->
      <div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 font-inter text-[13px] text-regen-ink-soft">
        <span class="text-regen-muted">Send me:</span>
        <select v-model="channel" aria-label="How we may contact you" class="rm-field rounded-lg border border-regen-line bg-regen-paper px-2 py-1 text-[13px] outline-none focus:border-regen-moss">
          <option v-for="c in channels" :key="c.key" :value="c.key">{{ c.label }}</option>
        </select>
        <select v-model="frequency" aria-label="How often we may contact you" class="rm-field rounded-lg border border-regen-line bg-regen-paper px-2 py-1 text-[13px] outline-none focus:border-regen-moss">
          <option v-for="f in frequencies" :key="f.key" :value="f.key">{{ f.label }}</option>
        </select>
      </div>
      <label class="mt-2 flex cursor-pointer items-start gap-2 font-inter text-[13px] text-regen-ink-soft">
        <input v-model="consent" type="checkbox" class="mt-0.5 h-4 w-4 rounded border-regen-line text-regen-moss focus:ring-regen-moss" />
        Yes, send me Guild updates. My email stays private and is never shown publicly.
      </label>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useNewsletterStore, useAlertStore } from '@/stores';
import { CONTACT_CHANNELS, CONTACT_FREQUENCY } from '@/_config/RegenConfig';

defineProps({ heading: { type: String, default: 'Get Guild updates' } });

// Unique ids per instance — this widget renders more than once per page, so
// shared ids would break label/aria-describedby associations.
let _uid = 0;
const uid = _uid++ + '-' + Math.random().toString(36).slice(2, 7);
const nameId = `nl-name-${uid}`;
const emailId = `nl-email-${uid}`;
const errId = `nl-err-${uid}`;

const newsletter = useNewsletterStore();
const alert = useAlertStore();
const channels = CONTACT_CHANNELS;
const frequencies = CONTACT_FREQUENCY;
const name = ref('');
const email = ref('');
const channel = ref('email');
const frequency = ref('events');
const consent = ref(false);
const error = ref('');
const done = ref(false);

function onSubmit() {
  error.value = '';
  if (!consent.value) { error.value = 'Please tick the box to confirm you want updates.'; return; }
  const res = newsletter.subscribe({ email: email.value, name: name.value, channel: channel.value, frequency: frequency.value });
  if (!res.ok) { error.value = res.error; return; }
  done.value = true;
  alert.success('Subscribed — welcome to the list.');
}
</script>
