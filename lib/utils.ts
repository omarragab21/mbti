/** Generate a random cuid-like slug */
export function generateSlug(prefix = 'test'): string {
  const rand = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${rand}`;
}

/** Format date to Arabic-friendly locale string */
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** Build WhatsApp share URL */
export function buildWhatsAppUrl(mbtiType: string, mbtiTitle: string, testUrl: string): string {
  const message = `نتيجتي في اختبار MBTI السريع هي: ${mbtiType} — ${mbtiTitle}\nجرب الاختبار من هنا:\n${testUrl}`;
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

/** Truncate text to a max length */
export function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max) + '...' : text;
}
