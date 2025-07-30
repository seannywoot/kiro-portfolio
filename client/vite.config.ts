import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  assetsInclude: ['**/*.glb'],
  resolve: {
    alias: {
      "@client": path.resolve(__dirname, "./src"),
      "@server": path.resolve(__dirname, "../server/src"),
      "@shared": path.resolve(__dirname, "../shared/src"),
      "@": path.resolve(__dirname, "./src")
    }
  },
  build: {
    // Enable code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for React and related libraries
          vendor: ['react', 'react-dom'],
          // UI components chunk
          ui: ['lucide-react', '@radix-ui/react-slot'],
          // Utilities chunk
          utils: ['clsx', 'tailwind-merge', 'class-variance-authority'],
          // Animation libraries
          animations: ['gsap']
        }
      }
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable minification for production
    minify: 'esbuild',
    // Enable source maps for debugging
    sourcemap: process.env.NODE_ENV === 'development',
    // Target modern browsers for better animation support
    target: ['es2020', 'chrome80', 'firefox78', 'safari14', 'edge88']
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'lucide-react',
      '@radix-ui/react-slot'
    ]
  },
  // Performance optimizations
  server: {
    // Optimize HMR
    hmr: {
      overlay: true
    }
  }
})
