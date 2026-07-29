# Morphing an Avatar into a Profile Card with Framer Motion's layoutId

*One 40px circle that grows into a 310px menu — no clones, no cross-fades, one continuous piece of motion.*

Almost every app has the same top-right corner: a little round avatar that, when you click it, spits out a menu with your name, your plan, and a sign-out button. Usually it's a dropdown — the avatar sits still and a separate panel appears underneath it. The two things never feel related. One is the button, the other is the popover, and the popover just fades in.

I wanted the opposite. I wanted the avatar and the card to read as *the same object*: you tap the circle, and the circle itself unfolds into the card. When you dismiss it, the card folds back down into the circle it came from. No panel appearing out of nowhere — a single surface that changes shape.

That's a shared-layout animation, and Framer Motion's `layoutId` gives it to you almost for free. But "almost" is where the interesting decisions live: keeping the avatar circular while the card grows rectangular, timing the text so it doesn't smear during the morph, and stopping stray clicks while the shape is still moving. This is the story of building it.

## The goal

A `ProfileCard` you drop into a navbar. Collapsed, it's a 40px avatar pinned to the top-right. Expanded, it's a 310px floating card with a header and a set of grouped menu rows. The constraints that shaped it:

- The expansion is *one* motion — the avatar becomes the card, it isn't replaced by it.
- The avatar stays a perfect circle the whole way through, even though the container around it is turning into a rounded rectangle.
- The menu is prop-driven: a flat array of rows, with grouping and badges as composable slots.
- It's self-contained. The dismiss layer lives inside the component's own box, so it works whether you drop it in a navbar, a sidebar, or a phone frame.

## One shape, two states: the layoutId morph

The whole illusion rests on a single idea. Two different elements that share the same `layoutId` are treated by Framer Motion as *the same element in two positions*. When one unmounts and the other mounts, Motion doesn't fade between them — it measures the box you're leaving and the box you're arriving at, and animates the difference: position, width, height, border radius. This is FLIP (First, Last, Invert, Play) under the hood, done for you.

So I have two nodes with `layoutId="profile-card"`. The collapsed one is always mounted — the little 40px trigger. The expanded one only mounts when `isOpen` is true, inside an `AnimatePresence`:

```tsx
{/* Collapsed trigger — always present */}
<motion.div
  layoutId="profile-card"
  onClick={() => setIsOpen(true)}
  transition={SPRING}
  style={{ borderRadius: 20, pointerEvents: isOpen ? "none" : "auto" }}
  className="cursor-pointer"
>
  {/* …40px avatar… */}
</motion.div>

{/* Expanded card — mounts on open */}
<AnimatePresence>
  {isOpen && (
    <motion.div
      layoutId="profile-card"
      key="profile-card-expanded"
      transition={SPRING}
      style={{ borderRadius: 20 }}
      className="absolute top-3 right-5 w-[310px] bg-white shadow-[0_8px_40px_rgba(0,0,0,0.14)]"
    >
      {/* …card contents… */}
    </motion.div>
  )}
</AnimatePresence>
```

Because both share `layoutId="profile-card"`, the moment `isOpen` flips, Motion sees "the profile-card element used to be a 40px box at top-right, and now it's a 310px box at top-right" and springs between them. Same `borderRadius: 20` on both, so the corners never pop — they just relax as the box gets wider.

Notice `pointerEvents: isOpen ? "none" : "auto"` on the trigger. Once the card is open, the trigger is still sitting there underneath, and I don't want it swallowing clicks or re-firing `setIsOpen(true)`. Turning off its pointer events hands all interaction to the expanded card.

The spring itself:

```tsx
const SPRING = { type: "spring", duration: 0.5, bounce: 0.25 } as const;
```

A duration-based spring (Motion supports `duration` + `bounce` as an alternative to raw `stiffness`/`damping`) is much easier to reason about here: 0.5s to settle, `bounce: 0.25` for a small amount of overshoot. Enough life that the card feels like it has some mass, not so much that a menu bounces around like a notification toast. Every layout child in this component uses the *same* `SPRING`, which is what keeps the morph reading as one coordinated object instead of several things arriving on their own schedules.

## Keeping the avatar round while the box goes rectangular

Here's the problem the naive version runs into. If the avatar is just a child *inside* the morphing card, it inherits the card's layout animation — and as the card stretches from 40px to 310px wide, the avatar stretches with it. For a frame or two your circular avatar becomes an egg. It's subtle, but the eye catches it.

The fix is to give the avatar its *own* `layoutId`, separate from the card's:

