'use client';

import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface WhatsAppShareButtonProps {
  href: string;
  label?: string;
  className?: string;
}

export default function WhatsAppShareButton({
  href,
  label = 'مشاركة النتيجة على واتساب',
  className = '',
}: WhatsAppShareButtonProps) {
  return (
    <motion.a
      whileTap={{ scale: 0.98 }}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-[1.35rem] border border-emerald-300/20 bg-gradient-to-l from-emerald-500 to-teal-600 px-5 py-4 text-center text-base font-extrabold text-white shadow-[0_18px_42px_rgba(16,185,129,0.22)] transition-all hover:brightness-105 ${className}`}
    >
      <MessageCircle className="h-5 w-5" aria-hidden="true" />
      {label}
    </motion.a>
  );
}
