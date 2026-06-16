# Nirvaan Wellness — website

Single-page site for Nirvaan Wellness. Plain HTML/CSS/JS — no build step.

## Preview locally

```bash
cd outputs/site
python3 -m http.server 8000
```

Open http://localhost:8000

## Editing content

Everything visible on the page — text, prices, hours, colours, fonts, photos,
booking links — lives in **`content.json`**. Edit that file and reload the
page; no code changes needed for routine updates.

- **Colours / fonts**: `theme.colors` / `theme.fonts` (applied at runtime to
  the whole site).
- **Photos**: `images.hero`, `images.philosophy`, `images.services`,
  `images.contact`. Each value can be:
  - a relative path to a file in `assets/images/` (drop your photo in that
    folder and point to it, e.g. `"assets/images/my-photo.jpg"`), or
  - a full URL to an image hosted elsewhere.
- **Booking buttons**: `booking.channels` — each channel (HeyGoldie,
  WhatsApp, Instagram) has `"enabled": true/false` and a `url`. Toggle any
  channel on/off without touching the layout. The channel marked
  `"primary": true` is used for the header "Book Now" button.
- **Services / prices**: `serviceCategories` — one entry per category
  (Virtues Massages, the Virtues Ritual collections, Body Treatments, Waxing,
  Threading). Each item has a `name`, optional `description`, and a list of
  `variants` (duration + price).
- **Policies, hours, contact details, philosophy text**: their own top-level
  keys, same pattern.

## Current placeholders

- **Photos** are free stock images (Unsplash) chosen to match the brand's
  tropical/spa mood — swap them out via `images` in `content.json` once real
  photos of the space/treatments are available.
- **Heading font** is "Playfair Display" (Google Fonts) — the brand
  reference uses "LA LUXES SERIF", which is likely a paid font. See the
  project's `open-questions.md` for details.

See `../open-questions.md` for the full list of open items, several of
which need input from the founder before the content is final.

## Deploying to GitHub Pages

The deploy repo lives at:
`~/Desktop/dev/perso-code/nirvaan-wellness-site/`

It is a **separate, independent git repo** from aiHub — no connection between them.
Edit files here in aiHub as normal, then run the deploy command below.

### One-command deploy (after any update)

```bash
cp -r /Users/nicholas.cetoupe/Desktop/dev/aiHub/foundry/projects/nirvaan-wellness/outputs/site/. ~/Desktop/dev/perso-code/nirvaan-wellness-site/ && cd ~/Desktop/dev/perso-code/nirvaan-wellness-site && git add . && git commit -m "Deploy update" && git push
```

Run that from anywhere — it copies the latest site files across and pushes to GitHub Pages automatically.

### First-time setup (one-off)

If the deploy repo doesn't exist yet:

```bash
mkdir -p ~/Desktop/dev/perso-code/nirvaan-wellness-site
cp -r /Users/nicholas.cetoupe/Desktop/dev/aiHub/foundry/projects/nirvaan-wellness/outputs/site/. ~/Desktop/dev/perso-code/nirvaan-wellness-site/
cd ~/Desktop/dev/perso-code/nirvaan-wellness-site
git init && git add . && git commit -m "Initial deploy — v1 warm editorial"
git remote add origin https://github.com/ebooNick/nirvaan-wellness-site.git
git branch -M main && git push -u origin main
```

Then in the GitHub repo: **Settings → Pages → Source: main branch, / (root) → Save**.

### Custom subdomain (mock.nirvaan-wellness.com)

The `CNAME` file is already in this folder. In GitHub Pages settings, set the
custom domain to `mock.nirvaan-wellness.com`.

In Cloudflare DNS for `nirvaan-wellness.com`, add:

| Type  | Name   | Target                       | Proxy         |
|-------|--------|------------------------------|---------------|
| CNAME | `mock` | `ebooNick.github.io`         | DNS only (grey cloud) |

Once DNS resolves, tick **Enforce HTTPS** in GitHub Pages settings.

> **Note:** Keep the Cloudflare proxy set to DNS only (grey cloud) — if it's
> proxied (orange cloud), GitHub cannot issue the SSL certificate.
