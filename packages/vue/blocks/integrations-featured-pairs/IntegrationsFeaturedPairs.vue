<script setup lang="ts">
import { ArrowRight, Check, Plug } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const featured = [
  {
    mark: 'SF',
    name: 'Snowflake',
    summary: 'Query your warehouse directly. Metrics resolve against live tables instead of a nightly copy.',
    steps: ['Create a read-only role', 'Paste the account URL', 'Pick the databases to expose'],
    status: 'Connected',
    healthy: true,
    meta: 'Read-only · no data egress',
  },
  {
    mark: 'OK',
    name: 'Okta',
    summary: 'Group membership drives row-level scope, so access changes the moment HR changes it.',
    steps: ['Add the SAML app', 'Enable SCIM provisioning', 'Map groups to scopes'],
    status: 'Connected',
    healthy: true,
    meta: 'SAML + SCIM',
  },
  {
    mark: 'SL',
    name: 'Slack',
    summary: 'Drift and freshness alerts land in the channel that owns the metric, with the run attached.',
    steps: ['Install the app', 'Choose default channels', 'Route alerts per metric owner'],
    status: 'Needs re-auth',
    healthy: false,
    meta: 'Token expires every 90 days',
  },
]
</script>

<template>
  <section data-slot="integrations-featured-pairs" class="bg-background">
    <div class="mx-auto max-w-6xl px-6 py-20 lg:py-28">
      <div class="max-w-2xl">
        <Badge variant="secondary">Featured integrations</Badge>
        <h2 class="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">The three most teams connect first</h2>
        <p class="text-muted-foreground mt-3 text-lg">
          Each one is three steps and read-only. What the connection actually does is written on the card.
        </p>
      </div>

      <div class="mt-10 grid gap-4 md:grid-cols-3">
        <Card v-for="integration in featured" :key="integration.name">
          <CardContent class="flex h-full flex-col p-6">
            <div class="flex items-center gap-3">
              <span
                class="border-border text-muted-foreground flex size-10 items-center justify-center rounded-lg border font-mono text-sm font-semibold"
                aria-hidden="true"
              >
                {{ integration.mark }}
              </span>
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold">{{ integration.name }}</p>
                <p class="text-muted-foreground truncate text-xs">{{ integration.meta }}</p>
              </div>
            </div>

            <p class="text-muted-foreground mt-4 text-sm leading-relaxed">{{ integration.summary }}</p>

            <Separator class="my-5" />

            <p class="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">Setup</p>
            <ol class="mt-3 space-y-2">
              <li
                v-for="(step, index) in integration.steps"
                :key="step"
                class="text-foreground flex items-start gap-2.5 text-sm"
              >
                <span class="text-muted-foreground/70 mt-px font-mono text-xs">{{ index + 1 }}</span>
                <span>{{ step }}</span>
              </li>
            </ol>

            <div class="mt-auto flex items-center justify-between gap-3 pt-6">
              <Badge :variant="integration.healthy ? 'secondary' : 'outline'" class="gap-1.5">
                <Check v-if="integration.healthy" class="size-3" aria-hidden="true" />
                <Plug v-else class="size-3" aria-hidden="true" />
                {{ integration.status }}
              </Badge>
              <Button variant="ghost" size="sm" class="h-auto px-2 py-1">
                Docs
                <ArrowRight class="ml-1 size-3.5" aria-hidden="true" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>
