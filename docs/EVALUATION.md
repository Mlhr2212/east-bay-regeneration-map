# Tool evaluation — which mapping product, and is it ready for adoption?

The problem statement warns: _"confirm which product is being discussed before
treating anything as the mapping MVP or assuming it is ready for adoption."_
This file records that evaluation. It is separate from `AUDIT.md` (which audits
the garden-vue codebase we build on).

## What we could actually open

| Tool | Could we open it? | Evidence basis |
|------|-------------------|----------------|
| `garden-vue-hack` (the built-on app) | **Yes** — cloned, run, built, extended | First-hand: ran `npm run dev`/`build`, read the stores, routes, Leaflet components |
| Lovable MVP (named in the Mapping Project V2 brief) | **No** — the V2 brief and its link were not present in either repo and were not provided | Cannot evaluate first-hand; not guessing its features |
| Oakland Resilience Map (reference in the brief) | **No** — no link available in the provided materials | Cannot evaluate first-hand |

**Honesty note:** because the Lovable MVP and the Oakland Resilience Map could
not be opened, their rows below state only what the problem statement implies
about them, clearly marked as such — their actual features are **not** described
or assumed, and neither is treated as "the mapping MVP" by default.

## garden-vue-hack (evaluated first-hand)

- **What it does:** Vue 3 + Vite + Pinia + Vue Router + Tailwind + Leaflet app
  with gardens, projects, volunteer days/events with RSVP, tasks, blog, auth
  (JWT + Google + SMS), and an existing Leaflet map. We extended it with the
  public Regeneration Map (discover/detail/suggest/moderate/steward/newsletter/
  replicate + the Phase 2 awareness and volunteer layers).
- **What it does not do out of the box:** a public, trust-aware resource map
  with moderation and replication — that's what this build adds.
- **Who can maintain it:** a non-technical volunteer can maintain the *data*
  (one JSON file, or the moderation queue) without code. Code changes need a
  developer, but day-to-day upkeep does not.
- **Cost:** open-source (MIT). Frontend hosts free on Vercel/Netlify/Firebase.
  Backend (Strapi + Postgres) is optional; the map works from the JSON fallback
  with no backend at all. No map-tile cost (OpenStreetMap/Leaflet).
- **Ready for adoption?** Yes as the mapping MVP for this build — it runs, it's
  replicable from GitHub, and the community controls the data.

## Lovable MVP (could not open)

- Named in the Mapping Project V2 brief, which was not provided. **Features not
  described here — not guessed.**
- What the problem statement and v5 §7 imply as a general Lovable trade-off: a
  no-code builder is easier for a non-technical editor to restyle, but trades
  away free replication (proprietary builder), ongoing subscription cost, and
  full data control. This is a general property of such builders, **not** a
  claim about this specific MVP's current state.

## Oakland Resilience Map (could not open)

- Referenced in the brief; no openable link was available. **Features not
  described here — not guessed.** If a link is provided, evaluate it the same
  way (what it does, who maintains it, cost, adoption-readiness) before treating
  it as a source or a model.

## Decision

**The mapping MVP for this project is the garden-vue extension described in v5 +
the v6 addendum — NOT the Lovable MVP**, because:

1. it extends an existing open app the Guild's partners already use;
2. it is replicable from GitHub by any community, at no licence cost;
3. the community keeps full control of the data (JSON + human moderation).

**What would change this decision:** if the Lovable MVP (once openable) already
provides community-controlled moderation, free replication, and data ownership
that volunteers can maintain, connecting to or adopting it should be
re-evaluated on evidence. Until someone can open it and confirm that, it is not
treated as the mapping MVP.
