<template>
  <div class="min-h-screen bg-regen-paper font-inter text-regen-ink">
    <header class="border-b border-regen-line bg-regen-surface">
      <div class="mx-auto max-w-[820px] px-6 py-10">
        <p class="font-inter text-[12px] font-semibold uppercase tracking-[0.08em] text-regen-moss">Honest by design</p>
        <h1 class="mt-2 font-fraunces text-[36px] font-700 leading-[1.1] text-regen-ink">What this demo shows</h1>
        <p class="mt-3 max-w-2xl font-inter text-[16px] leading-relaxed text-regen-ink-soft">
          A clear line between what is actually working, what is a prototype or demo-only, and what it would take
          the Guild to keep this alive. No overclaiming.
        </p>
      </div>
    </header>

    <div class="mx-auto max-w-[820px] px-6 py-8 space-y-10">
      <!-- Known issues (honest status as of the demo) -->
      <section class="rm-reveal rounded-2xl border border-regen-warning/30 bg-regen-warning/5 p-5">
        <h2 class="font-fraunces text-[20px] font-600 text-regen-ink"><i class="fa-solid fa-triangle-exclamation mr-2 text-regen-warning" aria-hidden="true"></i>Known issues (as of Oct 25)</h2>
        <ul class="mt-3 space-y-1.5 font-inter text-[15px] leading-relaxed text-regen-ink-soft">
          <li>The regeneration map runs on a bundled <strong>sample dataset</strong> when the live backend isn't connected (e.g. on the public demo link) — it says so on the map. Everything stays functional.</li>
          <li>Events, gardens, and projects need the <strong>live backend</strong> running. Without it they show a clear "couldn't load" state with a Retry and a link to the map — never a blank page.</li>
          <li>The old Garden Steward "/map" (Pollinator Pathways) was blank, so it now redirects to this regeneration map.</li>
        </ul>
      </section>

      <!-- Demonstrated & working -->
      <section class="rm-reveal">
        <h2 class="font-fraunces text-[22px] font-600 text-regen-ink"><i class="fa-solid fa-circle-check mr-2 text-regen-success" aria-hidden="true"></i>Demonstrated and working</h2>
        <ul class="mt-3 space-y-2">
          <li v-for="item in working" :key="item" class="flex items-start gap-2 font-inter text-[15px] leading-relaxed text-regen-ink-soft">
            <i class="fa-solid fa-check mt-1 text-regen-moss" aria-hidden="true"></i><span v-html="item"></span>
          </li>
        </ul>
      </section>

      <!-- Prototype / demo-only -->
      <section class="rm-reveal">
        <h2 class="font-fraunces text-[22px] font-600 text-regen-ink"><i class="fa-solid fa-flask mr-2 text-regen-warning" aria-hidden="true"></i>Prototype / demo-only (be honest)</h2>
        <ul class="mt-3 space-y-2">
          <li v-for="item in prototype" :key="item.title" class="rounded-xl border border-regen-line bg-regen-surface p-3">
            <p class="font-inter text-sm font-semibold text-regen-ink">{{ item.title }}</p>
            <p class="mt-0.5 font-inter text-[14px] leading-relaxed text-regen-ink-soft">{{ item.detail }}</p>
          </li>
        </ul>
      </section>

      <!-- Ongoing effort & cost -->
      <section class="rm-reveal">
        <h2 class="font-fraunces text-[22px] font-600 text-regen-ink"><i class="fa-solid fa-clock mr-2 text-regen-moss" aria-hidden="true"></i>Ongoing effort &amp; cost</h2>
        <div class="mt-3 overflow-x-auto">
          <table class="w-full border-collapse font-inter text-[14px]">
            <thead>
              <tr class="border-b border-regen-line text-left text-regen-muted">
                <th class="py-2 pr-4 font-semibold">Task</th>
                <th class="py-2 pr-4 font-semibold">Who</th>
                <th class="py-2 font-semibold">Time</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in effort" :key="row.task" class="border-b border-regen-line/60">
                <td class="py-2 pr-4 text-regen-ink">{{ row.task }}</td>
                <td class="py-2 pr-4 text-regen-ink-soft">{{ row.who }}</td>
                <td class="py-2 text-regen-ink-soft">{{ row.time }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl border border-regen-line bg-regen-surface p-4">
            <p class="font-inter text-[12px] font-semibold uppercase tracking-[0.08em] text-regen-success">Costs nothing in this build</p>
            <ul class="mt-2 space-y-1 font-inter text-[14px] text-regen-ink-soft">
              <li>Frontend hosting (Vercel/Netlify/Firebase free tier)</li>
              <li>Map tiles (OpenStreetMap + Leaflet)</li>
              <li>The app itself (open-source, no Lovable subscription)</li>
              <li>Running the map from the JSON fallback, no backend</li>
            </ul>
          </div>
          <div class="rounded-xl border border-regen-line bg-regen-surface p-4">
            <p class="font-inter text-[12px] font-semibold uppercase tracking-[0.08em] text-regen-warning">Would cost money if scaled</p>
            <ul class="mt-2 space-y-1 font-inter text-[14px] text-regen-ink-soft">
              <li>Email beyond a provider's free tier (newsletter at volume)</li>
              <li>A deployed Postgres backend (e.g. Fly.io) for live data</li>
              <li>A custom domain</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Handover checklist -->
      <section class="rm-reveal">
        <h2 class="font-fraunces text-[22px] font-600 text-regen-ink"><i class="fa-solid fa-clipboard-check mr-2 text-regen-moss" aria-hidden="true"></i>Handover checklist for the Guild</h2>
        <ol class="mt-3 space-y-2">
          <li v-for="(step, i) in handover" :key="i" class="flex items-start gap-3 rounded-xl border border-regen-line bg-regen-surface p-3 font-inter text-[15px] text-regen-ink-soft">
            <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-regen-moss/10 font-semibold text-regen-moss-dark">{{ i + 1 }}</span>
            <span v-html="step"></span>
          </li>
        </ol>
      </section>

      <div class="flex flex-wrap gap-3 border-t border-regen-line pt-6">
        <RouterLink to="/regeneration" class="inline-flex h-11 items-center gap-2 rounded-xl bg-regen-moss px-5 font-inter text-sm font-semibold text-white hover:bg-regen-moss-dark">Back to the map</RouterLink>
        <RouterLink to="/regeneration/replicate" class="inline-flex h-11 items-center gap-2 rounded-xl border border-regen-line bg-regen-surface px-5 font-inter text-sm font-semibold text-regen-ink hover:border-regen-moss">Replicate this map</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTitle } from '@vueuse/core';
