import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Cloudflare Pages root directory is the repo root, so emit dist there.
    outDir: path.resolve(__dirname, '../dist'),
    emptyOutDir: true,
  },
})
