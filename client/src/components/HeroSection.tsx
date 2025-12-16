import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Gift, Snowflake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SplitTextReveal, FadeUp } from '@/components/ui/text-reveal';
import heroImage from '@assets/generated_images/hero_pizzelle_cookies_display.png';

export default function HeroSection() {
  return (
    <section className="relative min-h-[70vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden">
      <motion.div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      
      <div className="relative z-10 container mx-auto px-6 md:px-8 text-center">
        <FadeUp delay={0.2}>
          <Badge 
            variant="secondary" 
            className="mb-6 bg-red-700/90 text-white border-red-600 px-4 py-1.5"
          >
            <Snowflake className="w-3 h-3 mr-2" />
            Holiday Season Special
            <Gift className="w-3 h-3 ml-2" />
          </Badge>
        </FadeUp>
        
        <h1 
          className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-wide"
          data-testid="text-hero-title"
        >
          <SplitTextReveal staggerDelay={0.05}>
            Irma's Pizzelles
          </SplitTextReveal>
        </h1>
        
        <FadeUp delay={0.4}>
          <p 
            className="font-body-serif text-xl md:text-2xl text-white/90 mb-4 italic"
            data-testid="text-hero-subtitle"
          >
            Authentic Italian Delights
          </p>
        </FadeUp>
        
        <FadeUp delay={0.6}>
          <p 
            className="font-body-serif text-lg text-white/80 mb-10 max-w-xl mx-auto"
            data-testid="text-hero-tagline"
          >
            The perfect holiday gift - handcrafted with love, delivered fresh to your door
          </p>
        </FadeUp>
        
        <FadeUp delay={0.8}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <Button 
                size="lg" 
                className="group px-8 py-6 text-lg rounded-full bg-red-700/90 backdrop-blur-sm transition-all duration-300"
                data-testid="button-shop-now"
              >
                <Gift className="w-5 h-5 mr-2" />
                <span className="relative z-10">Shop Holiday Gifts</span>
              </Button>
            </Link>
            <Link href="/waitlist">
              <Button 
                variant="outline" 
                size="lg" 
                className="group px-8 py-6 text-lg rounded-full bg-white/10 backdrop-blur-sm border-white/30 text-white transition-all duration-300"
                data-testid="button-join-waitlist"
              >
                <span className="relative z-10">Join Waitlist</span>
              </Button>
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
