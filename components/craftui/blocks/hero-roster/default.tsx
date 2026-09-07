"use client";

import { useState } from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  type Transition,
} from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon, FlashIcon } from "@hugeicons/core-free-icons";

/* ─────────────────────────────────────────────────────────
 * ANIMATION STORYBOARD — roster ⇄ dossier
 *
 *  browsing   five cast cards across the panel. Each card carries a
 *             `layoutId`, and each holds a drawn character rather than a photo
 *             — one vector that resolves at pane size and at thumbnail size.
 *  on select  the pressed card TRAVELS AND GROWS into the dossier on the left
 *             while the other four shrink into a two-by-two rail. Nothing
 *             fades out and back in: the four that stay are the same four
 *             elements, just smaller and somewhere else.
 *  switching  picking a thumbnail swaps the two — the new one grows into the
 *             pane as the old one shrinks back into the rail, passing each
 *             other mid-flight. That exchange is the interaction.
 *  details    name, team, powers and copy are NOT part of the morph. A shared
 *             layout animation cannot be steered, so they ride on top and
 *             arrive once the card has nearly landed, staggered by rank.
 * ───────────────────────────────────────────────────────── */

const SELECT: Transition = { type: "spring", duration: 0.52, bounce: 0.16 };
const RETURN: Transition = { type: "spring", duration: 0.4, bounce: 0 };
const LEAVE: Transition = { type: "spring", duration: 0.16, bounce: 0 };

/* Concentric with the panel: the study card is rounded-3xl (24px) and this
 * block sits 12px inside it, so every child surface is 24 − 12 = 12. */
const R_CARD = 12;

const HEROES: {
  id: string;
  name: string;
  alias: string;
  team: string;
  debut: string;
  powers: string[];
  note: string;
  art: string;
  credit: string;
}[] = [
  {
    id: "nova",
    name: "Nova Byte",
    alias: "Priya Raman",
    team: "The Uplink",
    debut: "2019",
    powers: ["Current-walking", "Hard light", "Packet sight"],
    note: "Reads a city's wiring the way most people read a room, and has never once explained how. Politest member of the roster, worst at goodbyes.",
    art: "https://images.pexels.com/photos/10989650/pexels-photo-10989650.jpeg?auto=compress&cs=tinysrgb&w=1200",
    credit: "Messina Photo / Pexels",
  },
  {
    id: "ember",
    name: "Emberling",
    alias: "Tomas Vega",
    team: "The Uplink",
    debut: "2021",
    powers: ["Slow burn", "Heat sense", "Fireproof"],
    note: "Started as a kitchen accident and became a career. Runs warm in every sense, which the team has learned to schedule around.",
    art: "https://images.pexels.com/photos/20029622/pexels-photo-20029622.jpeg?auto=compress&cs=tinysrgb&w=1200",
    credit: "Jo Seph / Pexels",
  },
  {
    id: "verdant",
    name: "Verdant",
    alias: "Ada Oyelaran",
    team: "Greenline",
    debut: "2018",
    powers: ["Growth", "Root-speech", "Season sense"],
    note: "Can hold a park together through a drought and would rather do that than fight anyone. Keeps a seed bank in the cape lining.",
    art: "https://images.pexels.com/photos/6159682/pexels-photo-6159682.jpeg?auto=compress&cs=tinysrgb&w=1200",
    credit: "Introspective Dsgn / Pexels",
  },
  {
    id: "lumen",
    name: "Lumen",
    alias: "Juno Park",
    team: "Nightwatch",
    debut: "2023",
    powers: ["Refraction", "Afterimage", "Night sight"],
    note: "Newest of the five and already the hardest to photograph. Insists the afterimages are not a personality, which is exactly what they would say.",
    art: "https://images.pexels.com/photos/38576037/pexels-photo-38576037.jpeg?auto=compress&cs=tinysrgb&w=1200",
    credit: "Pedro H Novais / Pexels",
  },
  {
    id: "tide",
    name: "Tide Warden",
    alias: "Sam Kelling",
    team: "Greenline",
    debut: "2016",
    powers: ["Undertow", "Deep breath", "Weather nose"],
    note: "Longest-serving and the only one who files reports on time. Talks about the harbour the way other people talk about family.",
    art: "https://images.pexels.com/photos/12689070/pexels-photo-12689070.jpeg?auto=compress&cs=tinysrgb&w=1200",
    credit: "Vidal Balielo Jr / Pexels",
  },
];

/* `background-size: cover` re-crops the photograph at every size, so one URL
 * serves both the pane and the thumbnail — an <img> would need its own
 * object-fit correction to keep up with a box a layout animation is scaling.
 * The 1px inset outline keeps every photo reading as a picture on any
 * surface; it is a token rather than a fixed rgba because a black hairline
 * is invisible on a dark ground and a white one on a light one. */
