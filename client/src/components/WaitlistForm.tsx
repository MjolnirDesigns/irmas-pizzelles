import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle } from 'lucide-react';

const waitlistSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  zip: z.string().optional(),
});

type WaitlistFormData = z.infer<typeof waitlistSchema>;

export default function WaitlistForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      zip: '',
    },
  });

  const onSubmit = async (data: WaitlistFormData) => {
    // todo: remove mock functionality - connect to real API
    console.log('Waitlist submission:', data);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitted(true);
    toast({
      title: 'Welcome to the waitlist!',
      description: 'We\'ll notify you when new products are available.',
    });
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
          <h3 className="font-serif text-2xl font-semibold mb-2" data-testid="text-waitlist-success">
            You're on the list!
          </h3>
          <p className="text-muted-foreground">
            Thank you for joining our waitlist. We'll be in touch soon with exclusive offers.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="font-serif text-2xl" data-testid="text-waitlist-title">
          Join Our Waitlist
        </CardTitle>
        <CardDescription>
          Be the first to know when we have fresh batches ready to ship.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} data-testid="input-waitlist-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="your@email.com" {...field} data-testid="input-waitlist-email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone (optional)</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="(555) 123-4567" {...field} data-testid="input-waitlist-phone" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ZIP Code (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="For shipping estimates" {...field} data-testid="input-waitlist-zip" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full" 
              disabled={form.formState.isSubmitting}
              data-testid="button-waitlist-submit"
            >
              {form.formState.isSubmitting ? 'Joining...' : 'Join Waitlist'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
