/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#2563eb',
                    dark: '#1d4ed8',
                    light: '#60a5fa',
                },
                secondary: '#7c3aed',
                accent: '#f59e0b',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                heading: ['Outfit', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
