/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  plugins: [],
  theme: {
    extend: {
      boxShadow: {
        'blur': '0px 0px 20px 0px #0056ff'
      },
      animation: {
        'validated': 'validated 0.2s ease-in-out normal',
        'appear': 'appear 0.2s ease-in-out normal',
        'zoom-out': 'zoom-out 0.3s ease-in-out forwards 0.4s',
        'blur': 'blur 1s ease-in-out forwards 1s'
      },
      keyframes: {
        'validated': {
          '0%': { scale: '0.5', opacity: '0' },
          '60%': { scale: '1.3' },
          '100%': { scale: '1', opacity: '1' }
        },
        'appear': {
          '0%': { scale: '1.3', opacity: '0' },
          '100%': { scale: '1', opacity: '1' }
        },
        'zoom-out': {
          '0%': { scale: '1.3', opacity: '0' },
          '100%': { scale: '1', opacity: '1' }
        },
        'blur': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
      }
    }
  }
}
