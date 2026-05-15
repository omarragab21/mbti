'use client';

import { motion, type Variants } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';

interface EnhancedLoadingStateProps {
  message?: string;
  subtitle?: string;
  showBrain?: boolean;
}

export default function EnhancedLoadingState({
  message = 'جاري التحليل...',
  subtitle = 'يرجى الانتظار قليلاً',
  showBrain = true,
}: EnhancedLoadingStateProps) {
  const dotVariants: Variants = {
    animate: {
      opacity: [0.4, 1, 0.4],
      scale: [0.8, 1.2, 0.8],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-10 sm:py-14">
      {showBrain && (
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            boxShadow: [
              '0 0 20px rgba(59,130,246,0.1)',
              '0 0 50px rgba(59,130,246,0.3)',
              '0 0 20px rgba(59,130,246,0.1)'
            ]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="flex h-24 w-24 items-center justify-center rounded-[2.5rem] border border-blue-400/20 bg-blue-500/10 text-blue-300 shadow-2xl"
        >
          <BrainCircuit className="h-12 w-12" />
        </motion.div>
      )}

      <div className="flex items-center justify-center gap-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            variants={dotVariants}
            animate="animate"
            transition={{ delay: i * 0.15 }}
            className="h-3 w-3 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
          />
        ))}
      </div>

      <div className="flex flex-col gap-2 text-center">
        <h3 className="text-xl font-black text-white md:text-2xl">
          {message}
        </h3>
        {subtitle && (
          <p className="max-w-xs text-base font-medium leading-relaxed text-slate-400 md:text-lg">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex w-full max-w-[240px] flex-col gap-4">
        {[100, 85, 95].map((width, i) => (
          <div
            key={i}
            className="relative h-2.5 overflow-hidden rounded-full bg-white/5"
            style={{ width: `${width}%` }}
          >
            <motion.div
              className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/[0.05] to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
