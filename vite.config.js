import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use relative paths for Liferay client extension compatibility
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Generate a single JS and CSS file for Liferay Custom Element
    rollupOptions: {
      output: {
        entryFileNames: 'main.js',
        // IMPORTANT: Disable code splitting for client extensions
        // All code must be in a single bundle (main.js)
        inlineDynamicImports: true,
        manualChunks: undefined,
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'main.css';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
    // Optimize bundle size
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Keep console for debugging in Liferay
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Não usar additionalData para evitar conflitos com :export
        // Os imports são feitos diretamente nos arquivos que precisam
      },
    },
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
