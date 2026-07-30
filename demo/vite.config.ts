import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves project sites from /<repo-name>/, not /. Only apply that
// subpath when explicitly building for a Pages deploy (set by
// .github/workflows/deploy-demo.yml) -- not the ambient GITHUB_ACTIONS flag,
// which every workflow sets and would silently mis-base a future demo build
// added to some other workflow (e.g. a plain CI smoke-build).
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()]
})
