import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/lib/cart-context';
import { useToast } from '@/hooks/use-toast';
import { ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  flavor: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  size?: string;
}

export default function ProductCard({ 
  id, 
  name, 
  flavor, 
  description, 
  price, 
  compareAtPrice,
  image,
  size 
}: ProductCardProps) {
  const [quantity, setQuantity] = useState('1');
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem({ id, name, flavor, price, image }, parseInt(quantity));
    toast({
      title: 'Added to cart',
      description: `${quantity}x ${name} added to your cart.`,
    });
  };

  const hasDiscount = compareAtPrice && compareAtPrice > price;
  const discountPercent = hasDiscount 
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) 
    : 0;

  return (
    <Card className="overflow-hidden group" data-testid={`card-product-${id}`}>
      <div className="aspect-square overflow-hidden relative">
        <motion.img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          data-testid={`img-product-${id}`}
        />
        {hasDiscount && (
          <Badge 
            className="absolute top-3 right-3 bg-amber-600 text-white"
            data-testid={`badge-discount-${id}`}
          >
            Save {discountPercent}%
          </Badge>
        )}
      </div>
      <CardContent className="p-6">
        <h3 className="font-serif text-xl font-semibold mb-1" data-testid={`text-product-name-${id}`}>
          {name}
        </h3>
        {size && (
          <p className="text-xs text-muted-foreground mb-2">{size}</p>
        )}
        <p className="font-body-serif text-muted-foreground text-sm mb-4 line-clamp-2" data-testid={`text-product-description-${id}`}>
          {description}
        </p>
        
        <div className="mb-4" data-testid={`text-product-price-${id}`}>
          <span className="text-xl font-bold">${price.toFixed(2)}</span>
          {hasDiscount && (
            <span className="text-muted-foreground line-through ml-2 text-sm">
              ${compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>
        
        <div className="flex gap-3">
          <Select value={quantity} onValueChange={setQuantity}>
            <SelectTrigger className="w-20" data-testid={`select-quantity-${id}`}>
              <SelectValue placeholder="Qty" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            className="flex-1 gap-2" 
            onClick={handleAddToCart}
            data-testid={`button-add-to-cart-${id}`}
          >
            <ShoppingBag className="w-4 h-4" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
