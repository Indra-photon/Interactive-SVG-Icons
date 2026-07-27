---
name: substack-blog
description: >-
  Write promotional announcement posts about newly added CraftUI components and blocks for the
  Substack newsletter. Not a tutorial — a craft-focused launch note: what's new, where to use it
  and where not to, the design engineering details that separate it from generic equivalents, and
  how it improves the user experience. Use when asked to announce a component, write a newsletter
  post, promote a block, or write for Substack. Triggers on substack, newsletter, announcement
  post, promote this component, launch post, newly added, MARKETING/Substack.
---

# Launch notes for Substack

Announce the component the way Linear or Raycast write a changelog entry, stretched to newsletter
length: confident, specific, and honest. The reader is a designer or developer subscriber
deciding in ninety seconds whether this block belongs in their product. The post sells with
craft details, not adjectives — and it earns trust by saying where the component does **not**
fit. Voice models: Linear changelog, Raycast changelog, Vercel product posts, Emil Kowalski's
newsletter register, shadcn/ui release notes.

This is the promotional sibling of `medium-blog` (tutorial, code-heavy). Here: **no code
fences, no build walkthrough.** Primitives are named in prose ("a shared-layout morph", "a
roving tabindex") because specificity is the selling point, but the post never teaches
implementation.

## Where the output goes

One markdown file per post: `MARKETING/Substack/<component-name>.md` — file name is the
component/block name in kebab-case (e.g. `theme-button.md`). This is marketing content; never
touch source code. Do not run a dev server; the user reviews and publishes themselves.

## Process

1. **Read the component source and its `config.json` first.** Every claim in the post —
   animation behavior, ARIA contract, props, reduced-motion handling — must be traceable to the
   code. `featureSections`/`features` are the raw material for the design-engineering section.
2. **Consult sibling skills internally** (never cite them in the post; list them in your chat
   response): `better-writing` for voice and honesty, `better-ui` / `web-animation-design` for
   naming motion, `better-accessibility` for the a11y claims, `better-layout` when the layout
   story matters. `component-description`'s voice rules apply to the craft section here too.
3. **Decide the real fit boundaries.** The "where not to use" section is derived from the code's
   actual constraints (fixed width? pointer-first? heavy motion? needs a popover surface?), not
   invented modesty.
4. **Verify every claim**, then write the `.md` file and report the path.

## Post structure

1. **Title + one-line italic subtitle.** Title is announcement-flavored and names the component:
   "New in CraftUI: a theme button that morphs into its own menu". Subtitle states the one-line
   value.
2. **What's new (the hook).** 1–2 short paragraphs: what shipped, what interaction it delivers,
   in plain words. Written as news, not as a feature list.
3. **What makes it different.** The design-engineering section — why this isn't the generic
   version of the component. Name the mechanisms in prose: the shared-layout morph instead of a
   swap, the asymmetric spring timing, the blur cross-fade, the enlarged hit targets. 1 short
   paragraph plus 3–5 bullets max. Exact values are welcome ("collapse runs ~30% faster than
   expand") — numbers read as craft.
4. **Where to use it.** 3–4 concrete product situations (settings surfaces, editor toolbars,
   personalization panels…), each one line.
5. **Where not to use it.** 2–3 honest exclusions with the reason ("not for forms that need a
   native select's typeahead", "skip it where the surface can't float"). This section is
   mandatory — it is what separates the post from ad copy.
6. **What your users get.** The UX dividend, told concretely: keyboard and screen-reader
   behavior, focus management, reduced-motion fallback, hit-area generosity, light/dark token
   awareness. Frame as outcomes for end users, not as a compliance checklist.
7. **Closing.** 1 short paragraph: how to get it (registry install, gallery link) and at most
   one forward-looking line. No hype stack, no emoji, no "smash that subscribe".

Target length: 400–700 words. A launch note that needs 1500 words is hiding its point.

## Voice rules

1. **Specific beats superlative.** "The pill and the menu are one element interpolated by a
   shared layout ID" sells harder than "buttery-smooth morphing magic". Ban: seamless,
   delightful, stunning, game-changing, blazingly.
2. **Present tense, second person for the reader, "your users" for their users.**
3. **Honesty is the differentiator.** Real limits, real trade-offs, one per section where
   relevant. Overselling one post costs every future post.
4. **Accessibility is a selling point, not an appendix.** Lead with it in "what your users get";
   name the actual behavior (focus returns to the trigger, options announce as radio items).
5. **No code fences, no prop tables.** One or two prop names in prose are fine when they carry
   the configurability story ("bring your own themes and fonts, controlled or uncontrolled").
6. **Short paragraphs, `##` max depth, bold sparingly, no emoji.** Leave
   `<!-- gif: ... -->` placeholders where a recording should go; the user inserts media.

## Common mistakes

| Mistake | Fix |
| --- | --- |
| Tutorial creep: explaining how to build it | Link the Medium post instead; this post sells the what and why |
| Adjective stacks ("stunning, seamless…") | Name the mechanism and the number |
| Skipping "where not to use" | Mandatory section; derive limits from the code |
| A11y as a compliance bullet at the end | Concrete user outcomes in "what your users get" |
| Feature-dump matching config.json order | 3–5 curated differentiators; cut the rest |
| 1500-word launch note | 400–700 words |
| Code blocks or prop tables | Prose only; primitives named, never shown |
| Writing the post in chat | Deliverable is `MARKETING/Substack/<component-name>.md` |
