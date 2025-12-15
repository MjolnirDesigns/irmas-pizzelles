import WaitlistForm from '@/components/WaitlistForm';

export default function Waitlist() {
  return (
    <main className="py-16 md:py-24">
      <div className="container mx-auto px-6 md:px-8">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4" data-testid="text-waitlist-page-title">
            Join Our Waitlist
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Be the first to know when fresh batches are available. We'll also send you exclusive offers 
            and early access to new flavors.
          </p>
        </div>
        
        <WaitlistForm />
      </div>
    </main>
  );
}
