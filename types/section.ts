import type {
  CatalogInspirationLink,
  CatalogItem,
  CatalogPropDefinition,
  CatalogRegistryFile,
  CatalogVariation,
} from './catalog';

export interface SectionRegistry {
  sections: Section[];
  version: string;
  lastUpdated: string;
}

// Sections are page-width layout compositions (footer, feature, pricing) as
// opposed to the component-scale blocks. Same metadata, same build convention,
// same gallery — the difference is that sections always preview at their real
// width so their own breakpoints do the reflowing.
export type Section = CatalogItem;
export type SectionInspirationLink = CatalogInspirationLink;
export type SectionVariation = CatalogVariation;
export type SectionPropDefinition = CatalogPropDefinition;
export type SectionRegistryFile = CatalogRegistryFile;
