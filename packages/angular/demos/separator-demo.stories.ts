import type { AngularStory } from './stories'

/** Story cards for the separator Angular demo (titles + descriptions mirror demos/react/separator.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Horizontal',
    description: "Default orientation. Adds a 1px line spanning the parent's width.",
  },
  {
    title: 'Vertical',
    description: "Use orientation='vertical' inside a flex container with explicit height.",
  },
]
