import React, { useState } from 'react';
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

// Parse numbered / markdown-ish sections from the LLM summary
function parseSections(summary: string) {
  const sourceMatch = summary.match(/^\[Source:[^\n]+\]/);
  const source = sourceMatch ? sourceMatch[0] : null;
  let body = source ? summary.replace(source, '').trim() : summary;
  // Split heuristic/footer parts
  const footerParts: string[] = [];
  ['Heuristic reinforcement:', 'Structural snapshot:', 'Local Summary:'].forEach(tag => {
    const idx = body.indexOf(tag);
    if (idx !== -1) {
      footerParts.push(body.slice(idx).trim());
      body = body.slice(0, idx).trim();
    }
  });
  const sectionRegex = /\*\*(\d+)\.\s+([^*]+?)\*\*/g;
  const numberedRegex = /^(\d+)\.\s+(.*)$/m;
  const sections: { title: string; content: string }[] = [];
  // Bold numbered sections
  let lastIndex = 0; let match;
  while ((match = sectionRegex.exec(body))) {
    const preceding = body.slice(lastIndex, match.index).trim();
    if (preceding && sections.length) {
      sections[sections.length - 1].content += '\n' + preceding;
    }
    lastIndex = sectionRegex.lastIndex;
    const num = match[1];
    const title = match[2].trim();
    sections.push({ title: `${num}. ${title}`, content: '' });
  }
  const tail = body.slice(lastIndex).trim();
  if (sections.length === 0) {
    // Fallback: lines starting with "1." etc
    const lines = body.split(/\n+/);
    let current: { title: string; content: string } | null = null;
    lines.forEach(l => {
      const nm = l.match(numberedRegex);
      if (nm) {
        current = { title: `${nm[1]}. ${nm[2].trim()}`, content: '' };
        sections.push(current);
      } else if (current) {
        current.content += (current.content ? '\n' : '') + l;
      }
    });
    if (sections.length === 0) sections.push({ title: 'Summary', content: body });
  } else if (tail) {
    sections[sections.length - 1].content += (sections[sections.length - 1].content ? '\n' : '') + tail;
  }
  return { source, sections, footers: footerParts };
}

export const AnalysisResult: React.FC<Props> = ({ loading, error, result, code }) => {
  if (loading) return <p>Analyzing...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!result) return <p className="text-sm opacity-70">No analysis yet. Paste code and click Analyze.</p>;
  const { source, sections, footers } = parseSections(result.summary || '');
  const [showRaw, setShowRaw] = useState(false);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const toggle = (t: string) => setOpen(o => ({ ...o, [t]: !o[t] }));
  const handleCopy = () => {
    navigator.clipboard.writeText(result.summary).catch(() => {});
  };
  return (
    <div className="analysis-result-ui">
      <div className="summary-header">
        <h3 className="m-0">Summary</h3>
        {source && <span className="summary-source badge">{source.replace(/\[|\]/g, '')}</span>}
        <div className="summary-toolbar">
          <button className="btn btn-sm" onClick={handleCopy}>Copy</button>
          <button className="btn btn-sm" onClick={() => setShowRaw(r => !r)}>{showRaw ? 'Structured' : 'Raw'}</button>
        </div>
      </div>
      {!showRaw && (
        <div className="sections-grid">
          {sections.map(s => (
            <div key={s.title} className="analysis-section">
              <div className="section-head" onClick={() => toggle(s.title)} role="button" tabIndex={0}>
                <h4 className="section-title">{s.title}</h4>
                <span className="chevron" data-open={open[s.title]}>▾</span>
              </div>
              {open[s.title] && <p className="section-body whitespace-pre-wrap">{s.content}</p>}
            </div>
          ))}
        </div>
      )}
      {showRaw && (
        <pre className="raw-summary whitespace-pre-wrap">{result.summary}</pre>
      )}
      {footers.length > 0 && !showRaw && (
        <div className="footer-block mt-2">
          {footers.map(f => (
            <p key={f} className="text-xs opacity-70 whitespace-pre-wrap">{f}</p>
          ))}
        </div>
      )}
      <div className="metrics-and-code flex flex-col">
        <div className="metrics-pane">
          <h3 className="pane-title">Metrics</h3>
          <StatsCard metrics={result.metrics} />
        </div>
        <div className="code-pane">
          <h3 className="pane-title">Code</h3>
          <SyntaxHighlighter language="typescript" style={duotoneSpace}>{code}</SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};