# Taurus K9 Website

Single-page site for Taurus K9 LLC (Aransas Pass, TX): dog training, board and train, working K9 programs.

## Structure
- `index.html` shared shell, SEO metadata, schema markup, and module entry point
- `styles/main.css` ordered CSS layers; `styles/tokens/` holds visual values
- `styles/base/`, `styles/components/`, `styles/sections/`, and `styles/pages/`
  hold the corresponding rules
- `scripts/app.js` initializes the application; `scripts/modules/` contains
  shared behavior and helpers; `scripts/pages/` contains route renderers
- `scripts/config.js` holds shared site details, selectors, timing values, and
  validation copy
- `STYLE_GUIDE.md` documents all style tokens; `tokens-preview.html` is the
  live light/dark token, element, and component gallery
- `css/style.css` and `js/script.js` remain compatibility entry points

## Run locally
Run `python3 -m http.server` in this folder, then open the printed localhost
address. The app uses ES modules and must be served over HTTP rather than opened
directly with `file://`.
Open `/tokens-preview.html` on the local server to browse the token gallery.

## Publish
GitHub Pages: Settings > Pages > Deploy from branch `main` / root.
