import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import TestRunner from '@/components/TestRunner';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const test = await prisma.test.findUnique({ where: { slug } });
  if (!test) return { title: 'الاختبار غير موجود' };
  return {
    title: test.title,
    description: test.intro,
  };
}

export default async function TestPage({ params }: Props) {
  const { slug } = await params;

  const test = await prisma.test.findUnique({
    where: { slug, isActive: true },
    include: {
      questions: {
        orderBy: { order: 'asc' },
        include: {
          options: { orderBy: { value: 'asc' } },
        },
      },
    },
  });

  if (!test) notFound();

  return (
    <TestRunner
      test={{
        id: test.id,
        title: test.title,
        slug: test.slug,
        intro: test.intro,
      }}
      questions={test.questions}
    />
  );
}
