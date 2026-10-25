<template>
  <div class="min-h-screen bg-regen-paper font-inter text-regen-ink">
    <PageHeader :back="{ to: '/regeneration', label: 'Back to the map' }" :eyebrow="resource ? typeLabel : ''" :title="resource ? resource.name : 'Listing'" width="900px">
      <template v-if="resource" #actions>
        <span class="inline-flex rounded-full bg-[#f7f1e3] p-0.5"><StatusBadge :status="resource.status" /></span>
      </template>
      <p v-if="resource"><i class="fa-solid fa-location-dot mr-1" aria-hidden="true"></i>{{ resource.neighbourhood || resource.city }}<span v-if="resource.neighbourhood && resource.city">, {{ resource.city }}</span></p>
    </PageHeader>
    <div class="mx-auto max-w-[900px] px-6 py-6">
      <!-- Loading -->
      <div v-if="store.loading && !resource" class="mt-6 space-y-3">
        <div class="h-8 w-2/3 animate-pulse rounded-lg bg-regen-line/50"></div>
        <div class="h-40 animate-pulse rounded-2xl bg-regen-line/40"></div>
      </div>

      <!-- Not found -->
      <div v-else-if="!resource" class="mt-10 rounded-2xl border border-dashed border-regen-line bg-regen-surface p-10 text-center">
        <p class="font-fraunces text-[24px] font-600 text-regen-ink">We couldn't find that listing.</p>
        <p class="mt-2 font-inter text-regen-ink-soft">It may have been removed, or the link is out of date.</p>
        <RouterLink to="/regeneration" class="mt-4 inline-flex items-center gap-2 rounded-xl bg-regen-moss px-4 py-2.5 font-inter text-sm font-semibold text-white hover:bg-regen-moss-dark">
          Browse the map
        </RouterLink>
      </div>

      <!-- Detail -->
      <article v-else class="mt-5">
        <!-- Private location note (brief §1) -->
        <p v-if="resource.isPrivate" class="mt-3 inline-flex items-start gap-2 rounded-xl border border-regen-line bg-regen-surface px-4 py-3 font-inter text-[13px] text-regen-ink-soft">
          <i class="fa-solid fa-shield-halved mt-0.5 text-regen-moss" aria-hidden="true"></i>
          Exact location shared on contact, to protect privacy. The map shows this place at neighbourhood level only.
        </p>

        <div class="mt-6 grid gap-6 md:grid-cols-[1fr_320px]">
          <div>
            <p v-if="resource.description" class="font-inter text-[16px] leading-relaxed text-regen-ink">{{ resource.description }}</p>

            <!-- Who it serves -->
            <div v-if="resource.serves" class="mt-5">
              <h2 class="font-inter text-[12px] font-semibold uppercase tracking-[0.08em] text-regen-muted">Who it serves</h2>
              <p class="mt-1 font-inter text-[15px] leading-relaxed text-regen-ink-soft">{{ resource.serves }}</p>
            </div>

            <!-- Ways to participate (only what this listing offers) -->
            <div v-if="participateList.length" class="mt-5">
              <h2 class="font-inter text-[12px] font-semibold uppercase tracking-[0.08em] text-regen-muted">Ways to participate</h2>
              <div class="mt-2 flex flex-wrap gap-2">
                <span v-for="p in participateList" :key="p.key" class="inline-flex items-center gap-1.5 rounded-full border border-regen-line bg-regen-surface px-3 py-1.5 font-inter text-sm font-semibold text-regen-ink">
                  <i class="fa-solid" :class="p.icon" aria-hidden="true"></i>{{ p.label }}
                </span>
              </div>
            </div>

            <!-- Hours -->
            <div v-if="resource.hours" class="mt-5">
              <h2 class="font-inter text-[12px] font-semibold uppercase tracking-[0.08em] text-regen-muted">Hours</h2>
              <p class="mt-1 font-inter text-[15px] text-regen-ink-soft"><i class="fa-regular fa-clock mr-1.5" aria-hidden="true"></i>{{ resource.hours }}</p>
            </div>

            <!-- Scenario tags + disclaimer -->
            <div v-if="resource.scenarioTags.length" class="mt-5">
              <h2 class="font-inter text-[12px] font-semibold uppercase tracking-[0.08em] text-regen-muted">May be relevant during</h2>
              <div class="mt-2 flex flex-wrap gap-2">
                <span v-for="s in scenarioList" :key="s.key" class="inline-flex items-center gap-1.5 rounded-full bg-regen-clay/10 px-3 py-1.5 font-inter text-sm font-semibold text-regen-clay-dark">
                  <i class="fa-solid" :class="s.icon" aria-hidden="true"></i>{{ s.label }}
                </span>
              </div>
              <p class="mt-2 font-inter text-[13px] leading-relaxed text-regen-muted">{{ scenarioDisclaimer }}</p>
            </div>

            <!-- Upcoming work parties (Phase 2B) — real events only, never invented -->
            <div class="rm-reveal mt-6">
              <h2 class="font-inter text-[12px] font-semibold uppercase tracking-[0.08em] text-regen-muted">Upcoming work parties &amp; events</h2>
              <div v-if="loadingEvents" class="mt-2 h-16 animate-pulse rounded-xl bg-regen-line/40"></div>
              <ul v-else-if="events.length" class="mt-2 space-y-2">
                <li v-for="e in events" :key="e.id" class="flex items-center justify-between gap-3 rounded-xl border border-regen-line bg-regen-surface p-3">
                  <div>
                    <p class="font-inter text-sm font-semibold text-regen-ink">{{ e.title || e.name || 'Work party' }}</p>
                    <p class="font-inter text-xs text-regen-muted">{{ formatDate(e.date_start || e.start || e.date) }}</p>
                  </div>
                  <RouterLink :to="`/d/${e.id}`" class="shrink-0 rounded-xl bg-regen-moss px-3 py-1.5 font-inter text-sm font-semibold text-white hover:bg-regen-moss-dark">View &amp; RSVP</RouterLink>
                </li>
              </ul>
              <p v-else class="mt-2 font-inter text-[15px] text-regen-ink-soft">
                No work party listed yet —
                <RouterLink :to="`/regeneration/suggest?correct=${resource.slug}`" class="font-semibold text-regen-moss hover:underline">suggest one</RouterLink>.
              </p>
            </div>

            <!-- Garden link where this is also a Garden Steward garden -->
            <RouterLink v-if="resource.gardenSlug" :to="`/gardens/${resource.gardenSlug}`" class="mt-5 inline-flex items-center gap-2 font-inter text-sm font-semibold text-regen-moss hover:underline">
              <i class="fa-solid fa-seedling" aria-hidden="true"></i> View this garden in Garden Steward
            </RouterLink>
          </div>

          <!-- Sidebar: map + trust + actions -->
          <aside class="space-y-4">
            <!-- Decorative location preview; the neighbourhood is in text above.
                 `inert` hides it from assistive tech AND removes Leaflet's
                 focusable children from the tab order (aria-hidden alone can't
                 contain focusables). -->
            <div v-if="hasPin" inert class="overflow-hidden rounded-2xl border border-regen-line">
              <div class="h-48">
                <StaticPinMap :latitude="resource.latitude" :longitude="resource.longitude" :zoom="resource.isPrivate ? 13 : 15" />
              </div>
            </div>

            <!-- Trust block (brief §1/§4) -->
            <div class="rounded-2xl border border-regen-line bg-regen-surface p-4">
              <h2 class="font-inter text-[12px] font-semibold uppercase tracking-[0.08em] text-regen-muted">Trust &amp; provenance</h2>
              <p class="mt-2 font-inter text-sm text-regen-ink-soft">{{ source.note }}</p>
              <p class="mt-2 font-inter text-sm text-regen-ink-soft">
                <i class="fa-regular fa-circle-check mr-1.5 text-regen-moss" aria-hidden="true"></i>{{ source.label }}
              </p>
              <p class="mt-1 font-inter text-sm" :class="stale ? 'text-regen-warning' : 'text-regen-ink-soft'">
                <i class="fa-regular fa-clock mr-1.5" aria-hidden="true"></i>Last checked {{ lastChecked }}<span v-if="stale"> · may be out of date</span>
              </p>
              <a v-if="resource.sourceUrl" :href="resource.sourceUrl" target="_blank" rel="noopener noreferrer" class="mt-2 inline-flex items-center gap-1.5 font-inter text-sm font-semibold text-regen-moss hover:underline">
                <i class="fa-solid fa-link" aria-hidden="true"></i> View source
              </a>
            </div>

            <!-- Actions -->
            <div class="space-y-2">
              <a v-if="resource.contactUrl" :href="resource.contactUrl" target="_blank" rel="noopener noreferrer" class="flex w-full items-center justify-center gap-2 rounded-xl bg-regen-moss px-4 py-3 font-inter text-sm font-semibold text-white transition hover:bg-regen-moss-dark">
                <i class="fa-solid fa-envelope" aria-hidden="true"></i> Get in touch
              </a>
              <RouterLink :to="`/regeneration/suggest?correct=${resource.slug}`" class="flex w-full items-center justify-center gap-2 rounded-xl border border-regen-line bg-regen-surface px-4 py-3 font-inter text-sm font-semibold text-regen-ink transition hover:border-regen-moss">
                <i class="fa-solid fa-pen" aria-hidden="true"></i> Suggest a correction
              </RouterLink>
              <RouterLink :to="`/regeneration/suggest?report=${resource.slug}`" class="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-inter text-sm font-semibold text-regen-muted transition hover:text-regen-danger">
                <i class="fa-solid fa-flag" aria-hidden="true"></i> Report this listing
              </RouterLink>
              <RouterLink :to="`/regeneration/${resource.slug}/manage`" class="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-inter text-sm font-semibold text-regen-moss transition hover:underline">
                <i class="fa-solid fa-hand" aria-hidden="true"></i> {{ resource.stewardClaimed ? 'Manage this listing' : 'Claim this listing' }}
              </RouterLink>
            </div>
          </aside>
        </div>

        <div class="rm-reveal mt-8 border-t border-regen-line pt-6">
          <NewsletterSignup heading="Get updates on places like this" />
        </div>
      </article>
    </div>

    <CtaBand />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useTitle } from '@vueuse/core';
