<script setup lang="ts">
import Changelog from '@/components/blocks/changelog/Changelog.vue'

// Local mirror of the block's `Release` prop shape — SFC script-setup types
// are not importable, and annotating keeps literal `type` fields from
// widening to `string` under vue-tsc.
type EntryType = 'new' | 'improved' | 'fixed' | 'breaking'

interface DemoRelease {
  version: string
  date: string
  latest?: boolean
  entries: { type: EntryType; title: string; description?: string }[]
}

const breakingReleases: DemoRelease[] = [
  {
    version: 'v3.0.0',
    date: '2026-08-20',
    entries: [
      {
        type: 'breaking',
        title: 'New theming contract',
        description: 'CSS variables move from --ui-* to --uipkge-*. Run the codemod before upgrading.',
      },
      {
        type: 'breaking',
        title: 'Dropped CommonJS builds',
        description: 'All packages now ship ESM only. Node 18 consumers must stay on v2.x.',
      },
      {
        type: 'improved',
        title: 'Tree-shaking',
        description: 'Barrel exports rewritten so unused components drop out of the bundle.',
      },
      {
        type: 'new',
        title: 'Migration codemod',
        description: 'npx @uipkge/migrate handles 90% of renames automatically.',
      },
    ],
  },
]

const singleRelease: DemoRelease[] = [
  {
    version: 'v1.0.0',
    date: '2025-11-02',
    entries: [{ type: 'new', title: 'Initial release', description: 'First stable cut of the design system.' }],
  },
]

const manyReleases: DemoRelease[] = Array.from({ length: 8 }, (_, i) => ({
  version: `v2.${7 - i}.0`,
  date: new Date(Date.UTC(2026, 7 - i, 14)).toISOString().slice(0, 10),
  entries: [
    { type: (['new', 'improved', 'fixed'] as const)[i % 3], title: `Change ${i * 3 + 1}` },
    { type: (['fixed', 'new', 'improved'] as const)[i % 3], title: `Change ${i * 3 + 2}` },
  ],
}))

const longDescriptions: DemoRelease[] = [
  {
    version: 'v2.4.1',
    date: '2026-08-18',
    entries: [
      {
        type: 'fixed',
        title: 'Popover positioning near viewport edges',
        description:
          'Popovers anchored within 8px of the viewport edge could render partially offscreen. The positioning engine now flips placement and clamps to the safe area inset, keeping triggers visible on small screens.',
      },
      {
        type: 'improved',
        title: 'Form validation timing',
        description:
          'Fields now validate on blur instead of every keystroke, which removes the flicker of error messages while typing. Errors re-validate live once a field has been touched and left invalid.',
      },
    ],
  },
]

const noDescriptions: DemoRelease[] = [
  {
    version: 'v2.4.2',
    date: '2026-08-21',
    entries: [
      { type: 'new', title: 'Keyboard shortcut cheatsheet (? key)' },
      { type: 'improved', title: 'Faster cold start for the CLI' },
      { type: 'fixed', title: 'Tooltip flicker on touch devices' },
    ],
  },
]
</script>

<template>
  <Story
    title="Default"
    description="Three versions of release notes grouped under monospace tags with typed entry badges on a timeline rail."
  >
    <Changelog />
  </Story>

  <Story
    title="Breaking change emphasis"
    description="A major release where Breaking badges lead — destructive red draws the eye to migration-required items."
  >
    <Changelog :releases="breakingReleases" />
  </Story>

  <Story title="Single version" description="One release renders without version-group spacing artifacts.">
    <Changelog :releases="singleRelease" />
  </Story>

  <Story
    title="Many versions, scrollable"
    description="Eight releases capped at max-h-96 with overflow scrolling; the rail scrolls with its entries."
  >
    <Changelog :releases="manyReleases" scrollable />
  </Story>

  <Story title="Long descriptions" description="Multi-line descriptions keep the rail aligned via in-flow dot markers.">
    <Changelog :releases="longDescriptions" />
  </Story>

  <Story title="No descriptions" description="Title-only entries collapse to a single badge + title line per row.">
    <Changelog :releases="noDescriptions" />
  </Story>

  <Story title="Subscribe emphasis" description="The Subscribe action promoted to the filled primary variant.">
    <Changelog subscribe-variant="default" />
  </Story>

  <Story
    title="No subscribe action"
    description="Header reduced to title and description by hiding the Subscribe button."
  >
    <Changelog :subscribe="false" />
  </Story>
</template>
