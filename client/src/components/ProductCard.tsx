import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/lib/cart-context';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  id: string;
  name: string;
  flavor: string;
  description: string;
  price: number;
  image: string;
}

export default function ProductCard({ id, name, flavor, description, price, image }: ProductCardProps) {
  const [quantity, setQuantity] = useState('1');
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem({ id, name, flavor, price, image }, parseInt(quantity));
    toast({
      title: 'Added to cart',
      description: `${quantity} dozen ${name} added to your cart.`,
    });
  };

  return (
    <Card className="overflow-hidden group" data-testid={`card-product-${id}`}>
      <div className="aspect-square overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          data-testid={`img-product-${id}`}
        />
      </div>
      <CardContent className="p-6">
        <h3 className="font-serif text-xl font-semibold mb-1" data-testid={`text-product-name-${id}`}>
          {name}
        </h3>
        <p className="text-muted-foreground text-sm mb-3" data-testid={`text-product-description-${id}`}>
          {description}
        </p>
        <p className="text-lg font-bold mb-4" data-testid={`text-product-price-${id}`}>
          ${price.toFixed(2)}/dozen
        </p>
        
        <div className="flex gap-3">
          <Select value={quantity} onValueChange={setQuantity}>
            <SelectTrigger className="w-24" data-testid={`select-quantity-${id}`}>
              <SelectValue placeholder="Qty" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} dozen
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            className="flex-1" 
            onClick={handleAddToCart}
            data-testid={`button-add-to-cart-${id}`}
          >
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
