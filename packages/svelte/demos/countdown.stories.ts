import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Flash sale',
    description: 'A 5-hour countdown on a promotional banner — the classic e-commerce urgency pattern.',
  },
  {
    title: 'Auction ending',
    description: 'Seconds-only countdown that fires finish when the bidding window closes. Reset to watch it again.',
  },
  {
    title: 'Event countdown',
    description: 'Full DD:HH:MM:SS display for a conference or product launch two days away.',
  },
  { title: 'Format variants', description: 'Compact HH:MM:SS, MM:SS, and SS formats roll up the larger units.' },
  {
    title: 'Custom unit cards',
    description: 'Override the default rendering with the children snippet — parts, display string, and finished.',
  },
  { title: 'Paused & styling', description: 'Pause the timer and resume it without losing the target.' },
  { title: 'New year', description: 'A Date target counting down to January 1st.' },
]
