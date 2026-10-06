import type { AngularStory } from './stories'

/** Story cards for the cascade-select Angular demo (titles + descriptions mirror demos/react/cascade-select.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Region picker',
    description: 'Three-level cascade for province → city → district, as used in address forms.',
  },
  {
    title: 'Product category',
    description: 'E-commerce category drill-down — department → sub-category → product type.',
  },
  {
    title: 'Size variants',
    description: 'Small, default, and large triggers for different form densities.',
  },
  {
    title: 'States & restrictions',
    description: 'Loading spinner, fully disabled control, and individual disabled options in one view.',
  },
  {
    title: 'Custom separator',
    description: "Display the selected path with a ' > ' separator instead of the default ' / '.",
  },
  {
    title: 'In context: Shipping address',
    description: 'Cascade inside a checkout card. Searchable so users can type to find their district quickly.',
  },
]
