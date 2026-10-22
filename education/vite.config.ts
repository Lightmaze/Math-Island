import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: { outDir: 'dist', sourcemap: false, chunkSizeWarningLimit: 550 },
  server: { port: 4173, strictPort: true },
});
