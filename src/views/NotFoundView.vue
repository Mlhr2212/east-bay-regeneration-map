<template>
  <div class="min-h-screen bg-regen-paper font-inter text-regen-ink">
    <PageHeader eyebrow="Page not found" title="We couldn't find that page." width="900px">
      <p>The link may be out of date or mistyped.</p>
    </PageHeader>

    <div class="mx-auto max-w-[900px] px-6 py-12">
      <div class="flex flex-wrap gap-3">
        <RouterLink to="/regeneration" class="rounded-xl bg-regen-moss px-4 py-2.5 text-sm font-semibold text-white hover:bg-regen-moss-dark">Browse the map</RouterLink>
        <RouterLink to="/" class="rounded-xl border border-regen-line px-4 py-2.5 text-sm font-semibold text-regen-ink hover:border-regen-moss">Go home</RouterLink>
      </div>
    </div>

    <CtaBand />
  </div>
</template>

<script setup>
import { useTitle } from '@vueuse/core';
import PageHeader from '@/components/PageHeader.vue';
import CtaBand from '@/components/CtaBand.vue';

useTitle('Page not found — East Bay Regeneration Map');
</script>
