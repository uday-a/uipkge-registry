import type { AngularStory } from './stories'

/** Story cards for the image-cropper Angular demo (titles mirror demos/react/image-cropper.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Default',
    description: 'Square viewport. Drag to pan, scroll to zoom.',
  },
  {
    title: 'Show zoom',
    description: 'showZoom adds the range control. Same component, one prop.',
  },
  {
    title: '16 / 9',
    description: 'aspectRatio=16/9.',
  },
  {
    title: '4 / 3',
    description: 'aspectRatio=4/3.',
  },
  {
    title: 'Portrait',
    description: 'aspectRatio=3/4 on a tall source.',
  },
  {
    title: 'Circle',
    description: 'rounded=full for an avatar crop.',
  },
  {
    title: 'Banner',
    description: 'aspectRatio=21/9.',
  },
  {
    title: 'Zoom limits',
    description: 'minZoom and maxZoom clamp the slider and wheel.',
  },
  {
    title: 'Disabled',
    description: 'disabled ignores pointer and keyboard.',
  },
  {
    title: 'No zoom control',
    description: 'Wheel and + / − still work when showZoom is omitted.',
  },
]
