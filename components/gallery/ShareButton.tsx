"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckIcon,
  Link01Icon,
  Linkedin01Icon,
  NewTwitterIcon,
  RedditIcon,
  Share01Icon,
} from "@hugeicons/core-free-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Paragraph } from "@/components/Paragraph";
import { RAIL_ICON_SIZE, RAIL_ICON_STROKE, RAIL_ROW } from "./railStyles";

/**
 * Share the item currently on screen.
 *
 * A button rather than a rail section on purpose: sharing is a once-in-a-visit
 * action, and a permanent column of network links would take the most space on
 * the page for the least-used thing on it.
 */

interface ShareButtonProps {
  /** Sentence used as the tweet/post text. */
  title: string;
  /**
   * Where it is rendered. `chip` is the bordered button that sits beside "Full
   * screen" in the centre column, below xl. `rail` is the same control drawn as
   * a sidebar row, for the detail rail — one component, because the two are the
   * same action and only one of them is on screen at a time.
   */
  variant?: "chip" | "rail";
}

export function ShareButton({ title, variant = "chip" }: ShareButtonProps) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  // Read from the browser rather than rebuilding the URL from props: the page
  // is query-param driven, so location already carries the exact item and
  // variation on screen, including anything a deep link added. Captured when
  // the popover opens, which is both the latest possible moment and the only
  // one that matters.
  const onOpenChange = (open: boolean) => {
    if (open) setUrl(window.location.href);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const networks = [
    {
      label: "X",
      icon: NewTwitterIcon,
      href: `https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      label: "LinkedIn",
      icon: Linkedin01Icon,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: "Reddit",
      icon: RedditIcon,
      href: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    },
  ];

  const isRail = variant === "rail";

  return (
    <Popover onOpenChange={onOpenChange}>
      <PopoverTrigger
        aria-label="Share this item"
        className={
          isRail
            ? RAIL_ROW
            : "flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        }
      >
        <HugeiconsIcon
          icon={Share01Icon}
          size={RAIL_ICON_SIZE}
          strokeWidth={RAIL_ICON_STROKE}
          className={`shrink-0 ${
            isRail ? "text-sidebar-icon-muted" : "text-muted-foreground"
          }`}
          aria-hidden="true"
        />
        {isRail ? (
          <span>Share</span>
        ) : (
          <Paragraph as="span" variant="crumb" className="whitespace-nowrap">
            Share
          </Paragraph>
        )}
      </PopoverTrigger>

      {/* The popover floats over the page rather than sitting on the sidebar
          surface, so it keeps the global `accent` hover — matching it to
          `sidebar-accent` would tint it against the wrong background. */}
      <PopoverContent align="end" className="w-56 p-1.5">
        <button
          onClick={copyLink}
          className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors hover:bg-accent"
        >
          <HugeiconsIcon
            icon={copied ? CheckIcon : Link01Icon}
            size={RAIL_ICON_SIZE}
            strokeWidth={RAIL_ICON_STROKE}
            className="shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <Paragraph as="span" variant="caption">
            {copied ? "Link copied" : "Copy link"}
          </Paragraph>
        </button>

        <div className="my-1 h-px bg-border" />

        {networks.map(({ label, icon, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 transition-colors hover:bg-accent"
          >
            <HugeiconsIcon
              icon={icon}
              size={RAIL_ICON_SIZE}
              strokeWidth={RAIL_ICON_STROKE}
              className="shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <Paragraph as="span" variant="caption">
              {label}
            </Paragraph>
          </a>
        ))}
      </PopoverContent>
    </Popover>
  );
}
