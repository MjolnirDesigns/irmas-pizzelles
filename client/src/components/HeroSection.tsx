import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import heroImage from '@assets/generated_images/hero_pizzelle_cookies_display.png';

export default function HeroSection() {
  return (
    <section className="relative min-h-[70vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      
      <div className="relative z-10 container mx-auto px-6 md:px-8 text-center">
        <h1 
          className="font-serif text-5xl md:text-7xl text-white mb-6 leading-tight tracking-wide"
          data-testid="text-hero-title"
        >
          Irma's Pizzelles
        </h1>
        <p 
          className="font-body-serif text-xl md:text-2xl text-white/90 mb-4 italic"
          data-testid="text-hero-subtitle"
        >
          Authentic Italian Delights
        </p>
        <p 
          className="font-body-serif text-lg text-white/80 mb-10 max-w-xl mx-auto"
          data-testid="text-hero-tagline"
        >
          Handcrafted with love, delivered fresh to your door
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/shop">
            <Button 
              size="lg" 
              className="px-8 py-6 text-lg rounded-full bg-primary/90 backdrop-blur-sm"
              data-testid="button-shop-now"
            >
              Shop Now
            </Button>
          </Link>
          <Link href="/waitlist">
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-6 text-lg rounded-full bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
              data-testid="button-join-waitlist"
            >
              Join Waitlist
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
