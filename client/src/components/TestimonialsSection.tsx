import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

// todo: remove mock functionality - replace with real testimonials from database
const testimonials = [
  {
    id: '1',
    name: 'Maria C.',
    location: 'Boston, MA',
    content: 'These pizzelles remind me of my Nonna\'s kitchen. The anise flavor is perfect - not too strong, just like back home.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Thomas R.',
    location: 'Chicago, IL',
    content: 'Ordered for our Italian Christmas Eve dinner and they were a huge hit! Will definitely be ordering again.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Sarah M.',
    location: 'Philadelphia, PA',
    content: 'The vanilla pizzelles are incredible. Crispy, delicate, and absolutely delicious. Best I\'ve ever had!',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-6 md:px-8">
        <h2 
          className="font-serif text-3xl md:text-4xl font-bold text-center mb-4"
          data-testid="text-testimonials-title"
        >
          What Our Customers Say
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Join hundreds of happy customers who have made Irma's Pizzelles a part of their traditions.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-6" data-testid={`card-testimonial-${testimonial.id}`}>
              <CardContent className="p-0">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed" data-testid={`text-testimonial-content-${testimonial.id}`}>
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium" data-testid={`text-testimonial-name-${testimonial.id}`}>{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
