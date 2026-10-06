import type { AngularStory } from './stories'

/** Story cards for the avatar Angular demo (titles + descriptions mirror demos/react/avatar.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Sizes',
    description: 'Tailwind size-* utilities scale the avatar. Fallback text shrinks accordingly.',
  },
  {
    title: 'Stack',
    description: 'Negative spacing + ring-2 ring-background creates the overlap.',
  },
  {
    title: 'Avatar group',
    description: 'AvatarGroup auto-overlaps children and shows a +N overflow chip when max is exceeded.',
  },
  {
    title: 'With image (broken → fallback)',
    description: 'If AvatarImage fails to load, AvatarFallback renders automatically.',
  },
]
