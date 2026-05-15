'use client';

import { motion } from 'framer-motion';

interface BadgeProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'default' | 'outline';
}

export default function Badge({
  children,
  icon,
  variant = 'default',
}: BadgeProps) {
  const variants = {
    default: 'border-blue-400/30 bg-blue-400/10 text-blue-300',
    outline: 'border-white/10 bg-white/5 text-slate-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black tracking-wide uppercase ${variants[variant]}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </motion.div>
  );
}
