import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves project sites from /<repo-name>/, not /. Only apply that
// subpath when actually building in CI (GITHUB_ACTIONS) -- local dev/preview
// still serve from / as usual.
export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/another-table-craft/' : '/',
  plugins: [react()]
})