```tsx
{/* Collapsed: avatar as an independent layout child */}
<motion.div
  layoutId="profile-avatar"
  transition={SPRING}
  className="absolute inset-[2px] overflow-hidden rounded-full"
>
  {collapsedAvatar}
</motion.div>

{/* Expanded: same layoutId, new position + size */}
<motion.div
  layoutId="profile-avatar"
  transition={SPRING}
  className="absolute inset-[3px] overflow-hidden rounded-full"
>
  {expandedAvatar}
</motion.div>
```

Now there are two shared-layout animations running in parallel on the same spring: `profile-card` (40px → 310px box) and `profile-avatar` (36px circle at top-right of the trigger → 42px circle at top-right of the card). Because the avatar animates its *own* box independently, it interpolates from small-circle to slightly-bigger-circle along its own path. It never inherits the card's horizontal stretch, so it's round at every frame.

It's also why the avatar is rendered at two sizes — `<DefaultAvatar size={36} />` collapsed, `size={42}` expanded — rather than one size that gets scaled. Scaling a rendered avatar would blur its edges mid-flight; giving Motion two real sizes to interpolate between keeps it crisp.

This is the single most important trick in the component: **the thing that must not distort gets pulled out into its own layoutId.** Anything you nest inside a morphing container is at the mercy of that container's transform.

## Timing the content so it doesn't smear

If I drop the name, the email, and six menu rows straight into the card, they get caught in the layout animation too. As the card springs open, all that text scales and shifts along with it — a quarter-second of blurry, sliding content before it settles. Cheap-looking.

So the text and menus don't participate in the morph at all. They live in a separate fade wrapper that starts *after* the shape has mostly finished moving:

```tsx
<motion.div
  initial={{ opacity: 0, filter: "blur(4px)" }}
  animate={{ opacity: 1, filter: "blur(0px)" }}
  exit={{ opacity: 0, filter: "blur(4px)" }}
  transition={{ duration: 0.2, ease: "easeOut", delay: 0.18 }}
>
  {/* name, email, divider, menu rows */}
</motion.div>
```

Two numbers are doing the work. The `delay: 0.18` holds the content back for 180ms — roughly the time the card takes to get most of the way to full size on that 0.5s spring — so the text materializes into a card that's already the right shape, instead of riding along with the stretch. And the `blur(4px)` → `blur(0px)` gives the fade a bit of depth: the content doesn't just brighten, it *focuses in*, like a camera settling. It's four pixels of blur; you'd never consciously notice it, but drop it and the entrance feels flatter.

The avatar sits *outside* this fade wrapper on purpose. It's the one piece that should move with the shape (it's part of the morph), while everything else waits and fades in over it.

## Guarding the first click

There's a subtle bug lurking in a menu that fades in: the rows are technically present and clickable the instant they mount, even though they're still at `opacity: 0` and blurred. A fast user — or a stray mouse-up from the opening click — can trigger "Sign out" on a menu they can't even see yet.

So the menu rows are gated behind a `menuReady` flag that only turns on once the fade has actually finished:

```tsx
React.useEffect(() => {
  if (!isOpen) {
    setMenuReady(false);
    return;
  }
  // delay + duration of the fade wrapper (0.18 + 0.2 = 0.38s)
  const id = setTimeout(() => setMenuReady(true), 400);
  return () => clearTimeout(id);
}, [isOpen]);
```

```tsx
<div className={menuReady ? undefined : "pointer-events-none"}>
  {/* menu segments */}
</div>
```

The 400ms isn't arbitrary — it's the fade wrapper's `delay` (0.18) plus its `duration` (0.2), rounded up to 0.38 → 400ms. Until the rows are fully visible, the wrapping div is `pointer-events-none`, so there's nothing to accidentally hit. Close the card and `menuReady` resets to `false`, ready to re-arm on the next open. It's a tiny guard, but it's the difference between a menu that feels solid and one that occasionally does something you didn't ask for.

## Grouping menu rows without nesting the data

The menu items are the composable part of this component, and I went back and forth on the data shape. The obvious model for a grouped menu is a nested array — `MenuItem[][]`, one inner array per group. But that's annoying to author: every time you want a divider you have to restructure the whole array, and a single flat list is what you actually think in.

So the public API is a flat `MenuItem[]`, and grouping is expressed as a per-row flag:

```tsx
export type MenuItem = {
  label: string;
  icon: HugeIcon;
  badge?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  /** Renders a divider below this item — used to visually group rows. */
  dividerAfter?: boolean;
};
```

