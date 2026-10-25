<template>
  <div class="min-h-screen bg-regen-paper font-inter text-regen-ink">
    <div class="mx-auto max-w-[900px] px-6 py-16">
      <p class="font-inter text-[12px] font-semibold uppercase tracking-[0.08em] text-regen-moss">Page not found</p>
      <h1 class="mt-2 font-fraunces text-[32px] font-700 text-regen-ink">We couldn't find that page.</h1>
      <p class="mt-3 font-inter text-[16px] leading-relaxed text-regen-ink-soft">The link may be out of date or mistyped.</p>
      <div class="mt-6 flex flex-wrap gap-3">
        <RouterLink to="/regeneration" class="rounded-xl bg-regen-moss px-4 py-2.5 text-sm font-semibold text-white hover:bg-regen-moss-dark">Browse the map</RouterLink>
        <RouterLink to="/" class="rounded-xl border border-regen-line px-4 py-2.5 text-sm font-semibold text-regen-ink hover:border-regen-moss">Go home</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTitle } from '@vueuse/core';

useTitle('Page not found — East Bay Regeneration Map');
</script>
