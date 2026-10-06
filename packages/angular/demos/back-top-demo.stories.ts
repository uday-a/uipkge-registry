import type { AngularStory } from './stories'

/** Story cards for the back-top Angular demo (titles + descriptions mirror demos/react/back-top.tsx). */
export const stories: AngularStory[] = [
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
    description: 'The onVisible event fires whenever the button toggles. Scroll the page above to populate the log.',
  },
  {
    title: 'Size variants',
    description: 'sm, default, and lg shown in matched containers so the relative scale reads at a glance.',
  },
  {
    title: 'Custom icon',
    description:
      "Override the default arrow via the icon prop — useful when the action is 'jump to section' rather than 'to top'.",
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
