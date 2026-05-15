'use client';

import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { ClipboardList, LayoutDashboard, Plus, Sparkles } from 'lucide-react';
import AppShell from '@/components/AppShell';
import GlassCard from '@/components/ui/GlassCard';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';

const variants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 190, damping: 20 } },
};

export default function AdminPage() {
  return (
    <AppShell maxWidth="md">
      <motion.div initial="hidden" animate="visible" className="w-full">
        <GlassCard padding="lg" className="flex flex-col gap-8 text-center md:gap-10">
          <motion.div variants={variants} className="mx-auto flex h-20 w-20 items-center justify-center rounded-[2.2rem] border border-blue-400/20 bg-blue-500/10 text-blue-300 shadow-[0_0_40px_rgba(59,130,246,0.15)] sm:h-24 sm:w-24">
            <LayoutDashboard className="h-10 w-10 sm:h-12 sm:w-12" aria-hidden="true" />
          </motion.div>

          <motion.div variants={variants} className="flex flex-col gap-4">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-black text-blue-200">
              <Sparkles className="h-4 w-4" />
              لوحة التحكم الاحترافية
            </div>
            <h1 className="text-4xl font-black text-white sm:text-5xl">إدارة <span className="bg-gradient-to-l from-blue-400 to-indigo-400 bg-clip-text text-transparent">الاختبارات</span></h1>
            <p className="mx-auto max-w-md text-base font-medium leading-relaxed text-slate-300 md:text-lg">
              تحكم كامل في الأسئلة، إعدادات الاختبار، ونتائج المشاركين بسهولة تامة.
            </p>
          </motion.div>

          <motion.div variants={variants} className="flex flex-col gap-4 sm:mx-auto sm:w-full sm:max-w-md">
            <Link href="/admin/tests" className="block">
              <PrimaryButton className="w-full" size="lg">
                <ClipboardList className="h-5 w-5" aria-hidden="true" />
                قائمة الاختبارات الحالية
              </PrimaryButton>
            </Link>
            <Link href="/admin/tests/new" className="block">
              <SecondaryButton className="w-full" size="lg">
                <Plus className="h-5 w-5" aria-hidden="true" />
                إضافة اختبار جديد
              </SecondaryButton>
            </Link>
            <div className="mt-4 border-t border-white/5 pt-6">
              <Link href="/" className="block">
                <SecondaryButton className="w-full" size="lg">
                  الرجوع للرئيسية
                </SecondaryButton>
              </Link>
            </div>
          </motion.div>
        </GlassCard>
      </motion.div>
    </AppShell>
  );
}
