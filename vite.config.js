import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // base: process.env.VITE_BASE_PATH || '/',
  build: {
    // Code splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries
          'vendor': [
            'react',
            'react-dom',
            'react-router-dom',
            'react-redux',
            '@reduxjs/toolkit'
          ],
          // Split UI libraries
          'ui': [
            'antd',
            'react-toastify',
          ],
          // Split heavy dependencies
          'charts': ['recharts'],
          'animation': ['framer-motion', 'gsap'],
        }
      }
    },
    // Optimize chunk sizes
    chunkSizeWarningLimit: 500,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true
      }
    },
    // Source maps for production debugging
    sourcemap: false,
    // Output directory
    outDir: 'dist',
    assetsDir: 'assets',
  },
  // Optimization for module resolution
  resolve: {
    alias: {
      '@components': '/src/components',
      '@pages': '/src/pages',
      '@services': '/src/services',
      '@hooks': '/src/hooks',
      '@utils': '/src/utils',
      '@contexts': '/src/contexts',
      '@redux': '/src/redux',
      '@assets': '/src/assets',
    }
  }
})