/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                sedna: {
                    dark: '#050505', // Nearly black
                    panel: '#0A0A0A',
                    glass: 'rgba(20, 20, 20, 0.2)', // Updated transparency to 0.2
                    glassBorder: 'rgba(255, 255, 255, 0.08)',
                    accent: '#FF0000', // The requested Red accent
                    accentDim: 'rgba(255, 0, 0, 0.1)',
                    textMuted: '#888888'
                }
            },
            animation: {
                'blob': 'blob 10s infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                blob: {
                    '0%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                    '100%': { transform: 'translate(0px, 0px) scale(1)' },
                }
            }
        }
    },
    plugins: [],
}
