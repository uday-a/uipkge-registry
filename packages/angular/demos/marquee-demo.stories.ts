import type { AngularStory } from './stories'

/** Story cards for the marquee Angular demo (titles mirror demos/react/marquee.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Horizontal (default)',
    description: 'Content scrolls leftward. The slot is duplicated for a seamless loop.',
  },
  { title: 'Direction right', description: "direction='right' reverses the travel direction." },
  { title: 'Speed', description: 'speed is the animation duration in seconds. Lower = faster.' },
  { title: 'Slow', description: 'A high speed value produces a slow, ambient scroll.' },
  { title: 'Pause on hover', description: 'Hover the row to freeze the animation.' },
  { title: 'Paused', description: 'paused=true hard-stops the animation.' },
  { title: 'Gap', description: 'gap controls spacing between repeated groups (px).' },
  { title: 'Repeat', description: 'repeat sets how many copies of the slot are rendered.' },
  { title: 'Vertical', description: "orientation='vertical' scrolls content upward." },
  { title: 'Vertical down', description: "direction='down' reverses the vertical travel." },
  { title: 'Avatars row', description: 'A common use case: an infinite logo / avatar strip.' },
]
