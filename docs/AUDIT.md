# AUDIT — East Bay Regeneration Map (garden-vue-hack + steward-bank-hack)

_Written before feature code, per the brief's 30-minute audit checkpoint. Covers both working repos._

## What already exists and is REUSABLE (build on these, do not reinvent)

### Frontend (garden-vue-hack) — Vue 3 Composition API + Vite 8 + Pinia + Vue Router 4 + Tailwind 3
- **Leaflet map** — `src/components/LeafletMap.vue` (multi-pin, OSM tiles, `L.divIcon` from inline `Pin.svg`, per-pin tooltip/popup, emits `select-location`; consumes `{latitude, longitude, label, …}`). Also `StaticPinMap.vue` (read-only detail pin) and `LocationPicker.vue` (drag-to-place). **No clustering, no second map lib** — reuse and extend, never add another.
- **HTTP layer** — `src/helpers/fetch-wrapper.js` (native fetch, injects `Authorization: Bearer` only for `VITE_API_URL` origins, normalizes Strapi errors, auto-logout on 401/403) and `src/helpers/strapi.js` (`stripReadOnly`, `relationKey`; v5 responses are **flat** — `res.data`, relations already de-nested, no `.attributes`).
- **Store pattern** — every store is `defineStore({ id, state, getters, actions })` with `baseUrl = \`${import.meta.env.VITE_API_URL}/api/<collection>\``. Closest model for the map layer: `src/stores/location-tracking.store.js` (lat/lng points, built-in `haversineDistance`, media→thumbnail mapping, `fetchByGarden(lat,lng,radiusKm)`).
- **List + filter UI** — `src/views/GardensPublicView.vue` (sticky filter chips, "Near me" geolocation + haversine sort, badges). Template for the companion list.
- **Moderation workflow** — `src/components/ProjectDecisionBar.vue` (Approve / Request changes / Deny + reason) + `ProjectReviewDrawer.vue` + the `review_status` helpers in `src/_config/GardenConfig.js` (`isProjectPubliclyVisible`, `normalizeReviewStatus`, badge-class helpers). Template for the volunteer moderation queue.
- **Toasts** — `src/components/Alert.vue` + `src/stores/alert.store.js` (danger/success, auto-dismiss). Mounted in `App.vue`.
- **Forms** — `src/components/form/*` (`TextInput`, `DropDown`, `Switch`, `ImageUpload`, …). Mostly hand-rolled `ref` state; Vee-Validate/Yup only in auth forms (not the house pattern).
- **Modals/drawers** — `src/components/modals/*` via `<Teleport to="#modals">` (target in `App.vue`). `PageHeader.vue` for eyebrow/title.
- **Privacy** — `src/helpers/location-privacy.js` (`approximateCenter`, `APPROX_AREA_RADIUS_M`) — show neighbourhood-level circle instead of an exact pin for private sites.
- **Auth** — `src/stores/auth.store.js` (JWT + Google OAuth + SMS login, `isLoggedIn`, `isAdmin`, modal login). Router guard in `src/helpers/router.js` auto-opens `LoginModal` for `meta:{requiresAuth:true}` / `/manage/*`.
- **Routing** — `createWebHistory`; add new routes to the public block AND the `publicPages` array.
- **Tailwind tokens** — brand greens (`#8aa37c`, `#376451`), `forest.*` dark ramp, `custom-light #f7f1e3`, `dark-orange #C2410C`; `darkMode:'class'`; a `safelist` already whitelists dynamic `bg-*` classes (useful for map-pin/legend colors).

### Backend (steward-bank-hack) — Strapi 5.36.0 on PostgreSQL
- **`Project` content type is map-ready AND publicly readable** — `src/api/project/content-types/project/schema.json` has `title, slug, short_description, description, category, latitude, longitude, location_city, location_zip, hero_image, featured_gallery, featured, review_status, garden`. Public via `GET /api/projects`, `GET /api/projects/:id`, `GET /api/projects/garden/:slug`. **This is the map's primary data source.**
- **CORS** — `config/middlewares.js` uses bare `strapi::cors` → Strapi 5 default `origin:'*'`. `http://localhost:3030` is already allowed.
- **Email = Resend** — `src/providers/email-resend`; the `project-alert` service (`src/api/project-alert/services/project-alert.js`) already does batch send + opt-in signup (`POST /project-alerts`) + tokenized unsubscribe. Reuse this for the newsletter (deferred).
- **Moderation primitive** — `Project.review_status` + custom `PUT /projects/:id/review` already model an approve/deny flow.

## What is MISSING for a public regeneration map
- A rich "resource" shape: `resource_type` taxonomy, `neighbourhood`, `serves`, `participate[]`, `source`/`source_type`, `last_checked`, `is_private_location`, `scenario_tags[]`, `steward_claimed`, map `status` lifecycle. (Being added as optional fields on `Project` — non-breaking.)
- A public map route (`/map` is taken by "Pollinator Pathways" → using **`/regeneration`**).
- Clustering on `LeafletMap.vue` — not needed at ~20 pins (skipped).
- No `data/` dir / committed JSON, and **no committed `.env`** — frontend `.env` with `VITE_API_URL` created this pass.

## What we are deliberately NOT touching
- SMS/Twilio, weather, tasks, recurring-event, blog, and the existing garden/event/volunteer-day flows in both repos.
- The existing `/map` (Pollinator Pathways), `GardensPublicView`, `ProjectsPublicView` views — reused as reference, not modified.
- Backend auth, Google OAuth, upload (beyond the local-provider dev fallback already applied).
- No new map library, no Next/Astro/React, no second CSS framework, no new mail provider.
