import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
      '@stores': fileURLToPath(new URL('./src/stores', import.meta.url)),
      '@services': fileURLToPath(new URL('./src/services', import.meta.url)),
      '@hooks': fileURLToPath(new URL('./src/hooks', import.meta.url)),
      '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
      '@styles': fileURLToPath(new URL('./src/styles', import.meta.url)),
      '@types': fileURLToPath(new URL('./src/types', import.meta.url)),
    },
  },
  server: {
    port: 5174,  // Vite runs on 5174, nginx proxies from https://liar.nyc:5173 to this
    host: '0.0.0.0',
    strictPort: true,
    hmr: {
      // For hot reload to work properly through nginx proxy
      port: 5173,  // This should be the public-facing port
      host: 'liar.nyc',
      protocol: 'wss'  // WebSocket Secure for HTTPS
    },
    cors: true,
    // Watch for changes in all files
    watch: {
      usePolling: true,  // Sometimes needed in Docker/WSL environments
      interval: 1000
    }
  },
})
