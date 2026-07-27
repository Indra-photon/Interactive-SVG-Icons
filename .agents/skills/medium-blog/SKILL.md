---
name: medium-blog
description: >-
  Write architecture-tutorial blog posts about CraftUI components and blocks for Medium, in the
  narrative build-along style of Maxime Heckel and Emil Kowalski. Use when asked to write a blog,
  article, tutorial, or Medium post about a component, block, animation, or how something was
  built. Triggers on medium blog, write a blog, blog post, article about, tutorial for, building
  article, how I built, MARKETING/Medium.
---

# Architecture tutorials for Medium

Tell the story of **building** the component, not the story of the component. The reader is a
developer who wants to walk away able to build it themselves — the post earns that by pairing
every technique with the real code and the reasoning behind it. Voice models: Maxime Heckel
(blog.maximeheckel.com — e.g. the Framer Motion layout animations deep dive), Emil Kowalski
(emilkowal.ski, animations.dev), Josh W. Comeau (progressive build-up structure), Rauno Freiberg
(craft detail register), Build UI recipes (Sam Selikoff — "what drives what" narration).

## Where the output goes

One markdown file per post: `MARKETING/Medium/<component-name>.md` — the file name is the
component/block name in kebab-case (e.g. `theme-button.md`). Nothing else is created or edited;
this is marketing content, never source code. Do not run a dev server to verify anything; the
user reviews the post themselves.

## Process

1. **Read the component source first.** The post is grounded in the actual `.tsx` (and its
   `config.json` for props/features). Every code snippet is copied from the source and trimmed —
   never invented, never "simplified" until it no longer matches what ships.
2. **Find the narrative spine.** Identify the 3–5 architectural decisions that make the component
   work (the shared layout morph, the focus model, the timing asymmetry…). Those become the
   sections; everything else is a supporting detail or gets cut.
3. **Consult sibling skills internally** — `better-writing` for prose discipline,
   `web-animation-design` / `better-ui` for naming motion correctly, `better-accessibility` when
   narrating a11y decisions. Never cite the skills in the post; mention in your chat response
   which ones you applied.
4. **Verify every snippet and every number** against the source: easing arrays, spring configs,
   durations, ARIA attributes. A tutorial with a wrong constant is worse than no tutorial.
5. Write the `.md` file and report the path.

## Post structure

1. **Hook — context before component.** Open with the broader interaction-design idea the
   component belongs to ("hold to confirm", morphing surfaces, pickers that stay put), 1–3 short
   paragraphs. First person, conversational, zero marketing.
2. **The goal.** One paragraph + optionally a short list: what we're building and the constraints
   that shaped it (self-contained, prop-driven, reduced-motion safe…).
3. **Build sections (3–5).** Each section = one architectural decision:
   - Narrative first: the problem, the options considered, why this approach won. Dead ends and
     trade-offs are gold — include them when the source comments reveal them.
   - Then the real code, in fenced blocks with a language tag, trimmed to the relevant lines
     (10–30 lines; never paste a whole 500-line file).
   - Then the detail commentary: name the exact values and why they feel right ("collapse is
     ~30% faster because the eye forgives a fast exit, not a slow one").
4. **The finishing touches.** A section for the small things — timing asymmetries, blur on
   cross-fades, enlarged hit areas, `translate="no"`. This is the Maxime/Emil signature move:
   the post's most memorable section is about the least visible details.
5. **Accessibility as narrative,** not checklist: tell how focus travels, what the screen reader
   announces, what `prefers-reduced-motion` collapses — as decisions that were designed, in the
   same voice as the animation sections.
6. **Closing reflection.** 1–2 paragraphs: what this pattern generalizes to, what you'd explore
   next. No call-to-action spam; at most one link to the component in the CraftUI gallery.

## Voice rules

1. **First person, present tense, plain words.** "I wanted the pill and the menu to read as one
   object" — not "This component provides a seamless experience".
2. **Every technique gets a why.** Code without reasoning is documentation, not a tutorial.
   Reasoning without code is a teaser. Always pair them.
3. **Mechanism vocabulary, spelled out on first use.** `layoutId`, FLIP, compositor-only
   properties, roving tabindex — name them precisely, then explain them in one sentence for
   readers meeting the term for the first time.
4. **Numbers are content.** Real durations, bounce values, cubic-bezier arrays, blur radii —
   quoted exactly from the source. Vague ("a quick spring") is a missed teaching moment.
5. **Short paragraphs, no headers deeper than `##`.** Medium flattens deep hierarchies; two
   levels max. Bold sparingly, italics for emphasis, no emoji.
6. **Honest about limits.** If something is a compromise or would break at scale, say so —
   credibility is the currency of technical blogging.

## Markdown format for Medium

- Start with a `# Title` (specific and mechanism-flavored: "Morphing a Button into a Menu with
  Framer Motion's layoutId", not "Building a Cool Theme Button").
- Follow with a one-line italic subtitle.
- Fenced code blocks with language tags (```tsx). Medium's editor imports these cleanly; the
  user handles gist conversion if they want it.
- No HTML, no tables (Medium drops them), no footnotes. Images: leave a placeholder line
  `<!-- gif: collapsed → expanded morph -->` wherever a recording would help; the user records
  and inserts media themselves.
- End the file with a suggested tag list as an HTML comment:
  `<!-- tags: React, Framer Motion, Web Development, UI Design, Animation -->` (max 5 — Medium's
  limit).

## Common mistakes

| Mistake | Fix |
| --- | --- |
| Feature-list disguised as a post | Narrative spine: 3–5 decisions, told as a build story |
| Pasting the whole component file | Trim each snippet to the 10–30 lines the section teaches |
| Invented or "cleaned-up" code that drifts from source | Copy from the `.tsx`, trim, verify constants |
| "Seamless", "delightful", "blazingly fast" | Name the mechanism and the numbers instead |
| Accessibility as a bullet checklist at the end | A narrated section: how focus travels and why |
| Deep header nesting, tables, HTML | Two header levels, prose and code only |
| Marketing CTA endings | One quiet gallery link at most |
| Writing the post in chat | Deliverable is `MARKETING/Medium/<component-name>.md` |
