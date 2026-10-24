# Re-crawl prompt & checklist (Flow 6)

The East Bay Regeneration Map stays current partly through a periodic "re-crawl":
a volunteer (or an LLM assistant, supervised) searches public sources for new or
changed regeneration resources and records them as **candidates**. Candidates are
**never published automatically** — they land in the moderation queue
(`/regeneration/moderate` → _Re-crawl candidates_) as `UNVERIFIED`, and a human
approves, edits, or rejects each one.

This file is the whole deliverable for the automated side. There is **no live
scraper** in this build, by design: an unattended crawler that publishes is
exactly what the brief forbids.

## The prompt

> You are helping maintain a community map of East Bay (California) regeneration
> resources. Search only **public** sources (organisation websites, public
> directories, news, event listings). Find community gardens, seed/tool
> libraries, community fridges, food pantries/banks, mutual-aid projects,
> resilience hubs, community spaces, trainings, school gardens, demonstration
> projects, regenerative businesses, nonprofits, and neighbourhood groups in the
> East Bay (Oakland, Berkeley, Richmond, Alameda, Hayward, Fremont, and
> surrounding cities — **not** San Francisco).
>
> For each candidate, record ONLY: `name`, `type` (from the list above),
> `neighbourhood`, `city`, and a single **public** `source` URL. Do not record,
> infer, or guess private home addresses, personal phone numbers, or personal
> email addresses. If the only contact is a personal detail, record the
> neighbourhood and leave contact blank.
>
> Mark every entry `source_type: crawl-candidate` and `status: pending`. Do not
> mark anything verified. Output a JSON array of candidate objects.

## What counts as a candidate

- A resource that is **not already** on the map (check by name + neighbourhood).
- A **material change** to an existing listing (e.g. it has closed, moved
  neighbourhood, or changed its hours) — record as a correction candidate with
  the old and new value.

## What to record

| Field | Required | Notes |
|-------|----------|-------|
| `name` | yes | As the source names it. |
| `type` | yes | One of the resource types in `src/_config/RegenConfig.js`. |
| `neighbourhood` | yes | Public, area-level only. |
| `city` | yes | East Bay only. |
| `source` | yes | A single public URL. |
| `date_found` | yes | ISO date of the crawl. |

## What must NEVER happen

- No auto-publishing. Candidates are `pending` until a human approves them.
- No private addresses, personal phones, or personal emails — ever, in any field.
- No "verified" badge from a crawl. Only a human review sets that.
- No San Francisco listings in the East Bay dataset.

## Reviewing candidates

Open `/regeneration/moderate` → **Re-crawl candidates**. For each:
**Verify & publish** (optionally **Edit & approve** to fix a field first), or
**Reject** with a reason. Approvals stamp today's date and add the listing;
every decision is written to the activity log.
