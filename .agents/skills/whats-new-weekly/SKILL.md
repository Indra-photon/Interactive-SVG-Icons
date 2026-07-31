---
name: whats-new-weekly
description: >-
  Write the weekly what's-new roundup announcement for CraftUI: a short, punchy marketing post
  listing every component, block, loader, and icon added in the last week, discovered from git
  history — counts lead, one hook per item, link placeholder per item. Not a launch note for a
  single component (that is substack-blog). Use when asked for the weekly roundup, what's new
  this week, weekly changelog, or to announce this week's components. Triggers on what's new,
  this week, weekly, roundup, changelog post, weekly announcement.
---

# Weekly what's-new roundup

Announce the week's shipments the way a changelog headline reads: the count first, then one
line per item, then the link. The reader decides in ten seconds whether to click through. This
is the roundup sibling of `substack-blog` — where that skill writes a 400–700-word launch note
for **one** component, this one covers **everything shipped in a window** in 150–250 words
total. Same honesty, one tenth the length.

## Where the output goes

One markdown file per roundup: `Marketing/Substack/whats-new/<YYYY-MM-DD>.md` — date is the
day the post is written. This is marketing content; never touch source code. Do not run a dev
server; the user reviews and publishes themselves.

## Process

1. **Discover new components from git history, never by guessing.** Run:

   ```
   git log --since="1 week ago" --diff-filter=A --name-only --pretty=format: -- 'components/craftui/**/config.json'
   ```

   A newly **added** `config.json` under `components/craftui/{blocks,ui,loaders,icons}/<slug>/`
   is the signal for a genuinely new component. Edits to existing components do not count —
   follow-up commits to an already-shipped component are not news. The window defaults to 7
   days; the user can override it ("last two weeks", "since the last roundup"). If a previous
   roundup exists in `Marketing/Substack/whats-new/`, prefer "since that roundup's date" so
   nothing is announced twice or skipped.
2. **Read each new component's `config.json`** for its display name and pick the **one** hook
   worth naming — the single feature or interaction the item focuses on. One, not five; the
   launch note is where the full story lives.
3. **Group by category** — Blocks / UI / Loaders / Icons — and count each group. The counts are
   the headline.
4. **Links are placeholders.** Every item ends with `Check it out here: [link]`. Never invent a
   URL; the user fills in links when publishing.
5. **Empty-week rule.** If the window contains no newly added components, say so in chat and
   stop. Never pad a roundup with old components or with edits dressed up as news.

## Post structure

1. **Headline.** The counts lead: "6 new loaders and 2 new blocks this week." No preamble.
2. **Optional theme line.** One sentence, only if the week genuinely has a theme ("this week
   was all about payment flows"). Skip it otherwise.
3. **Items, grouped by category.** Per item, 1–2 lines max: name, the single hook ("It focuses
   on the morphing checkout state"), then `Check it out here: [link]`. Category gets a bold
   label or `##` heading only when there is more than one category.
4. **Closing.** At most one line ("More next week."). No hype stack, no subscribe plea.

Hard cap: **150–250 words total.** A roundup that needs 400 words is smuggling in a launch note.

## Voice rules

1. **Direct and short beats clever.** Plain announcement register: what shipped, what it
   focuses on, where to see it.
2. **Specific beats superlative.** Name the mechanism or focus, not the adjective. Ban:
   seamless, delightful, stunning, game-changing, blazingly. Consult `better-writing`
   internally; never cite it in the post.
3. **Present tense, second person for the reader.**
4. **No code fences, no prop names, no emoji.** `##` max depth, bold sparingly.
5. **Every claim traceable to the component's `config.json` or source** — same evidence rule as
   the launch notes, compressed to one line.

## Common mistakes

| Mistake | Fix |
| --- | --- |
| Launch-note creep: one component eating the roundup | 1–2 lines per item; point big stories at `substack-blog` |
| Counting edited components as new | Only `--diff-filter=A` config.json additions count |
| Inventing URLs | Always the literal `[link]` placeholder |
| Padding an empty week with old components | Report the empty window in chat and stop |
| Feature list per item | One hook per item |
| 400+ words | 150–250 words, hard cap |
| Writing the post in chat | Deliverable is `Marketing/Substack/whats-new/<YYYY-MM-DD>.md` |
