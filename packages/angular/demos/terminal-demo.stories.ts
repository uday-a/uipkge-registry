import type { AngularStory } from './stories'

/** Story cards for the terminal Angular demo (titles mirror demos/react/terminal.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Project setup',
    description: 'The classic onboarding flow — scaffolding, installing deps, and starting the dev server.',
  },
  { title: 'Theme variants', description: 'Dark and light side by side for the same build output.' },
  { title: 'Typing animation', description: 'Lines appear one-by-one at 400ms — great for hero sections and demos.' },
  { title: 'Custom shell prompt', description: 'Per-line prompt strings mimic a real zsh theme with branch info.' },
  { title: 'Error output', description: 'Failed test results render with the same monospace fidelity as success.' },
  { title: 'Log stream', description: 'Output-only lines (no prompt) are ideal for server logs and CI tails.' },
  {
    title: 'Live log tail',
    description: 'Append lines at runtime — auto-scroll keeps the latest output pinned to the bottom.',
  },
  {
    title: 'In a docs card',
    description:
      'Terminal embedded inside a Card with a heading — the pattern used on landing pages and install sections.',
  },
]
