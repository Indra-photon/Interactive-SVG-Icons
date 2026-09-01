# Akta — Style Reference

> technical drawing on white paper

**Theme:** light, with a complete dark ramp under the `.dark` class

Akta is a drafting system, not a card system. The canvas is pure white, every surface is a **square-cornered plane** separated by **hairline rules** rather than boxes, and the recurring ornament is a **corner notch** — an L-shaped crop mark borrowed from print registration. There is no border-radius anywhere, no gradient, and no decorative colour: a single blue does all the emphasis work against an eleven-step gray ramp, and it is spent only on action and on data. The UI voice is **uppercase monospace** — labels, nav and buttons are all mono — which is what makes the page read as instrument panel rather than marketing site. Sans is reserved for headlines, figures and body copy.

The structural idea underneath everything: **borders are shadows.** Depth is a layered `box-shadow`; separators are single-edge `inset` shadows. Nothing uses the `border` property except the corner notch itself.

---

## How this ships

**Two files, and one CSS block.** `default.tsx` carries the markup *and every value*; `design.md` is this document. The only thing written into your `globals.css` is the six device classes, which do things a utility cannot express.

There is **no `@theme` block, no `:root` palette, and no reset.** Nothing here can collide with — or be re-skinned by — your stylesheet, and no class can silently do nothing because a token was never installed. Change a value and it changes in one place: the constant at the top of `default.tsx`.

### The tokens live in the component

Every value is a Tailwind arbitrary value with its dark twin, grouped into named constants at the top of the file:

```tsx
const BG_BRAND =
  "bg-[oklch(0.488_0.243_264.376)] dark:bg-[oklch(0.546_0.245_262.881)]";
const TYPE_CTA = `${FONT_MONO} text-[11px] leading-[20px] tracking-[0.04em] ` +
  `font-medium uppercase sm:text-[14px] sm:tracking-[0.06em]`;
const RULE_T =
  "shadow-[inset_0_1px_0_0_rgba(0,0,0,0.08)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]";
```

Dark mode is carried by a `dark:` twin on every colour rather than by swapping one variable. That is the cost of owning the values outright — and the reason they are constants rather than repeated at each of the 58 call sites.

### `cn()` groups every className

Classes are assembled in a fixed argument order, so a given concern is always in the same place:

```tsx
cn( layout , type , colour , state , device )
```

```tsx
<a className={cn(
  "flex items-center px-3 py-2.5 sm:px-6 sm:py-3.5",     // layout
  TYPE_CTA,                                              // type
  cn(BG_BRAND, ON_BRAND),                                // colour
  cn("transition-colors", HOVER_BRAND, RING_BRAND),      // state
  "akta-roll-host akta-notch akta-notch-reveal",         // device
)}>
```

`cn` is `twMerge(clsx(...))`. It correctly separates `text-[40px]` (size) from `text-[oklch(…)]` (colour) — but it **will** collapse two `shadow-*` classes, because `box-shadow` is one property. Never put a rule and a depth shadow on the same element; put one on a wrapper.

### What stays as CSS, and why

Six things a utility genuinely cannot express. They live in `@layer components`, which sits *before* `utilities` in the cascade, so a utility at any call site still wins over them.

| Device | Why it can't be a utility |
|---|---|
| `.akta-notch` | Pseudo-element carrying a four-layer mask |
| `.akta-hatch` | Repeating gradient with four tunable properties |
| `.akta-roll` | Host + two faces + hover states across three elements |
| `.akta-tick` | Per-index stagger: `calc(var(--akta-i) * 3ms)` |
| `.akta-plate` | Two-layer background with graceful-degradation fallback |
| `[data-akta-enter]` / `[data-akta-reveal]` | `@keyframes` has no utility form |

Two of them carry colour, so they have a `.dark` override in the block: `.dark .akta-notch` and `.dark .akta-plate`. Everything else in there is geometry.

**The rule when you extend the system: values are utilities, mechanism is CSS.** A new colour or size becomes a constant in the component. A new pseudo-element or keyframe goes in `@layer components`.

### Assumptions

| Assumption | If it isn't true |
|---|---|
| **Tailwind v4** | Arbitrary values, `dark:` stacking and `@layer components` ordering are v4-shaped. |
| Preflight enabled (default) | Element margins and link colours return; the block ships no reset of its own. |
| Dark mode toggles a **`.dark`** class | The dark ramp never activates. For `[data-theme="dark"]`, duplicate the `.dark { … }` block. |
| Geist loaded as `--font-geist-sans` / `--font-geist-mono` | **Optional.** `FONT_SANS` / `FONT_MONO` fall back to `ui-sans-serif` / `ui-monospace`. |
| `public/paper-image/AIHero01.png` exists | **Optional.** The plate is a CSS background layer; a missing file falls through to the hatch. |

---

## Tokens — Colors

Two ramps, eleven semantic roles each, as **literal oklch** rather than references to Tailwind's palette — so the block looks identical in a project that customised its own blue. Each role in use is a named constant in `default.tsx` pairing the light value with its `dark:` twin.

