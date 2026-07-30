import { copyFileSync, mkdirSync } from 'node:fs'
import { defineConfig } from 'tsup'

const outDir = 'dist'
// Published verbatim as the `./styles.css` export subpath in package.json.
const THEME_SOURCE = 'src/styles/theme.css'

export default defineConfig({
  entry: ['src/index.ts'],
  outDir,
  format: ['cjs', 'esm'],
  dts: true,
  splitting: true,
  treeshake: true,
  clean: true,
  external: ['react', 'react-dom'],
  sourcemap: true,
  outExtension({ format }) {
    return { js: format === 'cjs' ? '.cjs' : '.js' }
  },
  onSuccess: async () => {
    mkdirSync(outDir, { recursive: true })
    copyFileSync(THEME_SOURCE, `${outDir}/styles.css`)
  }
})
