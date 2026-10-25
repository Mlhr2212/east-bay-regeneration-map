<template>
  <div class="min-h-screen bg-regen-paper font-inter text-regen-ink">
    <!-- Header: crawlable intro text (brief §9 — what it is, who for, how many, how to help) -->
    <PageHeader eyebrow="East Bay Regeneration Map" title="Find a way to help, close to home." width="1200px">
      <template #actions>
        <button type="button" class="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-[#f7f1e3]/40 px-3 py-1.5 font-inter text-xs font-semibold text-[#f7f1e3] transition hover:bg-white/10" title="Restore the seeded demo dataset" @click="resetDemo">
          <i class="fa-solid fa-rotate-left" aria-hidden="true"></i> Reset demo data
        </button>
      </template>
      <p>
        A community-kept map of regeneration projects across the East Bay — community gardens,
        seed and tool libraries, fridges, pantries, mutual-aid, and resilience hubs. See who each place serves,
        whether it's active, and how to get involved. Anyone can
        <RouterLink to="/regeneration/suggest" class="font-semibold underline underline-offset-2">suggest a place</RouterLink>,
        and Guild volunteers
        <RouterLink to="/regeneration/moderate" class="font-semibold underline underline-offset-2">keep it current</RouterLink>.
      </p>
    </PageHeader>

    <!-- Awareness layer (Phase 2A): orient a first-time visitor in ~60s, then
         hand straight off to the map, which stays the hero. -->
    <section class="border-b border-regen-line bg-regen-paper" aria-label="New here?">
      <div class="mx-auto max-w-[1200px] px-6 py-8">
        <!-- New-here invitation -->
        <p class="max-w-2xl font-inter text-[15px] leading-relaxed text-regen-ink-soft">
          <strong class="text-regen-ink">New here?</strong> You don't need to know anything about permaculture to start.
          Pick one place, show up once, and see if it fits.
        </p>

        <!-- What is permaculture (plain-language intro — Guild to approve wording) -->
        <details class="mt-4 max-w-2xl rounded-xl border border-regen-line bg-regen-surface px-4 py-3">
          <summary class="cursor-pointer font-inter text-sm font-semibold text-regen-ink">What is permaculture, in one sentence?</summary>
          <p class="mt-2 font-inter text-[15px] leading-relaxed text-regen-ink-soft">
            Working <em>with</em> nature rather than against it — to grow food, share resources, and build neighbourhood resilience.
          </p>
          <p class="mt-1 font-inter text-[12px] text-regen-muted">A plain-language introduction, not an official definition — wording to be approved by the Guild.</p>
        </details>

        <!-- Why it matters today → each links to a real filtered view -->
        <div class="rm-reveal mt-6">
          <h2 class="font-inter text-[12px] font-semibold uppercase tracking-[0.08em] text-regen-muted">Why it matters today</h2>
          <div class="mt-2 grid gap-2 sm:grid-cols-3">
            <button type="button" class="rm-lift rm-press rounded-xl border border-regen-line bg-regen-surface p-3 text-left hover:border-regen-moss" @click="focusView({ families: ['eat', 'grow'] })">
              <span class="font-inter text-sm font-semibold text-regen-ink"><i class="fa-solid fa-carrot mr-1.5 text-regen-moss" aria-hidden="true"></i>Food access &amp; cost</span>
              <span class="mt-0.5 block font-inter text-[13px] text-regen-ink-soft">Gardens, fridges, and pantries sharing fresh food near you.</span>
            </button>
            <button type="button" class="rm-lift rm-press rounded-xl border border-regen-line bg-regen-surface p-3 text-left hover:border-regen-moss" @click="focusView({ scenarios: ['extreme-heat', 'flooding'] })">
              <span class="font-inter text-sm font-semibold text-regen-ink"><i class="fa-solid fa-temperature-high mr-1.5 text-regen-clay-dark" aria-hidden="true"></i>Heat &amp; flooding</span>
              <span class="mt-0.5 block font-inter text-[13px] text-regen-ink-soft">Places that may help when it's dangerously hot or wet.</span>
            </button>
            <button type="button" class="rm-lift rm-press rounded-xl border border-regen-line bg-regen-surface p-3 text-left hover:border-regen-moss" @click="focusView({ families: ['gather', 'share'] })">
              <span class="font-inter text-sm font-semibold text-regen-ink"><i class="fa-solid fa-people-group mr-1.5 text-regen-moss" aria-hidden="true"></i>Neighbourhood &amp; mutual aid</span>
              <span class="mt-0.5 block font-inter text-[13px] text-regen-ink-soft">Spaces, tool shares, and mutual-aid pods near you.</span>
            </button>
          </div>
        </div>

        <!-- Your first way in → three real first steps -->
        <div class="rm-reveal mt-6">
          <h2 class="font-inter text-[12px] font-semibold uppercase tracking-[0.08em] text-regen-muted">Your first way in</h2>
          <div class="mt-2 flex flex-wrap gap-2">
            <button type="button" class="rm-lift rm-press inline-flex items-center gap-2 rounded-xl bg-regen-moss px-4 py-2.5 font-inter text-sm font-semibold text-white hover:bg-regen-moss-dark" @click="focusView({ participate: ['visit'] })">
              <i class="fa-solid fa-location-dot" aria-hidden="true"></i> Visit a place this week
            </button>
            <RouterLink to="/regeneration/volunteer" class="rm-lift rm-press inline-flex items-center gap-2 rounded-xl border border-regen-line bg-regen-surface px-4 py-2.5 font-inter text-sm font-semibold text-regen-ink hover:border-regen-moss">
              <i class="fa-solid fa-book-open" aria-hidden="true"></i> Learn &amp; get ready
            </RouterLink>
            <button type="button" class="rm-lift rm-press inline-flex items-center gap-2 rounded-xl border border-regen-line bg-regen-surface px-4 py-2.5 font-inter text-sm font-semibold text-regen-ink hover:border-regen-moss" @click="focusView({ participate: ['volunteer'] })">
              <i class="fa-solid fa-hands-helping" aria-hidden="true"></i> Volunteer at a work party
            </button>
          </div>
        </div>
      </div>
    </section>

    <div id="regen-controls" class="mx-auto max-w-[1200px] px-6 py-6">
      <!-- Search + primary controls -->
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label class="relative flex-1">
            <span class="sr-only">Search by name or neighbourhood</span>
            <i class="fa-solid fa-magnifying-glass pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-regen-muted" aria-hidden="true"></i>
            <input
              v-model="search"
              type="search"
              placeholder="Search by name or neighbourhood…"
              class="h-12 w-full rounded-xl border border-regen-line bg-regen-surface pl-11 pr-4 font-inter text-[15px] text-regen-ink outline-none focus:border-regen-moss focus:ring-2 focus:ring-regen-moss/30"
            />
          </label>
          <button
            type="button"
            class="inline-flex h-12 items-center justify-center gap-2 rounded-xl px-4 font-inter text-sm font-semibold transition"
            :class="nearMe ? 'bg-regen-moss text-white' : 'border border-regen-line bg-regen-surface text-regen-ink hover:border-regen-moss'"
            @click="toggleNearMe"
          >
            <i class="fa-solid fa-location-crosshairs" aria-hidden="true"></i>
            {{ nearMe ? 'Sorted by distance' : 'Near me' }}
          </button>
        </div>

        <!-- Family chips (Hick's Law: 5 groups, full list behind "More types") -->
        <div class="flex flex-wrap items-center gap-2">
          <span class="font-inter text-[12px] font-semibold uppercase tracking-[0.08em] text-regen-muted">What are you looking for?</span>
          <button
            v-for="fam in families"
            :key="fam.key"
            type="button"
            class="inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 font-inter text-sm font-semibold transition"
            :class="selectedFamilies.has(fam.key) ? 'text-white' : 'border border-regen-line bg-regen-surface text-regen-ink hover:border-regen-moss'"
            :style="selectedFamilies.has(fam.key) ? { backgroundColor: fam.color } : {}"
            :aria-pressed="selectedFamilies.has(fam.key)"
            @click="toggleFamily(fam.key)"
          >
            <span class="h-2 w-2 rounded-full" :style="{ backgroundColor: selectedFamilies.has(fam.key) ? '#fff' : fam.color }" aria-hidden="true"></span>
            {{ fam.label }}
          </button>
          <button
            type="button"
            class="inline-flex h-9 items-center gap-1.5 rounded-full border border-regen-line bg-regen-surface px-3.5 font-inter text-sm font-semibold text-regen-ink hover:border-regen-moss"
            :aria-expanded="showAdvanced"
            @click="showAdvanced = !showAdvanced"
          >
            <i class="fa-solid fa-sliders" aria-hidden="true"></i>
            More filters
          </button>
        </div>

        <!-- Advanced filters (progressive disclosure) -->
        <div v-if="showAdvanced" class="grid gap-4 rounded-2xl border border-regen-line bg-regen-surface p-4 sm:grid-cols-3">
          <div>
            <label class="mb-1.5 block font-inter text-[12px] font-semibold uppercase tracking-[0.08em] text-regen-muted">Neighbourhood</label>
            <select v-model="neighbourhood" class="h-11 w-full rounded-xl border border-regen-line bg-regen-surface px-3 font-inter text-sm text-regen-ink outline-none focus:border-regen-moss">
              <option value="">All neighbourhoods</option>
              <option v-for="n in store.neighbourhoods" :key="n" :value="n">{{ n }}</option>
            </select>
          </div>
          <div>
            <label class="mb-1.5 block font-inter text-[12px] font-semibold uppercase tracking-[0.08em] text-regen-muted">Ways to participate</label>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="(p, key) in participateOptions"
                :key="key"
                type="button"
                class="inline-flex h-8 items-center gap-1.5 rounded-full px-3 font-inter text-xs font-semibold transition"
                :class="selectedParticipate.has(key) ? 'bg-regen-moss text-white' : 'border border-regen-line text-regen-ink hover:border-regen-moss'"
                :aria-pressed="selectedParticipate.has(key)"
                @click="toggleSet(selectedParticipate, key)"
              >{{ p.label }}</button>
            </div>
          </div>
          <div>
            <label class="mb-1.5 block font-inter text-[12px] font-semibold uppercase tracking-[0.08em] text-regen-muted">Resilience scenario</label>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="(s, key) in scenarioOptions"
                :key="key"
                type="button"
                class="inline-flex h-8 items-center gap-1.5 rounded-full px-3 font-inter text-xs font-semibold transition"
                :class="selectedScenarios.has(key) ? 'bg-regen-clay-dark text-white' : 'border border-regen-line text-regen-ink hover:border-regen-clay-dark'"
                :aria-pressed="selectedScenarios.has(key)"
                @click="toggleSet(selectedScenarios, key)"
              ><i class="fa-solid" :class="s.icon" aria-hidden="true"></i> {{ s.label }}</button>
            </div>
          </div>
          <div class="sm:col-span-3">
            <label class="inline-flex cursor-pointer items-center gap-2 font-inter text-sm text-regen-ink-soft">
              <input type="checkbox" v-model="showInactive" class="h-4 w-4 rounded border-regen-line text-regen-moss focus:ring-regen-moss" />
              Show inactive listings
            </label>
          </div>
        </div>

        <!-- Active filter chips + clear all -->
        <div v-if="activeChips.length" class="flex flex-wrap items-center gap-2">
          <button
            v-for="chip in activeChips"
            :key="chip.key"
            type="button"
            class="inline-flex h-8 items-center gap-2 rounded-full bg-regen-moss/10 px-3 font-inter text-xs font-semibold text-regen-moss-dark hover:bg-regen-moss/20"
            @click="chip.clear"
          >
            {{ chip.label }}
            <i class="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>
          <button type="button" class="font-inter text-xs font-semibold text-regen-muted underline underline-offset-2 hover:text-regen-ink" @click="clearAll">
            Clear all
          </button>
        </div>

        <!-- Scenario disclaimer (brief §1 — never an emergency-service claim) -->
        <p v-if="selectedScenarios.size" class="rounded-xl border border-regen-clay/30 bg-regen-clay/5 px-4 py-3 font-inter text-[13px] leading-relaxed text-regen-ink-soft">
          <i class="fa-solid fa-circle-info mr-1 text-regen-clay" aria-hidden="true"></i>{{ scenarioDisclaimer }}
        </p>

        <!-- Count + source + mobile view toggle -->
        <div class="flex items-center justify-between gap-3">
          <p class="font-inter text-sm font-semibold text-regen-ink" aria-live="polite">
            <span v-if="store.loading">Loading places…</span>
            <template v-else>{{ filtered.length }} {{ filtered.length === 1 ? 'place' : 'places' }}</template>
            <span v-if="!store.loading && store.source === 'fallback'" class="ml-2 inline-flex items-center gap-1 rounded-full bg-regen-warning/10 px-2 py-0.5 text-[12px] font-semibold text-regen-warning" title="Live backend not connected — showing the community's bundled sample dataset">
              <i class="fa-solid fa-circle-info" aria-hidden="true"></i> sample data (offline)
            </span>
          </p>
          <div class="flex gap-1 rounded-xl border border-regen-line bg-regen-surface p-1 lg:hidden">
            <button type="button" class="rounded-lg px-3 py-1.5 font-inter text-sm font-semibold" :class="mobileView === 'list' ? 'bg-regen-moss text-white' : 'text-regen-ink'" @click="mobileView = 'list'">List</button>
            <button type="button" class="rounded-lg px-3 py-1.5 font-inter text-sm font-semibold" :class="mobileView === 'map' ? 'bg-regen-moss text-white' : 'text-regen-ink'" @click="mobileView = 'map'">Map</button>
          </div>
        </div>
      </div>

      <!-- Split: list + map -->
      <div class="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <!-- List -->
        <section :class="{ 'hidden lg:block': mobileView === 'map' }" aria-label="Resource list">
          <a href="#regen-map" class="sr-only focus:not-sr-only focus:mb-2 focus:inline-block focus:text-regen-moss">Skip to map</a>
          <div v-if="store.loading" class="space-y-3">
            <div v-for="i in 5" :key="i" class="h-32 animate-pulse rounded-2xl bg-regen-line/40"></div>
          </div>
          <div v-else-if="!filtered.length" class="rounded-2xl border border-dashed border-regen-line bg-regen-surface p-8 text-center">
            <p class="font-fraunces text-[20px] font-600 text-regen-ink">{{ emptyState }}</p>
            <RouterLink to="/regeneration/suggest" class="rm-press mt-3 inline-flex items-center gap-2 rounded-xl bg-regen-clay-dark px-4 py-2.5 font-inter text-sm font-semibold text-white hover:bg-regen-moss">
              <i class="fa-solid fa-plus" aria-hidden="true"></i> Suggest a place
            </RouterLink>
          </div>
          <!-- Filter changes transition smoothly (transform+opacity), never flash blank. -->
          <TransitionGroup v-else name="rlist" tag="div" class="relative grid gap-3">
            <ResourceCard
              v-for="r in filtered"
              :key="r.id"
              :resource="r"
              :selected="r.slug === selectedSlug"
              @highlight="selectedSlug = $event.slug"
            />
          </TransitionGroup>
        </section>

        <!-- Map -->
        <section id="regen-map" :class="{ 'hidden lg:block': mobileView === 'list' }" aria-label="Map">
          <div class="sticky top-4">
            <div class="h-[70vh] overflow-hidden rounded-2xl border border-regen-line">
              <RegenMap :resources="filtered" :selected-slug="selectedSlug" @select="goToDetail" />
            </div>
            <!-- Legend (brief §8 — colour AND text) -->
            <div class="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 rounded-xl border border-regen-line bg-regen-surface px-4 py-3">
              <span class="font-inter text-[12px] font-semibold uppercase tracking-[0.08em] text-regen-muted">Legend</span>
              <span v-for="fam in families" :key="fam.key" class="inline-flex items-center gap-1.5 font-inter text-sm text-regen-ink-soft">
                <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: fam.color }" aria-hidden="true"></span>{{ fam.label }}
              </span>
            </div>
          </div>
        </section>
      </div>

      <!-- Footer: newsletter signup + community links -->
      <footer class="mt-10 grid gap-6 border-t border-regen-line pt-8 md:grid-cols-[1fr_auto]">
        <NewsletterSignup heading="Keep up with East Bay regeneration" />
        <nav class="flex flex-col gap-2 font-inter text-sm md:items-end">
          <RouterLink to="/regeneration/suggest" class="font-semibold text-regen-moss hover:underline">Suggest a place</RouterLink>
          <RouterLink to="/regeneration/volunteer" class="font-semibold text-regen-moss hover:underline">My next step (returning volunteers)</RouterLink>
          <RouterLink to="/regeneration/moderate" class="font-semibold text-regen-moss hover:underline">Volunteer: moderate the map</RouterLink>
          <RouterLink to="/regeneration/newsletter" class="font-semibold text-regen-moss hover:underline">Volunteer: send a newsletter</RouterLink>
          <RouterLink to="/regeneration/replicate" class="font-semibold text-regen-moss hover:underline">Replicate this map</RouterLink>
          <RouterLink to="/regeneration/about-this-demo" class="font-semibold text-regen-moss hover:underline">What this demo shows</RouterLink>
        </nav>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useResourcesStore, useAlertStore, useProposalsStore, useNewsletterStore } from '@/stores';
