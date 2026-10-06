import type { AngularStory } from './stories'

export const stories: AngularStory[] = [
  {
    title: 'Interactive Project Timeline',
    description: 'Multi-scale project timeline with task tree, duration counters, progress fill, and scale switcher.',
  },
  {
    title: 'Parent Deliverables & Subtask Rollups',
    description: 'Collapsible group deliverables with nested child deliverables and summary completion brackets.',
  },
  {
    title: 'Dependencies & Critical Path',
    description: 'Tasks linked with dashed directional SVG bezier connections showing prerequisite blockers.',
  },
  {
    title: 'Week Scale View',
    description: 'Aggregated 7-day columns for high-level sprint planning and long-term milestones.',
  },
  {
    title: 'Month Scale View',
    description: 'Quarterly and annual overview for executive roadmaps and cross-team alignment.',
  },
  {
    title: 'Health & Status Colors',
    description:
      'Calibrated status colors for Completed (Green), In Progress (Brand), At Risk (Amber), and Blocked (Destructive).',
  },
  {
    title: 'Compact Mini Widget',
    description: 'Dense 32px row height and slim tree width designed for dashboard sidebars and summary cards.',
  },
  {
    title: 'Reactive Task Selection',
    description: 'Clicking any deliverable bar or tree row emits a task-click event to inspect task details.',
  },
  {
    title: 'Task Context Menu',
    description: 'Right-click a task for View Details, status/priority submenus, copy ID, duplicate, and delete.',
  },
]
