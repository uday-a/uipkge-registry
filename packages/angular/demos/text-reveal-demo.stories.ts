import type { AngularStory } from './stories'

/** Story cards for the text-reveal Angular demo (titles mirror demos/react/text-reveal.tsx). */
export const stories: AngularStory[] = [
  { title: 'Default', description: 'Word-by-word reveal on a heading. Scroll it into view to trigger.' },
  { title: 'Character mode', description: 'Per-character stagger on a short word.' },
  {
    title: 'No blur',
    description: 'Fade and rise only — blur disabled for small sizes where blur reads as smudge.',
  },
  { title: 'Slow cinematic', description: 'Long duration and wide stagger for hero moments.' },
  { title: 'Snappy', description: 'Fast duration and tight stagger for UI chrome.' },
  { title: 'Paragraph', description: 'Longer body copy reveals word by word at reading size.' },
  { title: 'With GradientText', description: 'Composed with the gradient-text primitive for a branded headline.' },
  { title: 'Replayable', description: 'once=false re-hides when scrolled out — scroll away and back to replay.' },
  { title: 'Inside a card', description: 'Section header reveal within a SectionCard.' },
  { title: 'Display size', description: 'Large display heading with tight tracking.' },
  { title: 'Caption / meta', description: 'Small uppercase meta text with a gentle stagger.' },
]
