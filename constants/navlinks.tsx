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
    url: "/icon-gallery",
    label: "Explore Icons",
    icon: BounceRightIcon,
  },
  {
    url: "/loader-gallery",
    label: "Explore Loaders",
    icon: LoaderPinwheelIcon,
  },
  {
    url: "/blocks",
    label: "Blocks",
    icon: CellsIcon,
  },
  {
    url: "/ui-gallery",
    label: "UI Components",
    icon: LayoutGridIcon,
  },
  {
    url: "/about",
    label: "About",
    icon: InformationCircleIcon,
  },
];
