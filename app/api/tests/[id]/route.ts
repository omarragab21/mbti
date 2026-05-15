import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// GET /api/tests/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const test = await prisma.test.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          include: { options: { orderBy: { value: 'asc' } } },
        },
      },
    });
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
    const existing = await prisma.test.findFirst({ where: { slug, NOT: { id } } });
    if (existing) {
      return NextResponse.json({ error: 'هذا الرابط مستخدم بالفعل' }, { status: 409 });
    }

    // Delete old questions/options and recreate
    await prisma.question.deleteMany({ where: { testId: id } });

    const test = await prisma.test.update({
      where: { id },
      data: {
        title,
        slug,
        intro,
        questions: {
          create: questions.map((q) => ({
            order: q.order,
            title: q.title,
            axis: q.axis,
            options: {
              create: q.options.map((o) => ({ label: o.label, value: o.value })),
            },
          })),
        },
      },
      include: { questions: { include: { options: true } } },
    });

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
    await prisma.test.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[DELETE /api/tests/[id]]', err);
    return NextResponse.json({ error: 'فشل حذف الاختبار' }, { status: 500 });
  }
}
