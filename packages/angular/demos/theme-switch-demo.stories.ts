import type { AngularStory } from './types'

export const stories: AngularStory[] = [
  {
    title: 'Cards',
    description: 'Default — full SectionCard with three labeled buttons. Best for settings pages.',
  },
  {
    title: 'Icons',
    description: 'Compact 3-icon segmented row, no labels. Fits in toolbars.',
  },
  {
    title: 'Icon only',
    description: 'Single icon button cycling Light ⇆ Dark — header-grade, no chrome.',
  },
  {
    title: 'Dropdown',
    description: 'Trigger button opening a DropdownMenu with the state list. Header-friendly.',
  },
  {
    title: 'Pill',
    description: 'Equal-width segments under a sliding primary indicator. Smooth 300ms translate.',
  },
  {
    title: 'Pill — 4 states',
    description: 'Same sliding indicator, four states (system / light / dark / black-OLED).',
  },
  {
    title: 'Switch',
    description: 'iOS-style toggle with sun/moon glyphs at the ends. The thumb slides; idle glyph dims.',
  },
]
