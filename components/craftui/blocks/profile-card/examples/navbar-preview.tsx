"use client";

import ProfileCard from "../navbar";

export default function NavbarPreview() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-white">
      <div className="relative h-[640px] w-[360px] overflow-hidden rounded-[32px] border border-black/10 bg-[#f2f2f7]">
        {/* Fake dashboard content */}
        <div className="absolute inset-0 px-6 pt-10">
          <div className="mt-6">
            <p className="text-xs font-semibold tracking-widest text-black/30 uppercase antialiased">
              Dashboard
            </p>
            <h1 className="mt-1 text-xl font-bold tracking-tight text-black antialiased">
              Good morning,
            </h1>
            <h1 className="text-xl font-bold tracking-tight text-black antialiased">
              Sophie ✦
            </h1>
          </div>
          <div className="mt-5 flex flex-col gap-3">
            <div className="h-20 rounded-2xl bg-white/80 shadow-sm" />
            <div className="flex gap-3">
              <div className="h-16 flex-1 rounded-2xl bg-white/80 shadow-sm" />
              <div className="h-16 flex-1 rounded-2xl bg-white/80 shadow-sm" />
            </div>
            <div className="h-24 rounded-2xl bg-white/80 shadow-sm" />
          </div>
        </div>

        {/* Pure component — fills the frame, positions avatar in its top-right */}
        <ProfileCard />
      </div>
    </div>
  );
}
