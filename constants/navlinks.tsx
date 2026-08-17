import {
  Home01Icon,
  BounceRightIcon,
  LoaderPinwheelIcon,
  CellsIcon,
  InformationCircleIcon,
  BirdhouseIcon,
  LayoutGridIcon,
  BookImageIcon,
  ShapeCollectionIcon,
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
    url: "/sections",
    label: "Sections",
    icon: LayoutGridIcon,
  },
  {
    url: "/ui-gallery",
    label: "UI Components",
    icon: LayoutGridIcon,
  },
  {
    url: "/illustrations",
    label: "Illustrations",
    icon: BookImageIcon,
  },
  {
    url: "/designs",
    label: "Designs",
    icon: ShapeCollectionIcon,
  },
  {
    url: "/about",
    label: "About",
    icon: InformationCircleIcon,
  },
];
