import Story from '../../components/story/Story'
import {
  DailyStandupSummary,
  type BlockerAlert,
  type StandupMember,
  type StandupPulseMetrics,
} from '@react-registry-blocks/daily-standup-summary/DailyStandupSummary'

// Story 2: All Green / Healthy Sprint
const allGreenPulse: StandupPulseMetrics = {
  submissionsCount: 6,
  totalMembers: 6,
  activeBlockersCount: 0,
  blockersHighlight: 'Zero blockers across all sprint epics',
  goalsOnTrackCount: 10,
  totalGoals: 10,
  sprintName: 'Sprint 42 · Release Candidate v2.4.0',
  deploymentsPlannedCount: 4,
  deploymentsHighlight: '4 production services staged for rollout',
}

const allGreenMembers: StandupMember[] = [
  {
    id: 'ag-1',
    name: 'Elena Rostova',
    role: 'Principal Engineer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    fallback: 'ER',
    submittedAt: '08:45 AM',
    timezone: 'UTC+2 · Berlin',
    status: 'on-track',
    statusLabel: 'On Track',
    yesterday: [
      'Merged RFC #142 zero-runtime CSS tokens migration',
      'Completed architectural audit of headless popovers',
    ],
    today: ['Tagging v2.4.0 final release notes and changelog', 'Reviewing automated e2e synthetic benchmarks'],
    blockers: null,
    reactions: [
      { emoji: '🚀', count: 5, active: true },
      { emoji: '🎉', count: 4, active: true },
    ],
    threadCount: 2,
  },
  {
    id: 'ag-2',
    name: 'David Chen',
    role: 'Full-Stack Engineer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    fallback: 'DC',
    submittedAt: '09:02 AM',
    timezone: 'UTC-7 · San Francisco',
    status: 'on-track',
    statusLabel: 'On Track',
    yesterday: [
      'Shipped webhook signature HMAC verification endpoints',
      'Completed GraphQL schema federation benchmark tests',
    ],
    today: [
      'Updating documentation for webhook retry idempotency keys',
      'Preparing demo walkthrough for product team sync',
    ],
    blockers: null,
    reactions: [
      { emoji: '🔥', count: 6, active: true },
      { emoji: '👍', count: 3, active: false },
    ],
    threadCount: 0,
  },
]

// Story 3: Emergency Critical Multi-Blocker Mode
const emergencyPulse: StandupPulseMetrics = {
  submissionsCount: 5,
  totalMembers: 6,
  pendingMemberName: 'Marcus Vance (Investigating Outage)',
  activeBlockersCount: 2,
  blockersHighlight: 'Database replication lag & IAM KMS outage',
  goalsOnTrackCount: 6,
  totalGoals: 10,
  sprintName: 'Sprint 42 · At Risk',
  deploymentsPlannedCount: 0,
  deploymentsHighlight: 'Deploy freeze active during incident triage',
}

const emergencyBlocker: BlockerAlert = {
  id: 'blk-db-repl-01',
  title: 'CRITICAL: Read replica lag exceeding 450s in US-East primary cluster',
  description:
    'Postgres WAL streaming replication buffer overflow detected during heavy batch ingestion. Writes are queueing; manual replica resync required before any new deployments can proceed.',
  authorName: 'Marcus Vance',
  authorRole: 'Infrastructure Lead',
  reportedAt: '12m ago',
  ticketId: 'INC-8491',
  scope: 'Production DB Cluster (US-East)',
  assignedSquad: '#sec-ops-incident-room',
}

// Story 4: DevOps & Platform Engineering Squad
const platformPulse: StandupPulseMetrics = {
  submissionsCount: 4,
  totalMembers: 4,
  activeBlockersCount: 1,
  blockersHighlight: 'Pending HashiCorp Vault certificate renewal',
  goalsOnTrackCount: 7,
  totalGoals: 8,
  sprintName: 'Infra Sprint 18 · Kubernetes 1.30 Upgrade',
  deploymentsPlannedCount: 5,
  deploymentsHighlight: '3 k8s nodes · 2 edge proxies',
}

