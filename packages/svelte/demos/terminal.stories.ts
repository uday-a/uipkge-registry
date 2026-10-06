import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Project setup', description: 'Command history with prompt, command, and output lines.' },
  { title: 'Typing animation', description: 'Lines type in one-by-one when typing is enabled.' },
  { title: 'Theme variants', description: 'Dark and light window themes.' },
  { title: 'Custom shell prompt', description: 'Override the prompt character per terminal.' },
  { title: 'Error output', description: 'Output-only lines for logs and failures.' },
]
