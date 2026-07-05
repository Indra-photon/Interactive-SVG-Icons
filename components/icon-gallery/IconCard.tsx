


'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import {motion} from 'motion/react';
import { IconExternalLink } from '@tabler/icons-react';
interface IconCardProps {
  icon: {
    slug: string;
    name: string;
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

export function IconCard({ icon }: IconCardProps) {
  const firstVariation = icon.variations[0]?.name ?? 'default';
  const IconComponent = dynamic(
    () => import(`@/components/craftui/icons/${icon.slug}/${firstVariation}.tsx`)
      .then(mod => {
        const exportedComponent = mod[Object.keys(mod)[0]];
        return { default: exportedComponent };
      })
      .catch(() => {
        return { 
          default: ({ size }: { size?: number }) => (
            <div className="text-6xl">📦</div>
          ) 
        };
      }),
    { ssr: false }
  );
  
  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      className="w-full h-28"
    >
      <Link
        href={`/icons?slug=${icon.slug}`}
        className="border rounded-lg hover:shadow-lg transition-shadow group w-full h-full flex items-center justify-center bg-white relative overflow-hidden block"
      >
        <div className="flex items-center justify-center">
          <IconComponent size={32} />
        </div>

        {/* Gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity dark:bg-neutral-900"
        />

        {/* Slider from bottom */}
        <motion.div
          variants={sliderVariants}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="absolute bottom-0 left-0 right-0 bg-black/80 text-white py-1.5 px-2 text-center text-[11px] font-medium backdrop-blur-sm"
        >
          See in action
          <IconExternalLink className="inline-block ml-1 mb-0.5" size={12} />
        </motion.div>
      </Link>
    </motion.div>
  );
}