function frame(art: string) {
  return {
    backgroundImage: `url(${art})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundColor: "var(--hr-frame)",
    borderRadius: R_CARD,
    overflow: "hidden" as const,
    boxShadow: "inset 0 0 0 1px var(--hr-frame-edge)",
  };
}

export default function HeroRoster({ className }: { className?: string }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const choose = (id: string | null) => setSelectedId(id);
  const selected = HEROES.find((hero) => hero.id === selectedId) ?? null;
  const rest = HEROES.filter((hero) => hero.id !== selectedId);

  return (
    <MotionConfig transition={selected ? SELECT : RETURN} reducedMotion="user">
      <div className={`flex h-full w-full gap-3 p-3 ${className ?? ""}`}>
        {/* ── Dossier ───────────────────────────────────────── */}
        <AnimatePresence mode="popLayout" initial={false}>
          {selected && (
            <motion.div
              key="dossier"
              layout
              className="relative min-w-0 flex-[1.35]"
              style={{ borderRadius: R_CARD }}
              exit={{ opacity: 0, transition: LEAVE }}
            >
              <motion.div
                layoutId={`card-${selected.id}`}
                style={frame(selected.art)}
                className="absolute inset-0"
              />

              {/* Rides on top of the morph rather than inside it.

                  Everything from here down is laid over a photograph, not
                  over the theme's ground — so it stays white-on-dark in both
                  themes. Flipping it would put dark text on whatever the
                  photo happens to be. */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: LEAVE }}
                transition={{ ...SELECT, delay: 0.08 }}
                className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/55 to-transparent p-4 pt-16 text-white"
              >
                <motion.p
                  initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ ...SELECT, delay: 0.1 }}
                  className="text-[11px] font-medium tracking-wide text-white/70 uppercase"
                >
                  {selected.team} · Debut{" "}
                  <span className="tabular-nums">{selected.debut}</span>
                </motion.p>

                <motion.h3
                  initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ ...SELECT, delay: 0.13 }}
                  className="mt-1 text-2xl font-bold tracking-tight text-balance"
                >
                  {selected.name}
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ ...SELECT, delay: 0.15 }}
                  className="mt-0.5 text-xs text-white/70"
                >
                  Civilian identity · {selected.alias}
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ ...SELECT, delay: 0.17 }}
                  className="mt-2 max-w-[52ch] text-[13px] leading-[1.5] text-pretty text-white/80"
                >
                  {selected.note}
                </motion.p>

                {/* Powers stagger among themselves — one entrance per chunk,
                    ~30ms apart, so the row reads left to right instead of
                    landing as a single block. */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {selected.powers.map((power, i) => (
                    <motion.span
                      key={power}
                      initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ ...SELECT, delay: 0.19 + i * 0.03 }}
                      style={{ borderRadius: 999 }}
                      className="flex items-center gap-1 bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm"
                    >
                      <HugeiconsIcon
                        icon={FlashIcon}
                        size={13}
                        strokeWidth={2.4}
                        aria-hidden="true"
                        focusable="false"
                      />
                      {power}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              <motion.button
                type="button"
                onClick={() => choose(null)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, transition: LEAVE }}
                transition={{ ...SELECT, delay: 0.06 }}
                whileTap={{ scale: 0.96 }}
                aria-label="Back to roster"
                style={{ borderRadius: 999 }}
                className="absolute top-3 left-3 flex size-11 cursor-pointer items-center justify-center bg-white/85 text-[#0b0b0b] backdrop-blur transition-colors duration-150 ease-out outline-none hover:bg-white"
              >
                <HugeiconsIcon
                  icon={ArrowLeft02Icon}
                  size={19}
                  strokeWidth={2.4}
                  aria-hidden="true"
                  focusable="false"
                />
              </motion.button>

              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: LEAVE }}
                transition={{ ...SELECT, delay: 0.22 }}
                className="absolute right-3 bottom-3 text-[10px] text-white/45"
              >
                {selected.credit}
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Roster / thumbnail rail ───────────────────────── */}
        <motion.div
          layout
          className={`grid min-w-0 gap-3 ${
            selected
              ? "h-full flex-1 grid-cols-2 grid-rows-2"
              : "flex-[5] grid-cols-5 content-start gap-4"
          }`}
        >
          {rest.map((hero) => (
            <motion.button
              key={hero.id}
              type="button"
              layout
              onClick={() => choose(hero.id)}
              whileTap={{ scale: 0.96 }}
              className={`group relative w-full cursor-pointer outline-none ${
                selected ? "h-full min-h-0" : "aspect-square"
              }`}
              aria-label={`${hero.name}, ${hero.alias}`}
            >
              <motion.span
                layoutId={`card-${hero.id}`}
                style={frame(hero.art)}
                className="absolute inset-0 block"
              />

              {/* The caption belongs to the roster, not to the card, so it
                  leaves when the roster becomes a rail. This one DOES sit on
                  the theme's ground, so it takes the theme's ink. */}
              <AnimatePresence initial={false}>
                {!selected && (
                  <motion.span
                    key="caption"
                    layout="position"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, transition: LEAVE }}
                    transition={{ ...SELECT, delay: 0.06 }}
                    className="absolute inset-x-0 -bottom-11 block truncate text-left"
                  >
                    <span
                      title={hero.name}
                      className="block truncate text-sm leading-tight font-semibold text-[var(--hr-fg)]"
                    >
                      {hero.name}
                    </span>
                    <span
                      title={hero.alias}
                      className="block truncate text-xs text-[var(--hr-fg-muted)]"
                    >
                      {hero.alias}
                    </span>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </MotionConfig>
  );
}
