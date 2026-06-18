import { notFound } from "next/navigation";
import { VariationCard } from "@/components/icon-gallery/VariationCard";
import { VariationCardWithButton } from "@/components/icon-gallery/VariationCardWithButton";
import fs from "fs/promises";
import path from "path";
import type { IconRegistry } from "@/types/icon";
import { Container } from "@/components/Container";

async function getIcon(slug: string) {
  try {
    const registryPath = path.join(process.cwd(), "public/r/icons.json");
    const content = await fs.readFile(registryPath, "utf-8");
    const registry: IconRegistry = JSON.parse(content);

    const icon = registry.icons.find((i) => i.slug === slug);
    return icon;
  } catch (error) {
    return null;
  }
}

export default async function IconVariationsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const icon = await getIcon(slug);

  if (!icon) {
    notFound();
  }

  return (
    <Container className=" px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl text-stone-900 font-sans mb-2">
            {icon.name}
          </h1>
          <p className="text-stone-600 font-sans mb-4 tracking-tighter">
            {icon.description}
          </p>
          <div className="flex gap-2">
            {icon.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-stone-100 rounded-full text-sm font-sans tracking-tighter text-stone-500"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Variations Grid */}
        <div>
          <div className="grid md:grid-cols-2 gap-6">
            {icon.variations.map((variation) => (
              <VariationCardWithButton
                key={variation.name}
                iconSlug={icon.slug}
                variation={variation}
              />
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
