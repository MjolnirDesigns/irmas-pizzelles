import { useState } from 'react';
import { X, Snowflake, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function ChristmasTreeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2L6 10h2.5L5 16h3l-2 6h12l-2-6h3l-3.5-6H18L12 2z" />
    </svg>
  );
}

export default function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-r from-red-800 via-red-700 to-green-800 text-white relative overflow-hidden"
        data-testid="promo-banner"
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgMGw0IDhINTBsLTYgOGg4bC04IDEwaDZsLTEwIDEyaDhsLTIwIDIyTDggMzhoOEwzIDE4aDZMMCAzMGg2bC02LThsMTItOGgtNGw0LTh6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9zdmc+')]" />
        </div>
        
        <div className="container mx-auto px-4 py-3 flex items-center justify-center gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChristmasTreeIcon className="w-4 h-4 text-green-300" />
          </motion.div>
          
          <Snowflake className="w-4 h-4 text-blue-200 animate-pulse hidden sm:block" />
          
          <p className="text-sm md:text-base font-medium text-center">
            <span className="font-bold">Holiday Special:</span>{' '}
            <span className="font-body-serif italic">25% off your first order!</span>{' '}
            <span className="hidden sm:inline">Perfect for gift giving.</span>{' '}
            <span className="font-bold bg-white/20 px-2 py-0.5 rounded-md ml-1">
              Code: FIRST25
            </span>
          </p>
          
          <Snowflake className="w-4 h-4 text-blue-200 animate-pulse hidden sm:block" />
          
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Gift className="w-4 h-4 text-yellow-300" />
          </motion.div>
          
          <button
            onClick={() => setIsVisible(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close promotional banner"
            data-testid="button-close-banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
