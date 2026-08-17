import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';
import type { Icon, IconRegistry, RegistryFile } from '@/types/icon';
import type { Loader, LoaderRegistry, LoaderRegistryFile } from '@/types/loader';
import type { Block, BlockRegistryFile } from '@/types/block';
import type { UIComponent, UIComponentRegistry, UIComponentRegistryFile } from '@/types/ui-component';

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
  css?: Record<string, unknown>;
  cssVars?: Record<string, Record<string, string>>;
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
          ...(variation.componentName && { componentName: variation.componentName }),
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

/**
 * Config for one catalog (blocks, sections, illustrations, designs). All are
 * built by the identical folder convention, so they share this builder rather
 * than being four copies that drift apart.
 */
interface CatalogConfig {
  /** Directory under components/craftui holding the item folders. */
  dir: string;
  /** Filename written into public/r, without the extension. */
  registryName: string;
  /** Key the item array is stored under inside that file. */
  itemsKey: string;
  /** Singular noun for log output. */
  label: string;
  logIcon: string;
}

const CATALOGS: CatalogConfig[] = [
  {
    dir: 'blocks',
    registryName: 'blocks',
    itemsKey: 'blocks',
    label: 'block',
    logIcon: '🧱',
  },
  {
    dir: 'sections',
    registryName: 'sections',
    itemsKey: 'sections',
    label: 'section',
    logIcon: '📐',
  },
  {
    dir: 'illustrations',
    registryName: 'illustrations',
    itemsKey: 'illustrations',
    label: 'illustration',
    logIcon: '🎨',
  },
  {
    dir: 'designs',
    registryName: 'designs',
    itemsKey: 'designs',
    label: 'design',
    logIcon: '🖼️',
  },
];

async function buildCatalogRegistry(
  config: BuildConfig,
  catalog: CatalogConfig
): Promise<GithubRegistryItem[]> {
  console.log(`${catalog.logIcon} Building ${catalog.registryName} registry...\n`);

  const blocks: Block[] = [];
  const githubItems: GithubRegistryItem[] = [];
  const configFiles = await glob(`components/craftui/${catalog.dir}/*/config.json`);

  console.log(`📁 Found ${configFiles.length} ${catalog.label}(s)\n`);

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
      variations: [],
      ...(configData.published === false && { published: false })
    };

    for (const variation of configData.variations) {
      const variationSlug = `${blockSlug}-${variation.name}`;
      const componentPath = `components/craftui/${catalog.dir}/${blockSlug}/${variation.name}.tsx`;

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
          // Design tokens and raw CSS travel with the item so `shadcn add`
          // writes them into the consumer's stylesheet — without these the
          // component installs unstyled against tokens that don't exist.
          ...(variation.css && { css: variation.css }),
          ...(variation.cssVars && { cssVars: variation.cssVars }),
          files: [
            {
              path: componentPath,
              content: componentCode,
              type: 'registry:component',
              target: `~/components/craftui/${catalog.dir}/${blockSlug}/${variation.name}.tsx`
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
          ...(variation.css && { css: variation.css }),
          ...(variation.cssVars && { cssVars: variation.cssVars }),
          files: [
            {
              path: componentPath,
              type: 'registry:component',
              target: `~/components/craftui/${catalog.dir}/${blockSlug}/${variation.name}.tsx`
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
          props: variation.props || [],
          ...(variation.componentName && { componentName: variation.componentName }),
          ...(variation.previewHint && { previewHint: variation.previewHint }),
          ...(variation.features?.length && { features: variation.features }),
          ...(variation.inspiration?.length && { inspiration: variation.inspiration }),
          ...(variation.responsive && { responsive: variation.responsive }),
          // Artwork catalogs only — the masonry card reserves the well at this
          // ratio before the component's chunk lands, so a column of cards
          // never reflows underneath itself. Both must be present to be useful,
          // hence the single guard.
          ...(variation.width &&
            variation.height && {
              width: variation.width,
              height: variation.height,
            }),
        });

        console.log(`    ✓ ${variation.displayName} (${variation.tier})`);
      } catch (error) {
        console.error(`    ✗ Failed to process ${variation.name}:`, error);
      }
    }

    blocks.push(block);
    console.log('');
  }

  // The items key differs per catalog ('blocks' / 'sections') so each file
  // reads naturally on its own; the shape is otherwise identical.
  const masterRegistry = {
    [catalog.itemsKey]: blocks,
    version: '1.0.0',
    lastUpdated: new Date().toISOString()
  };

  await fs.mkdir(config.outputDir, { recursive: true });
  await fs.writeFile(
    path.join(config.outputDir, `${catalog.registryName}.json`),
    JSON.stringify(masterRegistry, null, 2)
  );

  const capitalized =
    catalog.registryName.charAt(0).toUpperCase() + catalog.registryName.slice(1);
  console.log(`✅ ${capitalized} registry built successfully!`);
  console.log(`   ${capitalized}: ${blocks.length}`);
  console.log(`   Variations: ${blocks.reduce((sum, b) => sum + b.variations.length, 0)}`);
  console.log(`   Output: ${config.outputDir}\n`);

  return githubItems;
}

