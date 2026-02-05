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
  variant?: "default" | "muted" | "small";
};

export const Paragraph = <T extends React.ElementType = "p">({
  className,
  children,
  as,
  variant = "default",
}: ParagraphProps<T>) => {
  const Tag = as || "p";
  
  const variants = {
    default: "text-sm sm:text-base md:text-lg leading-relaxed text-gray-600 dark:text-gray-300",
    muted: "text-xs sm:text-sm md:text-base leading-relaxed text-gray-500 dark:text-gray-400",
    small: "text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-300",
  };
  
  return (
    <Tag
      className={twMerge(
        variants[variant],
        className
      )}
    >
      {children}
    </Tag>
  );
};