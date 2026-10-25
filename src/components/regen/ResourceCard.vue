<template>
  <!-- Semantic card-link pattern: the title is a real RouterLink (keyboard-
       native, accessible name = the place's name), and a stretched ::after
       overlay makes the whole card clickable. No div-with-click-handler.
       @mouseenter/@focusin sync the matching map pin (selected highlight). -->
  <article
    class="rm-lift rm-press group relative flex flex-col gap-2 rounded-2xl border border-regen-line bg-regen-surface p-5 text-left hover:border-regen-moss focus-within:border-regen-moss focus-within:ring-2 focus-within:ring-regen-moss"
    :class="{ 'ring-2 ring-regen-moss bg-regen-moss/[0.03]': selected }"
    @mouseenter="$emit('highlight', resource)"
    @focusin="$emit('highlight', resource)"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="flex items-center gap-2">
        <span class="h-2.5 w-2.5 shrink-0 rounded-full" :style="{ backgroundColor: color }" aria-hidden="true"></span>
        <span class="font-inter text-[12px] font-semibold uppercase tracking-[0.08em] text-regen-muted">{{ typeLabel }}</span>
      </div>
      <StatusBadge :status="resource.status" />
    </div>

    <h3 class="font-fraunces text-[18px] font-600 leading-snug text-regen-ink group-hover:text-regen-moss">
      <RouterLink
        :to="`/regeneration/${resource.slug}`"
        class="rounded outline-none after:absolute after:inset-0 after:content-['']"
        @click="$emit('select', resource)"
      >{{ resource.name }}</RouterLink>
    </h3>

    <p class="font-inter text-sm text-regen-muted">
      <i class="fa-solid fa-location-dot mr-1" aria-hidden="true"></i>{{ resource.neighbourhood || resource.city }}<span v-if="resource.neighbourhood && resource.city">, {{ resource.city }}</span>
    </p>

    <p v-if="resource.shortDescription" class="font-inter text-[15px] leading-relaxed text-regen-ink-soft line-clamp-2">
      {{ resource.shortDescription }}
    </p>

    <div class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
      <span v-if="primaryAction" class="inline-flex items-center gap-1.5 font-inter text-sm font-semibold text-regen-moss">
        <i class="fa-solid" :class="primaryAction.icon" aria-hidden="true"></i>{{ primaryAction.label }}
      </span>
      <span class="font-inter text-xs text-regen-muted">· Last checked {{ lastChecked }}</span>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue';
import StatusBadge from './StatusBadge.vue';
import { typeLabel as labelFor, typeColor, PARTICIPATE } from '@/_config/RegenConfig';

const props = defineProps({
  resource: { type: Object, required: true },
  selected: { type: Boolean, default: false },
});
defineEmits(['select', 'highlight']);

const typeLabel = computed(() => labelFor(props.resource.type));
const color = computed(() => typeColor(props.resource.type));
const primaryAction = computed(() => {
  const first = (props.resource.participate || [])[0];
  return first ? PARTICIPATE[first] : null;
});
const lastChecked = computed(() => {
  if (!props.resource.lastChecked) return 'not yet';
  return new Date(props.resource.lastChecked).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
});
</script>
