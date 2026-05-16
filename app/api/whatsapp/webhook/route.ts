import { after, NextRequest, NextResponse } from 'next/server';
import { sendWhatsAppMessage } from '@/lib/whatsapp';

type IncomingTextMessage = {
  from: string;
  body: string;
};

const START_MESSAGE = `أهلًا بك في اختبار MBTI السريع 👋

سأطرح عليك ٤ أسئلة فقط.
جاوب برقم 1 أو 2.

السؤال 1 من 4:
كيف تكتسب طاقتك غالبًا؟

1. اجتماعي
2. هادئ`;

const DEFAULT_MESSAGE = `تم استلام رسالتك ✅

لبدء اختبار MBTI اكتب:
ابدأ`;

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

  if (!mode && !token && !challenge) {
    console.info('[whatsapp-webhook] Health check opened normally');
    return NextResponse.json({
      status: 'ok',
      message: 'WhatsApp webhook is running',
    });
  }

  if (!verifyToken) {
    console.error('[whatsapp-webhook] Missing WHATSAPP_VERIFY_TOKEN environment variable');
    return NextResponse.json({ error: 'Missing WHATSAPP_VERIFY_TOKEN' }, { status: 500 });
  }

  if (mode === 'subscribe' && token === verifyToken && challenge) {
    console.info('[whatsapp-webhook] Verification succeeded');
    return new Response(challenge, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }

  console.warn('[whatsapp-webhook] Verification failed:', {
    mode,
    hasToken: Boolean(token),
    hasChallenge: Boolean(challenge),
  });

  return NextResponse.json(
    { error: 'Forbidden', reason: 'Invalid verify token or mode' },
    { status: 403 }
  );
}

export async function POST(req: NextRequest) {
  try {
    let payload: unknown;

    try {
      payload = await req.json();
    } catch (jsonErr: unknown) {
      console.error('[whatsapp-webhook] Invalid JSON body:', jsonErr);
      return NextResponse.json({ received: true });
    }

    const messages = extractIncomingTextMessages(payload);

    if (messages.length > 0) {
      console.info('[whatsapp-webhook] Received text messages:', {
        count: messages.length,
      });

      after(async () => {
        for (const message of messages) {
          const isStart = isStartCommand(message.body);
          const reply = isStart ? START_MESSAGE : DEFAULT_MESSAGE;

          console.info('[whatsapp-webhook] Handling message:', {
            from: maskWhatsAppId(message.from),
            isStartCommand: isStart,
          });

          await sendWhatsAppMessage(message.from, reply);
        }
      });
    } else {
      console.info('[whatsapp-webhook] Received webhook without text messages');
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    console.error('[whatsapp-webhook] POST error:', err);
    return NextResponse.json({ received: true });
  }
}

function extractIncomingTextMessages(payload: unknown): IncomingTextMessage[] {
  const messages: IncomingTextMessage[] = [];

  if (!isRecord(payload) || !Array.isArray(payload.entry)) {
    return messages;
  }

  for (const entry of payload.entry) {
    if (!isRecord(entry) || !Array.isArray(entry.changes)) {
      continue;
    }

    for (const change of entry.changes) {
      if (!isRecord(change) || !isRecord(change.value) || !Array.isArray(change.value.messages)) {
        continue;
      }

      for (const message of change.value.messages) {
        if (!isRecord(message)) {
          continue;
        }

        if (message.type !== 'text' || typeof message.from !== 'string') {
          continue;
        }

        if (!isRecord(message.text) || typeof message.text.body !== 'string') {
          continue;
        }

        messages.push({
          from: message.from,
          body: message.text.body.trim(),
        });
      }
    }
  }

  return messages;
}

function isStartCommand(body: string): boolean {
  const normalizedBody = body.trim().toLowerCase();
  return normalizedBody === 'ابدأ' || normalizedBody === 'start' || normalizedBody === 'اختبار';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function maskWhatsAppId(id: string): string {
  if (id.length <= 4) {
    return '****';
  }

  return `${'*'.repeat(Math.max(id.length - 4, 0))}${id.slice(-4)}`;
}
