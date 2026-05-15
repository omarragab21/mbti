import Link from 'next/link';
import { CalendarDays, Eye, FileQuestion, Pencil, Plus, Users } from 'lucide-react';
import AppShell from '@/components/AppShell';
import GlassCard from '@/components/ui/GlassCard';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import AdminTestActions from './AdminTestActions';

export const dynamic = 'force-dynamic';

export default async function AdminTestsPage() {
  const tests = await prisma.test.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { questions: true, results: true } } },
  });

  return (
    <AppShell maxWidth="admin" contentClassName="flex flex-col gap-8 md:gap-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <Link href="/admin" className="text-sm font-black tracking-widest text-blue-400/80 transition-colors hover:text-blue-300 uppercase">
            لوحة التحكم
          </Link>
          <h1 className="text-4xl font-black text-white sm:text-5xl">قائمة الاختبارات</h1>
          <p className="text-base font-medium leading-relaxed text-slate-400">
            شاهد جميع الاختبارات النشطة، النتائج، وإدارة المحتوى.
          </p>
        </div>
        <Link
          href="/admin/tests/new"
          className="group relative inline-flex min-h-[60px] items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-l from-blue-600 to-indigo-600 px-8 font-black text-white shadow-xl transition-all hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98]"
        >
          <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" aria-hidden="true" />
          إنشاء اختبار جديد
        </Link>
      </div>

      {tests.length === 0 ? (
        <GlassCard padding="lg" className="flex flex-col items-center justify-center gap-6 py-20 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] border border-blue-400/20 bg-blue-500/10 text-blue-300 shadow-2xl">
            <FileQuestion className="h-10 w-10" aria-hidden="true" />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-black text-white">لا توجد اختبارات متاحة</h2>
            <p className="max-w-md text-base font-medium leading-relaxed text-slate-400">
              لم تقم بإنشاء أي اختبارات بعد. ابدأ بإنشاء أول اختبار لك الآن وشاركه مع العالم.
            </p>
          </div>
          <Link href="/admin/tests/new">
            <PrimaryButton size="lg" className="px-12">
              ابدأ الآن
            </PrimaryButton>
          </Link>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8 xl:grid-cols-3">
          {tests.map((test) => (
            <GlassCard key={test.id} padding="md" className="flex flex-col gap-6 transition-all hover:border-white/20 hover:bg-white/[0.06]">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1 flex flex-col gap-3">
                  <div className={`inline-flex w-fit items-center gap-2 rounded-lg px-2.5 py-1 text-[10px] font-black tracking-widest uppercase ${
                    test.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'
                  }`}>
                    <div className={`h-1.5 w-1.5 rounded-full ${test.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                    {test.isActive ? 'نشط ومتاح' : 'مسودة'}
                  </div>
                  <h2 className="truncate text-xl font-black text-white">
                    {test.title}
                  </h2>
                  <p className="truncate text-left font-mono text-xs text-slate-500" dir="ltr">
                    /t/{test.slug}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: FileQuestion, label: 'أسئلة', value: test._count.questions },
                  { icon: Users, label: 'مشاركات', value: test._count.results },
                  { icon: CalendarDays, label: 'تاريخ', value: formatDate(test.createdAt).split(' ')[0] },
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 rounded-2xl border border-white/5 bg-white/[0.02] p-3 text-center">
                    <stat.icon className="h-4 w-4 text-blue-400" />
                    <div className="text-sm font-black text-white">{stat.value}</div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                <Link
                  href={`/t/${test.slug}`}
                  target="_blank"
                  className="flex-1 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 text-xs font-black text-blue-300 transition-all hover:bg-blue-500/20 active:scale-[0.98]"
                >
                  <Eye className="h-4 w-4" />
                  معاينة
                </Link>
                <Link
                  href={`/admin/tests/${test.id}/edit`}
                  className="flex-1 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] text-xs font-black text-slate-300 transition-all hover:border-blue-400/50 active:scale-[0.98]"
                >
                  <Pencil className="h-4 w-4" />
                  تعديل
                </Link>
                <AdminTestActions testId={test.id} testSlug={test.slug} />
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </AppShell>
  );
}
