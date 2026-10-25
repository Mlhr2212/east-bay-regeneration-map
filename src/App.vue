<script setup>
import { computed } from 'vue';
import { Nav, Alert } from '@/components';
import { LoginModal } from '@/components/modals';
import { useAuthStore } from '@/stores';
import Footer from '@/components/Footer.vue';
import { RouterView, useRoute } from 'vue-router';
import '@fortawesome/fontawesome-free/css/all.css'

const auth = useAuthStore();
// The stored user is a login-time snapshot; pick up the current role (e.g. Administrator).
auth.refreshRole();

const route = useRoute();
// Public pages sit on the home page's cream canvas; /manage keeps its own styling.
const isPublic = computed(() => !route.path.startsWith('/manage'));
</script>

<template>
    <div class="app-container" :class="{ 'is-public': isPublic }">
        <a href="#main-content" class="skip-link">Skip to main content</a>
        <Nav />
        <Alert />
        <LoginModal v-if="auth.loginModalOpen" />
        <main id="main-content" tabindex="-1" class="container px-0 pb-4 md:px-4 md:pt-4 pt-[5px]">
            <RouterView />
        </main>
        <Footer />
    </div>
</template>

<style>
@import '@/assets/base.css';

.app-container {
    position: relative;
    z-index: 1;
}

/* Cream canvas + no sage strip under the nav on public pages. */
.app-container.is-public {
    background: #f7f1e3;
}

.app-container.is-public > main {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
}

.app-container.is-public > .footer-container {
    margin-top: 0;
}

.container {
    overflow: visible;
    position: relative;
    z-index: 1;
}

main#main-content:focus {
    outline: none; /* the target of the skip link; no ring needed on the region itself */
}

/* Skip link: first focusable element, hidden until focused (WCAG 2.4.1). */
.skip-link {
    position: absolute;
    left: 12px;
    top: -48px;
    z-index: 1000;
    padding: 10px 16px;
    border-radius: 10px;
    background: #2D5A3D;
    color: #fff;
    font-weight: 600;
    text-decoration: none;
    transition: top 160ms cubic-bezier(0.22, 1, 0.36, 1);
}
.skip-link:focus {
    top: 12px;
    outline: 3px solid #1C2A21;
    outline-offset: 2px;
}
@media (prefers-reduced-motion: reduce) {
    .skip-link { transition: none; }
}

/* Global visible focus safety-net: nothing interactive is left without a ring,
   even after the polish pass. Scoped to keyboard focus so it doesn't show on click. */
a:focus-visible,
button:focus-visible,
[role="button"]:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible,
summary:focus-visible,
[tabindex]:focus-visible {
    outline: 3px solid #2D5A3D;
    outline-offset: 2px;
    border-radius: 4px;
}
</style>