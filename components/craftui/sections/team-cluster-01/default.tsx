"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Compass01Icon,
  PaintBoardIcon,
  SourceCodeIcon,
  CustomerSupportIcon,
  Rocket01Icon,
  DocumentValidationIcon,
} from "@hugeicons/core-free-icons";
import AvatarGrid, {
  type AvatarMember,
} from "@/components/craftui/blocks/avatar/default";

// ── Types ─────────────────────────────────────────────────────────────────────

type HugeIcon = React.ComponentProps<typeof HugeiconsIcon>["icon"];

export type TeamMember = AvatarMember & {
  /**
   * Icon for this person's row. Optional and unset by default for custom
   * members: six copies of one generic user glyph is decoration, and a row
   * with nothing to say at its leading edge is better off saying nothing.
   */
  icon?: HugeIcon;
  /** One short phrase, ~40 characters. It is clamped to a single line so the
   *  role list stays about as tall as the square cluster beside it. */
  bio?: string;
  links?: { label: string; href: string }[];
};

export interface TeamCluster01Props {
  eyebrow?: string;
  heading?: React.ReactNode;
  body?: React.ReactNode;
  members?: TeamMember[];
  className?: string;
}

/* ─────────────────────────────────────────────────────────
 * SECTION STORYBOARD — on scroll into view
 *
 *    0ms   eyebrow + heading fade up ..... 250ms  easeOutQuart
 *  120ms   body + CTA fade up ............ 250ms  easeOutQuart
 *  240ms   brand mark lands .............. 250ms  easeOutQuart  ┐ owned by
 *  300ms   ring 1 tiles .................. 250ms  easeOutQuart  ├ AvatarGrid
 *  360ms   ring 2 tiles .................. 250ms  easeOutQuart  ┘
 *  480ms   detail panel fades in ......... 200ms  easeOutQuad
 *
 * The cluster's own outward-ring entrance is the middle beat rather than a
 * separate event — the section borrows its rhythm instead of introducing a
 * second timing vocabulary.
 *
 * Detail swaps (hover or click) are a crossfade with an 8px directional hint,
 * never a slide: a caption changing under the cursor should not be the
 * loudest thing on screen.
 * ───────────────────────────────────────────────────────── */
const TIMING = {
  heading: 0,
  body: 0.12,
  detail: 0.48,
};

/** ease-out-quart — shared with the cluster so the section reads as one piece. */
const EASE = [0.165, 0.84, 0.44, 1] as const;
const DURATION = 0.25;

// ── Default content ──────────────────────────────────────────────────────────

const DEFAULT_MEMBERS: TeamMember[] = [
  {
    id: "maya",
    name: "Maya Ellis",
    role: "Founder & CEO",
    icon: Compass01Icon,
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
    cell: [2, 2],
    bio: "Started the studio in 2019.",
    links: [{ label: "LinkedIn", href: "#" }],
  },
  {
    id: "noor",
    name: "Noor Haddad",
    role: "Head of Design",
    icon: PaintBoardIcon,
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    cell: [2, 3],
    bio: "Sets the craft bar, sketch to pixel.",
    links: [{ label: "Portfolio", href: "#" }],
  },
  {
    id: "tom",
    name: "Tom Brandt",
    role: "Principal Engineer",
    icon: SourceCodeIcon,
    src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    cell: [3, 2],
    bio: "Owns the rendering pipeline.",
    links: [{ label: "GitHub", href: "#" }],
  },
  {
    id: "amir",
    name: "Amir Rahal",
    role: "Support Lead",
    icon: CustomerSupportIcon,
    src: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80",
    cell: [3, 4],
    bio: "Answers every ticket personally.",
    links: [{ label: "Email", href: "#" }],
  },
  {
    id: "dev",
    name: "Dev Sharma",
    role: "Product Engineer",
    icon: Rocket01Icon,
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    cell: [4, 3],
    bio: "Builds the parts customers touch most.",
    links: [{ label: "GitHub", href: "#" }],
  },
  {
    id: "lena",
    name: "Lena Fischer",
    role: "Content Reviewer",
    icon: DocumentValidationIcon,
    src: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&auto=format&fit=crop&q=80",
    cell: [4, 4],
    bio: "Keeps the documentation honest.",
    links: [{ label: "Writing", href: "#" }],
  },
];

// ── Root ──────────────────────────────────────────────────────────────────────

