import { notFound } from 'next/navigation';
import TestRunner from '@/components/TestRunner';
import type { Metadata } from 'next';
import { getTestBySlug } from '@/lib/tests';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const test = getTestBySlug(slug);
  if (!test) return { title: 'الاختبار غير موجود' };
  return {
    title: test.title,
    description: test.intro,
  };
}

export default async function TestPage({ params }: Props) {
  const { slug } = await params;

  const test = getTestBySlug(slug, { activeOnly: true });

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
