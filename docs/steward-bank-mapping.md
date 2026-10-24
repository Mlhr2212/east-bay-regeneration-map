# Resource ↔ steward-bank mapping

How the Regeneration Map "resource" (frontend `resources` store, brief §5) maps to the
Strapi backend. **Primary source for this build: the `Project` content type**, extended with
optional map fields. Garden/Organization are documented as the production join target.

## Field map (Resource → backend)

| Resource field (§5)   | Backend source (`Project`)                        | Notes |
|-----------------------|---------------------------------------------------|-------|
| `id` (slug)           | `Project.slug`                                     | |
| `name`                | `Project.title`                                    | **`title`, not `name`** |
| `type`                | `Project.resource_type` (NEW enum)                 | falls back to `category` |
| `neighbourhood`       | `Project.neighbourhood` (NEW)                      | |
| `city`                | `Project.location_city`                            | existing |
| `region`              | `Project.region` (NEW, default `east-bay`)         | |
| `status`              | `Project.map_status` (NEW enum)                    | active / needs_verification / inactive |
| `description`         | `Project.short_description` / `description`        | existing |
| `serves`              | `Project.serves` (NEW)                             | |
| `participate[]`       | `Project.participate` (NEW json)                   | subset visit/volunteer/donate/learn/contact |
| `hours`               | `Project.hours` (NEW)                              | |
| `contact`             | `Project.contact_url` (NEW)                        | public URL only — never personal email/phone |
| `source`              | `Project.source_url` (NEW)                         | |
| `source_type`         | `Project.source_type` (NEW enum)                   | verified / community / crawl-candidate |
| `last_checked`        | `Project.last_checked` (NEW date)                  | stamped = today on approval |
| `is_private_location` | `Project.is_private_location` (NEW bool)           | true → neighbourhood only (`location-privacy.js`) |
| `scenario_tags[]`     | `Project.scenario_tags` (NEW json)                 | flooding/extreme-heat/wildfire/earthquake |
| `steward_claimed`     | `Project.steward_claimed` (NEW bool)               | |
| `latitude/longitude`  | `Project.latitude` / `Project.longitude`           | existing |
| `garden_id`           | `Project.garden` relation                          | link through to existing garden view |
| `created_at/updated_at` | Strapi `createdAt` / `updatedAt`                 | |

All NEW fields are **optional** → additive, non-breaking to existing project flows.

## Production path (not built this weekend)
- **Garden + Organization join**: `Resource ≈ Garden (title, slug, latitude, longitude, boundary, blurb, description) + Organization (title, url, logo)`. Garden has lat/lng + GeoJSON `boundary` but **no address/neighbourhood**; Organization has no geo. Neither is publicly readable today — a production import would (a) expose public `find`/`findOne` for them (via `scripts/seed-content-permissions*` or route-level `auth:false`), and (b) add a Strapi import script + steward verification.
- **Newsletter send**: reuse `project-alert` service (Resend batch + opt-in + tokenized unsubscribe) — do not add a new mail provider.
- **What it does NOT need**: no change to SMS/Twilio, tasks, weather, or the garden/event system.

## Moderation (this build)
Read path is live Strapi Projects. Suggestions/corrections go to the frontend `proposals` store
(kept separate from public listings, never auto-published) and are documented in-UI as
"in production this becomes a pull request / a `review_status` change on the Project."
