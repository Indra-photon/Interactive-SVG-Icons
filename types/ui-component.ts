import type { PropDefinition, InspirationLink } from './loader';

export interface UIComponentRegistry {
  components: UIComponent[];
  version: string;
  lastUpdated: string;
}

export interface UIComponent {
  slug: string;
  name: string;
  category: string;
  shadcnBase?: string;
  tags: string[];
  description: string;
  createdAt: string;
  variations: UIComponentVariation[];
}

export interface UIComponentVariation {
  name: string;
  displayName: string;
  componentName: string;
  tier: 'free' | 'premium';
  description: string;
  animationType: string;
  dependencies: string[];
  registryDependencies: string[];
  props: PropDefinition[];
  features?: string[];
  inspiration?: InspirationLink[];
  previewHint?: string;
}

export interface UIComponentRegistryFile {
  name: string;
  type: string;
  tier: 'free' | 'premium';
  dependencies: string[];
  registryDependencies: string[];
  files: {
    path: string;
    content: string;
    type: string;
    target: string;
  }[];
  meta: {
    displayName: string;
    description: string;
    category: string;
    tags: string[];
    animationType: string;
  };
}