import PageHeader from '@/components/PageHeader.vue';
import RegenMap from '@/components/regen/RegenMap.vue';
import ResourceCard from '@/components/regen/ResourceCard.vue';
import NewsletterSignup from '@/components/regen/NewsletterSignup.vue';
import { useTitle } from '@vueuse/core';
import { setMetaDescription } from '@/helpers/seo';
import { useReveal } from '@/composables/useReveal';
import {
  TYPE_FAMILIES, PARTICIPATE, SCENARIOS, SCENARIO_DISCLAIMER,
} from '@/_config/RegenConfig';

const router = useRouter();
const route = useRoute();
const store = useResourcesStore();
const alert = useAlertStore();
const proposals = useProposalsStore();
const newsletter = useNewsletterStore();

async function resetDemo() {
  proposals.reset();
  newsletter.reset();
  await store.fetchAll();
  clearAll();
  alert.success('Demo data reset.');
}

const families = TYPE_FAMILIES;
const participateOptions = PARTICIPATE;
const scenarioOptions = SCENARIOS;
const scenarioDisclaimer = SCENARIO_DISCLAIMER;

const search = ref('');
const selectedFamilies = reactive(new Set());
const selectedParticipate = reactive(new Set());
const selectedScenarios = reactive(new Set());
const neighbourhood = ref('');
const showInactive = ref(false);
const showAdvanced = ref(false);
const nearMe = ref(false);
const userLoc = ref(null);
const mobileView = ref('list');
const selectedSlug = ref(null);


