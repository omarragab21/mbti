'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SecondaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
}

export default function SecondaryButton({
  children,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  size = 'md',
  href,
}: SecondaryButtonProps) {
  const sizeClasses = {
    sm: 'min-h-[40px] px-4 py-2 text-sm',
    md: 'min-h-[52px] px-5 py-3 text-base',
    lg: 'min-h-[56px] px-6 py-4 text-base sm:text-lg',
  };

  const baseClasses = `relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] font-bold text-slate-200 transition-all hover:bg-white/[0.08] hover:text-white disabled:opacity-50 ${sizeClasses[size]} ${className}`;

  if (href) {
    return (
      <motion.a
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        href={href}
        className={baseClasses}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={baseClasses}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </motion.button>
  );
}
