import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Universal deployment configuration: base './' ensures assets load correctly on Netlify root domain, GitHub Pages subpath, or local preview
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
  ],
});

