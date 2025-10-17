import React from 'react';
import { useCodeAnalysis } from './hooks/useCodeAnalysis';
import { CodeInput } from './components/CodeInput';
import { AnalysisResult } from './components/AnalysisResult';
import './styles/globals.css';

const App: React.FC = () => {
  const { state, setCode, analyze } = useCodeAnalysis();
  return (
    <div className="app-shell">
      <div className="flex items-center justify-between mb-4">
        <h1 className="app-title m-0">AI-Assisted Code Snippet Analyzer</h1>
        <button className="primary my-2" onClick={analyze} disabled={!state.code.trim() || state.loading}>{state.loading ? 'Analyzing…' : 'Analyze'}</button>
      </div>
      <div className="layout-row">
        <div className="panel-col">
          <CodeInput
            value={state.code}
            onChange={setCode}
            disabled={state.loading}
          />
          {state.result && state.code !== state.analyzedCode && (
            <p className="text-xs mt-2 opacity-70">Code changed since last analysis. Press Analyze to update.</p>
          )}
        </div>
        <div className="panel-col">
          <AnalysisResult
            loading={state.loading}
            error={state.error}
            result={state.result}
            code={state.analyzedCode}
          />
        </div>
      </div>
    </div>
  );
};

export default App;