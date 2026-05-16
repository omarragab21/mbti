import OpenAI from 'openai';

export function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (!apiKey) {
    return null;
  }

  return new OpenAI({ apiKey });
}

export const OPENAI_MODEL = process.env.OPENAI_MODEL?.trim() || 'gpt-4.1-mini';
