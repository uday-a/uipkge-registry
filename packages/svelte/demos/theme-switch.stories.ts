import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Cards', description: 'Full section card with a 3-button grid. The settings-page default.' },
  { title: 'Icons', description: 'Compact segmented icon row without labels.' },
  { title: 'Icon only', description: 'Single header-grade icon button that cycles light/dark.' },
  { title: 'Dropdown', description: 'Trigger button opening a menu of states.' },
  { title: 'Pill', description: 'Equal segments with a sliding indicator.' },
  { title: 'Pill — 4 states', description: 'Pill with the extra black theme.' },
  { title: 'Switch', description: 'iOS-style 2-state toggle with a sliding thumb.' },
]
