---
name: component-description
description: >-
  Write feature descriptions for CraftUI blocks and components purely from a design engineering
  perspective, as structured JSON for the block registry. Use when writing or reviewing the
  description/features of a UI component, block, or variation. Triggers on component description,
  block features, "understanding the component", write features for, describe this component,
  design engineering description, featureSections, config.json features.
---

# Component descriptions as design engineering

Describe the component as **mechanism, not benefit**. The reader is a design engineer deciding whether to install this block; they want to know what drives the motion, which properties animate, and what accessibility contract ships with it. Voice models: Emil Kowalski (Sonner/Vaul docs, animations.dev), Jakub Krehel, Rauno Freiberg (rauno.me), Paco Coursey (cmdk), Radix/shadcn a11y notes, vercel.com/design.

## Where the output goes

The deliverable is **JSON in the block's source config, never prose in chat**:

1. Write into the variation's entry in `components/craftui/blocks/<slug>/config.json` (icons/loaders have the same layout under their own folders).
2. `scripts/build-registry.ts` copies it into `public/r/blocks.json`.
3. `components/block-gallery/BlockContentPanel.tsx` renders it in the details panel.

After editing a config, remind the user to run the registry build. Do **not** start a dev server to verify; the user checks the UI themselves.

## Output schema

Preferred format — `featureSections`, one object per design-engineering concern:

```json
"featureSections": [
  {
    "title": "Checkbox Icon Animation",
    "summary": "Smoothly animates SVG paths based on checked state using scale, opacity, and clipPath transitions.",
    "points": [
      "Fills and scales circle on check",
      "Reveals checkmark path via clipPath",
      "Fades outer stroke when toggled"
    ]
  }
]
```

- 2–4 sections per variation. Each section: `title` (noun phrase naming the concern, e.g. "List Rendering & Interaction", "Text Strike-through & Movement"), `summary` (one sentence, states what it does and the techniques used), `points` (max 4–5 bullets, each starting with a present-tense verb).
- No code snippets anywhere — name APIs and primitives in prose instead.
- If `featureSections` is not yet supported by the pipeline (see Schema status below), fall back to the flat `features: string[]` field with 3–5 dense mechanism bullets, in the register of the existing travel-card entry: "A single icon travels along an SVG offset-path between the button and the detail chip so the two stages read as one continuous object, not a swap".

### Schema status

`featureSections` requires three one-time edits (flag these if they haven't landed yet):

- `types/block.ts` — add `featureSections?` to `BlockVariation` (next to `features?` around line 34).
- `scripts/build-registry.ts` — pass the field through at the two spread sites (lines ~357 and ~512, beside `features`).
- `components/block-gallery/BlockContentPanel.tsx` — render sections near the existing features list (~line 219).

## Process

1. **Read the component source first.** Every claim must be traceable to a line of the `.tsx`. Never invent features.
2. **Consult sibling skills before writing** (internally — never cite them in the shipped JSON): `better-writing` for voice, tense, and consistency; `web-animation-design` and `better-ui` for naming motion correctly; `better-accessibility` for describing a11y behavior accurately. Mention in your chat response which skills you applied.
3. **Verify each bullet against code.** Don't say "spring" if the transition is a tween; don't claim `prefers-reduced-motion` support unless the code handles it; check the actual ARIA attributes before naming them.
4. Write the JSON into `config.json`, then remind the user to run the registry build.

## Voice rules

1. **Mechanism, not benefit.** "Reveals checkmark path via clipPath", never "delightful check animation" or "improves UX".
2. **Every animation claim names its driver and its properties.** Driver: state change, gesture, hover, scroll, layout. Properties: transform, opacity, clip-path — call out when motion is compositor-only.
3. **Name the concrete primitives.** `AnimatePresence`, `layoutId`, shared layout transitions, `useMotionValue`, keyframes, stagger, `offset-path`, transform-origin, spring vs tween. Specificity is what makes it read as design engineering.
4. **Accessibility is a first-class section, not a footnote.** `role`/`aria-*` attributes, focus management, keyboard support, and `prefers-reduced-motion` handling each earn a bullet when present in the code.
5. **Feel vocabulary when relevant.** Spring character ("snappy spring on press"), easing direction (ease-out entrances, ease-in exits), enter/exit asymmetry, duration tiers.
6. **Interaction states by their real names.** hover, press, focus-visible, checked, disabled, exit — not "when you interact with it".
7. **Bullets start with a present-tense verb.** Fills, Reveals, Shifts, Animates, Applies, Respects.

## Vocabulary

clipPath reveal · layout projection · shared layout transition (`layoutId`) · stagger · spring (stiffness/damping intent) · tween · keyframes · exit animation · enter/exit asymmetry · offset-path / motion path · transform-origin · optical alignment · overshoot · compositor-only (transform + opacity) · state-driven vs gesture-driven · focus trap · roving tabindex · reduced-motion fallback

## Common mistakes

| Mistake | Fix |
| --- | --- |
| "Beautiful, smooth animation" | Name the properties: "Scales and fades the icon with an ease-out tween" |
| Benefit-speak ("improves UX", "delightful") | Mechanism-speak: what drives what, which properties move |
| 8 bullets in a section | Max 4–5; merge or cut |
| Code snippets in the description | Prose only; name APIs, don't show them |
| A11y vague or omitted | Cite exact attributes: `role="checkbox"`, `aria-checked` |
| Claiming behavior not in the code | Verify every bullet against the `.tsx` source |
| Prose delivered in chat as the final output | Write JSON into the block's `config.json` |
| Marketing-style section titles | Noun phrases naming the concern: "Text Strike-through & Movement" |

## Full example

For a checklist item component:

```json
"featureSections": [
  {
    "title": "List Rendering & Interaction",
    "summary": "Renders interactive list items and handles state toggling with proper accessibility attributes.",
    "points": [
      "Uses onToggle callback to update checked state",
      "Applies role=\"checkbox\" and aria-checked for screen readers"
    ]
  },
  {
    "title": "Checkbox Icon Animation",
    "summary": "Smoothly animates SVG paths based on checked state using scale, opacity, and clipPath transitions.",
    "points": [
      "Fills and scales circle on check",
      "Reveals checkmark path via clipPath",
      "Fades outer stroke when toggled"
    ]
  },
  {
    "title": "Text Strike-through & Movement",
    "summary": "Animates title text sliding and strikethrough overlay to visually indicate checked status.",
    "points": [
      "Shifts text horizontally with keyframes",
      "Adjusts text opacity when checked",
      "Expands strikethrough line via an absolutely positioned motion.span"
    ]
  }
]
```
