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

## Styling
Tailwind CSS integrated. Utility classes available in components. Custom variables coexist with Tailwind.

### Tailwind Setup
Make sure to install dependencies:
```
npm install tailwindcss postcss autoprefixer
```
Then restart `npm run dev`. Tailwind directives live in `src/styles/globals.css`.

### Adding Styles
Use utility classes directly or extend in tailwind.config.js. Global custom classes in globals.css.

## Notes
Client calls OpenAI directly; for production use a backend proxy.

### Behavior
Editing code does not update displayed analyzed snippet until Analyze is clicked; previous analysis snapshot retained.