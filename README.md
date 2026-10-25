# Garden Steward

A community-driven, open-source Vue.js application for managing volunteer events, watering schedules, and harvest coordination in communal gardens. Since 2022, Garden Steward has partnered with the Oakland Urban Farming Project (OUFP) to foster urban agriculture through SMS-first software.

## About

Garden Steward is an SMS-based application designed to make it easier to create and manage publicly accessible gardens with abundant and foragable plants. The platform enables volunteers to coordinate tasks, manage events, and stay connected with their garden communities through SMS messaging.

## Features

- 🌱 **Garden Management**: Create and manage multiple garden projects
- 📅 **Event Coordination**: Organize volunteer days and track RSVPs
- 📱 **SMS Integration**: SMS-first approach for task management and communication
- 👥 **Volunteer Management**: Track volunteers, assign tasks, and manage schedules
- 📝 **Task Management**: Create, assign, and track garden tasks
- 📍 **Location Tracking**: Map and track garden locations
- 📰 **Blog System**: Share garden stories and updates
- 🗓️ **Week Scheduler**: Plan and schedule recurring garden activities

## Tech Stack

- **Frontend Framework**: Vue 3 (Composition API)
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: 
  - TipTap (rich text editor)
  - Leaflet (maps)
  - Vue DatePicker
  - Font Awesome
- **Form Validation**: Vee-Validate with Yup
- **Deployment**: Firebase Hosting

## Prerequisites

- Node.js 18+ (recommended)
- npm or yarn
- Firebase CLI (for deployment)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/garden-vue.git
cd garden-vue
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory:
```env
VITE_API_URL=your-steward-bank-api
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3030`

## Configuration

### Environment Variables

Create a `.env` file (or `.env.local` for local development) with the following variables:

- `VITE_API_URL`: The base URL for your backend API

Example:
```env
VITE_API_URL=http://localhost:1337
```

Note: `.env` files are excluded from version control for security.

### Firebase Configuration

The project is configured for Firebase Hosting. Update `firebase.json` with your Firebase project settings if needed.

## Available Scripts

