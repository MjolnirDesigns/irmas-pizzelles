import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { FadeUp, StaggerContainer, staggerItemVariants } from '@/components/ui/text-reveal';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product } from '@shared/schema';

import aniseImage from '@assets/generated_images/anise_pizzelle_product_shot.png';
import vanillaImage from '@assets/generated_images/vanilla_pizzelle_product_shot.png';
import chocolateImage from '@assets/generated_images/chocolate_pizzelle_product_shot.png';

const imageMap: Record<string, string> = {
  'anise': aniseImage,
  'vanilla': vanillaImage,
  'chocolate': chocolateImage,
};

function getProductImage(product: Product): string {
  if (product.flavor && imageMap[product.flavor]) {
    return imageMap[product.flavor];
  }
  return vanillaImage;
}

export default function ProductsSection() {
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-6 md:px-8">
        <FadeUp>
          <h2 
            className="font-serif text-3xl md:text-4xl font-bold text-center mb-4"
            data-testid="text-products-title"
          >
            Our Pizzelles
          </h2>
          <p className="font-body-serif text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Each batch is handcrafted with care using Irma's traditional family recipes. 
            Fresh, authentic, and delivered with love.
          </p>
        </FadeUp>
        
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Unable to load products. Please try again later.</p>
          </div>
        )}

        {products && products.length > 0 && (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map((product) => (
              <motion.div key={product.id} variants={staggerItemVariants}>
                <ProductCard 
                  id={product.id}
                  name={product.name}
                  flavor={product.flavor || ''}
                  description={product.shortDescription || product.description}
                  price={parseFloat(product.price)}
                  compareAtPrice={product.compareAtPrice ? parseFloat(product.compareAtPrice) : undefined}
                  image={getProductImage(product)}
                  size={product.size || undefined}
                />
              </motion.div>
            ))}
          </StaggerContainer>
        )}
      </div>
    </section>
  );
}
