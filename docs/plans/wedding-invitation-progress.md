# Progress Ledger — Wedding Invitation Static Site

## Goal
South-Indian single-page wedding invitation hosting a 49MB 63s MP4 video and a 900x1600 JPG, with a venue link (https://maps.app.goo.gl/39jisBKbKEBthg6KA) and a reference link (https://myshaadhilink.in/invitation/traditional-invitation?to=Guest&demo=true).

## Acceptance Criteria
- Mobile-first layout
- Video plays on load/tap
- Venue link works
- Hosted free for >= 30 days
- Aesthetic: maroon / gold / ivory

## Budget
- Max 3 iterations

## Ledger Table

| Iteration | Status | Notes |
|-----------|--------|-------|
| 1 | Planned | Ledger creation |
| 2 | Done | README.md created; video direct MP4 confirmed; GitHub Pages hosting picked; external-load check passed |
| 3 | Done | Autoplay muted/loop video + JS play fallback; mobile styling (clamp fonts/padding, overflow-x hidden, 44px tap targets, max-width:480px media query); Telugu names/section replaced with English (Venkata Aditya Kumar ⚭ Naga Deepa) |
| 4 | Done | Eliminated real-phone horizontal scroll: html/body overflow-x hidden->clip + max-width:100% width:100%; visually-hidden max-width:100% left:0 top:0 clip-path; h1 overflow-wrap:break-word; img/video/svg/iframe max-width:100% height:auto; countdown/events flex min-width:0; verified 0 offenders, doc/body scrollWidth<=innerWidth at 390x844 and 360x740 |

## Decisions

| Decision | Option | Owner | Rationale |
|----------|--------|-------|-----------|
| Hosting | GitHub Pages | researcher ses_e44a6a27bffewGBzR385A3WzoI | Hosting matrix winner |
| Video strategy | Direct MP4 | researcher ses_e44a6a27bffewGBzR385A3WzoI | Self-hosted MP4; no external loads; 49MB pushed via git CLI (25MB web cap) |

## Blockers
- Need couple names
- Need date
- Need timing
- Need venue name

## Checks passed
- README.md created (title, file list, local preview, git CLI deploy steps, 49MB CLI note, free indefinite note, maps link)
- Only external loads: Google Fonts (fonts.googleapis.com/gstatic); no external JS/CSS assets; maps links are <a> href only
- GitHub Pages selected as host; direct MP4 video strategy confirmed
