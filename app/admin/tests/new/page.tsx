import Link from 'next/link';
import AppShell from '@/components/AppShell';
import AdminTestForm from '@/components/AdminTestForm';

export default function NewTestPage() {
  return (
    <AppShell maxWidth="admin" contentClassName="py-4 sm:py-6">
      <div className="w-full space-y-6">
        <div className="space-y-1">
          <Link href="/admin/tests" className="text-sm font-bold text-slate-500 transition-colors hover:text-slate-300">
            الاختبارات
          </Link>
          <h1 className="text-3xl font-black text-white sm:text-4xl">إنشاء اختبار جديد</h1>
          <p className="text-sm leading-7 text-slate-400">
            أضف العنوان والرابط والأسئلة الأربعة، ثم شارك الرابط العام.
          </p>
        </div>

        <AdminTestForm mode="create" />
      </div>
    </AppShell>
  );
}
