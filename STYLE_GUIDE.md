# Taurus K9 Style Guide

This guide documents the CSS custom properties declared in `styles/tokens/`. Values are CSS expressions as authored; token aliases resolve through other tokens. If a dark-theme value differs, both are listed. “Used by” names the stylesheets that directly reference the token and the number of references in each file.

Token inventory: **1,344 tokens** — 278 color, 403 typography, and 663 spacing / shape / effect tokens.

The CSS cascade is **global element token → section token → page token**. For SPA routes, the router sets `body[data-page]`; page-specific declarations can be scoped to that attribute. Dark mode is activated by setting `data-theme="dark"` on the root `<html>` element and changes semantic color values only.

## How do I change X?

### Change all h1 colors site-wide

Edit `--h1-color` in `styles/tokens/colors.css`. Hero and page-hero h1 defaults reference this token; a page-specific `--page-h1-color` override still takes precedence by design.

```css
:root { --h1-color: var(--color-brass); }
```

### Change h1 color on one page only

Set the page token on the router-managed body attribute. Replace `about` with the `data-page` value for the target route.

```css
body[data-page="about"] { --page-h1-color: var(--color-brass); }
```

### Change p color in the footer only

The footer paragraph token falls back to the global paragraph token. Setting it on `.footer` changes only footer paragraphs unless a page-level paragraph token is set.

```css
.footer { --footer-p-color: var(--color-muted); }
```

### Change the color of every SVG icon

Set the global `--svg-color` token. Hero and NAP icons have explicit section defaults, so set their matching section tokens too when they should share the new color. Page-level `--page-svg-color` overrides remain available.

```css
:root {
  --svg-color: var(--color-accent);
  --hero-svg-color: var(--svg-color);
  --nap-svg-color: var(--svg-color);
}
```

### Change a brand color everywhere

Change the palette primitive in `styles/tokens/colors.css`; semantic aliases such as `--green`, `--color-accent`, and theme-aware button tokens reference palette values. For the current teal accent, change `--color-teal` and review the aliases shown in the inventory. Brass and green-tint colors are separate palette tokens.

```css
:root { --color-teal: #176b52; }
```

The preview page lives at `tokens-preview.html`. Its element gallery covers visible HTML types; non-rendering document metadata (`meta`, `title`, `link`) and generated JSON-LD script data are not visual specimens.

## Complete token inventory

