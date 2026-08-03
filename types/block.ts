import type {
  CatalogInspirationLink,
  CatalogItem,
  CatalogPropDefinition,
  CatalogRegistryFile,
  CatalogVariation,
} from './catalog';

export interface BlockRegistry {
  blocks: Block[];
  version: string;
  lastUpdated: string;
}

// Aliases rather than redeclarations: blocks and sections share one shape and
// one gallery, so the shared components stay typed on a single interface. See
// types/catalog.ts.
export type Block = CatalogItem;
export type BlockInspirationLink = CatalogInspirationLink;
export type BlockVariation = CatalogVariation;
export type BlockPropDefinition = CatalogPropDefinition;
export type BlockRegistryFile = CatalogRegistryFile;
