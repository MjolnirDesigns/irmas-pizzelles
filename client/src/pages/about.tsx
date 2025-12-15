import AboutSection from '@/components/AboutSection';
import aboutImage from '@assets/generated_images/traditional_pizzelle_making.png';

export default function About() {
  return (
    <main>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-8">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4" data-testid="text-about-page-title">
              Our Story
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A tradition of Italian baking, passed down through generations.
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
              />
            </div>
            
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-semibold mb-3">The Beginning</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Irma's journey began in the small village of Scanno, nestled in the mountains of Abruzzo, Italy. 
                  There, her grandmother taught her the art of making pizzelles using a cast iron press that had 
                  been in the family for generations.
                </p>
              </div>
              
              <div>
                <h2 className="font-serif text-2xl font-semibold mb-3">Bringing Tradition to America</h2>
                <p className="text-muted-foreground leading-relaxed">
                  When Irma immigrated to America in the 1970s, she brought with her the precious recipes 
                  and techniques she had learned. What started as treats for family gatherings soon became 
                  sought after by friends, neighbors, and eventually, customers from across the country.
                </p>
              </div>
              
              <div>
                <h2 className="font-serif text-2xl font-semibold mb-3">Today's Promise</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We continue Irma's legacy by using the same traditional methods and high-quality ingredients. 
                  Every pizzelle is made with love, care, and respect for the art form that has been passed 
                  down through our family.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
