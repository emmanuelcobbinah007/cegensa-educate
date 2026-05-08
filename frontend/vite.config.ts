import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

const tailwindConfig = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Poppins', 'system-ui', 'sans-serif'],
        serif:   ['Lora', 'Georgia', 'serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      colors: {
        sand: {
          50:  '#FDFCF8',
          100: '#FAF7F1',
          200: '#EDE8DF',
          300: '#DDD6C8',
          400: '#C8BFB0',
        },
        ocean: {
          50:  '#EDF6F8',
          100: '#D0E9EE',
          200: '#A2D3DD',
          300: '#73BDCC',
          400: '#3DA3BC',
          500: '#1D7A8C',
          600: '#156879',
          700: '#0D5262',
          800: '#083C4A',
          900: '#042530',
        },
        terra: {
          50:  '#FDF3EF',
          100: '#FAE6DC',
          200: '#F5CCBA',
          300: '#EEB298',
          400: '#E49678',
          500: '#C4623A',
          600: '#A04D2A',
          700: '#7C381B',
          800: '#58260C',
        },
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        soft:     '0 2px 20px rgba(29, 122, 140, 0.07)',
        card:     '0 4px 24px rgba(0, 0, 0, 0.05)',
        elevated: '0 8px 40px rgba(0, 0, 0, 0.09)',
      },
    },
  },
  plugins: [],
}

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      plugins: [tailwindcss(tailwindConfig as any), autoprefixer()],
    },
  },
  server: {
    port: 3000,
  },
})
