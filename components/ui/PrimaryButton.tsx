'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
  loading?: boolean;
  size?: 'md' | 'lg';
}

export default function PrimaryButton({
  children,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  loading = false,
  size = 'md',
}: PrimaryButtonProps) {
  const sizeClasses = {
    md: 'px-5 py-3 text-base min-h-[52px]',
    lg: 'px-6 py-4 text-base sm:text-lg min-h-[56px]',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-l from-blue-600 to-indigo-600 font-bold text-white shadow-lg transition-all hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/20 disabled:opacity-50 ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
    >
      {loading ? (
        <span className="inline-flex items-center justify-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          {children}
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
}
