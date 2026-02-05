import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleTagManager } from '@next/third-parties/google'
import { Toaster } from "@/components/ui/sonner"
import { NavBar } from "@/components/NavBar";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { UserSync } from "@/components/UserSync";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.indrabuildswebsites.com/"),
  title: "Indranil Maiti | Full Stack & GenAI Developer",
  description: "I am a Full Stack Developer and Gen AI specialist with expertise in React, Next.js, Node.js, and AI integration for scalable web applications. I build modern, responsive, and fast websites that drive results. I focus on microinteractions, animations , and user-centric design to create engaging digital experiences. I integrate AI technologies, Google Search Console, Google Analytics, Google Tag Manager, and SEO best practices to enhance website performance and user engagement.",
  keywords: [
    "GenAI developer",
    "Full stack web developer",
    "Google Analytics",
    "Google Tag Manager",
    "Google Search Console",
    "SEO specialist",
    "React developer",
    "Next.js developer",
    "Node.js developer",
    "AI integration",
    "Scalable web applications",
    "Modern web technologies",
    "Freelance developer",
    "Responsive web design",
    "Web development services",
    "Digital experiences",
    "User-centric design",
    "Microinteractions",
    "Web animations"
  ],
  openGraph: {
    title: "Indranil Maiti | Full Stack & GenAI Developer",
    description: "I am a Full Stack Developer and Gen AI specialist with expertise in React, Next.js, Node.js, and AI integration for scalable web applications. I build modern, responsive, and fast websites that drive results. I focus on microinteractions, animations , and user-centric design to create engaging digital experiences.",
    images: [
      {
        url: "/images/profileOG.jpeg",
        width: 1200,
        height: 630,
        alt: "Indranil Maiti - Full Stack Developer and GenAI Specialist"
      }
    ],
    type: "website",
    locale: "en_US"
  },
  twitter: {
    card: "summary_large_image",
    title: "Indranil Maiti | Full Stack & GenAI Developer",
    description: "Building scalable web applications and AI-driven solutions with modern technologies.",
    images: ["/images/profileOG.jpeg"],
    creator: "@Nil_phy_dreamer"
  },
  robots: {
    index: true,
    follow: true
  },
  authors: [
    {
      name: "Indranil Maiti",
      url: "https://github.com/Indra-photon"
    }
  ],
  verification: {
    google: "nRI3uI23PmnAb9gJVCWJI0_OKTObahkZIlcSwnhmqJo"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NavBar />
        <UserSync />
        {children}
        <GoogleTagManager gtmId="Your GTM ID" />
        <Toaster position="top-right" />
      </body>
    </html>
    </ClerkProvider>
  );
}
