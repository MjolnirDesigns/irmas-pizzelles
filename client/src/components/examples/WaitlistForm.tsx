import { Toaster } from '@/components/ui/toaster';
import WaitlistForm from '../WaitlistForm';

export default function WaitlistFormExample() {
  return (
    <div className="py-8">
      <WaitlistForm />
      <Toaster />
    </div>
  );
}
