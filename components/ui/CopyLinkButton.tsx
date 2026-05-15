'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import SecondaryButton from './SecondaryButton';

interface CopyLinkButtonProps {
  text: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
}

export default function CopyLinkButton({
  text,
  label = 'نسخ الرابط',
  copiedLabel = 'تم النسخ',
  className = '',
}: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <SecondaryButton
      onClick={handleCopy}
      className={`w-full ${copied ? 'border-emerald-400/60 bg-emerald-400/10 text-emerald-200' : ''} ${className}`}
      size="lg"
      disabled={!text}
    >
      <span className="inline-flex items-center justify-center gap-2">
        {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
        {copied ? copiedLabel : label}
      </span>
    </SecondaryButton>
  );
}
