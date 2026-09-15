import type { Metadata } from "next";
import Link from "next/link";

import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { Rail } from "@/components/Rail";
import { GITHUB_REPO_URL } from "@/constants/repo";

export const metadata: Metadata = {
  title: "About",
  description:
    "What CraftUI is, how to use the source, and who makes it. Blocks, sections, illustrations, UI components, designs, loaders and interactive icons for React, Tailwind and Motion.",
};

/* The maker's links. Same URLs as the hero's social row (HeroSocialLinks),
 * restated here because that module is a client boundary and this page is
 * rendered on the server. */
const MAKER = {
  website: "https://www.indrabuildswebsites.com/",
  x: "https://x.com/Nil_phy_dreamer",
};

const LINK =
  "text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/* One section: a heading and its paragraphs, on the page's own reading
 * rhythm. `display` is the site's in-page section heading step; `body` the
 * running text — the same pair every gallery panel uses. */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <Paragraph as="h2" variant="display">
        {title}
      </Paragraph>
      {children}
    </section>
  );
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl py-8">
        <Rail>
          <Heading className="sm:text-left">About CraftUI</Heading>

          <div className="mt-6 flex max-w-5xl flex-col gap-14">
            <div className="flex flex-col gap-4">
              <Paragraph variant="body" className="tracking-tighter">
                CraftUI is a library of interface pieces built with React,
                Tailwind and Motion — blocks, sections, illustrations, UI
                components, designs, loaders and interactive icons. Every item
                is designed around how it moves, not only how it looks at rest.
              </Paragraph>
              <Paragraph variant="body">
                Nothing here is a package. Each item ships as readable source
                you copy straight into your project, so the code is yours to
                read, change and delete. There is no design system to adopt and
                no dependency to keep up to date.
              </Paragraph>
            </div>

            <Section title="How to use it">
              <Paragraph variant="body">
                Open any item, read the source, and copy it into your project.
                Most items need only React, Tailwind and Motion; where one needs
                more, the item page lists it. Props are documented on the same
                page, and the design notes explain the decisions behind the
                piece so you can change them with intent.
              </Paragraph>
              <Paragraph variant="body">
                Items that support the shadcn CLI can also be added with a
                single command shown on their page. Either way the result is the
                same: a file in your repository that you own.
              </Paragraph>
            </Section>

            <Section title="What is inside">
              <Paragraph variant="body">
                Seven catalogs, each on its own page.{" "}
                <Link href="/blocks" className={LINK}>
                  Blocks
                </Link>{" "}
                are self-contained pieces of interface with the interaction
                already designed, and{" "}
                <Link href="/sections" className={LINK}>
                  sections
                </Link>{" "}
                are full-width page sections ready to stack into a landing page.{" "}
                <Link href="/illustrations" className={LINK}>
                  Illustrations
                </Link>{" "}
                are animated SVG artwork for the places a page needs a picture.{" "}
                <Link href="/ui-gallery" className={LINK}>
                  UI components
                </Link>{" "}
                are the everyday building blocks of an interface, rebuilt around
                motion, and{" "}
                <Link href="/designs" className={LINK}>
                  designs
                </Link>{" "}
                are finished compositions to study and reuse.{" "}
                <Link href="/loaders" className={LINK}>
                  Loaders
                </Link>{" "}
                are waiting states worth watching, in lightweight SVG, and{" "}
                <Link href="/icons" className={LINK}>
                  icons
                </Link>{" "}
                animate from the state you pass in, not on a timer.
              </Paragraph>
            </Section>

            <Section title="Who makes it">
              <Paragraph variant="body">
                CraftUI is made by Indranil Maiti, a front-end developer who
                builds websites and the motion inside them. The library began as
                a place to keep the interactions from client work that were
                worth reusing, and grew into the collection it is now.
              </Paragraph>
              <Paragraph variant="body">
                <a
                  href={MAKER.website}
                  className={LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Indranil&rsquo;s website
                </a>
                {" · "}
                <a
                  href={MAKER.x}
                  className={LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Follow Indranil on X
                </a>
              </Paragraph>
            </Section>

            <Section title="Source and issues">
              <Paragraph variant="body">
                The whole library is open source. Read the code, open an issue
                when something breaks, or send a pull request when you have
                fixed it. Every item page has a report link that opens an issue
                with the item already named.
              </Paragraph>
              <Paragraph variant="body">
                <a
                  href={GITHUB_REPO_URL}
                  className={LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View the CraftUI repository on GitHub
                </a>
                {" · "}
                <a
                  href={`${GITHUB_REPO_URL}/issues/new`}
                  className={LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Report an issue
                </a>
              </Paragraph>
            </Section>
          </div>
        </Rail>
      </div>
    </main>
  );
}
