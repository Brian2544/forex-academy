import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/auth': {
        target: 'http://localhost:4000',
        changeOrigin: true
      },
      '/users': {
        target: 'http://localhost:4000',
        changeOrigin: true
      },
      '/student': {
        target: 'http://localhost:4000',
        changeOrigin: true
      },
      '/admin': {
        target: 'http://localhost:4000',
        changeOrigin: true
      },
      '/billing': {
        target: 'http://localhost:4000',
        changeOrigin: true
      },
      '/payments': {
        target: 'http://localhost:4000',
        changeOrigin: true
      },
      '/chat': {
        target: 'http://localhost:4000',
        changeOrigin: true
      }
    }
  },
  optimizeDeps: {
    exclude: [],
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
      '@tanstack/react-query',
      'axios',
      'lucide-react',
      'date-fns',
      'react-hook-form',
      'zod',
      '@hookform/resolvers',
      '@heroicons/react'
    ]
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  }
})

