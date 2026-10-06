import type { StoryMeta } from './types'

export const stories: StoryMeta[] = [
  {
    title: 'App launcher',
    description:
      'A desktop-style app dock with magnification on hover. Click an icon to mark it active — the indicator dot and tint track the selection.',
  },
  {
    title: 'In a desktop shell',
    description: 'The dock pinned to the bottom of a faux desktop wallpaper — the canonical macOS-style placement.',
  },
  {
    title: 'Click handlers',
    description: 'Each item carries a handler — the panel below records the last launched tool.',
  },
  {
    title: 'Magnification tuning',
    description: 'Compact base size (36px) on the left; a dramatic 2x peak with a wider 150px falloff on the right.',
  },
  {
    title: 'Custom styling',
    description: 'The dock inherits border and backdrop styling — pass a class to match a dark theme or brand surface.',
  },
  {
    title: 'Tooltips off',
    description: 'Hide the hover tooltip labels for a minimal, icon-only dock.',
  },
]
