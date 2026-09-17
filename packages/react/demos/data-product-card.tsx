import * as React from 'react'
import Story from '../../components/story/Story'
import { DataProductCard, type DataProductData } from '@react-registry-blocks/data-product-card/DataProductCard'

const orderStreamProduct: DataProductData = {
  id: 'dp-orders-stream',
  name: 'dp_realtime_order_events',
  version: 'v4.1.0',
  domain: 'Checkout & Payments Domain',
  tier: 'Gold Tier 1',
  description:
    'Real-time streaming ledger of all completed checkout orders, refund events, and payment authorization attempts with sub-second propagation.',
  slaCompliance: 99.99,
  freshness: 'Streaming Live · < 25ms lag',
  completenessPct: 100.0,
  activeConsumersCount: 22,
  owner: {
    name: 'David Chen',
    role: 'Principal Streaming Architect',
    team: 'Checkout Platform Squad',
    fallback: 'DC',
  },
  outputPorts: [
    {
      id: 'p1',
      name: 'events.orders.completed.v4',
      type: 'kafka',
      typeLabel: 'Kafka Stream',
      uri: 'kafka://events.kafka.internal:9092/events.orders.completed.v4',
      latency: '< 25ms Event Time',
      status: 'online',
    },
    {
      id: 'p2',
      name: 'analytics.fct_orders_realtime',
      type: 'snowflake',
      typeLabel: 'Snowflake Dynamic Table',
      uri: 'snowflake://analytics_prod.dw/analytics.fct_orders_realtime',
      latency: '1-min lag target',
      status: 'online',
    },
    {
      id: 'p3',
      name: 'Order Lookup API',
      type: 'graphql',
      typeLabel: 'GraphQL Port',
      uri: 'https://api.uipkge.dev/graphql?query=orderEvents',
      latency: '< 30ms p99',
      status: 'online',
    },
    {
      id: 'p4',
      name: 'Cold Iceberg Lakehouse',
      type: 's3',
      typeLabel: 'Apache Iceberg S3',
      uri: 's3://lakehouse-gold/orders_cdc/iceberg_metadata.json',
      latency: '10-min compacted',
      status: 'online',
    },
  ],
  tags: ['#streaming', '#orders', '#kafka', '#realtime', '#payments'],
  certifiedCompliance: 'PCI-DSS Level 1 & SOC2 Type II Certified',
  lastUpdated: 'Aug 21, 2026',
}

export default function DataProductCardDemo() {
  return (
    <>
      <Story
        title="Customer 360 Data Product Card"
        description="Data Mesh architectural Data Product Card (DPC) with SLA compliance meter, multi-modal output ports, owner profile, and interactive access request flow."
      >
        <div className="mx-auto max-w-2xl">
          <DataProductCard />
        </div>
      </Story>

      <Story
        title="Realtime Order Stream Data Product"
        description="High-velocity streaming data product card with sub-second Kafka output ports and PCI-DSS compliance badges."
      >
        <div className="mx-auto max-w-2xl">
          <DataProductCard product={orderStreamProduct} />
        </div>
      </Story>
    </>
  )
}
