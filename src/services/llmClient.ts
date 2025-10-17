/// <reference types="vite/client" />
// import { mockSummary } from './mockResponse';

interface LLMResponse { summary: string; }
// Groq configuration
//kept it public for testing, but should be secured in real use
const GROQ_KEY = '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';
const GROQ_MODEL = import.meta.env.VITE_GROQ_MODEL || 'llama-3.1-8b-instant';
const DISABLE_REMOTE = (import.meta.env.VITE_DISABLE_LLM_REMOTE || '').toLowerCase() === 'true';

export async function summarizeCode(code: string): Promise<LLMResponse> {
  const raw = code || '';
  if (!raw.trim()) return { summary: '[Source: none] No code provided.' };
  const snippet = raw.slice(0, 6000);
  if (DISABLE_REMOTE || !GROQ_KEY) return { summary: '[Source: disabled] LLM unavailable.' };
  const prompt = buildPrompt(snippet);
  try {
    const modelText = await groqChat(prompt, GROQ_MODEL);
    const normalized = ensureSections(modelText);
    if (!normalized.trim()) return { summary: '[Source: empty] No content from LLM.' };
    return { summary: `[Source: groq:${GROQ_MODEL}]\n${buildCombined('Groq', GROQ_MODEL, normalized)}` };
  } catch (e: any) {
    console.warn('Groq error:', e?.message);
    return { summary: `[Source: error] Groq failed: ${e?.message || 'Unknown error'}` };
  }
}

async function groqChat(fullPrompt: string, model: string): Promise<string> {
  const url = 'https://api.groq.com/openai/v1/chat/completions';
  const body = {
    model,
    messages: [
      { role: 'system', content: 'You are an expert code explainer.' },
      { role: 'user', content: fullPrompt }
    ],
    max_tokens: 600,
    temperature: 0.2
  };
  console.log('Groq request model:', model, 'chars:', fullPrompt.length);
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GROQ_KEY}` },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const txt = await res.text();
    console.error('Groq HTTP error', res.status, txt.slice(0,200));
    throw new Error(`HTTP ${res.status}: ${txt.slice(0,180)}`);
  }
  const json = await res.json();
  console.log('Groq raw response:', json);
  return json.choices?.[0]?.message?.content || '';
}

function buildPrompt(code: string): string {
  const lines = code.split(/\n/).length;
  const fnNames = Array.from(new Set((code.match(/function\s+(\w+)/g) || []).map(m => m.split(/\s+/)[1]))).slice(0, 6);
  const classNames = Array.from(new Set((code.match(/class\s+(\w+)/g) || []).map(m => m.split(/\s+/)[1]))).slice(0, 4);
  const hasAsync = /\basync\b|\bawait\b/.test(code);
  const hasNetwork = /fetch\(|axios\(|XMLHttpRequest/.test(code);
  const hasSideEffects = /console\.|localStorage\.|sessionStorage\.|process\.|setTimeout\(|setInterval\(/.test(code);
  const meta: string[] = [];
  meta.push(`${lines} lines`);
  if (fnNames.length) meta.push(`functions: ${fnNames.join(', ')}`);
  if (classNames.length) meta.push(`classes: ${classNames.join(', ')}`);
  if (hasAsync) meta.push('async');
  if (hasNetwork) meta.push('network I/O');
  if (hasSideEffects) meta.push('side effects');
  return `Analyze the following JavaScript/TypeScript code and produce a structured explanation with sections:\n1. High-Level Purpose\n2. Key Components (functions/classes)\n3. Data & Control Flow\n4. Side Effects / External Interactions\n5. Potential Issues / Edge Cases\n6. Suggestions for Improvement\n7. One-Sentence Summary\nMetadata: ${meta.join(' | ')}\nCODE START\n${code}\nCODE END`;
}

function ensureSections(text: string): string {
  const t = text.trim();
  const needsStruct = !/High-Level Purpose/i.test(t) || !/Key Components/i.test(t);
  if (!needsStruct) return t;
  // Heuristic split into paragraphs or lines
  const lines = t.split(/\n+/).filter(l => l.trim());
  const purpose = lines.slice(0, 2).join(' ');
  const rest = lines.slice(2).join('\n');
  return `High-Level Purpose\n${purpose}\n\nKey Components\n(Unable to parse components reliably from raw output)\n\nRaw Explanation\n${rest}`;
}

function buildCombined(label: string, model: string, modelText: string /*, code: string */): string {
  // Removed heuristicAddendum & syntheticLLMSummary usage
  return `${label} (${model}) Explanation:\n${modelText.trim()}`;
}

function wait(ms: number) { return new Promise(r => setTimeout(r, ms)); }