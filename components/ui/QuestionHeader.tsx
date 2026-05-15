'use client';

import ProgressBar from './ProgressBar';

interface QuestionHeaderProps {
  current: number;
  total: number;
  progress: number;
  className?: string;
}

export default function QuestionHeader({
  current,
  total,
  progress,
  className = '',
}: QuestionHeaderProps) {
  return (
    <div className={`flex flex-col gap-5 ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-black tracking-widest text-blue-400 uppercase">التقدم الحالي</span>
          <h4 className="text-lg font-black text-white">
            السؤال <span className="text-blue-300">{current}</span> <span className="mx-1 text-slate-600">/</span> {total}
          </h4>
        </div>
        <div className="flex flex-col gap-1 text-left">
          <span className="text-xs font-black tracking-widest text-slate-500 uppercase">المكتمل</span>
          <span className="text-lg font-black text-slate-300">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      <ProgressBar progress={progress} />

      <div className="flex justify-center gap-1.5 md:gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i < current - 1
                ? 'w-6 bg-blue-500/40'
                : i === current - 1
                  ? 'w-10 bg-gradient-to-l from-blue-500 to-indigo-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                  : 'w-4 bg-white/5'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
