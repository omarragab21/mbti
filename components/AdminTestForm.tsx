'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, LinkIcon, Save, XCircle } from 'lucide-react';
import AdminFormCard from './ui/AdminFormCard';
import CopyLinkButton from './ui/CopyLinkButton';
import PrimaryButton from './ui/PrimaryButton';
import SecondaryButton from './ui/SecondaryButton';
import WhatsAppShareButton from './ui/WhatsAppShareButton';

interface Option {
  id?: string;
  label: string;
  value: string;
}

interface Question {
  id?: string;
  order: number;
  title: string;
  axis: string;
  options: [Option, Option];
}

interface TestFormData {
  title: string;
  slug: string;
  intro: string;
  questions: Question[];
}

interface AdminTestFormProps {
  initialData?: TestFormData & { id?: string };
  mode: 'create' | 'edit';
}

const AXES = [
  { axis: 'E-I', label: 'الطاقة', values: ['E', 'I'] },
  { axis: 'S-N', label: 'الإدراك', values: ['S', 'N'] },
  { axis: 'T-F', label: 'الحكم', values: ['T', 'F'] },
  { axis: 'J-P', label: 'الأسلوب', values: ['J', 'P'] },
];

const DEFAULT_FORM: TestFormData = {
  title: '',
  slug: '',
  intro: '',
  questions: AXES.map((a, i) => ({
    order: i + 1,
    title: '',
    axis: a.axis,
    options: [
      { label: '', value: a.values[0] },
      { label: '', value: a.values[1] },
    ] as [Option, Option],
  })),
};

