import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@services': path.resolve(__dirname, './src/services'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@types': path.resolve(__dirname, './src/types'),
    },
  },
  server: {
    port: 5174,  // Vite runs on 5174, nginx proxies from https://liar.nyc:5173 to this
    host: '0.0.0.0',
    strictPort: true,
    hmr: {
      port: 5174,
      host: 'localhost'
    },
    cors: true,
    // Allow liar.nyc to connect to the dev server
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'liar.nyc',
      '.liar.nyc'  // Also allow subdomains if any
    ],
  },
})
