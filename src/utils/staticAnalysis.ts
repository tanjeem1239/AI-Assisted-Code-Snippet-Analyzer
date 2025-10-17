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
  // Remove single-line and block comments
  const cleaned = code
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '');

  // Function patterns: declarations, exported, arrows (async, typed, return type, single param)
  const functionPatterns = [
    /\b(?:export\s+)?function\s+\w+\s*\(/g,
    /\b(?:export\s+)?(?:const|let|var)\s+\w+(?:\s*:\s*[^=]+)?\s*=\s*(?:async\s*)?\([^)]*\)\s*(?::\s*[^=]+)?\s*=>/g, // arrow with parens & optional return type
    /\b(?:export\s+)?(?:const|let|var)\s+\w+(?:\s*:\s*[^=]+)?\s*=\s*(?:async\s*)?\w+\s*(?::\s*[^=]+)?\s*=>/g // single param arrow w/ optional return type
  ];
  const functionCount = functionPatterns.reduce((acc, r) => acc + (cleaned.match(r)?.length || 0), 0);

  // Loop patterns (none in provided snippet, but comprehensive)
  const loopPatterns = [
    /\bfor\s*\(/g,
    /\bwhile\s*\(/g,
    /\bdo\s*\{/g,
    /\bfor\s*\([^)]*\bof\b[^)]*\)/g,
    /\bfor\s*\([^)]*\bin\b[^)]*\)/g
  ];
  const loopCount = loopPatterns.reduce((acc, r) => acc + (cleaned.match(r)?.length || 0), 0);

  // Variable declarations (include optional export; stop at '=' or ';')
  const varDeclRegex = /\b(?:export\s+)?(?:const|let|var)\s+([^=;]+)(?==|;)/g;
  let variableCount = 0;
  const reserved = new Set(['const','let','var','as','from','type','interface']);
  let match: RegExpExecArray | null;
  while ((match = varDeclRegex.exec(cleaned)) !== null) {
    const segment = match[1].trim();
    if (!segment) continue;
    // Split top-level commas (not inside brackets)
    let depthParen = 0, depthBrace = 0, depthBracket = 0, current = '', parts: string[] = [];
    for (const ch of segment) {
      if (ch === '(') depthParen++; else if (ch === ')') depthParen = Math.max(0, depthParen - 1);
      else if (ch === '{') depthBrace++; else if (ch === '}') depthBrace = Math.max(0, depthBrace - 1);
      else if (ch === '[') depthBracket++; else if (ch === ']') depthBracket = Math.max(0, depthBracket - 1);
      if (ch === ',' && depthParen === 0 && depthBrace === 0 && depthBracket === 0) { parts.push(current); current=''; }
      else current += ch;
    }
    if (current) parts.push(current);

    for (let raw of parts) {
      let left = raw.trim();
      if (!left) continue;
      // remove type annotations (colon not inside braces/brackets)
      const colonIdx = left.indexOf(':');
      if (colonIdx !== -1 && !left.slice(0, colonIdx).includes('{') && !left.slice(0, colonIdx).includes('[')) {
        left = left.slice(0, colonIdx).trim();
      }
      if (!left) continue;
      if (left.startsWith('{') || left.startsWith('[')) {
        const ids = left.match(/[A-Za-z_$][\w$]*/g) || [];
        for (const id of ids) if (!reserved.has(id)) variableCount++;
      } else {
        const id = left.match(/^[A-Za-z_$][\w$]*/);
        if (id && !reserved.has(id[0])) variableCount++;
      }
    }
  }

  return { functions: functionCount, loops: loopCount, variables: variableCount };
}