async function buildUIComponentsRegistry(config: BuildConfig): Promise<GithubRegistryItem[]> {
  console.log('🧩 Building UI components registry...\n');

  const components: UIComponent[] = [];
  const githubItems: GithubRegistryItem[] = [];
  const configFiles = await glob('components/craftui/ui/*/config.json');

  console.log(`📁 Found ${configFiles.length} UI component(s)\n`);

  for (const configPath of configFiles) {
    const configData = JSON.parse(await fs.readFile(configPath, 'utf-8'));
    const componentSlug = path.dirname(configPath).split('/').pop()!;

    console.log(`  ⚙️  Processing: ${configData.name}`);

    const component: UIComponent = {
      slug: componentSlug,
      name: configData.name,
      category: configData.category,
      shadcnBase: configData.shadcnBase,
      tags: configData.tags,
      description: configData.description,
      createdAt: configData.createdAt,
      variations: [],
    };

    for (const variation of configData.variations) {
      const variationSlug = `${componentSlug}-${variation.name}`;
      const componentPath = `components/craftui/ui/${componentSlug}/${variation.name}.tsx`;

      try {
        const componentCode = await fs.readFile(componentPath, 'utf-8');
        const deps = variation.dependencies || ['motion/react'];
        const registryDeps = variation.registryDependencies || [];

        // Sibling files (shared engines, sub-components) shipped alongside the
        // variation file. Paths are relative to the component directory.
        const extraFiles: string[] = variation.extraFiles || [];
        const extraFileEntries = await Promise.all(
          extraFiles.map(async (rel: string) => {
            const filePath = `components/craftui/ui/${componentSlug}/${rel}`;
            return {
              path: filePath,
              content: await fs.readFile(filePath, 'utf-8'),
              type: 'registry:ui',
              target: `~/components/craftui/ui/${componentSlug}/${rel}`,
            };
          }),
        );

        const registryEntry: UIComponentRegistryFile = {
          name: variationSlug,
          type: 'registry:ui',
          tier: variation.tier,
          dependencies: deps,
          registryDependencies: [
            `${config.baseUrl}/r/craftui-base.json`,
            ...registryDeps,
          ],
          files: [
            {
              path: componentPath,
              content: componentCode,
              type: 'registry:ui',
              target: `~/components/craftui/ui/${componentSlug}/${variation.name}.tsx`,
            },
            ...extraFileEntries,
          ],
          // The shadcn CLI merges these into the consumer's globals.css on install.
          ...(variation.css && { css: variation.css }),
          ...(variation.cssVars && { cssVars: variation.cssVars }),
          meta: {
            displayName: `${configData.name} - ${variation.displayName}`,
            description: variation.description,
            category: configData.category,
            tags: configData.tags,
            animationType: variation.animationType,
          },
        };

        await fs.mkdir(config.outputDir, { recursive: true });
        await fs.writeFile(
          path.join(config.outputDir, `${variationSlug}.json`),
          JSON.stringify(registryEntry, null, 2),
        );

        githubItems.push({
          name: variationSlug,
          type: 'registry:ui',
          title: `${configData.name} - ${variation.displayName}`,
          description: variation.description,
          dependencies: deps,
          registryDependencies: ['craftui-base', ...registryDeps],
          files: [
            {
              path: componentPath,
              type: 'registry:ui',
              target: `~/components/craftui/ui/${componentSlug}/${variation.name}.tsx`,
            },
            ...extraFileEntries.map(({ path: p, type, target }) => ({
              path: p,
              type,
              target,
            })),
          ],
          ...(variation.css && { css: variation.css }),
          ...(variation.cssVars && { cssVars: variation.cssVars }),
        });

        component.variations.push({
          name: variation.name,
          displayName: variation.displayName,
          componentName: variation.componentName || '',
          tier: variation.tier,
          description: variation.description,
          animationType: variation.animationType,
          dependencies: deps,
          registryDependencies: registryDeps,
          props: variation.props || [],
          ...(variation.previewHint && { previewHint: variation.previewHint }),
          ...(variation.features?.length && { features: variation.features }),
          ...(variation.inspiration?.length && { inspiration: variation.inspiration }),
        });

        console.log(`    ✓ ${variation.displayName} (${variation.tier})`);
      } catch (error) {
        console.error(`    ✗ Failed to process ${variation.name}:`, error);
      }
    }

    components.push(component);
    console.log('');
  }

  const masterRegistry: UIComponentRegistry = {
    components,
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
  };

  await fs.mkdir(config.outputDir, { recursive: true });
  await fs.writeFile(
    path.join(config.outputDir, 'ui.json'),
    JSON.stringify(masterRegistry, null, 2),
  );

  console.log(`✅ UI components registry built successfully!`);
  console.log(`   Components: ${components.length}`);
  console.log(`   Variations: ${components.reduce((sum, c) => sum + c.variations.length, 0)}`);
  console.log(`   Output: ${config.outputDir}\n`);

  return githubItems;
}

