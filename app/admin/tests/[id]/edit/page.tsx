import { notFound } from 'next/navigation';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import AdminTestForm from '@/components/AdminTestForm';
import { getTestById, type TestQuestion } from '@/lib/tests';

interface Props {
  params: Promise<{ id: string }>;
}

type EditOption = {
  id?: string;
  label: string;
  value: string;
};

type EditQuestion = {
  id: string;
  order: number;
  title: string;
  axis: string;
  options: [EditOption, EditOption];
};

export default async function EditTestPage({ params }: Props) {
  const { id } = await params;

  const test = getTestById(id);

  if (!test) notFound();

  const initialData = {
    id: test.id,
    title: test.title,
    slug: test.slug,
    intro: test.intro,
    questions: test.questions.map((q: TestQuestion): EditQuestion => {
      const options: [EditOption, EditOption] = [
        { id: q.options[0]?.id, label: q.options[0]?.label ?? '', value: q.options[0]?.value ?? '' },
        { id: q.options[1]?.id, label: q.options[1]?.label ?? '', value: q.options[1]?.value ?? '' },
      ];

      return {
        id: q.id,
        order: q.order,
        title: q.title,
        axis: q.axis,
        options,
      };
    }),
  };

  return (
    <AppShell maxWidth="admin" contentClassName="py-4 sm:py-6">
      <div className="w-full space-y-6">
        <div className="space-y-1">
          <Link href="/admin/tests" className="text-sm font-bold text-slate-500 transition-colors hover:text-slate-300">
            الاختبارات
          </Link>
          <h1 className="text-3xl font-black text-white sm:text-4xl">تعديل الاختبار</h1>
          <p className="text-left text-sm text-slate-500" dir="ltr">
            /t/{test.slug}
          </p>
        </div>

        <AdminTestForm mode="edit" initialData={initialData} />
      </div>
    </AppShell>
  );
}
