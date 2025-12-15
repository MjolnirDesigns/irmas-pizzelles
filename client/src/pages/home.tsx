import HeroSection from '@/components/HeroSection';
import ProductsSection from '@/components/ProductsSection';
import AboutSection from '@/components/AboutSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import FAQSection from '@/components/FAQSection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ProductsSection />
      <AboutSection />
      <TestimonialsSection />
      <FAQSection />
    </main>
  );
}
