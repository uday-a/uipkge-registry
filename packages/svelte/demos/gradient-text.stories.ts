import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Sunset preset', description: "preset='sunset' applies a warm orange-to-peach gradient." },
  { title: 'Ocean preset', description: "preset='ocean' applies a teal-to-light-blue gradient." },
  { title: 'Forest preset', description: "preset='forest' applies a deep-green-to-lime gradient." },
  { title: 'Rainbow preset', description: "preset='rainbow' spans the full spectrum." },
  { title: 'All presets', description: 'Every preset gradient in one row.' },
  { title: 'Custom from/to', description: 'from and to define a two-stop gradient.' },
  { title: 'Direction', description: 'direction controls the gradient axis.' },
  {
    title: 'Custom gradient',
    description: 'gradient accepts any full CSS gradient string (multi-stop, angled).',
  },
  { title: 'Animated', description: 'animated shifts the background position for a flowing effect.' },
  { title: 'Animated presets', description: 'All presets with the animated flag — each flows continuously.' },
  {
    title: 'Animation speed',
    description: 'animationDuration controls the flow speed (2s fast, 4s default, 8s slow).',
  },
  { title: 'Animated custom gradient', description: 'Multi-stop custom gradients animate beautifully.' },
  {
    title: 'Animated inline',
    description: 'Animated gradients work inline too — great for highlighting key terms.',
  },
  {
    title: 'Inline in a sentence',
    description: 'GradientText renders inline so it blends into surrounding text.',
  },
  { title: 'As heading', description: "Use as='h1' to render a semantic heading with gradient." },
]