**Always use the constant, never a bare literal at a call site.** A raw `bg-[oklch(…)]` written inline has no dark twin, so it will not switch themes — that is the one failure mode this arrangement still allows.

### Brand — blue

| Name | Light | Dark | Constant | Where | Role | In block |
|------|-------|------|-------|---------|------|------|
| Brand BG Subtle | `#eff6ff` | `#162456` | — | — | Tinted page areas, callout grounds | ➕ add |
| Brand UI | `#dbeafe` | `#1c398e` | `BG_BRAND_TILE` | in `default.tsx` | Icon tile fills, chip fills | ✅ |
| Brand UI Hover | `#bedbff` | `#193cb8` | — | — | Hover on a tinted chip | ➕ add |
| Brand UI Active | `#8ec5ff` | `#1447e6` | — | — | Pressed tinted chip | ➕ add |
| Brand Border Subtle | `#51a2ff` | `#1447e6` | — | — | Faint brand edge | ➕ add |
| Brand Border | `#2b7fff` | `#155dfc` | `RING_TILE (45% alpha)` | in `default.tsx` | Source for `RING_TILE` | ✅ |
| Brand Border Hover | `#155dfc` | `#2b7fff` | `RING_BRAND` | in `default.tsx` | **Focus rings on brand controls** | ✅ |
| Brand Solid | `#1447e6` | `#155dfc` | `BG_BRAND / BRAND` | in `default.tsx` | **Primary buttons, interactive notches, signal data** | ✅ |
| Brand Solid Hover | `#193cb8` | `#2b7fff` | `HOVER_BRAND` | in `default.tsx` | Primary button hover | ✅ |
| Brand Text Low | `#1c398e` | `#51a2ff` | `INK_BRAND` | in `default.tsx` | Brand-tinted labels, icons on tinted fills | ✅ |
| Brand Text High | `#162456` | `#dbeafe` | — | — | Text on brand chips | ➕ add |
| Brand On Solid | `#ffffff` | `#ffffff` | `ON_BRAND` | in `default.tsx` | Text on `BG_BRAND` | ✅ |

### Gray

| Name | Light | Dark | Constant | Where | Role | In block |
|------|-------|------|-------|---------|------|------|
| Gray BG Subtle | `#f9fafb` | `#030712` | `BG_PANEL` | in `default.tsx` | Panel surfaces, chips lifted off a band | ✅ |
| Gray UI | `#f3f4f6` | `#101828` | `BG_CARD / HOVER_CARD` | in `default.tsx` | Card fills, panel title bars, secondary buttons | ✅ |
| Gray UI Hover | `#e5e7eb` | `#1e2939` | `HOVER_SURFACE / HATCH_GRAY` | in `default.tsx` | Secondary button hover, hatch stroke | ✅ |
| Gray UI Active | `#d1d5dc` | `#364153` | `ACTIVE_SURFACE / BG_INERT` | in `default.tsx` | Pressed state, inert chart bars | ✅ |
| Gray Border Subtle | `#99a1af` | `#364153` | `NOTCH_GRAY` | in `default.tsx` | **Structural notches** | ✅ |
| Gray Border | `#6a7282` | `#4a5565` | — | — | Inert dots, low-contrast marks *(provided, unexercised)* | ➕ add |
| Gray Border Hover | `#4a5565` | `#6a7282` | `RING_GRAY` | in `default.tsx` | Focus rings on neutral controls | ✅ |
| Gray Solid | `#364153` | `#4a5565` | — | — | — | ➕ add |
| Gray Solid Hover | `#1e2939` | `#6a7282` | — | — | — | ➕ add |
| Gray Text Low | `#101828` | `#99a1af` | `INK_MUTED` | in `default.tsx` | Secondary text, mono labels | ✅ |
| Gray Text High | `#030712` | `#f3f4f6` | `INK / BG_INK` | in `default.tsx` | Primary text, headlines, noise ticks | ✅ |
| Gray On Solid | `#ffffff` | `#ffffff` | — | — | Text on a solid gray | ➕ add |
| **Canvas** | `#ffffff` | `#000000` | `BG_CANVAS` | in `default.tsx` | **Page ground** | ✅ |

Canvas is deliberately one step past Gray BG Subtle, so panels separate from the page without a border.

### The blue budget

Blue is scarce on purpose. Six permitted uses, and no others:

1. Primary button fills
2. Corner notches on **interactive** elements and the hero panel
3. Signal data — the retained ticks, the `197` figure
4. Figures that are the point of their sentence — the `5,000+`, the `.pro` in the wordmark
5. Icons sitting on a `BG_BRAND_TILE` tile
6. A bare icon or status line labelling *data as resolved* — the filter glyph, "Positive trend detected", "+ 65 more data points"

**Structural notches are `NOTCH_GRAY`**, never blue — logo wall cells, band junctions, the secondary button. If blue appears more than a handful of times per viewport, the primary action stops reading as primary.

---

## Tokens — Typography

### Geist Sans — headlines, figures, body copy · `FONT_SANS`

