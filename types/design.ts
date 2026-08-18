import type {
  CatalogInspirationLink,
  CatalogItem,
  CatalogPropDefinition,
  CatalogRegistryFile,
  CatalogVariation,
} from './catalog';

export interface DesignRegistry {
  designs: Design[];
  version: string;
  lastUpdated: string;
}

// Designs are static artwork — one installable .tsx with no animation. They
// share the illustrations gallery and differ only in that: a design holds still.
// Kept as its own catalog rather than a tag on illustrations so the two browse
// separately, which is how someone shopping for a still asset actually looks.
export type Design = CatalogItem;
export type DesignInspirationLink = CatalogInspirationLink;
export type DesignVariation = CatalogVariation;
export type DesignPropDefinition = CatalogPropDefinition;
export type DesignRegistryFile = CatalogRegistryFile;
