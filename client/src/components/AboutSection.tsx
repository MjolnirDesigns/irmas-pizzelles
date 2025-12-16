import { motion } from 'framer-motion';
import { FadeUp, StaggerContainer, staggerItemVariants } from '@/components/ui/text-reveal';
import aboutImage from '@assets/generated_images/traditional_pizzelle_making.png';

export default function AboutSection() {
  return (
    <section className="py-20 md:py-32 bg-card">
      <div className="container mx-auto px-6 md:px-8">
        <FadeUp className="text-center mb-12">
          <h2 
            className="font-serif text-3xl md:text-4xl font-bold tracking-wide mb-2"
            data-testid="text-about-title"
          >
            About Irma's
          </h2>
          <p className="font-body-serif text-xl md:text-2xl text-muted-foreground italic" data-testid="text-about-subtitle">
            Premium Italian Dessert Cookies
          </p>
        </FadeUp>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <StaggerContainer className="order-2 lg:order-1 space-y-6">
            <motion.div variants={staggerItemVariants} data-testid="text-about-origins">
              <h3 className="font-serif text-xl font-semibold tracking-wide mb-2">Origins</h3>
              <p className="font-body-serif text-base md:text-lg text-muted-foreground leading-relaxed">
                Our story begins in the sun-drenched hills of Calabria, Italy, where Irma first learned the 
                ancient art of pizzelle-making at her grandmother's side. In those humble kitchens, the 
                intoxicating aroma of anise and vanilla filled the air as generation after generation 
                perfected the family recipe. These delicate Italian dessert cookies quickly became 
                treasured favorites among the many grandchildren, and word of their exceptional taste 
                spread throughout the region.
              </p>
            </motion.div>
            
            <motion.div variants={staggerItemVariants} data-testid="text-about-tradition">
              <h3 className="font-serif text-xl font-semibold tracking-wide mb-2">Tradition</h3>
              <p className="font-body-serif text-base md:text-lg text-muted-foreground leading-relaxed">
                In the early 1920s, amidst the upheaval of the First World War, Irma and her family 
                made the courageous journey across the Atlantic to America. Though they left their 
                homeland behind, they carried with them something precious: the time-honored recipe 
                and cherished traditions that would bring the warmth of Calabria to their new home 
                and share that joy with countless others.
              </p>
            </motion.div>
            
            <motion.div variants={staggerItemVariants} data-testid="text-about-promise">
              <h3 className="font-serif text-xl font-semibold tracking-wide mb-2">Our Promise</h3>
              <p className="font-body-serif text-base md:text-lg text-muted-foreground leading-relaxed">
                Today, Irma's legacy lives on at the heart of our family business. We remain devoted 
                to crafting each pizzelle with the same care and passion she brought to her kitchen 
                over a century ago. Using only the finest ingredients and honoring the techniques 
                passed down through generations, we pour love into every batch we create. From our 
                famiglia to yours, we invite you to taste a piece of our heritage.
              </p>
            </motion.div>
          </StaggerContainer>
          
          <FadeUp className="order-1 lg:order-2" delay={0.2}>
            <img
              src={aboutImage}
              alt="Traditional pizzelle making with cast iron press"
              className="rounded-lg shadow-lg w-full"
              data-testid="img-about"
            />
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
