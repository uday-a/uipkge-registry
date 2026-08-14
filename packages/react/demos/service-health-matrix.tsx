import * as React from 'react'
import Story from '../../components/story/Story'
import {
  ServiceHealthMatrix,
  type RegionHealth,
  type ServiceHealthItem,
  type IncidentRecord,
  type DayStatus,
} from '@react-registry-blocks/service-health-matrix/ServiceHealthMatrix'

function generateDays(blips: Array<{ dayAgo: number; status: DayStatus }> = []): DayStatus[] {
  const days: DayStatus[] = Array.from({ length: 90 }, () => 'up')
  for (const blip of blips) {
    const idx = 89 - blip.dayAgo
    if (idx >= 0 && idx < 90) {
      days[idx] = blip.status
    }
  }
  return days
}

const degradedRegions: RegionHealth[] = [
  {
    id: 'us-east',
    name: 'US East',
    location: 'N. Virginia',
    code: 'us-east-1',
    latency: 24,
    status: 'operational',
    uptime: 100,
    p95Latency: 28,
    packetLoss: 0.0,
    latencyHistory: [26, 25, 24, 25, 23, 24, 25, 24, 23, 24, 25, 24],
  },
  {
    id: 'us-west',
    name: 'US West',
    location: 'Oregon',
    code: 'us-west-2',
    latency: 38,
    status: 'operational',
    uptime: 99.98,
    p95Latency: 42,
    packetLoss: 0.0,
    latencyHistory: [40, 39, 38, 37, 38, 39, 38, 38, 37, 38, 39, 38],
  },
  {
    id: 'eu-central',
    name: 'EU Central',
    location: 'Frankfurt',
    code: 'eu-central-1',
    latency: 18,
    status: 'operational',
    uptime: 100,
    p95Latency: 21,
    packetLoss: 0.0,
    latencyHistory: [19, 18, 18, 17, 18, 19, 18, 18, 17, 18, 18, 18],
  },
  {
    id: 'ap-south',
    name: 'AP South',
    location: 'Mumbai',
    code: 'ap-south-1',
    latency: 118,
    status: 'degraded',
    uptime: 98.45,
    p95Latency: 142,
    packetLoss: 0.85,
    latencyHistory: [45, 52, 68, 85, 96, 104, 118, 112, 115, 118],
  },
  {
    id: 'ap-east',
    name: 'AP East',
    location: 'Tokyo',
    code: 'ap-northeast-1',
    latency: 32,
    status: 'operational',
    uptime: 99.99,
    p95Latency: 36,
    packetLoss: 0.0,
    latencyHistory: [34, 33, 32, 31, 32, 33, 32, 32, 31, 32, 33, 32],
  },
  {
    id: 'sa-east',
    name: 'SA East',
    location: 'São Paulo',
    code: 'sa-east-1',
    latency: 164,
    status: 'degraded',
    uptime: 97.2,
    p95Latency: 195,
    packetLoss: 1.2,
    latencyHistory: [58, 62, 89, 120, 145, 160, 172, 164],
  },
]

const outageServices: ServiceHealthItem[] = [
  {
    id: 'auth-api',
    name: 'Authentication API',
    description: 'OAuth2 / SAML SSO · Session Tokens · JWT Validation',
    icon: 'auth',
    uptime: 99.99,
    status: 'operational',
    days: generateDays(),
  },
  {
    id: 'edge-cdn',
    name: 'Edge CDN & DNS',
    description: 'Anycast Global Routing · Edge Cache · SSL Termination',
    icon: 'cdn',
    uptime: 100.0,
    status: 'operational',
    days: generateDays(),
  },
  {
    id: 'postgres-cluster',
    name: 'Postgres Database Cluster',
    description: 'Primary Write Node · Regional Read Replicas · Pooler',
    icon: 'database',
    uptime: 99.97,
    status: 'operational',
    days: generateDays([{ dayAgo: 42, status: 'degraded' }]),
  },
  {
    id: 'webhook-dispatcher',
    name: 'Webhook Dispatcher',
    description: 'Event Streaming Engine · Exponential Backoff Retries',
    icon: 'webhook',
    uptime: 99.98,
    status: 'operational',
    days: generateDays([{ dayAgo: 1, status: 'degraded' }]),
  },
  {
    id: 'ai-gateway',
    name: 'AI Inference Gateway',
    description: 'Model Routing · Streaming Token Buffers · Semantic Cache',
    icon: 'ai',
    uptime: 94.8,
    status: 'outage',
    days: generateDays([
      { dayAgo: 0, status: 'down' },
      { dayAgo: 18, status: 'degraded' },
    ]),
  },
]

