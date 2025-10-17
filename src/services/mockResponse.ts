// This file provides a mock response for the LLM integration, used when the actual API cannot be called.

export const mockLLMResponse = {
    summary: "This code defines a function that calculates the factorial of a number using recursion.",
    functionsCount: 1,
    loopsCount: 0,
    variablesCount: 2,
};

export function mockSummary(code: string): string {
  const trimmed = code.slice(0, 200).replace(/\s+/g, ' ');
  return `This code appears to perform operations involving: ${inferTopics(code)}. Snippet: "${trimmed}..."`;
}

function inferTopics(code: string): string {
  const topics: string[] = [];
  if (/fetch|axios/i.test(code)) topics.push('HTTP requests');
  if (/React|useState|useEffect/.test(code)) topics.push('React state/effects');
  if (/class\s+\w+/.test(code)) topics.push('classes');
  if (/async|await/.test(code)) topics.push('async operations');
  return topics.length ? topics.join(', ') : 'general JS/TS logic';
}