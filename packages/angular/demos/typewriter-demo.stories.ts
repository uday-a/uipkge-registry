import type { AngularStory } from './stories'

/** Story cards for the typewriter Angular demo (titles mirror demos/react/typewriter.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Single phrase',
    description: 'Pass a string to type one phrase. The caret keeps blinking once typing completes.',
  },
  {
    title: 'Three-phrase loop',
    description: 'Pass an array to cycle phrases — type, hold, delete, next. Loops forever by default.',
  },
  {
    title: 'No loop',
    description: 'With loop=false the sequence stops after fully typing the last phrase; the caret keeps blinking.',
  },
  {
    title: 'Slow typing',
    description: 'typingSpeed is milliseconds per character — 120ms gives a deliberate, dramatic pace.',
  },
  { title: 'Fast typing', description: '18ms per character reads like a live feed or terminal stream.' },
  {
    title: 'Long pause',
    description: 'pause holds each completed phrase before deleting — 3500ms gives readers time to actually read it.',
  },
  {
    title: 'Delayed start',
    description:
      'startDelay waits before the first character types. Pair it with hint text so the slot never looks broken.',
  },
  {
    title: 'Terminal style',
    description: 'Compose with font-mono on a dark panel — the caret inherits the text color via bg-current.',
  },
  {
    title: 'Hero heading',
    description: 'Drop into a heading — the caret scales with the font because its height is 1em.',
  },
  {
    title: 'AI response',
    description: 'A long multi-sentence phrase typed quickly in muted foreground mimics a streaming model answer.',
  },
  { title: 'No caret', description: 'showCaret=false hides the cursor entirely — useful for one-shot reveals.' },
]
