import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { MBTI_MAP } from '@/lib/mbti';

const schema = z.object({
  testId: z.string().min(1),
  mbtiType: z.string().length(4).refine((t) => t in MBTI_MAP),
  mbtiTitle: z.string().min(1),
  answersJson: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    let body: unknown;

    try {
      body = await req.json();
    } catch (jsonErr) {
      console.error('[POST /api/results] Invalid JSON body:', jsonErr);
      return NextResponse.json({ error: 'صيغة JSON غير صحيحة' }, { status: 400 });
    }

    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'بيانات غير صحيحة' }, { status: 400 });
    }

    const result = await prisma.result.create({
      data: parsed.data,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error('[POST /api/results]', err);
    return NextResponse.json({ error: 'فشل حفظ النتيجة' }, { status: 500 });
  }
}
