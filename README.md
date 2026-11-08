# Venkata Aditya Kumar & Naga Deepa — Wedding Invitation

Single-page South-Indian wedding invitation site (maroon / gold / ivory) hosting a 49MB 63s MP4 video and a 900x1600 JPG, with a Google Maps venue link and RSVP actions.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Invitation page (video, countdown, events, RSVP, venue map) |
| `styles.css` | Maroon / gold / ivory styles, mobile-first |
| `script.js` | Wedding countdown timer |
| `assets/wedding_invite.jpg` | 900x1600 poster image (copy also at root) |
| `assets/acd69cc8-66c0-4cf2-a8dd-e3947364886f.MP4` | 49MB 63s ceremony video (copy also at root) |
| `README.md` | This file |
| `docs/plans/wedding-invitation-progress.md` | Iteration ledger |

## Local preview

Serve the folder locally:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000` in your browser.

## Live site

https://garikipatisai-code.github.io/wedding-invitation/

## Deploy via git CLI (GitHub Pages)

```bash
git init
git add .
git commit -m "Initial wedding invitation release"
git branch -M main
git remote add origin <repo>
git push -u origin main
```

Then in GitHub: **Settings → Pages → Build and deployment → Branch: `main`, Folder: `/ (root)` → Save.**

### Size note

The video is ~49MB. GitHub's web upload UI caps single files at 25MB, so push the 49MB MP4 via git CLI (the commands above), not through the browser upload. GitHub Pages repos have no per-file size cap for CLI-pushed content.

### Cost

GitHub Pages is free indefinitely for public repos.

## Maps link

Venue: <https://maps.app.goo.gl/39jisBKbKEBthg6KA> (Chilakaluripet)
