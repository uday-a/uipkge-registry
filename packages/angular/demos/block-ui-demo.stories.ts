import type { AngularStory } from './stories'

/** Story cards for the block-ui Angular demo (titles mirror demos/react/block-ui.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Settings form during save',
    description: "Block the whole card while a save request is in flight so users can't edit stale fields mid-submit.",
  },
  {
    title: 'Data fetch with blur',
    description:
      "Blur the stale content while fresh data loads — signals that what's behind the overlay is about to change.",
  },
  {
    title: 'Custom overlay icon',
    description: 'Swap the spinner for a context-relevant icon — here a cloud upload glyph during a file sync.',
  },
  {
    title: 'Rich message slot',
    description: 'Replace the plain text message with a two-line status — title plus a reassuring subtitle.',
  },
  {
    title: 'Overlay appearance',
    description:
      'Tune opacity and overlay color — a lower opacity keeps content visible, a dark tint reads as a hard block.',
  },
  {
    title: 'Database migration panel',
    description: 'A realistic always-blocked state — the kind you show while a long-running migration is in progress.',
  },
]
