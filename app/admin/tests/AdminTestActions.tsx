'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Copy, MessageCircle, Trash2 } from 'lucide-react';

interface Props {
  testId: string;
  testSlug: string;
}

export default function AdminTestActions({ testId, testSlug }: Props) {
  const router = useRouter();
  const [copying, setCopying] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const testUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/t/${testSlug}`
      : `/t/${testSlug}`;

  const handleCopy = async () => {
    setCopying(true);
    await navigator.clipboard.writeText(testUrl);
    setTimeout(() => setCopying(false), 1500);
  };

  const handleWhatsApp = () => {
    const msg = `جرب اختبار MBTI السريع من هنا:\n${testUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  const handleDelete = async () => {
    if (!confirm('هل أنت متأكد من حذف هذا الاختبار؟ سيتم حذف جميع النتائج أيضًا.')) return;
    setDeleting(true);
    try {
      await fetch(`/api/tests/${testId}`, { method: 'DELETE' });
      router.refresh();
    } finally {
      setDeleting(false);
    }
  };

  const buttonClass =
    'inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-2xl border px-3 py-2 text-xs font-extrabold transition-all active:scale-[0.98]';

  return (
    <>
      <button
        type="button"
        onClick={handleCopy}
        className={`${buttonClass} ${
          copying
            ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-200'
            : 'border-white/10 bg-white/[0.04] text-slate-300 hover:border-blue-400/50'
        }`}
      >
        {copying ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copying ? 'تم' : 'نسخ'}
      </button>
      <button
        type="button"
        onClick={handleWhatsApp}
        className={`${buttonClass} border-emerald-400/30 bg-emerald-400/10 text-emerald-200`}
      >
        <MessageCircle className="h-4 w-4" />
        واتساب
      </button>
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className={`${buttonClass} border-red-400/30 bg-red-400/10 text-red-200 disabled:opacity-60`}
      >
        <Trash2 className="h-4 w-4" />
        {deleting ? '...' : 'حذف'}
      </button>
    </>
  );
}
