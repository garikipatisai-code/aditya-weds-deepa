# Template Adapt Plan — Baseline (Recon Inventory)

## Source of truth
- Local repo: `/home/appusai/Documents/Others/Wedding Invitation`
- Demo site (Next.js): `https://myshaadhilink.in/invitation/traditional-invitation?to=Guest&demo=true` (Rahul & Harinya)
- Demo CSS chunks: `https://myshaadhilink.in/_next/static/css/*.css`

## Step 1 evidence — local inventory
```
$ ls -1 assets/
acd69cc8-66c0-4cf2-a8dd-e3947364886f.MP4
wedding_invite.jpg
$ ls -lh index.html styles.css script.js
-rw-rw-r-- 1 appusai appusai  12K Nov  8 08:41 index.html
-rw-rw-r-- 1 appusai appusai 6.2K Nov  8 08:32 styles.css
-rw-rw-r-- 1 appusai appusai 12K Nov  8 08:41 script.js
$ grep -c 'si-' styles.css || echo 0
0
0
```
- `assets/`: 2 files (49MB 63s MP4 + 900x1600 JPG). No `south-indian/` dir locally.
- `index.html` 12K, `styles.css` 6.2K, `script.js` 12K.
- `si-` count in `styles.css`: **0** (baseline; target = 8 si-* sections per spec).

## Step 2 evidence — local HTTP serve
```
$ python3 -m http.server 8000 & sleep 1; curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/index.html; pkill -f "http.server 8000" || true
200
```
- `index.html` serves with HTTP 200. Server stopped.

## Step 3 evidence — demo CSS chunks (first 3 fetched)
Discovered 18 unique chunk URLs on demo page (all `?dpl=dpl_6DxubUWFj6VakWzDmJHXsQyJmBrd`):
1. `151a1ceb40f547f7.css`  2. `30d60975c3acb472.css`  3. `5cead55fdd2f3772.css`
4. `79736648de221030.css`  5. `8a2ba4ee77c0e6e4.css`  6. `904338649fbe98d7.css`
7. `9895149e71f2aadd.css`  8. `a2ee0b6e5f9c1363.css`  9. `a73839f60502ed87.css`
10. `b44740f9ac3e7123.css` 11. `b6986f9d06a09df5.css` 12. `bdb06ee5848cc691.css`
13. `c02e70c057a458a1.css` 14. `cecb4a14c9c3a5ae.css` 15. `d53594bacbc985e2.css`
16. `e4b36916fed8a6e1.css` 17. `eae701d83bf709f4.css` 18. `fc6b28b3e63db6c8.css`

First 3 chunks contain ONLY:
- `@font-face` declarations (Playfair Display, Great Vibes, Cormorant Garamond, Plus Jakarta Sans, Allura, Fraunces, Pinyon Script, Marcellus, Cinzel, Noto Serif Telugu, Ramabhadra + fallbacks with `size-adjust`)
- `.__className_*` font-family utility classes
- `--font-*` / `--zc-font-*` / `--km-font-*` / `--sol-font-*` / `--vs-font-*` CSS custom properties

Selectors recorded (summarized, not copied): `@font-face`, `.__className_*`, `.__variable_*`.
**Finding:** chunks 1–3 are font-definition chunks. Zero layout/component selectors, zero `si-*` selectors. Portable rules = fonts only; no directly reusable layout rules from these 3. Remaining 15 chunks not yet fetched.

## Step 4 — baseline targets
| Item | Baseline (local) | Target (spec) |
|------|------------------|---------------|
| `si-` sections in styles.css | 0 | 8 |
| CSS chunks to adapt | 0 | 18 (`/_next/static/css/*.css`) |
| Local assets | `wedding_invite.jpg`, `acd69cc8-... .MP4` | `south-indian/*` (demo asset dir) |
| si-* section templates | none | 8 sections |

## Next (out of scope for this task)
- Fetch remaining 15 demo CSS chunks; summarize any layout/component selectors.
- Map demo `si-*` section classes to 8 target sections.
- Inventory demo `south-indian/*` assets.
- Edits to `index.html`/`styles.css` are NOT permitted in this task.
