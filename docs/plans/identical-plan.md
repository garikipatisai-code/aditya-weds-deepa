---
status: draft
plan_id: identical-plan
planner_session: ses_e4312d689ffeSVMu3zKmbxPBGW
spec_session: ses_e4315527dffeH7dQfa3RCEsVYk
authorized_copy: true
rights_claimed: true
no_code_edits: true
---

# Goal

Save identical rebuild plan docs/plans/identical-plan.md (no code edits yet). Reproduce the 6-task plan from planner session ses_e4312d689ffeSVMu3zKmbxPBGW, scoped to pixel audit spec ses_e4315527dffeH7dQfa3RCEsVYk, for the Wedding Invitation project. User authorizes direct copy/reuse (rights claimed).

# Architecture

Single-page static wedding invitation built from reusable sections. The rebuild plan reuses existing assets and layout decisions; it identifies what must be made pixel-identical between the current build and the target spec. No refactor of routing or data model — only visual/token parity and section ordering.

# Stack

- HTML/CSS (static site)
- Web fonts (font tokens)
- Design tokens (colors, spacing, typography)
- Section-based page composition

# Spec

Pixel audit spec session ses_e4315527dffeH7dQfa3RCEsVYk defines the target visual identity: exact hero layout, section ordering, per-section styles, and pixel-level hero rendering. The plan must cover every spec item so the rebuild can be verified against it.

# Constraints

- Allowed file ONLY: docs/plans/identical-plan.md
- No code edits yet — plan document only
- Direct copy/reuse of plan content is authorized (rights claimed by user)
- Must include frontmatter (draft), Goal/arch/stack/spec/constraints/review, 6 tasks, and coverage

# Review

Owner: user (subagent session). Verification: `ls -lh docs/plans/identical-plan.md` confirms the file exists. Content completeness checked against the 6 planner tasks and coverage section before closing.

## Tasks

1. **Tokens/fonts** — Audit and align design tokens (colors, spacing, typography) and web fonts between current build and spec session ses_e4315527dffeH7dQfa3RCEsVYk.
2. **Hero identical** — Make the hero section pixel-identical to the spec (layout, copy, imagery, spacing).
3. **Sections order** — Reorder page sections to match the spec-defined sequence exactly.
4. **Hero pixel** — Pixel-level verification of the hero rendering against the spec audit.
5. **All sections style** — Apply spec styles to every remaining section for full visual parity.
6. **Verify + republish** — Run full verification against the pixel audit spec and republish the rebuilt site.

## Coverage

| Spec area | Covered by task | Status |
|---|---|---|
| Tokens/fonts | Task 1 | planned |
| Hero layout/pixel | Tasks 2, 4 | planned |
| Sections order | Task 3 | planned |
| All sections style | Task 5 | planned |
| Verify + republish | Task 6 | planned |

Planner tasks: 6/6 covered. Spec audit coverage: full. No code edits performed.
