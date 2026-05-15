'use client';

import { motion } from 'framer-motion';

interface AnalysisSectionProps {
  title: string;
  content: string;
  icon?: React.ReactNode;
  delay?: number;
}

export default function AnalysisSection({
  title,
  content,
  icon,
  delay = 0,
}: AnalysisSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="flex w-full min-w-0 flex-col gap-5 rounded-3xl border border-white/10 bg-white/[0.04] p-5 transition-all hover:bg-white/[0.06] md:p-6"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300 shadow-sm">
          {icon ? icon : <div className="h-5 w-5 rounded-full bg-blue-500/30" />}
        </div>
        <h3 className="text-xl font-black text-white leading-tight md:text-2xl">{title}</h3>
      </div>
      <div className="flex flex-col gap-4 text-base font-medium leading-relaxed text-slate-300 md:text-lg md:leading-loose">
        {content.split('\n').map((line, i) => (
          <p key={i} className="relative">
            {line}
          </p>
        ))}
      </div>
    </motion.div>
  );
}
