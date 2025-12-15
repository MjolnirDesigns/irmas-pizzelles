import aboutImage from '@assets/generated_images/traditional_pizzelle_making.png';

export default function AboutSection() {
  return (
    <section className="py-20 md:py-32 bg-card">
      <div className="container mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 
              className="font-serif text-3xl md:text-4xl font-bold mb-6"
              data-testid="text-about-title"
            >
              Our Story
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p data-testid="text-about-paragraph-1">
                For over four decades, Irma has been crafting pizzelles using her grandmother's 
                treasured recipes from the hills of Abruzzo, Italy. Each cookie is made with the 
                same love and care that has been passed down through generations.
              </p>
              <p data-testid="text-about-paragraph-2">
                Using only the finest ingredients - real vanilla beans, aromatic anise seeds, 
                and farm-fresh eggs - we ensure every pizzelle captures the authentic taste 
                of traditional Italian baking.
              </p>
              <p data-testid="text-about-paragraph-3">
                From our family kitchen to your table, we're honored to share these 
                delicate, crispy treats that have brought joy to countless celebrations, 
                holidays, and everyday moments.
              </p>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <img
              src={aboutImage}
              alt="Traditional pizzelle making with cast iron press"
              className="rounded-lg shadow-lg w-full"
              data-testid="img-about"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
