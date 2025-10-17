import React from 'react';
import { useCodeAnalysis } from './hooks/useCodeAnalysis';
import { CodeInput } from './components/CodeInput';
import { AnalysisResult } from './components/AnalysisResult';
import './styles/globals.css';

const App: React.FC = () => {
  const { state, setCode, analyze } = useCodeAnalysis();
  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '1rem' }}>
      <h1>AI-Assisted Code Snippet Analyzer</h1>
      <CodeInput
        value={state.code}
        onChange={setCode}
        onAnalyze={analyze}
        disabled={!state.code.trim() || state.loading}
      />
      <AnalysisResult
        loading={state.loading}
        error={state.error}
        result={state.result}
        code={state.code}
      />
    </div>
  );
};

export default App;