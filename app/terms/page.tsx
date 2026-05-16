import type { Metadata } from 'next';
import AppShell from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'Terms of Use | MBTI Chatbot',
  description: 'Terms of use for the Arabic and English MBTI WhatsApp chatbot and web app.',
};

export default function TermsPage() {
  return (
    <AppShell maxWidth="md">
      <article
        dir="ltr"
        className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-left text-slate-200 shadow-2xl backdrop-blur-xl sm:p-8"
      >
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-200">Terms of Use</p>
        <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">Terms of Use</h1>
        <p className="mt-3 text-sm text-slate-400">Last updated: May 16, 2026</p>

        <div className="mt-8 space-y-8 text-base leading-8">
          <section>
            <h2 className="text-xl font-bold text-white">Purpose of the app</h2>
            <p className="mt-3">
              This app provides a quick MBTI-style personality test through WhatsApp and the web. The
              test is for informational and entertainment purposes only.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">No professional advice</h2>
            <p className="mt-3">
              The app does not provide medical, psychological, legal, financial, or other
              professional advice.
            </p>
            <p className="mt-3">
              You should not use the result to make important decisions about health, work,
              education, relationships, or any other serious matter.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">Test results</h2>
            <p className="mt-3">
              The result is not absolute. It is a simple MBTI-style estimate based on only 4
              questions, so it may be incomplete or inaccurate.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">Acceptable use</h2>
            <p className="mt-3">
              Please use the app only for lawful purposes. Do not try to misuse, attack, reverse
              engineer, or interrupt the app or its services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">Contact</h2>
            <p className="mt-3">
              For questions about these terms, contact{' '}
              <a className="font-bold text-blue-200 underline" href="mailto:ragabomar453@gmail.com">
                ragabomar453@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </article>
    </AppShell>
  );
}