A tiny helper walks the flat list and cuts it into segments wherever it sees `dividerAfter`:

```tsx
function splitIntoSegments(items: MenuItem[]): MenuItem[][] {
  const segments: MenuItem[][] = [[]];
  for (const item of items) {
    segments[segments.length - 1].push(item);
    if (item.dividerAfter) segments.push([]);
  }
  return segments.filter((segment) => segment.length > 0);
}
```

You author a flat list; the component derives the visual groups. Adding `dividerAfter: true` to "Settings" draws a divider under it and starts a new group below — no restructuring, no empty-array bookkeeping.

Everything else on a row is a slot too. `badge` is a `ReactNode`, so a row can carry a red "3" notification count, a green **PRO** pill, or a bordered "+" — the component doesn't know or care which:

```tsx
{
  label: "Subscription",
  icon: CreditCardIcon,
  badge: (
    <span className="flex items-center gap-0.5 rounded-full bg-green-400 px-2 py-0.5 text-[10px] font-bold text-black">
      <HugeiconsIcon icon={FlashIcon} size={10} color="black" strokeWidth={2.5} />
      PRO
    </span>
  ),
},
```

Same for `active` (highlights the row background) and `onClick` (the handler). The component owns the layout and the motion; you own the content.

## The dismiss layer, scoped on purpose

A menu needs a click-outside-to-close, and the usual way is a full-screen overlay fixed to the viewport. I didn't want that here, because this component is meant to live inside a container — a navbar, a card, a phone frame — and a viewport-sized overlay would trap clicks on the entire page while the little card is open.

So the dismiss layer is `absolute inset-0`, scoped to the component's own relative root:

```tsx
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onClick={() => setIsOpen(false)}
      className="absolute inset-0 z-10"
    />
  )}
</AnimatePresence>
```

It fills whatever box the component is placed in — not the whole screen — and sits at `z-10`, below the card and trigger at `z-20`. Click anywhere in the container but not on the card, and it closes. The card itself also has `onClick={() => setIsOpen(false)}`, so tapping a menu row's parent surface dismisses too, while the rows' own handlers still fire first. The overlay fades over 0.15s — fast, because a dismiss scrim is scaffolding, not something you want the eye to dwell on.

The honest limitation: because the overlay is scoped to the container, the component only "catches" outside-clicks that land *inside* that container. If you drop it into a 64px-tall navbar, clicking far below the navbar won't close it. That's the right trade-off for a self-contained block — but if you needed page-wide dismiss, you'd lift the overlay to a portal, and pay for it with the coupling that avoids.

## Accessibility and the reduced-motion story

Two things worth being honest about, because a build-along that hides its gaps isn't much of a tutorial.

The interaction is currently pointer-first: the trigger and rows are clickable `motion.button` and `motion.div` elements, so the rows get keyboard focus and Enter/Space activation for free, and `whileTap={{ scale: 0.98 }}` gives every row a physical press. What a production version still wants is the menu semantics around them — `aria-expanded` on the trigger, `role="menu"` on the container, and focus moving into the card when it opens so a keyboard user lands on the first row instead of having to tab across the whole navbar to reach it. The `menuReady` gate is actually a good anchor for that: the same moment the rows become clickable is the moment focus should move.

On motion: the entire effect is a spring on layout plus a short blur-fade, and none of it currently branches on `prefers-reduced-motion`. The right collapse is to keep the state change but drop the travel — snap the card to its final size, skip the 0.18s content delay and the blur, and let it simply appear. The information (the menu opened) survives; only the theatre goes away. That's a `useReducedMotion()` check away, and it's the first thing I'd add before shipping this into a real app.

## What this generalizes to

The pattern here isn't really "profile card." It's *one surface, two shapes, shared identity* — and once you've built it once, you see it everywhere. A search icon that expands into a search bar. A floating action button that unfurls into a compose sheet. A thumbnail that grows into a lightbox. They're all the same three moves: give the container a shared `layoutId`, pull anything that must not distort into its *own* `layoutId`, and delay the content so it fades into a shape that's already settled.

The bits that make it feel finished — the 4px blur on the content, the 400ms click guard, the identical spring on every layout child — are invisible individually and decisive together. That's usually where the difference between "a dropdown" and "the avatar became the menu" actually lives.

<!-- gif: collapsed avatar → expanded profile card morph -->

<!-- Profile Card is in the CraftUI gallery under Navbar → Profile Card. -->

<!-- tags: React, Framer Motion, Web Development, UI Design, Animation -->
