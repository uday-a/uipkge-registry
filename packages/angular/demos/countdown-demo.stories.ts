import type { AngularStory } from './stories'

/** Story cards for the countdown Angular demo (titles mirror demos/react/countdown.tsx). */
export const stories: AngularStory[] = [
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
  {
    title: 'Format variants',
    description: 'DD:HH:MM:SS, HH:MM:SS, MM:SS, and SS — choose the precision your scenario needs.',
  },
  {
    title: 'Custom unit cards',
    description: 'Render props let you render each unit as a tile — perfect for hero countdowns and launch pages.',
  },
  {
    title: 'Paused & styling',
    description: 'paused freezes the countdown; a custom separator and no-pad give it a distinct look.',
  },
  { title: 'New year', description: 'Countdown to January 1st of next year — a perennial landing-page fixture.' },
]