- **Substitute:** `ui-sans-serif, system-ui, sans-serif` (automatic fallback — Geist is optional)
- **Weights:** 400, 500, 600
- **Sizes:** 13, 15, 16, 18, 20, 24, 28, 32, 40, 48, 56, 64, 80, 96
- **Letter spacing:** −0.06em at display, easing to −0.01em at copy. Tracking is expressed in `em`, so one value is correct at every step of a responsive ramp — this is the face's own rule (roughly −6% of size at display sizes) rather than a per-breakpoint guess.
- **Weight falls as size rises:** 600 at 20px, 500 at 32px, 400 at 48px and above. Large text needs less weight to carry.

### Geist Mono — all UI chrome · `FONT_MONO`

- **Substitute:** `ui-monospace, SFMono-Regular, Menlo, monospace`
- **Weights:** 400, 500
- **Sizes:** 11, 12, 13, 14
- **Letter spacing:** positive — `0.04em`–`0.06em`. Uppercase mono at these sizes needs air, and the tracking is what stops labels reading as compressed.
- **Always uppercase in use.** `uppercase` is baked into the three mono constants, so it never has to be remembered at a call site.

### Type Scale

Ten roles. Each is **one constant carrying size, line-height, letter-spacing, weight and every responsive step** — so a heading is a single `TYPE_*` argument to `cn()`, not five classes.

Six are in the block. The other four are the section-heading and body-copy roles a later section will need; their numbers are here at full precision, ready to become constants.

| Role | Step | Size | Line Height | Tracking | Weight | Constant |
|------|------|------|-------------|----------|--------|---------|
| **display** | base | 40px | 44px (1.1) | −0.06em | 400 | `TYPE_DISPLAY` |
|  | sm | 56px | 56px (1.0) | −0.06em | 400 |  |
|  | md | 64px | 64px (1.0) | −0.06em | 400 |  |
|  | lg | 80px | 80px (1.0) | −0.06em | 400 |  |
|  | xl | 96px | 96px (1.0) | −0.07em | 400 |  |
| **heading-48** ➕ | base | 32px | 36px (1.12) | −0.06em | 400 | ➕ add |
|  | sm | 40px | 44px (1.1) | −0.06em | 400 |  |
|  | lg | 48px | 52px (1.08) | −0.06em | 400 |  |
| **heading-32** ➕ | base | 24px | 30px (1.25) | −0.05em | 500 | ➕ add |
|  | sm | 28px | 34px (1.21) | −0.05em | 500 |  |
|  | lg | 32px | 38px (1.19) | −0.05em | 500 |  |
| **heading-24** | base | 20px | 28px (1.4) | −0.04em | 600 | `TYPE_HEADING_24` |
|  | sm | 24px | 32px (1.33) | −0.04em | 600 |  |
| **heading-20** | base | 18px | 24px (1.33) | −0.02em | 600 | `TYPE_HEADING_20` |
|  | sm | 20px | 26px (1.3) | −0.02em | 600 |  |
| **copy-16** ➕ | base | 15px | 24px (1.6) | −0.01em | 400 | ➕ add |
|  | sm | 16px | 26px (1.625) | −0.01em | 400 |  |
| **copy-14** ➕ | base | 13px | 20px (1.54) | −0.01em | 400 | ➕ add |
|  | sm | 14px | 22px (1.57) | −0.01em | 400 |  |
| **label-12-mono** | base | 12px | 16px (1.33) | 0 | 400 | `TYPE_LABEL` |
| **nav** | base | 12px | 20px (1.667) | 0.06em | 400 | `TYPE_NAV` |
|  | sm | 13px | 20px (1.538) | 0.06em | 400 |  |
| **cta** | base | 11px | 20px (1.82) | 0.04em | 500 | `TYPE_CTA` |
|  | sm | 14px | 20px (1.43) | 0.06em | 500 |  |

### When to use which

| Role | Use for | Write |
|---|---|---|
| **display** | Hero `h1`, once per page | `cn(TYPE_DISPLAY)` |
| **heading-48** ➕ | Section `h2` | add a `TYPE_*` constant from the table above |
| **heading-32** ➕ | Sub-section `h3` | add a `TYPE_*` constant from the table above |
| **heading-24** | Panel figures, stat values | `cn(TYPE_HEADING_24, "tabular-nums")` |
| **heading-20** | Wordmark, card titles | `cn(TYPE_HEADING_20)` |
| **copy-16** ➕ | Body paragraphs | add a `TYPE_*` constant from the table above |
| **copy-14** ➕ | Dense body, captions under figures | add a `TYPE_*` constant from the table above |
| **label-12-mono** | Every UI label, eyebrows, data keys | `cn(TYPE_LABEL)` |
| **nav** | Nav links, microcopy, taglines | `cn(TYPE_NAV)` |
| **cta** | All buttons | `cn(TYPE_CTA)` |

**Family is inherited.** `FONT_SANS` sits once on the section root; the three mono constants carry `FONT_MONO` themselves.

**Roles are overridable.** `cn()` is `twMerge`, so a later argument wins: `cn(TYPE_HEADING_24, "tracking-tight")` keeps the size and replaces the tracking. That is how the logo wall gives KPMG and JLL their own letterforms.

**One role per element.** `cn(TYPE_NAV, TYPE_LABEL)` does not compose — both set every property, and twMerge keeps only the later, so the result is whichever you wrote second.

