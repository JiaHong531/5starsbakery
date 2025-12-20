/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'header-bg': '#4E342E',
                'bg-primary': '#FFFDD0',
                'accent-1': '#FFAB91',
                'accent-2': '#FFD54F',
                'text-main': '#4E342E',
                'text-light': '#FFFDD0',
                'text-secondary': '#4D4D99',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
                cursive: ['Pacifico', 'cursive'],
            },
        },
    },
    plugins: [],
}
