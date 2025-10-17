import { countFunctions, countLoops, countVariables } from '../utils/codeMetrics';

describe('Code Metrics Utility Functions', () => {
  const sampleCode = `
    function exampleFunction() {
      for (let i = 0; i < 10; i++) {
        console.log(i);
      }
      const x = 5;
      const y = 10;
      return x + y;
    }
  `;

  test('countFunctions should return the correct number of functions', () => {
    const result = countFunctions(sampleCode);
    expect(result).toBe(1);
  });

  test('countLoops should return the correct number of loops', () => {
    const result = countLoops(sampleCode);
    expect(result).toBe(1);
  });

  test('countVariables should return the correct number of variables', () => {
    const result = countVariables(sampleCode);
    expect(result).toBe(2);
  });

  test('countFunctions should return 0 for code without functions', () => {
    const result = countFunctions('const a = 5;');
    expect(result).toBe(0);
  });

  test('countLoops should return 0 for code without loops', () => {
    const result = countLoops('const a = 5;');
    expect(result).toBe(0);
  });

  test('countVariables should return 0 for code without variables', () => {
    const result = countVariables('function noVariables() {}');
    expect(result).toBe(0);
  });
});