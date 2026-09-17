'use client'

import { CircleAlert, CircleCheck, RefreshCw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const connectors = [
  { mark: 'SF', name: 'Snowflake', auth: 'Key pair', cadence: 'Live query', lastRun: '12 s ago', healthy: true },
  { mark: 'BQ', name: 'BigQuery', auth: 'Service account', cadence: 'Live query', lastRun: '41 s ago', healthy: true },
  { mark: 'OK', name: 'Okta', auth: 'SCIM', cadence: 'Every 15 min', lastRun: '6 min ago', healthy: true },
  {
    mark: 'DT',
    name: 'dbt Cloud',
    auth: 'API token',
    cadence: 'On DAG finish',
    lastRun: '1 h 12 m ago',
    healthy: true,
  },
  { mark: 'SL', name: 'Slack', auth: 'OAuth', cadence: 'On alert', lastRun: 'Token expired', healthy: false },
  { mark: 'PD', name: 'PagerDuty', auth: 'API key', cadence: 'On alert', lastRun: '3 h ago', healthy: true },
]

export function IntegrationsConnectorStatus() {
  const healthy = connectors.filter((c) => c.healthy).length
  const degraded = connectors.length - healthy

  return (
    <section data-slot="integrations-connector-status" className="bg-background">
      <div className="mx-auto max-w-5xl px-6 py-20 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <Badge variant="secondary">Connector health</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">You can see what we see</h2>
            <p className="text-muted-foreground mt-3 text-lg">
              Every connection reports its own auth method, cadence, and last successful run. No silent failures.
            </p>
          </div>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 size-3.5" aria-hidden="true" />
            Re-check all
          </Button>
        </div>

        <Card className="mt-10">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Connector</TableHead>
                  <TableHead>Auth</TableHead>
                  <TableHead>Cadence</TableHead>
                  <TableHead>Last success</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {connectors.map((connector) => (
                  <TableRow key={connector.name}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span
                          className="border-border text-muted-foreground flex size-8 items-center justify-center rounded-md border font-mono text-xs font-semibold"
                          aria-hidden="true"
                        >
                          {connector.mark}
                        </span>
                        <span className="font-medium">{connector.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{connector.auth}</TableCell>
                    <TableCell className="text-muted-foreground">{connector.cadence}</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">{connector.lastRun}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={connector.healthy ? 'secondary' : 'outline'} className="gap-1.5">
                        {connector.healthy ? (
                          <CircleCheck className="text-success size-3" aria-hidden="true" />
                        ) : (
                          <CircleAlert className="text-destructive size-3" aria-hidden="true" />
                        )}
                        {connector.healthy ? 'Healthy' : 'Action needed'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Separator />

            <div className="text-muted-foreground flex flex-wrap items-center gap-x-6 gap-y-2 px-6 py-4 text-sm">
              <span className="flex items-center gap-2">
                <CircleCheck className="text-success size-3.5" aria-hidden="true" />
                {healthy} healthy
              </span>
              <span className="flex items-center gap-2">
                <CircleAlert className="text-destructive size-3.5" aria-hidden="true" />
                {degraded} needing action
              </span>
              <span className="ml-auto font-mono text-xs">Status refreshed every 60 s</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
