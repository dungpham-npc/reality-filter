# Design Decisions — Reality Filter

## DD-001: Post-Flow Workbench (Feb 2026)

### Context

The v0 flow is a one-shot experience: Hazard Warning → Comfort Bait → Hidden Failure → Reveal → Fork → Readings. Once a user completes (or exits) the flow, there is no way to return to the readings or revisit the coding example.

The question: should we add a persistent space where users who completed the flow can **re-read articles** and **re-visit / experiment with examples**?

### Decision

**Yes — add a "Workbench" (not a "dashboard").**

### Rationale

| Concern | Analysis |
|---|---|
| Re-reading articles | Fully compatible with system values. Readings are "lenses," not lessons. Having them accessible is no different from a bookshelf. No sequence, no checkmarks, no completion tracking. |
| Re-visiting examples | Also compatible. A sandbox where someone replays the bank account simulation or experiments with different solutions *deepens* the intended experience. They're not "completing" anything — they're exploring failure modes on their own terms. This aligns with "if the deeper reality excites you." |
| Risk of feeling like a platform | Mitigated by framing. The UI must feel like a quiet, permanent room — not a product tracking engagement. |

### Constraints (non-negotiable)

These preserve the system's core values:

- **No progress tracking visible to the user** — no "1/5 tasks completed," no streaks, no history
- **No gamification** — no "try the next challenge!," no unlock animations, no achievement language
- **No curriculum framing** — readings are not ordered lessons; examples are not graded exercises
- **Neutral language** — "The space is here if you want it," not "Continue your journey"
- **No metrics exposed** — the user never sees engagement data about themselves
- **Always-available exit** — leaving the workbench is just as easy and respected as leaving the flow

### What "Workbench" means

- A post-flow home page with two sections:
  1. **Readings** — all lenses, always available, expandable
  2. **Sandbox** — the coding editor with the task, runnable tests, and the simulation — freely explorable, no gatekeeping
- Accessible only after completing or exiting the flow (preserves flow integrity)
- No login, no account — session-based, same as the rest
- The word "dashboard" is banned — it implies metrics and tracking

### What it does NOT include

- Multiple tasks (out of scope for v0, but the workbench structure makes adding more later trivial)
- User accounts or saved code
- Any "recommended next steps" or guided path
- Social features, comments, sharing

---

## DD-002: Soup Bowl — Creator CMS & Content Ceremony (Feb 2026)

### Context

The system's educational intent goes beyond a one-shot intro. It should become a growing collection of postmortems, technical deep-dives, and articles — each grounded in real, hands-on examples before any philosophical writing. The creator (you) needs a private tool to manage this content, and the tool itself must enforce discipline.

The system now has two distinct sides:

| Side | Audience | Purpose |
|---|---|---|
| **Hazard System** | Visitors | The intro flow (existing) + workbench for exploration |
| **Soup Bowl** | Creator only | Private CMS to create, manage, and publish content |

### Decision

**Add "Soup Bowl" — a creator-only content management interface, separate from the user-facing Hazard System.**

### The "Add to Soup" Ceremony

Every piece of content must go through a mandatory three-phase creation pipeline. The creator cannot skip phases or publish out of order:

```
Phase 1: EXAMPLE (required first)
  → Upload/write a coding task with starter code,
    happy-path tests, and a hidden failure simulation
  → The example must be runnable and breakable
  → Cannot proceed until this exists

Phase 2: EXPLANATION (required second)
  → Write the reveal: what assumption broke, which
    invariant was violated, what the machine actually did
  → Must reference the example from Phase 1
  → Cannot proceed until this exists

Phase 3: ARTICLE (only then)
  → The philosophical/editorial writing
  → Postmortem analysis, personal reflections, curated
    readings, deeper context
  → This is the only optional phase — an entry can
    exist with just Example + Explanation
```

### Why This Order Matters

The ceremony prevents the creator from falling into the trap the system warns users about: **talking about problems without understanding them deeply enough.** By forcing hands-on example creation first, the creator must:

1. Find or construct a real failure mode
2. Build a working demonstration of that failure
3. Articulate precisely what went wrong and why
4. Only then express opinions about it

### Content Model: "Soup Entry"

A Soup Entry is the atomic unit of content. It bundles the three phases:

| Field | Type | Required |
|---|---|---|
| `id` | UUID | Auto-generated |
| `slug` | String | URL-safe identifier |
| `title` | String | Display name |
| `status` | Enum | `DRAFT_EXAMPLE` → `DRAFT_EXPLANATION` → `DRAFT_ARTICLE` → `PUBLISHED` |
| `example` | Object | Task definition (description, starter code, happy-path tests, simulation config) |
| `explanation` | Object | Reveal content (assumption, invariant, machine behavior) |
| `article` | Markdown | The editorial/philosophical writing |
| `createdAt` | Instant | When the entry was started |
| `publishedAt` | Instant | When it went live (null if draft) |

### Relationship to Existing System

- The existing bank account flow becomes **Soup Entry #1** (pre-seeded, always the intro)
- The intro flow (Hazard Warning → bank account → Reveal → Fork) stays exactly as-is
- The Workbench shows all **published** Soup Entries for user exploration
- Soup Bowl is a completely separate UI, accessible only to the creator

### Constraints

- **Soup Bowl is private** — password-protected, creator-only, never visible to users
- **No shortcuts** — the ceremony is enforced; you cannot write Article before Example + Explanation exist
- **Entries can be saved as drafts** at any phase — but cannot be published until all required phases are complete
- **Existing intro is not managed through Soup Bowl** (for v0) — it stays hardcoded as the entry point

---

## DD-003: Requirement Evolution — From Filter to Soup (Feb 2026)

### Context

The original v0 requirements were deliberately minimal: one task, one reveal, one fork, a handful of readings. The success metric was "most people leave quickly." The system was a filter, not a platform.

That changes now.

### Decision

**The system evolves from a one-shot filter into a growing, curated soup of reality-grounded content.**

The original requirements (no gamification, no credentials, no curriculum, user agency) still hold as **values**, but the following v0 constraints are explicitly relaxed:

| Original v0 Constraint | New Reality |
|---|---|
| "One task only" | Multiple entries, each with its own example + failure + explanation |
| "4-6 curated readings" | Unbounded — each entry can have its own article |
| "Scarcity must be natural" | Scarcity comes from the ceremony's difficulty, not from artificial limits |
| "Success = most people leave quickly" | The intro still filters. Those who stay get a growing library of reality. |
| "Not a content platform" | It IS a content platform — but one that can't grow faster than genuine depth |

### User-Side Experience per Entry

Each Soup Entry is experienced by the reader in the **same ceremony sequence** as the intro:

```
1. EXAMPLE    → Try the coding task, run tests, see them pass
2. FAILURE    → Run the simulation, watch it break
3. EXPLANATION → Read what went wrong and why
4. ARTICLE     → (if exists) The deeper writing, postmortem, philosophy
```

Users CANNOT skip ahead — you don't see the explanation until you've seen the failure, and you don't see the article until you've read the explanation. This is enforced client-side per session (no server tracking of per-entry progress — that would be gamification).

### What This Means Architecturally

- The intro flow (Hazard Warning → Bank Account → Reveal → Fork) is the **gateway** — everyone goes through it once
- The Workbench becomes a **library of entries** — each one a self-contained mini-experience
- Soup Bowl is the **creator's private kitchen** where entries are crafted through the ceremony
- The ceremony is the quality gate — it naturally limits how fast the system grows


