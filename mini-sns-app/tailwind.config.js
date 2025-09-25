module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        fb: {
          50: "#f5f7fb",
          100: "#e9f0fb",
          200: "#d2e3fb",
          300: "#a6c7fb",
          400: "#6ea0f8",
          500: "#1877f2", // 페이스북 톤(대표)
          600: "#166fe0",
          700: "#125abc",
          800: "#0f4590",
          900: "#0b2d5f",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,0.05), 0 6px 12px rgba(16,24,40,0.06)",
        soft: "0 2px 6px rgba(16,24,40,0.06)",
      },
      borderRadius: {
        xl2: "14px",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
