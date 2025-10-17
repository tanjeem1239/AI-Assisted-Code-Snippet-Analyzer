import React, { createContext, useContext, useState } from 'react';

interface AnalysisContextType {
  code: string;
  setCode: (code: string) => void;
  analysisResult: string | null;
  setAnalysisResult: (result: string | null) => void;
  stats: {
    functions: number;
    loops: number;
    variables: number;
  };
  setStats: (stats: { functions: number; loops: number; variables: number }) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const AnalysisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [code, setCode] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [stats, setStats] = useState<{ functions: number; loops: number; variables: number }>({
    functions: 0,
    loops: 0,
    variables: 0,
  });

  return (
    <AnalysisContext.Provider value={{ code, setCode, analysisResult, setAnalysisResult, stats, setStats }}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = (): AnalysisContextType => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};

// Reserved for future context implementation (not required now).
export {};