/**
 * The shadcn registry directory requires that the aggregate registry.json carry
 * no file `content` — that belongs only in the per-item files served from
 * public/r. allItems already satisfies this, but a future refactor could quietly
 * start passing content through, and the failure mode is a rejected PR rather
 * than a broken build. Fail loudly instead.
 * https://ui.shadcn.com/docs/registry/registry-index
 */
function assertNoInlinedContent(items: GithubRegistryItem[]) {
  const offenders = items
    .filter((item) => item.files?.some((file) => 'content' in file))
    .map((item) => item.name);

  if (offenders.length > 0) {
    throw new Error(
      `registry.json must not inline file content, but ${offenders.length} ` +
        `item(s) do: ${offenders.slice(0, 5).join(', ')}` +
        `${offenders.length > 5 ? ', …' : ''}.\n` +
        `Content belongs in the per-item files under public/r only.`
    );
  }
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
    // No leading "@" — that form belongs in the directory index entry, not here.
    name: 'craftui',
    homepage: 'https://www.craftui.space',
    author: 'Indranil Maiti <indranilmaiti16@gmail.com>',
    items: [craftUIBase, ...allItems]
  };

  assertNoInlinedContent(registry.items as GithubRegistryItem[]);

  const json = JSON.stringify(registry, null, 2);

  // Repo root copy is the source of truth read by tooling and review.
  await fs.writeFile('registry.json', json);

  // The directory requires registry.json at the *registry* root — for us that
  // is /r, alongside the item files, not the site root. Every listed registry
  // serves it this way (smoothui, skiper-ui, chanhdai, shadcn-ui-blocks).
  await fs.writeFile(path.join(config.outputDir, REGISTRY_INDEX_FILE), json);

  console.log(
    `✅ registry.json generated (${allItems.length + 1} items) → ` +
      `repo root + ${config.outputDir}/${REGISTRY_INDEX_FILE}\n`
  );
}

