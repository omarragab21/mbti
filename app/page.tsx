'use client';

import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { BrainCircuit, Gauge, MessageCircle, Sparkles } from 'lucide-react';
import AppShell from '@/components/AppShell';
import GlassCard from '@/components/ui/GlassCard';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 190, damping: 20 },
  },
};

const features = [
  { icon: Gauge, label: '٤ أسئلة فقط', desc: 'تجربة سريعة وواضحة' },
  { icon: BrainCircuit, label: 'تحليل ذكي', desc: 'أقسام عربية مقروءة' },
  { icon: MessageCircle, label: 'واتساب', desc: 'مشاركة فورية للرابط' },
];

export default function HomePage() {
  return (
    <AppShell>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex w-full flex-col items-center justify-center py-4 sm:py-6"
      >
        <div className="w-full max-w-5xl">
          <GlassCard padding="lg" className="flex flex-col gap-10 text-center md:gap-12 lg:gap-14">
            {/* Hero Section */}
            <div className="flex flex-col items-center gap-8 md:gap-10">
              <motion.div 
                variants={itemVariants} 
                className="flex h-24 w-24 items-center justify-center rounded-[2.5rem] border border-blue-400/20 bg-blue-500/10 text-blue-300 shadow-[0_0_50px_rgba(59,130,246,0.15)] sm:h-28 sm:w-28"
              >
                <BrainCircuit className="h-12 w-12 sm:h-14 sm:w-14" aria-hidden="true" />
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-col items-center gap-5 md:gap-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black tracking-wide text-blue-200">
                  <Sparkles className="h-4 w-4" />
                  اختبار شخصية عربي سريع ومجاني
                </div>
                <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                  اكتشف <span className="bg-gradient-to-l from-blue-400 to-indigo-400 bg-clip-text text-transparent">نمط شخصيتك</span>
                </h1>
                <p className="max-w-3xl text-lg font-medium leading-relaxed text-slate-300 md:text-xl md:leading-loose">
                  تجربة MBTI مصممة بعناية لتعطيك أدق النتائج في أقل وقت. ٤ أسئلة ذكية، تحليل مفصل، ومشاركة فورية.
                </p>
              </motion.div>
            </div>

            {/* Features Grid */}
            <motion.div variants={itemVariants} className="grid w-full grid-cols-1 gap-5 sm:grid-cols-3 md:gap-6 lg:gap-8">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.label} className="group flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:bg-white/[0.06] md:p-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300 transition-transform group-hover:scale-110">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-black text-white">{feature.label}</div>
                      <div className="mt-2 text-sm font-medium leading-relaxed text-slate-400">{feature.desc}</div>
                    </div>
                  </div>
                );
              })}
            </motion.div>

            {/* Action Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center md:gap-6">
              <Link href="/t/mbti-quick-test" className="w-full sm:w-auto">
                <PrimaryButton className="w-full sm:px-14" size="lg">
                  <Sparkles className="h-5 w-5" aria-hidden="true" />
                  ابدأ الاختبار الآن
                </PrimaryButton>
              </Link>
              <Link href="/admin" className="w-full sm:w-auto">
                <SecondaryButton className="w-full sm:px-12" size="lg">
                  لوحة التحكم
                </SecondaryButton>
              </Link>
            </motion.div>
          </GlassCard>
        </div>
      </motion.div>
    </AppShell>
  );
}
