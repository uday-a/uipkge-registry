import type { AngularStory } from './stories'

/** Story cards for the resizable Angular demo (titles + descriptions mirror demos/react/resizable.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Default',
    description: 'Nested horizontal and vertical panel groups with draggable handles.',
  },
  {
    title: 'Horizontal only',
    description: 'Two panels split left/right by a vertical divider.',
  },
  {
    title: 'Vertical only',
    description: 'Stack panels vertically — drag the horizontal handle to resize.',
  },
  {
    title: 'Three panels',
    description: 'Two handles between three panels — typical IDE layout.',
  },
  {
    title: 'Min-size constraints',
    description: 'Panels respect min-size — try dragging the handle to either edge.',
  },
  {
    title: 'Visible handle',
    description: 'Pass with-handle to render a grip indicator on the divider.',
  },
]
