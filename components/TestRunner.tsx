'use client';

import { useState } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { BrainCircuit, Clock3, Sparkles, Zap } from 'lucide-react';
import { calculateMBTI } from '@/lib/mbti';
import AppShell from './AppShell';
import ResultCard from './ResultCard';
import GlassCard from './ui/GlassCard';
import OptionButton from './ui/OptionButton';
import PrimaryButton from './ui/PrimaryButton';
import QuestionCard from './ui/QuestionCard';
import QuestionHeader from './ui/QuestionHeader';

interface Option {
  id: string;
  label: string;
  value: string;
}

interface Question {
  id: string;
  order: number;
  title: string;
  axis: string;
  options: Option[];
}

interface Test {
  id: string;
  title: string;
  slug: string;
  intro: string;
}

interface TestRunnerProps {
  test: Test;
  questions: Question[];
}

type Phase = 'welcome' | 'questions' | 'result';

const slideVariants: Variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? -28 : 28,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({
    x: dir > 0 ? 28 : -28,
    opacity: 0,
  }),
};

const featureItems = [
  { icon: Zap, text: '٤ أسئلة' },
  { icon: Clock3, text: 'دقيقة واحدة' },
  { icon: Sparkles, text: 'تحليل AI' },
];

export default function TestRunner({ test, questions }: TestRunnerProps) {
  const [phase, setPhase] = useState<Phase>('welcome');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [direction, setDirection] = useState(1);
  const [result, setResult] = useState<{ type: string; title: string } | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const progress = ((currentQ + 1) / questions.length) * 100;
  const question = questions[currentQ];

  const handleAnswer = (value: string) => {
    if (isSelecting) return;

    setIsSelecting(true);
    setSelectedOption(value);

    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (newAnswers.length === questions.length) {
      const mbti = calculateMBTI(newAnswers);
      setResult(mbti);
      setTimeout(() => {
        setPhase('result');
        setIsSelecting(false);
      }, 520);
      return;
    }

    setDirection(1);
    setTimeout(() => {
      setCurrentQ((q) => q + 1);
      setIsSelecting(false);
      setSelectedOption(null);
    }, 520);
  };

  const handleRetake = () => {
    setPhase('welcome');
    setCurrentQ(0);
    setAnswers([]);
    setResult(null);
    setDirection(1);
    setSelectedOption(null);
  };

  return (
    <AppShell contentClassName="flex min-h-[calc(100dvh-3rem)] flex-col justify-center transition-all duration-500 sm:min-h-[calc(100dvh-4rem)] md:min-h-[calc(100dvh-5rem)] lg:min-h-[calc(100dvh-6rem)]">
      <AnimatePresence mode="wait">
        {phase === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.4 }}
            className="grid w-full min-w-0 grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-8"
          >
            {/* Main Content */}
            <div className="order-1 mx-auto flex w-full max-w-3xl min-w-0 flex-col items-center lg:col-span-7 lg:max-w-none">
              <GlassCard padding="lg" className="flex flex-col gap-8 text-center md:gap-10 lg:gap-12">
                <div className="flex flex-col items-center gap-6">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: 'spring' }}
                    className="flex h-24 w-24 items-center justify-center rounded-[2.5rem] border border-blue-400/20 bg-blue-500/10 text-blue-300 shadow-[0_20px_60px_rgba(59,130,246,0.2)] sm:h-28 sm:w-28"
                  >
                    <BrainCircuit className="h-12 w-12 sm:h-14 sm:w-14" aria-hidden="true" />
                  </motion.div>

                  <div className="flex flex-col items-center gap-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-black text-blue-200 uppercase tracking-widest">
                      <Sparkles className="h-4 w-4" />
                      اختبار MBTI سريع
                    </div>
                    <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">{test.title}</h1>
                    <p className="max-w-xl text-lg font-medium leading-relaxed text-slate-300 md:text-xl">
                      {test.intro}
                    </p>
                  </div>
                </div>

                <div className="grid w-full grid-cols-3 gap-3 md:gap-4">
                  {featureItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.text}
                        className="flex flex-col items-center gap-2 rounded-3xl border border-white/10 bg-white/[0.03] py-5 text-center transition-colors hover:bg-white/[0.06]"
                      >
                        <Icon className="h-6 w-6 text-blue-300" aria-hidden="true" />
                        <div className="text-xs font-black text-slate-200 sm:text-sm">
                          {item.text}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col items-center gap-4 pt-2">
                  <PrimaryButton size="lg" onClick={() => setPhase('questions')} className="w-full sm:max-w-xs">
                    <Sparkles className="h-5 w-5" aria-hidden="true" />
                    ابدأ الاختبار الآن
                  </PrimaryButton>
                  <p className="text-xs font-bold leading-6 text-slate-500 tracking-wide uppercase">
                    نتائج فورية • تحليل ذكي • تجربة مجانية
                  </p>
                </div>
              </GlassCard>
            </div>

            {/* Side Content (Hidden on Mobile) */}
            <div className="order-2 hidden w-full min-w-0 flex-col gap-6 lg:col-span-5 lg:flex">
              <div className="flex w-full min-w-0 flex-col gap-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl lg:p-10">
                <div className="flex flex-col gap-3">
                  <h3 className="text-2xl font-black text-white">كيف يعمل الاختبار؟</h3>
                  <p className="text-lg font-medium leading-relaxed text-slate-400">
                    نعتمد على تحليل الأبعاد الأساسية للشخصية من خلال ٤ أسئلة محورية مصممة بعناية لتعطيك لمحة دقيقة عن نمطك النفسي وتفضيلاتك في الحياة والعمل.
                  </p>
                </div>
                
                <div className="flex flex-col gap-5 border-t border-white/10 pt-8">
                  {[
                    'تحليل شخصي فوري بالذكاء الاصطناعي',
                    'توصيات مخصصة للنمو والتطوير',
                    'فهم أعمق لنقاط القوة والضعف لديك'
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                        <Zap className="h-3.5 w-3.5 fill-current" />
                      </div>
                      <span className="text-base font-bold text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'questions' && question && (
          <motion.div
            key="questions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid w-full min-w-0 grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-8"
          >
            {/* Main Content */}
            <div className="order-1 mx-auto flex w-full max-w-3xl min-w-0 flex-col gap-6 md:gap-8 lg:col-span-7 lg:max-w-none">
              <QuestionHeader current={currentQ + 1} total={questions.length} progress={progress} />

              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentQ}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="flex flex-col gap-8"
                >
                  <QuestionCard
                    badge={`السؤال ${currentQ + 1} من ${questions.length}`}
                    title={question.title}
                  />

                  <div className="grid w-full min-w-0 grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
                    {question.options.map((opt, idx) => {
                      const isSelected = selectedOption === opt.value;
                      const isAnotherSelected = selectedOption !== null && !isSelected;

                      return (
                        <motion.div
                          key={opt.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{
                            opacity: isAnotherSelected ? 0.4 : 1,
                            y: 0,
                            scale: isSelected ? 1.02 : 1,
                          }}
                          transition={{
                            delay: isSelecting ? 0 : idx * 0.08,
                            duration: 0.3,
                          }}
                        >
                          <OptionButton
                            label={opt.label}
                            onClick={() => handleAnswer(opt.value)}
                            disabled={isSelecting}
                            selected={isSelected}
                          />
                        </motion.div>
                      );
                    })}
                  </div>

                  <p className="text-center text-sm font-bold leading-6 text-slate-500 uppercase tracking-widest">
                    اختر الإجابة العفوية التي تمثلك في معظم المواقف
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Desktop Side Panel */}
            <div className="order-2 hidden w-full min-w-0 flex-col gap-6 lg:col-span-5 lg:flex">
              <GlassCard padding="lg" className="flex flex-col gap-6 bg-blue-500/[0.02]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
                  <BrainCircuit className="h-6 w-6" />
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="text-xl font-black text-white">لماذا هذا السؤال؟</h3>
                  <p className="text-base font-medium leading-relaxed text-slate-400">
                    هذا السؤال يساعد في تحديد أحد المحاور الأربعة لشخصيتك. لا توجد إجابات صحيحة أو خاطئة، فكل نمط له مميزاته الفريدة.
                  </p>
                </div>
                
                <div className="mt-4 flex flex-col gap-4 border-t border-white/10 pt-6">
                  <div className="flex items-center gap-4">
                    <div className="h-2.5 w-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    <span className="text-sm font-bold text-slate-300">تحليل المحاور النفسية بدقة</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-2.5 w-2.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                    <span className="text-sm font-bold text-slate-300">مبني على خوارزميات MBTI المعتمدة</span>
                  </div>
                </div>
              </GlassCard>
            </div>
          </motion.div>
        )}

        {phase === 'result' && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full min-w-0"
          >
            <ResultCard
              testId={test.id}
              mbtiType={result.type}
              mbtiTitle={result.title}
              testSlug={test.slug}
              answersJson={JSON.stringify(answers)}
              onRetake={handleRetake}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
