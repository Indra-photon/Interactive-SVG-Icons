export interface LoaderRegistry {
  loaders: Loader[];
  version: string;
  lastUpdated: string;
}

export interface Loader {
  slug: string;
  name: string;
  category: string;
  tags: string[];
  description: string;
  createdAt: string;
  variations: LoaderVariation[];
}

export interface InspirationLink {
  label: string;
  url: string;
  type: 'twitter' | 'pinterest' | 'dribbble' | 'website';
}

export interface LoaderVariation {
  name: string;
  displayName: string;
  componentName: string;
  tier: 'free' | 'premium';
  description: string;
  animationType: string;
  dependencies: string[];
  props: PropDefinition[];
  designNote?: string;
  inspiration?: InspirationLink[];
}

export interface PropDefinition {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'enum' | 'select' | 'ease' | 'strokeLinecap';
  default: any;
  options?: any[];
  min?: number;
  max?: number;
  step?: number;
  description: string;
}

export interface LoaderRegistryFile {
  name: string;
  type: string;
  tier: 'free' | 'premium';
  dependencies: string[];
  registryDependencies?: string[];
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