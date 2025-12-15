import aboutImage from '@assets/generated_images/traditional_pizzelle_making.png';

export default function AboutSection() {
  return (
    <section className="py-20 md:py-32 bg-card">
      <div className="container mx-auto px-6 md:px-8">
        <div className="text-center mb-12">
          <h2 
            className="font-serif text-3xl md:text-4xl font-bold tracking-wide mb-2"
            data-testid="text-about-title"
          >
            About Irma's
          </h2>
          <p className="font-body-serif text-xl md:text-2xl text-muted-foreground italic" data-testid="text-about-subtitle">
            Premium Italian Dessert Cookies
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="space-y-6">
              <div data-testid="text-about-origins">
                <h3 className="font-serif text-xl font-semibold tracking-wide mb-2">Origins</h3>
                <p className="font-body-serif text-base md:text-lg text-muted-foreground leading-relaxed">
                  Irma's journey began in the small town of Calabria, Italy. There, the Italian dessert 
                  cookie tradition was born. Pizzelles were a common favorite among the many grandchildren, 
                  and the family recipe became popular in the region.
                </p>
              </div>
              
              <div data-testid="text-about-tradition">
                <h3 className="font-serif text-xl font-semibold tracking-wide mb-2">Tradition</h3>
                <p className="font-body-serif text-base md:text-lg text-muted-foreground leading-relaxed">
                  Irma migrated with her family to America in the early 1920's during the first World War. 
                  The family recipe and tradition would continue to bring happiness to America.
                </p>
              </div>
              
              <div data-testid="text-about-promise">
                <h3 className="font-serif text-xl font-semibold tracking-wide mb-2">Our Promise</h3>
                <p className="font-body-serif text-base md:text-lg text-muted-foreground leading-relaxed">
                  Irma's legacy of creating delicious Italian dessert cookies remains the core of our family 
                  business. We use the highest quality ingredients and take extreme care to deliver our product 
                  with love and satisfaction. From our famiglia to yours, enjoy Irma's Pizzelles!
                </p>
              </div>
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
