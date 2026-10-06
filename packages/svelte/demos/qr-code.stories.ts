import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Basic', description: 'Default QR code with URL value.' },
  { title: 'Sizes', description: 'Different sizes from small to large.' },
  { title: 'Custom Colors', description: 'Foreground and background color combinations.' },
  { title: 'SVG Type', description: 'Render as SVG instead of canvas.' },
  { title: 'With Icon', description: 'Embed a logo or icon in the center.' },
  { title: 'Error Levels', description: 'Different error correction levels (L/M/Q/H). Higher = more robust.' },
  { title: 'Borderless', description: 'Without the default border and padding.' },
  { title: 'Margin / Quiet Zone', description: 'Add quiet zone around the QR code.' },
  { title: 'Status', description: 'Active, expired, loading, and scanned states.' },
  { title: 'Long URL', description: 'Dense QR code from a long URL. Use larger size or higher error level.' },
  { title: 'Download', description: 'Click the download link to save the QR code as PNG.' },
  { title: 'Custom Content', description: 'Use the extra snippet for custom actions.' },
]
