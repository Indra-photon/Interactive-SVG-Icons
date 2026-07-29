# New in CraftUI: an avatar that unfolds into its own profile card

*The little top-right circle doesn't open a menu — it becomes one.*

Every app has the same corner: a round avatar that, when clicked, drops a menu with your name, your plan, and a sign-out. Almost always it's a dropdown — the avatar holds still and a separate panel fades in beneath it. Two elements that never quite feel related.

Profile Card ships today doing the opposite. Tap the 40px avatar and the avatar itself expands into a 310px floating card — header, grouped menu rows, badges and all. Dismiss it and the card folds back down into the circle it came from. It's one surface changing shape, not a button plus a popover.

## What makes it different

The card and the avatar aren't two components stitched together — they're the same element interpolated by a shared layout ID. Framer Motion measures the box you're leaving and the box you're arriving at and springs the difference: position, width, height, corner radius, all in one continuous move. There's no clone, no swap, no fade-from-nothing.

- **Two shared-layout tracks, not one.** The card morphs from 40px to 310px, and the avatar rides a *separate* layout ID so it stays a perfect circle the whole way instead of stretching into an egg as the box goes wide.
- **Content that waits for the shape.** The name, email, and rows fade in 180ms *after* the morph starts, with a 4px blur that resolves to zero — they focus into a card that's already settled, so nothing smears mid-flight.
- **One spring, everywhere.** Every moving part uses the same `duration: 0.5, bounce: 0.25` spring, which is why the whole thing reads as one coordinated object rather than several pieces arriving on their own schedules.
- **A 400ms click guard.** The menu rows stay non-interactive until the fade finishes, so a fast cursor — or a stray mouse-up from the opening click — can't fire "Sign out" on a menu that isn't visible yet.
- **Flat data, grouped output.** You pass a single flat list of rows; a per-row `dividerAfter` flag draws the group separators. Badges, active state, and click handlers are all composable slots per item — a red "3", a green PRO pill, or anything you hand it.

## Where to use it

- The account corner of a navbar or app header.
- A personalization or settings entry point that benefits from feeling physical.
- A compact dashboard shell where a full-page account menu would be overkill.
- Any product moment where you want the identity control to feel like *one* object, not a trigger and a tray.

## Where not to use it

- **When the menu must escape its container.** The dismiss layer is scoped to the component's own box, not the viewport — perfect for a self-contained block, wrong when you need clicks anywhere on the page to close it. That case wants a portal.
- **For long or scrolling menus.** The card is a fixed 310px width built for six-ish rows. A twenty-item settings tree belongs in a real panel.
- **As a keyboard-first power menu today.** It's pointer-first: rows focus and activate, but it doesn't yet ship the full `role="menu"` / `aria-expanded` contract or move focus into the card on open. If keyboard navigation is the primary path, wait for that layer or add it yourself.

## What your users get

The expansion is a spring on a real shape change, so it reads as motion with mass, not a panel blinking into place. Rows give a tactile press on tap, and the click guard means the first thing a user touches is always the thing they meant to touch — no accidental sign-outs during the open animation. The preview sits on light and dark navbar surfaces out of the box.

The honest edge: motion doesn't yet branch on `prefers-reduced-motion`, and the keyboard semantics are still pointer-first. Both are the first things on the list — the 400ms guard already marks exactly where focus should land when they arrive.

Profile Card is in the CraftUI gallery under Navbar. Drop it into a header, pass your name, email, and menu items, and the corner does the rest.

<!-- gif: collapsed avatar → expanded profile card morph -->

<!-- Full build walkthrough on Medium: "Morphing an Avatar into a Profile Card with Framer Motion's layoutId" -->
