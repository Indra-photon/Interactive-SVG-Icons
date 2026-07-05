'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { IconExternalLink } from '@tabler/icons-react';

interface LoaderCardProps {
  loader: {
    slug: string;
    name: string;
    description: string;
    variations: any[];
  };
  isMatched?: boolean;
}

const cardVariants = {
  initial: {},
  hover: {}
};

const PANEL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const sliderVariants = {
  initial: {
    y: '100%',
    opacity: 0,
    filter: 'blur(2px)',
    transition: { duration: 0.35, ease: PANEL_EASE },
  },
  hover: {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.4, ease: PANEL_EASE },
  },
};

const reducedSliderVariants = {
  initial: { y: '100%', opacity: 0, filter: 'blur(0px)', transition: { duration: 0 } },
  hover: { y: 0, opacity: 1, filter: 'blur(0px)', transition: { duration: 0 } },
};

export function LoaderCard({ loader, isMatched = true }: LoaderCardProps) {
  const shouldReduceMotion = useReducedMotion();
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
      whileHover={isMatched ? "hover" : undefined}
      className="w-full h-28"
    >
      <Link
        href={`/loaders?slug=${loader.slug}`}
        tabIndex={isMatched ? undefined : -1}
        aria-hidden={!isMatched}
        className={`border rounded-lg hover:shadow-lg transition-[box-shadow,transform,scale] active:scale-[0.96] group w-full h-full flex items-center justify-center bg-white relative overflow-hidden block ${
          isMatched ? "" : "pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-center">
          {LoaderComponent ? (
            <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
              <LoaderComponent />
            </div>
          ) : (
            <div className="text-2xl">⏳</div>
          )}
        </div>

        {/* Gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity dark:bg-neutral-900"
        />

        {/* Slider from bottom */}
        <motion.div
          variants={shouldReduceMotion ? reducedSliderVariants : sliderVariants}
          className="absolute bottom-0 left-0 right-0 bg-black/80 text-white py-1.5 px-2 text-center text-[11px] font-medium backdrop-blur-sm"
        >
          See in action
          <IconExternalLink className="inline-block ml-1 mb-0.5" size={12} />
        </motion.div>

        {/* Non-match mask */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 rounded-lg bg-white/50 dark:bg-black/40 backdrop-blur-[6px] transition-opacity duration-200 ease-out motion-reduce:transition-none ${
            isMatched ? "opacity-0" : "opacity-100"
          }`}
        />
      </Link>
    </motion.div>
  );
}