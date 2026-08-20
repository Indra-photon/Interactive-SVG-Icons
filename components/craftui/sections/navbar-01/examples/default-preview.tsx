"use client";

import Image from "next/image";

import Navbar01 from "../default";

export default function Navbar01Preview() {
  return (
    <div className="h-full w-full overflow-y-auto bg-background">
      {/* The bar ships transparent, so the preview gives it the thing it is
          meant to sit on: a photo, with the nav floating over it. The blur is
          what keeps the labels legible wherever the image happens to be
          bright — a flat scrim would do it too, but it would also flatten the
          photo the bar is supposed to be riding on. */}
      <div className="relative isolate min-h-[580px] w-full overflow-hidden bg-[oklch(0.145_0_0)]">
        <Image
          alt=""
          className="object-cover"
          fill
          priority
          sizes="100vw"
          src="/preview/navbar01.png"
        />
        {/* Darkens the top band only, so the white ink holds even over a pale
            sky while the rest of the photo stays untouched. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-32"
          style={{
            background:
              "linear-gradient(to bottom, oklch(0.145 0 0 / 0.45), transparent)",
          }}
        />
        <Navbar01 className="relative z-10 backdrop-blur-md" />
      </div>
    </div>
  );
}