const activeIncidents: IncidentRecord[] = [
  {
    id: 'inc-live-1',
    title: 'Elevated 504 Timeouts on AI Inference Gateway',
    date: 'Today · Ongoing for 14 minutes',
    severity: 'critical',
    resolved: false,
    duration: '14 minutes (Active)',
    updates: [
      {
        time: '16:02 UTC',
        status: 'Mitigating',
        description:
          'Traffic is actively being rerouted to warm inference standby replicas in us-west-2 while upstream gateway instances restart.',
      },
      {
        time: '15:48 UTC',
        status: 'Investigating',
        description:
          'We have detected an elevated rate of 504 Gateway Timeouts across streaming completions endpoints. Engineers are investigating root cause.',
      },
    ],
  },
]

const maintenanceServices: ServiceHealthItem[] = [
  {
    id: 'auth-api',
    name: 'Authentication API',
    description: 'OAuth2 / SAML SSO · Session Tokens · JWT Validation',
    icon: 'auth',
    uptime: 99.99,
    status: 'operational',
    days: generateDays(),
  },
  {
    id: 'postgres-cluster',
    name: 'Postgres Database Cluster',
    description: 'Primary Write Node · Regional Read Replicas · Pooler',
    icon: 'database',
    uptime: 99.95,
    status: 'maintenance',
    days: generateDays([{ dayAgo: 0, status: 'maintenance' }]),
  },
]

const cleanServices: ServiceHealthItem[] = [
  {
    id: 'auth-api',
    name: 'Authentication API',
    description: 'OAuth2 / SAML SSO · Session Tokens · JWT Validation',
    icon: 'auth',
    uptime: 100.0,
    status: 'operational',
    days: generateDays(),
  },
  {
    id: 'edge-cdn',
    name: 'Edge CDN & DNS',
    description: 'Anycast Global Routing · Edge Cache · SSL Termination',
    icon: 'cdn',
    uptime: 100.0,
    status: 'operational',
    days: generateDays(),
  },
]

export default function ServiceHealthMatrixDemo() {
  return (
    <>
      <Story
        title="All Systems Operational"
        description="Standard statuspage health matrix view with all 6 global regions operational, 99.99% uptime baseline, and resolved incident logs."
      >
        <ServiceHealthMatrix />
      </Story>

      <Story
        title="Degraded Regional Latency"
        description="Telemetry highlighting elevated round-trip ping latency and packet loss in AP South and SA East regions."
      >
        <ServiceHealthMatrix systemStatus="degraded" systemUptime="99.42%" regions={degradedRegions} />
      </Story>

      <Story
        title="Active Outage Incident"
        description="Partial system outage status with an active un-resolved incident timeline and degraded 90-day availability ticks."
      >
        <ServiceHealthMatrix
          systemStatus="outage"
          systemUptime="98.90%"
          services={outageServices}
          incidents={activeIncidents}
        />
      </Story>

      <Story
        title="Scheduled Maintenance Window"
        description="Planned maintenance state with maintenance status pills and informational header banner."
      >
        <ServiceHealthMatrix systemStatus="maintenance" systemUptime="99.95%" services={maintenanceServices} />
      </Story>

      <Story
        title="Pristine 100% Availability"
        description="Clean infrastructure matrix with empty incident log and zero downtime over 90 days."
      >
        <ServiceHealthMatrix systemStatus="operational" systemUptime="100.0%" services={cleanServices} incidents={[]} />
      </Story>
    </>
  )
}
