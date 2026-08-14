import Story from '../../components/story/Story'
import * as React from 'react'
import { StatusMonitoring } from '@react-registry-blocks/status-monitoring/StatusMonitoring'

type Day = 'up' | 'degraded' | 'down' | 'maintenance' | 'none'

interface Svc {
  name: string
  days: Day[]
}

interface Inc {
  id: string
  date: Date
  title: string
  description: string
  duration: string
  severity: 'minor' | 'major' | 'critical'
  resolved?: boolean
}

const up = (n: number): Day[] => Array.from({ length: n }, () => 'up')
const run = (n: number, status: Day): Day[] => Array.from({ length: n }, () => status)

const degradedServices: Svc[] = [
  { name: 'API Gateway', days: [...up(87), ...run(3, 'degraded')] },
  { name: 'Web application', days: up(90) },
]

const degradedIncidents: Inc[] = [
  {
    id: 'live-1',
    date: new Date(),
    title: 'Elevated latency on API Gateway',
    description:
      'We are investigating elevated p95 latency on the API gateway. Requests are succeeding but slower than normal.',
    duration: 'Ongoing for 26 minutes',
    severity: 'minor',
    resolved: false,
  },
]

const outageServices: Svc[] = [
  { name: 'EU read replicas', days: [...up(87), ...run(3, 'down')] },
  { name: 'US cluster', days: up(90) },
  { name: 'Dashboard', days: up(90) },
]

const outageIncidents: Inc[] = [
  {
    id: 'live-2',
    date: new Date(),
    title: 'EU read replicas unreachable',
    description: 'Failover to US replicas is serving reads. Writes queue locally and replay automatically.',
    duration: 'Ongoing for 14 minutes',
    severity: 'critical',
    resolved: false,
  },
]

const maintenanceServices: Svc[] = [
  { name: 'Database cluster', days: [...up(84), ...run(1, 'maintenance'), ...up(5)] },
  { name: 'API Gateway', days: up(90) },
]

const manyServices: Svc[] = [
  { name: 'API Gateway', days: [...up(56), ...run(1, 'down'), ...up(33)] },
  { name: 'Web application', days: up(90) },
  { name: 'Dashboard', days: [...up(30), ...run(1, 'degraded'), ...up(59)] },
  { name: 'Webhooks', days: [...up(29), ...run(1, 'degraded'), ...up(60)] },
  { name: 'Background jobs', days: [...up(70), ...run(2, 'degraded'), ...up(18)] },
  { name: 'Email delivery', days: [...up(12), ...run(1, 'down'), ...up(77)] },
  { name: 'Search cluster', days: up(90) },
]

const cleanServices: Svc[] = [
  { name: 'API Gateway', days: up(90) },
  { name: 'Web application', days: up(90) },
]

const singleService: Svc[] = [
  { name: 'API Gateway', days: [...up(34), ...run(1, 'down'), ...up(54), ...run(1, 'degraded')] },
]

export default function StatusMonitoringDemo() {
  return (
    <>
      <Story title="All systems operational" description="Every service is up today, so the banner reads green.">
        <StatusMonitoring />
      </Story>

      <Story
        title="Degraded performance"
        description="Newest day degraded on one service flips the banner to warning and pins an active minor incident."
      >
        <StatusMonitoring services={degradedServices} incidents={degradedIncidents} />
      </Story>

      <Story
        title="Partial outage"
        description="Newest day down on one service flips the banner to destructive with an active critical incident."
      >
        <StatusMonitoring services={outageServices} incidents={outageIncidents} />
      </Story>

      <Story
        title="Maintenance window"
        description="Maintenance days render as info-colored segments and leave the banner operational."
      >
        <StatusMonitoring services={maintenanceServices} />
      </Story>

      <Story title="Many services" description="Seven services with varied histories keep rows scannable.">
        <StatusMonitoring services={manyServices} />
      </Story>

      <Story title="No incidents" description="Empty incidents array renders a centered empty state under clean bars.">
        <StatusMonitoring services={cleanServices} incidents={[]} />
      </Story>

      <Story title="Single service" description="One row with a blip; hover any segment for its date and status.">
        <StatusMonitoring services={singleService} />
      </Story>
    </>
  )
}