export default function AdminTestForm({ initialData, mode }: AdminTestFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<TestFormData>(initialData ?? DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const testUrl =
    typeof window !== 'undefined' && form.slug
      ? `${window.location.origin}/t/${form.slug}`
      : '';
  const whatsappHref = testUrl
    ? `https://wa.me/?text=${encodeURIComponent(`جرب اختبار MBTI السريع من هنا:\n${testUrl}`)}`
    : '#';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const url = mode === 'create' ? '/api/tests' : `/api/tests/${initialData?.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const payload = await res.json();
        throw new Error(payload.error ?? 'حدث خطأ في الحفظ');
      }

      await res.json();
      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/tests');
        router.refresh();
      }, 900);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'حدث خطأ غير متوقع');
    } finally {
      setSaving(false);
    }
  };

  const updateQuestion = (qIdx: number, field: keyof Omit<Question, 'options'>, val: string) => {
    setForm((prev) => {
      const qs = [...prev.questions];
      qs[qIdx] = { ...qs[qIdx], [field]: val };
      return { ...prev, questions: qs };
    });
  };

  const updateOption = (qIdx: number, oIdx: 0 | 1, val: string) => {
    setForm((prev) => {
      const qs = [...prev.questions];
      const opts = [...qs[qIdx].options] as [Option, Option];
      opts[oIdx] = { ...opts[oIdx], label: val };
      qs[qIdx] = { ...qs[qIdx], options: opts };
      return { ...prev, questions: qs };
    });
  };

  const generateSlug = () => {
    const base = form.title
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
    const rand = Math.random().toString(36).substring(2, 6);
    setForm((prev) => ({ ...prev, slug: base ? `${base}-${rand}` : `test-${rand}` }));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10 lg:gap-12" dir="rtl">
      <AdminFormCard
        title="معلومات الاختبار الأساسية"
        subtitle="هذه البيانات هي أول ما يراه المستخدم. تأكد من صياغة عنوان جذاب ووصف واضح."
      >
        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
          <Field label="عنوان الاختبار">
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="مثال: اختبار الشخصية السريع"
              className="field-control text-base"
            />
          </Field>

          <Field label="الرابط الفريد (Slug)">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <LinkIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                    }))
                  }
                  placeholder="mbti-test"
                  className="field-control pl-11 text-left font-mono"
                  dir="ltr"
                />
              </div>
              <button
                type="button"
                onClick={generateSlug}
                className="flex min-h-[56px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-6 text-sm font-black text-blue-300 transition-all hover:bg-white/[0.08] active:scale-[0.98]"
              >
                توليد تلقائي
              </button>
            </div>
            {form.slug && (
              <p className="px-1 pt-2 text-left text-xs font-bold text-slate-500" dir="ltr">
                https://mbti.app/t/{form.slug}
              </p>
            )}
          </Field>
        </div>

        <div className="mt-4">
          <Field label="نص مقدمة الاختبار">
            <textarea
              required
              rows={4}
              value={form.intro}
              onChange={(e) => setForm((p) => ({ ...p, intro: e.target.value }))}
              placeholder="اكتب وصفاً قصيراً يحمس المستخدمين لبدء الاختبار..."
              className="field-control resize-none text-base leading-relaxed"
            />
          </Field>
        </div>
      </AdminFormCard>

      <div className="flex flex-col gap-6 md:gap-8">
        <div className="flex flex-col gap-2 px-1">
          <h2 className="text-2xl font-black text-white">هيكلية الأسئلة (الأبعاد الأربعة)</h2>
          <p className="text-base font-medium leading-relaxed text-slate-400">
            يتكون اختبار MBTI من ٤ أسئلة أساسية، كل سؤال يغطي محوراً معيناً من محاور الشخصية.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {form.questions.map((q, qIdx) => {
            const axis = AXES[qIdx];
            return (
              <motion.div
                key={qIdx}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: qIdx * 0.05 }}
                className="group rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-6 shadow-2xl transition-all hover:border-white/20 hover:bg-white/[0.05] md:p-8"
              >
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-black text-white shadow-lg shadow-blue-500/20">
                      {q.order}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-black tracking-widest text-slate-500 uppercase">المحور النفسي</span>
                      <span className="text-lg font-black text-white">{axis.label} ({axis.axis})</span>
                    </div>
                  </div>
                  <div className="rounded-xl bg-blue-500/10 px-3 py-1 text-xs font-black text-blue-300">
                    مطلوب
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <Field label="نص السؤال">
                    <input
                      type="text"
                      required
                      value={q.title}
                      onChange={(e) => updateQuestion(qIdx, 'title', e.target.value)}
                      placeholder="كيف تتفاعل مع المحيط الخارجي عادة؟"
                      className="field-control bg-white/5 text-base md:text-lg"
                    />
                  </Field>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {q.options.map((opt, oIdx) => (
                      <Field key={opt.value} label={`خيار النمط (${opt.value})`}>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs font-black text-blue-400">
                            {opt.value}
                          </span>
                          <input
                            type="text"
                            required
                            value={opt.label}
                            onChange={(e) => updateOption(qIdx, oIdx as 0 | 1, e.target.value)}
                            placeholder="وصف الخيار..."
                            className="field-control bg-white/5 pl-12 text-sm font-bold"
                          />
                        </div>
                      </Field>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {mode === 'edit' && form.slug && (
        <AdminFormCard
          title="نشر ومشاركة الاختبار"
          subtitle="بمجرد الحفظ، يمكنك مشاركة هذا الرابط مع جمهورك مباشرة."
        >
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-white/5 bg-black/40 p-5">
              <div className="mb-2 text-xs font-black tracking-widest text-slate-600 uppercase">رابط المعاينة المباشر</div>
              <div className="truncate font-mono text-base text-blue-300" dir="ltr">
                {testUrl}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <CopyLinkButton text={testUrl} label="نسخ الرابط للمحافظة" />
              <WhatsAppShareButton href={whatsappHref} label="فتح في واتساب" />
            </div>
          </div>
        </AdminFormCard>
      )}

      {/* Action Footer */}
      <div className="sticky bottom-6 z-30 mt-4 flex flex-col gap-4 rounded-[2.5rem] border border-white/10 bg-slate-900/80 p-4 shadow-2xl backdrop-blur-2xl md:static md:bg-transparent md:p-0 md:backdrop-blur-0">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-4 text-sm font-bold text-red-100"
          >
            <XCircle className="mt-1 h-5 w-5 flex-shrink-0 text-red-400" />
            <div className="flex-1 leading-relaxed">{error}</div>
          </motion.div>
        )}
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-6 py-4 text-sm font-bold text-emerald-100"
          >
            <CheckCircle2 className="h-6 w-6 text-emerald-400" />
            <div>تم حفظ جميع التعديلات بنجاح</div>
          </motion.div>
        )}

        <div className="flex flex-col gap-3 md:flex-row md:justify-end">
          <SecondaryButton type="button" onClick={() => router.back()} className="order-2 md:order-1 md:w-40" size="lg">
            إلغاء التغييرات
          </SecondaryButton>
          <PrimaryButton type="submit" loading={saving} disabled={saving} className="order-1 flex-1 md:order-2 md:w-64" size="lg">
            <Save className="h-5 w-5" />
            {saving ? 'جاري الحفظ...' : mode === 'create' ? 'إنشاء الاختبار الآن' : 'حفظ التغييرات'}
          </PrimaryButton>
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="block text-sm font-extrabold text-slate-300">{label}</span>
      {children}
    </label>
  );
}