| Token | Category | Current value / expression | Used by | Controls |
|---|---|---|---|---|
| `--a-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--a-color` | Color | `var(--color-link)` | `styles/base/elements.css` × 1; `styles/components/card.css` × 1; `styles/components/nav.css` × 2; `styles/pages/site.css` × 1; `styles/sections/footer.css` × 2; `styles/sections/hero.css` × 1; `styles/sections/overlays.css` × 1; `styles/sections/utility.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--a-font-family` | Typography | `var(--font-sans)` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--a-hover-color` | Color | `var(--color-link-hover)` | `styles/base/elements.css` × 1; `styles/components/nav.css` × 1; `styles/sections/footer.css` × 2; `styles/sections/hero.css` × 1; `styles/sections/utility.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--a-line-height` | Typography | `normal` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--a-margin` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--a-padding` | Spacing / shape / effects | `0` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--a-radius` | Spacing / shape / effects | `0` | Token aliases only: `styles/tokens/spacing.css` × 2 | Controls the border or corner shape for this element, component, or section. |
| `--a-shadow` | Spacing / shape / effects | `none` | Not directly referenced | Controls the shadow for this element, component, or section. |
| `--a-size` | Typography | `var(--type-value-84cb1e4e)` | Token aliases only: `styles/tokens/typography.css` × 3 | Controls the text size or font weight for this element, component, or section. |
| `--a-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--a-weight` | Typography | `400` | Token aliases only: `styles/tokens/typography.css` × 7 | Controls the text size or font weight for this element, component, or section. |
| `--areas-li-color` | Color | `var(--color-value-ee4696c3)` | `styles/components/card.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--areas-li-margin` | Spacing / shape / effects | `var(--space-value-b6589fc6)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--areas-li-padding` | Spacing / shape / effects | `var(--space-value-c6422ef6)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--areas-li-radius` | Spacing / shape / effects | `var(--space-value-e5383118)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls the border or corner shape for this element, component, or section. |
| `--areas-li-size` | Typography | `var(--type-value-f27ff6d4)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--areas-li-weight` | Typography | `var(--type-value-15aa0c7e)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--article-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--article-color` | Color | `var(--color-text-body)` | `styles/pages/site.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--article-font-family` | Typography | `var(--font-sans)` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--article-line-height` | Typography | `normal` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--article-margin` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--article-padding` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--article-radius` | Spacing / shape / effects | `0` | Not directly referenced | Controls the border or corner shape for this element, component, or section. |
| `--article-shadow` | Spacing / shape / effects | `none` | Not directly referenced | Controls the shadow for this element, component, or section. |
| `--article-size` | Typography | `var(--type-value-84cb1e4e)` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--article-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--article-weight` | Typography | `400` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--aside-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--aside-color` | Color | `var(--color-text-body)` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--aside-font-family` | Typography | `var(--font-sans)` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--aside-line-height` | Typography | `normal` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--aside-margin` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--aside-padding` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--aside-radius` | Spacing / shape / effects | `0` | Not directly referenced | Controls the border or corner shape for this element, component, or section. |
| `--aside-shadow` | Spacing / shape / effects | `none` | Not directly referenced | Controls the shadow for this element, component, or section. |
| `--aside-size` | Typography | `var(--type-value-84cb1e4e)` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--aside-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--aside-weight` | Typography | `400` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--b-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--b-color` | Color | `var(--color-text-body)` | `styles/components/card.css` × 4 | Controls the color or background color of this element, component, or section. |
| `--b-font-family` | Typography | `var(--font-sans)` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--b-line-height` | Typography | `normal` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the font family or text metrics for this element, component, or section. |
| `--b-margin` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--b-padding` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--b-radius` | Spacing / shape / effects | `0` | Not directly referenced | Controls the border or corner shape for this element, component, or section. |
| `--b-shadow` | Spacing / shape / effects | `none` | Not directly referenced | Controls the shadow for this element, component, or section. |
| `--b-size` | Typography | `var(--type-value-84cb1e4e)` | Token aliases only: `styles/tokens/typography.css` × 3 | Controls the text size or font weight for this element, component, or section. |
| `--b-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--b-weight` | Typography | `400` | Token aliases only: `styles/tokens/typography.css` × 2 | Controls the text size or font weight for this element, component, or section. |
| `--band-h2-color` | Color | `var(--color-value-d4e6d716)` | `styles/components/card.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--band-p-color` | Color | `var(--color-value-320653a2)` | `styles/components/card.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--band-p-margin` | Spacing / shape / effects | `var(--space-value-b6589fc6)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--blockquote-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--blockquote-color` | Color | `var(--color-text-body)` | `styles/components/card.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--blockquote-font-family` | Typography | `var(--font-sans)` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--blockquote-line-height` | Typography | `normal` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--blockquote-margin` | Spacing / shape / effects | `0` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--blockquote-padding` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--blockquote-radius` | Spacing / shape / effects | `0` | Not directly referenced | Controls the border or corner shape for this element, component, or section. |
| `--blockquote-shadow` | Spacing / shape / effects | `none` | Not directly referenced | Controls the shadow for this element, component, or section. |
| `--blockquote-size` | Typography | `var(--type-value-84cb1e4e)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--blockquote-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--blockquote-weight` | Typography | `400` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--body` | Color | `var(--color-body)` | Not directly referenced | Color value or color alias used by the styles listed. |
| `--brand-b-letter-spacing` | Typography | `var(--type-value-6ed02c55)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the font family or text metrics for this element, component, or section. |
| `--brand-b-size` | Typography | `var(--type-value-6d775596)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--brand-b-weight` | Typography | `var(--type-value-28cc2209)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--brand-span-color` | Color | `var(--color-value-d4e6d716)` | `styles/sections/header.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--brand-span-letter-spacing` | Typography | `var(--type-value-f1e0522f)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the font family or text metrics for this element, component, or section. |
| `--brand-span-size` | Typography | `var(--type-value-60ac4cf4)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--brand-span-weight` | Typography | `var(--type-value-d8e4bbea)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--brass` | Color | `var(--color-brass)` | `styles/components/card.css` × 1; `styles/sections/overlays.css` × 1 | Color value or color alias used by the styles listed. |
| `--brass2` | Color | `var(--color-brass-dark)` | `styles/components/card.css` × 2 | Color value or color alias used by the styles listed. |
| `--btint` | Color | `var(--color-brass-tint)` | `styles/base/elements.css` × 1; `styles/components/card.css` × 1 | Color value or color alias used by the styles listed. |
| `--button-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--button-color` | Color | `var(--color-text-body)` | `styles/sections/footer.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--button-font-family` | Typography | `var(--font-sans)` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--button-line-height` | Typography | `normal` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--button-margin` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--button-padding` | Spacing / shape / effects | `0` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--button-radius` | Spacing / shape / effects | `0` | Not directly referenced | Controls the border or corner shape for this element, component, or section. |
| `--button-shadow` | Spacing / shape / effects | `none` | Not directly referenced | Controls the shadow for this element, component, or section. |
| `--button-size` | Typography | `var(--type-value-84cb1e4e)` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--button-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--button-weight` | Typography | `400` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--caption-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--caption-color` | Color | `var(--color-text-body)` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--caption-font-family` | Typography | `var(--font-sans)` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--caption-line-height` | Typography | `normal` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--caption-margin` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--caption-padding` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--caption-radius` | Spacing / shape / effects | `0` | Not directly referenced | Controls the border or corner shape for this element, component, or section. |
| `--caption-shadow` | Spacing / shape / effects | `none` | Not directly referenced | Controls the shadow for this element, component, or section. |
| `--caption-size` | Typography | `var(--type-value-84cb1e4e)` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--caption-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--caption-weight` | Typography | `400` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--card-p-color` | Color | `var(--color-card-text)` | `styles/components/card.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--card-p-font-family` | Typography | `var(--type-value-fed8ff10)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the font family or text metrics for this element, component, or section. |
| `--card-ul-color` | Color | `var(--color-card-text)` | `styles/components/card.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--card-ul-font-family` | Typography | `var(--type-value-fed8ff10)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the font family or text metrics for this element, component, or section. |
| `--check-li-height` | Spacing / shape / effects | `var(--space-value-e401c87c)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--check-li-radius` | Spacing / shape / effects | `var(--space-value-9e0741c0)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls the border or corner shape for this element, component, or section. |
| `--check-li-size` | Typography | `var(--type-value-ed7a8e9b)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--check-li-width` | Spacing / shape / effects | `var(--space-value-bcf5b954)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--check-ul-margin` | Spacing / shape / effects | `var(--space-value-1f995445)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--check-ul-padding` | Spacing / shape / effects | `var(--space-value-b6589fc6)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--color-accent` | Color | `var(--color-teal)` | Token aliases only: `styles/tokens/colors.css` × 1 | Semantic or palette color used by the styles listed; dark theme overrides are shown where present. |
| `--color-blue-500` | Color | `var(--color-value-fceb112b)` | Token aliases only: `styles/tokens/colors.css` × 1 | Semantic or palette color used by the styles listed; dark theme overrides are shown where present. |
| `--color-body` | Color | `#3f4d57` | Token aliases only: `styles/tokens/colors.css` × 1 | Semantic or palette color used by the styles listed; dark theme overrides are shown where present. |
| `--color-brass` | Color | `#c8912f` | Token aliases only: `styles/tokens/colors.css` × 1 | Semantic or palette color used by the styles listed; dark theme overrides are shown where present. |
| `--color-brass-dark` | Color | `#8a5a12` | Token aliases only: `styles/tokens/colors.css` × 1 | Semantic or palette color used by the styles listed; dark theme overrides are shown where present. |
| `--color-brass-tint` | Color | `#fbf2e0` | Token aliases only: `styles/tokens/colors.css` × 1 | Semantic or palette color used by the styles listed; dark theme overrides are shown where present. |
| `--color-button-primary-bg` | Color | `var(--color-value-fceb112b) (dark: var(--color-teal))` | `styles/components/button.css` × 1 | Semantic or palette color used by the styles listed; dark theme overrides are shown where present. |
| `--color-button-primary-border` | Color | `var(--color-value-b6143d1d)` | Not directly referenced | Semantic or palette color used by the styles listed; dark theme overrides are shown where present. |
| `--color-button-primary-hover-bg` | Color | `var(--color-value-19f54239)` | `styles/components/button.css` × 2 | Semantic or palette color used by the styles listed; dark theme overrides are shown where present. |
| `--color-button-primary-text` | Color | `var(--color-ink)` | `styles/components/button.css` × 4 | Semantic or palette color used by the styles listed; dark theme overrides are shown where present. |
| `--color-button-secondary-bg` | Color | `var(--color-value-b6143d1d) (dark: var(--color-blue-500))` | `styles/components/button.css` × 3 | Semantic or palette color used by the styles listed; dark theme overrides are shown where present. |
| `--color-button-secondary-border` | Color | `var(--color-value-b6143d1d)` | Not directly referenced | Semantic or palette color used by the styles listed; dark theme overrides are shown where present. |
| `--color-button-secondary-text` | Color | `var(--color-ink)` | Not directly referenced | Semantic or palette color used by the styles listed; dark theme overrides are shown where present. |
| `--color-button-tertiary-bg` | Color | `var(--color-value-5c92274e) (dark: var(--color-danger))` | `styles/components/button.css` × 2 | Semantic or palette color used by the styles listed; dark theme overrides are shown where present. |
| `--color-card-text` | Color | `var(--color-ink) (dark: var(--color-cream))` | `styles/components/card.css` × 1 | Semantic or palette color used by the styles listed; dark theme overrides are shown where present. |
| `--color-cream` | Color | `#FFFFFF` | Token aliases only: `styles/tokens/colors.css` × 11 | Semantic or palette color used by the styles listed; dark theme overrides are shown where present. |
| `--color-cream-50` | Color | `var(--color-cream)` | Not directly referenced | Semantic or palette color used by the styles listed; dark theme overrides are shown where present. |
| `--color-danger` | Color | `#a4262c` | Token aliases only: `styles/tokens/colors.css` × 2 | Semantic or palette color used by the styles listed; dark theme overrides are shown where present. |
| `--color-green` | Color | `#2f6b52` | Token aliases only: `styles/tokens/colors.css` × 2 | Semantic or palette color used by the styles listed; dark theme overrides are shown where present. |
| `--color-green-700` | Color | `var(--color-green)` | Not directly referenced | Semantic or palette color used by the styles listed; dark theme overrides are shown where present. |
| `--color-green-tint` | Color | `#e9f2ed` | Token aliases only: `styles/tokens/colors.css` × 1 | Semantic or palette color used by the styles listed; dark theme overrides are shown where present. |
| `--color-heading` | Color | `var(--color-ink) (dark: var(--color-cream))` | Token aliases only: `styles/tokens/colors.css` × 6 | Semantic or palette color used by the styles listed; dark theme overrides are shown where present. |
| `--color-hero-text` | Color | `var(--color-value-afa66cbe) (dark: var(--color-cream))` | Token aliases only: `styles/tokens/colors.css` × 1 | Semantic or palette color used by the styles listed; dark theme overrides are shown where present. |
| `--color-icon` | Color | `var(--color-ink)` | Not directly referenced | Semantic or palette color used by the styles listed; dark theme overrides are shown where present. |
| `--color-ink` | Color | `#242021` | Token aliases only: `styles/tokens/colors.css` × 10 | Semantic or palette color used by the styles listed; dark theme overrides are shown where present. |
| `--color-ink-900` | Color | `var(--color-ink)` | Not directly referenced | Semantic or palette color used by the styles listed; dark theme overrides are shown where present. |
| `--color-ink-soft` | Color | `#1b262f` | Token aliases only: `styles/tokens/colors.css` × 2 | Semantic or palette color used by the styles listed; dark theme overrides are shown where present. |
| `--color-line` | Color | `#e3ddd2` | Token aliases only: `styles/tokens/colors.css` × 1 | Semantic or palette color used by the styles listed; dark theme overrides are shown where present. |
| `--color-line-strong` | Color | `#cfc7b8` | Token aliases only: `styles/tokens/colors.css` × 1 | Semantic or palette color used by the styles listed; dark theme overrides are shown where present. |
| `--color-link` | Color | `var(--color-cream) (dark: var(--color-value-442c2bc9))` | Token aliases only: `styles/tokens/colors.css` × 1 | Semantic or palette color used by the styles listed; dark theme overrides are shown where present. |
| `--color-link-hover` | Color | `var(--color-value-442c2bc9)` | Token aliases only: `styles/tokens/colors.css` × 1 | Semantic or palette color used by the styles listed; dark theme overrides are shown where present. |
| `--color-list-text` | Color | `var(--color-ink) (dark: var(--color-cream))` | Token aliases only: `styles/tokens/colors.css` × 2 | Semantic or palette color used by the styles listed; dark theme overrides are shown where present. |
| `--color-muted` | Color | `#61707b` | Token aliases only: `styles/tokens/colors.css` × 1 | Semantic or palette color used by the styles listed; dark theme overrides are shown where present. |
| `--color-page-background` | Color | `var(--color-cream) (dark: var(--color-ink-soft))` | `styles/base/elements.css` × 1; `styles/pages/tokens-preview.css` × 1 | Semantic or palette color used by the styles listed; dark theme overrides are shown where present. |
| `--color-paragraph` | Color | `var(--color-cream)` | Token aliases only: `styles/tokens/colors.css` × 2 | Semantic or palette color used by the styles listed; dark theme overrides are shown where present. |
| `--color-surface` | Color | `#fff (dark: var(--color-ink))` | `styles/pages/tokens-preview.css` × 1 | Semantic or palette color used by the styles listed; dark theme overrides are shown where present. |
| `--color-teal` | Color | `#00FFE1` | Token aliases only: `styles/tokens/colors.css` × 4 | Semantic or palette color used by the styles listed; dark theme overrides are shown where present. |
| `--color-teal-500` | Color | `var(--color-teal)` | Not directly referenced | Semantic or palette color used by the styles listed; dark theme overrides are shown where present. |
| `--color-text-body` | Color | `var(--color-ink) (dark: var(--color-cream))` | `styles/base/elements.css` × 1; `styles/pages/tokens-preview.css` × 1 | Semantic or palette color used by the styles listed; dark theme overrides are shown where present. |
| `--color-value-038e6f38` | Color | `transparent` | `styles/components/card.css` × 1; `styles/sections/hero.css` × 3 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-04d197de` | Color | `#a9b7c0` | `styles/sections/hero.css` × 3 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-0634c16c` | Color | `rgba(255,255,255,.13)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-09d1976d` | Color | `#c8912f` | `styles/components/card.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-0a2d909e` | Color | `#1a3d30` | `styles/components/card.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-0f1c00d7` | Color | `rgba(255,255,255,.08)` | `styles/sections/footer.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-164de426` | Color | `#DD00FF` | `styles/components/card.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-19f54239` | Color | `#32D9D9` | Token aliases only: `styles/tokens/colors.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-311b1c9e` | Color | `#8a5a12` | `styles/components/card.css` × 2 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-31c30330` | Color | `rgba(200,145,47,.18)` | `styles/sections/hero.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-320653a2` | Color | `#c3ddd1` | `styles/components/card.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-3eaed03c` | Color | `#3BD8FF` | `styles/components/button.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-3f882367` | Color | `#9fb0ba` | `styles/sections/footer.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-41d185bd` | Color | `rgba(0,0,0,.22)` | `styles/sections/hero.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-41dc16d9` | Color | `#fdf6f6` | `styles/pages/site.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-41e5a9be` | Color | `rgba(0,0,0,.55)` | `styles/sections/hero.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-442c2bc9` | Color | `#75C9FF` | `styles/base/elements.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-4983678e` | Color | `rgba(250,248,244,.94)` | `styles/sections/header.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-5ab99a91` | Color | `#24AEC9` | `styles/components/nav.css` × 2 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-5c92274e` | Color | `#E04646` | Token aliases only: `styles/tokens/colors.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-6303459b` | Color | `rgba(0,0,0,.35)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-6e5bc0e0` | Color | `rgba(255,255,255,.1)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-78183030` | Color | `#8fd6ae` | `styles/utilities.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-7a92317e` | Color | `rgba(255,255,255,.15)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-81cc84d1` | Color | `#d5e5dd` | `styles/components/card.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-8782ed4b` | Color | `rgba(250,248,244,.97)` | `styles/sections/overlays.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-8b3cba4f` | Color | `rgba(200,145,47,.2)` | `styles/sections/hero.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-8ee5be53` | Color | `#d8e3e9` | `styles/components/card.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-90cf925e` | Color | `#E6FF00` | Token aliases only: `styles/tokens/spacing.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-9313786c` | Color | `rgba(255,255,255,.2)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-a23a9229` | Color | `#dfe8ec` | `styles/sections/footer.css` × 1; `styles/sections/overlays.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-aa897f37` | Color | `rgba(36,80,63,.16)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-ab5f2676` | Color | `#0E219A` | `styles/sections/hero.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-abfef18f` | Color | `#000000` | `styles/components/card.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-ae5def70` | Color | `rgba(255,255,255,.16)` | `styles/components/card.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-afa66cbe` | Color | `#b3c1ca` | `styles/sections/hero.css` × 2 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-afbd3dd1` | Color | `#2c3a44` | `styles/pages/site.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-b2668127` | Color | `#FF0004` | `styles/components/button.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-b6143d1d` | Color | `#078C7F` | Token aliases only: `styles/tokens/colors.css` × 3 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-b7edfb36` | Color | `#c3ced6` | `styles/pages/site.css` × 2; `styles/sections/footer.css` × 2; `styles/sections/hero.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-b8590dd1` | Color | `#106bf7` | `styles/sections/hero.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-bab0b826` | Color | `rgba(255,255,255,.22)` | `styles/components/form.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-bdbe0bae` | Color | `rgba(255,255,255,.07)` | `styles/components/form.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-c0c303aa` | Color | `rgba(255,255,255)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-c659d630` | Color | `#FFFFFF` | `styles/base/elements.css` × 4; `styles/pages/site.css` × 10; `styles/sections/footer.css` × 2; `styles/sections/overlays.css` × 2 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-c70f7488` | Color | `#8b9aa4` | `styles/components/form.css` × 1; `styles/utilities.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-c99a8d2d` | Color | `#b6c4cc` | `styles/components/card.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-d14f9016` | Color | `#fff` | `styles/components/button.css` × 2; `styles/utilities.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-d33d8596` | Color | `rgba(255,255,255,.02)` | `styles/sections/hero.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-d4e6d716` | Color | `#242021` | `styles/base/elements.css` × 3; `styles/components/card.css` × 16; `styles/components/form.css` × 1; `styles/components/nav.css` × 1; `styles/pages/site.css` × 19; `styles/sections/header.css` × 2; `styles/sections/hero.css` × 7; `styles/sections/utility.css` × 3; `styles/utilities.css` × 2 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-daedaf7b` | Color | `#0ABAB0` | `styles/components/card.css` × 1; `styles/sections/utility.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-df8d2052` | Color | `#35785c` | `styles/components/card.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-e3662748` | Color | `#fdf4f4` | `styles/components/card.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-ee4696c3` | Color | `#2b3a45` | `styles/components/card.css` × 5; `styles/components/nav.css` × 3 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-f0b461c0` | Color | `#FF0303` | `styles/sections/hero.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-f25a8159` | Color | `rgba(47,107,82,.35)` | `styles/sections/hero.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-fa2bdaf2` | Color | `#f0c874` | `styles/pages/site.css` × 1; `styles/sections/hero.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-fc428cab` | Color | `#241a06` | `styles/sections/footer.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-fc66a213` | Color | `#F08B74` | `styles/sections/footer.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-fceb112b` | Color | `#4683E0` | Token aliases only: `styles/tokens/colors.css` × 2 | Primitive color value used by color aliases and the styles listed. |
| `--color-value-fff37af7` | Color | `rgba(200,145,47,.16)` | `styles/pages/site.css` × 1; `styles/sections/hero.css` × 1 | Primitive color value used by color aliases and the styles listed. |
| `--consent-input-height` | Spacing / shape / effects | `var(--space-value-42d92f32)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--consent-input-margin` | Spacing / shape / effects | `var(--space-value-777f0349)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--consent-input-width` | Spacing / shape / effects | `var(--space-value-42d92f32)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--cookie-a-color` | Color | `var(--color-value-c659d630)` | `styles/sections/overlays.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--cookie-p-margin` | Spacing / shape / effects | `var(--space-value-b6589fc6)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--cookie-p-size` | Typography | `var(--type-value-0e7b1778)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--cream` | Color | `var(--color-cream)` | `styles/base/elements.css` × 1; `styles/components/card.css` × 1 | Color value or color alias used by the styles listed. |
| `--cred-li-color` | Color | `var(--color-value-ee4696c3)` | `styles/components/card.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--cred-li-margin` | Spacing / shape / effects | `var(--space-value-b6589fc6)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--cred-li-padding` | Spacing / shape / effects | `var(--space-value-8df514ef)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--cred-li-radius` | Spacing / shape / effects | `var(--space-value-e5383118)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls the border or corner shape for this element, component, or section. |
| `--cred-li-size` | Typography | `var(--type-value-5f68d829)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--cred-li-weight` | Typography | `var(--type-value-d8e4bbea)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--crm-h4-color` | Color | `var(--color-value-d4e6d716)` | `styles/components/card.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--crm-h4-size` | Typography | `var(--type-value-df724a4a)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--crm-pre-color` | Color | `var(--color-value-8ee5be53)` | `styles/components/card.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--crm-pre-font-family` | Typography | `var(--type-value-f0cbf885)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the font family or text metrics for this element, component, or section. |
| `--crm-pre-line-height` | Typography | `var(--type-value-aa8f289e)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the font family or text metrics for this element, component, or section. |
| `--crm-pre-margin` | Spacing / shape / effects | `var(--space-value-b6589fc6)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--crm-pre-size` | Typography | `var(--type-value-b0a544cd)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--crumbs-a-color` | Color | `var(--color-value-d4e6d716)` | `styles/sections/hero.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--crumbs-a-hover-color` | Color | `var(--color-value-ab5f2676)` | `styles/sections/hero.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--crumbs-a-weight` | Typography | `var(--type-value-15aa0c7e)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--crumbs-li-margin` | Spacing / shape / effects | `var(--space-value-b6589fc6)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--crumbs-li-marker-color` | Color | `var(--color-value-d4e6d716)` | `styles/sections/hero.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--crumbs-ol-margin` | Spacing / shape / effects | `var(--space-value-b6589fc6)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--crumbs-ol-padding` | Spacing / shape / effects | `var(--space-value-b6589fc6)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--danger` | Color | `var(--color-danger)` | `styles/components/card.css` × 5; `styles/pages/site.css` × 1 | Color value or color alias used by the styles listed. |
| `--dd-a-color` | Color | `var(--color-value-ee4696c3)` | `styles/components/nav.css` × 2 | Controls the color or background color of this element, component, or section. |
| `--dd-a-hover-color` | Color | `var(--green)` | `styles/components/nav.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--dd-a-padding` | Spacing / shape / effects | `var(--space-value-4880ea6f)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--dd-a-radius` | Spacing / shape / effects | `var(--space-value-933cc733)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls the border or corner shape for this element, component, or section. |
| `--dd-a-size` | Typography | `var(--type-value-04b2bc19)` | Token aliases only: `styles/tokens/typography.css` × 2 | Controls the text size or font weight for this element, component, or section. |
| `--dd-a-weight` | Typography | `var(--type-value-15aa0c7e)` | Token aliases only: `styles/tokens/typography.css` × 2 | Controls the text size or font weight for this element, component, or section. |
| `--details-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--details-color` | Color | `var(--ink)` | `styles/base/elements.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--details-font-family` | Typography | `var(--font-sans)` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--details-height` | Spacing / shape / effects | `var(--space-value-f3220ff5)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--details-line-height` | Typography | `normal` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--details-margin` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--details-padding` | Spacing / shape / effects | `var(--space-value-49dd3d7b)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--details-radius` | Spacing / shape / effects | `var(--space-value-c747825a)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls the border or corner shape for this element, component, or section. |
| `--details-shadow` | Spacing / shape / effects | `none` | Not directly referenced | Controls the shadow for this element, component, or section. |
| `--details-size` | Typography | `var(--type-value-84cb1e4e)` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--details-transition` | Spacing / shape / effects | `var(--space-value-8353f270)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls the transition behavior for this element, component, or section. |
| `--details-weight` | Typography | `var(--type-value-d8e4bbea)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--details-width` | Spacing / shape / effects | `var(--space-value-f3220ff5)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--div-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--div-color` | Color | `var(--color-text-body)` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--div-font-family` | Typography | `var(--font-sans)` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--div-line-height` | Typography | `normal` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--div-margin` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--div-padding` | Spacing / shape / effects | `0` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--div-radius` | Spacing / shape / effects | `0` | Not directly referenced | Controls the border or corner shape for this element, component, or section. |
| `--div-shadow` | Spacing / shape / effects | `none` | Not directly referenced | Controls the shadow for this element, component, or section. |
| `--div-size` | Typography | `var(--type-value-84cb1e4e)` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--div-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--div-weight` | Typography | `400` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--em-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--em-color` | Color | `var(--color-text-body)` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--em-font-family` | Typography | `var(--font-sans)` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--em-line-height` | Typography | `normal` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--em-margin` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--em-padding` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--em-radius` | Spacing / shape / effects | `0` | Not directly referenced | Controls the border or corner shape for this element, component, or section. |
| `--em-shadow` | Spacing / shape / effects | `none` | Not directly referenced | Controls the shadow for this element, component, or section. |
| `--em-size` | Typography | `var(--type-value-84cb1e4e)` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--em-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--em-weight` | Typography | `400` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--errm-a-color` | Color | `var(--danger)` | `styles/components/card.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--errm-a-weight` | Typography | `var(--type-value-d8e4bbea)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--errm-h3-color` | Color | `var(--danger)` | `styles/components/card.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--errm-h3-size` | Typography | `var(--type-value-19feeb88)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--errm-ul-margin` | Spacing / shape / effects | `var(--space-value-32523828)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--errm-ul-size` | Typography | `var(--type-value-931f2013)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--fbot-button-color` | Color | `var(--color-value-b7edfb36)` | `styles/sections/footer.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--fbot-button-padding` | Spacing / shape / effects | `var(--space-value-b6589fc6)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--field-label-color` | Color | `var(--ink)` | `styles/components/card.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--field-label-size` | Typography | `var(--type-value-21bcb484)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--field-label-weight` | Typography | `var(--type-value-d8e4bbea)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--fieldset-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--fieldset-color` | Color | `var(--color-text-body)` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--fieldset-font-family` | Typography | `var(--font-sans)` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--fieldset-line-height` | Typography | `normal` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--fieldset-margin` | Spacing / shape / effects | `var(--space-value-b6589fc6)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--fieldset-padding` | Spacing / shape / effects | `var(--space-value-6e53dc1f)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--fieldset-radius` | Spacing / shape / effects | `var(--space-value-c747825a)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls the border or corner shape for this element, component, or section. |
| `--fieldset-shadow` | Spacing / shape / effects | `none` | Not directly referenced | Controls the shadow for this element, component, or section. |
| `--fieldset-size` | Typography | `var(--type-value-84cb1e4e)` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--fieldset-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--fieldset-weight` | Typography | `400` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--figcaption-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--figcaption-color` | Color | `var(--color-text-body)` | `styles/components/card.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--figcaption-font-family` | Typography | `var(--font-sans)` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--figcaption-line-height` | Typography | `normal` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--figcaption-margin` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--figcaption-padding` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--figcaption-radius` | Spacing / shape / effects | `0` | Not directly referenced | Controls the border or corner shape for this element, component, or section. |
| `--figcaption-shadow` | Spacing / shape / effects | `none` | Not directly referenced | Controls the shadow for this element, component, or section. |
| `--figcaption-size` | Typography | `var(--type-value-84cb1e4e)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--figcaption-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--figcaption-weight` | Typography | `400` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--figure-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--figure-color` | Color | `var(--color-text-body)` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--figure-font-family` | Typography | `var(--font-sans)` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--figure-line-height` | Typography | `normal` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--figure-margin` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--figure-padding` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--figure-radius` | Spacing / shape / effects | `0` | Not directly referenced | Controls the border or corner shape for this element, component, or section. |
| `--figure-shadow` | Spacing / shape / effects | `none` | Not directly referenced | Controls the shadow for this element, component, or section. |
| `--figure-size` | Typography | `var(--type-value-84cb1e4e)` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--figure-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--figure-weight` | Typography | `400` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--font` | Typography | `var(--font-sans)` | Token aliases only: `styles/tokens/typography.css` × 1 | Typography value or element-level typography control. |
| `--font-mono` | Typography | `ui-monospace,SFMono-Regular,Menlo,Consolas,monospace` | Token aliases only: `styles/tokens/typography.css` × 1 | Typography value or element-level typography control. |
| `--font-sans` | Typography | `ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif` | Token aliases only: `styles/tokens/typography.css` × 47 | Typography value or element-level typography control. |
| `--footer-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--footer-color` | Color | `var(--color-text-body)` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--footer-font-family` | Typography | `var(--font-sans)` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--footer-line-height` | Typography | `normal` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--footer-margin` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--footer-p-color` | Color | `var(--p-color)` | `styles/sections/footer.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--footer-padding` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--footer-radius` | Spacing / shape / effects | `0` | Not directly referenced | Controls the border or corner shape for this element, component, or section. |
| `--footer-shadow` | Spacing / shape / effects | `none` | Not directly referenced | Controls the shadow for this element, component, or section. |
| `--footer-size` | Typography | `var(--type-value-84cb1e4e)` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--footer-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--footer-weight` | Typography | `400` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--form-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--form-color` | Color | `var(--color-text-body)` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--form-font-family` | Typography | `var(--font-sans)` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--form-line-height` | Typography | `normal` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--form-margin` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--form-padding` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--form-radius` | Spacing / shape / effects | `0` | Not directly referenced | Controls the border or corner shape for this element, component, or section. |
| `--form-shadow` | Spacing / shape / effects | `none` | Not directly referenced | Controls the shadow for this element, component, or section. |
| `--form-size` | Typography | `var(--type-value-84cb1e4e)` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--form-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--form-weight` | Typography | `400` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--ftr-a-color` | Color | `var(--color-value-b7edfb36)` | `styles/sections/footer.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--ftr-a-hover-color` | Color | `var(--color-value-c659d630)` | `styles/sections/footer.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--ftr-a-weight` | Typography | `var(--type-value-d8e4bbea)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--ftr-h2-color` | Color | `var(--color-value-c659d630)` | `styles/sections/footer.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--ftr-h2-letter-spacing` | Typography | `var(--type-value-f1e0522f)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the font family or text metrics for this element, component, or section. |
| `--ftr-h2-size` | Typography | `var(--type-value-dbd07cbf)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--ftr-ul-margin` | Spacing / shape / effects | `var(--space-value-b6589fc6)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--ftr-ul-padding` | Spacing / shape / effects | `var(--space-value-b6589fc6)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--green` | Color | `var(--color-teal)` | `styles/base/elements.css` × 3; `styles/components/button.css` × 1; `styles/components/card.css` × 6; `styles/components/nav.css` × 1 | Color value or color alias used by the styles listed. |
| `--green2` | Color | `var(--color-green)` | Not directly referenced | Color value or color alias used by the styles listed. |
| `--gtint` | Color | `var(--color-green-tint)` | `styles/components/card.css` × 2; `styles/components/nav.css` × 2 | Color value or color alias used by the styles listed. |
| `--gutter` | Spacing / shape / effects | `var(--layout-gutter)` | Token aliases only: `styles/tokens/spacing.css` × 4 | Spacing, dimension, shape, border, shadow, or transition control. |
| `--h1-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--h1-color` | Color | `var(--color-heading)` | `styles/base/elements.css` × 1; `styles/sections/hero.css` × 2 | Controls the color or background color of this element, component, or section. |
| `--h1-font-family` | Typography | `var(--font-sans)` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--h1-letter-spacing` | Typography | `var(--type-value-e3b25333)` | Token aliases only: `styles/tokens/typography.css` × 2 | Controls the font family or text metrics for this element, component, or section. |
| `--h1-line-height` | Typography | `var(--type-value-562e2573)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the font family or text metrics for this element, component, or section. |
| `--h1-margin` | Spacing / shape / effects | `var(--space-value-498b2144)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--h1-padding` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--h1-radius` | Spacing / shape / effects | `0` | Not directly referenced | Controls the border or corner shape for this element, component, or section. |
| `--h1-shadow` | Spacing / shape / effects | `none` | Not directly referenced | Controls the shadow for this element, component, or section. |
| `--h1-size` | Typography | `var(--type-value-7ad63770)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--h1-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--h1-weight` | Typography | `var(--type-value-290a52e4)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--h2-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--h2-color` | Color | `var(--color-heading)` | `styles/base/elements.css` × 2; `styles/components/card.css` × 1; `styles/pages/site.css` × 2; `styles/sections/footer.css` × 1; `styles/sections/hero.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--h2-font-family` | Typography | `var(--font-sans)` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--h2-letter-spacing` | Typography | `var(--type-value-e3b25333)` | Token aliases only: `styles/tokens/typography.css` × 2 | Controls the font family or text metrics for this element, component, or section. |
| `--h2-line-height` | Typography | `var(--type-value-562e2573)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the font family or text metrics for this element, component, or section. |
| `--h2-margin` | Spacing / shape / effects | `var(--space-value-498b2144)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--h2-padding` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--h2-radius` | Spacing / shape / effects | `0` | Not directly referenced | Controls the border or corner shape for this element, component, or section. |
| `--h2-shadow` | Spacing / shape / effects | `none` | Not directly referenced | Controls the shadow for this element, component, or section. |
| `--h2-size` | Typography | `var(--type-value-9e0a3e71)` | Token aliases only: `styles/tokens/typography.css` × 3 | Controls the text size or font weight for this element, component, or section. |
| `--h2-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--h2-weight` | Typography | `var(--type-value-290a52e4)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--h3-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--h3-color` | Color | `var(--color-heading)` | `styles/base/elements.css` × 1; `styles/components/card.css` × 2; `styles/pages/site.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--h3-font-family` | Typography | `var(--font-sans)` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--h3-letter-spacing` | Typography | `var(--type-value-e3b25333)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the font family or text metrics for this element, component, or section. |
| `--h3-line-height` | Typography | `var(--type-value-562e2573)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the font family or text metrics for this element, component, or section. |
| `--h3-margin` | Spacing / shape / effects | `var(--space-value-498b2144)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--h3-padding` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--h3-radius` | Spacing / shape / effects | `0` | Not directly referenced | Controls the border or corner shape for this element, component, or section. |
| `--h3-shadow` | Spacing / shape / effects | `none` | Not directly referenced | Controls the shadow for this element, component, or section. |
| `--h3-size` | Typography | `var(--type-value-6f62c54b)` | Token aliases only: `styles/tokens/typography.css` × 5 | Controls the text size or font weight for this element, component, or section. |
| `--h3-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--h3-weight` | Typography | `var(--type-value-290a52e4)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--h4-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--h4-color` | Color | `var(--color-heading)` | `styles/base/elements.css` × 1; `styles/components/card.css` × 1; `styles/pages/site.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--h4-font-family` | Typography | `var(--font-sans)` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--h4-letter-spacing` | Typography | `var(--type-value-e3b25333)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the font family or text metrics for this element, component, or section. |
| `--h4-line-height` | Typography | `var(--type-value-562e2573)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the font family or text metrics for this element, component, or section. |
| `--h4-margin` | Spacing / shape / effects | `var(--space-value-498b2144)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--h4-padding` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--h4-radius` | Spacing / shape / effects | `0` | Not directly referenced | Controls the border or corner shape for this element, component, or section. |
| `--h4-shadow` | Spacing / shape / effects | `none` | Not directly referenced | Controls the shadow for this element, component, or section. |
| `--h4-size` | Typography | `var(--type-value-91166e8e)` | Token aliases only: `styles/tokens/typography.css` × 2 | Controls the text size or font weight for this element, component, or section. |
| `--h4-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--h4-weight` | Typography | `var(--type-value-290a52e4)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--h5-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--h5-color` | Color | `var(--color-heading)` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--h5-font-family` | Typography | `var(--font-sans)` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--h5-line-height` | Typography | `normal` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--h5-margin` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--h5-padding` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--h5-radius` | Spacing / shape / effects | `0` | Not directly referenced | Controls the border or corner shape for this element, component, or section. |
| `--h5-shadow` | Spacing / shape / effects | `none` | Not directly referenced | Controls the shadow for this element, component, or section. |
| `--h5-size` | Typography | `var(--type-value-84cb1e4e)` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--h5-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--h5-weight` | Typography | `400` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--h6-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--h6-color` | Color | `var(--color-heading)` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--h6-font-family` | Typography | `var(--font-sans)` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--h6-line-height` | Typography | `normal` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--h6-margin` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--h6-padding` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--h6-radius` | Spacing / shape / effects | `0` | Not directly referenced | Controls the border or corner shape for this element, component, or section. |
| `--h6-shadow` | Spacing / shape / effects | `none` | Not directly referenced | Controls the shadow for this element, component, or section. |
| `--h6-size` | Typography | `var(--type-value-84cb1e4e)` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--h6-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--h6-weight` | Typography | `400` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--hcard-h2-color` | Color | `var(--color-value-d4e6d716)` | `styles/sections/hero.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--hcard-h2-size` | Typography | `var(--type-value-4b3c2ac5)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--hcard-p-color` | Color | `var(--color-value-04d197de)` | `styles/sections/hero.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--hcard-p-margin` | Spacing / shape / effects | `var(--space-value-1f995445)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--hcard-p-size` | Typography | `var(--type-value-931f2013)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--header-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--header-color` | Color | `var(--color-text-body)` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--header-font-family` | Typography | `var(--font-sans)` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--header-line-height` | Typography | `normal` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--header-margin` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--header-padding` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--header-radius` | Spacing / shape / effects | `0` | Not directly referenced | Controls the border or corner shape for this element, component, or section. |
| `--header-shadow` | Spacing / shape / effects | `none` | Not directly referenced | Controls the shadow for this element, component, or section. |
| `--header-size` | Typography | `var(--type-value-84cb1e4e)` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--header-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--header-weight` | Typography | `400` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--hero-h1-color` | Color | `var(--h1-color)` | `styles/sections/hero.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--hero-li-margin` | Spacing / shape / effects | `var(--space-value-b6589fc6)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--hero-p-color` | Color | `var(--color-hero-text)` | `styles/sections/hero.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--hero-svg-color` | Color | `var(--color-value-b8590dd1)` | `styles/sections/hero.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--hero-ul-color` | Color | `var(--color-value-d4e6d716)` | `styles/sections/hero.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--hero-ul-margin` | Spacing / shape / effects | `var(--space-value-d396a314)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--hero-ul-padding` | Spacing / shape / effects | `var(--space-value-b6589fc6)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--hero-ul-size` | Typography | `var(--type-value-f27ff6d4)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--hours-b-color` | Color | `var(--ink)` | `styles/components/card.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--hours-li-color` | Color | `var(--muted)` | `styles/components/card.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--hours-li-margin` | Spacing / shape / effects | `var(--space-value-b6589fc6)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--hours-li-padding` | Spacing / shape / effects | `var(--space-value-d3f63ef7)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--i-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--i-color` | Color | `var(--color-text-body)` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--i-font-family` | Typography | `var(--font-sans)` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--i-line-height` | Typography | `normal` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--i-margin` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--i-padding` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--i-radius` | Spacing / shape / effects | `0` | Not directly referenced | Controls the border or corner shape for this element, component, or section. |
| `--i-shadow` | Spacing / shape / effects | `none` | Not directly referenced | Controls the shadow for this element, component, or section. |
| `--i-size` | Typography | `var(--type-value-84cb1e4e)` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--i-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--i-weight` | Typography | `400` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--img-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--img-color` | Color | `var(--color-text-body)` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--img-font-family` | Typography | `var(--font-sans)` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--img-line-height` | Typography | `normal` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--img-margin` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--img-padding` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--img-radius` | Spacing / shape / effects | `0` | Not directly referenced | Controls the border or corner shape for this element, component, or section. |
| `--img-shadow` | Spacing / shape / effects | `none` | Not directly referenced | Controls the shadow for this element, component, or section. |
| `--img-size` | Typography | `var(--type-value-84cb1e4e)` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--img-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--img-weight` | Typography | `400` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--ink` | Color | `var(--color-ink)` | `styles/base/elements.css` × 10; `styles/components/card.css` × 7; `styles/components/nav.css` × 1; `styles/pages/site.css` × 1; `styles/sections/footer.css` × 1; `styles/sections/hero.css` × 2; `styles/sections/overlays.css` × 1; `styles/utilities.css` × 1 | Color value or color alias used by the styles listed. |
| `--ink2` | Color | `var(--color-ink-soft)` | `styles/sections/overlays.css` × 1 | Color value or color alias used by the styles listed. |
| `--input-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--input-color` | Color | `var(--ink)` | `styles/base/elements.css` × 1; `styles/components/form.css` × 2 | Controls the color or background color of this element, component, or section. |
| `--input-font-family` | Typography | `var(--font-sans)` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--input-line-height` | Typography | `normal` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--input-margin` | Spacing / shape / effects | `0` | Token aliases only: `styles/tokens/spacing.css` × 2 | Controls spacing or dimensions for this element, component, or section. |
| `--input-padding` | Spacing / shape / effects | `var(--space-value-4880ea6f)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--input-radius` | Spacing / shape / effects | `var(--space-value-9bc5fefa)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls the border or corner shape for this element, component, or section. |
| `--input-shadow` | Spacing / shape / effects | `var(--space-value-9eebee1b)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls the shadow for this element, component, or section. |
| `--input-size` | Typography | `var(--type-value-84cb1e4e)` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--input-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--input-weight` | Typography | `400` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--input-width` | Spacing / shape / effects | `var(--space-value-fae31ece)` | Token aliases only: `styles/tokens/spacing.css` × 4 | Controls spacing or dimensions for this element, component, or section. |
| `--label-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--label-color` | Color | `var(--color-text-body)` | `styles/components/card.css` × 1; `styles/sections/overlays.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--label-font-family` | Typography | `var(--font-sans)` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--label-line-height` | Typography | `normal` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--label-margin` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--label-padding` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--label-radius` | Spacing / shape / effects | `0` | Not directly referenced | Controls the border or corner shape for this element, component, or section. |
| `--label-shadow` | Spacing / shape / effects | `none` | Not directly referenced | Controls the shadow for this element, component, or section. |
| `--label-size` | Typography | `var(--type-value-84cb1e4e)` | Token aliases only: `styles/tokens/typography.css` × 2 | Controls the text size or font weight for this element, component, or section. |
| `--label-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--label-weight` | Typography | `400` | Token aliases only: `styles/tokens/typography.css` × 2 | Controls the text size or font weight for this element, component, or section. |
| `--layout-gutter` | Spacing / shape / effects | `clamp(1rem,3vw,1.75rem)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Spacing, dimension, shape, border, shadow, or transition control. |
| `--layout-max-width` | Spacing / shape / effects | `1200px` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--legend-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--legend-color` | Color | `var(--color-text-body)` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--legend-font-family` | Typography | `var(--font-sans)` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--legend-line-height` | Typography | `normal` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--legend-margin` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--legend-padding` | Spacing / shape / effects | `var(--space-value-b300b0e3)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--legend-radius` | Spacing / shape / effects | `0` | Not directly referenced | Controls the border or corner shape for this element, component, or section. |
| `--legend-shadow` | Spacing / shape / effects | `none` | Not directly referenced | Controls the shadow for this element, component, or section. |
| `--legend-size` | Typography | `var(--type-value-84cb1e4e)` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--legend-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--legend-weight` | Typography | `400` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--li-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--li-color` | Color | `var(--color-paragraph)` | `styles/base/elements.css` × 1; `styles/components/card.css` × 3; `styles/pages/site.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--li-font-family` | Typography | `var(--font-sans)` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--li-line-height` | Typography | `normal` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the font family or text metrics for this element, component, or section. |
| `--li-margin` | Spacing / shape / effects | `0` | Token aliases only: `styles/tokens/spacing.css` × 7 | Controls spacing or dimensions for this element, component, or section. |
| `--li-marker-color` | Color | `var(--color-accent)` | `styles/components/card.css` × 1; `styles/sections/hero.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--li-padding` | Spacing / shape / effects | `0` | Token aliases only: `styles/tokens/spacing.css` × 6 | Controls spacing or dimensions for this element, component, or section. |
| `--li-radius` | Spacing / shape / effects | `0` | Token aliases only: `styles/tokens/spacing.css` × 5 | Controls the border or corner shape for this element, component, or section. |
| `--li-shadow` | Spacing / shape / effects | `none` | Not directly referenced | Controls the shadow for this element, component, or section. |
| `--li-size` | Typography | `var(--type-value-84cb1e4e)` | Token aliases only: `styles/tokens/typography.css` × 5 | Controls the text size or font weight for this element, component, or section. |
| `--li-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--li-weight` | Typography | `400` | Token aliases only: `styles/tokens/typography.css` × 3 | Controls the text size or font weight for this element, component, or section. |
| `--line` | Color | `var(--color-line)` | `styles/components/card.css` × 1 | Color value or color alias used by the styles listed. |
| `--line2` | Color | `var(--color-line-strong)` | Token aliases only: `styles/tokens/spacing.css` × 3 | Color value or color alias used by the styles listed. |
| `--main-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--main-color` | Color | `var(--color-text-body)` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--main-font-family` | Typography | `var(--font-sans)` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--main-line-height` | Typography | `normal` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--main-margin` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--main-padding` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--main-radius` | Spacing / shape / effects | `0` | Not directly referenced | Controls the border or corner shape for this element, component, or section. |
| `--main-shadow` | Spacing / shape / effects | `none` | Not directly referenced | Controls the shadow for this element, component, or section. |
| `--main-size` | Typography | `var(--type-value-84cb1e4e)` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--main-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--main-weight` | Typography | `400` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--maxw` | Spacing / shape / effects | `var(--layout-max-width)` | `styles/pages/tokens-preview.css` × 1 | Spacing, dimension, shape, border, shadow, or transition control. |
| `--mono` | Typography | `var(--font-mono)` | Token aliases only: `styles/tokens/typography.css` × 1 | Typography value or element-level typography control. |
| `--muted` | Color | `var(--color-muted)` | `styles/components/card.css` × 10; `styles/components/nav.css` × 1; `styles/sections/hero.css` × 1; `styles/utilities.css` × 2 | Color value or color alias used by the styles listed. |
| `--nap-b-color` | Color | `var(--ink)` | `styles/components/card.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--nap-li-margin` | Spacing / shape / effects | `var(--space-value-b6589fc6)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--nap-li-padding` | Spacing / shape / effects | `var(--space-value-32104160)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--nap-li-size` | Typography | `var(--type-value-ed7a8e9b)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--nap-svg-color` | Color | `var(--green)` | `styles/components/card.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--nav-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--nav-color` | Color | `var(--color-text-body)` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--nav-font-family` | Typography | `var(--font-sans)` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--nav-line-height` | Typography | `normal` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--nav-margin` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--nav-padding` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--nav-radius` | Spacing / shape / effects | `0` | Not directly referenced | Controls the border or corner shape for this element, component, or section. |
| `--nav-shadow` | Spacing / shape / effects | `none` | Not directly referenced | Controls the shadow for this element, component, or section. |
| `--nav-size` | Typography | `var(--type-value-84cb1e4e)` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--nav-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--nav-weight` | Typography | `400` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--news-input-color` | Color | `var(--color-value-d4e6d716)` | `styles/components/form.css` × 2 | Controls the color or background color of this element, component, or section. |
| `--ol-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--ol-color` | Color | `var(--color-list-text)` | `styles/base/elements.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--ol-font-family` | Typography | `var(--font-sans)` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--ol-line-height` | Typography | `normal` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--ol-margin` | Spacing / shape / effects | `var(--space-value-576fcca9)` | Token aliases only: `styles/tokens/spacing.css` × 2 | Controls spacing or dimensions for this element, component, or section. |
| `--ol-padding` | Spacing / shape / effects | `0` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--ol-radius` | Spacing / shape / effects | `0` | Not directly referenced | Controls the border or corner shape for this element, component, or section. |
| `--ol-shadow` | Spacing / shape / effects | `none` | Not directly referenced | Controls the shadow for this element, component, or section. |
| `--ol-size` | Typography | `var(--type-value-84cb1e4e)` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--ol-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--ol-weight` | Typography | `400` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--p-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--p-color` | Color | `var(--color-paragraph)` | `styles/base/elements.css` × 2; `styles/components/card.css` × 4; `styles/pages/site.css` × 4; `styles/sections/footer.css` × 1; `styles/sections/hero.css` × 3 | Controls the color or background color of this element, component, or section. |
| `--p-font-family` | Typography | `var(--type-value-fed8ff10)` | Token aliases only: `styles/tokens/typography.css` × 2 | Controls the font family or text metrics for this element, component, or section. |
| `--p-line-height` | Typography | `normal` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--p-margin` | Spacing / shape / effects | `var(--space-value-576fcca9)` | Token aliases only: `styles/tokens/spacing.css` × 6 | Controls spacing or dimensions for this element, component, or section. |
| `--p-padding` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--p-radius` | Spacing / shape / effects | `0` | Not directly referenced | Controls the border or corner shape for this element, component, or section. |
| `--p-shadow` | Spacing / shape / effects | `none` | Not directly referenced | Controls the shadow for this element, component, or section. |
| `--p-size` | Typography | `var(--type-value-f7ccf9b1)` | Token aliases only: `styles/tokens/typography.css` × 5 | Controls the text size or font weight for this element, component, or section. |
| `--p-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--p-weight` | Typography | `400` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--person-h3-size` | Typography | `var(--type-value-a9aa53fa)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--person-p-color` | Color | `var(--muted)` | `styles/components/card.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--person-p-margin` | Spacing / shape / effects | `var(--space-value-71f710ad)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--person-p-size` | Typography | `var(--type-value-21bcb484)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--phero-h1-color` | Color | `var(--h1-color)` | `styles/sections/hero.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--phero-p-color` | Color | `var(--color-value-04d197de)` | `styles/sections/hero.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--pill` | Spacing / shape / effects | `var(--radius-pill)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Spacing, dimension, shape, border, shadow, or transition control. |
| `--pre-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--pre-color` | Color | `var(--color-text-body)` | `styles/components/card.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--pre-font-family` | Typography | `var(--font-sans)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the font family or text metrics for this element, component, or section. |
| `--pre-line-height` | Typography | `normal` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the font family or text metrics for this element, component, or section. |
| `--pre-margin` | Spacing / shape / effects | `0` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--pre-padding` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--pre-radius` | Spacing / shape / effects | `0` | Not directly referenced | Controls the border or corner shape for this element, component, or section. |
| `--pre-shadow` | Spacing / shape / effects | `none` | Not directly referenced | Controls the shadow for this element, component, or section. |
| `--pre-size` | Typography | `var(--type-value-84cb1e4e)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--pre-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--pre-weight` | Typography | `400` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--prefs-input-height` | Spacing / shape / effects | `var(--space-value-998b02c2)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--prefs-input-width` | Spacing / shape / effects | `var(--space-value-998b02c2)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--prefs-label-color` | Color | `var(--color-value-a23a9229)` | `styles/sections/overlays.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--prefs-label-size` | Typography | `var(--type-value-0e7b1778)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--prefs-label-weight` | Typography | `var(--type-value-15aa0c7e)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--preview-icon-size` | Spacing / shape / effects | `var(--space-value-c00ca4cc)` | `styles/pages/tokens-preview.css` × 2 | Controls the text size or font weight for this element, component, or section. |
| `--preview-media-height` | Spacing / shape / effects | `15rem` | `styles/pages/tokens-preview.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--preview-min-column` | Spacing / shape / effects | `22rem` | `styles/pages/tokens-preview.css` × 1 | Spacing, dimension, shape, border, shadow, or transition control. |
| `--preview-sample-height` | Spacing / shape / effects | `5rem` | `styles/pages/tokens-preview.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--prose-h3-size` | Typography | `var(--type-value-2862aaf9)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--r` | Spacing / shape / effects | `var(--radius-card)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Spacing, dimension, shape, border, shadow, or transition control. |
| `--radio-input-height` | Spacing / shape / effects | `var(--space-value-998b02c2)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--radio-input-margin` | Spacing / shape / effects | `var(--space-value-3d3a41fd)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--radio-input-width` | Spacing / shape / effects | `var(--space-value-998b02c2)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--radio-small-color` | Color | `var(--muted)` | `styles/components/card.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--radio-small-size` | Typography | `var(--type-value-68df68d0)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--radio-small-weight` | Typography | `var(--type-value-f83a383c)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--radio-span-color` | Color | `var(--color-value-ee4696c3)` | `styles/components/card.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--radio-span-size` | Typography | `var(--type-value-931f2013)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--radio-span-weight` | Typography | `var(--type-value-15aa0c7e)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--radius-card` | Spacing / shape / effects | `14px` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls the border or corner shape for this element, component, or section. |
| `--radius-large` | Spacing / shape / effects | `22px` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls the border or corner shape for this element, component, or section. |
| `--radius-pill` | Spacing / shape / effects | `999px` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls the border or corner shape for this element, component, or section. |
| `--review-b-color` | Color | `var(--ink)` | `styles/components/card.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--review-b-size` | Typography | `var(--type-value-931f2013)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--review-blockquote-color` | Color | `var(--color-value-ee4696c3)` | `styles/components/card.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--review-blockquote-margin` | Spacing / shape / effects | `var(--space-value-b6589fc6)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--review-blockquote-size` | Typography | `var(--type-value-b3eb7630)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--review-figcaption-color` | Color | `var(--muted)` | `styles/components/card.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--review-figcaption-size` | Typography | `var(--type-value-56bd79d9)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--rlg` | Spacing / shape / effects | `var(--radius-large)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Spacing, dimension, shape, border, shadow, or transition control. |
| `--s-cream-article-color` | Color | `var(--color-card-text)` | `styles/pages/site.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--s-cream-p-color` | Color | `var(--color-card-text)` | `styles/pages/site.css` × 2 | Controls the color or background color of this element, component, or section. |
| `--s-cream-strong-color` | Color | `var(--color-card-text)` | `styles/pages/site.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--s-dark-a-color` | Color | `var(--color-value-c659d630)` | `styles/pages/site.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--s-dark-h2-color` | Color | `var(--color-value-c659d630)` | `styles/pages/site.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--s-dark-h3-color` | Color | `var(--color-value-c659d630)` | `styles/pages/site.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--s-dark-h4-color` | Color | `var(--color-value-c659d630)` | `styles/pages/site.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--s-dark-li-color` | Color | `var(--color-value-b7edfb36)` | `styles/pages/site.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--s-dark-p-color` | Color | `var(--color-value-c659d630)` | `styles/pages/site.css` × 2 | Controls the color or background color of this element, component, or section. |
| `--section-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--section-color` | Color | `var(--color-text-body)` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--section-font-family` | Typography | `var(--font-sans)` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--section-line-height` | Typography | `normal` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--section-margin` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--section-padding` | Spacing / shape / effects | `clamp(2.5rem,6vw,4.5rem)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--section-radius` | Spacing / shape / effects | `0` | Not directly referenced | Controls the border or corner shape for this element, component, or section. |
| `--section-shadow` | Spacing / shape / effects | `none` | Not directly referenced | Controls the shadow for this element, component, or section. |
| `--section-size` | Typography | `var(--type-value-84cb1e4e)` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--section-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--section-weight` | Typography | `400` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--secy` | Spacing / shape / effects | `var(--section-padding)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Spacing, dimension, shape, border, shadow, or transition control. |
| `--select-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--select-color` | Color | `var(--ink)` | `styles/base/elements.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--select-font-family` | Typography | `var(--font-sans)` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--select-line-height` | Typography | `normal` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--select-margin` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--select-padding` | Spacing / shape / effects | `var(--space-value-4880ea6f)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--select-radius` | Spacing / shape / effects | `var(--space-value-9bc5fefa)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls the border or corner shape for this element, component, or section. |
| `--select-shadow` | Spacing / shape / effects | `var(--space-value-9eebee1b)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls the shadow for this element, component, or section. |
| `--select-size` | Typography | `var(--type-value-84cb1e4e)` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--select-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--select-weight` | Typography | `400` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--select-width` | Spacing / shape / effects | `var(--space-value-fae31ece)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--sh2` | Spacing / shape / effects | `var(--shadow-medium)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Spacing, dimension, shape, border, shadow, or transition control. |
| `--sh3` | Spacing / shape / effects | `var(--shadow-large)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Spacing, dimension, shape, border, shadow, or transition control. |
| `--shadow-large` | Spacing / shape / effects | `0 22px 60px rgba(16,24,32,.16)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls the shadow for this element, component, or section. |
| `--shadow-medium` | Spacing / shape / effects | `0 8px 28px rgba(16,24,32,.10)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls the shadow for this element, component, or section. |
| `--small-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--small-color` | Color | `var(--color-text-body)` | `styles/components/card.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--small-font-family` | Typography | `var(--font-sans)` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--small-line-height` | Typography | `normal` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--small-margin` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--small-padding` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--small-radius` | Spacing / shape / effects | `0` | Not directly referenced | Controls the border or corner shape for this element, component, or section. |
| `--small-shadow` | Spacing / shape / effects | `none` | Not directly referenced | Controls the shadow for this element, component, or section. |
| `--small-size` | Typography | `var(--type-value-84cb1e4e)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--small-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--small-weight` | Typography | `400` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--social-a-color` | Color | `var(--color-value-a23a9229)` | `styles/sections/footer.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--social-a-height` | Spacing / shape / effects | `var(--space-value-6e8c5a87)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--social-a-hover-color` | Color | `var(--color-value-fc428cab)` | `styles/sections/footer.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--social-a-radius` | Spacing / shape / effects | `var(--space-value-933cc733)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls the border or corner shape for this element, component, or section. |
| `--social-a-width` | Spacing / shape / effects | `var(--space-value-6e8c5a87)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--source-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--source-color` | Color | `var(--color-text-body)` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--source-font-family` | Typography | `var(--font-sans)` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--source-line-height` | Typography | `normal` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--source-margin` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--source-padding` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--source-radius` | Spacing / shape / effects | `0` | Not directly referenced | Controls the border or corner shape for this element, component, or section. |
| `--source-shadow` | Spacing / shape / effects | `none` | Not directly referenced | Controls the shadow for this element, component, or section. |
| `--source-size` | Typography | `var(--type-value-84cb1e4e)` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--source-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--source-weight` | Typography | `400` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--space-value-0160ac9b` | Spacing / shape / effects | `62%` | `styles/sections/hero.css` × 1; `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-022261ca` | Spacing / shape / effects | `2px solid var(--color-value-038e6f38)` | `styles/components/button.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-0246bc9d` | Spacing / shape / effects | `var(--page-select-shadow, var(--select-shadow, var(--space-value-9eebee1b)))` | `styles/base/elements.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-04fa1f6e` | Spacing / shape / effects | `.6rem .75rem` | `styles/components/nav.css` × 2 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-0581e7cb` | Spacing / shape / effects | `0 0 0 3px var(--gtint)` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-06287055` | Spacing / shape / effects | `83%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-0702447d` | Spacing / shape / effects | `clamp(1.75rem,5vw,3rem)` | `styles/sections/hero.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-07514548` | Spacing / shape / effects | `27%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-07cbdd5c` | Spacing / shape / effects | `460px` | `styles/sections/hero.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-081acf28` | Spacing / shape / effects | `1.25rem` | `styles/components/card.css` × 2; `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-0927635a` | Spacing / shape / effects | `900px` | `styles/sections/hero.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-09390078` | Spacing / shape / effects | `12px` | `styles/components/card.css` × 1; `styles/sections/header.css` × 2 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-0b7acfa4` | Spacing / shape / effects | `69%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-0ceeaa92` | Spacing / shape / effects | `var(--page-fieldset-margin, var(--fieldset-margin, var(--space-value-b6589fc6)))` | `styles/base/elements.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-0d2cb0c9` | Spacing / shape / effects | `var(--page-h3-margin, var(--h3-margin, var(--space-value-498b2144)))` | `styles/base/elements.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-0d612c12` | Spacing / shape / effects | `auto` | `styles/base/elements.css` × 2; `styles/components/card.css` × 3; `styles/components/nav.css` × 2; `styles/pages/site.css` × 1; `styles/sections/overlays.css` × 1; `styles/sections/utility.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-0d893111` | Spacing / shape / effects | `38px` | `styles/sections/hero.css` × 3; `styles/sections/utility.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-0d9a006b` | Spacing / shape / effects | `.9rem 1.1rem` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-10afc772` | Spacing / shape / effects | `87%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-12537bff` | Spacing / shape / effects | `.2rem` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-157d8af9` | Spacing / shape / effects | `17px` | `styles/utilities.css` × 2 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-181c734b` | Spacing / shape / effects | `300px` | `styles/components/nav.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-185d3397` | Spacing / shape / effects | `var(--page-ul-margin, var(--ftr-ul-margin, var(--ul-margin, var(--space-value-b6589fc6))))` | `styles/sections/footer.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-192c1a6c` | Spacing / shape / effects | `var(--page-legend-padding, var(--legend-padding, var(--space-value-b300b0e3)))` | `styles/base/elements.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-1971b504` | Spacing / shape / effects | `60%` | `styles/sections/hero.css` × 2; `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-19feeb88` | Spacing / shape / effects | `1rem` | `styles/base/elements.css` × 1; `styles/components/card.css` × 3; `styles/pages/tokens-preview.css` × 2; `styles/sections/footer.css` × 1; `styles/sections/header.css` × 1; `styles/sections/hero.css` × 2; `styles/sections/overlays.css` × 4; `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-1b9bc553` | Spacing / shape / effects | `.4rem 1.1rem` | `styles/sections/utility.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-1c1d4ebb` | Spacing / shape / effects | `68%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-1cefb640` | Spacing / shape / effects | `1.15rem 1.25rem 1.15rem 4rem` | Token aliases only: `styles/tokens/spacing.css` × 2 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-1d2a8e23` | Spacing / shape / effects | `46px` | `styles/components/card.css` × 2; `styles/components/nav.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-1da4b315` | Spacing / shape / effects | `var(--page-select-radius, var(--select-radius, var(--space-value-9bc5fefa)))` | `styles/base/elements.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-1df30ffd` | Spacing / shape / effects | `10%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-1eb3ff8c` | Spacing / shape / effects | `33%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-1f0dae1d` | Spacing / shape / effects | `.6rem 1.25rem` | `styles/sections/footer.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-1f61f2d8` | Spacing / shape / effects | `3%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-1f995445` | Spacing / shape / effects | `1rem 0 0` | `styles/components/card.css` × 1; `styles/components/nav.css` × 1; `styles/sections/footer.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-21a81437` | Spacing / shape / effects | `42px` | `styles/components/button.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-21c51d13` | Spacing / shape / effects | `1px dashed var(--line2)` | `styles/components/card.css` × 2 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-22346946` | Spacing / shape / effects | `16%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-22983907` | Spacing / shape / effects | `70%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-22be94e0` | Spacing / shape / effects | `9px` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-22ed05db` | Spacing / shape / effects | `24%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-235d3774` | Spacing / shape / effects | `var(--page-input-radius, var(--input-radius, var(--space-value-9bc5fefa)))` | `styles/base/elements.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-24126b21` | Spacing / shape / effects | `1.1rem` | `styles/components/card.css` × 5; `styles/sections/hero.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-24271f9c` | Spacing / shape / effects | `4%` | `styles/sections/hero.css` × 1; `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-252832e4` | Spacing / shape / effects | `34%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-25f492a7` | Spacing / shape / effects | `var(--page-textarea-shadow, var(--textarea-shadow, var(--space-value-9eebee1b)))` | `styles/base/elements.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-2854b8dd` | Spacing / shape / effects | `var(--page-li-margin, var(--nap-li-margin, var(--li-margin, var(--space-value-b6589fc6))))` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-28f667fc` | Spacing / shape / effects | `1.75rem` | `styles/utilities.css` × 2 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-2a0ae5e0` | Spacing / shape / effects | `width .3s` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-2b01c5b3` | Spacing / shape / effects | `15%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-2d898965` | Spacing / shape / effects | `var(--page-li-margin, var(--hero-li-margin, var(--li-margin, var(--space-value-b6589fc6))))` | `styles/sections/hero.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-2d9da29a` | Spacing / shape / effects | `1.1rem 1.2rem` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-2e11f484` | Spacing / shape / effects | `5%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-2eb3bf0c` | Spacing / shape / effects | `74%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-2ef576d5` | Spacing / shape / effects | `53%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-2efb2fce` | Spacing / shape / effects | `3rem 1.5rem` | `styles/sections/footer.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-2fe35ac7` | Spacing / shape / effects | `var(--page-ul-padding, var(--check-ul-padding, var(--ul-padding, var(--space-value-b6589fc6))))` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-308bbc07` | Spacing / shape / effects | `var(--page-select-width, var(--select-width, var(--space-value-fae31ece)))` | `styles/base/elements.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-318a110b` | Spacing / shape / effects | `.85rem 1.4rem` | `styles/components/button.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-31db320e` | Spacing / shape / effects | `var(--page-p-margin, var(--p-margin, var(--space-value-576fcca9)))` | `styles/base/elements.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-31f56625` | Spacing / shape / effects | `2.1` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-32104160` | Spacing / shape / effects | `.85rem 0` | Token aliases only: `styles/tokens/spacing.css` × 2 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-32523828` | Spacing / shape / effects | `0 0 .5rem` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-3263fd41` | Spacing / shape / effects | `48px` | `styles/base/elements.css` × 3; `styles/components/button.css` × 1; `styles/components/form.css` × 1; `styles/sections/overlays.css` × 2 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-326bba6e` | Spacing / shape / effects | `var(--page-a-width, var(--social-a-width, var(--a-width, var(--space-value-6e8c5a87))))` | `styles/sections/footer.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-332d7daf` | Spacing / shape / effects | `56px` | `styles/base/elements.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-335fbbe1` | Spacing / shape / effects | `70ch` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-3391dba9` | Spacing / shape / effects | `190px` | `styles/components/form.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-366915d3` | Spacing / shape / effects | `.25rem` | `styles/components/card.css` × 2 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-36b78727` | Spacing / shape / effects | `var(--page-input-width, var(--input-width, var(--space-value-fae31ece)))` | `styles/base/elements.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-380b5b9c` | Spacing / shape / effects | `.95rem .2rem` | `styles/components/nav.css` × 2 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-38355a1e` | Spacing / shape / effects | `.4rem 0 0` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-38d08201` | Spacing / shape / effects | `49%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-3951047c` | Spacing / shape / effects | `1.35rem` | `styles/components/card.css` × 1; `styles/sections/footer.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-396734d0` | Spacing / shape / effects | `var(--page-input-height, var(--prefs-input-height, var(--input-height, var(--space-value-998b02c2))))` | `styles/sections/overlays.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-39e12565` | Spacing / shape / effects | `57%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-3a39c10e` | Spacing / shape / effects | `99%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-3bb15466` | Spacing / shape / effects | `35%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-3bdb1ac0` | Spacing / shape / effects | `1.5px solid var(--line2)` | `styles/base/elements.css` × 3; `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-3ce44345` | Spacing / shape / effects | `var(--page-textarea-width, var(--textarea-width, var(--space-value-fae31ece)))` | `styles/base/elements.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-3d3a41fd` | Spacing / shape / effects | `.15rem 0 0` | Token aliases only: `styles/tokens/spacing.css` × 2 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-3e1bab1a` | Spacing / shape / effects | `var(--page-pre-margin, var(--crm-pre-margin, var(--pre-margin, var(--space-value-b6589fc6))))` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-3f53fd2c` | Spacing / shape / effects | `var(--page-li-radius, var(--areas-li-radius, var(--li-radius, var(--space-value-e5383118))))` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-40f4a0aa` | Spacing / shape / effects | `47%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-410c1f58` | Spacing / shape / effects | `44px` | `styles/components/nav.css` × 2; `styles/sections/header.css` × 3 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-42d92f32` | Spacing / shape / effects | `22px` | `styles/components/card.css` × 2; `styles/utilities.css` × 2 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-42eb8ecd` | Spacing / shape / effects | `19%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-433bdb13` | Spacing / shape / effects | `0%` | `styles/sections/hero.css` × 1; `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-43a13720` | Spacing / shape / effects | `var(--page-li-padding, var(--cred-li-padding, var(--li-padding, var(--space-value-8df514ef))))` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-44652ad3` | Spacing / shape / effects | `9%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-448142c9` | Spacing / shape / effects | `.55rem 1rem` | `styles/components/button.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-4678bd4d` | Spacing / shape / effects | `16px` | `styles/utilities.css` × 2 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-46fa76eb` | Spacing / shape / effects | `var(--page-input-width, var(--prefs-input-width, var(--input-width, var(--space-value-998b02c2))))` | `styles/sections/overlays.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-484541d3` | Spacing / shape / effects | `21%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-4880ea6f` | Spacing / shape / effects | `.7rem .8rem` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-4952fef0` | Spacing / shape / effects | `67%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-498b2144` | Spacing / shape / effects | `0 0 .55em` | Token aliases only: `styles/tokens/spacing.css` × 8 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-4995f41f` | Spacing / shape / effects | `52%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-49c57bc3` | Spacing / shape / effects | `var(--page-li-margin, var(--hours-li-margin, var(--li-margin, var(--space-value-b6589fc6))))` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-49dd3d7b` | Spacing / shape / effects | `1.05rem 1.2rem` | Token aliases only: `styles/tokens/spacing.css` × 2 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-4a1258d3` | Spacing / shape / effects | `var(--page-ol-margin, var(--crumbs-ol-margin, var(--ol-margin, var(--space-value-b6589fc6))))` | `styles/sections/hero.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-4a684233` | Spacing / shape / effects | `17%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-4a85d235` | Spacing / shape / effects | `var(--page-a-radius, var(--social-a-radius, var(--a-radius, var(--space-value-933cc733))))` | `styles/sections/footer.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-4bd46d40` | Spacing / shape / effects | `11px` | `styles/utilities.css` × 2 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-4c245eda` | Spacing / shape / effects | `61%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-4de1740d` | Spacing / shape / effects | `0 8px 8px 0` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-4e322ab5` | Spacing / shape / effects | `var(--page-input-shadow, var(--input-shadow, var(--space-value-9eebee1b)))` | `styles/base/elements.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-5366a741` | Spacing / shape / effects | `80%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-536c8b63` | Spacing / shape / effects | `0 0 .5rem .75rem` | `styles/components/nav.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-53ce0fa1` | Spacing / shape / effects | `2.5rem` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-554145fe` | Spacing / shape / effects | `7%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-56bd79d9` | Spacing / shape / effects | `.85rem` | `styles/pages/site.css` × 1; `styles/sections/hero.css` × 1; `styles/utilities.css` × 2 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-576fcca9` | Spacing / shape / effects | `0 0 1em` | Token aliases only: `styles/tokens/spacing.css` × 6 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-57b8abd6` | Spacing / shape / effects | `var(--page-button-padding, var(--fbot-button-padding, var(--button-padding, var(--space-value-b6589fc6))))` | `styles/sections/footer.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-581ef1c0` | Spacing / shape / effects | `1.4rem` | `styles/components/card.css` × 1; `styles/pages/site.css` × 2; `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-595d64f7` | Spacing / shape / effects | `340px` | `styles/sections/hero.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-5a56436f` | Spacing / shape / effects | `76px` | `styles/base/elements.css` × 1; `styles/sections/header.css` × 1; `styles/sections/overlays.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-5bc25046` | Spacing / shape / effects | `73%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-5be8ff9c` | Spacing / shape / effects | `32%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-5c367353` | Spacing / shape / effects | `14%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-5c4af411` | Spacing / shape / effects | `700px` | `styles/sections/hero.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-5c6e4a88` | Spacing / shape / effects | `13%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-5e1164e3` | Spacing / shape / effects | `25%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-5f23ad53` | Spacing / shape / effects | `92%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-5f5369e3` | Spacing / shape / effects | `95%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-60ac4cf4` | Spacing / shape / effects | `.75rem` | `styles/components/card.css` × 3; `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-63562330` | Spacing / shape / effects | `var(--page-h2-margin, var(--h2-margin, var(--space-value-498b2144)))` | `styles/base/elements.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-63a1f029` | Spacing / shape / effects | `1rem 1.15rem` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-65026bc6` | Spacing / shape / effects | `55%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-6564dffb` | Spacing / shape / effects | `var(--page-ul-margin, var(--hero-ul-margin, var(--ul-margin, var(--space-value-d396a314))))` | `styles/sections/hero.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-6625a535` | Spacing / shape / effects | `110px` | `styles/base/elements.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-67223e4b` | Spacing / shape / effects | `22%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-67a5d378` | Spacing / shape / effects | `var(--page-ul-margin, var(--ul-margin, var(--space-value-576fcca9)))` | `styles/base/elements.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-67e1f678` | Spacing / shape / effects | `95px` | `styles/utilities.css` × 2 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-6a7c9b6c` | Spacing / shape / effects | `0 1.2rem 1.25rem` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-6b7f7522` | Spacing / shape / effects | `var(--page-details-width, var(--details-width, var(--space-value-f3220ff5)))` | `styles/base/elements.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-6d27d54c` | Spacing / shape / effects | `18px` | `styles/utilities.css` × 2 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-6d775596` | Spacing / shape / effects | `1.15rem` | `styles/components/card.css` × 2 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-6dd6198f` | Spacing / shape / effects | `86%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-6e53dc1f` | Spacing / shape / effects | `1rem 1.1rem` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-6e8c5a87` | Spacing / shape / effects | `40px` | Token aliases only: `styles/tokens/spacing.css` × 4 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-6ff04128` | Spacing / shape / effects | `var(--page-table-width, var(--table-width, var(--space-value-fae31ece)))` | `styles/base/elements.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-70a4c273` | Spacing / shape / effects | `.5rem var(--gutter) 1.25rem` | `styles/components/nav.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-71154317` | Spacing / shape / effects | `18%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-71f710ad` | Spacing / shape / effects | `0 0 .6rem` | Token aliases only: `styles/tokens/spacing.css` × 2 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-71f8e797` | Spacing / shape / effects | `none` | `styles/base/elements.css` × 3; `styles/components/nav.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-72175589` | Spacing / shape / effects | `72%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-7278eb9a` | Spacing / shape / effects | `calc(100% + 8px)` | `styles/components/nav.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-72bc1f2e` | Spacing / shape / effects | `var(--page-li-padding, var(--steps-li-padding, var(--li-padding, var(--space-value-1cefb640))))` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-72e0d79f` | Spacing / shape / effects | `31%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-74c43630` | Spacing / shape / effects | `var(--page-blockquote-margin, var(--review-blockquote-margin, var(--blockquote-margin, var(--space-value-b6589fc6))))` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-756ef30a` | Spacing / shape / effects | `1.25rem 1.15rem` | Token aliases only: `styles/tokens/spacing.css` × 2 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-75d4b67a` | Spacing / shape / effects | `var(--secy)` | `styles/pages/site.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-760a2108` | Spacing / shape / effects | `clamp(1.25rem,3vw,1.8rem)` | `styles/sections/hero.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-767be8ac` | Spacing / shape / effects | `36%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-76c6d531` | Spacing / shape / effects | `var(--page-textarea-padding, var(--textarea-padding, var(--space-value-4880ea6f)))` | `styles/base/elements.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-776d3c5d` | Spacing / shape / effects | `var(--page-p-margin, var(--person-p-margin, var(--p-margin, var(--space-value-71f710ad))))` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-777b5dbe` | Spacing / shape / effects | `2px solid var(--line)` | `styles/components/nav.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-777f0349` | Spacing / shape / effects | `.1rem 0 0` | Token aliases only: `styles/tokens/spacing.css` × 2 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-77947d93` | Spacing / shape / effects | `78%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-78cb336e` | Spacing / shape / effects | `var(--page-a-padding, var(--dd-a-padding, var(--a-padding, var(--space-value-4880ea6f))))` | `styles/components/nav.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-78db41a0` | Spacing / shape / effects | `76ch` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-7a21e730` | Spacing / shape / effects | `.12rem` | `styles/components/card.css` × 1; `styles/components/nav.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-7a328ebc` | Spacing / shape / effects | `3px` | `styles/base/elements.css` × 2 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-7a51e844` | Spacing / shape / effects | `var(--page-fieldset-radius, var(--fieldset-radius, var(--space-value-c747825a)))` | `styles/base/elements.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-7a7be06d` | Spacing / shape / effects | `var(--page-li-height, var(--check-li-height, var(--li-height, var(--space-value-e401c87c))))` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-7e078309` | Spacing / shape / effects | `40%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-7ebe8af3` | Spacing / shape / effects | `var(--page-li-width, var(--check-li-width, var(--li-width, var(--space-value-bcf5b954))))` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-7f1e68b7` | Spacing / shape / effects | `var(--page-p-margin, var(--steps-p-margin, var(--p-margin, var(--space-value-b6589fc6))))` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-7f7cde03` | Spacing / shape / effects | `48%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-816e3238` | Spacing / shape / effects | `79%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-832075f3` | Spacing / shape / effects | `.4rem` | `styles/components/card.css` × 2; `styles/sections/hero.css` × 2; `styles/sections/utility.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-834e4bbe` | Spacing / shape / effects | `var(--page-fieldset-padding, var(--fieldset-padding, var(--space-value-6e53dc1f)))` | `styles/base/elements.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-8353f270` | Spacing / shape / effects | `transform .2s` | Token aliases only: `styles/tokens/spacing.css` × 2 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-83896a58` | Spacing / shape / effects | `var(--page-p-margin, var(--cookie-p-margin, var(--p-margin, var(--space-value-b6589fc6))))` | `styles/sections/overlays.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-8396b077` | Spacing / shape / effects | `91%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-842543af` | Spacing / shape / effects | `30%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-85a2c538` | Spacing / shape / effects | `2%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-863afc26` | Spacing / shape / effects | `var(--page-textarea-radius, var(--textarea-radius, var(--space-value-9bc5fefa)))` | `styles/base/elements.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-86786d39` | Spacing / shape / effects | `12%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-87bbba78` | Spacing / shape / effects | `1px solid var(--line2)` | `styles/components/nav.css` × 1; `styles/sections/overlays.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-89926590` | Spacing / shape / effects | `41%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-89b56256` | Spacing / shape / effects | `var(--page-ol-padding, var(--crumbs-ol-padding, var(--ol-padding, var(--space-value-b6589fc6))))` | `styles/sections/hero.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-8a14c4da` | Spacing / shape / effects | `-9999px` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-8a488450` | Spacing / shape / effects | `transform .15s,background-color .15s,border-color .15s,color .15s` | `styles/components/button.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-8a9d054b` | Spacing / shape / effects | `1.7rem` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-8ab0d45b` | Spacing / shape / effects | `28%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-8ad9a209` | Spacing / shape / effects | `6%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-8bd99321` | Spacing / shape / effects | `400px` | `styles/sections/hero.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-8c6f03d8` | Spacing / shape / effects | `var(--sh2)` | `styles/components/nav.css` × 1; `styles/sections/overlays.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-8c8f5dda` | Spacing / shape / effects | `var(--page-ol-margin, var(--ol-margin, var(--space-value-576fcca9)))` | `styles/base/elements.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-8dc85add` | Spacing / shape / effects | `3px solid var(--color-value-90cf925e)` | `styles/base/elements.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-8df514ef` | Spacing / shape / effects | `.24rem .65rem` | Token aliases only: `styles/tokens/spacing.css` × 2 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-8eeb378a` | Spacing / shape / effects | `46%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-8f0eedcf` | Spacing / shape / effects | `var(--page-ul-margin, var(--errm-ul-margin, var(--ul-margin, var(--space-value-32523828))))` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-8f325628` | Spacing / shape / effects | `var(--page-h4-margin, var(--h4-margin, var(--space-value-498b2144)))` | `styles/base/elements.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-8f54ad9c` | Spacing / shape / effects | `2.5px solid var(--brass2)` | `styles/base/elements.css` × 2 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-906d5978` | Spacing / shape / effects | `var(--page-input-margin, var(--radio-input-margin, var(--input-margin, var(--space-value-3d3a41fd))))` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-909607b5` | Spacing / shape / effects | `.28rem .7rem` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-90f617f5` | Spacing / shape / effects | `8%` | `styles/sections/hero.css` × 1; `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-92de6cfe` | Spacing / shape / effects | `.3rem .75rem` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-9308dd18` | Spacing / shape / effects | `59%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-933cc733` | Spacing / shape / effects | `10px` | `styles/components/nav.css` × 3; `styles/sections/hero.css` × 1; `styles/sections/overlays.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-945f6f61` | Spacing / shape / effects | `.35em` | `styles/base/elements.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-95a092b6` | Spacing / shape / effects | `var(--page-li-padding, var(--steps-li-padding, var(--li-padding, var(--space-value-bc6af3d8))))` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-96bb10aa` | Spacing / shape / effects | `var(--page-p-margin, var(--hcard-p-margin, var(--p-margin, var(--space-value-1f995445))))` | `styles/sections/hero.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-9846be38` | Spacing / shape / effects | `var(--maxw)` | `styles/base/elements.css` × 1; `styles/sections/overlays.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-9896dd02` | Spacing / shape / effects | `1px solid var(--color-value-0634c16c)` | `styles/sections/footer.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-991f41c8` | Spacing / shape / effects | `var(--page-h1-margin, var(--h1-margin, var(--space-value-498b2144)))` | `styles/base/elements.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-998b02c2` | Spacing / shape / effects | `20px` | `styles/components/card.css` × 2; `styles/sections/overlays.css` × 2 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-9a80b8e2` | Spacing / shape / effects | `85%` | `styles/sections/hero.css` × 1; `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-9bc5fefa` | Spacing / shape / effects | `8px` | `styles/components/card.css` × 1; `styles/pages/tokens-preview.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-9bd10294` | Spacing / shape / effects | `var(--page-details-radius, var(--details-radius, var(--space-value-c747825a)))` | `styles/base/elements.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-9c4e77b0` | Spacing / shape / effects | `var(--page-details-transition, var(--details-transition, var(--space-value-8353f270)))` | `styles/base/elements.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-9ca36b13` | Spacing / shape / effects | `.001ms` | `styles/utilities.css` × 6 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-9d1b38ca` | Spacing / shape / effects | `var(--rlg)` | `styles/components/card.css` × 2; `styles/sections/hero.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-9e0741c0` | Spacing / shape / effects | `1px` | `styles/components/card.css` × 3; `styles/utilities.css` × 2 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-9ec47261` | Spacing / shape / effects | `93%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-9eebee1b` | Spacing / shape / effects | `0 0 0 3px var(--color-value-aa897f37)` | Token aliases only: `styles/tokens/spacing.css` × 6 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-9eedb6a6` | Spacing / shape / effects | `var(--page-input-padding, var(--input-padding, var(--space-value-4880ea6f)))` | `styles/base/elements.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-a0179b92` | Spacing / shape / effects | `2px` | `styles/pages/site.css` × 2 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-a08a4ddf` | Spacing / shape / effects | `1px solid var(--line)` | `styles/base/elements.css` × 4; `styles/components/card.css` × 8; `styles/components/nav.css` × 3; `styles/pages/tokens-preview.css` × 2; `styles/sections/header.css` × 1; `styles/sections/overlays.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-a23d8869` | Spacing / shape / effects | `1.5rem` | `styles/components/card.css` × 3; `styles/sections/overlays.css` × 1; `styles/utilities.css` × 2 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-a29a05fe` | Spacing / shape / effects | `.5rem 1.1rem` | `styles/sections/hero.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-a3013801` | Spacing / shape / effects | `89%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-a3832926` | Spacing / shape / effects | `-1px` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-a66f139d` | Spacing / shape / effects | `64ch` | `styles/base/elements.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-a78a731c` | Spacing / shape / effects | `1%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-a835cbd0` | Spacing / shape / effects | `2px solid var(--danger)` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-a9051779` | Spacing / shape / effects | `860px` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-a9aa53fa` | Spacing / shape / effects | `1.05rem` | `styles/components/card.css` × 2 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-a9ff303b` | Spacing / shape / effects | `82%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-aaafe353` | Spacing / shape / effects | `4px solid var(--brass)` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-ab446959` | Spacing / shape / effects | `.45rem` | `styles/components/card.css` × 1; `styles/sections/hero.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-ac1106eb` | Spacing / shape / effects | `var(--page-li-margin, var(--cred-li-margin, var(--li-margin, var(--space-value-b6589fc6))))` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-ad753f8f` | Spacing / shape / effects | `76%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-b09690c0` | Spacing / shape / effects | `var(--page-li-radius, var(--steps-li-radius, var(--li-radius, var(--space-value-c747825a))))` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-b0e2c0f7` | Spacing / shape / effects | `var(--page-table-padding, var(--table-padding, var(--space-value-c0e0a910)))` | `styles/base/elements.css` × 2 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-b122514d` | Spacing / shape / effects | `0 -14px 40px var(--color-value-6303459b)` | `styles/sections/overlays.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-b129abe6` | Spacing / shape / effects | `64%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-b25b06ee` | Spacing / shape / effects | `29%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-b28e912a` | Spacing / shape / effects | `var(--page-ul-margin, var(--check-ul-margin, var(--ul-margin, var(--space-value-1f995445))))` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-b300b0e3` | Spacing / shape / effects | `0 .4rem` | Token aliases only: `styles/tokens/spacing.css` × 2 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-b31374e6` | Spacing / shape / effects | `63%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-b354d7c5` | Spacing / shape / effects | `66%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-b3787397` | Spacing / shape / effects | `54%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-b3d56fe0` | Spacing / shape / effects | `130px` | `styles/base/elements.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-b3ead9c0` | Spacing / shape / effects | `2.5px solid var(--green)` | `styles/components/card.css` × 2 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-b46da6ec` | Spacing / shape / effects | `50%` | `styles/components/card.css` × 2; `styles/sections/overlays.css` × 1; `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-b4f57001` | Spacing / shape / effects | `44%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-b6589fc6` | Spacing / shape / effects | `0` | `styles/base/elements.css` × 1; `styles/components/card.css` × 16; `styles/components/nav.css` × 11; `styles/pages/tokens-preview.css` × 1; `styles/sections/footer.css` × 2; `styles/sections/header.css` × 1; `styles/sections/hero.css` × 6; `styles/sections/overlays.css` × 6; `styles/utilities.css` × 3 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-b77a111b` | Spacing / shape / effects | `75%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-b77f8138` | Spacing / shape / effects | `var(--page-li-margin, var(--steps-li-margin, var(--li-margin, var(--space-value-b6589fc6))))` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-b7976d5d` | Spacing / shape / effects | `1px solid var(--color-value-c0c303aa)` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-ba70c106` | Spacing / shape / effects | `var(--page-li-padding, var(--hours-li-padding, var(--li-padding, var(--space-value-d3f63ef7))))` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-bbc7d25c` | Spacing / shape / effects | `58%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-bc493dc5` | Spacing / shape / effects | `.15rem` | `styles/components/card.css` × 1; `styles/components/nav.css` × 1; `styles/sections/overlays.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-bc6af3d8` | Spacing / shape / effects | `.22rem .48rem` | Token aliases only: `styles/tokens/spacing.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-bcf5b954` | Spacing / shape / effects | `.72rem` | Token aliases only: `styles/tokens/spacing.css` × 2 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-bd157246` | Spacing / shape / effects | `81%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-be988b06` | Spacing / shape / effects | `var(--page-details-padding, var(--details-padding, var(--space-value-49dd3d7b)))` | `styles/base/elements.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-c00ca4cc` | Spacing / shape / effects | `2rem` | `styles/components/card.css` × 1; `styles/pages/tokens-preview.css` × 7; `styles/sections/footer.css` × 1; `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-c078f10a` | Spacing / shape / effects | `760px` | `styles/sections/hero.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-c0e0a910` | Spacing / shape / effects | `.65rem .7rem` | Token aliases only: `styles/tokens/spacing.css` × 2 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-c2b1f971` | Spacing / shape / effects | `1.5rem 0 1rem` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-c3b5ed1f` | Spacing / shape / effects | `.35rem .85rem` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-c4515ecc` | Spacing / shape / effects | `11%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-c46804a3` | Spacing / shape / effects | `.35rem` | `styles/components/card.css` × 3; `styles/components/nav.css` × 2; `styles/sections/hero.css` × 1; `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-c51b8559` | Spacing / shape / effects | `62px` | `styles/components/card.css` × 3 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-c6361069` | Spacing / shape / effects | `1px solid var(--color-value-9313786c)` | `styles/sections/hero.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-c6422ef6` | Spacing / shape / effects | `.35rem .8rem` | Token aliases only: `styles/tokens/spacing.css` × 2 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-c7199d9c` | Spacing / shape / effects | `var(--page-li-padding, var(--nap-li-padding, var(--li-padding, var(--space-value-32104160))))` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-c747825a` | Spacing / shape / effects | `var(--r)` | `styles/components/card.css` × 6; `styles/components/nav.css` × 1; `styles/sections/hero.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-c7dc0ba7` | Spacing / shape / effects | `var(--sh3)` | `styles/components/card.css` × 1; `styles/components/nav.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-c8c1bb10` | Spacing / shape / effects | `54px` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-cb8c27c6` | Spacing / shape / effects | `19px` | `styles/utilities.css` × 2 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-ccd5bff1` | Spacing / shape / effects | `var(--page-li-radius, var(--check-li-radius, var(--li-radius, var(--space-value-9e0741c0))))` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-cd14cf41` | Spacing / shape / effects | `var(--page-input-width, var(--radio-input-width, var(--input-width, var(--space-value-998b02c2))))` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-ce25e2fd` | Spacing / shape / effects | `90%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-cf7403e9` | Spacing / shape / effects | `var(--page-input-height, var(--consent-input-height, var(--input-height, var(--space-value-42d92f32))))` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-cf89ed1b` | Spacing / shape / effects | `var(--page-li-margin, var(--areas-li-margin, var(--li-margin, var(--space-value-b6589fc6))))` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-d176fd99` | Spacing / shape / effects | `5px` | `styles/base/elements.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-d2c19af7` | Spacing / shape / effects | `.65rem .5rem` | `styles/sections/overlays.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-d2eb9a22` | Spacing / shape / effects | `clamp(1.75rem,4vw,3rem)` | `styles/sections/hero.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-d382733f` | Spacing / shape / effects | `-13px` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-d396a314` | Spacing / shape / effects | `1.25rem 0 0` | Token aliases only: `styles/tokens/spacing.css` × 2 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-d3f63ef7` | Spacing / shape / effects | `.15rem 0` | Token aliases only: `styles/tokens/spacing.css` × 2 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-d4104e52` | Spacing / shape / effects | `39%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-d5aad3c7` | Spacing / shape / effects | `26%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-d5d08715` | Spacing / shape / effects | `var(--page-p-margin, var(--band-p-margin, var(--p-margin, var(--space-value-b6589fc6))))` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-d6522538` | Spacing / shape / effects | `14px` | `styles/utilities.css` × 2 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-d79c0a8e` | Spacing / shape / effects | `71%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-d8166fe8` | Spacing / shape / effects | `var(--page-li-margin, var(--crumbs-li-margin, var(--li-margin, var(--space-value-b6589fc6))))` | `styles/sections/hero.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-d86ea437` | Spacing / shape / effects | `56%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-d90ad277` | Spacing / shape / effects | `34ch` | `styles/pages/tokens-preview.css` × 1; `styles/sections/footer.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-d93380e0` | Spacing / shape / effects | `51%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-d93b9cb0` | Spacing / shape / effects | `var(--page-select-padding, var(--select-padding, var(--space-value-4880ea6f)))` | `styles/base/elements.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-d9e8b67e` | Spacing / shape / effects | `var(--gutter)` | `styles/base/elements.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-da4b9237` | Spacing / shape / effects | `2` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-dab32834` | Spacing / shape / effects | `var(--page-ul-padding, var(--ftr-ul-padding, var(--ul-padding, var(--space-value-b6589fc6))))` | `styles/sections/footer.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-dbd07cbf` | Spacing / shape / effects | `.8rem` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-dc7416dc` | Spacing / shape / effects | `calc(100vh - 114px)` | `styles/components/nav.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-dd06bf5f` | Spacing / shape / effects | `94%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-dd3f0eec` | Spacing / shape / effects | `var(--page-a-radius, var(--dd-a-radius, var(--a-radius, var(--space-value-933cc733))))` | `styles/components/nav.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-de43299b` | Spacing / shape / effects | `var(--page-div-padding, var(--strip-div-padding, var(--div-padding, var(--space-value-756ef30a))))` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-df5b9760` | Spacing / shape / effects | `42%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-df724a4a` | Spacing / shape / effects | `.9rem` | `styles/components/card.css` × 1; `styles/sections/footer.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-df761356` | Spacing / shape / effects | `23%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-e0e12229` | Spacing / shape / effects | `var(--page-input-margin, var(--consent-input-margin, var(--input-margin, var(--space-value-777f0349))))` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-e18abe86` | Spacing / shape / effects | `var(--page-ul-padding, var(--hero-ul-padding, var(--ul-padding, var(--space-value-b6589fc6))))` | `styles/sections/hero.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-e1ab1c83` | Spacing / shape / effects | `.6rem var(--gutter)` | `styles/sections/overlays.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-e3676a20` | Spacing / shape / effects | `77%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-e401c87c` | Spacing / shape / effects | `.42rem` | Token aliases only: `styles/tokens/spacing.css` × 2 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-e5383118` | Spacing / shape / effects | `var(--pill)` | `styles/components/button.css` × 1; `styles/components/card.css` × 3 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-e616d4a7` | Spacing / shape / effects | `.8rem 0 1rem` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-e62daccb` | Spacing / shape / effects | `var(--page-input-width, var(--consent-input-width, var(--input-width, var(--space-value-42d92f32))))` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-e7d7287c` | Spacing / shape / effects | `98%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-e7e5331f` | Spacing / shape / effects | `37%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-e911ea5f` | Spacing / shape / effects | `88%` | `styles/sections/hero.css` × 1; `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-ea3a2c23` | Spacing / shape / effects | `65%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-ea7ba466` | Spacing / shape / effects | `20%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-eacc3b3f` | Spacing / shape / effects | `clamp(1.15rem,2.2vw,1.55rem)` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-eb04400e` | Spacing / shape / effects | `84%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-ebb09abb` | Spacing / shape / effects | `var(--page-details-height, var(--details-height, var(--space-value-f3220ff5)))` | `styles/base/elements.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-ec714b3c` | Spacing / shape / effects | `clamp(1.6rem,4vw,2.5rem)` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-ec9db81c` | Spacing / shape / effects | `1.5px` | `styles/base/elements.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-ed3e3880` | Spacing / shape / effects | `1.1rem var(--gutter)` | `styles/sections/overlays.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-ed7a8e9b` | Spacing / shape / effects | `.95rem` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-ee074028` | Spacing / shape / effects | `.42em` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-ee18e975` | Spacing / shape / effects | `1px solid var(--color-value-7a92317e)` | `styles/sections/overlays.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-ef1997a6` | Spacing / shape / effects | `var(--page-li-radius, var(--cred-li-radius, var(--li-radius, var(--space-value-e5383118))))` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-f00c9397` | Spacing / shape / effects | `2.25rem` | `styles/sections/footer.css` × 1; `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-f0d5281d` | Spacing / shape / effects | `45%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-f2749d47` | Spacing / shape / effects | `1.25em` | `styles/base/elements.css` × 2 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-f3220ff5` | Spacing / shape / effects | `.6rem` | `styles/components/card.css` × 3; `styles/components/form.css` × 1; `styles/components/nav.css` × 1; `styles/sections/footer.css` × 1; `styles/sections/overlays.css` × 1; `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-f32be6c0` | Spacing / shape / effects | `var(--page-a-height, var(--social-a-height, var(--a-height, var(--space-value-6e8c5a87))))` | `styles/sections/footer.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-f3463b06` | Spacing / shape / effects | `var(--page-li-radius, var(--steps-li-radius, var(--li-radius, var(--space-value-9bc5fefa))))` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-f3d381bd` | Spacing / shape / effects | `var(--page-li-padding, var(--areas-li-padding, var(--li-padding, var(--space-value-c6422ef6))))` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-f3ecadf1` | Spacing / shape / effects | `5.5rem` | `styles/sections/overlays.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-f4b7e0a1` | Spacing / shape / effects | `38%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-f6707b68` | Spacing / shape / effects | `.6rem .8rem` | `styles/components/nav.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-f73364d9` | Spacing / shape / effects | `.7rem` | `styles/components/button.css` × 1; `styles/components/card.css` × 2; `styles/sections/header.css` × 1; `styles/sections/hero.css` × 1; `styles/sections/overlays.css` × 1; `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-f9c77748` | Spacing / shape / effects | `1.6rem 1.4rem` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-fa215cbf` | Spacing / shape / effects | `clamp(2.25rem,6vw,4.25rem)` | `styles/sections/hero.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-fa9a7f92` | Spacing / shape / effects | `var(--page-input-height, var(--radio-input-height, var(--input-height, var(--space-value-998b02c2))))` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-fae31ece` | Spacing / shape / effects | `100%` | `styles/base/elements.css` × 2; `styles/components/button.css` × 1; `styles/components/card.css` × 1; `styles/components/nav.css` × 4; `styles/sections/hero.css` × 3; `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-fb781421` | Spacing / shape / effects | `97%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-fc0d7ecf` | Spacing / shape / effects | `1px solid var(--color-value-6e5bc0e0)` | `styles/sections/hero.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-fd3d4db3` | Spacing / shape / effects | `.5rem` | `styles/base/elements.css` × 1; `styles/components/button.css` × 1; `styles/components/card.css` × 4; `styles/components/form.css` × 1; `styles/components/nav.css` × 2; `styles/pages/site.css` × 1; `styles/sections/footer.css` × 1; `styles/sections/hero.css` × 1; `styles/sections/overlays.css` × 2; `styles/sections/utility.css` × 1; `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-fd61c5e2` | Spacing / shape / effects | `96%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-fef591ee` | Spacing / shape / effects | `43%` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-ffcebd47` | Spacing / shape / effects | `1.2rem` | `styles/utilities.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--space-value-ffeea962` | Spacing / shape / effects | `99px` | `styles/components/card.css` × 1 | Primitive spacing, dimension, border, radius, shadow, or transition value. |
| `--span-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--span-color` | Color | `var(--color-text-body)` | `styles/components/card.css` × 3; `styles/sections/header.css` × 1; `styles/sections/hero.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--span-font-family` | Typography | `var(--font-sans)` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--span-line-height` | Typography | `normal` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--span-margin` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--span-padding` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--span-radius` | Spacing / shape / effects | `0` | Not directly referenced | Controls the border or corner shape for this element, component, or section. |
| `--span-shadow` | Spacing / shape / effects | `none` | Not directly referenced | Controls the shadow for this element, component, or section. |
| `--span-size` | Typography | `var(--type-value-84cb1e4e)` | Token aliases only: `styles/tokens/typography.css` × 5 | Controls the text size or font weight for this element, component, or section. |
| `--span-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--span-weight` | Typography | `400` | Token aliases only: `styles/tokens/typography.css` × 4 | Controls the text size or font weight for this element, component, or section. |
| `--steps-h3-color` | Color | `var(--color-value-abfef18f)` | `styles/components/card.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--steps-h3-size` | Typography | `var(--type-value-19feeb88)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--steps-li-line-height` | Typography | `var(--type-value-a26f8340)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the font family or text metrics for this element, component, or section. |
| `--steps-li-margin` | Spacing / shape / effects | `var(--space-value-b6589fc6)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--steps-li-marker-color` | Color | `var(--color-value-d4e6d716)` | `styles/components/card.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--steps-li-padding` | Spacing / shape / effects | `var(--space-value-1cefb640)` | Token aliases only: `styles/tokens/spacing.css` × 2 | Controls spacing or dimensions for this element, component, or section. |
| `--steps-li-radius` | Spacing / shape / effects | `var(--space-value-c747825a)` | Token aliases only: `styles/tokens/spacing.css` × 2 | Controls the border or corner shape for this element, component, or section. |
| `--steps-li-size` | Typography | `var(--type-value-68df68d0)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--steps-li-weight` | Typography | `var(--type-value-28cc2209)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--steps-p-color` | Color | `var(--muted)` | `styles/components/card.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--steps-p-margin` | Spacing / shape / effects | `var(--space-value-b6589fc6)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--steps-p-size` | Typography | `var(--type-value-21bcb484)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--strip-b-color` | Color | `var(--color-value-d4e6d716)` | `styles/components/card.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--strip-b-letter-spacing` | Typography | `var(--type-value-e3b25333)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the font family or text metrics for this element, component, or section. |
| `--strip-b-line-height` | Typography | `var(--type-value-8e007eaa)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the font family or text metrics for this element, component, or section. |
| `--strip-b-size` | Typography | `var(--type-value-c9898d96)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--strip-b-weight` | Typography | `var(--type-value-28cc2209)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--strip-div-padding` | Spacing / shape / effects | `var(--space-value-756ef30a)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--strip-span-color` | Color | `var(--muted)` | `styles/components/card.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--strip-span-size` | Typography | `var(--type-value-6b4e4083)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--strip-span-weight` | Typography | `var(--type-value-15aa0c7e)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--strong-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--strong-color` | Color | `var(--color-text-body)` | `styles/pages/site.css` × 1; `styles/sections/hero.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--strong-font-family` | Typography | `var(--font-sans)` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--strong-line-height` | Typography | `normal` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--strong-margin` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--strong-padding` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--strong-radius` | Spacing / shape / effects | `0` | Not directly referenced | Controls the border or corner shape for this element, component, or section. |
| `--strong-shadow` | Spacing / shape / effects | `none` | Not directly referenced | Controls the shadow for this element, component, or section. |
| `--strong-size` | Typography | `var(--type-value-84cb1e4e)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--strong-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--strong-weight` | Typography | `400` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--summary-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--summary-color` | Color | `var(--color-text-body)` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--summary-font-family` | Typography | `var(--font-sans)` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--summary-line-height` | Typography | `normal` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--summary-margin` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--summary-padding` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--summary-radius` | Spacing / shape / effects | `0` | Not directly referenced | Controls the border or corner shape for this element, component, or section. |
| `--summary-shadow` | Spacing / shape / effects | `none` | Not directly referenced | Controls the shadow for this element, component, or section. |
| `--summary-size` | Typography | `var(--type-value-84cb1e4e)` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--summary-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--summary-weight` | Typography | `400` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--surface` | Color | `var(--color-surface)` | `styles/base/elements.css` × 4; `styles/components/card.css` × 8; `styles/components/nav.css` × 3; `styles/pages/site.css` × 1; `styles/sections/overlays.css` × 1 | Color value or color alias used by the styles listed. |
| `--svg-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--svg-color` | Color | `currentColor` | `styles/base/elements.css` × 1; `styles/components/card.css` × 1; `styles/sections/hero.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--svg-fill` | Color | `currentColor` | Not directly referenced | Color value or color alias used by the styles listed. |
| `--svg-font-family` | Typography | `var(--font-sans)` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--svg-line-height` | Typography | `normal` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--svg-margin` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--svg-padding` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--svg-radius` | Spacing / shape / effects | `0` | Not directly referenced | Controls the border or corner shape for this element, component, or section. |
| `--svg-shadow` | Spacing / shape / effects | `none` | Not directly referenced | Controls the shadow for this element, component, or section. |
| `--svg-size` | Typography | `var(--type-value-84cb1e4e)` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--svg-stroke` | Color | `currentColor` | Not directly referenced | Color value or color alias used by the styles listed. |
| `--svg-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--svg-weight` | Typography | `400` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--table-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--table-color` | Color | `var(--ink)` | `styles/base/elements.css` × 2 | Controls the color or background color of this element, component, or section. |
| `--table-font-family` | Typography | `var(--font-sans)` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--table-line-height` | Typography | `normal` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--table-margin` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--table-padding` | Spacing / shape / effects | `var(--space-value-c0e0a910)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--table-radius` | Spacing / shape / effects | `0` | Not directly referenced | Controls the border or corner shape for this element, component, or section. |
| `--table-shadow` | Spacing / shape / effects | `none` | Not directly referenced | Controls the shadow for this element, component, or section. |
| `--table-size` | Typography | `var(--type-value-931f2013)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--table-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--table-weight` | Typography | `var(--type-value-290a52e4)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--table-width` | Spacing / shape / effects | `var(--space-value-fae31ece)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--td-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--td-color` | Color | `var(--color-text-body)` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--td-font-family` | Typography | `var(--font-sans)` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--td-line-height` | Typography | `normal` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--td-margin` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--td-padding` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--td-radius` | Spacing / shape / effects | `0` | Not directly referenced | Controls the border or corner shape for this element, component, or section. |
| `--td-shadow` | Spacing / shape / effects | `none` | Not directly referenced | Controls the shadow for this element, component, or section. |
| `--td-size` | Typography | `var(--type-value-84cb1e4e)` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--td-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--td-weight` | Typography | `400` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--textarea-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--textarea-color` | Color | `var(--ink)` | `styles/base/elements.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--textarea-font-family` | Typography | `var(--font-sans)` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--textarea-line-height` | Typography | `normal` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--textarea-margin` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--textarea-padding` | Spacing / shape / effects | `var(--space-value-4880ea6f)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--textarea-radius` | Spacing / shape / effects | `var(--space-value-9bc5fefa)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls the border or corner shape for this element, component, or section. |
| `--textarea-shadow` | Spacing / shape / effects | `var(--space-value-9eebee1b)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls the shadow for this element, component, or section. |
| `--textarea-size` | Typography | `var(--type-value-84cb1e4e)` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--textarea-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--textarea-weight` | Typography | `400` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--textarea-width` | Spacing / shape / effects | `var(--space-value-fae31ece)` | Token aliases only: `styles/tokens/spacing.css` × 1 | Controls spacing or dimensions for this element, component, or section. |
| `--th-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--th-color` | Color | `var(--color-text-body)` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--th-font-family` | Typography | `var(--font-sans)` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--th-line-height` | Typography | `normal` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--th-margin` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--th-padding` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--th-radius` | Spacing / shape / effects | `0` | Not directly referenced | Controls the border or corner shape for this element, component, or section. |
| `--th-shadow` | Spacing / shape / effects | `none` | Not directly referenced | Controls the shadow for this element, component, or section. |
| `--th-size` | Typography | `var(--type-value-84cb1e4e)` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--th-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--th-weight` | Typography | `400` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--tier-span-color` | Color | `var(--muted)` | `styles/components/card.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--tier-span-size` | Typography | `var(--type-value-68df68d0)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--tier-span-weight` | Typography | `var(--type-value-15aa0c7e)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--trow-a-size` | Typography | `var(--type-value-56bd79d9)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--trow-a-weight` | Typography | `var(--type-value-d8e4bbea)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--trow-span-color` | Color | `var(--color-value-04d197de)` | `styles/sections/hero.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--trow-span-size` | Typography | `var(--type-value-a3be8485)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--trow-strong-color` | Color | `var(--color-value-d4e6d716)` | `styles/sections/hero.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--trow-strong-size` | Typography | `var(--type-value-c65699a6)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--type-value-005b7051` | Typography | `var(--page-a-weight, var(--ftr-a-weight, var(--a-weight, var(--type-value-d8e4bbea))))` | `styles/sections/footer.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-006be4ee` | Typography | `var(--page-span-weight, var(--strip-span-weight, var(--span-weight, var(--type-value-15aa0c7e))))` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-04b2bc19` | Typography | `.94rem` | `styles/components/nav.css` × 2; `styles/utilities.css` × 2 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-08c5711e` | Typography | `var(--page-span-weight, var(--tier-span-weight, var(--span-weight, var(--type-value-15aa0c7e))))` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-0a555f79` | Typography | `var(--page-li-size, var(--check-li-size, var(--li-size, var(--type-value-ed7a8e9b))))` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-0d0adfab` | Typography | `.1em` | `styles/components/card.css` × 2 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-0e7b1778` | Typography | `.88rem` | `styles/components/card.css` × 1; `styles/utilities.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-0eda2051` | Typography | `var(--page-span-weight, var(--radio-span-weight, var(--span-weight, var(--type-value-15aa0c7e))))` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-10a0a5c7` | Typography | `var(--page-small-weight, var(--radio-small-weight, var(--small-weight, var(--type-value-f83a383c))))` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-15aa0c7e` | Typography | `600` | Token aliases only: `styles/tokens/typography.css` × 16 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-19feeb88` | Typography | `1rem` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-1a4fee44` | Typography | `var(--page-h1-letter-spacing, var(--h1-letter-spacing, var(--type-value-882899c3)))` | `styles/base/elements.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-1c2e08c7` | Typography | `var(--page-li-weight, var(--areas-li-weight, var(--li-weight, var(--type-value-15aa0c7e))))` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-1d3d860d` | Typography | `.06em` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-1d62f775` | Typography | `var(--page-small-size, var(--radio-small-size, var(--small-size, var(--type-value-68df68d0))))` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-1fec8b65` | Typography | `var(--page-h2-size, var(--ftr-h2-size, var(--h2-size, var(--type-value-dbd07cbf))))` | `styles/sections/footer.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-21bcb484` | Typography | `.93rem` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-2207249d` | Typography | `var(--page-h1-size, var(--h1-size, var(--type-value-7ad63770)))` | `styles/base/elements.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-222c5826` | Typography | `var(--page-b-line-height, var(--strip-b-line-height, var(--b-line-height, var(--type-value-8e007eaa))))` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-24126b21` | Typography | `1.1rem` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-2762fced` | Typography | `var(--page-li-weight, var(--cred-li-weight, var(--li-weight, var(--type-value-d8e4bbea))))` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-2862aaf9` | Typography | `1.04rem` | Token aliases only: `styles/tokens/typography.css` × 2 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-28cc2209` | Typography | `900` | `styles/components/card.css` × 5 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-290a52e4` | Typography | `800` | `styles/components/card.css` × 3; `styles/pages/site.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-30338c2c` | Typography | `var(--page-ul-font-family, var(--card-ul-font-family, var(--ul-font-family, var(--type-value-fed8ff10))))` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-33d4cffb` | Typography | `var(--page-b-letter-spacing, var(--brand-b-letter-spacing, var(--b-letter-spacing, var(--type-value-6ed02c55))))` | `styles/sections/header.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-398c2999` | Typography | `var(--page-b-size, var(--brand-b-size, var(--b-size, var(--type-value-6d775596))))` | `styles/sections/header.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-3a9dceb2` | Typography | `.16em` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-3ca4925d` | Typography | `var(--page-p-font-family, var(--card-p-font-family, var(--p-font-family, var(--type-value-fed8ff10))))` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-3e26d675` | Typography | `inherit` | `styles/base/elements.css` × 3; `styles/components/button.css` × 1; `styles/components/nav.css` × 3; `styles/sections/footer.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-4491f8b5` | Typography | `1.1` | `styles/sections/header.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-4693695d` | Typography | `1.6` | `styles/base/elements.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-4845f9be` | Typography | `var(--page-h1-line-height, var(--h1-line-height, var(--type-value-562e2573)))` | `styles/base/elements.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-4941ab86` | Typography | `var(--page-a-weight, var(--dd-a-weight, var(--a-weight, var(--type-value-f83a383c))))` | Not directly referenced | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-49c4eca6` | Typography | `var(--page-p-size, var(--hcard-p-size, var(--p-size, var(--type-value-931f2013))))` | `styles/sections/hero.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-4b3c2ac5` | Typography | `1.12rem` | Token aliases only: `styles/tokens/typography.css` × 2 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-4d6c57aa` | Typography | `var(--page-span-size, var(--brand-span-size, var(--span-size, var(--type-value-60ac4cf4))))` | `styles/sections/header.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-4e3d0fb8` | Typography | `var(--page-h2-line-height, var(--h2-line-height, var(--type-value-562e2573)))` | `styles/base/elements.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-4f77c112` | Typography | `var(--page-figcaption-size, var(--review-figcaption-size, var(--figcaption-size, var(--type-value-56bd79d9))))` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-52e6ed0b` | Typography | `var(--page-h4-line-height, var(--h4-line-height, var(--type-value-562e2573)))` | `styles/base/elements.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-562e2573` | Typography | `1.16` | Token aliases only: `styles/tokens/typography.css` × 8 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-56bd79d9` | Typography | `.85rem` | `styles/components/card.css` × 1; `styles/sections/hero.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-58c59f2e` | Typography | `var(--page-p-font-family, var(--p-font-family, var(--type-value-fed8ff10)))` | `styles/base/elements.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-58f42ac4` | Typography | `var(--page-h3-line-height, var(--h3-line-height, var(--type-value-562e2573)))` | `styles/base/elements.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-5950a7ba` | Typography | `var(--page-h4-size, var(--h4-size, var(--type-value-91166e8e)))` | `styles/base/elements.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-5ae832ba` | Typography | `1.14rem` | `styles/utilities.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-5b5ad072` | Typography | `var(--page-a-size, var(--dd-a-size, var(--a-size, var(--type-value-68df68d0))))` | Not directly referenced | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-5d05d51c` | Typography | `var(--page-p-size, var(--person-p-size, var(--p-size, var(--type-value-21bcb484))))` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-5f68d829` | Typography | `.78rem` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-600d7aaa` | Typography | `var(--page-label-weight, var(--field-label-weight, var(--label-weight, var(--type-value-d8e4bbea))))` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-60a85418` | Typography | `var(--page-h2-letter-spacing, var(--ftr-h2-letter-spacing, var(--h2-letter-spacing, var(--type-value-f1e0522f))))` | `styles/sections/footer.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-60ac4cf4` | Typography | `.75rem` | Token aliases only: `styles/tokens/typography.css` × 2 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-613df4c8` | Typography | `var(--page-b-weight, var(--strip-b-weight, var(--b-weight, var(--type-value-28cc2209))))` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-63ed8266` | Typography | `var(--page-a-weight, var(--trow-a-weight, var(--a-weight, var(--type-value-d8e4bbea))))` | `styles/sections/hero.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-659c3cbf` | Typography | `var(--page-h4-weight, var(--h4-weight, var(--type-value-290a52e4)))` | `styles/base/elements.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-68df68d0` | Typography | `.82rem` | `styles/components/card.css` × 1; `styles/components/nav.css` × 1; `styles/sections/footer.css` × 1; `styles/sections/utility.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-6a52e08f` | Typography | `var(--page-b-weight, var(--brand-b-weight, var(--b-weight, var(--type-value-28cc2209))))` | `styles/sections/header.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-6a6558f7` | Typography | `var(--page-h3-size, var(--prose-h3-size, var(--h3-size, var(--type-value-2862aaf9))))` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-6a785011` | Typography | `var(--page-a-weight, var(--dd-a-weight, var(--a-weight, var(--type-value-15aa0c7e))))` | `styles/components/nav.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-6b4e4083` | Typography | `.84rem` | `styles/components/card.css` × 3 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-6cf92264` | Typography | `var(--page-a-weight, var(--errm-a-weight, var(--a-weight, var(--type-value-d8e4bbea))))` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-6d775596` | Typography | `1.15rem` | Token aliases only: `styles/tokens/typography.css` × 2 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-6daed047` | Typography | `var(--page-h3-size, var(--h3-size, var(--type-value-6f62c54b)))` | `styles/base/elements.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-6ed02c55` | Typography | `-.03em` | Token aliases only: `styles/tokens/typography.css` × 2 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-6f0054a3` | Typography | `var(--page-h2-size, var(--hcard-h2-size, var(--h2-size, var(--type-value-4b3c2ac5))))` | `styles/sections/hero.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-6f62c54b` | Typography | `clamp(1.08rem,.5rem + .85vw,1.34rem)` | Token aliases only: `styles/tokens/typography.css` × 2 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-75df5ede` | Typography | `var(--page-h3-size, var(--errm-h3-size, var(--h3-size, var(--type-value-19feeb88))))` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-78a90f35` | Typography | `var(--page-label-size, var(--field-label-size, var(--label-size, var(--type-value-21bcb484))))` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-7ad63770` | Typography | `clamp(1.9rem,1.1rem + 3.3vw,3.3rem)` | Token aliases only: `styles/tokens/typography.css` × 2 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-7b3dba67` | Typography | `var(--page-b-letter-spacing, var(--strip-b-letter-spacing, var(--b-letter-spacing, var(--type-value-e3b25333))))` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-7cb06318` | Typography | `var(--page-label-size, var(--prefs-label-size, var(--label-size, var(--type-value-0e7b1778))))` | `styles/sections/overlays.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-7fc7776c` | Typography | `var(--page-ul-size, var(--errm-ul-size, var(--ul-size, var(--type-value-931f2013))))` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-8153a96e` | Typography | `var(--page-h2-size, var(--h2-size, var(--type-value-9e0a3e71)))` | `styles/base/elements.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-833e7aba` | Typography | `var(--page-a-size, var(--trow-a-size, var(--a-size, var(--type-value-56bd79d9))))` | `styles/sections/hero.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-83a41738` | Typography | `var(--page-li-line-height, var(--steps-li-line-height, var(--li-line-height, var(--type-value-a26f8340))))` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-84cb1e4e` | Typography | `clamp(1rem,.25vw + .96rem,1.0625rem)` | `styles/base/elements.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-873631db` | Typography | `var(--page-a-weight, var(--util-a-weight, var(--a-weight, var(--type-value-15aa0c7e))))` | `styles/sections/utility.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-882899c3` | Typography | `-.035em` | Token aliases only: `styles/tokens/typography.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-89a9b954` | Typography | `var(--page-a-size, var(--dd-a-size, var(--a-size, var(--type-value-04b2bc19))))` | `styles/components/nav.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-8e007eaa` | Typography | `1.25` | Token aliases only: `styles/tokens/typography.css` × 2 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-91166e8e` | Typography | `1.02rem` | `styles/components/nav.css` × 2 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-931f2013` | Typography | `.92rem` | `styles/components/card.css` × 1; `styles/sections/footer.css` × 1; `styles/sections/overlays.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-96cd45bc` | Typography | `var(--page-label-weight, var(--prefs-label-weight, var(--label-weight, var(--type-value-15aa0c7e))))` | `styles/sections/overlays.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-97353e01` | Typography | `var(--page-b-size, var(--review-b-size, var(--b-size, var(--type-value-931f2013))))` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-9d1568a1` | Typography | `var(--page-h4-letter-spacing, var(--h4-letter-spacing, var(--type-value-e3b25333)))` | `styles/base/elements.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-9e0a3e71` | Typography | `clamp(1.42rem,.9rem + 2vw,2.2rem)` | Token aliases only: `styles/tokens/typography.css` × 2 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-9e49913c` | Typography | `var(--page-h4-size, var(--crm-h4-size, var(--h4-size, var(--type-value-df724a4a))))` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-a26f8340` | Typography | `1.4` | Token aliases only: `styles/tokens/typography.css` × 2 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-a309e90f` | Typography | `var(--page-blockquote-size, var(--review-blockquote-size, var(--blockquote-size, var(--type-value-b3eb7630))))` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-a3be8485` | Typography | `.86rem` | `styles/utilities.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-a6cf135c` | Typography | `var(--page-a-weight, var(--crumbs-a-weight, var(--a-weight, var(--type-value-15aa0c7e))))` | `styles/sections/hero.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-a9aa53fa` | Typography | `1.05rem` | Token aliases only: `styles/tokens/typography.css` × 2 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-aa8f289e` | Typography | `1.5` | Token aliases only: `styles/tokens/typography.css` × 2 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-ace74ea2` | Typography | `var(--page-pre-line-height, var(--crm-pre-line-height, var(--pre-line-height, var(--type-value-aa8f289e))))` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-ad5dab06` | Typography | `var(--page-p-size, var(--steps-p-size, var(--p-size, var(--type-value-21bcb484))))` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-b0a544cd` | Typography | `.76rem` | `styles/pages/site.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-b1112e9f` | Typography | `var(--page-pre-size, var(--crm-pre-size, var(--pre-size, var(--type-value-b0a544cd))))` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-b1e47323` | Typography | `var(--page-p-size, var(--p-size, var(--type-value-f7ccf9b1)))` | `styles/base/elements.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-b3c5c450` | Typography | `var(--page-ul-size, var(--hero-ul-size, var(--ul-size, var(--type-value-f27ff6d4))))` | `styles/sections/hero.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-b3eb7630` | Typography | `.97rem` | Token aliases only: `styles/tokens/typography.css` × 2 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-bcf5b954` | Typography | `.72rem` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-bdee7ffd` | Typography | `var(--page-table-size, var(--table-size, var(--type-value-931f2013)))` | `styles/base/elements.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-be6ec080` | Typography | `var(--page-li-weight, var(--steps-li-weight, var(--li-weight, var(--type-value-28cc2209))))` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-c0b4c89c` | Typography | `var(--page-h2-letter-spacing, var(--h2-letter-spacing, var(--type-value-e3b25333)))` | `styles/base/elements.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-c291b0bf` | Typography | `var(--page-h1-weight, var(--h1-weight, var(--type-value-290a52e4)))` | `styles/base/elements.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-c4039311` | Typography | `var(--page-span-size, var(--tier-span-size, var(--span-size, var(--type-value-68df68d0))))` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-c65699a6` | Typography | `.99rem` | Token aliases only: `styles/tokens/typography.css` × 2 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-c6b1bcdb` | Typography | `var(--page-li-size, var(--steps-li-size, var(--li-size, var(--type-value-68df68d0))))` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-c9898d96` | Typography | `clamp(1rem,1.5vw,1.22rem)` | Token aliases only: `styles/tokens/typography.css` × 2 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-c9d5af5d` | Typography | `var(--page-span-size, var(--strip-span-size, var(--span-size, var(--type-value-6b4e4083))))` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-ca670f36` | Typography | `var(--page-table-weight, var(--table-weight, var(--type-value-290a52e4)))` | `styles/base/elements.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-cc76e50a` | Typography | `var(--page-li-size, var(--areas-li-size, var(--li-size, var(--type-value-f27ff6d4))))` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-ccd26103` | Typography | `var(--page-span-size, var(--trow-span-size, var(--span-size, var(--type-value-a3be8485))))` | `styles/sections/hero.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-cf26b0bc` | Typography | `var(--page-span-size, var(--radio-span-size, var(--span-size, var(--type-value-931f2013))))` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-cfe84770` | Typography | `var(--page-span-weight, var(--brand-span-weight, var(--span-weight, var(--type-value-d8e4bbea))))` | `styles/sections/header.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-d4c1f27d` | Typography | `var(--page-h1-letter-spacing, var(--h1-letter-spacing, var(--type-value-e3b25333)))` | `styles/base/elements.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-d8e4bbea` | Typography | `700` | `styles/components/button.css` × 1; `styles/components/card.css` × 4; `styles/components/nav.css` × 3; `styles/sections/hero.css` × 1; `styles/utilities.css` × 3 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-daa9426a` | Typography | `var(--page-b-size, var(--strip-b-size, var(--b-size, var(--type-value-c9898d96))))` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-daf9b719` | Typography | `var(--page-li-size, var(--nap-li-size, var(--li-size, var(--type-value-ed7a8e9b))))` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-dbd07cbf` | Typography | `.8rem` | Token aliases only: `styles/tokens/typography.css` × 2 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-df724a4a` | Typography | `.9rem` | `styles/components/button.css` × 1; `styles/components/card.css` × 4 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-dfaf9429` | Typography | `var(--font)` | `styles/base/elements.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-e1060166` | Typography | `var(--page-pre-font-family, var(--crm-pre-font-family, var(--pre-font-family, var(--type-value-f0cbf885))))` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-e14423b4` | Typography | `var(--page-h3-letter-spacing, var(--h3-letter-spacing, var(--type-value-e3b25333)))` | `styles/base/elements.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-e3b25333` | Typography | `-.02em` | Token aliases only: `styles/tokens/typography.css` × 10 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-ed7a8e9b` | Typography | `.95rem` | Token aliases only: `styles/tokens/typography.css` × 4 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-ede11a32` | Typography | `var(--page-details-weight, var(--details-weight, var(--type-value-d8e4bbea)))` | `styles/base/elements.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-ee844196` | Typography | `0.9rem` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-f06f14bc` | Typography | `var(--page-h3-size, var(--steps-h3-size, var(--h3-size, var(--type-value-19feeb88))))` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-f0cbf885` | Typography | `var(--mono)` | Token aliases only: `styles/tokens/typography.css` × 2 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-f1e0522f` | Typography | `.13em` | Token aliases only: `styles/tokens/typography.css` × 4 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-f2696551` | Typography | `var(--page-h2-weight, var(--h2-weight, var(--type-value-290a52e4)))` | `styles/base/elements.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-f27ff6d4` | Typography | `.87rem` | Token aliases only: `styles/tokens/typography.css` × 4 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-f2a792ce` | Typography | `var(--page-strong-size, var(--trow-strong-size, var(--strong-size, var(--type-value-c65699a6))))` | `styles/sections/hero.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-f3439b09` | Typography | `var(--page-li-size, var(--cred-li-size, var(--li-size, var(--type-value-5f68d829))))` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-f4e3b053` | Typography | `var(--page-h3-size, var(--person-h3-size, var(--h3-size, var(--type-value-a9aa53fa))))` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-f73364d9` | Typography | `.7rem` | `styles/components/card.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-f73fcfa1` | Typography | `var(--page-h3-weight, var(--h3-weight, var(--type-value-290a52e4)))` | `styles/base/elements.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-f7ccf9b1` | Typography | `clamp(1rem,.5vw + .9rem,1.14rem)` | Token aliases only: `styles/tokens/typography.css` × 2 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-f83a383c` | Typography | `500` | `styles/components/card.css` × 1; `styles/components/nav.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-fcbb56f2` | Typography | `var(--page-span-letter-spacing, var(--brand-span-letter-spacing, var(--span-letter-spacing, var(--type-value-f1e0522f))))` | `styles/sections/header.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-fd04032e` | Typography | `.14em` | `styles/components/card.css` × 1; `styles/pages/site.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-fed8ff10` | Typography | `Segoe, "Segoe UI", "DejaVu Sans", "Trebuchet MS", Verdana, sans-serif` | `styles/pages/site.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--type-value-ffb66bb4` | Typography | `var(--page-p-size, var(--cookie-p-size, var(--p-size, var(--type-value-0e7b1778))))` | `styles/sections/overlays.css` × 1 | Primitive typography value used by typography aliases and the styles listed. |
| `--ul-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--ul-color` | Color | `var(--color-list-text)` | `styles/base/elements.css` × 1; `styles/components/card.css` × 1; `styles/sections/hero.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--ul-font-family` | Typography | `var(--font-sans)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the font family or text metrics for this element, component, or section. |
| `--ul-line-height` | Typography | `normal` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--ul-margin` | Spacing / shape / effects | `var(--space-value-576fcca9)` | Token aliases only: `styles/tokens/spacing.css` × 5 | Controls spacing or dimensions for this element, component, or section. |
| `--ul-padding` | Spacing / shape / effects | `0` | Token aliases only: `styles/tokens/spacing.css` × 3 | Controls spacing or dimensions for this element, component, or section. |
| `--ul-radius` | Spacing / shape / effects | `0` | Not directly referenced | Controls the border or corner shape for this element, component, or section. |
| `--ul-shadow` | Spacing / shape / effects | `none` | Not directly referenced | Controls the shadow for this element, component, or section. |
| `--ul-size` | Typography | `var(--type-value-84cb1e4e)` | Token aliases only: `styles/tokens/typography.css` × 2 | Controls the text size or font weight for this element, component, or section. |
| `--ul-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--ul-weight` | Typography | `400` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--util-a-color` | Color | `var(--color-value-d4e6d716)` | `styles/sections/utility.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--util-a-hover-color` | Color | `var(--color-value-d4e6d716)` | `styles/sections/utility.css` × 1 | Controls the color or background color of this element, component, or section. |
| `--util-a-weight` | Typography | `var(--type-value-15aa0c7e)` | Token aliases only: `styles/tokens/typography.css` × 1 | Controls the text size or font weight for this element, component, or section. |
| `--video-background-color` | Color | `transparent` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--video-color` | Color | `var(--color-text-body)` | Not directly referenced | Controls the color or background color of this element, component, or section. |
| `--video-font-family` | Typography | `var(--font-sans)` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--video-line-height` | Typography | `normal` | Not directly referenced | Controls the font family or text metrics for this element, component, or section. |
| `--video-margin` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--video-padding` | Spacing / shape / effects | `0` | Not directly referenced | Controls spacing or dimensions for this element, component, or section. |
| `--video-radius` | Spacing / shape / effects | `0` | Not directly referenced | Controls the border or corner shape for this element, component, or section. |
| `--video-shadow` | Spacing / shape / effects | `none` | Not directly referenced | Controls the shadow for this element, component, or section. |
| `--video-size` | Typography | `var(--type-value-84cb1e4e)` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--video-transition` | Spacing / shape / effects | `none` | Not directly referenced | Controls the transition behavior for this element, component, or section. |
| `--video-weight` | Typography | `400` | Not directly referenced | Controls the text size or font weight for this element, component, or section. |
| `--wrap-h2-color` | Color | `var(--color-value-d4e6d716)` | `styles/pages/site.css` × 1 | Controls the color or background color of this element, component, or section. |
