export interface CodeMetrics {
    functions: number;
    loops: number;
    variables: number;
}

export interface AnalysisResult {
    summary: string;
    metrics: CodeMetrics;
}

export interface AnalysisState {
    code: string;
    loading: boolean;
    error: string | null;
    result: AnalysisResult | null;
}

export interface CodeAnalysisResult {
    summary: string;
    functionCount: number;
    loopCount: number;
    variableCount: number;
}

export interface CodeInputProps {
    onCodeChange: (code: string) => void;
    code: string;
}

export interface AnalysisResultProps {
    analysisResult: CodeAnalysisResult;
    loading: boolean;
    error: string | null;
}

export interface StatsCardProps {
    functionCount: number;
    loopCount: number;
    variableCount: number;
}