import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'User directory table',
    description: 'Created and last-active columns in a user directory table. Hover any timestamp for the full localized datetime.',
  },
  {
    title: 'Inside status chips and badges',
    description: 'Relative time nested in chips and badges for filter toolbars, sync banners, and card status headers.',
  },
  {
    title: 'Audit log event stream',
    description: 'Event cards with category tags, action description, and live relative timestamps in the header.',
  },
  {
    title: 'Git commit history',
    description: 'Commit list with Kbd hashes, message summaries, author tags, and compact narrow relative times.',
  },
  {
    title: 'Scheduled jobs (future deltas)',
    description: "Future timestamps format seamlessly with positive phrases ('in 20 minutes', 'tomorrow', 'in 3 days').",
  },
  {
    title: 'Multi-timezone matrix',
    description: 'The same global release event rendered across multiple target IANA time zones with absolute time.',
  },
  {
    title: 'Combined relative and absolute format',
    description: "display='both' prints the human relative delta alongside the formatted clock time.",
  },
  {
    title: 'Density styles comparison',
    description: "Compare formatStyle='long' vs 'short' vs 'narrow' for compact badges and narrow columns.",
  },
  {
    title: 'ISO string parsing (naive vs UTC)',
    description:
      "parseAs='utc' forces timezone-less ISO strings ('2026-08-14T12:00:00') to parse as UTC instead of local.",
  },
]
