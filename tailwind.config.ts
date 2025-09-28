import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      height: {
        '8': '2rem', 
      },
      maxWidth: {
        'xs': '20rem', 
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }], 
        'sm': ['0.875rem', { lineHeight: '1.25rem' }], 
      }
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
}

export default config