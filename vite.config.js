import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Capstone/', // <--- Change this to EXACTLY './' to fix absolute path breaking in Incognito
  assetsInclude: ["**/*.html"],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'docs',
  }
})
