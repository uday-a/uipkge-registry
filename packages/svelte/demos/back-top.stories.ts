import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'In a long article',
    description:
      'A realistic reading surface — scroll the card and the button fades in at the bottom-right once you pass the threshold.',
  },
  {
    title: 'Page-level (live)',
    description:
      'One live instance bound to the window. Scroll the whole page down past 200px and the button appears in the corner.',
  },
  {
    title: 'Visibility events',
    description: 'The onvisiblechange callback fires whenever the button toggles. Scroll the list to populate the log.',
  },
  {
    title: 'Size variants',
    description: 'sm, default, and lg shown in matched containers so the relative scale reads at a glance.',
  },
  {
    title: 'Custom icon',
    description:
      "Override the default arrow via the icon snippet — useful when the action is 'jump to section' rather than 'to top'.",
  },
  {
    title: 'Edge anchors',
    description: 'Four corner positions for the floating button. Each preview box is a positioned container.',
  },
  {
    title: 'Threshold & behavior',
    description:
      'threshold controls when the button appears (default 200px); behavior switches between smooth and instant scroll.',
  },
]
