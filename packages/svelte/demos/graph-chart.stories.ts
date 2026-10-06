import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Service dependency map',
    description:
      'Force-directed layout with categorical colouring and arrowheads pointing at the dependency target. Standard shape for runtime architecture diagrams.',
  },
  {
    title: 'Ring (circular layout)',
    description:
      'Same data, different layout. Circular reads well for cycle / token-passing diagrams where the cycle itself is the story.',
  },
  {
    title: 'With roam (pan + zoom)',
    description: 'Turn roam on once the graph passes ~25 nodes. Users can drag-pan and wheel-zoom into dense clusters.',
  },
  {
    title: 'Knowledge graph (undirected, weighted)',
    description:
      'Drop arrowheads when relationships are symmetric, vary node size via symbolSize to encode importance, and use link value to widen/narrow edges in the layout.',
  },
  {
    title: 'Compact',
    description:
      'A shorter height for in-card or side-panel placement. The force layout still resolves cleanly because the node count is small.',
  },
]
