import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base configuration for GitHub Pages deployment
// If your site is at https://<username>.github.io/<repository-name>/
// then base should be '/<repository-name>/'

export default defineConfig(({ command }) => {
  // Set the base path according to your repository name
  const base = command === 'build' ? '/todonoter/' : '/'; 

  return {
    plugins: [react()],
    base: base, // Use the dynamically set base path
    build: {
      outDir: 'dist' // Explicitly set the output directory to 'dist'
    }
  }
})
