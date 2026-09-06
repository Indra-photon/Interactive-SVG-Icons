"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  Alert01Icon,
  CheckIcon,
  ChevronRightIcon,
  CopyIcon,
  File01Icon,
  GithubIcon,
  InformationCircleIcon,
  LayoutGridIcon,
  Share01Icon,
  SourceCodeIcon,
} from "@hugeicons/core-free-icons";
import { ShareButton } from "./ShareButton";
import {
  RAIL_GROUP,
  RAIL_GROUP_LABEL,
  RAIL_ICON_SIZE,
  RAIL_ICON_STROKE,
  RAIL_ROW,
  RAIL_SURFACE,
} from "./railStyles";
import { repoFileUrl, repoIssueUrl } from "@/constants/repo";

/**
 * The right column on the gallery detail screens — blocks, sections, icons and
 * loaders all render the same one.
 *
 * It exists because the install command, the tier and the dependencies used to
 * sit *below* the preview: the single most-wanted line on the page was under
 * the fold on every item. Those move up here and stay put while the centre
 * column scrolls.
 *
 * Only above `xl`. Below that the rail is hidden and each panel keeps rendering
 * the same content inline in the centre column — the alternative is that a
 * laptop loses the install command altogether.
 *
 * Visually it is the left sidebar mirrored: same floating `bg-sidebar` card,
 * same group labels, same row height and hover, same Hugeicons at 15/1.5. It
 * had drifted into a second design system — transparent surface with one
 * hairline border, mono headings, Tabler icons, and four different button
 * shapes — which read as two unrelated panels flanking one page. All of that
 * now comes from `railStyles.ts`, which restates the sidebar's own classes.
 */

export interface RailRelatedItem {
  label: string;
  href: string;
  /** Live thumbnail, where the item is small enough to be worth one. */
  preview?: ReactNode;
}

export interface DetailRailProps {
  /**
   * Registry item name, used to pull the item's own source out of
   * `/r/<name>.json` for the copy actions. Omit to drop those actions.
   */
  registryName?: string;
  /** Item label used in the AI prompt and the issue title. */
  itemLabel: string;
  /** One-liner describing the item, for the AI prompt. */
  description?: string;
  /** Label/value rows — tier, dependencies, animation type. */
  meta?: { label: string; value: string }[];
  /** Siblings worth jumping to. Rendered only when non-empty. */
  related?: RailRelatedItem[];
  /** Heading over the related list, e.g. "More in loops". */
  relatedLabel?: string;
  /** Repo-relative path to the item's own file, for the GitHub link. */
  sourcePath?: string;
}

// ── Sidebar-shaped primitives ────────────────────────────────────────────────

/**
 * Per-glyph optical sizes, in the units `HugeiconsIcon` takes.
 *
 * A shared `size` normalises the *box*, not the mark inside it, and Hugeicons
 * glyphs fill their 24-unit viewBox by very different amounts. Measured ink
 * extents when every one of these is rendered at 16:
 *
 *   SourceCode  10.7      Github  11.3      Alert01  12.0 × 14.1
 *   LayoutGrid  12.7      Copy    13.3 × 12.0      File01  13.3 × 11.7
 *
 * — which is why `</>` read a step smaller than the copy squares two rows
 * under it. These sizes normalise the ink to roughly 13px instead. Stroke is
 * never touched (a `scale` transform would thin it), and each icon is still
 * centred in the same 16px box, so the text baseline and the 8px gap to the
 * label are identical on every row whatever the number here says.
 *
 * Anything not listed renders at RAIL_ICON_SIZE, which is right for a glyph
 * that already fills its viewBox. Measure before adding an entry — there is a
 * one-off script in the commit that added this.
 */
const OPTICAL_SIZE = new Map<IconSvgElement, number>([
  [SourceCodeIcon, 19],
  [GithubIcon, 18],
  [CheckIcon, 18],
  [Alert01Icon, 15],
  [CopyIcon, 15],
]);

/**
 * One 16px box, one stroke, ink normalised. Used for every icon in the rail —
 * group labels, row icons and the related chevron alike.
 */
function RailIcon({
  icon,
  className,
  ...rest
}: {
  icon: IconSvgElement;
  className?: string;
} & { "aria-hidden"?: boolean }) {
  return (
    <span
      className="flex size-4 shrink-0 items-center justify-center"
      {...rest}
    >
      <HugeiconsIcon
        icon={icon}
        size={OPTICAL_SIZE.get(icon) ?? RAIL_ICON_SIZE}
        strokeWidth={RAIL_ICON_STROKE}
        className={className}
      />
    </span>
  );
}

