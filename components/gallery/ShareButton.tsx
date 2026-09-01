"use client";

import { useState } from "react";
import {
  IconShare2,
  IconBrandX,
  IconBrandLinkedin,
  IconBrandReddit,
  IconLink,
  IconCheck,
} from "@tabler/icons-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Paragraph } from "@/components/Paragraph";

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
}

export function ShareButton({ title }: ShareButtonProps) {
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
      icon: IconBrandX,
      href: `https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      label: "LinkedIn",
      icon: IconBrandLinkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: "Reddit",
      icon: IconBrandReddit,
      href: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    },
  ];

  return (
    <Popover onOpenChange={onOpenChange}>
      <PopoverTrigger
        aria-label="Share this item"
        className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <IconShare2
          className="size-3.5 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
        <Paragraph as="span" variant="crumb" className="whitespace-nowrap">
          Share
        </Paragraph>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-56 p-1.5">
        <button
          onClick={copyLink}
          className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors hover:bg-accent"
        >
          {copied ? (
            <IconCheck
              className="size-3.5 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
          ) : (
            <IconLink
              className="size-3.5 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
          )}
          <Paragraph as="span" variant="caption">
            {copied ? "Link copied" : "Copy link"}
          </Paragraph>
        </button>

        <div className="my-1 h-px bg-border" />

        {networks.map(({ label, icon: Icon, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 transition-colors hover:bg-accent"
          >
            <Icon
              className="size-3.5 shrink-0 text-muted-foreground"
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
