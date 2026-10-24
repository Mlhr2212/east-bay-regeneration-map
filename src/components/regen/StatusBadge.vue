<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-inter font-semibold"
    :style="{ color: meta.fg, backgroundColor: meta.bg }"
  >
    <span class="h-2 w-2 rounded-full" :style="{ backgroundColor: meta.dot }" aria-hidden="true"></span>
    {{ meta.label }}
  </span>
</template>

<script setup>
import { computed } from 'vue';
import { statusMeta } from '@/_config/RegenConfig';

const props = defineProps({ status: { type: String, default: 'active' } });
const meta = computed(() => statusMeta(props.status));
</script>
