// === tailwind.config.js ===
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1E40AF',    // Deep Blue
        secondary: '#F59E0B',  // Amber
        accent: '#10B981',     // Emerald
        background: '#F3F4F6', // Gray-100
        surface: '#FFFFFF',    // White
        textPrimary: '#111827',// Gray-900
        textSecondary: '#6B7280'// Gray-500
      },
    },
  },
  plugins: [],
};