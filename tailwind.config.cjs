module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        panel: '#18222d',
      },
      boxShadow: {
        soft: '0 2px 6px -1px rgba(0,0,0,0.3)',
      },
      fontFamily: {
        sans: ['system-ui','-apple-system','Segoe UI','Roboto','sans-serif'],
        mono: ['ui-monospace','Menlo','Consolas','monospace'],
      },
    },
  },
  plugins: [],
};
