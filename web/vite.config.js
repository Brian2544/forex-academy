import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const configuredProxyTarget = (env.VITE_API_PROXY_TARGET || '').trim()
  const proxyTarget = configuredProxyTarget || 'http://localhost:4000'
  const bypassSpaNavigation = (req) => {
    const acceptHeader = req.headers.accept || ''
    const isApiCall =
      acceptHeader.includes('application/json') ||
      acceptHeader.includes('application/xml') ||
      req.headers.authorization ||
      req.method !== 'GET'

    if (!isApiCall) {
      return '/index.html'
    }
    return null
  }

  return {
    plugins: [react()],
    server: {
      host: true,
      allowedHosts:  ['doorstep-roundish-dividers.ngrok-free.dev'],
      port: 3000,
      proxy: {
        '/auth': {
          target: proxyTarget,
          changeOrigin: true
        },
        '/users': {
          target: proxyTarget,
          changeOrigin: true
        },
        '/student': {
          target: proxyTarget,
          changeOrigin: true,
          bypass: function(req) {
            return bypassSpaNavigation(req)
          }
        },
        '/admin': {
          target: proxyTarget,
          changeOrigin: true,
          bypass: function(req, res, options) {
            const acceptHeader = req.headers.accept || ''
            const isApiCall =
              acceptHeader.includes('application/json') ||
              acceptHeader.includes('application/xml') ||
              req.headers.authorization ||
              req.method !== 'GET'

            if (!isApiCall) {
              return '/index.html'
            }
            return null
          }
        },
        '/billing': {
          target: proxyTarget,
          changeOrigin: true,
          bypass: function(req) {
            return bypassSpaNavigation(req)
          }
        },
        '/payments': {
          target: proxyTarget,
          changeOrigin: true,
          bypass: function(req, res, options) {
            if (req.url?.startsWith('/payments/status')) {
              return '/index.html'
            }
            const acceptHeader = req.headers.accept || ''
            const isApiCall =
              acceptHeader.includes('application/json') ||
              req.headers.authorization ||
              req.method !== 'GET'
            if (!isApiCall) {
              return '/index.html'
            }
            return null
          }
        },
        '/chat': {
          target: proxyTarget,
          changeOrigin: true,
          bypass: function(req) {
            return bypassSpaNavigation(req)
          }
        },
        '/owner': {
          target: proxyTarget,
          changeOrigin: true,
          bypass: function(req, res, options) {
            const acceptHeader = req.headers.accept || ''
            const isApiCall =
              acceptHeader.includes('application/json') ||
              req.headers.authorization ||
              req.method !== 'GET'
            if (!isApiCall) {
              return '/index.html'
            }
            return null
          }
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
  }
})