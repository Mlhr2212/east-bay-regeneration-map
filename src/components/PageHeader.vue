<script setup>
// The dark forest band public pages open with: small eyebrow, big cream serif
// title, optional one- or two-line intro in the default slot. `back` renders a
// "← back" link above the eyebrow; the `actions` slot sits top-right of the
// eyebrow line.
defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  // Match the width of the page's content below so the text lines up.
  width: { type: String, default: '960px' },
  // e.g. { to: '/regeneration', label: 'Back to the map' }
  back: { type: Object, default: null },
});
</script>

<template>
  <header class="page-head">
    <div class="page-head-wrap" :style="{ maxWidth: width }">
      <RouterLink v-if="back" :to="back.to" class="page-head-back">
        <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>{{ back.label }}
      </RouterLink>
      <div v-if="eyebrow || $slots.actions" class="page-head-toprow">
        <p v-if="eyebrow" class="page-head-eyebrow">{{ eyebrow }}</p>
        <div v-if="$slots.actions" class="page-head-actions"><slot name="actions" /></div>
      </div>
      <h1 class="page-head-title">{{ title }}</h1>
      <div v-if="$slots.default" class="page-head-sub"><slot /></div>
    </div>
  </header>
</template>

<style>
.page-head {
  padding: 64px 0 56px;
  background:
    radial-gradient(900px 380px at 88% -10%, rgba(247, 241, 227, 0.09), transparent 60%),
    linear-gradient(135deg, #2d3e26 0%, #2f5233 60%, #376451 100%);
  font-family: Roboto, system-ui, sans-serif;
}

/* Same band in dark mode — it is already dark. */
.dark .page-head {
  background:
    radial-gradient(900px 380px at 88% -10%, rgba(247, 241, 227, 0.09), transparent 60%),
    linear-gradient(135deg, #2d3e26 0%, #2f5233 60%, #376451 100%);
}

.page-head-wrap {
  box-sizing: border-box;
  margin: 0 auto;
  padding: 0 24px;
}

.page-head-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 18px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #f7f1e3;
  text-decoration: none;
}

.page-head-back:hover {
  text-decoration: underline;
}

.page-head-toprow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.page-head-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.page-head-eyebrow {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #c5d4b8;
}

.page-head-title {
  margin: 8px 0 0;
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 700;
  font-size: clamp(2rem, 4.5vw, 3rem);
  line-height: 1.1;
  color: #f7f1e3;
}

.page-head-sub {
  max-width: 56ch;
  margin-top: 10px;
  font-size: 1.0625rem;
  line-height: 1.6;
  color: #d9e2cf;
}

.page-head-sub p {
  margin: 0;
}

.page-head-sub a {
  color: #f7f1e3;
  text-decoration: underline;
}

/* Cream ring — the global moss ring would disappear on the dark band. */
.page-head a:focus-visible,
.page-head button:focus-visible {
  outline-color: #f7f1e3;
}

@media (max-width: 720px) {
  .page-head {
    padding: 40px 0 32px;
  }

  .page-head-wrap {
    padding: 0 16px;
  }
}
</style>
