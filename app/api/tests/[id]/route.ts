import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { deleteTest, getTestById, isSlugTaken, updateTest } from '@/lib/tests';

// GET /api/tests/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const test = getTestById(id);
    if (!test) return NextResponse.json({ error: 'الاختبار غير موجود' }, { status: 404 });
    return NextResponse.json(test);
  } catch (err) {
    console.error('[GET /api/tests/[id]]', err);
    return NextResponse.json({ error: 'فشل تحميل الاختبار' }, { status: 500 });
  }
}

const optionSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1),
  value: z.string().length(1),
});

const questionSchema = z.object({
  id: z.string().optional(),
  order: z.number().int().min(1).max(4),
  title: z.string().min(1),
  axis: z.string().min(1),
  options: z.tuple([optionSchema, optionSchema]),
});

const updateSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  intro: z.string().min(1),
  questions: z.array(questionSchema).length(4),
});

// PUT /api/tests/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    let body: unknown;

    try {
      body = await req.json();
    } catch (jsonErr) {
      console.error('[PUT /api/tests/[id]] Invalid JSON body:', jsonErr);
      return NextResponse.json({ error: 'صيغة JSON غير صحيحة' }, { status: 400 });
    }

    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'بيانات غير صحيحة', details: parsed.error.flatten() }, { status: 400 });
    }

    const { title, slug, intro, questions } = parsed.data;

    // Check slug uniqueness (excluding self)
    if (isSlugTaken(slug, id)) {
      return NextResponse.json({ error: 'هذا الرابط مستخدم بالفعل' }, { status: 409 });
    }

    const test = updateTest(id, { title, slug, intro, questions });

    if (!test) {
      return NextResponse.json({ error: 'الاختبار غير موجود' }, { status: 404 });
    }

    return NextResponse.json(test);
  } catch (err) {
    console.error('[PUT /api/tests/[id]]', err);
    return NextResponse.json({ error: 'فشل تحديث الاختبار' }, { status: 500 });
  }
}

// DELETE /api/tests/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const deleted = deleteTest(id);
    if (!deleted) return NextResponse.json({ error: 'الاختبار غير موجود' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[DELETE /api/tests/[id]]', err);
    return NextResponse.json({ error: 'فشل حذف الاختبار' }, { status: 500 });
  }
}
