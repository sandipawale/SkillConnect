import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // We REMOVE the server proxy section for production.
  // The proxy is only for the local development server.
});
