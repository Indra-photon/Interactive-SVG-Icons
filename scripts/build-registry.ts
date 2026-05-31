import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';
import type { Icon, IconRegistry, RegistryFile } from '@/types/icon';
import type { Loader, LoaderRegistry, LoaderRegistryFile } from '@/types/loader';

interface BuildConfig {
  iconsDir: string;
  outputDir: string;
  baseUrl: string;
}

async function buildRegistry(config: BuildConfig) {
  console.log('🔨 Building icon registry...\n');
  
  const icons: Icon[] = [];
  
  // Find all config.json files
  const configFiles = await glob('components/icons/*/config.json');
  
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
    
    // Build variation registry files
    for (const variation of configData.variations) {
      const variationSlug = `${iconSlug}-${variation.name}`;
      const componentPath = `components/icons/${iconSlug}/${variation.name}.tsx`;
      
      try {
        const componentCode = await fs.readFile(componentPath, 'utf-8');
        
        const registryEntry: RegistryFile = {
          name: variationSlug,
          type: "registry:ui",
          tier: variation.tier,
          dependencies: variation.dependencies || ["framer-motion"],
          files: [
            {
              path: componentPath,
              content: componentCode,
              type: "registry:ui",
              target: ""
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
        
        // Ensure output directory exists
        await fs.mkdir(config.outputDir, { recursive: true });
        
        // Write individual registry file
        await fs.writeFile(
          path.join(config.outputDir, `${variationSlug}.json`),
          JSON.stringify(registryEntry, null, 2)
        );
        
        // Add to master registry
        icon.variations.push({
          name: variation.name,
          displayName: variation.displayName,
          tier: variation.tier,
          description: variation.description,
          animationType: variation.animationType,
          dependencies: variation.dependencies || ["framer-motion"],
          props: variation.props || []
        });
        
        console.log(`    ✓ ${variation.displayName} (${variation.tier})`);
        
      } catch (error) {
        console.error(`    ✗ Failed to process ${variation.name}:`, error);
      }
    }
    
    icons.push(icon);
    console.log('');
  }
  
  // Write master registry
  const masterRegistry: IconRegistry = {
    icons,
    version: "1.0.0",
    lastUpdated: new Date().toISOString()
  };

  await fs.mkdir(config.outputDir, { recursive: true });
  
  await fs.writeFile(
    path.join(config.outputDir, 'icons.json'),
    JSON.stringify(masterRegistry, null, 2)
  );
  
  console.log(`✅ Registry built successfully!`);
  console.log(`   Icons: ${icons.length}`);
  console.log(`   Variations: ${icons.reduce((sum, icon) => sum + icon.variations.length, 0)}`);
  console.log(`   Output: ${config.outputDir}\n`);
}

// Run
const config: BuildConfig = {
  iconsDir: 'components/icons',
  outputDir: 'public/r',
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
};

async function buildLoadersRegistry(config: BuildConfig) {
  console.log('🔄 Building loaders registry...\n');
  
  const loaders: Loader[] = [];
  const configFiles = await glob('components/loaders/*/config.json');
  
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
      const componentPath = `components/loaders/${loaderSlug}/${variation.name}.tsx`;
      
      try {
        const componentCode = await fs.readFile(componentPath, 'utf-8');
        
        const registryEntry: LoaderRegistryFile = {
          name: variationSlug,
          type: "registry:ui",
          tier: variation.tier,
          dependencies: variation.dependencies || ["framer-motion"],
          files: [{
            path: componentPath,
            content: componentCode,
            type: "registry:ui",
            target: ""
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
        
        loader.variations.push({
          name: variation.name,
          displayName: variation.displayName,
          componentName: variation.componentName || '',
          tier: variation.tier,
          description: variation.description,
          animationType: variation.animationType,
          dependencies: variation.dependencies || ["framer-motion"],
          props: variation.props || []
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
      version: "1.0.0", 
      lastUpdated: new Date().toISOString() 
    }, null, 2)
  );
  
  console.log(`✅ Loaders registry built successfully!`);
  console.log(`   Loaders: ${loaders.length}`);
  console.log(`   Variations: ${loaders.reduce((sum, loader) => sum + loader.variations.length, 0)}\n`);
}

Promise.all([
  buildRegistry(config),
  buildLoadersRegistry(config)
]).catch(console.error);