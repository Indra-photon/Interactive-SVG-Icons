import {
  Home01Icon,
  BounceRightIcon,
  LoaderPinwheelIcon,
  CellsIcon,
  InformationCircleIcon,
  BirdhouseIcon,
  LayoutGridIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

export const navlinks: {
  url: string;
  label: string;
  icon: IconSvgElement;
}[] = [
  {
    url: "/",
    label: "Home",
    icon: BirdhouseIcon,
  },
  {
    url: "/icons",
    label: "Explore Icons",
    icon: BounceRightIcon,
  },
  {
    url: "/loaders",
    label: "Explore Loaders",
    icon: LoaderPinwheelIcon,
  },
  {
    url: "/blocks",
    label: "Blocks",
    icon: CellsIcon,
  },
  {
    url: "/ui",
    label: "UI Components",
    icon: LayoutGridIcon,
  },
  {
    url: "/about",
    label: "About",
    icon: InformationCircleIcon,
  },
];