---

## Tokens — Spacing & Shapes

**Base unit:** 4px · **Density:** comfortable at section scale, compact at control scale

### Spacing Scale

| Name | Value | Use |
|------|-------|-----|
| 1 | 4px | Icon-to-label gap in tight rows |
| 2 | 8px | Chip padding, gap between adjacent controls |
| 2.5–3 | 10–12px | Button horizontal padding (mobile), card inner gap |
| 4 | 16px | Card padding, gutter (mobile), panel body padding |
| 5 | 20px | Panel cell padding |
| 6 | 24px | Gutter (tablet), logo cell padding |
| 8–10 | 32–40px | Gutter (desktop), band padding |
| 12–28 | 48–112px | Section rhythm |

### Border Radius

| Element | Value |
|---------|-------|
| **Everything** | **0** |

No exceptions. Square corners plus corner notches *are* the identity — a rounded corner would take the ornament's job.

### Shadows

| Name | Light | Dark | Constant | Shipped |
|------|-------|------|-------|---------|
| Border | `0 0 0 1px rgb(0 0 0/.06), 0 1px 2px -1px rgb(0 0 0/.06), 0 2px 4px rgb(0 0 0/.04)` | `0 0 0 1px rgb(255 255 255/.08)` | `SHADOW_BORDER` | ✅ |
| Border Hover | same at `.08/.08/.06` | `0 0 0 1px rgb(255 255 255/.13)` | ➕ add | ➕ add |
| Panel | `0 0 0 1px rgb(0 0 0/.06), 0 8px 16px -6px rgb(0 0 0/.08), 0 24px 48px -12px rgb(0 0 0/.1)` | `0 0 0 1px rgb(255 255 255/.08), 0 24px 48px -12px rgb(0 0 0/.6)` | `SHADOW_PANEL` | ✅ |
| Ring Brand | `0 0 0 1px` brand-border @ 45% | @ 60% | `RING_TILE` | ✅ |

### Rules — separators

| Name | Value (light) | Constant |
|------|---------------|-------|---------|
| Top | `inset 0 1px 0 0 rgb(0 0 0/.08)` | `RULE_T` | ✅ |
| Bottom | `inset 0 -1px 0 0 rgb(0 0 0/.08)` | `RULE_B` | ✅ |
| Left / Right | `inset ±1px 0 0 0` | `RULE_R`, `RULE_L_LG`, `RULE_R_LG`, `RULE_L_SM` | ➕ add |
| X / Y | both sides / both ends | `RULE_X_LG`, `RULE_Y` | ➕ add |
| Cell | right **+** bottom in one value | `RULE_CELL` | ✅ |

Dark mode uses `rgb(255 255 255/.1)` for all rules.

`RULE_CELL` is what a wrapping grid uses — every cell carries it, so rows and columns separate at any column count and the outer edges land on the container rail where they coincide. **Do not** use `RULE_R` + `last:shadow-none`; that breaks the moment the grid reflows to a different column count.

Two consequences of shadows-as-borders:

- **Inset shadows paint below child backgrounds.** A full-width child with an opaque background covers a parent's rails — which is why the logo wall carries `BG_PANEL z-10`.
- **Separators occupy no space.** Converting a `border` to a rule shifts adjacent content by 1px per edge.

### Easing

| Name | Value | Where |
|------|-------|-------|
| Akta | `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out) | written inline in the `@layer components` transitions |

One curve for the whole system. Springs use `{ type: "spring", duration: 0.5, bounce: 0 }` — bounce is always `0`.

---

## Layout

| Property | Value | Utility |
|---|---|---|
| Page max-width | 1440px | `GRID` — `mx-auto w-full max-w-[90rem]` |
| Gutters | 16 / 24 / 40px | `px-4 sm:px-6 lg:px-10` |
| Section rhythm | 48 → 112px | `py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28` |
| Stack gap | 48 → 96px | `gap-12 sm:gap-16 lg:gap-20 xl:gap-24` |
| Card padding | 16px | `p-4` |
| Panel cell padding | 16–20px | `px-4 py-3 sm:px-5 sm:py-4` |
| Element gap | 8–12px | `gap-2` / `gap-3` |
| Body measure | 65ch | `max-w-[65ch]` |

**Padding and gaps only ever grow with the viewport** — never step down at a larger breakpoint.

**Widths come from the scale, not from pixels.** `max-w-2xl md:max-w-4xl lg:max-w-5xl` for a stage, `w-56` / `w-64` for cards. No `w-[620px]`.

### Z-index

| Value | Utility | Use |
|---|---|---|
| −1 | `-z-10` | Background plates and textures behind content |
| 10 | `z-10` | Opaque bands that must clip a neighbour's bleed |
| 20 | `z-20` | Cards overlapping a panel |

### Icon sizes

| Size | Utility | Use |
|---|---|---|
| 14px | `size-3.5` | Inline with nav or label text |
| 16px | `size-4` | Inside buttons; inside a tile |
| 28px | `size-7` | The tile itself |

Stroke weight 1.5–2px. Tabler and Hugeicons are the two sets in use.

### Full-bleed bands

A band whose rules must cross the whole viewport is a **sibling of the grid container**, not a child:

```html
<div className={cn("relative", RULE_Y)}>          {/* rules run edge to edge */}
  <div className={cn(GRID, "…")}>                  {/* content stays on grid */}
