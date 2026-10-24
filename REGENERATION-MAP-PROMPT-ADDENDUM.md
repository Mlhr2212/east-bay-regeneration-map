# East Bay Regeneration Map — v6 Addendum to the v5 Claude Code Prompt

STATUS: ADDENDUM, NOT A RESTART.
- v5 is still the core build. Do NOT restart the build, do NOT rewrite
  the map, do NOT re-run the audit from scratch.
- Apply this addendum ONLY AFTER the v5 Phase 1 map passes its §10
  checklist (discover → detail → suggest → moderate → steward →
  newsletter → replicate, plus build + Vercel check).
- Time-box Phase 2 to 60–90 minutes. If the core map breaks, revert
  Phase 2 and ship Phase 1. If less than 2 hours remain before the
  demo, do ONLY Phase 2A + Phase 2C, and skip Phase 2B.
- Save this file in the frontend repo as
  REGENERATION-MAP-PROMPT-ADDENDUM.md and tell Claude Code:
  "Read REGENERATION-MAP-PROMPT-ADDENDUM.md and apply it as Phase 2,
  after Phase 1 is working. Do not break Phase 1."

## Why this addendum exists

The Guild's actual problem statement (received after v5 was written)
is WIDER than "build a map". It names three equally valid pathways
into the same challenge, and teams may focus on one or connect parts
of more than one:

1. Awareness and participation — the Guild struggles to explain
   permaculture's relevance, especially to younger audiences, and to
   turn that understanding into a clear invitation to join. This
   affects attendance, volunteer recruitment, and continuity.
2. Volunteer learning and retention — local-plant training takes
   time, churn and repeated onboarding burden organisers. Build a
   recruitment, training, and coordination system that helps
   volunteers build skills and return with less administration.
3. Discovery and mapping — people need clear ways to find nearby
   projects and understand how to participate. Improve the existing
   mapping app's navigation, participation information, and listing
   updates, while keeping it community-controlled and
   volunteer-friendly.

v5 builds pathway 3 very well, and touches pathway 1 only through
listing descriptions and the newsletter. It does NOT build pathway 2
at all, and it does NOT answer the Guild's own demo questions in full.
This addendum closes those gaps with thin, demoable layers ON TOP of
the map — not a second app, and not a full training platform.

## Gap audit — v5 vs. the actual problem statement

| Problem-statement requirement | v5 coverage | Gap |
|---|---|---|
| Awareness: explain permaculture relevance to people unfamiliar with it, especially younger audiences | Listing descriptions only; no explainer, no "why this matters today" | HIGH — a first-time visitor can find a pin but may not understand why permaculture matters or why they should join |
| Clear invitation to join, and a first way to get involved | "Find something near me" + participate actions on a listing | MEDIUM — no guided first-step journey (Visit / Learn / Volunteer) |
| Volunteer learning and retention: skills, return with less friction, less repeated onboarding | None. No skill checklist, no returning-volunteer view, no workday preparation | HIGH — the returning-volunteer demo question is unanswered |
| Use the existing workday SOP and V2 briefs (Volunteer/Event Management V2, Mapping Project V2) to ground the work | Audit is code-only; SOP/briefs are never mentioned | MEDIUM — work must be grounded in the Guild's real practices, not invented workflows |
| Evaluate existing tools before improving / connecting / replacing | Audit covers garden-vue code only; Lovable MVP and Oakland Resilience Map are mentioned as tradeoffs, never evaluated | MEDIUM — the problem statement explicitly says: confirm which product is being discussed before treating anything as the mapping MVP or assuming it is ready for adoption |
| Explain what is demonstrated vs. prototype, and what ongoing effort/cost it requires; favour handover organisers can realistically maintain | README + replication docs, but no explicit demo-vs-prototype page and no weekly organiser time estimate | MEDIUM — judges will ask this directly |
| Demo questions: (a) Does someone understand the value and know how to join? (b) Can a volunteer learn and return with less friction? (c) Can an organiser support that journey with less repeated work? | (c) is answered by moderation/stale views. (a) is partial. (b) is unanswered | HIGH for (b), MEDIUM for (a) |
| Preserve warm, community-rooted voice; people stay in control of outreach/publishing; respect communication preferences and consent; never expose private volunteer details or non-public locations | Newsletter consent + moderation control are covered; volunteer communication preferences are not; voice guidance is only in design tokens | LOW–MEDIUM — add consent/preference controls, do not add volunteer detail exposure |
| Training content must be reviewed by knowledgeable people, never treated as automatically correct | No training content exists yet, so nothing to review | LOW if Phase 2B labels training correctly; HIGH if anyone invents training content without a review flag |
| Mapping/preparedness must not imply guaranteed access or emergency-response capability | Already covered in v5 §1 — keep it, and extend the same rule to event/workday pages | No gap — do not regress this |

