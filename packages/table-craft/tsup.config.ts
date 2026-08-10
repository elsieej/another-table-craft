import { mkdirSync } from 'node:fs'
import { execFile } from 'node:child_process'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { promisify } from 'node:util'
import { defineConfig } from 'tsup'

const execFileAsync = promisify(execFile)
const require = createRequire(import.meta.url)
// `@tailwindcss/cli` only publishes a `bin` entry, not an importable subpath export.
const tailwindCli = join(dirname(require.resolve('@tailwindcss/cli/package.json')), 'dist/index.mjs')

const outDir = 'dist'
// Compiled by Tailwind into the `./styles.css` export subpath in package.json.
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
    await execFileAsync(process.execPath, [tailwindCli, '-i', THEME_SOURCE, '-o', `${outDir}/styles.css`, '--minify'])
  }
})
