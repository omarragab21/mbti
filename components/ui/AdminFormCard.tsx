import type { ReactNode } from 'react';
import GlassCard from './GlassCard';

interface AdminFormCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export default function AdminFormCard({
  title,
  subtitle,
  children,
  className = '',
}: AdminFormCardProps) {
  return (
    <GlassCard padding="lg" className={`flex flex-col gap-8 ${className}`}>
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-black text-white sm:text-2xl">{title}</h2>
        {subtitle && (
          <p className="text-base font-medium leading-relaxed text-slate-400">
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-6">
        {children}
      </div>
    </GlassCard>
  );
}
