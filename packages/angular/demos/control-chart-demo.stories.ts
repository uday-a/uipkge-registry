import type { AngularStory } from './stories'

/** Story cards for the control-chart Angular demo (titles + descriptions mirror demos/react/control-chart.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Build times',
    description: 'Mean ± 2σ limits auto-compute; the spike turns red.',
  },
  {
    title: 'Fixed spec limits',
    description: 'Override with contractual UCL/LCL.',
  },
  {
    title: 'Clearance hours',
    description: 'Air cargo customs clearance per AWB batch — the breach flags a documentation exception.',
  },
]
