import React from 'react';
import { AnalysisResult as AR } from '../../types';
import { StatsCard } from '../StatsCard';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { duotoneSpace } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Props {
  loading: boolean;
  error: string | null;
  result: AR | null;
  code: string;
}

export const AnalysisResult: React.FC<Props> = ({ loading, error, result, code }) => {
  if (loading) return <p>Analyzing...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!result) return null;
  return (
    <div style={{ marginTop: '1rem' }}>
      <h3>Summary</h3>
      <p>{result.summary}</p>
      <h3>Metrics</h3>
      <StatsCard metrics={result.metrics} />
      <h3>Code</h3>
      <SyntaxHighlighter language="typescript" style={duotoneSpace}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
};