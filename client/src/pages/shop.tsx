import ProductsSection from '@/components/ProductsSection';

export default function Shop() {
  return (
    <main className="py-12">
      <div className="container mx-auto px-6 md:px-8">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4" data-testid="text-shop-title">
            Shop Our Pizzelles
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our selection of handcrafted Italian pizzelles. Each batch is made fresh to order 
            using traditional family recipes.
          </p>
        </div>
      </div>
      <ProductsSection />
    </main>
  );
}
