'use client';

import { motion } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = 'جاري التحميل...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-5 py-10">
      <motion.div
        animate={{ scale: [1, 1.06, 1], rotate: [0, 3, -3, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="flex h-16 w-16 items-center justify-center rounded-3xl border border-blue-300/20 bg-blue-400/10 text-blue-200"
      >
        <BrainCircuit className="h-8 w-8" />
      </motion.div>

      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-2.5 w-2.5 rounded-full bg-blue-300"
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <p className="text-sm font-bold text-slate-300">
        {message}
      </p>

      {/* Skeleton lines */}
      <div className="w-full space-y-3 mt-2">
        {[100, 75, 90, 60].map((w, i) => (
          <motion.div
            key={i}
            className="h-3 rounded-full"
            style={{
              width: `${w}%`,
              background: 'linear-gradient(90deg, var(--bg-card) 0%, var(--bg-card-hover) 50%, var(--bg-card) 100%)',
              backgroundSize: '200% 100%',
            }}
            animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
          />
        ))}
      </div>
    </div>
  );
}
