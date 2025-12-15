import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
        className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 text-white relative overflow-hidden"
        data-testid="promo-banner"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiLz48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L2c+PC9zdmc+')] opacity-30" />
        
        <div className="container mx-auto px-4 py-3 flex items-center justify-center gap-3">
          <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
          
          <p className="text-sm md:text-base font-medium text-center">
            <span className="font-bold">2025 Special:</span>{' '}
            <span className="font-body-serif italic">25% off your first order!</span>{' '}
            <span className="hidden sm:inline">First 25 orders only.</span>{' '}
            <span className="font-bold bg-white/20 px-2 py-0.5 rounded-md ml-1">
              Code: FIRST25
            </span>
          </p>
          
          <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
          
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