/** A `SidebarGroup` + `SidebarGroupLabel` pair, icon and all. */
function RailGroup({
  label,
  icon,
  children,
}: {
  label: string;
  icon: IconSvgElement;
  children: ReactNode;
}) {
  return (
    <div className={RAIL_GROUP}>
      <h3 className={RAIL_GROUP_LABEL}>
        <RailIcon icon={icon} className="text-sidebar-icon-muted" />
        {label}
      </h3>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

/** The leading icon on a rail row. */
function RowIcon({
  icon,
  accent,
}: {
  icon: IconSvgElement;
  accent?: boolean;
}) {
  return (
    <RailIcon
      icon={icon}
      className={
        accent ? "text-sidebar-icon-accent" : "text-sidebar-icon-muted"
      }
    />
  );
}

/**
 * A copy action as a sidebar row. Deliberately not `CopyButton` — that one is a
 * ghost <Button> with a white-on-chip icon and its own `rounded-[10px]` mono
 * type, which is right where it is used (install command, configurators) and
 * wrong against a column of 28px sidebar rows. Eight other call sites keep it
 * unchanged.
 */
function RailCopyRow({
  label,
  getText,
}: {
  label: string;
  getText: () => Promise<string>;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(await getText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button type="button" onClick={handleCopy} className={RAIL_ROW}>
      {/* Same swap the copy buttons elsewhere use. RailIcon's fixed 16px box
          is what keeps the row from jumping when the tick lands — the tick is
          drawn at 18 and the copy squares at 15. */}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={copied ? "check" : "copy"}
          initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
          transition={{ type: "spring", duration: 0.3, bounce: 0 }}
          className="flex"
        >
          <RowIcon icon={copied ? CheckIcon : CopyIcon} accent={copied} />
        </motion.span>
      </AnimatePresence>
      <span>{copied ? "Copied" : label}</span>
    </button>
  );
}

/**
 * Pulls the item's source files out of its registry JSON. That file is already
 * built and served statically from /r, so this needs no API route — and it is
 * the same content the shadcn CLI would install, which is what makes it the
 * honest answer to "copy the source".
 */
async function fetchSource(registryName: string): Promise<string> {
  const res = await fetch(`/r/${registryName}.json`);
  if (!res.ok) throw new Error(`Registry item ${registryName} not found`);
  const data = await res.json();
  const files: { path: string; content: string }[] = data.files ?? [];
  return files
    .map((file) => `// ${file.path}\n\n${file.content}`)
    .join("\n\n");
}

export function DetailRail({
  registryName,
  itemLabel,
  description,
  meta = [],
  related = [],
  relatedLabel = "Related",
  sourcePath,
}: DetailRailProps) {
  const copySource = async () => {
    if (!registryName) return "";
    return fetchSource(registryName);
  };

  const copyPrompt = async () => {
    if (!registryName) return "";
    const source = await fetchSource(registryName);
    return [
      `Here is a React component called "${itemLabel}".`,
      description ? `\n${description}` : "",
      meta.length
        ? `\n${meta.map((m) => `${m.label}: ${m.value}`).join("\n")}`
        : "",
      "\nSource:\n",
      "```tsx",
      source,
      "```",
      "\nUse it as the starting point for the change I describe next. Keep its",
      "existing animation behaviour and prop names unless I ask otherwise.",
    ]
      .filter(Boolean)
      .join("\n");
  };

  return (
    // Fixed width and never shrinks; the centre column is the flexible one. The
    // padding is `--sidebar-gap`, the same inset the floating left sidebar sits
    // at, so the two cards are equidistant from the page card's edges.
    <aside className="hidden w-[320px] shrink-0 p-(--sidebar-gap) xl:block">
      <div className={RAIL_SURFACE}>
        {/* Related. First in the rail now that the install command sits in the
            centre column, directly above the props table. */}
        {related.length > 0 && (
          <RailGroup label={relatedLabel} icon={LayoutGridIcon}>
            {related.map((item) => (
              <Link key={item.href} href={item.href} className={RAIL_ROW}>
                {item.preview ?? <RowIcon icon={File01Icon} />}
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                <RailIcon
                  icon={ChevronRightIcon}
                  className="text-sidebar-foreground/40"
                  aria-hidden
                />
              </Link>
            ))}
          </RailGroup>
        )}

        {/* Take it elsewhere */}
        {registryName && (
          <RailGroup label="Use it" icon={SourceCodeIcon}>
            <RailCopyRow label="Copy source" getText={copySource} />
            <RailCopyRow label="Copy as AI prompt" getText={copyPrompt} />
            {sourcePath && (
              <a
                href={repoFileUrl(sourcePath)}
                target="_blank"
                rel="noopener noreferrer"
                className={RAIL_ROW}
              >
                <RowIcon icon={GithubIcon} />
                <span>View on GitHub</span>
              </a>
            )}
          </RailGroup>
        )}

        {/* Meta. A dl rather than rows: these are values, not actions, so they
            get no hover affordance — but they keep the row's grid and type. */}
        {meta.length > 0 && (
          <RailGroup label="Details" icon={InformationCircleIcon}>
            <dl className="flex flex-col">
              {meta.map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-baseline gap-3 px-2 py-1.5"
                >
                  {/* Wide enough for the longest label the panels pass
                      ("Category"), and `truncate` so a longer one added later
                      clips rather than running under the value — which is what
                      `w-14` + `tracking-widest` did to CATEGORY. */}
                  <dt className="w-[76px] shrink-0 truncate text-[11px] tracking-wider uppercase text-sidebar-foreground/50">
                    {label}
                  </dt>
                  <dd className="min-w-0 text-xs tracking-tight break-words text-sidebar-foreground/90">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </RailGroup>
        )}

        {/* Share and report. Rows now, not bordered chips: the chip shape reads
            as a primary action, and neither of these is. They follow the
            content rather than being pinned to the bottom edge — a spacer
            pushed them past a screen of nothing on every short rail, which
            looked broken rather than roomy. */}
        <RailGroup label="This page" icon={Share01Icon}>
          <ShareButton title={itemLabel} variant="rail" />

          {/* A button rather than a link: the issue URL has to carry the page
              the reader is actually on, and that isn't known until the click. */}
          <button
            type="button"
            onClick={() =>
              window.open(
                repoIssueUrl({
                  title: `[${itemLabel}] `,
                  itemLabel,
                  itemUrl: window.location.href,
                }),
                "_blank",
                "noopener,noreferrer",
              )
            }
            className={RAIL_ROW}
          >
            <RowIcon icon={Alert01Icon} />
            <span>Report an issue</span>
          </button>
        </RailGroup>
      </div>
    </aside>
  );
}
