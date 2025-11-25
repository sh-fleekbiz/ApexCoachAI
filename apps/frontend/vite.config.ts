import react from '@vitejs/plugin-react';
import process from 'node:process';
import { defineConfig } from 'vite';

// Production API URL - hardcoded for Static Web App deployment
const PROD_API_URL =
  'https://apexcoachai-api.mangocoast-f4cc7159.eastus2.azurecontainerapps.io';

// Use env var if provided, otherwise use production URL in production builds
const apiUrl =
  process.env.BACKEND_URI ||
  (process.env.NODE_ENV === 'production' ? PROD_API_URL : '');
console.log(`Using search API base URL: "${apiUrl}"`);

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'import.meta.env.VITE_SEARCH_API_URI': JSON.stringify(apiUrl),
  },
  plugins: [react()],
  build: {
    outDir: './dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1024,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/auth': 'http://127.0.0.1:3000',
      '/ask': 'http://127.0.0.1:3000',
      '/chat': 'http://127.0.0.1:3000',
      '/chats': 'http://127.0.0.1:3000',
      '/content': 'http://127.0.0.1:3000',
      '/meta-prompts': 'http://127.0.0.1:3000',
      '/me': 'http://127.0.0.1:3000',
      '/library': 'http://127.0.0.1:3000',
    },
  },
});
