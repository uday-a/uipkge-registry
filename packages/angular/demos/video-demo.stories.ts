import type { AngularStory } from './stories'

export const stories: AngularStory[] = [
  {
    title: 'Feature player',
    description:
      'Custom controls with play/pause, seek, skip ±10s, volume, and fullscreen — the default hero video experience.',
  },
  {
    title: 'Autoplay (muted)',
    description: 'Autoplay starts muted to satisfy browser policies — ideal for background reels and silent promos.',
  },
  {
    title: 'Native controls',
    description: "Drop in the browser's built-in controls when you don't need a branded overlay.",
  },
  {
    title: 'Aspect ratio variants',
    description: '16/9 (default), 4/3 classic, 1/1 square, and 9/16 portrait — match the player to your source.',
  },
  {
    title: 'Without poster',
    description: 'No poster image — the player area is black until playback starts.',
  },
  {
    title: 'Custom playback rate',
    description: 'Set an initial playback rate — 1.5× for tutorials, 0.5× for slow-motion analysis.',
  },
  {
    title: 'In a content card',
    description:
      'Video embedded in a card with a title and description — the pattern for course lessons and media libraries.',
  },
]
