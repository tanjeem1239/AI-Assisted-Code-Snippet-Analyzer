import { useState, useCallback } from 'react';
import { AnalysisState } from '../types';
import { staticAnalyze } from '../utils/staticAnalysis';
import { summarizeCode } from '../services/llmClient';
import { mockSummary } from '../services/mockResponse';

export function useCodeAnalysis() {
  const [state, setState] = useState<AnalysisState>({
    code: '',
    loading: false,
    error: null,
    result: null
  });

  const setCode = useCallback((code: string) => {
    setState(s => ({ ...s, code }));
  }, []);

  const analyze = useCallback(async () => {
    if (!state.code.trim()) {
      setState(s => ({ ...s, error: 'Code is empty.' }));
      return;
    }
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const metrics = staticAnalyze(state.code);
      const llm = await summarizeCode(state.code);
      const summary = llm.summary.includes('LLM key missing') ? mockSummary(state.code) : llm.summary;
      setState(s => ({ ...s, loading: false, result: { summary, metrics } }));
    } catch (e: any) {
      setState(s => ({ ...s, loading: false, error: e.message || 'Unknown error' }));
    }
  }, [state.code]);

  return { state, setCode, analyze };
}