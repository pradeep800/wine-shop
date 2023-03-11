/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    screens: {
      sm: { max: "500px" },
      md: { max: "768px" },
      lg: { max: "1024px" },
      xl: { max: "1280px" },
    },
    animation: {
      l1: "big .6s ease-in-out alternate infinite",
      l2: "big .6s ease-in-out alternate .2s infinite",
      l3: "big .6s ease-in-out alternate .4s infinite",
    },
    keyframes: {
      big: {
        "100%": { transform: "scale(2)" },
      },
    },
  },
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  plugins: [],
};
