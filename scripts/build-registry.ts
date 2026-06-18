import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';
import type { Icon, IconRegistry, RegistryFile } from '@/types/icon';
import type { Loader, LoaderRegistry, LoaderRegistryFile } from '@/types/loader';
import type { Block, BlockRegistry, BlockRegistryFile } from '@/types/block';

interface BuildConfig {
  iconsDir: string;
  outputDir: string;
  baseUrl: string;
}

interface GithubRegistryItem {
  name: string;
  type: string;
  title: string;
  description: string;
  dependencies: string[];
  registryDependencies: string[];
  files: Array<{ path: string; type: string; target: string }>;
}

async function buildRegistry(config: BuildConfig): Promise<GithubRegistryItem[]> {
  console.log('🔨 Building icon registry...\n');

  const icons: Icon[] = [];
  const githubItems: GithubRegistryItem[] = [];
  const configFiles = await glob('components/craftui/icons/*/config.json');

  console.log(`📁 Found ${configFiles.length} icon(s)\n`);

  for (const configPath of configFiles) {
    const configData = JSON.parse(await fs.readFile(configPath, 'utf-8'));
    const iconSlug = path.dirname(configPath).split('/').pop()!;

    console.log(`  ⚙️  Processing: ${configData.name}`);

    const icon: Icon = {
      slug: iconSlug,
      name: configData.name,
      category: configData.category,
      tags: configData.tags,
      description: configData.description,
      createdAt: configData.createdAt,
      variations: []
    };

    for (const variation of configData.variations) {
      const variationSlug = `${iconSlug}-${variation.name}`;
      const componentPath = `components/craftui/icons/${iconSlug}/${variation.name}.tsx`;

      try {
        const componentCode = await fs.readFile(componentPath, 'utf-8');
        const deps = variation.dependencies || ['motion'];

        const registryEntry: RegistryFile = {
          name: variationSlug,
          type: 'registry:ui',
          tier: variation.tier,
          dependencies: deps,
          registryDependencies: [`${config.baseUrl}/r/craftui-base.json`],
          files: [
            {
              path: componentPath,
              content: componentCode,
              type: 'registry:ui',
              target: `~/components/craftui/icons/${iconSlug}/${variation.name}.tsx`
            }
          ],
          meta: {
            displayName: `${configData.name} - ${variation.displayName}`,
            description: variation.description,
            category: configData.category,
            tags: configData.tags,
            animationType: variation.animationType
          }
        };

        await fs.mkdir(config.outputDir, { recursive: true });
        await fs.writeFile(
          path.join(config.outputDir, `${variationSlug}.json`),
          JSON.stringify(registryEntry, null, 2)
        );

        githubItems.push({
          name: variationSlug,
          type: 'registry:ui',
          title: `${configData.name} - ${variation.displayName}`,
          description: variation.description,
          dependencies: deps,
          registryDependencies: ['craftui-base'],
          files: [
            {
              path: componentPath,
              type: 'registry:ui',
              target: `~/components/craftui/icons/${iconSlug}/${variation.name}.tsx`
            }
          ]
        });

        icon.variations.push({
          name: variation.name,
          displayName: variation.displayName,
          tier: variation.tier,
          description: variation.description,
          animationType: variation.animationType,
          dependencies: deps,
          props: variation.props || [],
          ...(variation.designNote && { designNote: variation.designNote }),
          ...(variation.inspiration?.length && { inspiration: variation.inspiration }),
        });

        console.log(`    ✓ ${variation.displayName} (${variation.tier})`);
      } catch (error) {
        console.error(`    ✗ Failed to process ${variation.name}:`, error);
      }
    }

    icons.push(icon);
    console.log('');
  }

  const masterRegistry: IconRegistry = {
    icons,
    version: '1.0.0',
    lastUpdated: new Date().toISOString()
  };

  await fs.mkdir(config.outputDir, { recursive: true });
  await fs.writeFile(
    path.join(config.outputDir, 'icons.json'),
    JSON.stringify(masterRegistry, null, 2)
  );

  console.log(`✅ Icon registry built successfully!`);
  console.log(`   Icons: ${icons.length}`);
  console.log(`   Variations: ${icons.reduce((sum, icon) => sum + icon.variations.length, 0)}`);
  console.log(`   Output: ${config.outputDir}\n`);

  return githubItems;
}