/**
 * baseUrl is baked into every registryDependencies entry, so a localhost value
 * ships JSON that resolves against the *consumer's* machine and fails to
 * install. The fallback stays for local registry testing, but it must be loud —
 * this silently shipped once because `build:registry` ran without loading .env.
 */
function resolveBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '');
  if (fromEnv) return fromEnv;

  console.warn(
    '\n⚠️  NEXT_PUBLIC_SITE_URL is not set — falling back to http://localhost:3000.\n' +
      '   Registry files built this way are for LOCAL TESTING ONLY. Do not commit them.\n' +
      '   Run `npm run build:registry` (loads .env) before publishing.\n'
  );
  return 'http://localhost:3000';
}

const config: BuildConfig = {
  iconsDir: 'components/craftui/icons',
  outputDir: 'public/r',
  baseUrl: resolveBaseUrl()
};

/**
 * The aggregate index is written into the same flat directory as the items, so
 * an item named "registry" would overwrite it — a clash assertNoDuplicateNames
 * cannot see, because the name appears only once.
 */
const REGISTRY_INDEX_FILE = 'registry.json';

/**
 * `dependencies` are passed straight to `npm install`, where a bare name
 * containing a slash is GitHub shorthand for owner/repo — not a package. Every
 * item declaring "motion/react" (the *import path*; the package is "motion")
 * therefore failed at install with an SSH clone error against a repo that does
 * not exist. 36 items shipped this way, and nothing in the pipeline noticed:
 * the string is valid JSON, the schema has no opinion, and the item URL still
 * returns 200. Only an actual `shadcn add` surfaced it.
 *
 * Scoped packages (@scope/name) legitimately contain one slash and are allowed;
 * anything else with a slash is rejected.
 */
