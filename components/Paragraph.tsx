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
  variant?:
    | "default"
    | "muted"
    | "small"
    | "card-Heading"
    | "card-Description"
    | "panel-Eyebrow"
    | "panel-Title"
    | "panel-Description";
};

export const Paragraph = <T extends React.ElementType = "p">({
  className,
  children,
  as,
  variant = "default",
}: ParagraphProps<T>) => {
  const Tag = as || "p";

  const variants = {
    default:
      " tracking-tighter text-[13px] sm:text-[14px] md:text-[14px] lg:text-[15px] text-secondary-foreground text-pretty",
    "card-Heading":
      "tracking-wide font-medium text-base sm:text-[18px] md:text-[19px] lg:text-[20px] leading-tight text-foreground text-balance",
    "card-Description":
      "tracking-tighter text-[13px] sm:text-[14px] md:text-[14px] lg:text-[15px] leading-normal text-secondary-foreground text-pretty",
    // ── Detail-panel scale (the middle column of the icon/loader panels) ──
    // Eyebrow → Title → Description, meant to be used together in that order.
    "panel-Eyebrow":
      "font-mono text-[11px] sm:text-xs uppercase tracking-widest text-muted-foreground",
    "panel-Title":
      "tracking-wide font-medium text-base sm:text-[18px] md:text-[19px] lg:text-[20px] leading-tight text-foreground text-balance",
    "panel-Description":
      "tracking-tighter text-[13px] sm:text-[14px] md:text-[14px] lg:text-[15px] leading-normal text-secondary-foreground text-pretty",
    muted:
      "font-sans font-medium tracking-tighter text-[14px] md:text-[16px] text-pretty",
    small:
      "text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-300 text-pretty",
  };

  return (
    <Tag className={twMerge(variants[variant], className)}>{children}</Tag>
  );
};