- `npm run dev` - Start development server
- `npm run dev:prod` - Start development server in production mode
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run deploy` - Build and deploy to Firebase

## Project Structure

```
garden-vue/
├── src/
│   ├── components/      # Vue components
│   │   ├── auth/        # Authentication components
│   │   ├── form/        # Form components
│   │   └── modals/      # Modal components
│   ├── helpers/         # Utility functions and helpers
│   ├── stores/          # Pinia stores
│   ├── views/           # Page components
│   ├── assets/          # Static assets
│   ├── constants.js     # App constants
│   ├── main.js          # Application entry point
│   └── App.vue          # Root component
├── public/              # Static public files
├── dist/                # Build output (generated)
└── package.json         # Dependencies and scripts
```

## Development

### Authentication

The application uses JWT authentication with support for:
- Username/password login
- Google OAuth
- Password reset functionality

### State Management

State is managed using Pinia stores located in `src/stores/`. Each store handles a specific domain:
- `auth.store.js` - Authentication state
- `gardens.store.js` - Garden data
- `garden-task.store.js` - Task management
- `event.store.js` - Event management
- And more...

## Deployment

### Firebase Hosting

1. Build the project:
```bash
npm run build
```

2. Deploy to Firebase:
```bash
firebase deploy
```

Or use the automated deployment:
```bash
npm run deploy
```

### GitHub Actions

The project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) for automated deployment to Firebase Hosting when pushing to `main` or `production` branches.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For questions, feedback, or support, please contact:
- Email: volunteer@oufp.org
- Website: https://steward.garden

## Acknowledgments

- Built with Vue 3 and the Vue ecosystem
- Partnered with the Oakland Urban Farming Project (OUFP)
- Community-driven development

---

# East Bay Regeneration Map

A community-controlled map and relationship commons built on top of this Garden
Steward frontend for **Hack for Social Impact 2026** (Community Resilience
track), with the **East Bay Permaculture Guild**. It helps people discover local
regeneration projects — gardens, seed/tool libraries, community fridges,
pantries, mutual-aid, resilience hubs, community spaces, trainings — understand
who each serves and whether it's active, and get involved; and it gives Guild
volunteers a lightweight way to keep the map current so it doesn't rot into
abandoned pins.

Live at **`/regeneration`** (linked from the top nav as **Map**).

## What's included (the flows)

| Route | What it does |
|-------|--------------|
| `/regeneration` | Discover: split map + list, search, family/neighbourhood/participation/scenario filters, "near me", live count, legend |
| `/regeneration/:slug` | Listing detail: trust block (source, verification, last-checked), participation, scenario disclaimer, neighbourhood pin, claim/manage |
| `/regeneration/suggest` | Suggest / correct / report — goes to a moderation queue, never public immediately; blocks private addresses/phones |
| `/regeneration/moderate` | Volunteer queue: approve / edit & approve / reject, re-crawl candidate review, 90-day stale view, activity log |
| `/regeneration/:slug/manage` | Steward demo-claim then manage hours/description/status |
| `/regeneration/replicate` | Fork → edit `resources.json` → deploy (see `docs/REPLICATION.md`) |
| `/regeneration/newsletter` | Volunteer compose / preview / send (demo mode) / history; public opt-in signup on the map and listings |

## Run it locally

**Frontend (this repo, `garden-vue-hack`)** — Node 22:

```bash
npm install          # download dependencies
npm run dev          # http://localhost:3030
npm run build        # prebuild regenerates public/sitemap.xml, then vite build
```

With no backend, the map uses the bundled `src/data/resources.json` fallback, so
every flow is demoable offline.

**Backend (optional, `steward-bank-hack`)** — Strapi, separate repo:

```bash
npm install          # download dependencies (different step from seeding)
npm run seed         # populate the database, incl. the map listings
npm run develop      # http://localhost:1337, admin at /admin
```

Point the frontend at it with `VITE_API_URL=http://localhost:1337` (see
`.env.example`). The map then loads live from `GET /api/projects/map`, a
privacy-safe feed that coarsens private-location coordinates server-side.

## Deploy

