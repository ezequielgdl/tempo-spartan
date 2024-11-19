/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("@spartan-ng/ui-core/hlm-tailwind-preset")],
  content: ["./src/**/*.{html,ts}", "./components/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        "pp-pangaia": ["PP Pangaia"],
        "dm-sans": ["DM Sans"],
      },
      animation: {
        slideUp: "slideUp 2800ms ease-in-out infinite",
      },
      keyframes: {
        slideUp: {
          "0%, 100%": { opacity: "0", transform: "translateY(20px)" },
          "30%, 70%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
