// import React from "react";

// import localFont from "next/font/local";
// import { twMerge } from "tailwind-merge";

// const CalSans = localFont({
//   src: [{ path: "../../fonts/CalSans-SemiBold.woff2" }],
//   display: "swap",
// });

// export const Paragraph = ({
//   className,
//   children,
// }: {
//   className?: string;
//   children: React.ReactNode;
// }) => {
//   return (
//     <p
//       className={twMerge(
//         "text-xl font-normal text-blog",
//         CalSans.className,
//         className
//       )}
//     >
//       {children}
//     </p>
//   );
// };

import React from "react";
import { twMerge } from "tailwind-merge";

type ParagraphProps<T extends React.ElementType = "p"> = {
  className?: string;
  children: React.ReactNode;
  as?: T;
  variant?: "crumb" | "caption" | "body" | "lead" | "title" | "display";
};

export const Paragraph = <T extends React.ElementType = "p">({
  className,
  children,
  as,
  variant = "body",
}: ParagraphProps<T>) => {
  const Tag = as || "p";

  // ── One type scale, named by role in the reading hierarchy ──────────────────
  //
  //   crumb 11→12 · caption 11→14 · body 13→15 · lead 18→20 · title 16→18 ·
  //   display 24→26                                    (base → lg, in px)
  //
  // Variants are named for the JOB the text does, never for the screen it sits
  // on. The set this replaced was named by surface — card-Heading, panel-Title,
  // overview-Title — which grew a Title/Description pair per new screen and
  // reached twelve variants, of which `card-Heading`/`panel-Title` and
  // `card-Description`/`panel-Description` were byte-identical, `small` and
  // `panel-Eyebrow` had zero call sites, and `overview-Title` had silently
  // drifted 2px away from its twin because an edit landed on only one of them.
  // A card title and a panel title are the same thing: `title`. Reach for an
  // existing step before adding a seventh.
  //
  // Two rules keep it from re-growing:
  //
  //  1. Type only. line-clamp, max-width, margin, text-align and one-off colour
  //     go on the call site — they are layout, and baking them in is what made
  //     the old overview-Description clamp to 3 lines on one card and 2 on its
  //     neighbour depending on who remembered to override it.
  //  2. Don't override the size from a call site. twMerge is modifier-aware, so
  //     a bare `text-[18px]` strips only the base step and loses to the
  //     variant's own sm:/md:/lg: rules above 640px. Overriding properly means
  //     restating all four steps — which is exactly the duplication that got
  //     `lead` promoted out of the old panel-Description. If a size is wrong
  //     here, fix it here.
  const variants = {
    // Breadcrumb segments — `sections / Know My Team / …` on every gallery
    // panel, always via <Paragraph as="span" variant="crumb">. Mono and grey to
    // read as a path, and small enough that the trailing crumb (left on
    // `title`) is unambiguously the heading. 24 spans across the four panels.
    crumb:
      "font-mono tracking-wide text-[11px] sm:text-[11px] md:text-[11px] lg:text-[12px] text-muted-foreground",
    // Secondary text under a `title`. Three sites: the loader and icon grid
    // cards on the overview screens, and the catalog empty state. Dimmed to /80
    // so a wall of cards reads as titles first. In a grid, always pair it with
    // an explicit line-clamp-N — one unclamped cell stretches the whole row.
    caption:
      "tracking-tighter text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] leading-normal text-secondary-foreground/80 text-pretty",
    // The default, and the workhorse — 18 live call sites (plus two parked in
    // commented-out blocks, BlockContentPanel:278 and IconSection:307) and
    // every <Paragraph> that names no variant at all. previewHints, the
    // "Copy the code snippet…" line in all three configurators, the icon design
    // note, UI feature bullets, homepage prose. If the text is a sentence and
    // it isn't introducing the screen, it's `body`.
    body: "tracking-tighter text-[13px] sm:text-[14px] md:text-[14px] lg:text-[15px] leading-normal text-secondary-foreground text-pretty",
    // The single summary line under a panel breadcrumb — one per screen, on all
    // seven gallery overview and detail views. A clear step above body so the
    // eye lands somewhere after the crumbs. Not for prose: a second `lead` on
    // a screen means neither is the entry point.
    lead: "tracking-tighter text-[16px] sm:text-[16px] md:text-[17px] lg:text-[18px] leading-normal text-secondary-foreground text-pretty",
    // Two jobs, 13 call sites:
    //
    //  · The breadcrumb line itself (7) — this goes on the wrapping <p>, and
    //    the trailing crumb is a bare <span className="text-foreground"> that
    //    inherits the size from here. Only the leading crumbs get `crumb`, so
    //    the active one ends up larger and darker without saying so twice.
    //  · Card titles (4) — the loader and icon grid cards, ShowcaseCard,
    //    HeroLinksList — plus the catalog empty state and ButtonCodeDisplay's
    //    "Example Component".
    //
    // Not for section headings inside a panel: "Props" and "Design decisions
    // taken here" are `display`, which is larger. `title` shares its
    // text-foreground with `display`; what separates the two is that `title`
    // names a thing and `display` opens a section.
    //
    // NB the steps are non-monotonic: 16px base, 14px at sm, back to 16/18, so
    // a phone renders this 2px larger than a small tablet. Left as-is because
    // it is load-bearing for the breadcrumb — check both widths before tuning.
    title:
      "tracking-wide font-medium text-base sm:text-[14px] md:text-[16px] lg:text-[18px] leading-tight text-foreground text-balance",
    // Section headings *inside* a panel — the only variant whose every use is a
    // hardcoded string, never data. Six live sites, three distinct headings:
    //
    //   "Props"                        BlockContentPanel:207, LoaderContentPanel:177,
    //                                  IconContentPanel:210, UIContentPanel:108
    //   "Design decisions taken here"  UIContentPanel:120
    //   "Installation"                 InstallCommand:13
    //
    // A seventh sits inside the commented-out features block at
    // BlockContentPanel:263 — restore that and "Design decisions taken here"
    // is back on blocks and sections too.
    //
    // Larger than `lead` on purpose: these break up a long scroll, so they
    // outrank the one summary line that opened the screen.
    display:
      "tracking-normal font-normal text-[24px] sm:text-[24px] md:text-[24px] lg:text-[26px] leading-relaxed text-foreground text-pretty",
  };

  return (
    <Tag className={twMerge(variants[variant], className)}>{children}</Tag>
  );
};