import { setMetaDescription, setJsonLd, clearJsonLd, listingJsonLd } from '@/helpers/seo';
import { useReveal } from '@/composables/useReveal';
import { useResourcesStore, useEventStore } from '@/stores';
import PageHeader from '@/components/PageHeader.vue';
import CtaBand from '@/components/CtaBand.vue';
import StatusBadge from '@/components/regen/StatusBadge.vue';
import StaticPinMap from '@/components/StaticPinMap.vue';
import NewsletterSignup from '@/components/regen/NewsletterSignup.vue';
import {
  typeLabel as labelFor, sourceMeta,
  PARTICIPATE, SCENARIOS, SCENARIO_DISCLAIMER, daysSince, STALE_DAYS,
} from '@/_config/RegenConfig';

const route = useRoute();
const store = useResourcesStore();
const eventStore = useEventStore();

const { scan } = useReveal();
const resource = computed(() => store.bySlug(route.params.slug));
const events = ref([]);
const loadingEvents = ref(false);

function formatDate(d) {
  if (!d) return 'Date to be confirmed';
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? String(d) : dt.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

// Load real upcoming events for this project's garden (never invented).
async function loadEvents(gardenSlug) {
  events.value = [];
  if (!gardenSlug) return;
  loadingEvents.value = true;
  try {
    const res = await eventStore.getByGarden(gardenSlug);
    const rows = Array.isArray(res?.days) ? res.days : Array.isArray(res) ? res : [];
    events.value = rows.slice(0, 3);
  } catch {
    events.value = [];
  } finally {
    loadingEvents.value = false;
  }
}
const typeLabel = computed(() => labelFor(resource.value?.type));
const source = computed(() => sourceMeta(resource.value?.sourceType));
const scenarioDisclaimer = SCENARIO_DISCLAIMER;

const participateList = computed(() =>
  (resource.value?.participate || []).map((key) => ({ key, ...PARTICIPATE[key] })).filter((p) => p.label)
);
const scenarioList = computed(() =>
  (resource.value?.scenarioTags || []).map((key) => ({ key, ...SCENARIOS[key] })).filter((s) => s.label)
);
const hasPin = computed(() => resource.value?.latitude != null && resource.value?.longitude != null);
const stale = computed(() => daysSince(resource.value?.lastChecked) > STALE_DAYS);
const lastChecked = computed(() => {
  if (!resource.value?.lastChecked) return 'not yet';
  return new Date(resource.value.lastChecked).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
});

const title = useTitle();
watch(resource, (r) => {
  if (r) {
    title.value = `${r.name} — East Bay Regeneration Map`;
    setMetaDescription(`${r.name} in ${r.neighbourhood || r.city || 'the East Bay'}: ${r.shortDescription || r.description || ''}`.trim());
    setJsonLd('ld-listing', listingJsonLd(r, window.location.href));
    loadEvents(r.gardenSlug);
    nextTick(scan); // reveal sections once the (async) listing has rendered
  } else {
    title.value = 'Listing — East Bay Regeneration Map';
  }
}, { immediate: true });

onMounted(() => {
  if (!store.resources.length) store.fetchAll();
});
onUnmounted(() => clearJsonLd('ld-listing'));
</script>
