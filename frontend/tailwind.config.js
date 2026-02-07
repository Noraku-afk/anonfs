/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#0d7ff2",
                accent: "#00ff9d", // Neon green
                "background-light": "#f5f7f8",
                "background-dark": "#0B1116", // Deep dark background
                "glass-border": "rgba(255, 255, 255, 0.08)",
                "glass-bg": "rgba(30, 41, 59, 0.4)",
            },
            fontFamily: {
                display: ["Inter", "sans-serif"],
                body: ["Inter", "sans-serif"],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            }
        },
    },
    plugins: [],
}
