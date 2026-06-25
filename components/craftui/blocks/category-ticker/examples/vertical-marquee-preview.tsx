"use client";

import CategoryTickerVerticalMarquee from "../vertical-marquee";

export default function VerticalMarqueePreview() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <div className="h-full w-full overflow-hidden rounded-2xl">
        <CategoryTickerVerticalMarquee />
      </div>
    </div>
  );
}
