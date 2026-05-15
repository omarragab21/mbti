'use client';

import { motion } from 'framer-motion';

interface OptionButtonProps {
  label: string;
  value?: string;
  onClick: () => void;
  disabled?: boolean;
  selected?: boolean;
  mbtiLetter?: string;
}

export default function OptionButton({
  label,
  onClick,
  disabled = false,
  selected = false,
  mbtiLetter,
}: OptionButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative flex min-h-[72px] w-full items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-right font-extrabold text-slate-100 transition-all hover:border-blue-400/50 hover:bg-white/[0.06] disabled:opacity-50 ${
        selected ? 'border-blue-400/70 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.1)]' : ''
      }`}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      <span className="flex-1 leading-relaxed">{label}</span>
      {mbtiLetter && (
        <span className={`flex-shrink-0 rounded-xl border border-white/10 px-2.5 py-1.5 text-xs font-black transition-colors ${selected ? 'bg-blue-500/20 text-blue-300' : 'bg-white/5 text-slate-500'}`}>
          {mbtiLetter}
        </span>
      )}
      <div className={`absolute inset-y-0 right-0 w-1 bg-blue-500 transition-transform ${selected ? 'scale-y-100' : 'scale-y-0'}`} />
    </motion.button>
  );
}
