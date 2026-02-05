// 'use client';

// import Link from 'next/link';
// import dynamic from 'next/dynamic';
// import {motion, AnimatePresence} from 'motion/react';

// interface IconCardProps {
//   icon: {
//     slug: string;
//     name: string;
//     variations: any[];
//   };
// }

// export function IconCard({ icon }: IconCardProps) {
//   const IconComponent = dynamic(
//     () => import(`@/components/icons/${icon.slug}/default.tsx`)
//       .then(mod => {
//         const exportedComponent = mod[Object.keys(mod)[0]];
//         return { default: exportedComponent };
//       })
//       .catch(() => {
//         return { 
//           default: ({ size }: { size?: number }) => (
//             <div className="text-6xl">📦</div>
//           ) 
//         };
//       }),
//     { ssr: false }
//   );
  
//   return (
//     <Link
//       href={`/icons/${icon.slug}`}
//       className="border rounded-lg transition-shadow group w-40 h-48 flex items-center justify-center bg-white relative overflow-hidden"
//     >
//       <div className=" flex items-center justify-center mb-4">
//         <IconComponent size={64} />
//       </div>



//     </Link>
//   );
// }


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
  hover: { y: 0 }
};

export function IconCard({ icon }: IconCardProps) {
  const IconComponent = dynamic(
    () => import(`@/components/icons/${icon.slug}/default.tsx`)
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
      className="w-40 h-48"
    >
      <Link
        href={`/icons/${icon.slug}`}
        className="border rounded-lg hover:shadow-lg transition-shadow group w-full h-full flex items-center justify-center bg-white relative overflow-hidden block"
      >
        <div className="flex items-center justify-center mb-4">
          <IconComponent size={64} />
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