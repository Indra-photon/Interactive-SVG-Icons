export interface BlockRegistry {
  blocks: Block[];
  version: string;
  lastUpdated: string;
}

export interface Block {
  slug: string;
  name: string;
  category: string;
  tags: string[];
  description: string;
  createdAt: string;
  variations: BlockVariation[];
  /** Set false to hide from the gallery/sidebar without deleting the block. */
  published?: boolean;
}

export interface BlockInspirationLink {
  label: string;
  url: string;
  type: 'twitter' | 'pinterest' | 'dribbble' | 'website';
}

export interface BlockVariation {
  name: string;
  displayName: string;
  tier: 'free' | 'premium';
  description: string;
  animationType: string;
  dependencies: string[];
  registryDependencies: string[];
  props: BlockPropDefinition[];
  features?: string[];
  inspiration?: BlockInspirationLink[];
  componentName?: string;
  previewHint?: string;
  /**
   * When true, the preview renders the block directly at the container's real
   * width (so its own `sm:`/`md:` breakpoints reflow it) instead of the fixed
   * 1280px scale-to-fit canvas. Set once a block has been made responsive.
   */
  responsive?: boolean;
}

export interface BlockPropDefinition {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

export interface BlockRegistryFile {
  name: string;
  type: string;
  tier: 'free' | 'premium';
  dependencies: string[];
  registryDependencies: string[];
  cssVars?: {
    theme?: Record<string, string>;
    light?: Record<string, string>;
    dark?: Record<string, string>;
  };
  css?: string;
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
