<template>
  <div class="min-h-screen bg-regen-paper font-inter text-regen-ink">
    <PageHeader :back="{ to: '/regeneration', label: 'Back to the map' }" eyebrow="Guild volunteer view" title="Keep the map honest" width="900px" />

    <div class="mx-auto max-w-[900px] px-6 py-8">
      <p class="flex items-start gap-2 rounded-xl border border-regen-line bg-regen-surface px-4 py-3 font-inter text-[13px] leading-relaxed text-regen-ink-soft">
        <i class="fa-solid fa-circle-info mt-0.5 text-regen-moss" aria-hidden="true"></i>
        Demo moderation view. In production this sits behind Guild login, and approving a change opens a pull request. Here it updates the local dataset so you can see the flow.
      </p>

      <!-- Tabs -->
      <div class="mt-6 flex flex-wrap gap-1 border-b border-regen-line">
        <button v-for="t in tabs" :key="t.key" type="button"
          class="relative px-4 py-2.5 font-inter text-sm font-semibold transition"
          :class="tab === t.key ? 'text-regen-moss' : 'text-regen-muted hover:text-regen-ink'"
          @click="tab = t.key">
          {{ t.label }}
          <span v-if="t.count" class="ml-1.5 rounded-full bg-regen-moss/10 px-2 py-0.5 text-xs text-regen-moss-dark">{{ t.count }}</span>
          <span v-if="tab === t.key" class="absolute inset-x-2 -bottom-px h-0.5 rounded bg-regen-moss"></span>
        </button>
      </div>

      <!-- Pending suggestions / candidates -->
      <div v-if="tab === 'pending' || tab === 'candidates'" class="mt-5 space-y-3">
        <p v-if="!activeList.length" class="rounded-2xl border border-dashed border-regen-line bg-regen-surface p-8 text-center font-inter text-regen-muted">
          Nothing waiting — the queue is clear. 🌱
        </p>
        <article v-for="p in activeList" :key="p.id" class="rounded-2xl border border-regen-line bg-regen-surface p-5">
          <div class="flex items-start justify-between gap-3">
            <div>
              <span class="font-inter text-[12px] font-semibold uppercase tracking-[0.08em] text-regen-muted">{{ kindLabel(p) }}</span>
              <h3 class="mt-0.5 font-fraunces text-[18px] font-600 text-regen-ink">{{ proposals.labelFor(p) }}</h3>
            </div>
            <span v-if="p.sourceType === 'crawl-candidate'" class="shrink-0 rounded-full bg-regen-clay/10 px-2.5 py-1 font-inter text-xs font-semibold text-regen-clay-dark">Unverified candidate</span>
          </div>

          <!-- What changed -->
          <dl class="mt-3 space-y-1.5">
            <div v-for="row in changeRows(p)" :key="row.key" class="grid grid-cols-[120px_1fr] gap-2 font-inter text-sm">
              <dt class="text-regen-muted">{{ row.key }}</dt>
              <dd class="text-regen-ink">
                <input v-if="ui[p.id]?.mode === 'edit'" v-model="ui[p.id].edits[row.key]" class="w-full rounded-lg border border-regen-line bg-regen-paper px-2.5 py-1.5 font-inter text-sm outline-none focus:border-regen-moss" />
                <template v-else-if="row.old !== undefined">
                  <span class="text-regen-danger line-through">{{ row.old }}</span>
                  <i class="fa-solid fa-arrow-right mx-1.5 text-regen-muted" aria-hidden="true"></i>
                  <span class="font-semibold text-regen-success">{{ row.new }}</span>
                </template>
                <template v-else>{{ row.new }}</template>
              </dd>
            </div>
          </dl>

          <p class="mt-3 font-inter text-xs text-regen-muted">
            Source:
            <a v-if="isUrl(p.source)" :href="p.source" target="_blank" rel="noopener noreferrer" class="text-regen-moss hover:underline">{{ p.source }}</a>
            <span v-else>{{ p.source || '—' }}</span>
            · Submitted {{ p.submittedAt }}
          </p>

          <!-- Reject reason -->
          <div v-if="ui[p.id]?.mode === 'reject'" class="mt-3">
            <textarea v-model="ui[p.id].reason" rows="2" placeholder="Why are you rejecting this? (kept in the log)" class="w-full rounded-xl border border-regen-line bg-regen-paper px-3 py-2 font-inter text-sm outline-none focus:border-regen-danger"></textarea>
          </div>

          <!-- Actions -->
          <div class="mt-4 flex flex-wrap gap-2">
            <template v-if="ui[p.id]?.mode === 'reject'">
              <button type="button" class="rounded-xl bg-regen-danger px-4 py-2.5 font-inter text-sm font-semibold text-white hover:opacity-90" @click="doReject(p)">Confirm reject</button>
              <button type="button" class="rounded-xl border border-regen-line px-4 py-2.5 font-inter text-sm font-semibold text-regen-ink hover:border-regen-moss" @click="setMode(p.id, null)">Cancel</button>
            </template>
            <template v-else-if="ui[p.id]?.mode === 'edit'">
              <button type="button" class="rounded-xl bg-regen-moss px-4 py-2.5 font-inter text-sm font-semibold text-white hover:bg-regen-moss-dark" @click="doEditApprove(p)">
                <i class="fa-solid fa-check mr-1.5" aria-hidden="true"></i>Save &amp; approve
              </button>
              <button type="button" class="rounded-xl border border-regen-line px-4 py-2.5 font-inter text-sm font-semibold text-regen-ink hover:border-regen-moss" @click="setMode(p.id, null)">Cancel</button>
            </template>
            <template v-else>
              <button type="button" class="rounded-xl bg-regen-moss px-4 py-2.5 font-inter text-sm font-semibold text-white hover:bg-regen-moss-dark" @click="doApprove(p)">
                <i class="fa-solid fa-check mr-1.5" aria-hidden="true"></i>{{ p.sourceType === 'crawl-candidate' ? 'Verify & publish' : 'Approve' }}
              </button>
              <button type="button" class="rounded-xl border border-regen-line px-4 py-2.5 font-inter text-sm font-semibold text-regen-ink hover:border-regen-moss" @click="startEdit(p)">Edit &amp; approve</button>
              <button type="button" class="rounded-xl border border-regen-line px-4 py-2.5 font-inter text-sm font-semibold text-regen-ink hover:border-regen-danger" @click="setMode(p.id, 'reject')">Reject</button>
            </template>
          </div>
        </article>
      </div>

      <!-- Stale -->
      <div v-else-if="tab === 'stale'" class="mt-5 space-y-3">
        <p class="font-inter text-sm text-regen-ink-soft">Listings not checked in {{ staleDays }}+ days, oldest first. Verifying stamps today's date.</p>
        <p v-if="!staleList.length" class="rounded-2xl border border-dashed border-regen-line bg-regen-surface p-8 text-center font-inter text-regen-muted">Everything's been checked recently. 🌿</p>
        <article v-for="r in staleList" :key="r.slug" class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-regen-line bg-regen-surface p-4">
          <div>
            <h3 class="font-fraunces text-[16px] font-600 text-regen-ink">{{ r.name }}</h3>
            <p class="font-inter text-xs text-regen-warning">Last checked {{ r.lastChecked || 'never' }} · {{ daysAgo(r.lastChecked) }} days ago</p>
          </div>
          <div class="flex gap-2">
            <button type="button" class="rounded-xl bg-regen-moss px-3.5 py-2 font-inter text-sm font-semibold text-white hover:bg-regen-moss-dark" @click="markChecked(r)">Mark checked</button>
            <button type="button" class="rounded-xl border border-regen-line px-3.5 py-2 font-inter text-sm font-semibold text-regen-ink hover:border-regen-danger" @click="markInactive(r)">Mark inactive</button>
          </div>
        </article>
      </div>

      <!-- Activity -->
      <div v-else-if="tab === 'activity'" class="mt-5">
        <p v-if="!proposals.activityLog.length" class="rounded-2xl border border-dashed border-regen-line bg-regen-surface p-8 text-center font-inter text-regen-muted">No actions logged yet.</p>
        <ol v-else class="space-y-2">
          <li v-for="(e, i) in proposals.activityLog" :key="i" class="flex items-center gap-3 rounded-xl border border-regen-line bg-regen-surface px-4 py-3 font-inter text-sm">
            <i class="fa-solid" :class="e.action.includes('reject') ? 'fa-xmark text-regen-danger' : 'fa-check text-regen-success'" aria-hidden="true"></i>
            <span class="text-regen-ink"><span class="font-semibold">{{ e.label }}</span> — {{ e.action }}</span>
            <span class="ml-auto text-regen-muted">{{ e.at }}</span>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useTitle } from '@vueuse/core';
