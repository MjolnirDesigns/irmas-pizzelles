import { CartProvider } from '@/lib/cart-context';
import { Toaster } from '@/components/ui/toaster';
import ProductCard from '../ProductCard';
import aniseImage from '@assets/generated_images/anise_pizzelle_product_shot.png';

export default function ProductCardExample() {
  return (
    <CartProvider>
      <div className="max-w-sm">
        <ProductCard
          id="anise"
          name="Classic Anise"
          flavor="Anise"
          description="Traditional Italian flavor with aromatic anise seeds. A holiday favorite."
          price={20}
          image={aniseImage}
        />
      </div>
      <Toaster />
    </CartProvider>
  );
}
