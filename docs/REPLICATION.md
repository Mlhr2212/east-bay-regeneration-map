# Replicate this map for your community (Flow 7)

The East Bay Regeneration Map is open by design: a Vue + Vite single-page app
with its listings in a plain JSON file and (optionally) a Strapi backend. Any
community can stand up its own map without a developer on retainer, without a
proprietary builder, and without losing control of its data.

Three steps: **fork, edit, deploy.**

## 1. Fork it on GitHub

Fork <https://github.com/Garden-Steward/garden-vue-hack>. You now own a complete
copy — code and data.

## 2. Edit the data file

Listings live in [`src/data/resources.json`](../src/data/resources.json) — an
array of resource objects. Each looks like:

```json
{
  "title": "Fruitvale Community Garden",
  "slug": "fruitvale-community-garden",
  "resource_type": "community-garden",
  "neighbourhood": "Fruitvale",
  "location_city": "Oakland",
  "region": "east-bay",
  "latitude": 37.7749,
  "longitude": -122.2241,
  "map_status": "active",
  "serves": "Neighbours growing food; open work days for all ages.",
  "participate": ["visit", "volunteer", "learn"],
  "hours": "Work days Saturdays 10am–1pm",
  "source_type": "community",
  "last_checked": "2026-10-10",
  "is_private_location": false,
  "scenario_tags": ["extreme-heat"],
  "short_description": "…",
  "description": "…"
}
```

Rules that keep the map trustworthy and safe — follow them:

- **Public / consented information only.** Never put a private home address, a
  personal phone, or a personal email in a listing.
- **Private locations:** set `"is_private_location": true` and give only a
  `neighbourhood`. Coordinates are coarsened to ~1 km so the exact spot is never
  exposed — do not paste exact private coordinates into this file.
- **Be honest about provenance.** `source_type` is `verified` (checked against a
  public source — include `source_url`), `community` (sample / community-
  submitted, not independently verified), or `crawl-candidate` (never published
  without human review).
- **Keep `last_checked` current.** Listings older than 90 days surface in the
  stale view for a volunteer to re-check.

### Rename the region

Every listing has a `region` field (default `east-bay`). To run a chapter
elsewhere, set your own region slug on your listings — it's a data change, not a
rebuild.

### Optional: use the backend

If you run the Strapi backend (`steward-bank-hack`), set `VITE_API_URL` and the
app loads listings live from `GET /api/projects/map` (which coarsens private
coordinates server-side). With no backend, it falls back to `resources.json`, so
the map always works.

## 3. Deploy

The repo is a plain Vite SPA — host it anywhere static.

**Vercel (recommended):**
- Framework preset: **Vite**
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`
- Node version: **22**
- Add `vercel.json` (already in the repo) so client-side routes refresh without
  a 404.
- Set `VITE_API_URL` **before** building if you use the backend; leave it unset
  to use the JSON fallback.

**Netlify:** run `npm run build` and drop the `dist/` folder — no code change.
Add the same SPA redirect (`/* /index.html 200`).

**Firebase Hosting:** the repo keeps its existing Firebase config and GitHub
Actions workflow as a secondary option.

Do **not** run the repo's `npm run deploy` script on Vercel — that script is
`vite build && firebase deploy` and is Firebase-specific.

---

That's it. Fork, edit `resources.json`, deploy. The community keeps it current
through the suggest form and the volunteer moderation queue — no developer
required.
