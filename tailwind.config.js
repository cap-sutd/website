/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		opacity: Object.fromEntries(Array.from({ length: 101 }, (_, i) => [i, `${i / 100}`])),
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius))',
  			sm: 'calc(var(--radius))'
  		},
  		colors: {
  			background: '#F2F2F0',
  			foreground: '#0A0A0B',
  			card: { DEFAULT: '#FFFFFF', foreground: '#0A0A0B' },
  			popover: { DEFAULT: '#FFFFFF', foreground: '#0A0A0B' },
  			primary: { DEFAULT: '#CCFF00', foreground: '#0A0A0B' },
  			secondary: { DEFAULT: '#D4D4D0', foreground: '#0A0A0B' },
  			muted: { DEFAULT: '#E5E5E2', foreground: '#6A6A6E' },
  			accent: { DEFAULT: '#D4D4D0', foreground: '#0A0A0B' },
  			destructive: { DEFAULT: '#ff003c', foreground: '#FFFFFF' },
  			border: '#D4D4D0',
  			input: '#D4D4D0',
  			ring: '#0A0A0B',
  			obsidian: '#F2F2F0',
  			citrine: '#CCFF00',
  			graphene: '#D4D4D0',
  		},
  		fontFamily: {
  			heading: ['Inter Tight', 'ui-sans-serif', 'system-ui', 'sans-serif'],
  			body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
  			display: ['Inter Tight', 'ui-sans-serif', 'system-ui', 'sans-serif'],
  			mono: ['JetBrains Mono', 'ui-monospace', 'monospace']
  		},
  		keyframes: {
  			'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
  			'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } }
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
