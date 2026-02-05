"use client"

import { motion, AnimatePresence } from "motion/react"
import Link from "next/link"
import { useRef, useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { navlinks } from "@/constants/navlinks"
import { useUserStore } from "@/lib/store"
import { useClerk } from "@clerk/nextjs"
import { LogOut, User as UserIcon } from "lucide-react"

interface NavItem {
  label: string
  href: string
}

interface NavbarProps {
  position?: "sticky" | "fixed" | "relative"
  items?: NavItem[]
}

export function NavBar({
  position = "sticky",
  items = [
    ...navlinks.map(link => ({ label: link.label, href: link.url }))
  ],
}: NavbarProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const { signOut } = useClerk()

  const positionClasses = {
    sticky: "sticky top-0",
    fixed: "fixed top-0 left-0 right-0",
    relative: "relative",
  }

  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
      setIsUserMenuOpen(false)
    }
  }
  
  if (isUserMenuOpen) {
    document.addEventListener("mousedown", handleClickOutside)
  }
  
  return () => {
    document.removeEventListener("mousedown", handleClickOutside)
  }
}, [isUserMenuOpen])

  // user store data
  const user = useUserStore((state) => state.user);
  

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`${positionClasses[position]} bg-neutral-200 shadow-4xl z-50 w-full backdrop-blur-5xl border-b border-border/40`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link href="/" className="text-xl font-bold text-foreground">
                Logo
              </Link>
            </motion.div>

            <ul className="hidden md:flex items-center gap-8">
              {items.map((item, index) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                  className="relative"
                >
                  <Link
                    href={item.href}
                    className="text-foreground/70 hover:text-foreground transition-colors duration-200 text-sm font-medium"
                  >
                    {item.label}
                  </Link>

                  {/* Animated underline */}
                  {hoveredIndex === index && (
                    <motion.div
                      layoutId="navbar-underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="hidden md:block"
            >

              {user !== null ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="inline-block ml-4 text-neutral-800 hover:text-neutral-950 font-medium transition-colors"
                  >
                    {user?.name}
                  </button>

                  {/* Dropdown Modal */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-50"
                      >
                        <Link
                          href="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
                        >
                          <UserIcon size={16} />
                          Profile
                        </Link>
                        
                        <div className="border-t border-neutral-200 my-1" />
                        
                        <button
                          onClick={() => {
                            signOut()
                            setIsUserMenuOpen(false)
                          }}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link href={"/sign-in"}>
                  <button className="bg-neutral-700 hover:bg-neutral-900 text-neutral-100 rounded-full border border-neutral-800 font-medium text-lg sm:text-base px-8 py-1 cursor-pointer">
                    Sign In
                  </button>
                </Link>
              )}

            </motion.div>

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-foreground"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-background border-l border-border z-50 md:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Sidebar header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <span className="text-xl font-bold text-foreground">Menu</span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-foreground"
                    aria-label="Close menu"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Nav items */}
                <nav className="flex-1 overflow-y-auto p-6">
                  <ul className="flex flex-col gap-2">
                    {items.map((item, index) => (
                      <motion.li
                        key={item.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.1 * index,
                        }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block px-4 py-3 text-foreground/70 hover:text-foreground hover:bg-muted rounded-lg transition-all duration-200 text-base font-medium"
                        >
                          {item.label}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </nav>

                {/* CTA button at bottom */}
                <div className="p-6 border-t border-border">
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg text-base font-medium"
                  >
                    Get Started
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