import { useReveal } from '@/composables/useReveal';

useReveal();

const working = [
  'Discover: search, family / neighbourhood / participation / scenario filters, "near me", live count, split map + list.',
  'Listing detail with a trust block (source, verification, last-checked) and privacy-safe pins.',
  'Suggest / correct / report → moderation queue; private addresses and phone numbers are blocked.',
  'Volunteer moderation: approve / edit &amp; approve / reject, re-crawl candidate review, 90-day stale view, activity log.',
  'Steward demo-claim then manage hours / description / status.',
  'Newsletter: opt-in signup with preferences, compose, preview, send (demo), history.',
  'Replication: fork → edit one JSON file → deploy.',
  'Phase 2A awareness landing and Phase 2B returning-volunteer "My next step".',
];

const prototype = [
  { title: 'Moderation', detail: 'Approvals update the local dataset and the queue; in production this becomes a GitHub pull request or a Strapi review_status change. Not yet a live PR workflow.' },
  { title: 'Steward claim', detail: 'A clearly-labelled demo claim — no real identity verification ships this weekend.' },
  { title: 'Newsletter send', detail: 'Demo mode: no email provider is wired client-side, so "Send" records the send and exports the HTML for manual sending. It never emails anyone. Wiring the backend\'s email provider would make it real.' },
  { title: 'Training template', detail: 'The "what to bring" checklist and skill items are a draft pending Guild/expert review — never presented as approved procedure.' },
  { title: 'Workday SOP grounding', detail: 'The Guild\'s real workday SOP and V2 briefs were not provided, so a generic draft template is used and labelled as such (see docs/workday-sop-notes.md).' },
  { title: 'SEO metadata', detail: 'Titles, descriptions, and JSON-LD are client-rendered (populated by JS), not server-prerendered. Sitemap, robots, and llms.txt exist.' },
];

const effort = [
  { task: 'Moderation queue (approve / reject suggestions)', who: 'A named volunteer moderator', time: '~15 min / week' },
  { task: 'Stale check (listings not checked in 90+ days)', who: 'Moderator', time: 'Monthly' },
  { task: 'Re-crawl for new places (docs/recrawl-prompt.md)', who: 'Moderator', time: 'Monthly' },
  { task: 'Compose a newsletter', who: 'Any volunteer', time: 'Per event / month' },
];

const handover = [
  'Name a <strong>non-technical moderator</strong> (a role, not forever one person).',
  'Approve a suggestion: open <code class="rounded bg-regen-line/50 px-1 py-0.5">/regeneration/moderate</code> → review the diff → <em>Approve</em> (3 clicks).',
  'Mark a listing stale: <em>Stale</em> tab → <em>Mark checked</em> or <em>Mark inactive</em>.',
  'Run a monthly re-crawl using <code class="rounded bg-regen-line/50 px-1 py-0.5">docs/recrawl-prompt.md</code>; review candidates before they publish.',
  'Replicate for another community: see <code class="rounded bg-regen-line/50 px-1 py-0.5">/regeneration/replicate</code> — fork, edit the JSON, deploy.',
];

useTitle('What this demo shows — East Bay Regeneration Map');
</script>
