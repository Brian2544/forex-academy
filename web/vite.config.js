import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const proxyTarget = env.VITE_API_PROXY_TARGET || env.VITE_API_BASE_URL || 'http://localhost:4000';

  return {
    plugins: [react()],
    server: {
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
          changeOrigin: true
        },
        '/admin': {
          target: proxyTarget,
          changeOrigin: true,
          bypass: function(req, res, options) {
            // Don't proxy if it's a browser navigation (no Accept header or Accept includes text/html)
            // Only proxy actual API calls (Accept: application/json or has Authorization header)
            const acceptHeader = req.headers.accept || '';
            const isApiCall = acceptHeader.includes('application/json') || 
                             acceptHeader.includes('application/xml') ||
                             req.headers.authorization ||
                             req.method !== 'GET';
            
            // If it's not an API call, let Vite serve the SPA (return null)
            if (!isApiCall) {
              return '/index.html';
            }
            // Otherwise, proxy to backend
            return null;
          }
        },
        '/billing': {
          target: proxyTarget,
          changeOrigin: true
        },
        '/payments': {
          target: proxyTarget,
          changeOrigin: true,
          bypass: function(req, res, options) {
            if (req.url?.startsWith('/payments/status')) {
              return '/index.html';
            }
            const acceptHeader = req.headers.accept || '';
            const isApiCall = acceptHeader.includes('application/json') ||
                             req.headers.authorization ||
                             req.method !== 'GET';
            if (!isApiCall) {
              return '/index.html';
            }
            return null;
          }
        },
        '/chat': {
          target: proxyTarget,
          changeOrigin: true
        },
        '/owner': {
          target: proxyTarget,
          changeOrigin: true,
          bypass: function(req, res, options) {
            // Don't proxy SPA routes - only API calls
            const acceptHeader = req.headers.accept || '';
            const isApiCall = acceptHeader.includes('application/json') || 
                             req.headers.authorization ||
                             req.method !== 'GET';
            if (!isApiCall) {
              return '/index.html';
            }
            return null;
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
  };
})

