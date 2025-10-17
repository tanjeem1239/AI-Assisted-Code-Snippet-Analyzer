export const API_URL = 'https://api.example.com/llm'; // Replace with actual LLM API URL
export const MAX_CODE_LENGTH = 5000; // Maximum length for code input
export const DEFAULT_LANGUAGE = 'typescript'; // Default language for analysis
export const ANALYSIS_TIMEOUT = 5000; // Timeout for analysis requests in milliseconds
export const ERROR_MESSAGES = {
    EMPTY_INPUT: 'Code input cannot be empty.',
    API_ERROR: 'An error occurred while communicating with the LLM API.',
    TIMEOUT_ERROR: 'The analysis request timed out. Please try again.',
};
export const APP_NAME = 'AI-Assisted Code Snippet Analyzer';