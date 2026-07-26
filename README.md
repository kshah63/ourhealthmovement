# Our Health Movement

**Ancient wisdom, for a modern life.** A content-rich website connecting the timeless
health traditions of Ayurveda, Traditional Chinese Medicine and Yoga to everyday modern
living — with an emphasis on seasonal & local eating, practical guides to spices, fruit &
veg and low-tox swaps, and a podcast with guest practitioners.

Built with [Astro](https://astro.build) as a fast, static site. No database, no server to
run — it builds to plain HTML/CSS/JS that can be hosted anywhere.

---

## Quick start

```bash
npm install       # install dependencies (first time only)
npm run dev       # start the local dev server → http://localhost:4321
npm run build     # build the production site into dist/
npm run preview   # preview the built site locally
```

You'll need [Node.js](https://nodejs.org) 18.20.8 or newer (Node 22 recommended — see
`.nvmrc`).

---

## How the site is organised

```
src/
├── content/            ← all your words live here, as Markdown
│   ├── wisdom/         ← the traditions (ayurveda.md, tcm.md, yoga.md …)
│   ├── guides/         ← spices, produce & low-tox guides
│   └── podcast/        ← podcast episodes + show notes
├── data/
│   └── seasonal.ts     ← what's in season, season by season
├── components/         ← reusable pieces (header, footer, cards, brand mark …)
├── layouts/            ← the page shell + SEO tags
├── pages/              ← every URL on the site
└── styles/global.css   ← the design system (colours, fonts, spacing)
public/                 ← favicon, social image, robots.txt (served as-is)
```

The content structure and rules are defined in `src/content.config.ts`.

---

## Adding & editing content

Everything readers see is Markdown in `src/content/`. No coding needed — open a file, edit
the text at the top (the "front matter", between the `---` lines) and the words below it.

### ✎ A new guide (spice, fruit/veg or low-tox swap)

Create a new `.md` file in `src/content/guides/`, e.g. `cumin.md`:

```markdown
---
title: Cumin
category: spice            # spice | produce | low-tox
season: [all]             # spring | summer | autumn | winter | all
energetics: 'Warming · pungent · aids digestion'   # optional
summary: >
  A one-line teaser shown on the cards.
tags: [digestion, warming]
order: 5
---

## Your first heading

Write the guide here in Markdown…
```

It automatically appears on the relevant guides page. That's it.

### ✎ A new podcast episode

Create a new `.md` file in `src/content/podcast/`, e.g. `ep-04-....md`:

```markdown
---
title: 'Your Episode Title'
episode: 4
guest: 'Guest Name'
guestTitle: 'What they do'
topic: 'Yoga'             # Yoga | Ayurveda | TCM | Fascia | Nutrition | Movement | Breath
duration: '48 min'
date: 2026-08-20
audioUrl: 'https://your-podcast-host.com/episode-4.mp3'   # ← the player appears once you add this
published: true
summary: >
  A short summary of the episode.
---

Show notes, timestamps and links go here…
```

> The three episodes currently in the repo are **samples** — replace them with your real
> recordings. Add an `audioUrl` (from Transistor, Buzzsprout, Spotify for Podcasters, etc.)
> and the audio player appears automatically.

### ✎ A new tradition

Add a `.md` file in `src/content/wisdom/` following the shape of `ayurveda.md`.

### ✎ What's in season

Edit `src/data/seasonal.ts` to adjust the produce lists for your region. The lists are set
for a temperate (UK / Northern European) calendar; your local grower or market is always
the best guide.

---

## Making it yours

| To change… | Edit… |
| --- | --- |
| Colours & fonts | `src/styles/global.css` (the `:root` variables at the top) |
| Logo / brand mark | `src/components/BrandMark.astro` and `public/favicon.svg` |
| Navigation links | `src/components/Header.astro` |
| Footer links & the health disclaimer | `src/components/Footer.astro` |
| Homepage sections | `src/pages/index.astro` |
| Social share image | `public/og-default.png` (1200×630) |
| Your live domain | `site:` in `astro.config.mjs` **and** the URL in `public/robots.txt` |

### Connecting the newsletter

The sign-up form is ready but not yet wired to an email provider. To collect real
sign-ups, create a free form at [Formspree](https://formspree.io) (or use Buttondown,
ConvertKit, Mailchimp…) and paste your form id into `FORMSPREE_ID` in
`src/components/Newsletter.astro`. Until then the form shows a gentle "connect your
provider" note.

---

## Deploying

The site builds to a static `dist/` folder, so you can host it **anywhere**. Pick one:

### Option A — Cloudflare Pages / Netlify / Vercel (recommended)

All three are free, connect straight to your GitHub repo, and rebuild automatically every
time you push a change.

1. Push this repo to GitHub.
2. In the host's dashboard, **import the repository**. They auto-detect Astro; the settings
   are:
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
3. Deploy. You'll get a live URL in a minute or two.

### Option B — Your 123 Reg hosting

If you have a hosting plan with 123 Reg, run `npm run build` and upload the **contents of
the `dist/` folder** to your `public_html` (or equivalent) via their File Manager or FTP.

### Pointing your 123 Reg domain at it

1. Update `site:` in `astro.config.mjs` to your domain (e.g. `https://ourhealthmovement.co.uk`)
   and the Sitemap URL in `public/robots.txt`, then redeploy.
2. In your host's dashboard, add your domain as a **custom domain** — it'll show you the DNS
   records to create.
3. In **123 Reg → Manage your domain → DNS settings**, add those records (usually an `A`
   record and/or a `CNAME` pointing at your host). DNS can take a little while to update.

> Each host has clear step-by-step guides for the exact records — search e.g.
> "Cloudflare Pages custom domain" — and they issue the HTTPS certificate for you.

---

## A note on wellbeing

The content here is shared for education and inspiration, drawing on traditional practices
and their modern study. It is **not medical advice** and isn't a substitute for care from a
qualified practitioner. This disclaimer lives in the site footer — please keep it there.