```

To bleed a *child* out to the rails from inside a padded column, centre it on the viewport: `absolute left-1/2 w-screen -translate-x-1/2`; `.akta-plate` already caps itself at 90rem. Stage, grid and viewport share a centre line, so this lands on the rails at every width. `w-screen` includes the scrollbar gutter — clip it with `overflow-hidden` on an ancestor.

---

## Surfaces

| Level | Name | Light | Dark | Purpose |
|-------|------|-------|------|---------|
| 0 | Canvas | `#ffffff` | `#000000` | Page ground, broadest layer |
| 1 | Panel / Chip | `#f9fafb` | `#030712` | Panel bodies, chips lifted off a hatch band |
| 2 | Card / Title bar | `#f3f4f6` | `#101828` | Flanking cards, panel title bars, secondary buttons |
| 3 | Solid | `#1447e6` | `#155dfc` | Primary buttons, brand squares — the only saturated surface |

The stack runs **light-to-dark in light mode and dark-to-light in dark mode**, but the *relationship* is constant: each level is one step away from its parent, and separation never needs a border. A card on a panel on the canvas is three tones, no lines.

---

## Elevation

- **Panel / flanking card:** `SHADOW_PANEL` — 1px ring + 8px lift + 24px ambient. The only real elevation in the system.
- **Chip / resting surface:** `SHADOW_BORDER` — 1px ring + 1px lift + 2px ambient. Reads as "sitting on" rather than "floating above".
- **Button (filled):** none. Relies on tonal contrast and the notch, not shadow.
- **Icon tile:** `RING_TILE` — a 1px ring in the brand hue at 45% (60% in dark), no offset.
- **Separators:** `RULE_*`. Not elevation — these are hairlines that cost no layout space.

In dark mode the three-layer stacks collapse to a single white ring, because layered depth is invisible on a dark ground.

---

## Signature Devices

The six CSS classes. Everything else is a utility.

### Corner notch — `.akta-notch`

L-shaped crop marks at an element's corners. One pseudo-element draws a **full border**, then a **four-layer mask** keeps only the corners. No wrapper markup, no four extra spans, and the brackets always track the element's real size.

| Property | Default | Purpose |
|---|---|---|
| `--akta-notch-arm` | `12px` | length of each leg of the L |
| `--akta-notch-weight` | `1.5px` | stroke width (`1px` on `.akta-notch-reveal` below sm) |
| `--akta-notch-color` | `BG_BRAND` | stroke colour |
| `--akta-notch-inset` | `6px` | distance outside the box; negative tucks inward |
| `--akta-notch-rest` | `6px` | resting offset for `.akta-notch-reveal` (`4px` below sm) |

Tune with Tailwind arbitrary properties: `[--akta-notch-arm:22px] lg:[--akta-notch-arm:10px]`.

| Variant | Corners |
|---|---|
| `.akta-notch` | all four |
| `.akta-notch-top` | top pair |
| `.akta-notch-bottom` | bottom pair |
| `.akta-notch-diagonal` | top-left + bottom-right — reads as a registration mark rather than a frame |
| `.akta-notch-reveal` | animates flush on hover / focus-visible |

All variants are modifiers — pair them with `.akta-notch`.

**`overflow-hidden` on a notched element shears the brackets off.** They live outside the box. Put clipping on an inner wrapper.

**Flush notches mark junctions.** `[--akta-notch-inset:0px] [--akta-notch-arm:0px] lg:[--akta-notch-arm:10px]` puts brackets exactly on the corners — used where vertical rails meet full-bleed rules, and on every logo wall cell. Arms collapse to zero below `lg` because the rails are `lg:`-only.

### Hatch — `.akta-hatch`

A repeating 45° rule marking a band as structural rather than content-bearing — the drafting paper between sections. Paints `background-image` only, so the element keeps its own background colour.

| Property | Default |
|---|---|
| `--akta-hatch-color` | `currentColor` @ 12% |
| `--akta-hatch-weight` | `1px` |
| `--akta-hatch-gap` | `7px` |
| `--akta-hatch-angle` | `45deg` |

Variants: `.akta-hatch-reverse` (mirrored — pairs across a seam), `.akta-hatch-dense` (4px gap).

Content laid on a hatch needs an **opaque box** behind it or it becomes unreadable.

### Rolling label — `.akta-roll`

A label that re-states itself on hover: the visible face rolls up and out while an identical copy arrives from below. `.akta-roll-host` on the interactive element, `.akta-roll` on the label wrapper.

```html
<a class="akta-roll-host akta-notch akta-notch-reveal">
  <span class="akta-roll">
    <span class="akta-roll-face">Try for free</span>
    <span class="akta-roll-face akta-roll-face-next" aria-hidden="true">Try for free</span>
  </span>
</a>
```

The clip lives on the label wrapper, never the button — the button is a notch and `overflow: hidden` would shear its brackets.

