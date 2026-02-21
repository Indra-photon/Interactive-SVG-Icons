import { Container } from '@/components/Container';
import { LoaderCard } from '@/components/loader-gallery/LoaderCard';

async function getLoaders() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/loaders`, {
    cache: 'no-store'
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch loaders');
  }
  
  return res.json();
}

export default async function LoadersPage() {
  const { loaders } = await getLoaders();

  return (
    <Container className="container mx-auto px-4 py-12">
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        {loaders.map((loader: any) => (
          <LoaderCard key={loader.slug} loader={loader} />
        ))}
      </div>
    </Container>
  );
}