/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        netflix: {
          red: "#e50914",
          black: "#0b0b0f",
          gray: "#18181f",
          mist: "#b3b3bd"
        }
      },
      boxShadow: {
        glow: "0 15px 35px rgba(229, 9, 20, 0.25)"
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Manrope", "sans-serif"]
      }
    }
  },
  plugins: []
};
