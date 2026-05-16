export async function sendWhatsAppMessage(to: string, message: string): Promise<void> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    console.error(
      '[whatsapp] Missing WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID environment variable'
    );
    return;
  }

  try {
    const response = await fetch(`https://graph.facebook.com/v25.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: {
          body: message,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[whatsapp] Cloud API error:', response.status, errorText);
      return;
    }

    console.info('[whatsapp] Message sent successfully:', {
      to: maskWhatsAppId(to),
      status: response.status,
    });
  } catch (err: unknown) {
    console.error('[whatsapp] Failed to send message:', err);
  }
}

function maskWhatsAppId(id: string): string {
  if (id.length <= 4) {
    return '****';
  }

  return `${'*'.repeat(Math.max(id.length - 4, 0))}${id.slice(-4)}`;
}
