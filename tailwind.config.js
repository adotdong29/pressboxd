// tailwind.config.js
module.exports = {
  darkMode: 'class', // Enables dark mode using a class (e.g., <html class="dark">)
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yellow: {
          50: "#fffde7",
          100: "#fff9c4",
          200: "#fff59d",
          300: "#fff176",
          400: "#ffee58",
          500: "#fbbf24", // This is your primary yellow accent
          600: "#f57f17",
          700: "#ef6c00",
          800: "#e65100",
          900: "#bf360c",
        },
      },
    },
  },
  plugins: [],
};
