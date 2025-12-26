import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: {
                    DEFAULT: "#14b8a6", // Teal 500
                    50: "#f0fdfa",
                    100: "#ccfbf1",
                    500: "#14b8a6",
                    600: "#0d9488",
                    700: "#0f766e",
                },
                secondary: {
                    DEFAULT: "#6366f1", // Indigo 500
                    50: "#eef2ff",
                    100: "#e0e7ff",
                    500: "#6366f1",
                    600: "#4f46e5",
                    text: "#312e81",
                },
                accent: {
                    DEFAULT: "#f59e0b", // Amber 500
                    50: "#fffbeb",
                    500: "#f59e0b",
                },
                danger: {
                    DEFAULT: "#f43f5e", // Rose 500
                    50: "#fff1f2",
                },
                surface: "#ffffff",
                border: "#e2e8f0", // slate-200
                muted: "#64748b",  // slate-500
            },
            borderRadius: {
                '2xl': '1.25rem',
                '3xl': '1.5rem',
            },
            animation: {
                "fade-in": "fadeIn 0.5s ease-in-out",
                "slide-up": "slideUp 0.5s ease-out",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { transform: "translateY(20px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
            },
        },
    },
    plugins: [],
};
export default config;
