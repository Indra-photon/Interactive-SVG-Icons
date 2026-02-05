"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface CustomLinkProps {
  href: string;
  LinkTitle?: string;
  className?: string;
  children: ReactNode;
}

export const CustomLink = ({ href, LinkTitle, className, children }: CustomLinkProps) => {
  const handleClick = () => {
    // window.dataLayer = window.dataLayer || [];
    // window.dataLayer.push({
    //   event: 'blog_click',
    //   article_url: href,
    //   article_title: articleTitle
    // });
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
};