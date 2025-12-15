import Header from '../layout/Header';
import { CartProvider } from '@/lib/cart-context';
import { ThemeProvider } from '@/lib/theme-context';

export default function HeaderExample() {
  return (
    <ThemeProvider>
      <CartProvider>
        <Header />
      </CartProvider>
    </ThemeProvider>
  );
}
