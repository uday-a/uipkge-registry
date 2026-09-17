<script setup lang="ts">
import ApiKeys from '@/components/blocks/api-keys/ApiKeys.vue'

interface DemoKey {
  id: string
  name: string
  environment: 'production' | 'staging' | 'development'
  value: string
  createdAt: Date
  lastUsedAt: Date | null
  status: 'active' | 'revoked' | 'expiring'
}

const now = new Date()
const daysAgo = (d: number) => new Date(now.getTime() - d * 86_400_000)
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3_600_000)

const mixedKeys: DemoKey[] = [
  {
    id: 'k1',
    name: 'Production server',
    environment: 'production',
    value: 'uipkge_live_51HxQp9mZvKYlo2C4f2a',
    createdAt: daysAgo(94),
    lastUsedAt: hoursAgo(2),
    status: 'active',
  },
  {
    id: 'k2',
    name: 'Legacy webhook integration',
    environment: 'production',
    value: 'uipkge_live_2PvBgR6nTxAokdJe5f8c',
    createdAt: daysAgo(210),
    lastUsedAt: daysAgo(64),
    status: 'revoked',
  },
  {
    id: 'k3',
    name: 'Local development',
    environment: 'development',
    value: 'sk_dev_k2MnQ8tReFvBgy5Xc40d',
    createdAt: daysAgo(12),
    lastUsedAt: daysAgo(3),
    status: 'active',
  },
]

const longNameKeys: DemoKey[] = [
  {
    id: 'ln1',
    name: 'Production API — us-east-1 batch ingestion pipeline service account',
    environment: 'production',
    value: 'uipkge_live_51HxQp9mZvKYlo2C4f2a',
    createdAt: daysAgo(120),
    lastUsedAt: hoursAgo(1),
    status: 'active',
  },
  {
    id: 'ln2',
    name: 'Data warehouse reverse ETL connector (Airbyte → Snowflake)',
    environment: 'staging',
    value: 'sk_stg_6JdRw3nAwLZmp7xQb91e',
    createdAt: daysAgo(58),
    lastUsedAt: hoursAgo(9),
    status: 'active',
  },
  {
    id: 'ln3',
    name: 'Short name',
    environment: 'development',
    value: 'sk_dev_k2MnQ8tReFvBgy5Xc40d',
    createdAt: daysAgo(4),
    lastUsedAt: null,
    status: 'active',
  },
]

const manyKeys: DemoKey[] = [
  'Web app frontend',
  'Mobile app backend',
  'Public REST API v2',
  'Internal admin panel',
  'Partner integrations',
  'Nightly reporting job',
  'Search indexer',
  'Email delivery service',
  'Sandbox playground',
].map((name, i) => ({
  id: `mk-${i}`,
  name,
  environment: i % 3 === 0 ? 'production' : i % 3 === 1 ? 'staging' : 'development',
  value: `${['uipkge_live_', 'sk_stg_', 'sk_dev_'][i % 3]}${(i + 11) * 7919}a${(i + 3) * 15485863}b`,
  createdAt: daysAgo(200 - i * 17),
  lastUsedAt: hoursAgo(i * 7 + 1),
  status: 'active',
}))

const expiringKeys: DemoKey[] = [
  {
    id: 'ex1',
    name: 'Checkout service (rotates Friday)',
    environment: 'production',
    value: 'uipkge_live_9WrTz4pLmNqRsVuX1e8d',
    createdAt: daysAgo(86),
    lastUsedAt: hoursAgo(1),
    status: 'expiring',
  },
  {
    id: 'ex2',
    name: 'Analytics exporter',
    environment: 'staging',
    value: 'sk_stg_3FdGhJ5kLnPqRtSwY7b2c',
    createdAt: daysAgo(60),
    lastUsedAt: hoursAgo(14),
    status: 'expiring',
  },
  {
    id: 'ex3',
    name: 'Load-test harness',
    environment: 'development',
    value: 'sk_dev_7HjKl2MnOpQrStUvW9x4y',
    createdAt: daysAgo(29),
    lastUsedAt: daysAgo(1),
    status: 'expiring',
  },
]
</script>

<template>
  <Story
    title="Default"
    description="Self-contained key manager with stub data. Reveal, copy, and revoke are fully interactive."
  >
    <ApiKeys />
  </Story>

  <Story title="Empty" description="Centered empty state with a CTA that opens the create-key dialog.">
    <ApiKeys :initial-keys="[]" />
  </Story>

  <Story
    title="Revoked mixed in"
    description="Revoked keys stay listed with a destructive badge; their row actions collapse to reveal/copy only."
  >
    <ApiKeys :initial-keys="mixedKeys" />
  </Story>

  <Story
    title="Reveal interaction"
    description="Click the eye to swap the masked value for the full fake secret; click again to hide."
  >
    <ApiKeys />
  </Story>

  <Story
    title="Create dialog opened"
    description="The create dialog rendered open via initialCreateOpen — name input plus environment select."
  >
    <ApiKeys initial-create-open />
  </Story>

  <Story
    title="Long names truncation"
    description="Very long key names truncate with an ellipsis instead of pushing the value and actions off-row."
  >
    <ApiKeys :initial-keys="longNameKeys" />
  </Story>

  <Story title="Many keys" description="Nine keys in one scrollable card — the list stays readable top-to-bottom.">
    <ApiKeys :initial-keys="manyKeys" />
  </Story>

  <Story title="Expires-soon badges" description="Keys nearing expiry show the warning badge next to active ones.">
    <ApiKeys :initial-keys="expiringKeys" />
  </Story>

  <Story
    title="Copy feedback"
    description="Click a copy icon: it swaps to a green check for a moment after navigator.clipboard.writeText resolves."
  >
    <ApiKeys />
  </Story>

  <Story title="Compact density" description='density="compact" tightens row padding for dense settings pages.'>
    <ApiKeys density="compact" />
  </Story>
</template>
