'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  BrainCircuit,
  BriefcaseBusiness,
  Lightbulb,
  MessageCircle,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import ShareButtons from './ShareButtons';
import EnhancedLoadingState from './ui/EnhancedLoadingState';
import AnalysisSection from './ui/AnalysisSection';
import GlassCard from './ui/GlassCard';
import PrimaryButton from './ui/PrimaryButton';
import SecondaryButton from './ui/SecondaryButton';

interface ResultCardProps {
  testId: string;
  mbtiType: string;
  mbtiTitle: string;
  testSlug: string;
  answersJson: string;
  onRetake: () => void;
}

export default function ResultCard({
  testId,
  mbtiType,
  mbtiTitle,
  testSlug,
  answersJson,
  onRetake,
}: ResultCardProps) {
  const [resultId, setResultId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [analysisFetched, setAnalysisFetched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save result to DB on mount
  useEffect(() => {
    const saveResult = async () => {
      try {
        const res = await fetch('/api/results', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            testId,
            mbtiType,
            mbtiTitle,
            answersJson,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setResultId(data.id);
        }
      } catch {
        // Silently fail — result saving is non-critical
      }
    };
    saveResult();
  }, [testId, mbtiType, mbtiTitle, answersJson]);

  const handleAnalyze = async () => {
    if (analysisFetched) return;
    setLoadingAnalysis(true);
    setError(null);
    try {
      const res = await fetch('/api/analyze-mbti', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: mbtiType,
          title: mbtiTitle,
          resultId,
        }),
      });
      if (!res.ok) throw new Error('فشل في الحصول على التحليل');
      const data = await res.json();
      setAnalysis(data.analysis);
      setAnalysisFetched(true);
    } catch (e: unknown) {
      setError(
        e instanceof Error ? e.message : 'حدث خطأ، يرجى المحاولة مرة أخرى'
      );
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const testUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/t/${testSlug}`
    : '';

  return (
    <div className="w-full min-w-0">
      {/* 12-Column Grid for Desktop Balanced Layout */}
      <div className="grid w-full min-w-0 grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
        
        {/* Right Column: Main Result Card (lg:col-span-4) */}
        <div className="order-1 flex w-full min-w-0 flex-col gap-5 lg:col-span-4 lg:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full min-w-0"
          >
            <GlassCard padding="lg" className="flex flex-col gap-8 text-center">
              <div className="flex flex-col items-center gap-6">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 220, damping: 18 }}
                  className="flex h-20 w-20 items-center justify-center rounded-[2.5rem] border border-blue-400/20 bg-blue-500/10 text-blue-300 shadow-[0_0_40px_rgba(59,130,246,0.15)] sm:h-24 sm:w-24"
                >
                  <Sparkles className="h-10 w-10" aria-hidden="true" />
                </motion.div>

                <div className="flex flex-col gap-4">
                  <p className="text-sm font-black tracking-widest text-blue-400/80 uppercase">نمط شخصيتك هو</p>
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.16 }}
                    className="bg-gradient-to-l from-blue-400 to-indigo-400 bg-clip-text text-[64px] font-black leading-none tracking-tighter text-transparent sm:text-[80px]"
                    dir="ltr"
                  >
                    {mbtiType}
                  </motion.div>
                  <h1 className="text-3xl font-black leading-tight text-white sm:text-4xl">
                    {mbtiTitle}
                  </h1>
                </div>
              </div>

              <div className="rounded-3xl border border-white/5 bg-white/[0.02] px-6 py-5 text-base font-bold leading-relaxed text-slate-300">
                هذه نتيجة ذكية مبنية على تحليل ردودك. اكتشف المزيد من التفاصيل في قسم التحليل.
              </div>

              <div className="flex flex-col gap-4">
                {!analysisFetched && (
                  <PrimaryButton
                    size="lg"
                    onClick={handleAnalyze}
                    loading={loadingAnalysis}
                    disabled={loadingAnalysis}
                    className="w-full shadow-blue-600/10"
                  >
                    <BrainCircuit className="h-5 w-5" aria-hidden="true" />
                    تحليل شخصيتي الآن
                  </PrimaryButton>
                )}

                <SecondaryButton onClick={onRetake} className="w-full" size="lg">
                  <RotateCcw className="h-5 w-5" aria-hidden="true" />
                  إعادة الاختبار
                </SecondaryButton>
              </div>
            </GlassCard>
          </motion.div>

          {/* Share Section (Always below result card) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex w-full min-w-0 flex-col gap-5 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 md:p-6"
          >
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-black text-white">شارك نتيجتك</h2>
              <p className="text-sm font-medium leading-relaxed text-slate-400">
                ادعُ أصدقاءك لاكتشاف أنماطهم ومقارنتها بنمطك الفريد.
              </p>
            </div>
            <ShareButtons
              mbtiType={mbtiType}
              mbtiTitle={mbtiTitle}
              testUrl={testUrl}
            />
          </motion.div>
        </div>

        {/* Left Column: Analysis Results (lg:col-span-8) */}
        <div className="order-2 flex w-full min-w-0 flex-col gap-6 lg:col-span-8 lg:gap-8">
          {error && !loadingAnalysis && !analysisFetched && (
            <GlassCard padding="md" className="flex flex-col gap-6 border-red-500/20 bg-red-500/5">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-red-500/20 text-red-300">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl font-black text-red-100">فشل في الحصول على التحليل</h2>
                  <p className="text-base font-medium leading-relaxed text-red-100/70">
                    {error} - يرجى التأكد من اتصال الإنترنت والمحاولة مرة أخرى.
                  </p>
                </div>
              </div>
              <PrimaryButton size="lg" onClick={handleAnalyze} className="w-full sm:w-auto lg:px-10">
                إعادة المحاولة
              </PrimaryButton>
            </GlassCard>
          )}

          {loadingAnalysis && (
            <div className="flex min-h-[360px] w-full min-w-0 items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 md:min-h-[460px] md:p-6">
              <EnhancedLoadingState
                message="جاري توليد تحليلك الشخصي..."
                subtitle="يقوم الذكاء الاصطناعي الآن بربط سماتك الشخصية لتقديم تقرير مفصل."
              />
            </div>
          )}

          {analysisFetched && analysis && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="flex w-full min-w-0 flex-col gap-6 lg:gap-8"
            >
              <div className="flex min-w-0 items-center gap-4 px-1 md:gap-5 md:px-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300 shadow-inner">
                  <BrainCircuit className="h-7 w-7" />
                </div>
                <div className="flex min-w-0 flex-col gap-1">
                  <h2 className="text-2xl font-black text-white md:text-3xl">التقرير النفسي المطور</h2>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">مدعوم بالذكاء الاصطناعي</p>
                </div>
              </div>
              <AnalysisDisplay text={analysis} />
            </motion.div>
          )}

          {!analysisFetched && !loadingAnalysis && (
            <div className="flex min-h-[320px] w-full min-w-0 flex-col items-center justify-center gap-6 rounded-[2rem] border border-dashed border-white/10 bg-white/[0.04] p-5 text-center transition-all hover:bg-white/[0.06] md:min-h-[400px] md:p-8 lg:p-10">
              <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-white/5 text-slate-600 shadow-xl">
                <BrainCircuit className="h-10 w-10" />
              </div>
              <div className="flex flex-col items-center gap-3">
                <h3 className="text-2xl font-black text-slate-400">التحليل التفصيلي بانتظارك</h3>
                <p className="max-w-md text-lg font-medium leading-relaxed text-slate-500">
                  هل تريد معرفة نقاط قوتك، ضعفك، وكيف يراك الآخرون؟ اضغط على زر التحليل في البطاقة المقابلة.
                </p>
              </div>
              <PrimaryButton size="lg" onClick={handleAnalyze} className="w-full opacity-80 hover:opacity-100 sm:w-auto sm:px-12">
                الحصول على التحليل الآن
              </PrimaryButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AnalysisDisplay({ text }: { text: string }) {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l);

  const sections: { title: string; content: string[] }[] = [];
  let currentSection: {
    title: string;
    content: string[];
  } | null = null;

  for (const line of lines) {
    const headerMatch =
      line.match(/^#+\s*(.+)/) ||
      line.match(/^\d+\.\s+(.+)/) ||
      line.match(/^\*\*(.+)\*\*/);

    if (headerMatch) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        title: headerMatch[1],
        content: [],
      };
    } else if (currentSection && line) {
      currentSection.content.push(line.replace(/^\*\s*/, '').replace(/^-\s*/, ''));
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  if (sections.length === 0) {
    sections.push({ title: 'تحليل الشخصية', content: [text] });
  }

  return (
    <div className="grid w-full min-w-0 grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:gap-6">
      {sections.map((section, idx) => (
        <AnalysisSection
          key={idx}
          title={section.title}
          content={section.content.join('\n')}
          icon={getSectionIcon(section.title, idx)}
          delay={0.08 * (idx + 1)}
        />
      ))}
    </div>
  );
}

function getSectionIcon(title: string, idx: number) {
  const normalized = title.replace(/[#:*]/g, '');
  const className = 'h-5 w-5';

  if (normalized.includes('وصف')) return <Target className={className} />;
  if (normalized.includes('القوة')) return <ShieldCheck className={className} />;
  if (normalized.includes('الضعف')) return <AlertCircle className={className} />;
  if (normalized.includes('التفكير')) return <Lightbulb className={className} />;
  if (normalized.includes('التواصل')) return <MessageCircle className={className} />;
  if (normalized.includes('المهن')) return <BriefcaseBusiness className={className} />;
  if (normalized.includes('العلاقات') || normalized.includes('الجماعي')) return <Users className={className} />;
  if (normalized.includes('نصائح') || normalized.includes('تطوير')) return <TrendingUp className={className} />;

  const fallback = [Target, ShieldCheck, AlertCircle, Lightbulb, MessageCircle, BriefcaseBusiness, Users, TrendingUp];
  const Icon = fallback[idx % fallback.length];
  return <Icon className={className} />;
}
