import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
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
    description:
      'AvatarGroup auto-overlaps children. Pass max + total and render at most max − 1 avatars — the +N chip covers the rest.',
  },
  {
    title: 'With image (broken → fallback)',
    description: 'If AvatarImage fails to load, AvatarFallback renders automatically.',
  },
]
