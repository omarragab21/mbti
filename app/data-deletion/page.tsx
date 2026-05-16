import type { Metadata } from 'next';
import AppShell from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'Data Deletion | MBTI Chatbot',
  description: 'How to request data deletion for the MBTI WhatsApp chatbot and web app.',
};

export default function DataDeletionPage() {
  return (
    <AppShell maxWidth="md">
      <article
        dir="ltr"
        className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-left text-slate-200 shadow-2xl backdrop-blur-xl sm:p-8"
      >
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-200">Data Deletion</p>
        <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">Data Deletion Request</h1>
        <p className="mt-3 text-sm text-slate-400">Last updated: May 16, 2026</p>

        <div className="mt-8 space-y-8 text-base leading-8">
          <section>
            <h2 className="text-xl font-bold text-white">How to request deletion</h2>
            <p className="mt-3">
              You can request deletion of your MBTI chatbot data by emailing the app owner at{' '}
              <a className="font-bold text-blue-200 underline" href="mailto:ragabomar453@gmail.com">
                ragabomar453@gmail.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">What to include</h2>
            <p className="mt-3">
              Send your WhatsApp phone number and clearly write that you want your data deleted.
            </p>
            <p className="mt-3">
              Example: "Please delete my MBTI chatbot data for this WhatsApp number."
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">What happens next</h2>
            <p className="mt-3">
              After receiving your request, the app owner will review the request and delete data
              connected to your WhatsApp number when possible.
            </p>
          </section>
        </div>
      </article>
    </AppShell>
  );
}
