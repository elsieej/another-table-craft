# Contributing

Thanks for considering a contribution to another-table-craft.

## Setup

This is an npm-workspaces monorepo: the published library lives in `packages/table-craft/`, and `website/` is a Docusaurus docs site that consumes it like any other package. A single `npm install` at the repo root sets up both.

```bash
npm install
```

Node 20+ is recommended. All scripts below are run from the repo root — they delegate to the right workspace package.

## Development scripts

| Script                 | What it does                                                                                       |
| ---------------------- | -------------------------------------------------------------------------------------------------- |
| `npm run dev`          | Builds the library in watch mode                                                                   |
| `npm run typecheck`    | Runs `tsc` for the library, builds it, then runs `tsc` for `website` (which needs the built types) |
| `npm run lint`         | Runs ESLint over `packages/table-craft/src` and `website/src`                                      |
| `npm run format`       | Formats the repo with Prettier                                                                     |
| `npm run format:check` | Checks formatting without writing                                                                  |
| `npm test`             | Runs the Vitest suite once                                                                         |
| `npm run test:watch`   | Runs Vitest in watch mode                                                                          |
| `npm run build`        | Builds the publishable package with tsup                                                           |

Before opening a pull request, make sure all of these pass:

```bash
npm run typecheck && npm run lint && npm run format:check && npm test && npm run build
```

## Making a change

1. Fork and clone the repo, then create a branch off `main`.
2. Write tests first where practical (TDD) — see existing `*.test.ts(x)` files co-located next to the code they cover for the established style.
3. Keep changes scoped: a single logical change per pull request is much easier to review than a bundle of unrelated ones.
4. Run the full check list above locally before pushing.
5. Open a pull request against `main` describing what changed and why.

## Reporting bugs / requesting features

Please open a [GitHub issue](https://github.com/elsieej/another-table-craft/issues) using the provided templates. Include a minimal repro for bugs where possible.

## Code of Conduct

This project follows the [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you're expected to uphold it.
