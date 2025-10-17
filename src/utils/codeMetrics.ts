export interface CodeMetrics {
    functionCount: number;
    loopCount: number;
    variableCount: number;
}

export function calculateMetrics(code: string): CodeMetrics {
    const functionCount = (code.match(/function\s+\w+/g) || []).length + (code.match(/(\w+)\s*=\s*function/g) || []).length;
    const loopCount = (code.match(/\b(for|while|do)\b/g) || []).length;
    const variableCount = (code.match(/\b(let|const|var)\s+\w+/g) || []).length;

    return {
        functionCount,
        loopCount,
        variableCount,
    };
}