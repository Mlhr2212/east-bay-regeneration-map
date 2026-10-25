<script setup>
// Closing call-to-action band, mirroring the home "Our Mission" band: dark
// forest background, cream serif heading, cream primary button + cream-outline
// secondary. Sits at the bottom of public pages before the footer.
defineProps({
  label: { type: String, default: 'Get involved' },
  heading: { type: String, default: 'Find your way in.' },
  text: { type: String, default: 'Pick one place, show up once, and see if it fits.' },
  primary: { type: Object, default: () => ({ to: '/regeneration', label: 'Explore the map' }) },
  secondary: { type: Object, default: () => ({ to: '/regeneration/volunteer', label: 'My next step' }) },
});
</script>

<template>
  <section class="cta-band">
    <div class="cta-band-wrap">
      <p class="cta-band-eyebrow">{{ label }}</p>
      <h2 class="cta-band-heading">{{ heading }}</h2>
      <p class="cta-band-text">{{ text }}</p>
      <div class="cta-band-actions">
        <RouterLink :to="primary.to" class="cta-band-btn cta-band-primary">{{ primary.label }}</RouterLink>
        <RouterLink v-if="secondary" :to="secondary.to" class="cta-band-btn cta-band-secondary">{{ secondary.label }}</RouterLink>
      </div>
    </div>
  </section>
</template>

<style>
.cta-band {
  margin-top: 64px;
  padding: 64px 0;
  background:
    radial-gradient(700px 300px at 12% 110%, rgba(247, 241, 227, 0.07), transparent 60%),
    #344a34;
  font-family: Inter, Roboto, system-ui, sans-serif;
}

.cta-band-wrap {
  box-sizing: border-box;
  margin: 0 auto;
  max-width: 900px;
  padding: 0 24px;
  text-align: center;
}

.cta-band-eyebrow {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #c5d4b8;
}

.cta-band-heading {
  margin: 10px 0 0;
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 700;
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
  line-height: 1.15;
  color: #f7f1e3;
}

.cta-band-text {
  margin: 12px auto 0;
  max-width: 44ch;
  font-size: 1.0625rem;
  line-height: 1.6;
  color: #d9e2cf;
}

.cta-band-actions {
  margin-top: 28px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.cta-band-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 12px;
  padding: 10px 20px;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.cta-band-primary {
  background: #f7f1e3;
  color: #1C2A21;
}

.cta-band-primary:hover {
  background: #ece4d2;
}

.cta-band-secondary {
  border: 1px solid rgba(247, 241, 227, 0.5);
  color: #f7f1e3;
}

.cta-band-secondary:hover {
  border-color: #f7f1e3;
  background: rgba(255, 255, 255, 0.08);
}

/* Cream ring — the global moss ring would disappear on the dark band. */
.cta-band a:focus-visible,
.cta-band button:focus-visible {
  outline-color: #f7f1e3;
}

@media (max-width: 720px) {
  .cta-band {
    margin-top: 40px;
    padding: 44px 0;
  }
}
</style>
