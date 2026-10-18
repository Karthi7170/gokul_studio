import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves the site at /gokul_studio/; Vercel serves it at /.
export default defineConfig({
  plugins: [react()],
  base: process.env.VERCEL ? '/' : '/gokul_studio/',
});
