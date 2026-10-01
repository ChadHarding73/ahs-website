# angiehardingstyle.com

Static rebuild of Angie Harding's Squarespace site (2026-09-30). Eleventy 3, hosted on Netlify, repo on Chad's personal GitHub (ChadHarding73).

## Editing
- Page copy lives directly in `src/*.njk` (plain HTML). Edit there.
- Nav, Instagram link, footer email: `src/_data/site.json`. Layout: `src/_includes/base.njk`. Styles: `src/assets/site.css`.
- Images: drop into `src/images/`, reference as `/images/<name>`.
- Preview: `npm run serve` (port 8090). Build: `npm run build`.
- Push a branch for a Netlify deploy preview; merge to `main` to publish.

## Do not
- Re-run `scripts/extract.mjs` or `scripts/gen-pages.mjs`. They were the one-time migration and would overwrite edits.
- Rename `/new-page` (the Testimonials URL). It is the original Squarespace slug; `/testimonials` 301s to it.

## Contact form
Netlify Forms (`name="contact"`). Notification email is set in the Netlify UI: Forms > contact > Form notifications.

## DNS
Domain and DNS are at GoDaddy, NOT Squarespace. Fonts: Jost (stand-in for Futura PT, which was Squarespace's Adobe license) + Open Sans, via Google Fonts.
