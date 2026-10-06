import type { AngularStory } from './stories'

/** Story cards for the clipboard Angular demo (titles mirror demos/react/clipboard.tsx). */
export const stories: AngularStory[] = [
  { title: 'Install command', description: 'The most common pattern — a copy icon next to an install or CLI command.' },
  {
    title: 'API key & secrets',
    description:
      'Copy a generated API key with a label and a longer timeout so users can confirm it landed in their clipboard.',
  },
  {
    title: 'Code snippets',
    description: 'A copy button anchored to a git clone command and a config snippet — the docs-site staple.',
  },
  {
    title: 'Contact details',
    description: 'Copy an email or URL with a custom tooltip so users know exactly what they are copying.',
  },
  {
    title: 'Label-only & custom render prop',
    description: 'hideIcon shows just the label; the children render-prop lets you render fully custom copy UI.',
  },
  {
    title: 'Button-styled',
    description: 'Apply button classes via the className prop for a prominent copy action in toolbars.',
  },
  {
    title: 'Event log',
    description: 'copy / success / error events fire at each stage — the log below updates live as you copy.',
  },
]
