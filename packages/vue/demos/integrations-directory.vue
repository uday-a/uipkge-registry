<script setup lang="ts">
import {
  Activity,
  BarChart3,
  Container,
  CreditCard,
  LineChart,
  Mail,
  MessageSquare,
  Radar,
  Receipt,
  ScrollText,
  Smartphone,
  Wallet,
} from 'lucide-vue-next'
import IntegrationsDirectory from '@/components/blocks/integrations-directory/IntegrationsDirectory.vue'

const manyIntegrations = [
  {
    id: 'pulseboard',
    name: 'Pulseboard',
    description: 'Funnels, retention curves and cohort exploration for product teams.',
    detail:
      'Pulseboard plugs into your event stream and turns raw activity into funnels, retention curves and cohort views.',
    category: 'analytics',
    author: 'Pulseboard Labs',
    icon: BarChart3,
    connected: true,
    permissions: ['Read workspace profile', 'Read dashboards and events'],
  },
  {
    id: 'metrica',
    name: 'Metrica',
    description: 'Privacy-friendly web metrics with no cookie banner required.',
    detail: 'Metrica collects pageviews and referrers without cookies or personal data.',
    category: 'analytics',
    author: 'Metrica Inc.',
    icon: LineChart,
    permissions: ['Read site metadata', 'Record aggregate pageviews'],
  },
  {
    id: 'shipyard',
    name: 'Shipyard',
    description: 'Zero-config preview environments for every pull request.',
    detail: 'Shipyard builds an isolated environment for each pull request with seeded databases and shareable URLs.',
    category: 'devops',
    author: 'Shipyard Systems',
    icon: Container,
    connected: true,
    permissions: ['Read pull requests and statuses', 'Publish preview URLs'],
  },
  {
    id: 'watchtower',
    name: 'Watchtower',
    description: 'Uptime, SSL and domain monitoring with on-call escalations.',
    detail: 'Watchtower probes your endpoints from twelve regions and escalates incidents through on-call schedules.',
    category: 'devops',
    author: 'Northwind Ops',
    icon: Radar,
    permissions: ['Read incident history', 'Send alert notifications'],
  },
  {
    id: 'loghound',
    name: 'Loghound',
    description: 'Structured log search across every service and region.',
    detail: 'Loghound ingests structured logs, indexes them in seconds and supports SQL-ish queries with saved views.',
    category: 'devops',
    author: 'Houndworks',
    icon: ScrollText,
    permissions: ['Read log streams', 'Create saved queries'],
  },
  {
    id: 'beacon',
    name: 'Beacon',
    description: 'Public status pages your customers can subscribe to.',
    detail: 'Beacon hosts branded status pages with incident timelines and subscriber notifications out of the box.',
    category: 'devops',
    author: 'Brightpath',
    icon: Activity,
    permissions: ['Read incident history', 'Publish status updates'],
  },
  {
    id: 'chatterbox',
    name: 'Chatterbox',
    description: 'Team chat with threads, huddles and shared channels.',
    detail:
      'Chatterbox keeps conversations organized with threaded channels, quick huddles and shared external channels.',
    category: 'communication',
    author: 'Chatterbox Co.',
    icon: MessageSquare,
    permissions: ['Post messages as the app', 'Upload notification files'],
  },
  {
    id: 'mailroom',
    name: 'Mailroom',
    description: 'Transactional email with templates and delivery insights.',
    detail: 'Mailroom sends transactional email from versioned templates with per-recipient variables.',
    category: 'communication',
    author: 'Mailroom Ltd.',
    icon: Mail,
    permissions: ['Send email on your behalf', 'Read delivery and bounce events'],
  },
  {
    id: 'relay',
    name: 'Relay',
    description: 'SMS and push notifications with fallback routing.',
    detail: 'Relay routes critical alerts across SMS and push providers until a channel confirms delivery.',
    category: 'communication',
    author: 'Relay Networks',
    icon: Smartphone,
    permissions: ['Send messages', 'Read delivery receipts'],
  },
  {
    id: 'ledgerly',
    name: 'Ledgerly',
    description: 'Invoicing, tax handling and revenue recognition in one flow.',
    detail: 'Ledgerly generates invoices from billing events and applies regional tax rules automatically.',
    category: 'billing',
    author: 'Ledgerly Inc.',
    icon: Receipt,
    permissions: ['Create and send invoices', 'Read payment statuses'],
  },
  {
    id: 'billfold',
    name: 'Billfold',
    description: 'Subscription management and dunning recovery built in.',
    detail: 'Billfold manages plans, proration and trial conversions with hosted checkout and self-serve portals.',
    category: 'billing',
    author: 'Billfold Labs',
    icon: CreditCard,
    connected: true,
    permissions: ['Read subscription states', 'Start checkout sessions'],
  },
  {
    id: 'vaultpay',
    name: 'Vaultpay',
    description: 'Hosted payment forms with local payment methods.',
    detail: 'Vaultpay renders localized payment forms and settles through your existing merchant account.',
    category: 'billing',
    author: 'Vaultpay',
    icon: Wallet,
    permissions: ['Create checkout sessions', 'Read payment statuses'],
  },
]

const tinyCatalog = manyIntegrations.filter((i) => ['pulseboard', 'shipyard', 'ledgerly'].includes(i.id))
</script>

<template>
  <Story title="Default" description="Marketplace grid with functional search, category chips and an installed filter.">
    <IntegrationsDirectory />
  </Story>

  <Story title="Filtered category" description="DevOps chip preselected; chip counts always reflect the full catalog.">
    <IntegrationsDirectory initial-category="devops" />
  </Story>

  <Story title="Search active" description="Query prefilled; the grid filters live across name, blurb and author.">
    <IntegrationsDirectory initial-query="ship" />
  </Story>

  <Story title="Installed only" description="Installed switch on: only connected integrations remain visible.">
    <IntegrationsDirectory initial-installed-only />
  </Story>

  <Story
    title="Detail panel"
    description="The dialog body rendered as an always-visible panel; cards still open the real dialog."
  >
    <IntegrationsDirectory featured-id="shipyard" />
  </Story>

  <Story title="Empty results" description="No matches: empty state with a one-click filter reset.">
    <IntegrationsDirectory initial-query="zzz" />
  </Story>

  <Story title="Many items" description="Twelve listings across every category; the grid paginates by scroll.">
    <IntegrationsDirectory :integrations="manyIntegrations" />
  </Story>

  <Story title="Custom catalog" description="Pass your own catalog; the stub data is fully replaceable.">
    <IntegrationsDirectory :integrations="tinyCatalog" />
  </Story>
</template>
