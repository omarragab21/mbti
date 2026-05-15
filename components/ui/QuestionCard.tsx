import type { ReactNode } from 'react';
import { HelpCircle } from 'lucide-react';
import GlassCard from './GlassCard';

interface QuestionCardProps {
  badge: string;
  title: string;
  children?: ReactNode;
}

export default function QuestionCard({ badge, title, children }: QuestionCardProps) {
  return (
    <GlassCard padding="lg" className="flex flex-col gap-6 md:gap-8">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-300">
          <HelpCircle className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="text-sm font-black tracking-wide text-blue-300 uppercase">
          {badge}
        </div>
      </div>
      <h2 className="text-2xl font-black leading-snug text-white sm:text-3xl md:text-4xl">
        {title}
      </h2>
      {children}
    </GlassCard>
  );
}
