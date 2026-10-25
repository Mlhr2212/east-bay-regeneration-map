# Workday SOP grounding — honesty note (Phase 2B)

The Guild's real **workday Standard Operating Procedure (SOP)** and the
**Volunteer/Event Management V2** and **Mapping Project V2** briefs were **not
present in either repository and were not provided** when this was built.

Per the addendum's honesty rule, this build therefore does **not** invent SOP
content. Instead it ships a **generic, safe "what to bring / what to expect"
template** (see `WORKDAY_TEMPLATE` in `src/_config/RegenConfig.js`) that is:

- deliberately generic (water, sun protection, closed-toe shoes, gloves if you
  have them, arrive ~15 minutes early),
- labelled **"Draft — needs expert review"** in the UI, not presented as
  approved Guild procedure,
- not project-specific and not safety instruction for plant ID, food handling,
  or tool use (those are expert-dependent and must be reviewed — see below).

## What maps to which screen (to fill in once the SOP exists)

| SOP step | Screen | Status |
|----------|--------|--------|
| Sign-in / arrival | "My next step" → what-to-bring checklist | generic draft |
| Task assignment | (from the existing Volunteer Day event) | reuses existing event system |
| Skills / who can do what | "My next step" → skill self-report | self-reported, draft |
| Wrap-up / debrief | not built | — |

## Training content review

Every skill and checklist item carries a review status. Default is
**Draft — needs expert review**; only items the Guild has actually reviewed may
be marked **Guild-reviewed**. No plant-identification, food-safety, or
tool-safety instructions are auto-generated or presented as correct —
local-plant training is slow and expert-dependent, and this build respects that.

## First post-hackathon step

**Obtain the Guild's workday SOP and the V2 briefs**, map their real steps to
these screens, replace the draft template with reviewed content, and flip the
reviewed items to "Guild-reviewed".
