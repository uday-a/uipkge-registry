import type { AngularStory } from './types'

export const stories: AngularStory[] = [
  {
    title: 'Default',
    description: 'title + description. Default size, done state, file media.',
  },
  {
    title: 'State',
    description: 'state drives idle, uploading, processing, error, and done.',
  },
  {
    title: 'Size',
    description: 'size is default, sm, or xs.',
  },
  {
    title: 'Orientation',
    description: 'orientation=vertical stacks media above the title.',
  },
  {
    title: 'Media',
    description: 'media is file, image, or code. src fills the thumbnail when media is image.',
  },
  {
    title: 'Removable',
    description: 'removable adds a close control. Listen for onRemove.',
  },
  {
    title: 'Title only',
    description: 'description is optional.',
  },
  {
    title: 'Long title',
    description: 'Overflow truncates inside the chip.',
  },
  {
    title: 'Small removable image',
    description: 'Combine size, media, src, and removable.',
  },
  {
    title: 'Idle image drop',
    description: 'idle + media=image is the empty chip before a file is chosen.',
  },
]
