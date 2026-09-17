<script setup lang="ts">
import CronJobScheduler from '@/components/blocks/cron-job-scheduler/CronJobScheduler.vue'
</script>

<template>
  <Story
    title="Default"
    description="Temporal and AWS EventBridge style scheduled tasks dashboard with KPI metrics, jobs table, and interactive cron expression generator."
  >
    <CronJobScheduler />
  </Story>

  <Story
    title="Active cluster workload"
    description="Production worker cluster with high execution throughput and healthy background jobs."
  >
    <CronJobScheduler
      :initial-stats="{
        totalScheduled: 28,
        activeWorkers: 28,
        failed24h: 0,
        executionsToday: '142.8k',
      }"
      :initial-jobs="[
        {
          id: 'job-prod-1',
          name: 'realtime-stream-aggregation',
          target: 'POST https://analytics.acme.corp/v1/aggregate',
          cronExpression: '*/5 * * * *',
          humanSchedule: 'Every 5 minutes',
          timezone: 'UTC',
          status: 'active',
          nextRun: 'in 2 min',
          lastExecution: {
            status: 'success',
            code: '200 OK',
            duration: '420ms',
            timestamp: '3 min ago',
          },
        },
        {
          id: 'job-prod-2',
          name: 'database-checkpoint-wal',
          target: 'services/db::checkpointWAL',
          cronExpression: '0 * * * *',
          humanSchedule: 'At minute 00 of every hour',
          timezone: 'UTC',
          status: 'active',
          nextRun: 'in 38 min',
          lastExecution: {
            status: 'success',
            code: '200 OK',
            duration: '2.1s',
            timestamp: '22 min ago',
          },
        },
        {
          id: 'job-prod-3',
          name: 'nightly-reindex-elasticsearch',
          target: 'POST https://search.acme.corp/indices/reindex',
          cronExpression: '0 2 * * *',
          humanSchedule: 'Every day at 02:00',
          timezone: 'UTC',
          status: 'active',
          nextRun: 'in 11 hours',
          lastExecution: {
            status: 'success',
            code: '200 OK',
            duration: '4m 12s',
            timestamp: '13 hours ago',
          },
        },
      ]"
    />
  </Story>

  <Story
    title="Alert and degraded state"
    description="Cluster state with degraded external dependencies and failing scheduled workers."
  >
    <CronJobScheduler
      :initial-stats="{
        totalScheduled: 8,
        activeWorkers: 5,
        failed24h: 3,
        executionsToday: '12.4k',
      }"
      :initial-jobs="[
        {
          id: 'job-deg-1',
          name: 'sync-salesforce-leads',
          target: 'POST https://integrations.acme.corp/salesforce/sync',
          cronExpression: '*/10 * * * *',
          humanSchedule: 'Every 10 minutes',
          timezone: 'UTC',
          status: 'error',
          nextRun: 'in 6 min',
          lastExecution: {
            status: 'error',
            code: '503 Service Unavailable',
            duration: '15.2s',
            timestamp: '4 min ago',
          },
        },
        {
          id: 'job-deg-2',
          name: 'export-audit-archive-cold-storage',
          target: 'services/compliance::archiveAuditLogs',
          cronExpression: '0 0 1 * *',
          humanSchedule: 'Day 1 of every month at midnight',
          timezone: 'UTC',
          status: 'paused',
          nextRun: 'Paused',
          lastExecution: {
            status: 'success',
            code: '200 OK',
            duration: '18.3s',
            timestamp: '18 days ago',
          },
        },
      ]"
    />
  </Story>
</template>
