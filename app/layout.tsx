import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { DialRoot } from "dialkit";
import "dialkit/styles.css";
import { GoogleTagManager } from "@next/third-parties/google";
import { Toaster } from "@/components/ui/sonner";
import { NavBar } from "@/components/NavBar";
import { ThemeProvider } from "next-themes";
import { cn } from "@/lib/utils";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";

const geistHeading = Geist({ subsets: ["latin"], variable: "--font-heading" });

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

// import {
//   ClerkProvider,
//   SignInButton,
//   SignUpButton,
//   SignedIn,
//   SignedOut,
//   UserButton,
// } from '@clerk/nextjs'
// import { UserSync } from "@/components/UserSync";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// JSON-LD Structured Data for the Organization and Website
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.craftui.space/#organization",
      name: "CraftUI",
      url: "https://www.craftui.space",
      logo: "https://www.craftui.space/logo.png",
      // TODO: Add your logo file at: /public/logo.png (preferably SVG or PNG, 1200x630px for og:image)
      sameAs: [],
      description:
        "A modern, accessible UI component library with interactive SVG icons, loaders, and UI blocks for building beautiful web applications.",
    },
    {
      "@type": "WebSite",
      "@id": "https://www.craftui.space/#website",
      url: "https://www.craftui.space",
      name: "CraftUI - Interactive SVG Icons & UI Components Library",
      description:
        "Explore interactive SVG icons, loaders, and UI components for modern web design. Free, customizable, and built with React and Tailwind CSS.",
      publisher: {
        "@id": "https://www.craftui.space/#organization",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate:
            "https://www.craftui.space/search?q={search_term_string}",
        },
        query_input: "required name=search_term_string",
      },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.craftui.space"),
  title: "CraftUI - Interactive SVG Icons & UI Components Library",
  description:
    "CraftUI is a modern, accessible UI component library featuring interactive SVG icons, animated loaders, and reusable UI blocks. Build beautiful, responsive web applications with customizable components. Explore icons, loaders, and blocks designed for developers.",
  keywords: [
    "UI components",
    "Component library",
    "SVG icons",
    "Icon library",
    "Loaders",
    "Loading animations",
    "UI blocks",
    "React components",
    "Next.js components",
    "Tailwind CSS",
    "Web design",
    "Design system",
    "Interactive components",
    "Animated loaders",
    "Customizable icons",
    "Frontend development",
    "Web development",
    "Design resources",
    "Component showcase",
    "Modern UI",
  ],
  openGraph: {
    title: "CraftUI - Interactive SVG Icons & UI Components Library",
    description:
      "Discover interactive SVG icons, animated loaders, and reusable UI components for your next project. Customizable, accessible, and built for modern web development.",
    url: "https://www.craftui.space",
    siteName: "CraftUI",
    images: [
      {
        url: "https://www.craftui.space/og-image.png",
        // TODO: Add your OG image at: /public/og-image.png (1200x630px recommended)
        width: 1200,
        height: 630,
        alt: "CraftUI - Interactive SVG Icons & UI Components Library",
        type: "image/png",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CraftUI - Interactive SVG Icons & UI Components Library",
    description:
      "Explore interactive SVG icons, animated loaders, and customizable UI components for modern web applications.",
    images: ["https://www.craftui.space/og-image.png"],
    // TODO: Add Twitter creator handle if you have one
    // creator: "@yourTwitterHandle",
    site: "@craftui",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.craftui.space",
  },
  applicationName: "CraftUI",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CraftUI",
  },
  formatDetection: {
    telephone: false,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <ClerkProvider>
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", inter.variable, geistHeading.variable)}
    >
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Favicon - TODO: Add your favicon at /public/favicon.ico */}
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} antialiased`}
      >
        {/* <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        > */}
        <MotionProvider>
          <NavBar />
          {/* <UserSync /> */}
          {children}
          <GoogleTagManager gtmId="Your GTM ID" />
          <Toaster position="top-right" />
          <DialRoot
            productionEnabled
            position="bottom-right"
            theme="light"
            defaultOpen={false}
          />
        </MotionProvider>
        <Analytics />
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="12be97c1-8b62-4f75-9793-a78ef4aa27e4"
        />
        {/* </ThemeProvider> */}
      </body>
    </html>
    // </ClerkProvider>
  );
}
