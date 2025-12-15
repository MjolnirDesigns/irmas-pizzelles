import FAQSection from '@/components/FAQSection';

export default function FAQ() {
  return (
    <main>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-8">
          <div className="text-center mb-8">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4" data-testid="text-faq-page-title">
              Frequently Asked Questions
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about our pizzelles, ordering, and shipping.
            </p>
          </div>
        </div>
      </section>
      <FAQSection />
    </main>
  );
}
