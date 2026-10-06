import type { AngularStory } from './stories'

/** Story cards for the scroll-progress Angular demo (titles mirror demos/react/scroll-progress.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Default',
    description:
      'Fixed three-pixel bar in var(--primary), pinned to the viewport top. Scroll the page — every fixed story below tracks the same depth.',
  },
  {
    title: 'Thick editorial',
    description: 'height={6} turns the bar into part of the reading experience — magazine-style, unmissable.',
  },
  {
    title: 'Hairline',
    description: 'A two-pixel bar in muted-foreground — quiet enough for dense dashboards and docs.',
  },
  {
    title: 'Brand gradient',
    description: 'color accepts any CSS value, including gradients — applied directly to background.',
  },
  { title: 'Destructive accent', description: 'var(--destructive) suits warnings and time-boxed reading flows.' },
  {
    title: 'Smooth off',
    description: 'smooth={false} tracks scroll 1:1 with no lerp — compare it against the smoothed lanes above.',
  },
  {
    title: 'Contained mode',
    description:
      'position="absolute" plus container measures a scrollable box instead of the page — pass the element via ref.',
  },
  {
    title: 'Article composition',
    description: 'Header, meta row, and the bar working together in a reading context.',
  },
  {
    title: 'With BackTop',
    description: 'Compose with the back-top primitive — the bar shows depth, the button offers the way back.',
  },
  {
    title: 'Above a sticky header',
    description: 'z-50 keeps the bar riding above a mocked sticky header strip at z-40 as the page scrolls.',
  },
]
