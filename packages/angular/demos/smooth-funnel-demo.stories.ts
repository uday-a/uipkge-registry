import type { AngularStory } from './stories'

/** Story cards for the smooth-funnel Angular demo (titles mirror the React demo). */
export const stories: AngularStory[] = [
  {
    title: 'Basic three-stage funnel',
    description:
      'Three smoothly tapering stages with cubic-bezier transitions. Percent pills float at each stage centre.',
  },
  {
    title: 'Four-stage checkout',
    description:
      'One extra stage. The bezier control points (38% / 62%) keep the transitions smooth at any stage count.',
  },
  {
    title: 'Five stages, custom palette',
    description:
      'Pass colors to override the default per-index palette. Useful when the funnel sits next to other charts and you need to coordinate.',
  },
  {
    title: 'No labels',
    description:
      'Pass show-labels=false to drop the percent pills. Use when the funnel is one of many tiles on a dashboard and the absolute values live in a sibling table.',
  },
  {
    title: 'Compact',
    description:
      'A shorter height for in-card placement or sparkline-like use next to a KPI. The minHeight floor keeps tail stages visible even at small canvases.',
  },
]
