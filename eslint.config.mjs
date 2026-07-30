// Enforces the core/components boundary: src/core/** is the headless layer and must
// never import from src/components/** (Base UI + Tailwind live there). This is what
// keeps useTableCraft reusable outside any specific UI stack.
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
  { ignores: ['website/build/**', 'website/.docusaurus/**', 'packages/table-craft/dist/**'] },
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    files: ['packages/table-craft/src/core/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/components/**', '../components/**', '../../components/**'],
              message:
                'src/core/** is the headless layer and must not import from src/components/** (Base UI/Tailwind). Keep table-state logic decoupled from presentation.'
            }
          ]
        }
      ]
    }
  }
]
