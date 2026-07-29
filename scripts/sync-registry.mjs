// Copies registry/ui and registry/blocks (the shadcn-registry source of truth for
// presentational components) into src/components before tsup builds, so there is
// exactly one place component source is edited. No-op until Phase 2/3 populate registry/.
import { existsSync, mkdirSync, cpSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const pairs = [
  [join(root, 'registry', 'ui'), join(root, 'src', 'components', 'ui')],
  [join(root, 'registry', 'blocks'), join(root, 'src', 'components')]
]

for (const [from, to] of pairs) {
  if (!existsSync(from)) continue
  mkdirSync(to, { recursive: true })
  cpSync(from, to, {
    recursive: true,
    filter: (src) => !src.endsWith('registry.json')
  })
}