`.akta-roll-diagonal` sends the face out through the top-right corner and brings its replacement from the bottom-left, for arrows that should leave along the direction they point. In that variant **both** faces are absolutely positioned, so a 100% translate is a full box width rather than a glyph width.

The duplicate is always `aria-hidden` so the accessible name stays single.

### Background plate — `.akta-plate`

A photographic mat for a cluster of panels, painted as a **CSS background layer** rather than an `<img>`, with the hatch as a second layer beneath. A missing or 404'd image simply doesn't paint and the hatch shows through, so the plate can never render broken.

```jsx
<div className="akta-plate absolute inset-0 -z-10 overflow-hidden"
     style={{ "--akta-plate-image": "url(/paper-image/AIHero01.png)" }} />
```

Leave `--akta-plate-image` unset for a pure hatch plate. The class caps itself at 1440px, so it can carry `w-screen` for a full-bleed mat.

### Signal ticks — `.akta-tick`

A field of ticks that resolves from noise into signal, demonstrating a filter rather than describing one.

| State | Selector | Effect |
|---|---|---|
| Rest | `.akta-tick-noise` | 16% opacity — the filtered end state |
| Armed | `[data-akta-signal="armed"]` | full opacity — the raw field |
| Run | `[data-akta-signal="run"]` | animates back down, staggered by `--akta-i` |

Resting state is the *filtered* field, so a no-JS or reduced-motion visitor meets the truthful end state rather than a field that never resolves.

### Entrance — `[data-akta-enter]` / `[data-akta-reveal]`

See Motion below.

---

## Components

### Primary Button
**Role:** High-emphasis action (Try for free, Get started)

`cn(BG_BRAND, ON_BRAND)`, no border, **radius 0**, padding 12px 24px (`px-6 py-3.5`), `TYPE_CTA` at its sm step (14px/500 uppercase, 0.06em). Height ≈ 48px. Devices: `akta-roll-host akta-notch akta-notch-reveal`. Hover moves to `HOVER_BRAND`, the brackets pull flush from 6px to 0, and the label rolls. Focus ring at `outline-offset-[10px]` to clear the brackets. No shadow — the notch and the tonal contrast do the work.

### Secondary Button
**Role:** Low-emphasis paired action (Talk to an engineer)

Identical geometry on `BG_CARD` with `NOTCH_GRAY` and `ACTIVE_SURFACE`. **Grey brackets are the only thing separating it from primary** — same shape, same type, same size. Keep it that way.

### Announcement Band
**Role:** Full-width notice above the hero

Full-bleed wrapper with `RULE_Y` so the rules cross the viewport; hatch fill on the grid; flush notches at the four junctions where the rails meet the rules. Inside, a solid `BG_PANEL` chip with `SHADOW_BORDER`, carrying nav-role text plus a `size-7` `BG_BRAND` square with a diagonal-rolling arrow.

### Panel
**Role:** The centrepiece that demonstrates the product

`BG_PANEL SHADOW_PANEL`, `akta-notch akta-notch-diagonal` with `[--akta-notch-arm:22px] [--akta-notch-inset:10px]`, `w-full lg:max-w-2xl`. Title bar in `BG_CARD` with a `RULE_B` baseline, label left and context right, both label-12-mono uppercase. Body carries the graphic. Footer is a two-cell grid split by `RULE_R`, figures in heading-24 with `tabular-nums`.

### Flanking Card
**Role:** Secondary evidence beside the panel

`w-56`–`w-64`, `BG_CARD p-4 SHADOW_PANEL`. **Stacks in flow below `lg`** (`order-2` / `order-3`) and becomes `lg:absolute` overlapping the panel — never hidden, because on mobile it carries content the panel doesn't. Always: `size-7` icon tile (`BG_BRAND_TILE RING_TILE`) beside an uppercase mono title, then content.

### Logo Wall
**Role:** Social proof strip closing the hero

Full-bleed, opaque, `z-10`, `RULE_T`. Grid of `2 / sm:3 / lg:6` cells, each `RULE_CELL` with a flush gray notch, `px-4 py-6 sm:px-6 sm:py-8`. Closed by a hatch seam band. Cells that animate are `aria-hidden` with one `sr-only` sentence naming every customer.

### Data List
**Role:** Canonical record, key-value readout

`<dl>` in label-12-mono, `flex justify-between` rows with `space-y-1.5`. Keys in `INK_MUTED`, values in `INK` with `tabular-nums`. Footer line separated by `RULE_T` + `pt-3`.

### Tagline Row
**Role:** Three-or-four short claims under a headline

Each phrase in nav-role mono uppercase `INK_MUTED`, `py-1 sm:px-3 lg:px-4`, with every item after the first carrying `RULE_L_SM`. **Separate with a rule, never with a `|` character** — a pipe is a glyph, so it brings its own font metrics and sits on a different line-height from the labels either side, which throws the row's vertical centring. The rule is a hairline the exact height of the cell and costs no layout space.

Stacks with `flex-col` below `sm`, where the phrases cannot share a row and a leading rule would dangle at the start of a wrapped line.

