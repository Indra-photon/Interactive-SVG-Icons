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

type HugeIcon = React.ComponentProps<typeof HugeiconsIcon>["icon"];

export type TeamMember = AvatarMember & {
  icon?: HugeIcon;
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

const TIMING = {
  heading: 0,
  body: 0.12,
  detail: 0.48,
};

const EASE = [0.165, 0.84, 0.44, 1] as const;
const DURATION = 0.25;

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

export default function TeamCluster01({
  eyebrow = "Know my team",
  heading = "The people behind the work",
  body = "Six of us, one studio, and a shared refusal to ship things that feel almost right.",
  members = DEFAULT_MEMBERS,
  className,
}: TeamCluster01Props = {}) {
  const scopeId = React.useId().replace(/:/g, "");
  const reduceMotion = useReducedMotion();
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
      <style>
        {`
          .team-${scopeId} {
            display: grid;
            gap: 2.5rem;
            grid-template-areas: "copy" "cluster" "detail";
          }
          @media (min-width: 1280px) {
            .team-${scopeId} {
              grid-template-columns: minmax(0, 1fr) minmax(0, 550px);
              grid-template-areas: "copy cluster" "detail cluster";
              align-items: end;
              column-gap: 1rem;
              row-gap: 2rem;
            }
            .team-${scopeId} [data-role-badge] {
              display: none;
            }
          }
        `}
      </style>

      <div
        className={`team-${scopeId} mx-auto max-w-6xl px-5 sm:px-8 xl:max-w-6xl`}
      >
        <div
          style={{ gridArea: "copy" }}
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
          <motion.p
            {...rise(TIMING.body)}
            className="mx-auto mt-4 max-w-md text-base leading-relaxed text-pretty text-[var(--team-fg-muted)] xl:mx-0"
          >
            {body}
          </motion.p>
        </div>

        <div style={{ gridArea: "cluster" }} className="xl:-ml-[94px]">
          <AvatarGrid
            members={members}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onActiveChange={setActiveId}
            roleBadges
            renderBadge={(member) => (
              <span className="block text-left">
                <span className="block">{member.name}</span>
                <span className="mt-0.5 block text-[9px] font-normal opacity-75">
                  {member.role}
                </span>
              </span>
            )}
            className="!p-0 !justify-start xl:[&>div]:max-w-[600px]"
          />
        </div>

        <motion.div
          style={{ gridArea: "detail" }}
          {...rise(TIMING.detail)}
          className="hidden md:block"
        >
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
                    <span className="flex min-w-0 shrink-0 items-center gap-2.5 text-left">
                      {member.icon && (
                        <HugeiconsIcon
                          icon={member.icon}
                          size={16}
                          strokeWidth={1.5}
                          color="currentColor"
                          className="shrink-0"
                          aria-hidden="true"
                        />
                      )}
                      {member.role}
                    </span>
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
