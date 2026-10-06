import type { AngularStory } from './stories'

/** Story cards for the bubble-map Angular demo (titles + descriptions mirror demos/react/bubble-map.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Global Compute Clusters',
    description:
      'Proportional symbol bubble map displaying active container nodes across worldwide infrastructure regions. Circle radius mathematically scales with volume, avoiding geographic landmass bias.',
  },
  {
    title: 'Cyber Incident Threat Radar',
    description:
      'Critical security events visualizer with pulsing radar rings and severity status color tokens (Destructive, Warning, Active).',
  },
]
