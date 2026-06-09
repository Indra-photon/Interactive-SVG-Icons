'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { IconExternalLink } from '@tabler/icons-react';

interface LoaderCardProps {
  loader: {
    slug: string;
    name: string;
    description: string;
    variations: any[];
  };
}

const cardVariants = {
  initial: {},
  hover: {}
};

const sliderVariants = {
  initial: { y: '100%' },
  hover: { y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24, mass: 1 } }
};

export function LoaderCard({ loader }: LoaderCardProps) {
  const [LoaderComponent, setLoaderComponent] = useState<any>(null);
  const firstVariation = loader.variations[0];

  useEffect(() => {
    // Dynamically import the loader component
    import(`@/components/craftui/loaders/${loader.slug}/${firstVariation.name}.tsx`)
      .then((mod) => {
        const exportedComponent = mod[Object.keys(mod)[0]];
        setLoaderComponent(() => exportedComponent);
      })
      .catch((err) => {
        console.error('Failed to load component:', err);
      });
  }, [loader.slug, firstVariation.name]);

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      className="w-40 h-48"
    >
      <Link
        href={`/loaders/${loader.slug}`}
        className="border rounded-lg hover:shadow-lg transition-[box-shadow,transform,scale] active:scale-[0.96] group w-full h-full flex items-center justify-center bg-white relative overflow-hidden block"
      >
        <div className="flex items-center justify-center mb-4">
          {LoaderComponent ? (
            <div className="w-24 h-24 flex items-center justify-center overflow-hidden">
              <LoaderComponent />
            </div>
          ) : (
            <div className="text-6xl">⏳</div>
          )}
        </div>

        {/* Gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity dark:bg-neutral-900"
        />

        {/* Slider from bottom */}
        <motion.div
          variants={sliderVariants}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="absolute bottom-0 left-0 right-0 bg-black/80 text-white py-3 px-4 text-center text-sm font-medium backdrop-blur-sm"
        >
          See in action
          <IconExternalLink className="inline-block ml-1 mb-1" size={16} />
        </motion.div>
      </Link>
    </motion.div>
  );
}