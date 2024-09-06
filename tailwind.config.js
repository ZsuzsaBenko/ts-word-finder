/** @type {import('tailwindcss').Config} */

module.exports = {
    content: ['./src/**/*.html'],
    darkMode: 'media',
    theme: {
        extend: {
            screens: {
                'low-res': {'raw': 'only screen and (max-height: 800px) and (min-width: 900px)'}
            },
            boxShadow: {
                'normal': '0 0 8px 0 #166534',
                'dark': '0 0 10px 0 #6ee7b7'
            },
            colors: {
                'orchid': {
                    50: '#efebf7',
                    100: '#dbd0f2',
                    200: '#bdb2d4',
                    300: '#a093ba',
                    400: '#7b6e96',
                    500: '#7b6e96',
                    600: '#564180',
                    700: '#3a2d54',
                    800: '#2a213b',
                    900: '#1a1426'
                }
            },
            animation: {
                wiggle: 'wiggle 0.5s ease-in-out infinite'
            },
            keyframes: {
                wiggle: {
                    '0%, 100%': {transform: 'rotate(-5deg)', color: '#16a34a'},
                    '50%': {transform: 'rotate(5deg)', color: '#7b6e96'}
                }
            }
        }
    },
    plugins: []
};

