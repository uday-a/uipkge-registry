import type { AngularStory } from './stories'

/** Story cards for the lazy-image Angular demo (titles + descriptions mirror demos/react/lazy-image.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Default',
    description:
      "loading='lazy' plus IntersectionObserver hold. Skeleton placeholder fades to image on load. Aspect ratio reserved up front to avoid layout shift.",
  },
  {
    title: 'Aspect ratios',
    description:
      'Pass aspectRatio as a string (16/9, 1/1, etc.) or a number. Container reserves the slot before the image arrives.',
  },
  {
    title: 'Cover vs contain',
    description:
      "cover (default) crops to fill, contain letterboxes. Useful when the image aspect ratio doesn't match the container.",
  },
  {
    title: 'Error fallback (slot + URL)',
    description:
      "On error: render the fallback slot if provided, else the fallback URL, else a 'Image unavailable' placeholder.",
  },
  {
    title: 'Eager',
    description:
      "eager skips the IntersectionObserver hold and uses loading='eager' + decoding='sync'. Use for above-the-fold hero images.",
  },
  {
    title: 'Swap src',
    description: 'Updating the src resets state to loading and re-runs the placeholder + fade flow.',
  },
]
