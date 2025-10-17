import React from 'react';
import { CodeMetrics } from '../../types';

export const StatsCard: React.FC<{ metrics: CodeMetrics }> = ({ metrics }) => (
  <div style={{ display: 'flex', gap: '1rem' }}>
    <Metric label="Functions" value={metrics.functions} />
    <Metric label="Loops" value={metrics.loops} />
    <Metric label="Variables" value={metrics.variables} />
  </div>
);

const Metric: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: 6 }}>
    <strong>{label}</strong>
    <div>{value}</div>
  </div>
);