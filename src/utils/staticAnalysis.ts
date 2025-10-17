import { parse } from 'acorn';
import { walk } from 'estree-walker';
import { CodeMetrics } from '../types';

export interface StaticAnalysisResult {
    functionCount: number;
    loopCount: number;
    variableCount: number;
}

export function analyzeCode(code: string): StaticAnalysisResult {
    const result: StaticAnalysisResult = {
        functionCount: 0,
        loopCount: 0,
        variableCount: 0,
    };

    try {
        const ast = parse(code, { ecmaVersion: 'latest', sourceType: 'module' });

        walk(ast as any, {
            enter(node) {
                if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression' || node.type === 'ArrowFunctionExpression') {
                    result.functionCount++;
                } else if (node.type === 'ForStatement' || node.type === 'WhileStatement' || node.type === 'DoWhileStatement' || node.type === 'ForOfStatement' || node.type === 'ForInStatement') {
                    result.loopCount++;
                } else if (node.type === 'VariableDeclaration') {
                    result.variableCount += node.declarations.length;
                }
            },
        });
    } catch (error) {
        console.error('Error parsing code:', error);
    }

    return result;
}

export function staticAnalyze(code: string): CodeMetrics {
  const cleaned = code.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
  const functionRegexes = [
    /\bfunction\s+\w+\s*\(/g,
    /\b(?:const|let|var)\s+\w+\s*=\s*\([^)]*\)\s*=>/g,
    /\b(?:const|let|var)\s+\w+\s*=\s*async\s*\([^)]*\)\s*=>/g
  ];
  const loopRegexes = [/\bfor\s*\(/g, /\bwhile\s*\(/g, /\bdo\s*\{/g];
  const variableRegex = /\b(?:const|let|var)\s+\w+/g;

  const functions = functionRegexes.reduce((acc, r) => acc + (cleaned.match(r)?.length || 0), 0);
  const loops = loopRegexes.reduce((acc, r) => acc + (cleaned.match(r)?.length || 0), 0);
  const variables = cleaned.match(variableRegex)?.length || 0;

  return { functions, loops, variables };
}