'use client';

import { buildWhatsAppUrl } from '@/lib/utils';
import CopyLinkButton from './ui/CopyLinkButton';
import WhatsAppShareButton from './ui/WhatsAppShareButton';

interface ShareButtonsProps {
  mbtiType: string;
  mbtiTitle: string;
  testUrl: string;
}

export default function ShareButtons({
  mbtiType,
  mbtiTitle,
  testUrl,
}: ShareButtonsProps) {
  const whatsappUrl = buildWhatsAppUrl(mbtiType, mbtiTitle, testUrl);
  const shareText = `نتيجتي في اختبار MBTI السريع هي: ${mbtiType} - ${mbtiTitle}\nجرب الاختبار من هنا:\n${testUrl}`;

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-white/5 bg-black/30 px-5 py-4">
        <div className="mb-1 text-[10px] font-black tracking-widest text-slate-600 uppercase">رابط الاختبار</div>
        <div className="truncate font-mono text-sm text-blue-400/70" dir="ltr">
          {testUrl}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <WhatsAppShareButton href={whatsappUrl} className="w-full" />
        <CopyLinkButton text={shareText} label="نسخ رسالة النتيجة" className="w-full" />
      </div>
    </div>
  );
}