async function buildLoadersRegistry(config: BuildConfig): Promise<GithubRegistryItem[]> {
  console.log('🔄 Building loaders registry...\n');

  const loaders: Loader[] = [];
  const githubItems: GithubRegistryItem[] = [];
  const configFiles = await glob('components/craftui/loaders/*/config.json');

  console.log(`📁 Found ${configFiles.length} loader(s)\n`);

  for (const configPath of configFiles) {
    const configData = JSON.parse(await fs.readFile(configPath, 'utf-8'));
    const loaderSlug = path.dirname(configPath).split('/').pop()!;

    console.log(`  ⚙️  Processing: ${configData.name}`);

    const loader: Loader = {
      slug: loaderSlug,
      name: configData.name,
      category: configData.category,
      tags: configData.tags,
      description: configData.description,
      createdAt: configData.createdAt,
      variations: []
    };

    for (const variation of configData.variations) {
      const variationSlug = `${loaderSlug}-${variation.name}`;
      const componentPath = `components/craftui/loaders/${loaderSlug}/${variation.name}.tsx`;

      try {
        const componentCode = await fs.readFile(componentPath, 'utf-8');
        const deps = variation.dependencies || ['framer-motion'];

        const registryEntry: LoaderRegistryFile = {
          name: variationSlug,
          type: 'registry:ui',
          tier: variation.tier,
          dependencies: deps,
          registryDependencies: [`${config.baseUrl}/r/craftui-base.json`],
          files: [{
            path: componentPath,
            content: componentCode,
            type: 'registry:ui',
            target: `~/components/craftui/loaders/${loaderSlug}/${variation.name}.tsx`
          }],
          meta: {
            displayName: `${configData.name} - ${variation.displayName}`,
            description: variation.description,
            category: configData.category,
            tags: configData.tags,
            animationType: variation.animationType
          }
        };

        await fs.mkdir(config.outputDir, { recursive: true });
        await fs.writeFile(
          path.join(config.outputDir, `${variationSlug}.json`),
          JSON.stringify(registryEntry, null, 2)
        );

        githubItems.push({
          name: variationSlug,
          type: 'registry:ui',
          title: `${configData.name} - ${variation.displayName}`,
          description: variation.description,
          dependencies: deps,
          registryDependencies: ['craftui-base'],
          files: [
            {
              path: componentPath,
              type: 'registry:ui',
              target: `~/components/craftui/loaders/${loaderSlug}/${variation.name}.tsx`
            }
          ]
        });

        loader.variations.push({
          name: variation.name,
          displayName: variation.displayName,
          componentName: variation.componentName || '',
          tier: variation.tier,
          description: variation.description,
          animationType: variation.animationType,
          dependencies: deps,
          props: variation.props || [],
          ...(variation.designNote && { designNote: variation.designNote }),
          ...(variation.inspiration?.length && { inspiration: variation.inspiration }),
        });

        console.log(`    ✓ ${variation.displayName} (${variation.tier})`);
      } catch (error) {
        console.error(`    ✗ Failed to process ${variation.name}:`, error);
      }
    }

    loaders.push(loader);
    console.log('');
  }

  await fs.writeFile(
    path.join(config.outputDir, 'loaders.json'),
    JSON.stringify({
      loaders,
      version: '1.0.0',
      lastUpdated: new Date().toISOString()
    }, null, 2)
  );

  console.log(`✅ Loaders registry built successfully!`);
  console.log(`   Loaders: ${loaders.length}`);
  console.log(`   Variations: ${loaders.reduce((sum, loader) => sum + loader.variations.length, 0)}\n`);

  return githubItems;
}