const platformMembers: StandupMember[] = [
  {
    id: 'plat-1',
    name: 'Kaito Tanaka',
    role: 'Cloud Security Architect',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    fallback: 'KT',
    submittedAt: '08:30 AM',
    timezone: 'UTC+9 · Tokyo',
    status: 'on-track',
    statusLabel: 'On Track',
    yesterday: [
      'Rotated TLS root CA certificates across Cloudflare zero-trust tunnels',
      'Configured automated SIEM audit log forwarding to cold S3 tier',
    ],
    today: [
      'Writing automated Terraform compliance policies for S3 bucket ACLs',
      'Running penetration testing suite against new OAuth2 token brokers',
    ],
    blockers: null,
    reactions: [
      { emoji: '🛡️', count: 4, active: true },
      { emoji: '⚡', count: 2, active: false },
    ],
    threadCount: 1,
  },
  {
    id: 'plat-2',
    name: 'Maya Lin',
    role: 'SRE / Observability Lead',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    fallback: 'ML',
    submittedAt: '09:10 AM',
    timezone: 'UTC+1 · Amsterdam',
    status: 'blocked',
    statusLabel: 'Blocked',
    blockerSeverity: 'critical',
    yesterday: [
      'Migrated Grafana Mimir metrics cluster to distributed TSDB storage',
      'Reduced synthetic latency alerting flakiness by 80%',
    ],
    today: [
      'Configuring OpenTelemetry collector daemonsets on staging k8s nodes',
      'Creating SLO dashboard for checkout service p99 latencies',
    ],
    blockers: 'Blocked on HashiCorp Vault certificate renewal hook. Waiting on infra lead approval.',
    reactions: [
      { emoji: '🚨', count: 2, active: true },
      { emoji: '👀', count: 3, active: false },
    ],
    threadCount: 3,
  },
]

export default function DailyStandupSummaryDemo() {
  return (
    <>
      <Story
        title="Default"
        description="Slack/Geekbot style async engineering daily standup summary with squad pulse cards, active KMS blocker alert, and 4 member submissions."
      >
        <DailyStandupSummary />
      </Story>

      <Story
        title="All Green & Healthy Sprint"
        description="100% submissions in with zero blockers, release candidate v2.4.0 staged, and all sprint velocity goals on track."
      >
        <DailyStandupSummary
          teamName="Core Framework Squad"
          date="Today · Friday, Aug 21, 2026"
          pulseMetrics={allGreenPulse}
          blockerAlert={null}
          members={allGreenMembers}
        />
      </Story>

      <Story
        title="Critical Incident Multi-Blocker Mode"
        description="High-severity incident triage state with active read replica lag alert and deployment freeze."
      >
        <DailyStandupSummary
          teamName="Reliability & Data Infrastructure"
          date="Today · Friday, Aug 21, 2026"
          pulseMetrics={emergencyPulse}
          blockerAlert={emergencyBlocker}
        />
      </Story>

      <Story
        title="Platform & DevOps Squad"
        description="Dedicated platform engineering standup tracking Kubernetes upgrades, Vault TLS rotations, and Mimir TSDB storage."
      >
        <DailyStandupSummary
          teamName="Platform & Security Engineering"
          date="Today · Friday, Aug 21, 2026"
          pulseMetrics={platformPulse}
          members={platformMembers}
        />
      </Story>

      <Story
        title="Filtered View: Blocked Items"
        description="Standup board pre-filtered to highlight team members with active blockers requiring immediate attention."
      >
        <DailyStandupSummary initialFilter="blocked" />
      </Story>

      <Story
        title="Filtered View: Needs Review"
        description="Standup board pre-filtered to highlight pull request reviews and pairing needs."
      >
        <DailyStandupSummary initialFilter="needs-review" />
      </Story>
    </>
  )
}