import { useProposalsStore, useResourcesStore, useAlertStore } from '@/stores';
import PageHeader from '@/components/PageHeader.vue';
import { typeLabel, daysSince, STALE_DAYS } from '@/_config/RegenConfig';

const proposals = useProposalsStore();
const resources = useResourcesStore();
const alert = useAlertStore();

const staleDays = STALE_DAYS;
const tab = ref('pending');
const ui = reactive({});

const tabs = computed(() => [
  { key: 'pending', label: 'Suggestions', count: proposals.pendingSuggestions.length },
  { key: 'candidates', label: 'Re-crawl candidates', count: proposals.pendingCandidates.length },
  { key: 'stale', label: 'Stale', count: staleList.value.length },
  { key: 'activity', label: 'Activity log', count: 0 },
]);

const activeList = computed(() => (tab.value === 'candidates' ? proposals.pendingCandidates : proposals.pendingSuggestions));

const staleList = computed(() =>
  resources.resources
    .filter((r) => r.status !== 'inactive' && daysSince(r.lastChecked) > STALE_DAYS)
    .sort((a, b) => daysSince(b.lastChecked) - daysSince(a.lastChecked))
);

function kindLabel(p) {
  if (p.kind === 'candidate') return 'Crawl candidate';
  if (p.kind === 'correction') return p.fields?.report ? 'Report' : 'Correction';
  return `New ${typeLabel(p.fields?.type)}`;
}
function isUrl(s) { return typeof s === 'string' && /^https?:\/\//.test(s); }
function daysAgo(iso) { const d = daysSince(iso); return d === Infinity ? '∞' : d; }

// Flatten a proposal's fields into display rows (old→new for diffs).
function changeRows(p) {
  const rows = [];
  for (const [key, val] of Object.entries(p.fields || {})) {
    if (key === 'report') continue;
    if (val && typeof val === 'object' && 'new' in val) rows.push({ key, old: val.old, new: val.new });
    else rows.push({ key: key === 'note' ? 'details' : key, new: Array.isArray(val) ? val.join(', ') : val });
  }
  return rows;
}

function setMode(id, mode) {
  if (!ui[id]) ui[id] = { mode: null, reason: '', edits: {} };
  ui[id].mode = mode;
}
// Edit & approve: prefill editable values from the proposal's change rows.
function startEdit(p) {
  const edits = {};
  for (const row of changeRows(p)) edits[row.key] = row.new;
  ui[p.id] = { mode: 'edit', reason: '', edits };
}
function doEditApprove(p) {
  const edits = ui[p.id]?.edits || {};
  // Rebuild the proposal's fields from the edited values, preserving diff shape.
  const fields = { ...p.fields };
  for (const [key, val] of Object.entries(edits)) {
    const orig = p.fields?.[key] ?? (key === 'details' ? p.fields?.note : undefined);
    if (orig && typeof orig === 'object' && 'new' in orig) fields[key] = { old: orig.old, new: val };
    else if (key === 'details') fields.note = val;
    else fields[key] = val;
  }
  const edited = { ...p, fields };
  proposals.approve(p.id, fields);
  resources.applyProposal(edited);
  setMode(p.id, null);
  alert.success('Edited and approved.');
}
function doApprove(p) {
  proposals.approve(p.id);
  resources.applyProposal(p);
  alert.success(p.kind === 'correction' ? 'Correction applied and listing stamped.' : 'Published to the map.');
}
function doReject(p) {
  proposals.reject(p.id, ui[p.id]?.reason || '');
  alert.success('Rejected — logged with your reason.');
}
function markChecked(r) { resources.markChecked(r.slug); alert.success(`${r.name} marked checked today.`); }
function markInactive(r) { resources.markInactive(r.slug); alert.success(`${r.name} marked inactive.`); }

useTitle('Moderation — East Bay Regeneration Map');
onMounted(() => { if (!resources.resources.length) resources.fetchAll(); });
</script>