function assertValidDependencies(items: GithubRegistryItem[]) {
  const offenders: string[] = [];

  for (const item of items) {
    for (const dep of item.dependencies ?? []) {
      const versionless = dep.replace(/@[^@/]*$/, '');
      const isScoped = versionless.startsWith('@');
      const slashes = (versionless.match(/\//g) ?? []).length;

      if ((isScoped && slashes > 1) || (!isScoped && slashes > 0)) {
        offenders.push(`${item.name} → "${dep}"`);
      }
    }
  }

  if (offenders.length > 0) {
    throw new Error(
      `${offenders.length} item(s) declare a dependency that npm will treat as ` +
        `a git repo rather than a package:\n  ${offenders.join('\n  ')}\n` +
        `Use the package name ("motion"), not the import path ("motion/react").`
    );
  }
}

/**
 * A registryDependency pointing at our own domain must name an item this build
 * actually produced. feature-ai-01 shipped pointing at badge-default.json,
 * button-default.json, card-default.json and separator-default.json — none of
 * which exist, because those are shadcn base primitives and belong here as bare
 * names ("badge"), which resolve against the @shadcn registry.
 *
 * The install fails at *dependency resolution*, so the item itself looks
 * perfectly healthy when fetched directly.
 */
function assertRegistryDepsResolve(items: GithubRegistryItem[]) {
  // Hand-written files live in public/r without being generated items, and
  // craftui-base is the registryDependency of literally everything.
  const built = new Set([
    ...items.map((item) => item.name),
    ...[...UNMANAGED_FILES].map((file) => file.replace(/\.json$/, ''))
  ]);
  const selfRef = new RegExp(
    `^${config.baseUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/r/(.+)\\.json$`
  );

  const offenders: string[] = [];

  for (const item of items) {
    for (const dep of item.registryDependencies ?? []) {
      const match = selfRef.exec(dep);
      if (match && !built.has(match[1])) {
        offenders.push(`${item.name} → ${dep}`);
      }
    }
  }

  if (offenders.length > 0) {
    throw new Error(
      `${offenders.length} registryDependenc(ies) point at CraftUI items that ` +
        `do not exist:\n  ${offenders.join('\n  ')}\n` +
        `If the dependency is a shadcn primitive, use its bare name instead.`
    );
  }
}

function assertNoReservedNames(items: GithubRegistryItem[]) {
  const reserved = REGISTRY_INDEX_FILE.replace(/\.json$/, '');
  const offenders = items.filter((item) => item.name === reserved);

  if (offenders.length > 0) {
    throw new Error(
      `"${reserved}" is a reserved registry entry name — it would overwrite ` +
        `${config.outputDir}/${REGISTRY_INDEX_FILE}, the registry index itself.`
    );
  }
}

/**
 * Every variation is written to public/r/<slug>-<variation>.json in one flat
 * directory, so two catalogs sharing an item slug would silently overwrite each
 * other's file. Fail the build instead of shipping the wrong component.
 */
function assertNoDuplicateNames(items: GithubRegistryItem[]) {
  const seen = new Map<string, number>();
  for (const item of items) {
    seen.set(item.name, (seen.get(item.name) ?? 0) + 1);
  }

  const clashes = [...seen.entries()].filter(([, count]) => count > 1);
  if (clashes.length > 0) {
    throw new Error(
      `Duplicate registry entry name(s): ${clashes.map(([name]) => name).join(', ')}.\n` +
        `Registry files are flat in ${config.outputDir}, so slugs must be unique ` +
        `across icons, loaders, blocks, sections and UI components.`
    );
  }
}

/**
 * Written by hand rather than by this script, so pruning must never touch them.
 * craftui-base.json in particular is the registryDependency of every single
 * item — deleting it breaks all installs.
 */
const UNMANAGED_FILES = new Set(['craftui-base.json']);

/**
 * Renaming or deleting a component leaves its old JSON behind, and a stale file
 * keeps serving outdated code from a live URL forever (morphing-button-default
 * survived a rename this way). Builders only ever overwrite, so the directory
 * is cleared first and every managed file is written fresh.
 *
 * Clearing up front rather than reconciling afterwards is what makes case-only
 * renames safe: on a case-insensitive filesystem, writing trash-dissolve.json
 * while trash-Dissolve.json exists reuses the old file *and its old name*, so a
 * prune pass at the end sees a name it doesn't recognise and deletes the entry
 * that was just generated. Deleting first means the new name is created clean.
 *
 * A crashed build leaves the directory incomplete, which is loud and fixed by
 * rerunning — unlike stale files, which fail silently and only in production.
 */
async function resetOutputDir() {
  await fs.mkdir(config.outputDir, { recursive: true });

  const present = await fs.readdir(config.outputDir);
  const stale = present.filter(
    (file) => file.endsWith('.json') && !UNMANAGED_FILES.has(file)
  );

  await Promise.all(
    stale.map((file) => fs.rm(path.join(config.outputDir, file)))
  );

  console.log(`🧹 Cleared ${stale.length} generated file(s) from ${config.outputDir}\n`);
}

/**
 * The builders report success per item, but a name that never reached disk
 * would only surface as a 404 at install time.
 */
async function assertOutputComplete(items: GithubRegistryItem[]) {
  const present = new Set(await fs.readdir(config.outputDir));
  const missing = items
    .map((item) => `${item.name}.json`)
    .filter((file) => !present.has(file));

  if (missing.length > 0) {
    throw new Error(
      `${missing.length} registry item(s) were generated but not written to ` +
        `${config.outputDir}: ${missing.join(', ')}`
    );
  }
}

resetOutputDir().then(() => Promise.all([
  buildRegistry(config),
  buildLoadersRegistry(config),
  ...CATALOGS.map((catalog) => buildCatalogRegistry(config, catalog)),
  buildUIComponentsRegistry(config),
])).then(async (results) => {
  const allItems = results.flat();
  assertNoDuplicateNames(allItems);
  assertNoReservedNames(allItems);
  assertValidDependencies(allItems);
  assertRegistryDepsResolve(allItems);
  await buildGithubRegistry(allItems);
  await assertOutputComplete(allItems);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
