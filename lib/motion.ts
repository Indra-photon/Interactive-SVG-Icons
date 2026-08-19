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
