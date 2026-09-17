'use client'

import * as React from 'react'
import {
  Activity,
  Boxes,
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  Database,
  Eye,
  FileCode2,
  HardDrive,
  KeyRound,
  Layers,
  MoreHorizontal,
  Network,
  Plus,
  Radio,
  RefreshCw,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  Table2,
  Terminal,
  Truck,
  Users,
  X,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface DomainMeta {
  id: string
  name: string
  lead: string
  role: string
  productsCount: number
  slaScore: number
  activeConsumers: number
  storageVolume: string
  throughput: string
  tier: string
  description: string
  iconName: 'CreditCard' | 'Users' | 'Truck' | 'Activity'
}

export interface OutputPortSchemaColumn {
  name: string
  type: string
  nullable: boolean
  isKey?: boolean
  desc: string
  constraints?: string
}

export interface OutputPortDetails {
  id: 'snowflake' | 'kafka' | 'graphql' | 's3'
  name: string
  typeLabel: string
  protocol: string
  uri: string
  accessRole: string
  schemaRegistry?: string
  format?: string
  syncCadence?: string
  throughput?: string
  rateLimit?: string
  columns?: OutputPortSchemaColumn[]
  sampleQuery?: string
  samplePayload?: string
  mockResults?: Array<Record<string, string | number | boolean>>
}

export interface DataProductItem {
  id: string
  name: string
  displayName: string
  domainId: string
  domainName: string
  version: string
  tier: string
  classification: 'PII-Confidential' | 'Financial-Audit' | 'Internal-Ops' | 'Platform-Internal'
  description: string
  contractHash: string
  owner: {
    name: string
    role: string
    handle: string
    team: string
    initials: string
    avatar?: string
  }
  slaScore: number
  freshnessLatency: string
  uptime: string
  assertionsPassed: number
  assertionsTotal: number
  activeConsumersCount: number
  topConsumers: string[]
  ports: OutputPortDetails[]
  governancePolicies: string[]
}

export interface DataMeshDomainCatalogProps {
  className?: string
  initialSelectedProductId?: string
  initialDomainFilter?: string
}

const domains: DomainMeta[] = [
  {
    id: 'checkout-payments',
    name: 'Checkout & Payments',
    lead: 'Marcus Vance',
    role: 'Principal Data Architect',
    productsCount: 6,
    slaScore: 99.8,
    activeConsumers: 33,
    storageVolume: '4.8 TB',
    throughput: '45k ops/sec',
    tier: 'Tier 1 Core Gold',
    description:
      'Real-time order authorization, payment settlements, GAAP recurring revenue ledgers, and fraud velocity pipelines.',
    iconName: 'CreditCard',
  },
  {
    id: 'customer-intelligence',
    name: 'Customer Intelligence',
    lead: 'Elena Rostova',
    role: 'Staff Data PM',
    productsCount: 4,
    slaScore: 99.6,
    activeConsumers: 24,
    storageVolume: '12.2 TB',
    throughput: '12k ops/sec',
    tier: 'Tier 1 Core Gold',
    description:
      'Unified real-time customer 360 identity resolution graph, behavioral propensity scores, cohort attribution, and churn risk models.',
    iconName: 'Users',
  },
  {
    id: 'logistics-supply-chain',
    name: 'Logistics & Supply Chain',
    lead: 'David Chen',
    role: 'Lead Data Engineer',
    productsCount: 5,
    slaScore: 99.5,
    activeConsumers: 25,
    storageVolume: '8.4 TB',
    throughput: '18k ops/sec',
    tier: 'Tier 2 Certified',
    description:
      'Global container telematics, port dwell predictions, multi-warehouse stock allocations, and carrier SLA breach risk monitors.',
    iconName: 'Truck',
  },
  {
    id: 'platform-observability',
    name: 'Platform & Observability',
    lead: 'Sarah Jenkins',
    role: 'VP Data Infrastructure',
    productsCount: 3,
    slaScore: 99.99,
    activeConsumers: 41,
    storageVolume: '19.5 TB',
    throughput: '85k ops/sec',
    tier: 'Tier 1 Operational',
    description:
      'Federated query execution traces, cross-domain consumer lineage logs, SLA breach alarms, and FinOps egress telemetry.',
    iconName: 'Activity',
  },
]

const dataProducts: DataProductItem[] = [
  {
    id: 'dp_customer_360_profile',
    name: 'dp_customer_360_profile',
    displayName: 'Customer 360 Unified Identity Graph',
    domainId: 'customer-intelligence',
    domainName: 'Customer Intelligence',
    version: 'v3.2.0',
    tier: 'Tier 1 Core Gold',
    classification: 'PII-Confidential',
    description:
      'Unified real-time customer identity graph, behavioral propensity scores, multi-touch attribution, and consent preferences.',
    contractHash: 'sha256:8f4c9a12b3e70d4f9012a67e',
    owner: {
      name: 'Elena Rostova',
      role: 'Staff Data PM',
      handle: '@elena.rostova',
      team: '#cust-intel-squad',
      initials: 'ER',
    },
    slaScore: 99.9,
    freshnessLatency: '< 2m',
    uptime: '99.98%',
    assertionsPassed: 18,
    assertionsTotal: 18,
    activeConsumersCount: 14,
    topConsumers: ['RevOps Dashboard', 'Churn Predictor', 'Zendesk Sync', 'Marketing Cloud', 'Billing Automation'],
    ports: [
      {
        id: 'snowflake',
        name: 'Snowflake Analytical Mart',
        typeLabel: 'Snowflake Table',
        protocol: 'Snowflake SQL over Arrow Flight',
        uri: 'snowflake://prod_dw.analytics_customer.dim_customer_360',
        accessRole: 'ROLE: ANALYTICS_READER',
        columns: [
          {
            name: 'customer_id',
            type: 'varchar(64)',
            nullable: false,
            isKey: true,
            desc: 'Globally unique customer GUID',
            constraints: 'PRIMARY KEY',
          },
          {
            name: 'email_hash',
            type: 'varchar(64)',
            nullable: false,
            desc: 'SHA-256 hashed customer email for pseudonymization',
            constraints: 'OPA MASKED',
          },
          {
            name: 'lifetime_value_usd',
            type: 'decimal(18,2)',
            nullable: false,
            desc: 'Cumulative GAAP realized revenue recognized',
            constraints: 'CHECK (>= 0)',
          },
          {
            name: 'churn_risk_score',
            type: 'decimal(5,4)',
            nullable: true,
            desc: 'ML predicted churn risk probability (0.0000 - 1.0000)',
            constraints: '0.0 TO 1.0',
          },
          {
            name: 'primary_tier',
            type: 'varchar(32)',
            nullable: false,
            desc: 'Enterprise / Pro / Team membership classification',
          },
          {
            name: 'last_active_at',
            type: 'timestamp_tz',
            nullable: false,
            desc: 'ISO-8601 UTC timestamp of last observed touchpoint',
          },
        ],
        sampleQuery: `SELECT customer_id, primary_tier, lifetime_value_usd, churn_risk_score\nFROM prod_dw.analytics_customer.dim_customer_360\nWHERE churn_risk_score > 0.65\nORDER BY lifetime_value_usd DESC\nLIMIT 5;`,
        mockResults: [
          {
            customer_id: 'cust_9821a',
            primary_tier: 'Enterprise',
            lifetime_value_usd: '$84,200.00',
            churn_risk_score: '0.7820',
          },
          {
            customer_id: 'cust_4412b',
            primary_tier: 'Enterprise',
            lifetime_value_usd: '$62,450.00',
            churn_risk_score: '0.6910',
          },
          {
            customer_id: 'cust_1109c',
            primary_tier: 'Pro Team',
            lifetime_value_usd: '$28,900.00',
            churn_risk_score: '0.7140',
          },
        ],
      },
      {
        id: 'graphql',
        name: 'GraphQL Customer Query Endpoint',
        typeLabel: 'GraphQL API',
        protocol: 'GraphQL over HTTPS / HTTP/2',
        uri: 'https://api.uipkge.internal/graphql/v1/customer-360',
        accessRole: 'Bearer MeshToken (scope: read:customer_360)',
        rateLimit: '5,000 req/min · P99 < 45ms',
        sampleQuery: `query GetCustomerProfile($id: ID!) {\n  customer(id: $id) {\n    id\n    primaryTier\n    lifetimeValueUsd\n    churnRiskScore\n    consentPreferences {\n      analyticsAllowed\n      marketingAllowed\n    }\n  }\n}`,
      },
      {
        id: 's3',
        name: 'S3 Parquet Lake Export',
        typeLabel: 'Parquet S3',
        protocol: 'S3 Object Store / AWS Lake Formation',
        uri: 's3://uipkge-data-mesh-lake/customer-intelligence/profiles/v3/',
        accessRole: 'AWS IAM ARN: arn:aws:iam::data-lake-reader',
        format: 'Snappy Apache Parquet · Partitioned by date(last_active_at)',
        syncCadence: 'Hourly Micro-batch Sync',
      },
    ],
    governancePolicies: [
      'OPA Masking: Email and phone attributes hashed on egress',
      'GDPR Article 17: Automated erasure pipeline triggered on deletion events',
      'Differential Privacy: ε=0.5 noise applied to aggregated analytical views',
    ],
  },
  {
    id: 'dp_realtime_order_stream',
    name: 'dp_realtime_order_stream',
    displayName: 'Realtime Checkout Order Stream',
    domainId: 'checkout-payments',
    domainName: 'Checkout & Payments',
    version: 'v2.4.1',
    tier: 'Tier 1 Mission Critical',
    classification: 'Financial-Audit',
    description:
      'Sub-second immutable stream of global checkout events, payment authorizations, 3D Secure validations, and refunds.',
    contractHash: 'sha256:4a7e9102c89f33b1e2a05d8c',
    owner: {
      name: 'Marcus Vance',
      role: 'Principal Architect',
      handle: '@marcus.vance',
      team: '#payments-core',
      initials: 'MV',
    },
    slaScore: 99.95,
    freshnessLatency: '< 150ms',
    uptime: '99.99%',
    assertionsPassed: 24,
    assertionsTotal: 24,
    activeConsumersCount: 22,
    topConsumers: ['Fraud Engine', 'Inventory Lock', 'Stripe Settlement', 'Fulfillment Dispatch', 'NetSuite ERP'],
    ports: [
      {
        id: 'kafka',
        name: 'Kafka High-Throughput Event Topic',
        typeLabel: 'Kafka Stream',
        protocol: 'Kafka Protocol v3.6 / Avro Schema Registry',
        uri: 'kafka://events.kafka.internal:9092/payments.checkout.orders.v2',
        accessRole: 'mTLS Certificate (CN=service.payments.consumer)',
        schemaRegistry: 'Avro v2.4 (Subject: payments-checkout-orders-value)',
        throughput: '45,000 msg/sec (16 partitions · RF: 3)',
        samplePayload: `{\n  "event_id": "evt_9941a80c-b4",\n  "order_id": "ord_88201",\n  "customer_id": "cust_9821a",\n  "amount_cents": 184500,\n  "currency": "USD",\n  "payment_method": "stripe_card_v2",\n  "status": "AUTHORIZED",\n  "timestamp_utc": "2026-08-21T14:28:10.194Z"\n}`,
      },
      {
        id: 'snowflake',
        name: 'Raw Streaming Ingestion Table',
        typeLabel: 'Snowflake Table',
        protocol: 'Snowpipe Streaming / Arrow Flight',
        uri: 'snowflake://prod_dw.raw_payments.fct_orders_stream',
        accessRole: 'ROLE: PAYMENTS_READER',
        columns: [
          {
            name: 'event_id',
            type: 'varchar(64)',
            nullable: false,
            isKey: true,
            desc: 'Immutable idempotency event GUID',
            constraints: 'PRIMARY KEY',
          },
          { name: 'order_id', type: 'varchar(32)', nullable: false, desc: 'Reference checkout order ID' },
          { name: 'amount_usd', type: 'decimal(18,2)', nullable: false, desc: 'Settled transactional amount in USD' },
          {
            name: 'payment_status',
            type: 'varchar(24)',
            nullable: false,
            desc: 'AUTHORIZED / CAPTURED / FAILED / REFUNDED',
          },
          {
            name: 'event_timestamp',
            type: 'timestamp_tz',
            nullable: false,
            desc: 'Sub-second event creation timestamp',
          },
        ],
        sampleQuery: `SELECT event_id, order_id, amount_usd, payment_status, event_timestamp\nFROM prod_dw.raw_payments.fct_orders_stream\nWHERE event_timestamp >= DATEADD(minute, -15, CURRENT_TIMESTAMP())\nORDER BY event_timestamp DESC\nLIMIT 5;`,
        mockResults: [
          {
            event_id: 'evt_9941a',
            order_id: 'ord_88201',
            amount_usd: '$1,845.00',
            payment_status: 'AUTHORIZED',
            event_timestamp: '14:28:10 UTC',
          },
          {
            event_id: 'evt_9940b',
            order_id: 'ord_88200',
            amount_usd: '$420.50',
            payment_status: 'CAPTURED',
            event_timestamp: '14:28:08 UTC',
          },
        ],
      },
      {
        id: 'graphql',
        name: 'Realtime Orders Webhook/API',
        typeLabel: 'GraphQL API',
        protocol: 'GraphQL Subscriptions over WebSockets',
        uri: 'https://api.uipkge.internal/graphql/v1/orders-stream',
        accessRole: 'Bearer MeshToken (scope: read:orders)',
        rateLimit: '10,000 req/min · P99 < 30ms',
        sampleQuery: `subscription OnNewOrderAuthorized {\n  orderAuthorized {\n    orderId\n    amountUsd\n    status\n    timestamp\n  }\n}`,
      },
    ],
    governancePolicies: [
      'PCI-DSS Tier 1: Zero plain-text card data in payload schema',
      'Idempotent Delivery: Exactly-once consumer semantics guaranteed via Kafka transactional producer',
      'Audit Immutability: Append-only write ledger with cryptographic hash chaining',
    ],
  },
  {
    id: 'dp_carrier_delivery_performance',
    name: 'dp_carrier_delivery_performance',
    displayName: 'Carrier Dwell & Delivery Telematics',
    domainId: 'logistics-supply-chain',
    domainName: 'Logistics & Supply Chain',
    version: 'v1.8.0',
    tier: 'Tier 2 Certified',
    classification: 'Internal-Ops',
    description:
      'Real-time carrier transit telematics, port dwell times, ETA machine learning forecasts, and SLA breach risk scoring.',
    contractHash: 'sha256:19bc2a40e87d12f4581109aa',
    owner: {
      name: 'David Chen',
      role: 'Lead Data Engineer',
      handle: '@david.chen',
      team: '#logistics-mesh',
      initials: 'DC',
    },
    slaScore: 99.4,
    freshnessLatency: '< 5m',
    uptime: '99.92%',
    assertionsPassed: 12,
    assertionsTotal: 12,
    activeConsumersCount: 9,
    topConsumers: ['Control Tower UI', 'Carrier Scorecard', 'Customs Broker Portal', 'Exception Dispatcher'],
    ports: [
      {
        id: 'snowflake',
        name: 'Logistics Telematics Mart',
        typeLabel: 'Snowflake Table',
        protocol: 'Snowflake SQL / DBT Mart',
        uri: 'snowflake://prod_dw.logistics_marts.fct_carrier_telematics',
        accessRole: 'ROLE: LOGISTICS_ANALYST',
        columns: [
          {
            name: 'shipment_id',
            type: 'varchar(48)',
            nullable: false,
            isKey: true,
            desc: 'Global multimodal consignment identifier',
            constraints: 'PRIMARY KEY',
          },
          {
            name: 'carrier_scac',
            type: 'varchar(8)',
            nullable: false,
            desc: 'Standard Carrier Alpha Code (MAEU, MSCU, COSU)',
          },
          {
            name: 'port_dwell_hours',
            type: 'decimal(6,2)',
            nullable: false,
            desc: 'Current container dwell interval at marine terminal',
          },
          {
            name: 'eta_prediction_confidence',
            type: 'decimal(5,4)',
            nullable: false,
            desc: 'ML ensemble model forecast confidence score',
          },
          {
            name: 'sla_breach_flag',
            type: 'boolean',
            nullable: false,
            desc: 'Flagged true if predicted delivery > guaranteed SLA',
          },
        ],
        sampleQuery: `SELECT shipment_id, carrier_scac, port_dwell_hours, sla_breach_flag\nFROM prod_dw.logistics_marts.fct_carrier_telematics\nWHERE sla_breach_flag = TRUE\nORDER BY port_dwell_hours DESC\nLIMIT 5;`,
        mockResults: [
          { shipment_id: 'SHP-90812', carrier_scac: 'MAEU', port_dwell_hours: '74.2 hrs', sla_breach_flag: true },
          { shipment_id: 'SHP-90804', carrier_scac: 'MSCU', port_dwell_hours: '61.5 hrs', sla_breach_flag: true },
        ],
      },
      {
        id: 's3',
        name: 'Telematics Parquet Batch Stream',
        typeLabel: 'Parquet S3',
        protocol: 'S3 Data Lake / Hive Metastore',
        uri: 's3://uipkge-data-mesh-lake/supply-chain/telematics/v1/',
        accessRole: 'AWS IAM: arn:aws:iam::supply-chain-lake-reader',
        format: 'Snappy Parquet partitioned by carrier_scac / year / month',
        syncCadence: 'Every 5 minutes',
      },
    ],
    governancePolicies: [
      'Geospatial Resolution Cap: GPS telematics coordinates rounded to 3 decimal places outside geofences',
      'SLA Alert Threshold: Automatic PagerDuty alert on > 5% carrier breach rate',
    ],
  },
  {
    id: 'dp_subscription_mrr_ledger',
    name: 'dp_subscription_mrr_ledger',
    displayName: 'Subscription MRR & Revenue Recognition',
    domainId: 'checkout-payments',
    domainName: 'Checkout & Payments',
    version: 'v4.0.2',
    tier: 'Tier 1 Core Gold',
    classification: 'Financial-Audit',
    description:
      'GAAP/IFRS compliant monthly recurring revenue recognition ledger, expansion/contraction deltas, and cohort retention.',
    contractHash: 'sha256:d82e1194fa8892bc0147ae55',
    owner: {
      name: 'Marcus Vance',
      role: 'Principal Architect',
      handle: '@marcus.vance',
      team: '#payments-core',
      initials: 'MV',
    },
    slaScore: 100.0,
    freshnessLatency: '< 1h',
    uptime: '99.99%',
    assertionsPassed: 32,
    assertionsTotal: 32,
    activeConsumersCount: 11,
    topConsumers: ['Executive Board Deck', 'NetSuite Sync', 'FP&A Forecasting', 'Investor Reporting'],
    ports: [
      {
        id: 'snowflake',
        name: 'Gold Certified Financial Mart',
        typeLabel: 'Snowflake Table',
        protocol: 'Snowflake SQL / Incremental Gold Mart',
        uri: 'snowflake://prod_dw.finance_gold.fct_subscription_mrr_ledger',
        accessRole: 'ROLE: FINANCE_EXECUTIVE',
        columns: [
          {
            name: 'fiscal_month',
            type: 'varchar(7)',
            nullable: false,
            isKey: true,
            desc: 'YYYY-MM accounting partition key',
            constraints: 'PRIMARY KEY',
          },
          {
            name: 'starting_mrr',
            type: 'decimal(18,2)',
            nullable: false,
            desc: 'Beginning of period monthly recurring revenue',
          },
          {
            name: 'expansion_mrr',
            type: 'decimal(18,2)',
            nullable: false,
            desc: 'Net upgrade and seat expansion recognized',
          },
          {
            name: 'churn_mrr',
            type: 'decimal(18,2)',
            nullable: false,
            desc: 'Lost subscriptions recognized in period',
          },
          {
            name: 'ending_mrr',
            type: 'decimal(18,2)',
            nullable: false,
            desc: 'Period closing MRR for GAAP balance sheet',
          },
        ],
        sampleQuery: `SELECT fiscal_month, starting_mrr, expansion_mrr, churn_mrr, ending_mrr\nFROM prod_dw.finance_gold.fct_subscription_mrr_ledger\nORDER BY fiscal_month DESC\nLIMIT 3;`,
        mockResults: [
          {
            fiscal_month: '2026-03',
            starting_mrr: '$1,220,000.00',
            expansion_mrr: '$64,500.00',
            churn_mrr: '-$12,450.00',
            ending_mrr: '$1,272,050.00',
          },
          {
            fiscal_month: '2026-02',
            starting_mrr: '$1,175,000.00',
            expansion_mrr: '$58,100.00',
            churn_mrr: '-$13,100.00',
            ending_mrr: '$1,220,000.00',
          },
        ],
      },
      {
        id: 's3',
        name: 'Finance Cold-Storage Delta Lake',
        typeLabel: 'Parquet S3',
        protocol: 'Delta Lake 3.0 ACID table with 7-year retention',
        uri: 's3://uipkge-data-mesh-lake/finance/mrr-ledger/v4/',
        accessRole: 'AWS IAM: arn:aws:iam::finance-audit-reader',
        format: 'Delta Lake ACID Snappy Parquet',
        syncCadence: 'Daily Fiscal Close',
      },
    ],
    governancePolicies: [
      'SOX Compliance: Dual-sign-off required before schema mutation',
      'Cryptographic Seal: Daily ledger snapshot sealed with SHA-256 digest',
    ],
  },
  {
    id: 'dp_global_inventory_snapshot',
    name: 'dp_global_inventory_snapshot',
    displayName: 'Global Multi-Warehouse Inventory',
    domainId: 'logistics-supply-chain',
    domainName: 'Logistics & Supply Chain',
    version: 'v2.1.0',
    tier: 'Tier 1 Core Gold',
    classification: 'Internal-Ops',
    description:
      'Multi-warehouse SKU inventory levels, safety stock thresholds, in-transit allocations, and backorder risk indices.',
    contractHash: 'sha256:55f01e89bc21340aa482910d',
    owner: {
      name: 'David Chen',
      role: 'Lead Data Engineer',
      handle: '@david.chen',
      team: '#logistics-mesh',
      initials: 'DC',
    },
    slaScore: 99.7,
    freshnessLatency: '< 1m',
    uptime: '99.95%',
    assertionsPassed: 16,
    assertionsTotal: 16,
    activeConsumersCount: 16,
    topConsumers: ['Storefront Stock Badge', 'Warehouse WMS', 'Restock Bot', 'ERP Allocator'],
    ports: [
      {
        id: 'snowflake',
        name: 'Warehouse Stock Levels Table',
        typeLabel: 'Snowflake Table',
        protocol: 'Snowflake SQL / Materialized View',
        uri: 'snowflake://prod_dw.inventory.dim_warehouse_stock_levels',
        accessRole: 'ROLE: INVENTORY_OPERATOR',
        columns: [
          {
            name: 'sku_id',
            type: 'varchar(32)',
            nullable: false,
            isKey: true,
            desc: 'Universal Stock Keeping Unit token',
            constraints: 'PRIMARY KEY',
          },
          {
            name: 'warehouse_code',
            type: 'varchar(12)',
            nullable: false,
            isKey: true,
            desc: 'Facility code (e.g. WH-ORD1, WH-FRA2)',
            constraints: 'PRIMARY KEY',
          },
          {
            name: 'quantity_available',
            type: 'integer',
            nullable: false,
            desc: 'Unallocated physical stock ready to pick',
          },
          {
            name: 'quantity_reserved',
            type: 'integer',
            nullable: false,
            desc: 'Allocated to in-flight pending checkout baskets',
          },
          {
            name: 'reorder_threshold',
            type: 'integer',
            nullable: false,
            desc: 'Automated PO replenishment trigger watermark',
          },
        ],
        sampleQuery: `SELECT sku_id, warehouse_code, quantity_available, quantity_reserved\nFROM prod_dw.inventory.dim_warehouse_stock_levels\nWHERE quantity_available <= reorder_threshold\nLIMIT 5;`,
        mockResults: [
          { sku_id: 'SKU-8819-A', warehouse_code: 'WH-ORD1', quantity_available: 12, quantity_reserved: 8 },
          { sku_id: 'SKU-4402-Z', warehouse_code: 'WH-FRA2', quantity_available: 4, quantity_reserved: 4 },
        ],
      },
      {
        id: 'kafka',
        name: 'Inventory Delta Stream Topic',
        typeLabel: 'Kafka Stream',
        protocol: 'Kafka Event Topic / Avro v2.1',
        uri: 'kafka://events.kafka.internal:9092/supplychain.inventory.deltas.v2',
        accessRole: 'mTLS Certificate (CN=service.inventory.allocator)',
        throughput: '18,000 msg/sec',
        samplePayload: `{\n  "sku_id": "SKU-8819-A",\n  "warehouse_code": "WH-ORD1",\n  "delta_units": -1,\n  "reason": "CHECKOUT_PICKED",\n  "timestamp_utc": "2026-08-21T14:29:40.012Z"\n}`,
      },
    ],
    governancePolicies: [
      'Real-time Stock Consistency: Sub-second reconciliation against Physical WMS barcode scans',
      'Zero Phantom Inventory: Automated cycle count variance audit',
    ],
  },
  {
    id: 'dp_mesh_observability_telemetry',
    name: 'dp_mesh_observability_telemetry',
    displayName: 'Mesh Observability & Query Lineage',
    domainId: 'platform-observability',
    domainName: 'Platform & Observability',
    version: 'v1.5.0',
    tier: 'Tier 1 Operational',
    classification: 'Platform-Internal',
    description:
      'Federated query execution traces, cross-domain consumer lineage logs, SLA breach alarms, and FinOps egress telemetry.',
    contractHash: 'sha256:2210aae88401bdfe771032cf',
    owner: {
      name: 'Sarah Jenkins',
      role: 'VP Data Infrastructure',
      handle: '@sarah.jenkins',
      team: '#platform-infra',
      initials: 'SJ',
    },
    slaScore: 99.99,
    freshnessLatency: '< 500ms',
    uptime: '99.99%',
    assertionsPassed: 14,
    assertionsTotal: 14,
    activeConsumersCount: 28,
    topConsumers: ['Mesh Control Plane', 'Datadog Gateway', 'FinOps Cost Allocator', 'Governance Engine'],
    ports: [
      {
        id: 'snowflake',
        name: 'Mesh Query Audit Table',
        typeLabel: 'Snowflake Table',
        protocol: 'Snowflake SQL / Observability DW',
        uri: 'snowflake://prod_dw.observability.fct_mesh_query_logs',
        accessRole: 'ROLE: MESH_ADMIN',
        columns: [
          {
            name: 'query_execution_id',
            type: 'varchar(64)',
            nullable: false,
            isKey: true,
            desc: 'Federated query execution trace ID',
            constraints: 'PRIMARY KEY',
          },
          {
            name: 'caller_principal',
            type: 'varchar(64)',
            nullable: false,
            desc: 'Service account or user querying the port',
          },
          {
            name: 'target_data_product',
            type: 'varchar(64)',
            nullable: false,
            desc: 'Queried Data Product identifier',
          },
          { name: 'duration_ms', type: 'integer', nullable: false, desc: 'Execution duration in milliseconds' },
          {
            name: 'bytes_scanned_mb',
            type: 'decimal(12,2)',
            nullable: false,
            desc: 'Egress bandwidth volume for FinOps attribution',
          },
        ],
        sampleQuery: `SELECT caller_principal, target_data_product, duration_ms, bytes_scanned_mb\nFROM prod_dw.observability.fct_mesh_query_logs\nORDER BY duration_ms DESC\nLIMIT 5;`,
        mockResults: [
          {
            caller_principal: 'svc_revops_dashboard',
            target_data_product: 'dp_customer_360_profile',
            duration_ms: 38,
            bytes_scanned_mb: '14.2 MB',
          },
          {
            caller_principal: 'svc_fraud_detector',
            target_data_product: 'dp_realtime_order_stream',
            duration_ms: 12,
            bytes_scanned_mb: '4.8 MB',
          },
        ],
      },
      {
        id: 'kafka',
        name: 'OpenTelemetry OTLP Trace Stream',
        typeLabel: 'Kafka Stream',
        protocol: 'Kafka Event Topic / Protobuf v3',
        uri: 'kafka://events.kafka.internal:9092/platform.mesh.audit.v1',
        accessRole: 'mTLS Certificate (CN=service.mesh.observer)',
        throughput: '85,000 msg/sec',
        samplePayload: `{\n  "trace_id": "tr_99014ab",\n  "caller": "svc_fraud_detector",\n  "product": "dp_realtime_order_stream",\n  "port": "kafka",\n  "latency_ms": 12,\n  "status": 200\n}`,
      },
    ],
    governancePolicies: [
      'FinOps Cost Attribution: Every query query-plan tagged with consumer squad ID',
      'Zero Trust Egress: Real-time anomaly alerts on unauthorized consumer bursts',
    ],
  },
]

export function DataMeshDomainCatalog({
  className,
  initialSelectedProductId = 'dp_customer_360_profile',
  initialDomainFilter = 'all',
}: DataMeshDomainCatalogProps) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedDomainFilter, setSelectedDomainFilter] = React.useState(initialDomainFilter)
  const [selectedPortTypeFilter, setSelectedPortTypeFilter] = React.useState('all')
  const [selectedProductId, setSelectedProductId] = React.useState(initialSelectedProductId)
  const [activePortId, setActivePortId] = React.useState<'snowflake' | 'kafka' | 'graphql' | 's3'>('snowflake')
  const [copiedUri, setCopiedUri] = React.useState<string | null>(null)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = React.useState(false)
  const [isAccessModalOpen, setIsAccessModalOpen] = React.useState(false)
  const [isQueryDrawerOpen, setIsQueryDrawerOpen] = React.useState(false)
  const [isSimulatingQuery, setIsSimulatingQuery] = React.useState(false)
  const [isAccessApproved, setIsAccessApproved] = React.useState(false)
  const [isRegisterSuccess, setIsRegisterSuccess] = React.useState(false)

  // Form states
  const [accessAppName, setAccessAppName] = React.useState('')
  const [accessSquad, setAccessSquad] = React.useState('')
  const [accessPort, setAccessPort] = React.useState('snowflake')
  const [accessReason, setAccessReason] = React.useState('')

  const [newProductName, setNewProductName] = React.useState('')
  const [newProductDomain, setNewProductDomain] = React.useState('checkout-payments')
  const [newProductDesc, setNewProductDesc] = React.useState('')
  const [newProductOwner, setNewProductOwner] = React.useState('')
  const [newProductTeam, setNewProductTeam] = React.useState('')
  const [newProductClassification, setNewProductClassification] = React.useState<
    'PII-Confidential' | 'Financial-Audit' | 'Internal-Ops' | 'Platform-Internal'
  >('PII-Confidential')

  const selectedProduct = React.useMemo(() => {
    return dataProducts.find((p) => p.id === selectedProductId) || dataProducts[0]
  }, [selectedProductId])

  const activePort = React.useMemo(() => {
    const currentPorts = selectedProduct.ports
    return currentPorts.find((p) => p.id === activePortId) || currentPorts[0]
  }, [selectedProduct, activePortId])

  const filteredDataProducts = React.useMemo(() => {
    return dataProducts.filter((product) => {
      // Domain match
      if (selectedDomainFilter !== 'all' && product.domainId !== selectedDomainFilter) {
        return false
      }
      // Port type match
      if (selectedPortTypeFilter !== 'all') {
        const hasPort = product.ports.some((p) => p.id === selectedPortTypeFilter)
        if (!hasPort) return false
      }
      // Search query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchName = product.name.toLowerCase().includes(q)
        const matchDisplay = product.displayName.toLowerCase().includes(q)
        const matchDomain = product.domainName.toLowerCase().includes(q)
        const matchOwner = product.owner.name.toLowerCase().includes(q)
        const matchDesc = product.description.toLowerCase().includes(q)
        if (!matchName && !matchDisplay && !matchDomain && !matchOwner && !matchDesc) {
          return false
        }
      }
      return true
    })
  }, [selectedDomainFilter, selectedPortTypeFilter, searchQuery])

  function selectDomain(domainId: string) {
    if (selectedDomainFilter === domainId) {
      setSelectedDomainFilter('all')
    } else {
      setSelectedDomainFilter(domainId)
    }
  }

  function selectProduct(product: DataProductItem) {
    setSelectedProductId(product.id)
    if (product.ports.length > 0) {
      setActivePortId(product.ports[0].id)
    }
  }

  function copyToClipboard(text: string, identifier: string) {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setCopiedUri(identifier)
      setTimeout(() => {
        setCopiedUri(null)
      }, 2000)
    }
  }

  function runSimulatedQuery() {
    setIsSimulatingQuery(true)
    setTimeout(() => {
      setIsSimulatingQuery(false)
    }, 1000)
  }

  function handleOpenAccessModal(product: DataProductItem) {
    selectProduct(product)
    setIsAccessModalOpen(true)
    setIsAccessApproved(false)
  }

  function handleOpenQueryRunner(product: DataProductItem) {
    selectProduct(product)
    setIsQueryDrawerOpen(true)
  }

  function submitAccessRequest(e: React.FormEvent) {
    e.preventDefault()
    setIsAccessApproved(true)
    setTimeout(() => {
      setIsAccessModalOpen(false)
      setIsAccessApproved(false)
      setAccessAppName('')
      setAccessSquad('')
      setAccessReason('')
    }, 1800)
  }

  function submitRegisterProduct(e: React.FormEvent) {
    e.preventDefault()
    setIsRegisterSuccess(true)
    setTimeout(() => {
      setIsRegisterModalOpen(false)
      setIsRegisterSuccess(false)
      setNewProductName('')
      setNewProductDesc('')
      setNewProductOwner('')
      setNewProductTeam('')
    }, 1600)
  }

  return (
    <div
      data-slot="data-mesh-domain-catalog"
      className={cn(
        'bg-background text-foreground border-border w-full space-y-6 rounded-xl border p-4 shadow-xs sm:p-6',
        className,
      )}
    >
      {/* Header Section */}
      <header className="border-border bg-card/70 rounded-xl border p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            {/* Top Row: Org Breadcrumb & Governance Status */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="bg-primary/10 text-primary flex size-6 items-center justify-center rounded-md">
                <Network className="size-3.5" />
              </div>
              <span className="text-foreground font-semibold">UIPKGE Global Data Mesh</span>
              <span className="text-muted-foreground font-mono">4 Core Domains</span>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-medium text-emerald-700 dark:text-emerald-300">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Federated Computational Governance Active</span>
              </div>
            </div>

            {/* Main Title */}
            <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
              Data Mesh Domain Catalog & Data Products Directory
            </h1>
            <p className="text-muted-foreground max-w-3xl text-xs leading-relaxed sm:text-sm">
              Zhamak Dehghani architectural architecture for decentralized domain data ownership, discoverable polyglot
              output ports, and automated computational governance SLA scorecards.
            </p>
          </div>

          {/* Header Action Button */}
          <div className="flex shrink-0 items-center gap-2 pt-1 lg:pt-0">
            <Button
              variant="default"
              size="sm"
              className="h-9 gap-1.5 text-xs font-medium"
              onClick={() => setIsRegisterModalOpen(true)}
            >
              <Plus className="size-3.5" />
              <span>Register New Data Product</span>
            </Button>
          </div>
        </div>
      </header>

      {/* 4 Domain Summary Cards */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-x-2 px-1">
          <div className="flex items-center gap-2">
            <Layers className="text-primary size-4" />
            <h2 className="text-foreground text-xs font-semibold tracking-wider uppercase">
              Decentralized Domain Nodes (4)
            </h2>
          </div>
          <span className="text-muted-foreground text-xs">Click a domain card to filter Data Products</span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {domains.map((domain) => (
            <div
              key={domain.id}
              className={cn(
                'group relative cursor-pointer space-y-3 rounded-xl border p-4 text-xs shadow-xs transition-all',
                selectedDomainFilter === domain.id
                  ? 'border-primary bg-primary/5 ring-primary/30 ring-1'
                  : 'border-border bg-card hover:border-border/80 hover:bg-muted/30',
              )}
              onClick={() => selectDomain(domain.id)}
            >
              {/* Domain Card Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="bg-muted border-border/80 flex size-8 shrink-0 items-center justify-center rounded-lg border">
                    {domain.iconName === 'CreditCard' && <CreditCard className="size-4 text-indigo-500" />}
                    {domain.iconName === 'Users' && <Users className="size-4 text-sky-500" />}
                    {domain.iconName === 'Truck' && <Truck className="size-4 text-amber-500" />}
                    {domain.iconName === 'Activity' && <Activity className="size-4 text-emerald-500" />}
                  </div>
                  <div>
                    <h3 className="text-foreground leading-tight font-semibold">{domain.name}</h3>
                    <span className="text-muted-foreground text-xs">{domain.productsCount} Data Products</span>
                  </div>
                </div>

                <Badge
                  variant={selectedDomainFilter === domain.id ? 'default' : 'secondary'}
                  className="shrink-0 font-mono text-xs"
                >
                  {selectedDomainFilter === domain.id ? 'Filtered' : `${domain.slaScore}% SLA`}
                </Badge>
              </div>

              {/* Domain Description */}
              <p className="text-muted-foreground line-clamp-2 leading-relaxed">{{ ...domain }.description}</p>

              {/* Domain Meta & Lead */}
              <div className="border-border/60 space-y-1.5 border-t pt-2.5">
                <div className="text-muted-foreground flex items-center justify-between gap-x-2">
                  <span>Domain Lead:</span>
                  <span className="text-foreground truncate font-medium">{domain.lead}</span>
                </div>
                <div className="text-muted-foreground flex items-center justify-between gap-x-2">
                  <span>Consumers:</span>
                  <span className="text-foreground font-mono font-medium tabular-nums">
                    {domain.activeConsumers} Services
                  </span>
                </div>
                <div className="text-muted-foreground flex items-center justify-between gap-x-2">
                  <span>Storage / Egress:</span>
                  <span className="text-foreground font-mono font-medium">
                    {domain.storageVolume} · {domain.throughput}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Data Products Directory Table Section */}
      <section className="border-border bg-card/50 space-y-4 rounded-xl border p-4 sm:p-5">
        <div className="border-border/80 flex flex-col gap-3 border-b pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Table2 className="text-primary size-4" />
              <h2 className="text-foreground text-sm font-semibold tracking-tight">
                Data Products Catalog & Contracts Directory
              </h2>
              <Badge variant="secondary" className="font-mono text-xs">
                {filteredDataProducts.length} Active Products
              </Badge>
            </div>
            <p className="text-muted-foreground mt-0.5 text-xs">
              Self-describing, addressable, autonomous data quantum units with contractual SLAs and multi-modal ports.
            </p>
          </div>

          {/* Filter / Search Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                placeholder="Search products, owners, tags..."
                className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-8.5 w-full rounded-md border pr-3 pl-8 text-xs outline-none focus-visible:ring-1"
              />
            </div>

            {(selectedDomainFilter !== 'all' || selectedPortTypeFilter !== 'all' || searchQuery) && (
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground h-8.5 text-xs"
                onClick={() => {
                  setSelectedDomainFilter('all')
                  setSelectedPortTypeFilter('all')
                  setSearchQuery('')
                }}
              >
                Reset Filters
              </Button>
            )}
          </div>
        </div>

        {/* Table Container */}
        <div className="border-border bg-background overflow-hidden rounded-lg border shadow-xs">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="text-xs font-semibold">Data Product & Domain</TableHead>
                <TableHead className="text-xs font-semibold">Output Ports</TableHead>
                <TableHead className="text-xs font-semibold">Quality & SLA Score</TableHead>
                <TableHead className="text-xs font-semibold">Consumers</TableHead>
                <TableHead className="text-xs font-semibold">Product Owner & Team</TableHead>
                <TableHead className="text-right text-xs font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDataProducts.map((product) => (
                <TableRow
                  key={product.id}
                  className={cn(
                    'cursor-pointer text-xs transition-colors',
                    selectedProductId === product.id ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-muted/40',
                  )}
                  onClick={() => selectProduct(product)}
                >
                  {/* 1. Data Product & Domain */}
                  <TableCell className="py-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground font-mono font-bold">{product.name}</span>
                        <Badge variant="outline" className="font-mono text-xs font-normal">
                          {product.version}
                        </Badge>
                        {product.classification === 'PII-Confidential' && (
                          <Badge className="border-rose-500/20 bg-rose-500/10 text-xs font-normal text-rose-700 dark:text-rose-300">
                            PII Masked
                          </Badge>
                        )}
                        {product.classification === 'Financial-Audit' && (
                          <Badge className="border-amber-500/20 bg-amber-500/10 text-xs font-normal text-amber-700 dark:text-amber-300">
                            SOX Certified
                          </Badge>
                        )}
                      </div>
                      <div className="text-muted-foreground line-clamp-1 text-xs">{product.displayName}</div>
                      <div className="flex items-center gap-2 pt-0.5">
                        <Badge variant="secondary" className="text-xs font-medium">
                          {product.domainName}
                        </Badge>
                        <span className="text-muted-foreground font-mono text-xs">
                          Freshness: {product.freshnessLatency}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* 2. Output Ports */}
                  <TableCell className="py-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {product.ports.map((port) => (
                        <div
                          key={port.id}
                          className="border-border bg-muted/60 text-foreground inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-xs"
                        >
                          {port.id === 'snowflake' && <Database className="size-3 text-sky-500" />}
                          {port.id === 'kafka' && <Zap className="size-3 text-amber-500" />}
                          {port.id === 'graphql' && <Network className="size-3 text-indigo-500" />}
                          {port.id === 's3' && <HardDrive className="size-3 text-emerald-500" />}
                          <span>{port.typeLabel}</span>
                        </div>
                      ))}
                    </div>
                  </TableCell>

                  {/* 3. Quality & SLA Score */}
                  <TableCell className="py-3">
                    <div className="w-40 space-y-1.5">
                      <div className="flex items-center justify-between gap-x-2">
                        <span className="font-mono font-bold text-emerald-600 tabular-nums dark:text-emerald-400">
                          {product.slaScore.toFixed(1)}% SLA
                        </span>
                        <span className="text-muted-foreground font-mono text-xs">
                          {product.assertionsPassed}/{product.assertionsTotal} Checks
                        </span>
                      </div>
                      <Progress value={product.slaScore} className="h-1.5" />
                      <div className="text-muted-foreground text-xs">
                        Uptime: <span className="text-foreground font-mono font-medium">{product.uptime}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* 4. Consumers */}
                  <TableCell className="py-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className="font-mono text-xs font-semibold tabular-nums">
                          {product.activeConsumersCount} Consumer Apps
                        </Badge>
                      </div>
                      <div className="text-muted-foreground line-clamp-1 max-w-[180px] text-xs">
                        {product.topConsumers.slice(0, 2).join(', ')} +{product.topConsumers.length - 2}
                      </div>
                    </div>
                  </TableCell>

                  {/* 5. Product Owner & Team */}
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="size-7">
                        {product.owner.avatar && <AvatarImage src={product.owner.avatar} alt={product.owner.name} />}
                        <AvatarFallback className="text-xs font-medium">{product.owner.initials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <span className="text-foreground block truncate font-medium">{product.owner.name}</span>
                        <span className="text-muted-foreground block font-mono text-xs">{product.owner.team}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* 6. Actions Dropdown */}
                  <TableCell className="py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="size-8 p-0">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 text-xs">
                        <DropdownMenuLabel>Data Product Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => selectProduct(product)}>
                          <Eye className="text-primary size-3.5" />
                          <span>View Output Architecture</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer gap-2"
                          onClick={() => handleOpenQueryRunner(product)}
                        >
                          <Terminal className="size-3.5 text-sky-500" />
                          <span>Query Output Port</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer gap-2"
                          onClick={() => handleOpenAccessModal(product)}
                        >
                          <KeyRound className="size-3.5 text-amber-500" />
                          <span>Request Consumer Access</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="cursor-pointer gap-2"
                          onClick={() => copyToClipboard(product.ports[0]?.uri || '', product.id)}
                        >
                          <Copy className="size-3.5" />
                          <span>Copy Primary Port URI</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer gap-2"
                          onClick={() => copyToClipboard(product.contractHash, product.contractHash)}
                        >
                          <FileCode2 className="size-3.5 text-purple-500" />
                          <span>Copy Contract Hash</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Data Product Output Port Architecture & Governance Card (Selected Product) */}
      <section className="border-border bg-card/60 space-y-6 rounded-xl border p-4 sm:p-6">
        {/* Section Header with Selected Product Meta */}
        <div className="border-border/80 flex flex-col gap-3 border-b pb-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <div className="bg-primary/10 text-primary flex size-6 items-center justify-center rounded-md">
                <Boxes className="size-3.5" />
              </div>
              <span className="text-muted-foreground font-mono text-xs">Inspecting Quantum Architecture:</span>
              <h2 className="text-foreground font-mono text-base font-bold break-all sm:text-lg">
                {selectedProduct.name}
              </h2>
              <Badge variant="secondary" className="font-mono text-xs">
                {selectedProduct.version}
              </Badge>
              <Badge variant="outline" className="font-mono text-xs">
                {selectedProduct.domainName}
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm">{selectedProduct.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Contract Hash copy pill */}
            <div className="border-border bg-background inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs">
              <span className="text-muted-foreground font-mono">Contract:</span>
              <span className="text-foreground font-mono">{selectedProduct.contractHash.slice(0, 16)}...</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 px-1 text-xs"
                onClick={() => copyToClipboard(selectedProduct.contractHash, 'hash')}
              >
                {copiedUri === 'hash' ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="h-8.5 gap-1.5 text-xs"
              onClick={() => handleOpenAccessModal(selectedProduct)}
            >
              <KeyRound className="size-3.5 text-amber-500" />
              <span>Request Port Access</span>
            </Button>

            <Button
              variant="default"
              size="sm"
              className="h-8.5 gap-1.5 text-xs"
              onClick={() => handleOpenQueryRunner(selectedProduct)}
            >
              <Terminal className="size-3.5" />
              <span>Run Port Query</span>
            </Button>
          </div>
        </div>

        {/* 4 Core Pillars of Data Mesh Architecture Banner */}
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="border-border bg-background/80 space-y-1 rounded-lg border p-3 text-xs">
            <div className="text-primary flex items-center gap-1.5 font-semibold">
              <Users className="size-3.5" />
              <span>1. Domain Ownership</span>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Autonomous squad accountability:{' '}
              <span className="text-foreground font-medium">{selectedProduct.owner.name}</span> (
              {selectedProduct.owner.team}).
            </p>
          </div>

          <div className="border-border bg-background/80 space-y-1 rounded-lg border p-3 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
              <Sparkles className="size-3.5" />
              <span>2. Data as a Product</span>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Standardized contract with{' '}
              <span className="text-foreground font-mono font-medium">{selectedProduct.slaScore}% SLA</span> and
              automated test assertions.
            </p>
          </div>

          <div className="border-border bg-background/80 space-y-1 rounded-lg border p-3 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-sky-500">
              <Server className="size-3.5" />
              <span>3. Self-Serve Platform</span>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Polyglot multi-modal output endpoints: SQL, Event Stream, API & Parquet Lake.
            </p>
          </div>

          <div className="border-border bg-background/80 space-y-1 rounded-lg border p-3 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-amber-500">
              <ShieldCheck className="size-3.5" />
              <span>4. Computational Gov</span>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Policy-as-code OPA masking, SOC2 audit trail & automated RBAC grants.
            </p>
          </div>
        </div>

        {/* Output Ports Multi-Modal Tabs */}
        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Radio className="text-primary size-4" />
              <h3 className="text-foreground text-xs font-semibold tracking-wider uppercase">
                Output Ports & Endpoints ({selectedProduct.ports.length})
              </h3>
            </div>

            {/* Port selector tabs */}
            <div className="border-border bg-muted/60 inline-flex items-center gap-1 rounded-lg border p-1">
              {selectedProduct.ports.map((port) => (
                <button
                  key={port.id}
                  type="button"
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-all',
                    activePortId === port.id
                      ? 'bg-background text-foreground font-semibold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  onClick={() => setActivePortId(port.id)}
                >
                  {port.id === 'snowflake' && <Database className="size-3.5 text-sky-500" />}
                  {port.id === 'kafka' && <Zap className="size-3.5 text-amber-500" />}
                  {port.id === 'graphql' && <Network className="size-3.5 text-indigo-500" />}
                  {port.id === 's3' && <HardDrive className="size-3.5 text-emerald-500" />}
                  <span>{port.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Port Deep Inspector Container */}
          <div className="border-border bg-background space-y-4 rounded-xl border p-4 sm:p-5">
            {/* Port Meta Bar */}
            <div className="border-border/80 flex flex-col gap-3 border-b pb-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-foreground font-mono text-sm font-bold">{activePort.name}</span>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {activePort.protocol}
                  </Badge>
                  <Badge variant="outline" className="font-mono text-xs">
                    {activePort.accessRole}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs">Port Endpoint URI:</span>
                  <code className="bg-muted text-foreground border-border/60 rounded border px-2 py-0.5 font-mono text-xs">
                    {activePort.uri}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-1.5 text-xs"
                    onClick={() => copyToClipboard(activePort.uri, activePort.uri)}
                  >
                    {copiedUri === activePort.uri ? (
                      <Check className="size-3 text-emerald-500" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                    <span className="ml-1 font-mono text-xs">{copiedUri === activePort.uri ? 'Copied' : 'Copy'}</span>
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {activePort.throughput && (
                  <span className="border-border bg-muted/40 text-muted-foreground rounded-md border px-2.5 py-1 font-mono text-xs">
                    Throughput: <strong className="text-foreground">{activePort.throughput}</strong>
                  </span>
                )}
                {activePort.rateLimit && (
                  <span className="border-border bg-muted/40 text-muted-foreground rounded-md border px-2.5 py-1 font-mono text-xs">
                    Limit: <strong className="text-foreground">{activePort.rateLimit}</strong>
                  </span>
                )}
              </div>
            </div>

            {/* Port Schema Dictionary (If Columns Defined) */}
            {activePort.columns && activePort.columns.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-x-2">
                  <span className="text-foreground text-xs font-semibold">Schema Column Definitions & Constraints</span>
                  <span className="text-muted-foreground font-mono text-xs">
                    {activePort.columns.length} columns registered
                  </span>
                </div>

                <div className="border-border bg-card overflow-hidden rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/40 hover:bg-muted/40">
                        <TableHead className="text-xs font-semibold">Column Name</TableHead>
                        <TableHead className="text-xs font-semibold">Data Type</TableHead>
                        <TableHead className="text-xs font-semibold">Nullability</TableHead>
                        <TableHead className="text-xs font-semibold">Constraint</TableHead>
                        <TableHead className="text-xs font-semibold">Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activePort.columns.map((col) => (
                        <TableRow key={col.name} className="font-mono text-xs">
                          <TableCell className="text-foreground font-bold">
                            <div className="flex items-center gap-1.5">
                              {col.isKey && <KeyRound className="size-3.5 text-amber-500" />}
                              <span>{col.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="font-mono text-xs font-normal">
                              {col.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className={col.nullable ? 'text-muted-foreground' : 'text-foreground font-semibold'}>
                              {col.nullable ? 'NULLABLE' : 'NOT NULL'}
                            </span>
                          </TableCell>
                          <TableCell>
                            {col.constraints ? (
                              <Badge variant="outline" className="font-mono text-xs">
                                {col.constraints}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground font-sans">{col.desc}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Port Code / Sample Payload Explorer */}
            {(activePort.sampleQuery || activePort.samplePayload) && (
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-x-2">
                  <div className="flex items-center gap-2">
                    <FileCode2 className="text-primary size-3.5" />
                    <span className="text-foreground text-xs font-semibold">
                      {activePort.sampleQuery ? 'Sample Query / Contract Call' : 'Event Message Payload Schema'}
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1 font-mono text-xs"
                    onClick={() => copyToClipboard(activePort.sampleQuery || activePort.samplePayload || '', 'code')}
                  >
                    {copiedUri === 'code' ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                    <span>{copiedUri === 'code' ? 'Copied' : 'Copy Code'}</span>
                  </Button>
                </div>

                <div className="overflow-x-auto rounded-lg bg-neutral-950 p-4 font-mono text-xs leading-relaxed text-neutral-100 dark:bg-neutral-950">
                  <pre className="whitespace-pre">
                    <code>{activePort.sampleQuery || activePort.samplePayload}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Federated Computational Governance SLA Scorecard & Compliance Matrix */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-emerald-500" />
            <h3 className="text-foreground text-xs font-semibold tracking-wider uppercase">
              Federated Governance SLA Scorecard & Policy Rules
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Scorecard Metrics */}
            <div className="border-border bg-background space-y-3 rounded-lg border p-4 text-xs">
              <span className="text-foreground border-border/60 block border-b pb-1.5 font-semibold">
                Service Level Objectives (SLOs)
              </span>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-x-2">
                  <span className="text-muted-foreground">SLA Availability:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {selectedProduct.uptime}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-x-2">
                  <span className="text-muted-foreground">Freshness Latency:</span>
                  <span className="text-foreground font-mono font-medium">{selectedProduct.freshnessLatency}</span>
                </div>
                <div className="flex items-center justify-between gap-x-2">
                  <span className="text-muted-foreground">Quality Check Assertions:</span>
                  <span className="text-foreground font-mono font-medium text-emerald-600 dark:text-emerald-400">
                    {selectedProduct.assertionsPassed}/{selectedProduct.assertionsTotal} Passing
                  </span>
                </div>
                <div className="flex items-center justify-between gap-x-2">
                  <span className="text-muted-foreground">Data Classification:</span>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {selectedProduct.classification}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Policy-as-Code Engine */}
            <div className="border-border bg-background space-y-2.5 rounded-lg border p-4 text-xs lg:col-span-2">
              <span className="text-foreground border-border/60 block border-b pb-1.5 font-semibold">
                Active Computational Governance Policies (Policy-as-Code)
              </span>
              <div className="space-y-2">
                {selectedProduct.governancePolicies.map((policy, idx) => (
                  <div
                    key={idx}
                    className="border-border/70 bg-muted/30 flex items-start gap-2.5 rounded-md border p-2.5"
                  >
                    <div className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <Check className="size-2.5" />
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed">{policy}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Drawer / Modal: Query Output Port */}
      {isQueryDrawerOpen && (
        <div className="border-border bg-muted/30 overflow-hidden rounded-xl border transition-all">
          <div className="border-border bg-card flex items-center justify-between gap-x-2 border-b px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Terminal className="text-primary size-4" />
              <span className="text-foreground font-mono text-xs font-semibold">
                Interactive Query Runner · {selectedProduct.name} ({activePort.name})
              </span>
              <Badge variant="outline" className="font-mono text-xs">
                {activePort.protocol}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="default"
                size="sm"
                className="h-7 gap-1 text-xs"
                disabled={isSimulatingQuery}
                onClick={runSimulatedQuery}
              >
                <RefreshCw className={cn('size-3', isSimulatingQuery && 'animate-spin')} />
                <span>{isSimulatingQuery ? 'Executing Query...' : 'Execute Run'}</span>
              </Button>
              <Button variant="ghost" size="sm" className="size-7 p-0" onClick={() => setIsQueryDrawerOpen(false)}>
                <X className="size-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3 p-4">
            <div className="overflow-x-auto rounded-lg bg-neutral-950 p-3 font-mono text-xs text-neutral-100 dark:bg-neutral-950">
              <pre className="leading-relaxed whitespace-pre">
                <code>{activePort.sampleQuery || activePort.samplePayload}</code>
              </pre>
            </div>

            {activePort.mockResults && (
              <div className="border-border bg-card overflow-hidden rounded-lg border">
                <div className="border-border bg-muted/50 text-foreground flex items-center justify-between gap-x-2 border-b px-3 py-1.5 text-xs font-semibold">
                  <span>Query Results Preview (3 Records returned in 42ms)</span>
                  <Badge variant="secondary" className="font-mono text-xs">
                    Snowflake XS Warehouse
                  </Badge>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      {Object.keys(activePort.mockResults[0] || {}).map((key) => (
                        <TableHead key={key} className="font-mono text-xs">
                          {key}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activePort.mockResults.map((row, rIdx) => (
                      <TableRow key={rIdx} className="font-mono text-xs">
                        {Object.entries(row).map(([valKey, val]) => (
                          <TableCell key={valKey}>{String(val)}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Request Access to Output Port */}
      {isAccessModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          onClick={() => setIsAccessModalOpen(false)}
        >
          <div
            className="border-border bg-card text-card-foreground w-full max-w-lg space-y-4 rounded-xl border p-5 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-border/80 flex items-start justify-between border-b pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <KeyRound className="size-4 text-amber-500" />
                  <h3 className="text-foreground text-sm font-semibold">Request Output Port Access</h3>
                </div>
                <p className="text-muted-foreground text-xs">
                  Automated computational governance approval workflow for{' '}
                  <code className="text-foreground font-mono font-semibold">{selectedProduct.name}</code>.
                </p>
              </div>
              <Button variant="ghost" size="sm" className="size-7 p-0" onClick={() => setIsAccessModalOpen(false)}>
                <X className="size-4" />
              </Button>
            </div>

            {isAccessApproved ? (
              <div className="space-y-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
                <div className="inline-flex size-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-5" />
                </div>
                <h4 className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  Access Grant Provisioned
                </h4>
                <p className="text-muted-foreground text-xs">
                  Federated governance policy-as-code approved request. Token and RBAC role bound to consumer
                  application.
                </p>
              </div>
            ) : (
              <form className="space-y-3 text-xs" onSubmit={submitAccessRequest}>
                <div className="space-y-1">
                  <label className="text-foreground block font-medium">Consumer Service / Application Name</label>
                  <input
                    value={accessAppName}
                    onChange={(e) => setAccessAppName(e.target.value)}
                    required
                    placeholder="e.g. revops-lead-scoring-service"
                    className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-8.5 w-full rounded-md border px-3 text-xs outline-none focus-visible:ring-1"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-foreground block font-medium">Consumer Squad / Team</label>
                  <input
                    value={accessSquad}
                    onChange={(e) => setAccessSquad(e.target.value)}
                    required
                    placeholder="e.g. #growth-eng-squad"
                    className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-8.5 w-full rounded-md border px-3 text-xs outline-none focus-visible:ring-1"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-foreground block font-medium">Target Output Port</label>
                  <select
                    value={accessPort}
                    onChange={(e) => setAccessPort(e.target.value)}
                    className="border-border bg-background text-foreground focus-visible:ring-ring h-8.5 w-full rounded-md border px-3 text-xs outline-none focus-visible:ring-1"
                  >
                    {selectedProduct.ports.map((port) => (
                      <option key={port.id} value={port.id}>
                        {port.name} ({port.typeLabel})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-foreground block font-medium">Business Justification & Data Usage Scope</label>
                  <textarea
                    value={accessReason}
                    onChange={(e) => setAccessReason(e.target.value)}
                    required
                    rows={2}
                    placeholder="Explain how this data product will be consumed and compliance adherence..."
                    className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-md border p-2 text-xs outline-none focus-visible:ring-1"
                  />
                </div>

                <div className="border-border/80 flex items-center justify-end gap-2 border-t pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => setIsAccessModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="default" size="sm" className="h-8 text-xs font-medium">
                    Submit Access Request
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal: Register New Data Product */}
      {isRegisterModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          onClick={() => setIsRegisterModalOpen(false)}
        >
          <div
            className="border-border bg-card text-card-foreground w-full max-w-lg space-y-4 rounded-xl border p-5 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-border/80 flex items-start justify-between border-b pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Plus className="text-primary size-4" />
                  <h3 className="text-foreground text-sm font-semibold">Register New Data Product</h3>
                </div>
                <p className="text-muted-foreground text-xs">
                  Publish a new data product quantum to the federated Data Mesh catalog with contract SLA specs.
                </p>
              </div>
              <Button variant="ghost" size="sm" className="size-7 p-0" onClick={() => setIsRegisterModalOpen(false)}>
                <X className="size-4" />
              </Button>
            </div>

            {isRegisterSuccess ? (
              <div className="space-y-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
                <div className="inline-flex size-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-5" />
                </div>
                <h4 className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  Data Product Registered Successfully
                </h4>
                <p className="text-muted-foreground text-xs">
                  Published to catalog registry with contract hash, automated CI/CD validation tests, and SLA telemetry.
                </p>
              </div>
            ) : (
              <form className="space-y-3 text-xs" onSubmit={submitRegisterProduct}>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-foreground block font-medium">Product Name / ID</label>
                    <input
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                      required
                      placeholder="dp_merchant_settlement_ledger"
                      className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-8.5 w-full rounded-md border px-3 font-mono text-xs outline-none focus-visible:ring-1"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-foreground block font-medium">Domain Node</label>
                    <select
                      value={newProductDomain}
                      onChange={(e) => setNewProductDomain(e.target.value)}
                      className="border-border bg-background text-foreground focus-visible:ring-ring h-8.5 w-full rounded-md border px-3 text-xs outline-none focus-visible:ring-1"
                    >
                      {domains.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-foreground block font-medium">Data Product Description</label>
                  <textarea
                    value={newProductDesc}
                    onChange={(e) => setNewProductDesc(e.target.value)}
                    required
                    rows={2}
                    placeholder="Describe the product quantum purpose, source transformations, and consumer target..."
                    className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-md border p-2 text-xs outline-none focus-visible:ring-1"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-foreground block font-medium">Product Owner Name</label>
                    <input
                      value={newProductOwner}
                      onChange={(e) => setNewProductOwner(e.target.value)}
                      required
                      placeholder="Marcus Vance"
                      className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-8.5 w-full rounded-md border px-3 text-xs outline-none focus-visible:ring-1"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-foreground block font-medium">Squad Slack Handle / Team</label>
                    <input
                      value={newProductTeam}
                      onChange={(e) => setNewProductTeam(e.target.value)}
                      required
                      placeholder="#payments-core"
                      className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-8.5 w-full rounded-md border px-3 font-mono text-xs outline-none focus-visible:ring-1"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-foreground block font-medium">Data Classification Tier</label>
                  <select
                    value={newProductClassification}
                    onChange={(e) =>
                      setNewProductClassification(
                        e.target.value as 'PII-Confidential' | 'Financial-Audit' | 'Internal-Ops' | 'Platform-Internal',
                      )
                    }
                    className="border-border bg-background text-foreground focus-visible:ring-ring h-8.5 w-full rounded-md border px-3 text-xs outline-none focus-visible:ring-1"
                  >
                    <option value="PII-Confidential">PII-Confidential (GDPR Masked)</option>
                    <option value="Financial-Audit">Financial-Audit (SOX Certified)</option>
                    <option value="Internal-Ops">Internal-Ops (Standard RBAC)</option>
                    <option value="Platform-Internal">Platform-Internal (System Only)</option>
                  </select>
                </div>

                <div className="border-border/80 flex items-center justify-end gap-2 border-t pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => setIsRegisterModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="default" size="sm" className="h-8 text-xs font-medium">
                    Publish to Mesh Registry
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
