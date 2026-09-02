/**
 * Shared motion vocabulary.
 *
 * Everything here was previously defined two or three times across separate
 * card components, with comments in each copy explaining that it had to match
 * one of the others — ArtworkCard's read "Lifted from ShowcaseCard so the two
 * grids enter identically". A comment asking a human to keep two constants in
 * sync is a constant that wants to be imported.
 *
 * Motion values, not layout. Radii and spacing live in globals.css as tokens.
 */

/** The house entrance curve. Fast out, long settle. */
export const ENTRANCE_EASE = [0.19, 1, 0.22, 1] as const;

/** Curve for panels that slide over a card on hover. */
export const PANEL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * How every card in a grid arrives: lift, fade and unblur together.
 *
 * Used by the hero card grid, the showcase masonry and the artwork masonry.
 * Because all three share it, a stagger set on any parent produces the same
 * cadence — which is what makes the homepage and the galleries feel like one
 * surface rather than three that were tuned separately.
 */
export const cardEntrance = {
  hidden: { y: 18, opacity: 0, filter: "blur(8px)" },
  show: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: ENTRANCE_EASE },
  },
};

/**
 * Entrance for a grid whose ROWS arrive as units, rather than card by card.
 *
 * The hero grid is eight cards in two rows of four. Staggering all eight makes
 * the last one land most of a second after the first, which reads as the page
 * still loading. Staggering by row is two beats instead of eight: each row
 * arrives whole, and the grid reads as structure rather than as a queue.
 *
 * `custom` carries the row index. The delay is baked in rather than left to a
 * parent's `delayChildren`, because a child transition that sets its own
 * `delay` overrides the parent's rather than adding to it — so orchestrating
 * from both ends would silently drop one.
 *
 * Masonry grids keep `cardEntrance`: they have no rows to speak of, and
 * per-card stagger is the right read for a column that fills as you scroll.
 */
export const rowEntrance = {
  hidden: { y: 18, opacity: 0, filter: "blur(8px)" },
  show: (row = 0) => ({
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: ENTRANCE_EASE,
      delay: 0.3 + row * 0.14,
    },
  }),
};

/**
 * The card→dialog morph, and the fade of everything that travels with it.
 *
 * Springs rather than eased tweens, because the panel can be dismissed at any
 * moment — including halfway through opening. A tween interrupted mid-flight
 * restarts from zero velocity and reads as a snap; a spring keeps the velocity
 * it already had. `bounce: 0` because the two boxes share an aspect ratio, so
 * there is no overshoot worth selling: this is a box being carried, not thrown.
 *
 * Note this is *movement*, not an entrance. The box is already on screen as a
 * card and travels to a new size and place, which is why it does not take
 * ENTRANCE_EASE — an ease-out starts at near-full speed and reads as the card
 * being flung across the page rather than picked up off it.
 */
export const MORPH_IN = { type: "spring", duration: 0.3, bounce: 0 } as const;

/**
 * The way back. Exits run about 20% faster than entrances — the user has
 * already decided, and holding them at the same pace reads as the interface
 * being reluctant.
 *
 * Which of the two applies is decided by *which element is animating*, not by a
 * direction flag: opening is timed by the dialog panel's transition, closing by
 * the card's, since shared layout promotes whichever element survives. Setting
 * only one of them leaves the other direction on a default.
 */
export const MORPH_OUT = { type: "spring", duration: 0.24, bounce: 0 } as const;

/** Reduced motion: state changes still happen, they just don't travel. */
export const MORPH_INSTANT = { duration: 0 } as const;

/**
 * The chrome around a morphing panel — overlay, caption, close button.
 *
 * Same durations as the box on both directions, because paired elements that
 * finish at different times stop reading as one thing: an overlay that clears
 * before the artwork lands leaves it flying back across an undimmed page. The
 * chrome cuts rather than travels, though — two things moving along different
 * paths at once reads as two animations.
 */
export const morphChrome = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: MORPH_IN },
  exit: { opacity: 0, transition: MORPH_OUT },
};

/**
 * The same chrome for users who asked for less motion. Opacity is included in
 * "less motion" — a fade is still something moving in the corner of the eye.
 */
export const morphChromeInstant = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: MORPH_INSTANT },
  exit: { opacity: 0, transition: MORPH_INSTANT },
};

/**
 * Empty parent variants whose only job is to open a `hover` context for
 * children to inherit. Motion needs the named states to exist on the parent
 * before a child can respond to them; there is deliberately nothing in them.
 */
export const hoverOrchestrator = {
  initial: {},
  hover: {},
};

/** The info panel that rises over an icon or loader card on hover. */
export const sliderVariants = {
  initial: {
    y: "100%",
    opacity: 0,
    filter: "blur(2px)",
    transition: { duration: 0.35, ease: PANEL_EASE },
  },
  hover: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: PANEL_EASE },
  },
};

/**
 * The same panel for users who asked for less motion: it still appears, but it
 * cuts rather than travels, and never blurs. Reduced motion means no vestibular
 * trigger, not no interface.
 */
export const reducedSliderVariants = {
  initial: {
    y: "100%",
    opacity: 0,
    filter: "blur(0px)",
    transition: { duration: 0 },
  },
  hover: { y: 0, opacity: 1, filter: "blur(0px)", transition: { duration: 0 } },
};
