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
  variant?: "default" | "muted" | "small" | "card-Heading" | "card-Description";
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
      "font-lighter tracking-tighter text-[13px] sm:text-[14px] md:text-[14px] lg:text-[15px] text-muted-foreground text-secondary-foreground text-pretty",
    "card-Heading":
      "tracking-tight font-medium sm:text-[18px] md:text-[19px] lg:text-[20px] text-foreground text-pretty",
    "card-Description":
      "font-lighter tracking-tighter text-[13px] sm:text-[14px] md:text-[14px] lg:text-[15px] text-foreground/90 text-pretty",
    muted:
      "font-sans font-medium tracking-tighter text-[14px] md:text-[16px] text-pretty",
    small:
      "text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-300 text-pretty",
  };

  return (
    <Tag className={twMerge(variants[variant], className)}>{children}</Tag>
  );
};
