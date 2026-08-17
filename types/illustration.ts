import type {
  CatalogInspirationLink,
  CatalogItem,
  CatalogPropDefinition,
  CatalogRegistryFile,
  CatalogVariation,
} from './catalog';

export interface IllustrationRegistry {
  illustrations: Illustration[];
  version: string;
  lastUpdated: string;
}

// Illustrations are self-contained SVG artwork, usually animated. Same metadata
// and same build convention as blocks and sections — what differs is the
// gallery: they render in a masonry at their own aspect ratio with nothing but
// an install command underneath, because an illustration is its own preview and
// has no configurator to sit beside.
export type Illustration = CatalogItem;
export type IllustrationInspirationLink = CatalogInspirationLink;
export type IllustrationVariation = CatalogVariation;
export type IllustrationPropDefinition = CatalogPropDefinition;
export type IllustrationRegistryFile = CatalogRegistryFile;
