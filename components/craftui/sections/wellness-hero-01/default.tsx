"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  ArrowUpRight01Icon,
  Menu01Icon,
  Message01Icon,
} from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";
import { instrumentSerif } from "./font";

export type WellnessProduct = {
  name: string;
  category: string;
  note: string;
};

export interface WellnessHero01Props {
  brand?: string;
  nav?: string[];
  heading?: React.ReactNode;
  body?: React.ReactNode;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  products?: WellnessProduct[];
  image?: string;
  className?: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const DEFAULT_NAV = ["Belief", "Products", "Team"];

const DEFAULT_PRODUCTS: WellnessProduct[] = [
  {
    name: "GoPolar",
    category: "Cold + heat",
    note: "Understand cold plunge and sauna sessions, and the recovery patterns around them.",
  },
  {
    name: "SunSeek",
    category: "Sun + rhythm",
    note: "Build a healthier relationship with sunlight, time outdoors, and your daily rhythm.",
  },
  {
    name: "Posture AI",
    category: "Movement + posture",
    note: "See how you move, understand everyday strain, and build greater confidence in your body.",
  },
];

function HeroHeader({
  brand,
  nav,
  primaryLabel,
  primaryHref,
}: {
  brand: string;
  nav: string[];
  primaryLabel: string;
  primaryHref: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <header
      className={cn(
        "relative z-10 w-full py-[clamp(1rem,2.2vh,1.5rem)]",
        "pr-[max(1.5rem,env(safe-area-inset-right))] pl-[max(1.5rem,env(safe-area-inset-left))] md:pr-[max(3rem,env(safe-area-inset-right))] md:pl-[max(3rem,env(safe-area-inset-left))]",
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 lg:items-baseline">
        <a
          href="#top"
          className={cn(
            "inline-flex shrink-0 items-center rounded-full font-[family-name:var(--font-serif,ui-serif,Georgia,serif)] text-[26px] leading-[1.2] font-normal whitespace-nowrap text-stone-950 md:text-[30px]",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950",
          )}
        >
          {brand}
        </a>

        <div className="flex flex-1 items-center justify-end gap-8 lg:items-baseline">
          <nav className="hidden min-w-0 items-baseline gap-8 lg:flex">
            {nav.map((item) => (
              <a
                key={item}
                href="#"
                className={cn(
                  "rounded-full text-[16px] leading-5 font-medium text-stone-950 transition-colors duration-200 hover:text-stone-800",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950",
                )}
              >
                {item}
              </a>
            ))}
          </nav>

          <motion.a
            href={primaryHref}
            whileHover={reduceMotion ? undefined : { y: -1 }}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            transition={{ duration: 0.2, ease: EASE }}
            className={cn(
              "hidden items-center rounded-[9px] px-5 py-3 text-[16px] leading-5 font-medium text-stone-950 lg:inline-flex",
              "bg-yellow-500 bg-[linear-gradient(180deg,oklch(94.5%_0.129_101.54)_0px,oklch(90.5%_0.182_98.111)_24px,oklch(79.5%_0.184_86.047)_52px)]",
              "shadow-[inset_0_1px_0_rgba(255,255,255,0.34),inset_0_-1px_0_oklch(28.6%_0.066_53.813_/_0.2),0_1px_2px_oklch(28.6%_0.066_53.813_/_0.16),0_8px_16px_-10px_oklch(28.6%_0.066_53.813_/_0.55)]",
              "transition-[box-shadow] duration-200 ease-[ease]",
              "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.42),inset_0_-1px_0_oklch(28.6%_0.066_53.813_/_0.2),0_1px_2px_oklch(28.6%_0.066_53.813_/_0.16),0_12px_20px_-10px_oklch(28.6%_0.066_53.813_/_0.6)]",
              "active:shadow-[inset_0_1px_2px_oklch(28.6%_0.066_53.813_/_0.28),0_1px_1px_oklch(28.6%_0.066_53.813_/_0.14)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950",
            )}
          >
            {primaryLabel}
          </motion.a>

          <button
            type="button"
            className={cn(
              "rounded-full p-1 text-stone-950 lg:hidden",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950",
            )}
          >
            <span className="sr-only">Open menu</span>
            <HugeiconsIcon
              icon={Menu01Icon}
              size={22}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </header>
  );
}

function HeroCopy({
  heading,
  body,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: {
  heading: React.ReactNode;
  body: React.ReactNode;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
}) {
  const reduceMotion = useReducedMotion();

  const rise = (y: number, delay: number) =>
    reduceMotion
      ? {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.4, ease: EASE },
        }
      : {
          initial: { opacity: 0, y, filter: "blur(6px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { duration: 0.8, delay, ease: EASE },
        };

  return (
    <div
      className={cn(
        "relative z-10 flex w-full items-start pt-[clamp(0.5rem,2vh,2rem)] pb-[clamp(1rem,2.5vh,2rem)]",
        "pr-[max(1.5rem,env(safe-area-inset-right))] pl-[max(1.5rem,env(safe-area-inset-left))] md:pr-[max(3rem,env(safe-area-inset-right))] md:pl-[max(3rem,env(safe-area-inset-left))]",
      )}
    >
      <div className="mx-auto w-full max-w-7xl pt-10 lg:pt-16">
        <div className="w-full max-w-[560px]">
          <motion.h1
            {...rise(12, 0)}
            className="font-[family-name:var(--font-serif,ui-serif,Georgia,serif)] text-[clamp(40px,min(6.2vw,9vh),92px)] leading-[1.08] font-normal text-balance text-stone-950"
          >
            {heading}
          </motion.h1>

          <motion.p
            {...rise(10, 0.12)}
            className="mt-5 max-w-full text-[18px] leading-7 font-normal tracking-[-0.5px] text-pretty text-stone-800"
          >
            {body}
          </motion.p>

          <motion.div
            {...rise(8, 0.24)}
            className="mt-7 flex flex-wrap items-center gap-3"
          >
            <motion.a
              href={primaryHref}
              whileHover={reduceMotion ? undefined : { y: -1 }}
              whileTap={reduceMotion ? undefined : { scale: 0.97 }}
              transition={{ duration: 0.2, ease: EASE }}
              className={cn(
                "inline-flex items-center gap-3 rounded-[9px] px-3 py-2 text-[16px] leading-5 font-medium text-stone-950",
                "bg-yellow-500 bg-[linear-gradient(180deg,oklch(94.5%_0.129_101.54)_0px,oklch(90.5%_0.182_98.111)_24px,oklch(79.5%_0.184_86.047)_52px)]",
                "shadow-[inset_0_1px_0_rgba(255,255,255,0.34),inset_0_-1px_0_oklch(28.6%_0.066_53.813_/_0.2),0_1px_2px_oklch(28.6%_0.066_53.813_/_0.16),0_8px_16px_-10px_oklch(28.6%_0.066_53.813_/_0.55)]",
                "transition-[box-shadow] duration-200 ease-[ease]",
                "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.42),inset_0_-1px_0_oklch(28.6%_0.066_53.813_/_0.2),0_1px_2px_oklch(28.6%_0.066_53.813_/_0.16),0_12px_20px_-10px_oklch(28.6%_0.066_53.813_/_0.6)]",
                "active:shadow-[inset_0_1px_2px_oklch(28.6%_0.066_53.813_/_0.28),0_1px_1px_oklch(28.6%_0.066_53.813_/_0.14)]",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950",
              )}
            >
              {primaryLabel}
              <span className="flex size-8 items-center justify-center rounded-[6px] bg-yellow-950 text-yellow-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]">
                <HugeiconsIcon
                  icon={Message01Icon}
                  size={16}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </span>
            </motion.a>

            <motion.a
              href={secondaryHref}
              initial="rest"
              whileHover={reduceMotion ? undefined : "hover"}
              whileFocus={reduceMotion ? undefined : "hover"}
              whileTap={reduceMotion ? undefined : { scale: 0.97 }}
              variants={{ rest: { y: 0 }, hover: { y: -1 } }}
              transition={{ duration: 0.2, ease: EASE }}
              className={cn(
                "group inline-flex items-center gap-3 rounded-[9px] px-3 py-2 text-[16px] leading-5 font-medium text-stone-950",
                "bg-yellow-200 bg-[linear-gradient(180deg,oklch(98.7%_0.026_102.212)_0px,oklch(97.3%_0.071_103.193)_26px,oklch(94.5%_0.129_101.54)_52px)]",
                "shadow-[inset_0_0_0_1px_oklch(85.2%_0.199_91.936_/_0.55),inset_0_1px_0_rgba(255,255,255,0.85),inset_0_-1px_0_oklch(28.6%_0.066_53.813_/_0.12),0_1px_1px_oklch(28.6%_0.066_53.813_/_0.06),0_6px_14px_-12px_oklch(28.6%_0.066_53.813_/_0.3)]",
                "transition-[box-shadow] duration-200 ease-[ease]",
                "hover:shadow-[inset_0_0_0_1px_oklch(68.1%_0.162_75.834_/_0.6),inset_0_1px_0_rgba(255,255,255,0.8),inset_0_-1px_0_oklch(28.6%_0.066_53.813_/_0.06),0_1px_1px_oklch(28.6%_0.066_53.813_/_0.08),0_10px_18px_-12px_oklch(28.6%_0.066_53.813_/_0.38)]",
                "active:shadow-[inset_0_0_0_1px_oklch(68.1%_0.162_75.834_/_0.6),inset_0_1px_2px_oklch(28.6%_0.066_53.813_/_0.14),0_1px_1px_oklch(28.6%_0.066_53.813_/_0.06)]",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950",
              )}
            >
              {secondaryLabel}
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-[6px] text-yellow-950",
                  "bg-yellow-300 bg-[linear-gradient(180deg,oklch(90.5%_0.182_98.111)_0px,oklch(85.2%_0.199_91.936)_32px)]",
                  "shadow-[inset_0_0_0_1px_oklch(68.1%_0.162_75.834_/_0.6),inset_0_1px_0_rgba(255,255,255,0.45)]",
                  "transition-[box-shadow,background-color,color] duration-200 ease-[ease]",
                  "group-hover:bg-yellow-400 group-hover:shadow-[inset_0_0_0_1px_oklch(55.4%_0.135_66.442_/_0.55),inset_0_1px_0_rgba(255,255,255,0.45)]",
                )}
              >
                <motion.span
                  variants={{ rest: { x: 0 }, hover: { x: 2 } }}
                  transition={{ duration: 0.15, ease: [0.2, 0, 0, 1] }}
                  className="flex items-center justify-center"
                >
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={16}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </motion.span>
              </span>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function HeroBloom({ image }: { image: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative -z-10 h-[40vh] w-full lg:absolute lg:inset-y-0 lg:end-0 lg:h-full lg:w-[48%]"
    >
      <motion.img
        src={image}
        alt=""
        initial={
          reduceMotion
            ? { opacity: 0 }
            : { opacity: 0, scale: 1.03, filter: "blur(6px)" }
        }
        animate={
          reduceMotion
            ? { opacity: 1 }
            : { opacity: 1, scale: 1, filter: "blur(0px)" }
        }
        transition={
          reduceMotion
            ? { duration: 0.4, ease: EASE }
            : { duration: 1.65, delay: 0.15, ease: EASE }
        }
        className={cn(
          "h-full w-full object-cover object-[62%_45%] [will-change:filter,transform,opacity] lg:object-[52%_50%]",
          "[mask-image:linear-gradient(to_right,transparent_0%,#000_32%),linear-gradient(to_bottom,transparent_0%,#000_14%,#000_62%,transparent_96%)] [mask-composite:intersect]",
          "rtl:[mask-image:linear-gradient(to_left,transparent_0%,#000_32%),linear-gradient(to_bottom,transparent_0%,#000_14%,#000_62%,transparent_96%)] rtl:object-[38%_45%] lg:rtl:object-[48%_50%]",
        )}
      />
    </div>
  );
}

function ProductRow({ product }: { product: WellnessProduct }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.a
      href="#products"
      initial="rest"
      whileHover={reduceMotion ? undefined : "hover"}
      whileFocus={reduceMotion ? undefined : "hover"}
      className={cn(
        "group relative grid grid-cols-1 items-start gap-x-8 gap-y-2 py-[clamp(1.1rem,3.2vh,2.2rem)] lg:grid-cols-[minmax(0,0.55fr)_minmax(9rem,max-content)_minmax(0,1.35fr)] lg:items-baseline",
        "before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-yellow-400/55 before:transition-colors before:duration-200 before:ease-[ease] before:content-['']",
        "before:[mask-image:linear-gradient(to_right,#000_0%,#000_58%,transparent_100%)] rtl:before:[mask-image:linear-gradient(to_left,#000_0%,#000_58%,transparent_100%)]",
        "hover:before:bg-yellow-600/60 focus-visible:before:bg-yellow-600/60",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950",
      )}
    >
      <span
        className={cn(
          "flex items-center gap-3 font-[family-name:var(--font-serif,ui-serif,Georgia,serif)] text-[clamp(26px,min(3vw,4.4vh),40px)] leading-[1.1] font-normal text-balance text-stone-950",
          "underline decoration-transparent decoration-from-font underline-offset-[0.12em] transition-[text-decoration-color] duration-200 ease-[ease]",
          "group-hover:decoration-stone-950/45 group-focus-visible:decoration-stone-950/45",
        )}
      >
        {product.name}
        <motion.span
          variants={{ rest: { x: 0, y: 0 }, hover: { x: 3, y: -3 } }}
          transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
          className="mt-2 flex shrink-0 items-center justify-center"
        >
          <HugeiconsIcon
            icon={ArrowUpRight01Icon}
            size={22}
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </motion.span>
      </span>

      <span className="text-[12px] leading-4 font-normal tracking-[0.1em] text-stone-950 uppercase">
        {product.category}
      </span>

      <span className="text-[18px] leading-7 font-normal tracking-[-0.5px] text-pretty text-stone-800">
        {product.note}
      </span>
    </motion.a>
  );
}

function ProductTable({ products }: { products: WellnessProduct[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "relative z-10 mt-auto w-full pt-[clamp(2rem,5vh,3.5rem)] pb-[max(clamp(1.5rem,4vh,3.5rem),env(safe-area-inset-bottom))]",
        "pr-[max(1.5rem,env(safe-area-inset-right))] pl-[max(1.5rem,env(safe-area-inset-left))] md:pr-[max(3rem,env(safe-area-inset-right))] md:pl-[max(3rem,env(safe-area-inset-left))]",
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-[1] h-full bg-linear-to-b from-transparent via-[#fbfaec] via-35% to-[#fbfaec]"
      />

      <motion.div
        initial={
          reduceMotion
            ? { opacity: 0 }
            : { opacity: 0, y: 14, filter: "blur(6px)" }
        }
        animate={
          reduceMotion
            ? { opacity: 1 }
            : { opacity: 1, y: 0, filter: "blur(0px)" }
        }
        transition={
          reduceMotion
            ? { duration: 0.4, ease: EASE }
            : { duration: 1.65, delay: 0.7, ease: EASE }
        }
        className="mx-auto w-full max-w-7xl"
      >
        {products.map((product) => (
          <ProductRow key={product.name} product={product} />
        ))}
      </motion.div>
    </div>
  );
}

export default function WellnessHero01({
  brand = "The Wellness Company",
  nav = DEFAULT_NAV,
  heading = "Live better, feel sharper.",
  body = "Three tools that read your cold, your sunlight and your movement, and turn them into patterns you can act on.",
  primaryLabel = "Text us",
  primaryHref = "sms:+16284687855",
  secondaryLabel = "How we work",
  secondaryHref = "#how",
  products = DEFAULT_PRODUCTS,
  image = "/paper-image/wellnessHero01.png",
  className,
}: WellnessHero01Props) {
  return (
    <section
      className={cn(
        instrumentSerif.variable,
        "[--font-serif:var(--font-instrument-serif,ui-serif,Georgia,serif)]",
        "relative isolate flex! min-h-screen w-full flex-col place-items-stretch! overflow-hidden bg-[#fbfaec]",
        className,
      )}
    >
      <HeroHeader
        brand={brand}
        nav={nav}
        primaryLabel={primaryLabel}
        primaryHref={primaryHref}
      />
      <HeroCopy
        heading={heading}
        body={body}
        primaryLabel="Text us to begin"
        primaryHref={primaryHref}
        secondaryLabel={secondaryLabel}
        secondaryHref={secondaryHref}
      />
      <HeroBloom image={image} />
      <ProductTable products={products} />
    </section>
  );
}
