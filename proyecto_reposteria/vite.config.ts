import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true
    // ✅ NO proxy - las peticiones van directamente a /api en el servidor
  },
  preview: {
    host: '0.0.0.0',
    port: 5173
  }
});
