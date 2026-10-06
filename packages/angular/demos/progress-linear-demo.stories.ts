import type { AngularStory } from './stories'

/** Story cards for the progress-linear Angular demo (titles mirror demos/react/progress-linear.tsx). */
export const stories: AngularStory[] = [
  { title: 'Determinate', description: 'Linear progress bar driven by a fixed model value (0–100).' },
  { title: 'Indeterminate', description: 'indeterminate animates a sliding bar for unknown-duration tasks.' },
  {
    title: 'Buffer',
    description: 'buffer renders a secondary fill behind the main value — useful for pre-loading or video buffering.',
  },
  {
    title: 'Stream',
    description: 'stream animates a dotted overlay on the track (determinate only — disabled while indeterminate).',
  },
  { title: 'Striped', description: 'striped paints diagonal hatch marks on the fill for a loading aesthetic.' },
  {
    title: 'Color tokens',
    description: 'color accepts a CSS color or a token name (primary / success / warning / info / destructive).',
  },
  {
    title: 'Heights',
    description: 'height (px or any CSS length) tunes the track thickness from a hairline to a chunky bar.',
  },
  { title: 'Reverse', description: 'reverse fills from right-to-left — useful for RTL UIs or count-down semantics.' },
]