### Nav Bar
**Role:** Top navigation

Three cells in one row separated by rules, not padding: wordmark cell (`RULE_R_LG`), centred mono nav (`hidden lg:flex`, `gap-9`), CTA cell (`RULE_L_LG`). The nav reads as a grid because the dividers do the work.

### Stat / Figure
**Role:** A number that is the point of its sentence

Label in label-12-mono uppercase `INK_MUTED`; value in heading-24 `tabular-nums`. Gray for context figures, `BG_BRAND` for the figure the section is actually about. No card chrome — typographic scale alone establishes the metric.

---

## Motion

| Motion | Property | Duration | Trigger |
|---|---|---|---|
| Entrance | `opacity` + `translateY(12px)` | 0.6s, delays 0.05→0.41s | Page load, `data-akta-enter="1".."6"` |
| Reveal | same keyframe | scroll-linked | In view, `data-akta-reveal` |
| Notch reveal | `inset` on `::before` | 0.3s | hover / focus-visible |
| Label roll | `transform` | 0.3s | hover / focus-visible |
| Signal denoise | `opacity`, staggered `calc(var(--akta-i) * 3ms)` | 0.45s | scroll into view, once |
| Logo flip | spring `y` | 0.5s | interval, gated on in-view |

### `data-akta-enter` vs `data-akta-reveal`

**`data-akta-enter="1".."6"`** fires on page load. Use it **only above the fold** — it finishes before anyone scrolls. Steps must be unique and in reading order; duplicated steps make the sequence read as interleaved pairs.

**`data-akta-reveal`** is scroll-linked via `animation-timeline: view()`. Use it for **everything below the fold**, which is every section after the hero. No JavaScript, no observer — a section using it can stay a server component:

```jsx
<div data-akta-reveal>…</div>
```

It sits inside `@supports (animation-timeline: view())`. Where that isn't supported the rule doesn't match and the element renders plain and fully visible — the correct resting state, not a degraded one. Don't add a JS fallback; there is nothing to fall back to.

### Rules

- **Every animation sits inside `@media (prefers-reduced-motion: no-preference)`**, and the resting state outside it must be the meaningful one.
- **Transitions belong on the pseudo-element where possible.** A `transition` on the host competes with `transition-colors` — only one can own the `transition` property.
- **Don't animate the notch with `transform`.** Pushing four corners outward needs a `scale`, and scale is proportional: on a 200×48 button that is ~8px sideways against ~2px vertically. It reads lopsided. Animate `inset` for uniform travel.
- **Derive generated geometry deterministically.** The tick field hashes its index rather than calling `Math.random()`, so server and client markup match.

---

## Accessibility

- Focus rings are **not** replaced by notches. Use `RING_BRAND` on brand controls and `RING_GRAY` on neutral ones — both already carry `outline-2` and the offset; a 1px bracket is too weak to be the only indicator.
- **Outline offset must clear the brackets:** `outline-offset` ≥ `--akta-notch-rest` + `--akta-notch-weight`. On standard buttons that is 6 + 1.5, so `outline-offset-[10px]`. With no notch, `outline-offset-4`.
- Decorative duplicates (`akta-roll-face-next`), schematic graphics (the tick field) and animating wordmarks are `aria-hidden`, with an `sr-only` sentence carrying any claim the graphic makes.
- If an element shows an arrow or a hover affordance, make it a real `<a>` or `<button>`. A hover-animated `<div>` is unreachable by keyboard and the `:focus-visible` half of every interaction is dead.

---

## Imagery

Minimal and schematic. There is no hero photography of people, no illustration, no decorative graphic. The single photographic element is the **background plate** — an abstract texture behind the panel cluster, always partially obscured by opaque panels, functioning as a mat rather than as content. It is decorative, `aria-hidden`, and optional: absent the file, a hatch shows in its place and nothing looks broken.

Everything else that reads as "image" is **drawn from data**: the tick field, the six-bar sentiment chart, the canonical-record list. The visual content *is* the product's output. Icons are thin-stroke geometric marks at 1.5–2px in `INK` or `INK_BRAND`, used only as functional cues — never as decoration.

Customer logos are **typeset, not dropped in as SVGs**, using the system's own heading roles. This keeps the wall coherent when real assets are unavailable, and it means the wall never carries a third typeface.

---

## Agent Prompt Guide

### Quick Reference

| Purpose | Constant |
|---|---|
| Page ground | `BG_CANVAS` |
| Panel surface | `BG_PANEL` |
| Card surface | `BG_CARD` |
| Primary text | `INK` |
| Muted text | `INK_MUTED` |
| Primary action | `cn(BG_BRAND, ON_BRAND)` |
| Data emphasis | `BRAND` |
| Separator | `RULE_T` `RULE_B` `RULE_R` `RULE_Y` `RULE_CELL` `RULE_X_LG` `RULE_L_LG` `RULE_R_LG` `RULE_L_SM` |
| Depth | `SHADOW_PANEL` / `SHADOW_BORDER` / `RING_TILE` |
| Interactive notch | `"akta-notch akta-notch-reveal"` |
| Structural notch | `cn("akta-notch", NOTCH_GRAY)` |
| Grid | `GRID` |
| Radius | **none — never add one** |

