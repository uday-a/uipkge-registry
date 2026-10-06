import type { AngularStory } from './stories'

/** Story cards for the organization-chart Angular demo (titles mirror demos/react/organization-chart.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Acme Inc. leadership',
    description:
      'A real company reporting structure — CEO at the top, three VPs, and their direct reports with avatars and titles.',
  },
  {
    title: 'With department badges',
    description:
      'Use the renderNode prop to render a department badge inside each card — useful for filtering by team.',
  },
  {
    title: 'Horizontal layout',
    description:
      "direction='left-right' flows the tree sideways — better for wide orgs with many direct reports per level.",
  },
  {
    title: 'Zoomable explorer',
    description: 'Add zoom controls plus expand/collapse-all for large orgs where users need to navigate and resize.',
  },
  {
    title: 'Collapsed by default',
    description: 'Start with only the root visible — users drill into the branches they care about.',
  },
  {
    title: 'In a reporting card',
    description: 'The chart embedded in a Card with a header — how it looks in a People or HR dashboard section.',
  },
  {
    title: 'Initials fallback',
    description: "Nodes without an avatar show colored initials — the default for ICs who haven't uploaded a photo.",
  },
]
