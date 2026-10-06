import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Cloud Adoption by US State',
    description:
      'Interactive pointy-top 51-node hex cartogram of the United States with automatic color scale ramp, state selection, and hover telemetry cards.',
  },
  {
    title: 'Edge Network Round-Trip Latency',
    description: 'US state network diagnostics with custom status-based colors, inline metric values, and click-to-focus.',
  },
  {
    title: 'FiveThirtyEight-Style Square Tile Grid Cartogram',
    description:
      'Equal-area square tile grid mapping where each state receives uniform spatial weight, eliminating geographic size distortion in demographic metrics.',
  },
  {
    title: 'World Regions Hex Cartogram',
    description:
      'Hexagonal cartogram encompassing primary global economic corridors across North America, Europe, East Asia, and the Pacific.',
  },
]
