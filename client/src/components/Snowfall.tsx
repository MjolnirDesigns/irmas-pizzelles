import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Snowflake {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
}

export default function Snowfall() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    const flakes: Snowflake[] = [];
    const count = 50;

    for (let i = 0; i < count; i++) {
      flakes.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 8 + Math.random() * 12,
        size: 2 + Math.random() * 4,
        opacity: 0.3 + Math.random() * 0.5,
      });
    }
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {snowflakes.map((flake) => (
        <motion.div
          key={flake.id}
          className="absolute rounded-full bg-white dark:bg-blue-100"
          style={{
            left: `${flake.x}%`,
            width: flake.size,
            height: flake.size,
            opacity: flake.opacity,
          }}
          initial={{ y: -20 }}
          animate={{
            y: '110vh',
            x: [0, 20, -20, 10, -10, 0],
          }}
          transition={{
            y: {
              duration: flake.duration,
              repeat: Infinity,
              delay: flake.delay,
              ease: 'linear',
            },
            x: {
              duration: flake.duration / 2,
              repeat: Infinity,
              delay: flake.delay,
              ease: 'easeInOut',
            },
          }}
        />
      ))}
    </div>
  );
}
