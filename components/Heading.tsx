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
        " tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tighter text-foreground text-balance",
        className,
      )}
    >
      {children}
    </Tag>
  );
};
