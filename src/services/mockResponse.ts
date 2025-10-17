// This file provides a mock response for the LLM integration, used when the actual API cannot be called.

export const mockLLMResponse = {
    summary: "This code defines a function that calculates the factorial of a number using recursion.",
    functionsCount: 1,
    loopsCount: 0,
    variablesCount: 2,
};

export function mockSummary(code: string): string {
  const cleaned = code.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
  const topics = inferTopics(cleaned);
  const hasAsync = /\basync\b|\bawait\b/.test(cleaned);
  const hasClasses = /\bclass\s+\w+/.test(cleaned);
  const hasExports = /\bexport\b/.test(cleaned);
  const hasImports = /\bimport\b/.test(cleaned);
  const focus = hasClasses ? 'defines one or more classes' : /function\s+\w+/.test(cleaned) ? 'implements function logic' : 'contains general logic';
  return `Brief Summary: The code ${focus} related to ${topics}. ${hasAsync ? 'It uses async/await patterns. ' : ''}${hasImports ? 'Imports are present. ' : ''}${hasExports ? 'It exports symbols. ' : ''}`;
}

function inferTopics(code: string): string {
  const topics: string[] = [];
  if (/fetch|axios/i.test(code)) topics.push('HTTP requests');
  if (/React|useState|useEffect/.test(code)) topics.push('React state or lifecycle');
  if (/class\s+\w+/.test(code)) topics.push('class-based structures');
  if (/async|await/.test(code)) topics.push('asynchronous operations');
  if (/interface\s+\w+|type\s+\w+\s*=/.test(code)) topics.push('TypeScript type definitions');
  return topics.length ? topics.join(', ') : 'general JS/TS logic';
}