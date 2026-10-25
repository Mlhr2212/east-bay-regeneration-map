<template>
  <div ref="mapEl" class="regen-map" role="application" aria-label="Map of regeneration resources"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import pinSvg from '@/components/icons/Pin.svg?raw';
import { typeColor } from '@/_config/RegenConfig';

const props = defineProps({
  // Mapped resources (see resources.store adapter). Private ones already carry
  // blurred coordinates, so the map never plots an exact private location.
  resources: { type: Array, default: () => [] },
  selectedSlug: { type: String, default: null },
});
const emit = defineEmits(['select']);

const mapEl = ref(null);
let map = null;
let markerLayer = null;
const markersBySlug = {};

// East Bay default view, used when there are no points to fit.
const DEFAULT_CENTER = [37.8044, -122.2712];

function pinIcon(resource, selected, i = 0) {
  const color = typeColor(resource.type);
  const scale = selected ? 1.35 : 1;
  // Outer wrapper does the staggered drop (opacity + translateY); inner span
  // keeps the selection scale. Neither touches the marker root's Leaflet
  // positioning transform. See motion.css.
  return L.divIcon({
    className: 'regen-pin',
    html: `<span class="rm-pin-drop-wrap" style="--rm-i:${i}"><span style="color:${color};display:inline-block;transition:transform var(--motion-fast,180ms) var(--ease-spring,ease-out);transform:scale(${scale});filter:drop-shadow(0 1px 1px rgba(28,42,33,0.35))">${pinSvg}</span></span>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -26],
  });
}

function renderMarkers() {
  if (!map) return;
  if (markerLayer) markerLayer.remove();
  markerLayer = L.layerGroup().addTo(map);
  Object.keys(markersBySlug).forEach((k) => delete markersBySlug[k]);

  const pts = [];
  let i = 0;
  props.resources.forEach((r) => {
    if (r.latitude == null || r.longitude == null) return;
    const marker = L.marker([r.latitude, r.longitude], {
      icon: pinIcon(r, r.slug === props.selectedSlug, i++),
      keyboard: true,
      title: r.name,
    })
      .bindTooltip(r.name)
      .on('click', () => emit('select', r));
    marker.addTo(markerLayer);
    markersBySlug[r.slug] = marker;
    pts.push([r.latitude, r.longitude]);
  });

  if (pts.length) {
    map.fitBounds(pts, { padding: [40, 40], maxZoom: 14 });
  } else {
    map.setView(DEFAULT_CENTER, 11);
  }
}

onMounted(() => {
  map = L.map(mapEl.value, { scrollWheelZoom: true }).setView(DEFAULT_CENTER, 11);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  renderMarkers();
});

onBeforeUnmount(() => {
  if (map) {
    map.remove();
    map = null;
  }
});

watch(() => props.resources, renderMarkers, { deep: false });

// Re-style + pan to the selected resource without rebuilding the whole layer.
watch(
  () => props.selectedSlug,
  (slug) => {
    // Update scale IN PLACE on the existing inner span so the CSS transform
    // transition springs smoothly — rebuilding the icon would replay the drop.
    Object.entries(markersBySlug).forEach(([s, m]) => {
      const inner = m.getElement()?.querySelector('.rm-pin-drop-wrap > span');
      if (inner) inner.style.transform = `scale(${s === slug ? 1.35 : 1})`;
    });
    const marker = slug && markersBySlug[slug];
    if (marker && map) {
      map.panTo(marker.getLatLng());
      marker.openPopup?.();
    }
  }
);
</script>

<style scoped>
.regen-map {
  width: 100%;
  height: 100%;
  min-height: 300px;
  z-index: 0;
}
</style>
