import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// todo: remove mock functionality - replace with FAQ from database/CMS
const faqs = [
  {
    id: 'faq-1',
    question: 'How long do pizzelles stay fresh?',
    answer: 'Our pizzelles stay fresh for up to 3 weeks when stored in an airtight container at room temperature. For longer storage, they can be frozen for up to 3 months.',
  },
  {
    id: 'faq-2',
    question: 'What is the maximum order size?',
    answer: 'Each order is limited to 5 dozen pizzelles to ensure freshness and quality. If you need a larger quantity for an event, please contact us directly.',
  },
  {
    id: 'faq-3',
    question: 'Do you ship nationwide?',
    answer: 'Yes! We ship to all 50 states. Orders are carefully packaged to ensure your pizzelles arrive in perfect condition.',
  },
  {
    id: 'faq-4',
    question: 'Are your pizzelles made with real ingredients?',
    answer: 'Absolutely. We use only the finest ingredients including real vanilla beans, authentic anise seeds, farm-fresh eggs, and pure butter. No artificial flavors or preservatives.',
  },
  {
    id: 'faq-5',
    question: 'Can I request custom flavors or gift packaging?',
    answer: 'We offer gift packaging for special occasions. For custom flavor requests or large event orders, please reach out to us through our contact form.',
  },
];

export default function FAQSection() {
  return (
    <section className="py-20 md:py-32 bg-card">
      <div className="container mx-auto px-6 md:px-8">
        <h2 
          className="font-serif text-3xl md:text-4xl font-bold text-center mb-4"
          data-testid="text-faq-title"
        >
          Frequently Asked Questions
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Have questions? We've got answers. If you don't see what you're looking for, feel free to contact us.
        </p>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} data-testid={`accordion-${faq.id}`}>
                <AccordionTrigger className="text-left font-medium" data-testid={`button-${faq.id}`}>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground" data-testid={`content-${faq.id}`}>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