What v5 already gets RIGHT, and Phase 2 must NOT break:
community-controlled moderation, steward claim/manage, stale review,
re-crawl candidates human-reviewed only, GitHub replication, JSON
fallback, newsletter consent, no private data, no emergency claims,
warm design tokens, solo + subagent plan.

## The chosen scope — read this before building Phase 2

The problem statement says: choose a specific audience and journey,
address the questions relevant to that pathway, and do NOT promise
to solve everything. So Phase 2 does NOT build a full training
platform, a full marketing campaign, or a second app. It adds:

- ONE awareness landing layer on top of /map (Phase 2A)
- ONE returning-volunteer journey, reusing the existing Volunteer
  Day / event RSVP system, NOT rebuilding it (Phase 2B)
- ONE organiser handover + honesty page, plus a tool-evaluation
  record (Phase 2C)

If any Phase 2 feature threatens Phase 1, cut the Phase 2 feature.

## Phase 2A — Awareness and participation (DO FIRST)

Goal: a person who has never heard of permaculture understands, in
under 60 seconds, why it matters today and what their first step is.

Build, on the public home route (above / beside the map, not
replacing it):

1. Plain-language explainer, warm community-rooted voice, no jargon
   as the entry point. Three short blocks, in crawlable text:
   - "What is permaculture, in one sentence?" — working with nature,
     not against it, to grow food, share resources, and build
     neighbourhood resilience. Do NOT invent a Guild-approved
     definition if the Guild has not provided one — label this as
     a plain-language introduction, and note in the summary that
     the Guild should approve the exact wording.
   - "Why it matters today" — three concrete connections, each one
     sentence, tied to challenges younger audiences care about:
     food access and cost, extreme heat and flooding, and
     neighbourhood connection / mutual aid. Each connection links
     to a filtered map view (e.g. heat → extreme-heat scenario
     view, food → community gardens + fridges + pantries).
   - "Your first way in" — three guided first steps, each a real
     button to a real filtered view or form, never a dead button:
     Visit (a nearby garden / fridge / space this week),
     Learn (a potluck, workshop, or speaker event — see Phase 2B
     events), Volunteer (a work party with a clear task and a
     "what to bring" note).
2. Younger-audience invitation: short, direct, no lecture. Example
   tone (adapt, do not copy blindly): "New here? You don't need to
   know anything about permaculture to start. Pick one place, show
   up once, and see if it fits." The invitation must end in a
   concrete action (a filtered map, an event RSVP, a signup), never
   in a generic "learn more" dead end.
3. Keep the map as the hero action. The explainer is ABOVE the map
   on mobile (list-first still applies) and BESIDE / ABOVE it on
   desktop, but "Find something near me" remains the single primary
   action. Do not turn the home page into a marketing landing page
   that hides the map.
4. No auto-posting, no social-share automation, no email campaign
   automation in Phase 2. The newsletter (v5 Flow 8) is already the
   outreach channel, and it stays human-approved.

Acceptance: a first-time visitor can, in under 60 seconds, say what
permaculture is, why it matters, and click one first step that
actually works. Test this with the same 360px / 768px / 1280px checks
as v5.

## Phase 2B — Volunteer learning and retention (DO SECOND, THIN ONLY)

Goal: a returning volunteer can prepare and return with less friction,
and an organiser does not re-explain the same basics every time.

Reuse, do not rebuild:
- The existing Garden Steward Volunteer Day / event system (RSVP,
  event stores) is the event/work-party system. Phase 2B CONNECTS
  the map to it; it does not build a parallel event system.
- From a listing detail page, show "Upcoming work parties / events
  at this project" (from existing events, where they exist, joined
  by garden_id). Each event links through to the existing event
  view / RSVP — do not duplicate event data in the resources store.
