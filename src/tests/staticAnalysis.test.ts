import { countFunctions, countLoops, countVariables } from '../utils/staticAnalysis';

describe('Static Analysis Utility Functions', () => {
  test('countFunctions should return the correct number of functions', () => {
    const codeSnippet = `
      function test1() {}
      const test2 = () => {};
      function test3(param) { return param; }
    `;
    const result = countFunctions(codeSnippet);
    expect(result).toBe(3);
  });

  test('countLoops should return the correct number of loops', () => {
    const codeSnippet = `
      for (let i = 0; i < 10; i++) {}
      while (true) {}
      do {} while (false);
    `;
    const result = countLoops(codeSnippet);
    expect(result).toBe(3);
  });

  test('countVariables should return the correct number of variables', () => {
    const codeSnippet = `
      const a = 1;
      let b = 2;
      var c = 3;
      const d = { key: 'value' };
    `;
    const result = countVariables(codeSnippet);
    expect(result).toBe(4);
  });

  test('countFunctions should return 0 for code without functions', () => {
    const codeSnippet = `
      const a = 1;
      let b = 2;
    `;
    const result = countFunctions(codeSnippet);
    expect(result).toBe(0);
  });

  test('countLoops should return 0 for code without loops', () => {
    const codeSnippet = `
      const a = 1;
      let b = 2;
    `;
    const result = countLoops(codeSnippet);
    expect(result).toBe(0);
  });

  test('countVariables should return 0 for empty code', () => {
    const codeSnippet = ``;
    const result = countVariables(codeSnippet);
    expect(result).toBe(0);
  });
});