export default function TeamCluster01({
  eyebrow = "Know my team",
  heading = "The people behind the work",
  body = "Six of us, one studio, and a shared refusal to ship things that feel almost right.",
  members = DEFAULT_MEMBERS,
  className,
}: TeamCluster01Props = {}) {
  const scopeId = React.useId().replace(/:/g, "");
  const reduceMotion = useReducedMotion();
  // Two pieces of state, deliberately. `selectedId` is the committed choice
  // and the section owns it, so the role list and the cluster can never
  // disagree about who is picked. `activeId` is what the cluster reports back
  // — the same value most of the time, but the hover preview while a cursor
  // is over a face, which is what the name and bio should follow.
  const [selectedId, setSelectedId] = React.useState<string | null>(
    members[0]?.id ?? null,
  );
  const [activeId, setActiveId] = React.useState<string | null>(
    members[0]?.id ?? null,
  );
  const rise = (delay: number) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
    whileInView: reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: DURATION, ease: EASE, delay },
  });

  return (
    <section
      className={`w-full bg-[var(--team-surface)] py-16 sm:py-20 xl:py-28 ${className ?? ""}`}
    >
      {/*
        Grid areas rather than duplicated markup: the detail panel sits under
        the copy on desktop and under the cluster on tablet, and it must stay
        one element in the DOM — it is aria-live, so a second copy would
        announce every change twice. Written as real media queries because the
        area strings don't survive Tailwind's arbitrary-value syntax.
      */}
      <style>
        {`
          .team-${scopeId} {
            display: grid;
            gap: 2.5rem;
            grid-template-areas: "copy" "cluster" "detail";
          }
          @media (min-width: 1280px) {
            .team-${scopeId} {
              grid-template-columns: minmax(0, 1fr) minmax(0, 520px);
              grid-template-areas: "copy cluster" "detail cluster";
              align-items: center;
              column-gap: 4rem;
              row-gap: 2rem;
            }
            /*
              On desktop the role belongs under the copy, not on the photo:
              the panel is already sitting right there in the reading path, so
              a badge over the tile would say the same thing twice and cover
              the face it names. Below 1280 the layout stacks and the panel
              falls well under the cluster, so the on-tile badge earns its
              place again. Done in CSS rather than with a resize listener so
              there is no breakpoint state to hydrate or re-render on.
            */
            .team-${scopeId} [data-role-badge] {
              display: none;
            }
          }
        `}
      </style>

      <div className={`team-${scopeId} mx-auto max-w-6xl px-5 sm:px-8`}>
        {/* ── Copy ── */}
        <div
          style={{ gridArea: "copy" }}
          // Left on phones, where centred type over a full-bleed column gives
          // the eye a different start point on every line; centred only in the
          // stacked tablet layout, where the copy sits above a centred cluster
          // and has room to spare.
          className="mx-auto max-w-xl text-left md:text-center xl:mx-0 xl:max-w-none xl:text-left"
        >
          <motion.p
            {...rise(TIMING.heading)}
            className="text-xs font-medium tracking-[0.14em] text-[var(--team-fg-muted)] uppercase"
          >
            {eyebrow}
          </motion.p>
          <motion.h2
            {...rise(TIMING.heading)}
            className="mt-3 text-3xl font-medium tracking-tight text-balance text-[var(--team-fg)] sm:text-4xl xl:text-[2.75rem] xl:leading-[1.1]"
          >
            {heading}
          </motion.h2>
          {/* Capped to the same 28rem as the role list so the two share one
              right edge. The heading is deliberately left wider: a headline
              breaking its own measure reads as intent, whereas two blocks of
              body-weight text ending 25px apart reads as a mistake. */}
          <motion.p
            {...rise(TIMING.body)}
            className="mx-auto mt-4 max-w-md text-base leading-relaxed text-pretty text-[var(--team-fg-muted)] xl:mx-0"
          >
            {body}
          </motion.p>
        </div>

        {/* ── Cluster (all widths) ── */}
        <div style={{ gridArea: "cluster" }}>
          {/*
            One grid at every width — same 5×5, same cells, same arrangement.
            Only the tile size changes: the grid is fluid up to 460px, so a
            360px phone lands at ~64px tiles against ~85px on desktop. The
            block's own gap steps down on small screens to buy those tiles a
            few pixels back.
          */}
          <AvatarGrid
            members={members}
            // Controlled: clicking a role in the list and clicking a face
            // write to the same state, so the two halves stay in step.
            selectedId={selectedId}
            onSelect={setSelectedId}
            onActiveChange={setActiveId}
            roleBadges
            // Below 1280 the badge is the only place details can go, so it
            // carries name and role; at 1280 and up it is hidden entirely and
            // the copy list takes over.
            renderBadge={(member) => (
              <span className="block text-left">
                <span className="block">{member.name}</span>
                <span className="mt-0.5 block text-[9px] font-normal opacity-75">
                  {member.role}
                </span>
              </span>
            )}
            className="!p-0"
          />
        </div>

        {/* ── Detail panel (≥768px only — the phone list already shows this) ── */}
        <motion.div
          style={{ gridArea: "detail" }}
          {...rise(TIMING.detail)}
          className="hidden md:block"
        >
          {/*
            One role per row, in a single column, divided by the same 45°
            hatch the placeholder shells use — same angle, same 6px pitch, a
            heavier ink because a 4px band needs it to read at all. It ties
            the two halves of the section together without repeating the
            dashed outline, which at this scale would just look like a table.

            The list is static, so it needs no reserved height and no
            crossfade: selecting a role only moves the highlight, and the
            answer it produces is on the right.
          */}
          {/*
            Capped at 28rem at every width, including desktop where the column
            would otherwise let rows run past 800px. Role and name are a pair
            justified apart, and past roughly 480px the two halves stop reading
            as one row — the eye has to cross too much empty space to connect
            "Founder & CEO" to "Maya Ellis". The cap is the whole fix.
          */}
          <ul className="mx-auto max-w-md text-center [--hatch-ink:oklch(0_0_0_/_0.12)] xl:mx-0 xl:text-left dark:[--hatch-ink:oklch(1_0_0_/_0.16)]">
            {members.map((member, index) => {
              const isActive = activeId === member.id;
              return (
                <li key={member.id}>
                  {index > 0 && (
                    <div
                      aria-hidden="true"
                      className="h-1"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(45deg, var(--hatch-ink) 0 1px, transparent 1px 6px)",
                      }}
                    />
                  )}
                  <button
                    type="button"
                    aria-pressed={isActive}
                    aria-label={`${member.name} — ${member.role}`}
                    onClick={() => setSelectedId(member.id)}
                    // Hover previews here too, so running down the list flicks
                    // through the faces the same way running across the
                    // cluster does. Mouse only — on touch there is no leave
                    // event to undo it.
                    onPointerEnter={(event) => {
                      if (event.pointerType === "mouse")
                        setSelectedId(member.id);
                    }}
                    className={`flex w-full cursor-pointer items-start justify-between gap-6 py-2.5 text-sm transition-colors duration-150 ease-out focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--team-ring)] ${
                      isActive
                        ? "font-medium text-[var(--team-fg)]"
                        : "text-[var(--team-fg-muted)] hover:text-[var(--team-fg)]"
                    }`}
                  >
                    {/* An icon per role, not a repeated generic glyph: the
                        leading edge earns the space only if each mark says
                        something the row doesn't. It also gives the row the
                        affordance plain text never had. `currentColor` means
                        the icon inherits the row's active state — one SVG,
                        recoloured, no second asset and no extra transition. */}
                    <span className="flex min-w-0 shrink-0 items-center gap-2.5 text-left">
                      {member.icon && (
                        <HugeiconsIcon
                          icon={member.icon}
                          size={16}
                          // 1.5px beside 14px regular text: the icon should
                          // carry the same optical weight as the label, not
                          // outshout it.
                          strokeWidth={1.5}
                          color="currentColor"
                          className="shrink-0"
                          aria-hidden="true"
                        />
                      )}
                      {member.role}
                    </span>
                    {/* The name is the answer to a question the role already
                        raised, so it sits a step back: smaller, lighter, and
                        only catching up to the role's contrast when the row is
                        the active one. The description sits a step behind
                        that again — three weights, so the eye can stop at
                        whichever one it needed. */}
                    {/* Two type sizes in the row, not three: role at 14px,
                        name and bio both at 12px. Three sizes inside 30px of
                        vertical space is finer grading than the eye can use,
                        and it was spending the smallest size on the warmest
                        content. Name and bio separate on colour instead —
                        which also stops the bio being the faintest thing on
                        the page. */}
                    <span className="flex min-w-0 flex-col items-end text-right">
                      <span
                        className={`text-xs font-normal transition-colors duration-150 ease-out ${
                          isActive
                            ? "text-[var(--team-fg)]"
                            : "text-[var(--team-fg-soft)]"
                        }`}
                      >
                        {member.name}
                      </span>
                      {member.bio && (
                        // Clamped to one line: at two lines each row grows by
                        // ~14px, and six of those made the copy column
                        // noticeably taller than the square cluster it sits
                        // beside. The defaults are written short enough not to
                        // clip; the clamp is there so a longer custom bio
                        // can't break the balance either.
                        <span className="mt-0.5 line-clamp-1 text-xs leading-snug font-normal text-[var(--team-fg-muted)]">
                          {member.bio}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
