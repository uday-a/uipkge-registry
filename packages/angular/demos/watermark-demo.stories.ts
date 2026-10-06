import type { AngularStory } from './stories'

/** Story cards for the watermark Angular demo (titles mirror demos/react/watermark.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Confidential document',
    description: 'A diagonal CONFIDENTIAL stamp deters screenshots of sensitive internal reports.',
  },
  { title: 'Draft card', description: 'Mark work-in-progress content so reviewers know it is not final.' },
  {
    title: 'Internal report',
    description:
      'A subtle INTERNAL mark across a financial summary — visible enough to signal scope, quiet enough to read past.',
  },
  {
    title: 'Angle & density variants',
    description:
      'Horizontal (0°), default (-22°), and steep (-45°) at three gap settings — pick the tiling that fits your content.',
  },
  {
    title: 'Opacity & color',
    description: 'From barely-there (0.04) to prominent (0.2), with a branded blue accent for marketing assets.',
  },
  {
    title: 'Interactive overlay',
    description:
      'interactive=true captures pointer events, locking the content behind the watermark — useful for preview-only views.',
  },
  {
    title: 'Image watermark',
    description: 'Pass an image URL to tile a logo or avatar across the content instead of text.',
  },
]