### Example Component Prompts

Each assumes the constants from `default.tsx` are in scope — copy the block's token header into the new section, or import it.

1. **Stat band.**
```tsx
<div className={cn("relative", RULE_Y)}>
  <div className={cn(GRID, "grid grid-cols-2 lg:grid-cols-4")} data-akta-reveal>
    {items.map((it) => (
      <div key={it.label} className={cn(
        "px-6 py-8",                                                      // layout
        RULE_CELL,                                                        // separator
        cn("akta-notch", NOTCH_GRAY,                                      // device
           "[--akta-notch-arm:0px] [--akta-notch-inset:0px] [--akta-notch-weight:1px] lg:[--akta-notch-arm:10px]"),
      )}>
        <p className={cn(TYPE_LABEL, INK_MUTED)}>{it.label}</p>
        <p className={cn("mt-1 tabular-nums", TYPE_HEADING_24, INK)}>{it.value}</p>
      </div>
    ))}
  </div>
</div>
```

2. **Primary button.**
```tsx
<a href="#" className={cn(
  "flex items-center px-6 py-3.5",                    // layout
  TYPE_CTA,                                           // type
  cn(BG_BRAND, ON_BRAND),                             // colour
  cn("transition-colors", HOVER_BRAND, RING_BRAND),   // state
  "akta-roll-host akta-notch akta-notch-reveal",      // device
)}>
  <RollLabel>Try for free</RollLabel>
</a>
```

3. **Section header.** `h2` in a `TYPE_HEADING_48` constant you add from the Type Scale table, `INK`, `text-balance`; eyebrow above in `cn(TYPE_LABEL, INK_BRAND)`; body below in a `TYPE_COPY_16` constant with `INK_MUTED max-w-[65ch]`. Wrap in `data-akta-reveal`.

4. **Feature panel.** `cn(BG_PANEL, SHADOW_PANEL, "akta-notch akta-notch-diagonal [--akta-notch-arm:22px] [--akta-notch-inset:10px] w-full lg:max-w-2xl")`. Title bar `cn("px-4 py-2.5", BG_CARD, RULE_B)` with `cn(TYPE_LABEL, INK)` left and `cn(TYPE_LABEL, INK_MUTED)` right. Footer two-cell grid, divider `RULE_R`.

5. **Hatch seam.** `cn("relative z-10", BG_PANEL, RULE_Y)` wrapper, inner `cn(GRID, "akta-hatch h-6 sm:h-9", HATCH_GRAY)`. Closes a section without a divider line.

---

## Design Philosophy

1. **Rules, not boxes.** Structure comes from hairlines and shared edges. A thing is defined by what separates it from its neighbour, not by a container drawn around it.
2. **Square, always.** No radius anywhere. The corner notch is the ornament a rounded corner would otherwise provide.
3. **Blue is a budget.** One accent, spent only on action and on data. Everything structural is gray.
4. **Depth is transparent.** Shadows over borders, so surfaces survive any background — including a photographic plate.
5. **Motion demonstrates.** Animation exists to show a mechanism happening — the filter filtering, the label re-stating — not to decorate an arrival.
6. **Values are utilities, mechanism is CSS.** The moment a stylesheet sets values a utility already covers, the two begin fighting and the markup silently loses.

---

## Similar Brands

- **Vercel** — same Geist pairing, same monospace UI voice, same hairline-rule structure and near-achromatic palette with one accent
- **Linear** — identical tight display tracking and restraint with colour, though Linear rounds its corners where akta refuses to
- **Railway** — same developer-infrastructure register, mono labels over sans headlines, data rendered as the visual content
- **Clay** — closest in subject matter: a data/enrichment API presenting resolved records as the hero graphic rather than describing them
- **Stripe Docs** — same instrument-panel feel from monospace chrome and rule-separated cells, same use of a single blue for emphasis only

---

## Quick Start

Two things travel with this block: **the constants at the top of `default.tsx`** (copy that header into any new akta section) and **the CSS below**, which `shadcn add` writes into your `globals.css` once.

Nothing else is installed — no `@theme`, no `:root` palette, no reset.

### The devices

The six CSS classes go in `@layer components` so Tailwind utilities always win over them. See **Signature Devices** above for their full API; the shipped `css` block in `config.json` is the source of truth.

```css
@layer components {
  .akta-notch { position: relative; --akta-notch-color: oklch(0.488 0.243 264.376); … }
  .dark .akta-notch { --akta-notch-color: oklch(0.546 0.245 262.881) }
  .akta-notch::before { /* full border + four-layer corner mask */ }
  .akta-hatch { /* repeating 45° gradient */ }
  .akta-roll  { /* clip + two faces */ }
  .akta-tick  { /* noise/armed/run states */ }
  .akta-plate { /* image layer over hatch fallback */ }
  [data-akta-enter] { animation: akta-enter 0.6s var(--akta-ease) backwards }
}

@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    [data-akta-reveal] {
      animation: akta-enter 1s linear both;
      animation-timeline: view();
      animation-range: entry 10% cover 28%;
    }
  }
}
```
