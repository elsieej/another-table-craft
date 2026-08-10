import { createRequire } from 'node:module'
import { themes as prismThemes } from 'prism-react-renderer'
import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// `customCss` resolves its entries as filesystem paths relative to this file, not as npm
// specifiers -- so the library's `./styles.css` export subpath needs an explicit resolve.
const require = createRequire(import.meta.url)
const tableCraftStyles = require.resolve('another-table-craft/styles.css')

const config: Config = {
  title: 'another-table-craft',
  tagline: 'A production-ready, SPA-first React data table system built on TanStack Table',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://elsieej.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/another-table-craft/',

  // GitHub pages deployment config.
  organizationName: 'elsieej', // Usually your GitHub org/user name.
  projectName: 'another-table-craft', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Geist / Geist Mono for the table-craft components (see `--font-sans`/`--font-mono` in
  // packages/table-craft/src/styles/theme.css) -- the package declares the font stack but ships no font
  // files itself, so the host page is expected to load them, same as any other web font.
  stylesheets: [
    {
      href: 'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap'
    }
  ],

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en']
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/elsieej/another-table-craft/tree/main/website/'
        },
        blog: false,
        theme: {
          // Order matters: the library's precompiled utilities load first so page-level
          // overrides in custom.css can still win.
          customCss: [tableCraftStyles, './src/css/custom.css']
        }
      } satisfies Preset.Options
    ]
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true
    },
    navbar: {
      title: 'another-table-craft',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs'
        },
        {
          href: 'https://github.com/elsieej/another-table-craft',
          label: 'GitHub',
          position: 'right'
        }
      ]
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting started',
              to: '/docs/intro'
            }
          ]
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/elsieej/another-table-craft'
            },
            {
              label: 'Issues',
              href: 'https://github.com/elsieej/another-table-craft/issues'
            }
          ]
        }
      ],
      copyright: `Copyright © ${new Date().getFullYear()} another-table-craft contributors. Built with Docusaurus.`
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula
    }
  } satisfies Preset.ThemeConfig
}

export default config
