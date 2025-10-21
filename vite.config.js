import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Generate a single JS and CSS file for Liferay Custom Element
    rollupOptions: {
      output: {
        entryFileNames: 'main.js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'main.css';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Não usar additionalData para evitar conflitos com :export
        // Os imports são feitos diretamente nos arquivos que precisam
      }
    }
  },
  server: {
    port: 3000,
    open: true,
  },
  define: {
    // Make global variables available
    'process.env': {},
  },
});
