export interface Icon {
  slug: string;
  name: string;
  category: string;
  tags: string[];
  description: string;
  createdAt: string;
  variations: Variation[];
}

export interface InspirationLink {
  label: string;
  url: string;
  type: 'twitter' | 'pinterest' | 'dribbble' | 'website';
}

export interface Variation {
  name: string;
  displayName: string;
  tier: 'free' | 'premium';
  description: string;
  animationType: 'hover' | 'click' | 'loop';
  dependencies: string[];
  props?: PropDefinition[];
  designNote?: string;
  inspiration?: InspirationLink[];
}

export interface PropDefinition {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'enum' | 'function' | string;
  default: any;
  options?: any[];
  min?: number;
  max?: number;
  step?: number;
  description?: string;
}

export interface IconRegistry {
  icons: Icon[];
  version: string;
  lastUpdated: string;
}

export interface RegistryFile {
  name: string;
  type: string;
  tier: 'free' | 'premium';
  dependencies: string[];
  registryDependencies?: string[];
  files: RegistryFileEntry[];
  meta: {
    displayName: string;
    description: string;
    category: string;
    tags: string[];
    animationType: string;
  };
}

export interface RegistryFileEntry {
  path: string;
  content: string;
  type: string;
  target: string;
}