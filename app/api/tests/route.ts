import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createTest, isSlugTaken, listTests } from '@/lib/tests';

// GET /api/tests — list all tests
export async function GET() {
  try {
    return NextResponse.json(listTests());
  } catch (err) {
    console.error('[GET /api/tests]', err);
    return NextResponse.json({ error: 'فشل تحميل الاختبارات' }, { status: 500 });
  }
}

const optionSchema = z.object({
  label: z.string().min(1),
  value: z.string().length(1),
});

const questionSchema = z.object({
  order: z.number().int().min(1).max(4),
  title: z.string().min(1),
  axis: z.string().min(1),
  options: z.tuple([optionSchema, optionSchema]),
});

const testSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'الرابط يجب أن يحتوي على حروف إنجليزية صغيرة وأرقام وشرطات فقط'),
  intro: z.string().min(1),
  questions: z.array(questionSchema).length(4),
});

// POST /api/tests — create test
export async function POST(req: NextRequest) {
  try {
    let body: unknown;

    try {
      body = await req.json();
    } catch (jsonErr) {
      console.error('[POST /api/tests] Invalid JSON body:', jsonErr);
      return NextResponse.json({ error: 'صيغة JSON غير صحيحة' }, { status: 400 });
    }

    const parsed = testSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'بيانات غير صحيحة', details: parsed.error.flatten() }, { status: 400 });
    }

    const { title, slug, intro, questions } = parsed.data;

    // Check slug uniqueness
    if (isSlugTaken(slug)) {
      return NextResponse.json({ error: 'هذا الرابط مستخدم بالفعل، اختر رابطًا آخر' }, { status: 409 });
    }

    const test = createTest({ title, slug, intro, questions });

    return NextResponse.json(test, { status: 201 });
  } catch (err) {
    console.error('[POST /api/tests]', err);
    return NextResponse.json({ error: 'فشل إنشاء الاختبار' }, { status: 500 });
  }
}
