import React from "react";
import { twMerge } from "tailwind-merge";

type HeadingProps<T extends React.ElementType = "h1"> = {
  className?: string;
  children: React.ReactNode;
  as?: T;
};

export const Heading = <T extends React.ElementType = "h1">({
  className,
  children,
  as,
}: HeadingProps<T>) => {
  const Tag = as || "h1";

  return (
    <Tag
      className={twMerge(
        "font-sans tracking-tighter text-5xl sm:text-6xl md:text-6xl lg:text-6xl xl:text-6xl leading-tighter text-foreground text-balance",
        className,
      )}
    >
      {children}
    </Tag>
  );
};
