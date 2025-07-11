/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // --- THIS IS THE NEW COLOR PALETTE ---
      colors: {
        'primary-dark': '#1E2761',  // Midnight Blue
        'primary-light': '#408EC6', // Royal Blue
        'accent-red': '#7A2048',    // Burgundy Red
      }
      // --- END OF NEW PALETTE ---
    },
  },
  plugins: [],
}