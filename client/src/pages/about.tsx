import AboutSection from '@/components/AboutSection';
import aboutImage from '@assets/generated_images/traditional_pizzelle_making.png';

export default function About() {
  return (
    <main>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-8">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-wide mb-4" data-testid="text-about-page-title">
              About Irma's
            </h1>
            <p className="font-body-serif text-xl md:text-2xl text-muted-foreground italic max-w-2xl mx-auto">
              Premium Italian Dessert Cookies
            </p>
          </div>
        </div>
      </section>
      
      <section className="pb-20">
        <div className="container mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src={aboutImage}
                alt="Traditional pizzelle making"
                className="rounded-lg shadow-lg w-full"
                data-testid="img-about-page"
              />
            </div>
            
            <div className="space-y-6">
              <div data-testid="text-about-page-origins">
                <h2 className="font-serif text-2xl font-semibold tracking-wide mb-3">Origins</h2>
                <p className="font-body-serif text-base md:text-lg text-muted-foreground leading-relaxed">
                  Irma's journey began in the small town of Calabria, Italy. There, the Italian dessert 
                  cookie tradition was born. Pizzelles were a common favorite among the many grandchildren, 
                  and the family recipe became popular in the region.
                </p>
              </div>
              
              <div data-testid="text-about-page-tradition">
                <h2 className="font-serif text-2xl font-semibold tracking-wide mb-3">Tradition</h2>
                <p className="font-body-serif text-base md:text-lg text-muted-foreground leading-relaxed">
                  Irma migrated with her family to America in the early 1920's during the first World War. 
                  The family recipe and tradition would continue to bring happiness to America.
                </p>
              </div>
              
              <div data-testid="text-about-page-promise">
                <h2 className="font-serif text-2xl font-semibold tracking-wide mb-3">Our Promise</h2>
                <p className="font-body-serif text-base md:text-lg text-muted-foreground leading-relaxed">
                  Irma's legacy of creating delicious Italian dessert cookies remains the core of our family 
                  business. We use the highest quality ingredients and take extreme care to deliver our product 
                  with love and satisfaction. From our famiglia to yours, enjoy Irma's Pizzelles!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
