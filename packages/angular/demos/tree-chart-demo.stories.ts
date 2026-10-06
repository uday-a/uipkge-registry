import type { AngularStory } from './stories'

/** Story cards for the tree-chart Angular demo (titles mirror the React demo). */
export const stories: AngularStory[] = [
  {
    title: 'Left-to-right (file tree)',
    description: 'Default LR orientation. Good for nested file systems, expression trees, decision trees.',
  },
  {
    title: 'Top-down org chart',
    description: "orient='TB' for the classic management chart layout — root at the top, descendants fanning down.",
  },
  {
    title: 'Radial',
    description:
      'Hierarchy radiating from a central root. Works well for medium-depth trees where horizontal real estate is tight (modals, side panels).',
  },
  {
    title: 'With roam (decision tree)',
    description:
      'Set roam=true to enable drag-to-pan and wheel-zoom. Worth it once the tree spills past the viewport. Pre-collapsed branches use the collapsed flag.',
  },
  {
    title: 'Right-to-left compact',
    description: "orient='RL' mirrors the default — handy for sidebar layouts where the root anchors to the right edge.",
  },
]
