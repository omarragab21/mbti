import type { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'admin';
  align?: 'center' | 'start';
}

export default function AppShell({
  children,
  className = '',
  contentClassName = '',
  maxWidth = 'admin',
}: AppShellProps) {
  const maxWidthClass = {
    sm: 'max-w-xl',
    md: 'max-w-3xl',
    lg: 'max-w-5xl',
    admin: 'max-w-7xl',
  }[maxWidth];

  return (
    <main
      className={`relative min-h-[100dvh] w-full overflow-x-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black px-4 py-6 text-right text-slate-50 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12 lg:py-12 ${className}`}
      dir="rtl"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.06),transparent_50%)]" />
      
      <div className={`relative z-10 mx-auto w-full min-w-0 ${maxWidthClass} ${contentClassName}`}>
        {children}
      </div>
      
      <div className="safe-bottom" />
    </main>
  );
}
