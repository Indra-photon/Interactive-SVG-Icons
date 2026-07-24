import StickyFrostedNav from "../frosted-navbar";

const CARDS = Array.from({ length: 8 }, (_, i) => i);

export default function FrostedNavbarPreview() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-neutral-100 dark:bg-neutral-900">
      <div className="relative h-full w-full max-w-[420px] overflow-hidden bg-white shadow-sm">
        <div className="h-full overflow-y-auto">
          <StickyFrostedNav className="px-4 py-3 sm:px-5 sm:py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-black antialiased">
                craftui
              </span>
              <div className="flex items-center gap-3 text-xs text-black/60 antialiased sm:gap-4">
                <span className="hidden sm:inline">Docs</span>
                <span className="hidden sm:inline">Blocks</span>
                <span className="rounded-full bg-black/5 px-3 py-1.5 text-black">
                  Sign in
                </span>
              </div>
            </div>
          </StickyFrostedNav>

          <div className="flex flex-col gap-3 px-4 pt-4 pb-8 sm:px-5">
            {CARDS.map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl bg-black px-4 py-3.5"
              >
                <div className="h-9 w-9 flex-shrink-0 rounded-lg bg-black/10" />
                <div className="flex flex-col gap-1.5">
                  <div className="h-2.5 w-32 rounded-full bg-black/15" />
                  <div className="h-2 w-20 rounded-full bg-black/[0.07]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
