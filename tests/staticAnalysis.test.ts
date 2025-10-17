import { describe, it, expect } from 'vitest';
import { staticAnalyze } from '../src/utils/staticAnalysis';

describe('staticAnalyze', () => {
  it('counts functions, loops, variables', () => {
    const code = `\n      function foo() {}\n      const bar = () => {};\n      for (let i=0;i<10;i++) console.log(i);\n      while(false){}\n      const x = 1; let y = 2; var z = 3;\n    `;
    const m = staticAnalyze(code);
    expect(m.functions).toBe(2);
    expect(m.loops).toBe(2);
    expect(m.variables).toBe(5);
  });
});
