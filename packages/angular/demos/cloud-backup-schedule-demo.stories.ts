import type { AngularStory } from './stories'

/** Story cards for the cloud-backup-schedule Angular demo (titles mirror the React demo). */
export const stories: AngularStory[] = [
  {
    title: 'Default Schedule',
    description: 'Automated daily backup schedule with vault quota gauge and AES-256 encryption status.',
  },
  {
    title: 'High Storage Utilization',
    description: 'Backup scheduler showing near-capacity storage quota requiring retention adjustment.',
  },
  {
    title: 'Manual Only Mode',
    description: 'Daily automation disabled with long-term retention policy for enterprise archiving.',
  },
]
