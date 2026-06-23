"use client";

import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  Sun01Icon,
  Moon02Icon,
  Settings01Icon,
  Archive02Icon,
} from "@hugeicons/core-free-icons";
import { navlinks } from "@/constants/navlinks";
import { usePathname } from "next/navigation";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-8 h-8" />;

  const isDark = theme === "dark";

  return (
    <motion.button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex items-center justify-center w-8 h-8 rounded-md text-white/40 hover:text-white/70 transition-colors"
      aria-label="Toggle theme"
      whileTap={{ scale: 0.96 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="sun"
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            <HugeiconsIcon icon={Sun01Icon} size={16} strokeWidth={1.5} />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            <HugeiconsIcon icon={Moon02Icon} size={16} strokeWidth={1.5} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export function NavBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();

  const activeItem = navlinks.find((l) => l.url === pathname) ?? navlinks[0];

  useEffect(() => {
    setIsExpanded(false);
  }, [pathname]);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-black w-full overflow-visible">
        {/* h-10 = the visible black strip height. Pill and card hang below via top-full */}
        <div className="relative h-6 w-full">
          {/* Collapsed pill — always in DOM, exact same pattern as BottomFilterBar */}
          <motion.div
            layoutId="nav-pill"
            layout
            onClick={() => setIsExpanded(true)}
            transition={{ type: "spring", duration: 0.25, bounce: 0.2 }}
            style={{
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              borderBottomLeftRadius: 18,
              borderBottomRightRadius: 18,
              width: isExpanded ? "min(300px, calc(100vw - 48px))" : "180px",
              pointerEvents: isExpanded ? "none" : "auto",
            }}
            className="corner-squircle absolute top-[-2px] right-0 left-0 z-20 mx-auto flex h-12 cursor-pointer items-center justify-center gap-2 bg-black px-4 shadow-2xl select-none"
          >
            <AnimatePresence mode="wait" initial={false}>
              {!isExpanded && (
                <motion.div
                  initial={{ opacity: 0, y: 2, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: 2, filter: "blur(6px)" }}
                  transition={{ type: "spring", duration: 0.15, bounce: 0.1 }}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    layoutId="nav-active-icon"
                    className="flex-shrink-0"
                  >
                    <HugeiconsIcon
                      icon={Archive02Icon}
                      size={18}
                      color="white"
                      strokeWidth={2}
                    />
                  </motion.div>
                  <motion.span
                    layoutId="nav-active-label"
                    className="text-sm font-regular tracking-tighter text-white antialiased"
                  >
                    Explore Craft UI
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Expanded card */}
          <AnimatePresence mode="popLayout">
            {isExpanded && (
              <motion.div
                layoutId="nav-pill"
                key="expanded"
                transition={{ type: "spring", duration: 0.35, bounce: 0.3 }}
                style={{
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                  borderBottomLeftRadius: 20,
                  borderBottomRightRadius: 20,
                }}
                className="absolute top-[-2px] right-0 left-0 mx-auto z-20 w-[min(300px,calc(100vw-48px))] overflow-hidden bg-[#0e0e0e]"
              >
                {/* Single fade wrapper around everything — exact same as BottomFilterBar */}
                <motion.div
                  initial={{ opacity: 0, filter: "blur(6px)" }}
                  animate={{
                    opacity: 1,
                    filter: "blur(0px)",
                    transition: {
                      duration: 0.24,
                      ease: "easeOut",
                      delay: 0.08,
                    },
                  }}
                  exit={{
                    opacity: 0,
                    filter: "blur(6px)",
                    transition: { duration: 0.06, ease: "easeOut" },
                  }}
                >
                  {/* Header row — layoutId elements match pill, same as reference */}
                  <div
                    className="flex h-12 cursor-pointer items-center gap-2 px-4"
                    onClick={() => setIsExpanded(false)}
                  >
                    <motion.div layoutId="" className="flex-shrink-0">
                      <HugeiconsIcon
                        icon={Archive02Icon}
                        size={18}
                        color="white"
                        strokeWidth={2}
                      />
                    </motion.div>
                    <motion.span
                      layoutId=""
                      className="text-sm font-sans font-regular tracking-tighter text-white antialiased"
                    >
                      Explore Craft UI
                    </motion.span>

                    <div className="flex-1" />

                    {/* <motion.div
                      initial={{ opacity: 0, rotate: 90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                      layoutId="nav-chevron"
                      className="flex-shrink-0"
                    >
                      <X size={14} color="rgba(255,255,255,0.4)" />
                    </motion.div> */}
                  </div>

                  {/* Divider */}
                  <div className="mx-4 h-px bg-white/[0.07]" />

                  {/* Nav list */}
                  <motion.div className="flex flex-col px-2.5 pt-2 pb-2">
                    {navlinks.map((item) => {
                      const isActive = item.url === pathname;
                      return (
                        <motion.div
                          key={item.label}
                          whileTap={{ scale: 0.97 }}
                          className="group relative flex cursor-pointer items-center gap-1 hover:bg-neutral-800 rounded-[13px] px-3 py-2.5 text-left select-none"
                        >
                          <Link
                            href={item.url}
                            onClick={() => setIsExpanded(false)}
                            className="relative flex w-full items-center gap-3"
                          >
                            <span
                              className="relative flex-shrink-0 transition-colors"
                              style={{
                                color: isActive
                                  ? "rgba(255,255,255,1)"
                                  : "rgba(255,255,255,0.25)",
                              }}
                            >
                              <HugeiconsIcon
                                icon={item.icon}
                                size={20}
                                color="currentColor"
                                strokeWidth={1.5}
                              />
                            </span>
                            <span className="relative antialiased transition-colors font-sans text-sm font-regular tracking-tighter text-white antialiased">
                              {item.label}
                            </span>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Backdrop */}
      {/* <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={() => setIsExpanded(false)}
            className="absolute inset-0 z-10"
            style={{
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              background: "rgba(0,0,0,0.25)",
            }}
          />
        )}
      </AnimatePresence> */}
    </>
  );
}

// "use client";

// import { motion, AnimatePresence } from "motion/react";
// import Link from "next/link";
// import { useState, useEffect } from "react";
// import { useTheme } from "next-themes";
// import { HugeiconsIcon } from "@hugeicons/react";
// import {
//   Sun01Icon,
//   Moon02Icon,
//   Settings01Icon,
//   Archive02Icon,
// } from "@hugeicons/core-free-icons";
// import { navlinks } from "@/constants/navlinks";
// import { usePathname } from "next/navigation";

// function ThemeToggle() {
//   const { theme, setTheme } = useTheme();
//   const [mounted, setMounted] = useState(false);
//   useEffect(() => setMounted(true), []);
//   if (!mounted) return <div className="w-8 h-8" />;
//   const isDark = theme === "dark";
//   return (
//     <motion.button
//       onClick={() => setTheme(isDark ? "light" : "dark")}
//       className="relative flex items-center justify-center w-8 h-8 rounded-md text-white/40 hover:text-white/70 transition-colors"
//       aria-label="Toggle theme"
//       whileTap={{ scale: 0.96 }}
//     >
//       <AnimatePresence mode="wait" initial={false}>
//         {isDark ? (
//           <motion.span
//             key="sun"
//             initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
//             animate={{ opacity: 1, rotate: 0, scale: 1 }}
//             exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
//             transition={{ duration: 0.2 }}
//           >
//             <HugeiconsIcon icon={Sun01Icon} size={16} strokeWidth={1.5} />
//           </motion.span>
//         ) : (
//           <motion.span
//             key="moon"
//             initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
//             animate={{ opacity: 1, rotate: 0, scale: 1 }}
//             exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
//             transition={{ duration: 0.2 }}
//           >
//             <HugeiconsIcon icon={Moon02Icon} size={16} strokeWidth={1.5} />
//           </motion.span>
//         )}
//       </AnimatePresence>
//     </motion.button>
//   );
// }

// export function NavBar() {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const pathname = usePathname();
//   const activeItem = navlinks.find((l) => l.url === pathname) ?? navlinks[0];

//   useEffect(() => {
//     setIsExpanded(false);
//   }, [pathname]);

//   return (
//     <nav className="sticky top-0 z-50 bg-black w-full overflow-visible">
//       <div className="relative h-6 w-full">

//         {/* Collapsed pill — always in DOM */}
//         <motion.div
//           layoutId="nav-pill"
//           layout
//           onClick={() => setIsExpanded(true)}
//           transition={{ type: "spring", duration: 0.35, bounce: 0.3 }}
//           style={{
//             borderTopLeftRadius: 0,
//             borderTopRightRadius: 0,
//             borderBottomLeftRadius: 18,
//             borderBottomRightRadius: 18,
//             width: isExpanded ? "min(300px, calc(100vw - 48px))" : "180px",
//             pointerEvents: isExpanded ? "none" : "auto",
//             boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
//           }}
//           className="absolute top-[-2px] right-0 left-0 z-20 mx-auto flex h-12 cursor-pointer items-center justify-center gap-2 bg-black px-4 select-none"
//         >
//           <motion.div layoutId="nav-active-icon" className="flex-shrink-0">
//             <HugeiconsIcon icon={Archive02Icon} size={18} color="white" strokeWidth={2} />
//           </motion.div>
//           <motion.span
//             layoutId="nav-active-label"
//             className="text-sm tracking-tighter text-white antialiased"
//           >
//             Explore Craft UI
//           </motion.span>
//         </motion.div>

//         {/* Expanded card */}
//         <AnimatePresence mode="popLayout">
//           {isExpanded && (
//             <motion.div
//               layoutId="nav-pill"
//               key="expanded"
//               transition={{ type: "spring", duration: 0.35, bounce: 0.3 }}
//               style={{
//                 borderTopLeftRadius: 0,
//                 borderTopRightRadius: 0,
//                 borderBottomLeftRadius: 20,
//                 borderBottomRightRadius: 20,
//                 boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 24px 48px rgba(0,0,0,0.6)",
//               }}
//               className="absolute top-[-2px] right-0 left-0 mx-auto z-20 w-[min(300px,calc(100vw-48px))] overflow-hidden bg-[#0e0e0e]"
//             >
//               {/* Single fade wrapper — same pattern as BottomFilterBar */}
//               <motion.div
//                 initial={{ opacity: 0, filter: "blur(6px)" }}
//                 animate={{
//                   opacity: 1,
//                   filter: "blur(0px)",
//                   transition: { duration: 0.24, ease: "easeOut", delay: 0.08 },
//                 }}
//                 exit={{
//                   opacity: 0,
//                   filter: "blur(6px)",
//                   transition: { duration: 0.06, ease: "easeOut" },
//                 }}
//               >
//                 {/* Header row */}
//                 <div
//                   className="flex h-12 cursor-pointer items-center gap-2 px-4"
//                   onClick={() => setIsExpanded(false)}
//                 >
//                   <motion.div layoutId="nav-active-icon" className="flex-shrink-0">
//                     <HugeiconsIcon icon={Archive02Icon} size={18} color="white" strokeWidth={2} />
//                   </motion.div>
//                   <motion.span
//                     layoutId="nav-active-label"
//                     className="text-sm tracking-tighter text-white antialiased"
//                   >
//                     Explore Craft UI
//                   </motion.span>
//                   <div className="flex-1" />
//                 </div>

//                 {/* Divider */}
//                 <div className="mx-4 h-px bg-white/[0.07]" />

//                 {/* Nav list */}
//                 <motion.div
//                   initial="hidden"
//                   animate="show"
//                   variants={{
//                     hidden: {},
//                     show: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } },
//                   }}
//                   className="flex flex-col px-2.5 pt-2 pb-2"
//                 >
//                   {navlinks.map((item) => {
//                     const isActive = item.url === pathname;
//                     return (
//                       <motion.div
//                         key={item.label}
//                         variants={{
//                           hidden: { opacity: 0, y: 8, filter: "blur(4px)" },
//                           show: {
//                             opacity: 1,
//                             y: 0,
//                             filter: "blur(0px)",
//                             transition: { type: "spring", duration: 0.38, bounce: 0 },
//                           },
//                         }}
//                         whileTap={{ scale: 0.97 }}
//                         className="relative flex cursor-pointer items-center rounded-[13px] px-3 py-2.5 text-left select-none hover:bg-neutral-800"
//                       >
//                         <Link
//                           href={item.url}
//                           onClick={() => setIsExpanded(false)}
//                           className="flex w-full items-center gap-3"
//                         >
//                           <span
//                             style={{
//                               color: isActive ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.25)",
//                             }}
//                           >
//                             <HugeiconsIcon
//                               icon={item.icon}
//                               size={20}
//                               color="currentColor"
//                               strokeWidth={isActive ? 2 : 1.5}
//                             />
//                           </span>
//                           <span
//                             className="text-sm tracking-tighter antialiased"
//                             style={{
//                               fontWeight: isActive ? 700 : 500,
//                               color: isActive ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.25)",
//                             }}
//                           >
//                             {item.label}
//                           </span>
//                         </Link>
//                       </motion.div>
//                     );
//                   })}
//                 </motion.div>

//                 {/* Divider */}
//                 <div className="mx-4 h-px bg-white/[0.07]" />

//                 {/* Footer */}
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ duration: 0.25, delay: 0.32 }}
//                   className="flex items-center gap-2.5 px-4 py-3"
//                 >
//                   <div
//                     className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full"
//                     style={{
//                       background: "linear-gradient(135deg, #3a3a3a 0%, #1c1c1c 100%)",
//                       boxShadow: "0 0 0 1px rgba(255,255,255,0.08)",
//                     }}
//                   >
//                     <span className="text-[9px] font-bold tracking-wide text-white/70 antialiased">
//                       IM
//                     </span>
//                   </div>
//                   <span className="flex-1 text-sm tracking-tighter text-white/40 antialiased">
//                     Indranil Maiti
//                   </span>
//                   <ThemeToggle />
//                   <HugeiconsIcon
//                     icon={Settings01Icon}
//                     size={16}
//                     color="rgba(255,255,255,0.25)"
//                     strokeWidth={1.5}
//                   />
//                 </motion.div>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//       </div>
//     </nav>
//   );
// }
