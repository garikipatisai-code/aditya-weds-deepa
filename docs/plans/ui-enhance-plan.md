# UI Enhancement Plan — Wedding Invitation

## 1. Tokens
Define the shared palette in docs/plans/ui-design-tokens.md:
- cream `#FDF5E6` background
- ink `#1A120C` body/heading text
- maroon `#8B1A1A` primary accent
- gold `#D4A843` decorative only
- gold-dark `#7C5B12` text gold
- ivory panel surfaces

## 2. Type + Wireframe
- Establish type roles: display (names/title), heading (sections), body (details), caption (small print)
- Wireframe: centered single-column card on cream background, ivory panel content block, maroon primary CTA, gold decorative divider, ink body copy

## 3. Motion
- One moment: gentle fade-in of the invitation card on page load (no looping animation)

## 4. Accessibility + States
- Keyboard-focus visible states on all interactive elements
- Hover/active/focus states for buttons and links using maroon/gold-dark
- Sufficient contrast on all text; avoid gold `#D4A843` for body text
- Reduced-motion preference respected

## 5. Interactions
- Button press feedback (subtle scale or color shift)
- Link underline on focus/hover
- Card entrance transition respects `prefers-reduced-motion`

## 6. Protocol
- Changes confined to docs/plans/ui-enhance-plan.md and docs/plans/ui-design-tokens.md
- No code edits in this phase
- Audit ses_e4301b740ffeGTiX7J8I1aC1UP addressed via token and state definitions above
