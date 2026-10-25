<template>
  <div class="min-h-screen bg-regen-paper font-inter text-regen-ink">
    <PageHeader eyebrow="Community-controlled" title="Replicate this map for your community" width="760px">
      <p>
        This map is open. No proprietary builder, no per-seat cost, no lock-in — your community owns its data.
        Standing up a map for another region is three steps, and no code knowledge beyond fork, edit, deploy.
      </p>
    </PageHeader>

    <div class="mx-auto max-w-[760px] px-6 py-8">
      <ol class="space-y-5">
        <li v-for="(step, i) in steps" :key="i" class="flex gap-4 rounded-2xl border border-regen-line bg-regen-surface p-5">
          <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-regen-moss font-fraunces text-[18px] font-600 text-white">{{ i + 1 }}</span>
          <div>
            <h2 class="font-fraunces text-[20px] font-600 text-regen-ink">{{ step.title }}</h2>
            <p class="mt-1 font-inter text-[15px] leading-relaxed text-regen-ink-soft" v-html="step.body"></p>
          </div>
        </li>
      </ol>

      <div class="mt-6 rounded-2xl border border-regen-line bg-regen-paper p-5">
        <h2 class="font-inter text-[12px] font-semibold uppercase tracking-[0.08em] text-regen-muted">Rename the region</h2>
        <p class="mt-1 font-inter text-[15px] leading-relaxed text-regen-ink-soft">
          Every listing carries a <code class="rounded bg-regen-line/50 px-1.5 py-0.5 text-[13px]">region</code> field (default
          <code class="rounded bg-regen-line/50 px-1.5 py-0.5 text-[13px]">east-bay</code>). A revived chapter elsewhere is a
          data change, not a rebuild — set your region, swap the listings, and the rest of the app follows.
        </p>
      </div>

      <div class="mt-6 flex flex-wrap gap-3">
        <a :href="repoUrl" target="_blank" rel="noopener noreferrer" class="inline-flex h-11 items-center gap-2 rounded-xl bg-regen-moss px-5 font-inter text-sm font-semibold text-white hover:bg-regen-moss-dark">
          <i class="fa-brands fa-github" aria-hidden="true"></i> Fork on GitHub
        </a>
        <RouterLink to="/regeneration" class="inline-flex h-11 items-center gap-2 rounded-xl border border-regen-line bg-regen-surface px-5 font-inter text-sm font-semibold text-regen-ink hover:border-regen-moss">
          Back to the map
        </RouterLink>
        <RouterLink to="/regeneration/about-this-demo" class="inline-flex h-11 items-center gap-2 rounded-xl border border-regen-line bg-regen-surface px-5 font-inter text-sm font-semibold text-regen-ink hover:border-regen-moss">
          What this demo shows
        </RouterLink>
      </div>

      <p class="mt-6 font-inter text-[13px] leading-relaxed text-regen-muted">
        Full instructions, including the data-file format and a Netlify option, are in
        <code class="rounded bg-regen-line/50 px-1.5 py-0.5">REPLICATION.md</code> in the repo.
      </p>
    </div>

    <CtaBand />
  </div>
</template>

<script setup>
import { useTitle } from '@vueuse/core';
import PageHeader from '@/components/PageHeader.vue';
import CtaBand from '@/components/CtaBand.vue';

const repoUrl = 'https://github.com/Garden-Steward/garden-vue-hack';
const steps = [
  {
    title: 'Fork it on GitHub',
    body: 'Click “Fork” on the repository. You now have your own copy of the whole map — code and data — that you control.',
  },
  {
    title: 'Edit the data file',
    body: 'Open <code class="rounded bg-regen-line/50 px-1.5 py-0.5 text-[13px]">src/data/resources.json</code> and replace the listings with your community’s. Keep real, public, consented information only — no private addresses. Submissions and corrections then flow through the same moderation queue.',
  },
  {
    title: 'Deploy',
    body: 'Connect the fork to Vercel (or Netlify — just drop the <code class="rounded bg-regen-line/50 px-1.5 py-0.5 text-[13px]">dist</code> folder). Your map is live. No developer needed to keep it alive.',
  },
];

useTitle('Replicate — East Bay Regeneration Map');
</script>
