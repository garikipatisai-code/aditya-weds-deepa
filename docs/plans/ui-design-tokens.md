# UI Design Tokens — Wedding Invitation

Palette:

- Background (cream): `#FDF5E6`
- Text/ink (darkest): `#1A120C`
- Accent (maroon): `#8B1A1A`
- Decorative (gold): `#D4A843`
- Text gold (dark): `#7C5B12`
- Panels (ivory): off-white neutral overlay on cream

Semantic roles:

- `bg` → cream `#FDF5E6`
- `ink` → `#1A120C` for headings and body copy
- `accent` → maroon `#8B1A1A` for primary actions / highlights
- `gold` → `#D4A843` decorative only (dividers, flourishes)
- `gold-text` → `#7C5B12` for gold-toned readable text
- `panel` → ivory panel for card surfaces

Contrast note: verify `gold-text #7C5B12` against cream `#FDF5E6` meets WCAG AA before shipping text in that color; prefer maroon/ink for body text.
