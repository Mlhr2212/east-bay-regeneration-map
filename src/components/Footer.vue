<script setup>
</script>

<template>
  <footer class="footer-container">
    <div class="text-center mt-4">
      <p>
        <img 
          src="https://storage.googleapis.com/steward_upload/uploads/garden_steward_logo_green_sq_350_75514db053/garden_steward_logo_green_sq_350_75514db053.jpg" 
          class="navbar-brand mx-auto h-16" 
          alt="Garden Steward Logo"
        >
      </p>
    </div>

    <nav class="footer-nav" aria-label="Footer">
      <div class="footer-col">
        <h2 class="footer-heading">Explore</h2>
        <router-link to="/regeneration" class="footer-link">Map</router-link>
        <router-link to="/events" class="footer-link">Events</router-link>
        <router-link to="/gardens" class="footer-link">Gardens</router-link>
        <router-link to="/projects" class="footer-link">Projects</router-link>
      </div>
      <div class="footer-col">
        <h2 class="footer-heading">Get involved</h2>
        <router-link to="/regeneration/suggest" class="footer-link">Suggest a place</router-link>
        <router-link to="/regeneration/volunteer" class="footer-link">My next step</router-link>
        <router-link to="/regeneration/newsletter" class="footer-link">Newsletter</router-link>
      </div>
      <div class="footer-col">
        <h2 class="footer-heading">About</h2>
        <router-link to="/about" class="footer-link">About</router-link>
        <router-link to="/help" class="footer-link">Help</router-link>
        <router-link to="/privacy" class="footer-link">Privacy</router-link>
        <router-link to="/contribute" class="footer-link">Contribute</router-link>
      </div>
    </nav>

    <div class="text-center mt-4">
      <p>
        <router-link
          to="/contribute"
          class="contribute-link"
        >
          <span class="contribute-text">Open Source For Good! Contribute</span>
          <i class="fab fa-github ml-2" aria-hidden="true"></i>
        </router-link>
      </p>
      <p class="footer-copy">Garden Steward — open source community software.</p>
    </div>
  </footer>
</template>

<style scoped>
/* Muted sage — matches footer/center panel in branding (same in light + dark mode) */
.footer-container {
  --footer-sage: #8da382;
  margin-top: 2rem;
  padding: 1.75rem 1rem 2rem;
  width: 100%;
  box-sizing: border-box;
  background-color: var(--footer-sage);
}

.footer-nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem 4rem;
  max-width: 720px;
  margin: 1.25rem auto 0;
  text-align: left;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 140px;
}

.footer-heading {
  margin: 0 0 0.25rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #1C2A21; /* AA on the sage footer: 5.49:1 */
}

.footer-link {
  color: #1C2A21;
  font-size: 0.9375rem;
  text-decoration: none;
}

.footer-link:hover {
  text-decoration: underline;
}

.footer-copy {
  margin: 0.75rem 0 0;
  font-size: 0.8125rem;
  color: #1C2A21;
}

.contribute-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #1C2A21; /* AA on the sage footer (#8da382): 5.49:1, was white 3.2:1 */
  text-decoration: none;
  transition: color 0.2s ease, opacity 0.2s ease;
  margin-top: 1rem;
}

.contribute-link:hover {
  color: #163022; /* 5.20:1 on sage */
  text-decoration: underline;
}

.contribute-text {
  font-weight: 600;
}

.contribute-link i {
  font-size: 1.2em;
  color: inherit;
}

@media (max-width: 720px) {
  .footer-nav {
    flex-direction: column;
    gap: 1.25rem;
    align-items: center;
    text-align: center;
  }

  .footer-col {
    min-width: 0;
  }
}
</style>

<!--
  `:global()` with a trailing descendant selector does not survive scoped-style
  compilation: ":global(.dark) .foo" becomes the bare rule ".dark { ... }",
  which lands on <html class="dark"> and leaks inheritable declarations such as
  color and -webkit-text-fill-color into every page. Dark-mode overrides live
  here instead, in a plain (non-scoped) <style> block with a literal
  "html.dark ..." selector — the same pattern ProjectsList.vue uses.
-->
<style>
/* Explicit repeat so html.dark page styles never strip the footer band */
html.dark .footer-container {
  background-color: #8da382;
}
</style>
