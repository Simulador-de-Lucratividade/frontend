import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#0066cc",
        fillSecondary: "#f8fafd",
        success: "#00cc66",
        warning: "#ff9933",
        textBase: "#333333",
        bgContainer: "#ffffff",
        borderSecondary: "#e8e8e8",
        buttonBg: "#0066cc",
        buttonHoverBg: "#0052a3",
        buttonColor: "#ffffff",
        buttonHoverColor: "#ffffff",
        buttonBorderColor: "#0066cc",
        buttonHoverBorderColor: "#0052a3",
        menuItemBg: "#ffffff",
        menuItemText: "#333333",
      },
    },
  },
  important: true,
  plugins: [],
} satisfies Config;