- If no real upcoming event exists for a listing in the demo, show
  the honest empty state ("No work party listed yet — suggest one
  below"), never an invented event with a fake date.

New, thin pieces (only these):

1. Returning-volunteer "My next step" view (logged-in, reusing
   existing auth — no second login):
   - Your next work party (date, project, task), with RSVP status.
   - "What to bring / what to expect" — a short checklist drawn
     from a WORKDAY TEMPLATE, not invented per-event. Template
     items are generic and safe (water, sun protection, closed
     shoes, gloves if you have them, arrive 15 minutes early).
   - Your skill checklist: a short list of volunteer skills
     (e.g. planting, watering, tool use, food handling, welcoming
     newcomers), each marked "Learning / Confident / Can teach
     others" by the volunteer themselves. This is self-reported,
     never auto-assessed, and never public — it is for the
     volunteer and the organiser only.
2. Workday SOP grounding — HONESTY RULE:
   - If the Guild's workday SOP / agendas are in the repo or
     provided to you, use their actual steps and cite them in
     docs/workday-sop-notes.md (what SOP step maps to which
     screen).
   - If the SOP / V2 briefs are NOT in the repo and have NOT been
     provided, do NOT invent SOP content. Ship the generic
     template above, labelled "Draft template — needs Guild
     review before use", and list "Obtain workday SOP and V2
     briefs" as the first post-hackathon step in the summary.
     Never present a draft template as Guild-approved procedure.
3. Training content review flag — mandatory for anything that
   looks like instruction:
   - Every training / skill item carries a status: "Guild-reviewed"
     (only if the Guild actually provided/reviewed it) or
     "Draft — needs expert review" (default for everything Phase 2
     writes). Draft items show that label in the UI, not hidden
     in a footnote.
   - Never auto-generate plant-identification, food-safety, or
     tool-safety instructions and present them as correct.
     Local-plant training is explicitly slow and expert-dependent
     in the problem statement — respect that, do not shortcut it
     with generated content.
4. Communication preferences and consent (organiser + volunteer):
   - On newsletter signup AND on volunteer RSVP, record a
     preference: email only / SMS only / both, and frequency
     (event updates only / monthly digest). Defaults: email only,
     event updates only. No preference = no contact beyond the
     specific RSVP confirmation.
   - Volunteer names, emails, phones, and skill checklists are
     NEVER on public pages, listings, structured data, or
     screenshots. Organiser views show them only to logged-in
     organisers/volunteers, via existing auth.
   - Outreach and publishing stay human-approved: newsletter send
     (v5 Flow 8) and moderation approval (v5 Flow 5) are the
     controls. Phase 2 adds no auto-send, no auto-publish.

Acceptance: a returning volunteer can go from listing → upcoming
work party → RSVP → "what to bring" checklist in under 2 minutes,
with no re-onboarding form. An organiser can see, for one work
party, who is coming and what skills they self-report, without
re-asking everyone.

What Phase 2B deliberately does NOT build: a full course platform,
certification, automated skill assessment, chat, or a volunteer
management CRM. Those would break the one-day scope and the
"organisers can realistically maintain it" bar.

## Phase 2C — Organiser handover, honesty, and tool evaluation (DO THIRD)

1. "What this demo shows" page (public, linked from the footer +
   the Replicate page):
   - Demonstrated and working: list the v5 flows + Phase 2A/2B,
     each with one sentence of what was actually tested.
   - Prototype / demo-only: moderation updates the local dataset
     + JSON export (not a live pull-request workflow), steward
     claim is a demo claim (not identity verification), newsletter
     send mode (real SendGrid vs. demo, stated honestly),
     training template is draft pending Guild review, SOP
     grounding status (used real SOP vs. draft template — see 2B).
   - Ongoing effort and costs, in plain language: a weekly
     organiser workflow with time estimates — e.g. moderation
     queue ~15 minutes/week, stale check monthly, re-crawl
     monthly using docs/recrawl-prompt.md, newsletter compose
     per event. Hosting: Vercel frontend (free tier limits noted
     honestly), backend Fly.io or local (not Vercel), no Lovable
     subscription, no paid map tiles (OpenStreetMap/Leaflet).
     State what costs NOTHING in this build and what would cost
     money if scaled (SendGrid beyond free tier, a deployed
     Postgres backend, a domain).
   - Handover checklist for the Guild: who moderates (named role,
     not a named person), how to approve a suggestion (3 clicks),
     how to mark a listing stale, how to run a re-crawl, how to
     replicate for another community.
2. Tool evaluation record — docs/EVALUATION.md (new, do not
   rewrite AUDIT.md):
   - Evaluate, with evidence from what you can actually open:
     (a) garden-vue-hack (the built-on app), (b) the Lovable MVP
     linked in the Mapping Project V2 brief, (c) the Oakland
     Resilience Map (reference in the brief).
   - For each: what it does, what it does not do, who can maintain
     it, what it costs, and whether it is ready for adoption.
   - Decision: why this build extends garden-vue-hack, what the
     Lovable MVP would have traded away (replication, data
     control, ongoing cost — as in v5 §7), and what would change
     the decision. If you cannot open the Lovable MVP or the
     Oakland map (link broken, login required, etc.), say so
     plainly in EVALUATION.md — do not guess its features, and
     do not treat it as the mapping MVP by default.
   - Explicitly answer the problem statement's warning: "Confirm
     which product is being discussed before treating it as the
     mapping MVP or assuming it is ready for adoption." The
     answer in this build is: the mapping MVP is the garden-vue
     extension described in v5 + this addendum, NOT the Lovable
     MVP, unless EVALUATION.md finds evidence to the contrary
     and the main agent records that change.
3. Keep the warm, community-rooted voice across all new copy.
   No corporate, no growth-hacking, no "users" language where
   "neighbours / volunteers / stewards" fits. Every new screen
   passes the same design tokens (§8) and the same no-dead-button,
   no-lorem, no-private-data rules as v5.

## Updated demo script — Phase 2 (2 minutes, solo-runnable)

Keep the v5 demo script, then add ONE of these two journeys
(pick the one that works best on the day — do not demo both if
time is short):

Journey A — Younger resident, awareness → first step (answers
demo question a):
  A newcomer who has never heard of permaculture reads the
  60-second explainer, clicks "Your first way in → Volunteer",
  sees a nearby work party, and RSVPs — all in under 2 minutes.

Journey B — Returning volunteer, less friction (answers demo
question b):
  A returning volunteer opens "My next step", sees their next
  work party, checks "what to bring", updates one skill from
  Learning to Confident, and is done — no re-onboarding form.

Close with the organiser answer (demo question c):
  Jo approves one suggestion and marks one stale listing checked
  in under a minute, then shows the handover page: "15 minutes
  a week keeps this map alive — no developer required."

End line (keep v5's): "Before this map, finding a way to help
meant knowing someone who already knew. Now it means opening
one map — and the community itself keeps it current."
Add, only if Phase 2A/2B shipped: "And for someone new, it also
means understanding why it matters, and knowing exactly how to
take the first step — then coming back without starting over."

## Updated "done" checklist — Phase 2 additions

  [ ] Phase 1 §10 checklist still passes in full — no regression.
  [ ] Awareness landing works: explainer + why-it-matters + three
      first steps, all buttons real, all links to real filtered
      views / RSVP, at 360px / 768px / 1280px.
  [ ] Returning-volunteer journey works: listing → upcoming work
      party → RSVP → what-to-bring → skill self-report, in under
      2 minutes, with no invented events and no public volunteer data.
  [ ] Training / skill items are labelled Guild-reviewed or
      Draft — needs expert review, with draft as the default.
  [ ] Communication preferences are recorded (email/SMS, frequency)
      and honoured; no contact beyond RSVP confirmation without
      a preference.
  [ ] "What this demo shows" page is live, with demonstrated vs.
      prototype vs. ongoing effort/costs, and a handover checklist.
  [ ] EVALUATION.md exists, evaluates garden-vue, Lovable MVP, and
      Oakland Resilience Map honestly (including "could not open"
      where true), and records the mapping-MVP decision.
  [ ] Workday SOP grounding is stated honestly: real SOP cited, or
      draft template labelled + "obtain SOP/V2 briefs" listed as
      the first post-hackathon step.
  [ ] No emergency-service claim, no guaranteed-access claim, no
      private volunteer detail, no private location on any new page.
  [ ] Final summary adds: Phase 2 what was added, what was cut
      for time, and what the Guild should approve/review next
      (explainer wording, training template, SOP, Lovable decision).

## Final output additions (append to v5 §11, do not replace it)

6. Phase 2 report: which Phase 2A/2B/2C items shipped, which were
   cut for time and why, and the EVALUATION.md decision in one
   paragraph.
7. Post-hackathon list, in order: (1) Guild approves explainer
   wording, (2) Guild reviews training template + provides workday
   SOP and V2 briefs, (3) Guild confirms mapping-MVP decision
   (garden-vue vs. Lovable), (4) name a non-technical moderator
   and run the weekly 15-minute workflow for one month, (5) decide
   on a deployed backend (Fly.io) vs. JSON-only maintenance.
