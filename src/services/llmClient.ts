/// <reference types="vite/client" />

const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

interface LLMResponse { summary: string; }

export async function summarizeCode(code: string): Promise<LLMResponse> {
  const snippet = code.slice(0, 6000);
  if (!OPENAI_KEY) {
    return { summary: 'LLM key missing. Using mock.' };
  }
  try {
    const body = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'user', content: `Summarize this code briefly (purpose, side effects, inputs/outputs). If incomplete, note assumptions.\n\n${snippet}` }
      ],
      temperature: 0.2,
      max_tokens: 120
    };
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${OPENAI_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`LLM error ${res.status}: ${text.slice(0, 200)}`);
    }
    const json = await res.json();
    const summary = json.choices?.[0]?.message?.content?.trim() || 'No summary';
    return { summary };
  } catch (e: any) {
    return { summary: `LLM failed: ${e?.message || 'Unknown error'}. Using fallback.` };
  }
}