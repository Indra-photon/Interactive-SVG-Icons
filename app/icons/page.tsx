import { IconRegistry } from '@/types/icon';
import { IconCard } from '@/components/icon-gallery/IconCard';

async function getIcons() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/icons`, {
    cache: 'no-store'
  });
  
  if (!res.ok) {
    return { icons: [], total: 0 };
  }
  
  return res.json();
}

export default async function IconsGallery() {
  const data = await getIcons();
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Icon Library</h1>
          <p className="text-lg text-gray-600">
            {data.total} interactive icons available
          </p>
        </div>
        
        {/* Icon Grid */}
        {data.total === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">No icons yet. Run build:registry after adding icons.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.icons.map((icon: any) => (
              <IconCard key={icon.slug} icon={icon} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}