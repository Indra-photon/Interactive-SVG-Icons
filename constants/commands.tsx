import {
  BounceRightIcon,
  LoaderPinwheelIcon,
  CellsIcon,
  InformationCircleIcon,
  BirdhouseIcon,
  LayoutGridIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

export type CommandGroupId = "library" | "general";

export const commandGroupLabels: Record<CommandGroupId, string> = {
  library: "Library",
  general: "General",
};

// Render order of the groups in the palette.
export const commandGroupOrder: CommandGroupId[] = ["library", "general"];

export type CommandEntry = {
  id: string;
  label: string;
  group: CommandGroupId;
  icon: IconSvgElement;
  url: string;
  // Extra terms cmdk fuzzy-matches against, so "components" finds UI Components.
  keywords?: string[];
};

// Single source of truth for the ⌘K palette. Adding a future section
// (Illustrations, Design, …) is one entry here — no new global shortcut.
export const commands: CommandEntry[] = [
  {
    id: "blocks",
    label: "Blocks",
    group: "library",
    icon: CellsIcon,
    url: "/blocks",
    keywords: ["block", "sections", "components", "copy paste"],
  },
  {
    id: "sections",
    label: "Sections",
    group: "library",
    icon: LayoutGridIcon,
    url: "/sections",
    keywords: ["section", "hero", "pricing", "footer", "landing"],
  },
  {
    id: "icons",
    label: "Explore Icons",
    group: "library",
    icon: BounceRightIcon,
    url: "/icon-gallery",
    keywords: ["icon", "svg", "animated", "interactive"],
  },
  {
    id: "loaders",
    label: "Explore Loaders",
    group: "library",
    icon: LoaderPinwheelIcon,
    url: "/loader-gallery",
    keywords: ["loader", "spinner", "loading", "progress"],
  },
  {
    id: "ui",
    label: "UI Components",
    group: "library",
    icon: LayoutGridIcon,
    url: "/ui-gallery",
    keywords: ["ui", "components", "button", "input", "primitives"],
  },
  {
    id: "home",
    label: "Home",
    group: "general",
    icon: BirdhouseIcon,
    url: "/",
    keywords: ["start", "landing", "index"],
  },
  {
    id: "about",
    label: "About",
    group: "general",
    icon: InformationCircleIcon,
    url: "/about",
    keywords: ["info", "contact", "team"],
  },
];
