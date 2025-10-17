# AI-Assisted Code Snippet Analyzer

React + TypeScript app that summarizes and statically analyzes pasted JS/TS code.

## Features
- LLM summary (OpenAI, mock fallback)
- Static metrics: function, loop, variable counts
- Syntax highlighting
- Loading & error states

## Setup
```bash
npm install
npm run dev
```
Create `.env` with:
```
VITE_OPENAI_API_KEY=your_key_here
```

## Testing
```bash
npm run test
```

## Build
```bash
npm run build
```

## Notes
Client calls OpenAI directly; for production use a backend proxy.