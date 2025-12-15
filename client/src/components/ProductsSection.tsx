import ProductCard from './ProductCard';
import aniseImage from '@assets/generated_images/anise_pizzelle_product_shot.png';
import vanillaImage from '@assets/generated_images/vanilla_pizzelle_product_shot.png';
import chocolateImage from '@assets/generated_images/chocolate_pizzelle_product_shot.png';

// todo: remove mock functionality - fetch products from API
const products = [
  {
    id: 'anise',
    name: 'Classic Anise',
    flavor: 'Anise',
    description: 'Traditional Italian flavor with aromatic anise seeds. A holiday favorite.',
    price: 20,
    image: aniseImage,
  },
  {
    id: 'vanilla',
    name: 'Pure Vanilla',
    flavor: 'Vanilla',
    description: 'Made with real Madagascar vanilla beans for a rich, sweet flavor.',
    price: 20,
    image: vanillaImage,
  },
  {
    id: 'chocolate',
    name: 'Chocolate Drizzle',
    flavor: 'Chocolate',
    description: 'Classic vanilla pizzelles finished with premium dark chocolate.',
    price: 24,
    image: chocolateImage,
  },
];

export default function ProductsSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-6 md:px-8">
        <h2 
          className="font-serif text-3xl md:text-4xl font-bold text-center mb-4"
          data-testid="text-products-title"
        >
          Our Pizzelles
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Each dozen is handcrafted with care using traditional recipes. Order up to 5 dozen per order.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}