async function buildBlocksRegistry(config: BuildConfig): Promise<GithubRegistryItem[]> {
  console.log('🧱 Building blocks registry...\n');

  const blocks: Block[] = [];
  const githubItems: GithubRegistryItem[] = [];
  const configFiles = await glob('components/craftui/blocks/*/config.json');

  console.log(`📁 Found ${configFiles.length} block(s)\n`);

  for (const configPath of configFiles) {
    const configData = JSON.parse(await fs.readFile(configPath, 'utf-8'));
    const blockSlug = path.dirname(configPath).split('/').pop()!;

    console.log(`  ⚙️  Processing: ${configData.name}`);

    const block: Block = {
      slug: blockSlug,
      name: configData.name,
      category: configData.category,
      tags: configData.tags,
      description: configData.description,
      createdAt: configData.createdAt,
      variations: []
    };

    for (const variation of configData.variations) {
      const variationSlug = `${blockSlug}-${variation.name}`;
      const componentPath = `components/craftui/blocks/${blockSlug}/${variation.name}.tsx`;

      try {
        const componentCode = await fs.readFile(componentPath, 'utf-8');
        const deps = variation.dependencies || ['framer-motion'];
        const registryDeps = variation.registryDependencies || [];

        const registryEntry: BlockRegistryFile = {
          name: variationSlug,
          type: 'registry:block',
          tier: variation.tier,
          dependencies: deps,
          registryDependencies: [
            `${config.baseUrl}/r/craftui-base.json`,
            ...registryDeps.map((d: string) => d.startsWith('http') ? d : d)
          ],
          files: [
            {
              path: componentPath,
              content: componentCode,
              type: 'registry:component',
              target: `~/components/craftui/blocks/${blockSlug}/${variation.name}.tsx`
            }
          ],
          meta: {
            displayName: `${configData.name} - ${variation.displayName}`,
            description: variation.description,
            category: configData.category,
            tags: configData.tags,
            animationType: variation.animationType
          }
        };

        await fs.mkdir(config.outputDir, { recursive: true });
        await fs.writeFile(
          path.join(config.outputDir, `${variationSlug}.json`),
          JSON.stringify(registryEntry, null, 2)
        );

        githubItems.push({
          name: variationSlug,
          type: 'registry:block',
          title: `${configData.name} - ${variation.displayName}`,
          description: variation.description,
          dependencies: deps,
          registryDependencies: ['craftui-base', ...registryDeps],
          files: [
            {
              path: componentPath,
              type: 'registry:component',
              target: `~/components/craftui/blocks/${blockSlug}/${variation.name}.tsx`
            }
          ]
        });

        block.variations.push({
          name: variation.name,
          displayName: variation.displayName,
          tier: variation.tier,
          description: variation.description,
          animationType: variation.animationType,
          dependencies: deps,
          registryDependencies: registryDeps,
          props: variation.props || []
        });

        console.log(`    ✓ ${variation.displayName} (${variation.tier})`);
      } catch (error) {
        console.error(`    ✗ Failed to process ${variation.name}:`, error);
      }
    }

    blocks.push(block);
    console.log('');
  }

  const masterRegistry: BlockRegistry = {
    blocks,
    version: '1.0.0',
    lastUpdated: new Date().toISOString()
  };

  await fs.mkdir(config.outputDir, { recursive: true });
  await fs.writeFile(
    path.join(config.outputDir, 'blocks.json'),
    JSON.stringify(masterRegistry, null, 2)
  );

  console.log(`✅ Blocks registry built successfully!`);
  console.log(`   Blocks: ${blocks.length}`);
  console.log(`   Variations: ${blocks.reduce((sum, b) => sum + b.variations.length, 0)}`);
  console.log(`   Output: ${config.outputDir}\n`);

  return githubItems;
}

async function buildGithubRegistry(allItems: GithubRegistryItem[]) {
  const craftUIBase = {
    name: 'craftui-base',
    type: 'registry:lib',
    title: 'CraftUI Base',
    description: 'Core dependencies for CraftUI — framer-motion and motion.',
    dependencies: ['framer-motion', 'motion'],
    files: []
  };

  const registry = {
    $schema: 'https://ui.shadcn.com/schema/registry.json',
    name: 'craftui',
    homepage: 'https://github.com/Indra-photon/Interactive-SVG-Icons',
    items: [craftUIBase, ...allItems]
  };

  await fs.writeFile('registry.json', JSON.stringify(registry, null, 2));
  console.log(`✅ registry.json generated (${allItems.length + 1} items)\n`);
}

const config: BuildConfig = {
  iconsDir: 'components/craftui/icons',
  outputDir: 'public/r',
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
};

Promise.all([
  buildRegistry(config),
  buildLoadersRegistry(config),
  buildBlocksRegistry(config)
]).then(([iconItems, loaderItems, blockItems]) => {
  return buildGithubRegistry([...iconItems, ...loaderItems, ...blockItems]);
}).catch(console.error);