function toggleSet(set, key) {
  set.has(key) ? set.delete(key) : set.add(key);
}
function toggleFamily(key) {
  toggleSet(selectedFamilies, key);
}

const filtered = computed(() => {
  let list = showInactive.value ? store.resources : store.activeResources;
  const q = search.value.trim().toLowerCase();
  if (q) {
    list = list.filter((r) =>
      [r.name, r.neighbourhood, r.city].some((v) => (v || '').toLowerCase().includes(q))
    );
  }
  if (selectedFamilies.size) list = list.filter((r) => selectedFamilies.has(r.family));
  if (neighbourhood.value) list = list.filter((r) => r.neighbourhood === neighbourhood.value);
  if (selectedParticipate.size) list = list.filter((r) => r.participate.some((p) => selectedParticipate.has(p)));
  if (selectedScenarios.size) list = list.filter((r) => r.scenarioTags.some((s) => selectedScenarios.has(s)));

  if (nearMe.value && userLoc.value) {
    list = [...list].sort((a, b) => dist(a) - dist(b));
  }
  return list;
});

function dist(r) {
  if (!userLoc.value || r.latitude == null) return Infinity;
  return store.haversineDistance(userLoc.value.lat, userLoc.value.lng, r.latitude, r.longitude);
}

const activeChips = computed(() => {
  const chips = [];
  if (search.value) chips.push({ key: 'q', label: `"${search.value}"`, clear: () => (search.value = '') });
  selectedFamilies.forEach((f) => chips.push({ key: `fam-${f}`, label: TYPE_FAMILIES.find((x) => x.key === f)?.label, clear: () => selectedFamilies.delete(f) }));
  if (neighbourhood.value) chips.push({ key: 'nb', label: neighbourhood.value, clear: () => (neighbourhood.value = '') });
  selectedParticipate.forEach((p) => chips.push({ key: `p-${p}`, label: PARTICIPATE[p].label, clear: () => selectedParticipate.delete(p) }));
  selectedScenarios.forEach((s) => chips.push({ key: `s-${s}`, label: SCENARIOS[s].label, clear: () => selectedScenarios.delete(s) }));
  if (showInactive.value) chips.push({ key: 'inactive', label: 'Incl. inactive', clear: () => (showInactive.value = false) });
  return chips;
});

