import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { openai, OPENAI_MODEL } from '@/lib/openai';
import { buildMBTIPrompt, MBTI_MAP, getFallbackAnalysis } from '@/lib/mbti';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  type: z.string().length(4).refine((t) => t.toUpperCase() in MBTI_MAP, {
    message: 'نمط MBTI غير صحيح',
  }),
  title: z.string().min(1),
  resultId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'بيانات غير صحيحة', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { type, title, resultId } = parsed.data;

    let analysis: string;

    try {
      const prompt = buildMBTIPrompt(type.toUpperCase(), title);
      const response = await openai.responses.create({
        model: OPENAI_MODEL,
        input: prompt,
      });
      analysis = response.output_text?.trim() || getFallbackAnalysis(type);
    } catch (aiErr: unknown) {
      // On quota / rate-limit / network errors → use local fallback silently
      const isQuotaError =
        aiErr instanceof Error &&
        (aiErr.message.includes('429') ||
          aiErr.message.includes('insufficient_quota') ||
          aiErr.message.includes('rate_limit'));
      if (!isQuotaError) {
        console.error('[analyze-mbti] OpenAI error:', aiErr);
      }
      analysis = getFallbackAnalysis(type);
    }

    // Persist analysis to DB if we have a result ID
    if (resultId) {
      await prisma.result.update({
        where: { id: resultId },
        data: { aiAnalysis: analysis },
      });
    }

    return NextResponse.json({ analysis });
  } catch (err: unknown) {
    console.error('[analyze-mbti] Error:', err);
    const msg = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

