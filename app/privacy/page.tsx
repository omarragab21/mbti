import type { Metadata } from 'next';
import AppShell from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'Privacy Policy | MBTI Chatbot',
  description: 'Privacy policy for the Arabic and English MBTI WhatsApp chatbot and web app.',
};

export default function PrivacyPage() {
  return (
    <AppShell maxWidth="md">
      <article
        dir="ltr"
        className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-left text-slate-200 shadow-2xl backdrop-blur-xl sm:p-8"
      >
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-200">Privacy Policy</p>
        <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">Privacy Policy</h1>
        <p className="mt-3 text-sm text-slate-400">Last updated: May 16, 2026</p>

        <div className="mt-8 space-y-8 text-base leading-8">
          <section>
            <h2 className="text-xl font-bold text-white">About this app</h2>
            <p className="mt-3">
              This app is an Arabic and English MBTI-style WhatsApp chatbot and web app. It provides
              a quick personality test and a short personality analysis.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">Information we collect</h2>
            <p className="mt-3">
              We collect your WhatsApp phone number or WhatsApp ID (wa_id) only to run the MBTI
              chatbot, send test questions, and return your result.
            </p>
            <p className="mt-3">
              Users answer 4 MBTI questions. We may store the answers and result so the app can
              provide the test and analysis.
            </p>
            <p className="mt-3">We do not collect payment data.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">How we use information</h2>
            <p className="mt-3">
              We use your data only to provide the MBTI-style test, process your answers, and show or
              send your personality analysis.
            </p>
            <p className="mt-3">
              The app may use OpenAI to generate a personality analysis based on your answers and
              test result.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">Sharing and selling data</h2>
            <p className="mt-3">We do not sell user data.</p>
            <p className="mt-3">
              We do not use your data for advertising. We only share data with service providers when
              needed to run the app, such as WhatsApp services or OpenAI analysis.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">Data deletion</h2>
            <p className="mt-3">
              You can request deletion of your data by contacting the app owner at{' '}
              <a className="font-bold text-blue-200 underline" href="mailto:ragabomar453@gmail.com">
                ragabomar453@gmail.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">Contact</h2>
            <p className="mt-3">
              For privacy questions, contact:{' '}
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
