import type { AngularStory } from './stories'

/** Story cards for the parallel-chart Angular demo (titles mirror the React demo). */
export const stories: AngularStory[] = [
  {
    title: 'Multi-axis comparison',
    description:
      'Each polyline is one car; each axis is one attribute. Cross-axis correlations show as parallel-bundled lines; outliers cross at sharp angles.',
  },
  {
    title: 'Hover to focus a group',
    description:
      "emphasis.focus='series' dims unrelated polylines on hover — useful once 20+ rows start to turn the canvas into noise.",
  },
  {
    title: 'Smooth + bold strokes',
    description:
      'Smooth interpolation softens the zig-zag and lets line weight carry the visual hierarchy. Use for slide-deck snapshots where the shape matters more than exact values.',
  },
  {
    title: 'Single-group candidate scores',
    description:
      'Omit the groups prop when the cohort is homogenous — the legend disappears and the chrome quietens. Five interview candidates across four signals.',
  },
  {
    title: 'Compact',
    description:
      'A shorter height for sidebars and aside panels. Polylines stay legible because axes pack vertically — bandwidth is the horizontal direction.',
  },
]
