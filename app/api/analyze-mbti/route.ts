import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getOpenAIClient, OPENAI_MODEL } from '@/lib/openai';
import { buildMBTIPrompt, MBTI_MAP, getFallbackAnalysis } from '@/lib/mbti';

const schema = z.object({
  type: z.string().length(4).refine((t) => t.toUpperCase() in MBTI_MAP, {
    message: 'نمط MBTI غير صحيح',
  }),
  title: z.string().min(1),
  resultId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    let body: unknown;

    try {
      body = await req.json();
    } catch (jsonErr: unknown) {
      console.error('[analyze-mbti] Invalid JSON body:', jsonErr);
      return NextResponse.json({ error: 'صيغة JSON غير صحيحة' }, { status: 400 });
    }

    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'بيانات غير صحيحة', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { type, title } = parsed.data;
    const openai = getOpenAIClient();
    let analysis: string;

    if (!openai) {
      console.error('[analyze-mbti] Missing OPENAI_API_KEY; using fallback analysis');
      analysis = getFallbackAnalysis(type);
    } else {
      try {
        const prompt = buildMBTIPrompt(type.toUpperCase(), title);
        const response = await openai.responses.create({
          model: OPENAI_MODEL,
          input: prompt,
        });
        analysis = response.output_text?.trim() || getFallbackAnalysis(type);
      } catch (aiErr: unknown) {
        // On quota / rate-limit / network errors use local fallback silently.
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
    }

    return NextResponse.json({ analysis });
  } catch (err: unknown) {
    console.error('[analyze-mbti] Error:', err);
    return NextResponse.json({ error: 'حدث خطأ داخلي في الخادم' }, { status: 500 });
  }
}
