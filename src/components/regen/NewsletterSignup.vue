<template>
  <div class="rounded-2xl border border-regen-line bg-regen-surface p-5">
    <div v-if="done" class="flex items-center gap-2 font-inter text-sm font-semibold text-regen-success">
      <i class="fa-solid fa-circle-check" aria-hidden="true"></i> You're on the list — thank you!
    </div>
    <form v-else @submit.prevent="onSubmit">
      <h3 class="font-fraunces text-[18px] font-600 text-regen-ink">{{ heading }}</h3>
      <p class="mt-1 font-inter text-sm text-regen-ink-soft">Monthly updates on new places, work parties, and ways to help. Unsubscribe any time.</p>
      <div class="mt-3 flex flex-col gap-2 sm:flex-row">
        <input v-model.trim="name" type="text" placeholder="Name (optional)" class="h-11 rounded-xl border border-regen-line bg-regen-paper px-3 font-inter text-sm outline-none focus:border-regen-moss sm:w-40" />
        <input v-model.trim="email" type="email" placeholder="you@example.org" class="h-11 flex-1 rounded-xl border border-regen-line bg-regen-paper px-3 font-inter text-sm outline-none focus:border-regen-moss" />
        <button type="submit" class="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-regen-moss px-4 font-inter text-sm font-semibold text-white hover:bg-regen-moss-dark">
          <i class="fa-solid fa-envelope" aria-hidden="true"></i> Sign up
        </button>
      </div>
      <p v-if="error" class="mt-1.5 font-inter text-[13px] font-semibold text-regen-danger">{{ error }}</p>
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

defineProps({ heading: { type: String, default: 'Get Guild updates' } });

const newsletter = useNewsletterStore();
const alert = useAlertStore();
const name = ref('');
const email = ref('');
const consent = ref(false);
const error = ref('');
const done = ref(false);

function onSubmit() {
  error.value = '';
  if (!consent.value) { error.value = 'Please tick the box to confirm you want updates.'; return; }
  const res = newsletter.subscribe({ email: email.value, name: name.value });
  if (!res.ok) { error.value = res.error; return; }
  done.value = true;
  alert.success('Subscribed — welcome to the list.');
}
</script>