- **Vercel (primary):** Framework **Vite**, build `npm run build`, output `dist`,
  install `npm install`, Node **22**. `vercel.json` rewrites all routes to
  `index.html` so deep links refresh without a 404. Set `VITE_API_URL` **before**
  building (Vite inlines env at build time), or leave it unset for the JSON
  fallback. Do **not** run `npm run deploy` on Vercel — that's `vite build &&
  firebase deploy`.
- **Netlify:** `npm run build`, drop `dist/`, add a `/* /index.html 200`
  redirect.
- **Firebase Hosting:** existing config + GitHub Actions workflow kept as a
  secondary option.

## Why not Lovable (tradeoffs)

A no-code builder like Lovable would be easier for a non-technical editor to
restyle, but it trades away the three things this project most needs: **free
replication** (the builder is proprietary), **no ongoing cost**, and **full data
control**. This build instead extends an existing open Vue app with its data in
a plain GitHub file, so any community can fork, edit, and host it themselves.

## Known limitations (honest)

- **Moderation is a local demo.** Approvals update the in-app dataset and the
  queue; in production an approval becomes a GitHub pull request / a Strapi
  `review_status` change. Not yet a live PR workflow.
- **Claiming is a demo claim** — no real identity verification ships this
  weekend. The UI says so.
- **Newsletter send is Demo mode** — no email provider is wired client-side, so
  "Send" records the send and exports the HTML for manual sending; it never
  emails anyone. Wiring the backend's Resend integration would make it real.
  Only opted-in subscribers are ever counted; emails are never shown publicly.
- **SEO metadata is client-rendered**, not server-prerendered: per-page titles,
  descriptions, and JSON-LD are populated by JS. `sitemap.xml`, `robots.txt`,
  `llms.txt`, and the crawlable listing routes exist; full prerendering is a
  follow-up.

## 2-minute demo script

1. **Maya (newcomer)** opens `/regeneration`, filters to _Share_ → finds a seed
   library near her neighbourhood in under a minute.
2. She switches on the **extreme-heat** scenario — relevant places show, with the
   "not an emergency service" disclaimer visible.
3. **Sam (fridge steward)** opens a listing, claims it (demo), updates hours and
   marks it inactive — under a minute, no developer.
4. **Jo (volunteer)** opens `/regeneration/moderate`, approves a community
   suggestion (old→new diff), and reviews an unverified re-crawl candidate.
5. **Newsletter:** a visitor signs up; Jo composes a newsletter featuring two map
   listings, previews it, and sends it — send mode stated honestly (Demo).
6. **Close:** "Anyone can replicate this — fork it on GitHub, edit the data,
   deploy. No developer required to keep it alive. Before this map, finding a way
   to help meant knowing someone who already knew. Now it means opening one map —
   and the community keeps it current."

---

## Phase 2 (v6 addendum) — awareness, volunteers, handover

Phase 2 adds three thin layers on top of the Phase 1 map (it does **not** build
a training platform, a marketing site, or a second app):

- **2A Awareness** (`/regeneration`): a warm, jargon-free band above the map —
  "new here" invitation, a plain-language "what is permaculture" (Guild to
  approve wording), three "why it matters today" cards linking to real filtered
  views, and three real first steps (Visit / Learn / Volunteer). The map stays
  the hero; filters are deep-linkable (`?family`, `?scenario`, `?participate`).
- **2B Returning volunteer**: listing pages show real upcoming work parties for
  the project's garden (reusing the existing Volunteer Day/event system — honest
  empty state, never invented). `/regeneration/volunteer` ("My next step") shows
  your next RSVP, a generic *draft* what-to-bring checklist, a private
  self-reported skill checklist, and communication preferences. Training/skill
  items carry a visible **Draft — needs expert review** badge by default.
- **2C Handover & honesty**: `/regeneration/about-this-demo` (working vs.
  prototype vs. ongoing effort/cost + a Guild handover checklist) and
  `docs/EVALUATION.md` (tool evaluation + the mapping-MVP decision).

### Phase 2 report

- **Shipped:** 2A, 2B, and 2C in full.
- **Cut for time:** none. Deliberately out of scope per the addendum: a full
  course/certification platform, automated skill assessment, chat, a volunteer
  CRM, and any auto-send/auto-publish.
- **Evaluation decision (one paragraph):** the mapping MVP for this project is
  the garden-vue extension (this repo), not the Lovable MVP. It extends an open
  app the Guild's partners already use, replicates from GitHub at no licence
  cost, and keeps data under community control. The Lovable MVP and the Oakland
  Resilience Map could not be opened (no links were provided), so their features
  are not guessed; if one is later shown to provide community-controlled
  moderation, free replication, and volunteer-maintainable data ownership, the
  decision should be re-evaluated on that evidence. See `docs/EVALUATION.md`.

### Honesty notes (grounding)

- The Guild's **workday SOP and V2 briefs were not provided**, so the
  what-to-bring content is a generic draft labelled for review — no SOP content
  was invented. See `docs/workday-sop-notes.md`.
- Volunteer names, emails, phones, and skill self-reports are **never** shown on
  public pages, listings, structured data, or screenshots.

### Post-hackathon, in order

1. Guild approves the explainer wording ("what is permaculture").
2. Guild reviews the training/what-to-bring template and provides the real
   **workday SOP and V2 briefs**; reviewed items flip to "Guild-reviewed".
3. Guild confirms the mapping-MVP decision (garden-vue vs. Lovable) once the
   Lovable MVP can actually be opened and evaluated.
4. Name a non-technical moderator and run the weekly ~15-minute workflow
   (moderation + monthly stale/re-crawl) for one month.
5. Decide on a deployed backend (Fly.io + Postgres) vs. JSON-only maintenance.
