'use client';

interface ProgressBarProps {
  progress: number;
  className?: string;
}

export default function ProgressBar({ progress, className = '' }: ProgressBarProps) {
  return (
    <div
      className={`relative h-2.5 w-full overflow-hidden rounded-full bg-white/5 ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full bg-gradient-to-l from-blue-500 to-indigo-500 shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all duration-700 ease-out"
        style={{
          width: `${Math.min(100, Math.max(0, progress))}%`,
        }}
      />
    </div>
  );
}