const emptyState = computed(() => {
  const nb = neighbourhood.value ? ` in ${neighbourhood.value}` : '';
  const fam = selectedFamilies.size ? ` ${[...selectedFamilies].map((f) => TYPE_FAMILIES.find((x) => x.key === f)?.label).join('/')}` : '';
  return `No${fam} places${nb} match yet — know one? Suggest it below.`;
});

function clearAll() {
  search.value = '';
  selectedFamilies.clear();
  selectedParticipate.clear();
  selectedScenarios.clear();
  neighbourhood.value = '';
  showInactive.value = false;
}

function toggleNearMe() {
  if (nearMe.value) {
    nearMe.value = false;
    return;
  }
  if (!navigator.geolocation) {
    alert.error('Location is not available in this browser.');
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      userLoc.value = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      nearMe.value = true;
    },
    () => alert.error('Could not get your location — showing all places.')
  );
}

function goToDetail(resource) {
  selectedSlug.value = resource.slug;
  router.push(`/regeneration/${resource.slug}`);
}

// Awareness "first step" / "why it matters" jumps (Phase 2A): set a filtered
// view and scroll to the controls so the link is a real action, never a dead end.
function focusView({ families = [], scenarios = [], participate = [] } = {}) {
  clearAll();
  families.forEach((f) => selectedFamilies.add(f));
  participate.forEach((p) => selectedParticipate.add(p));
  if (scenarios.length) { showAdvanced.value = true; scenarios.forEach((s) => selectedScenarios.add(s)); }
  document.getElementById('regen-controls')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Deep-link support: /regeneration?family=eat&scenario=extreme-heat&participate=volunteer
function applyQuery() {
  const q = route.query;
  const split = (v) => (Array.isArray(v) ? v : String(v).split(',')).map((s) => s.trim()).filter(Boolean);
  if (q.q) search.value = String(q.q);
  if (q.family) split(q.family).forEach((f) => selectedFamilies.add(f));
  if (q.participate) split(q.participate).forEach((p) => selectedParticipate.add(p));
  if (q.scenario) { showAdvanced.value = true; split(q.scenario).forEach((s) => selectedScenarios.add(s)); }
}

useTitle('East Bay Regeneration Map — find a way to help near you');
setMetaDescription('A community-kept map of regeneration projects across the East Bay: community gardens, seed and tool libraries, fridges, pantries, mutual-aid, and resilience hubs. See who each place serves, whether it is active, and how to get involved.');
useReveal();
onMounted(() => {
  if (!store.resources.length) store.fetchAll();
  applyQuery();
});
</script>
