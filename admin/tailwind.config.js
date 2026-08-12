/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1E3A8A",
        secondary: "white",
        B: "black",
        G: "#5E5E5E",
        br: "#f87171", // red-400 equivalent
      },
    },
  },
  plugins: [],
};
