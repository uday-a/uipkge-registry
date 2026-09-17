'use client'

import * as React from 'react'
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Code2,
  Copy,
  CornerDownRight,
  Cpu,
  CreditCard,
  Database,
  FileDown,
  GitBranch,
  GitCommit,
  Globe,
  Layers,
  Loader2,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Terminal,
  Workflow,
  X,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export type NodeStatus = 'success' | 'running' | 'failed' | 'queued'
export type NodeCategory = 'ingest' | 'transform' | 'validate' | 'load' | 'model'

export interface QualityCheck {
  id: string
  assertion: string
  column: string
  status: 'passed' | 'warning' | 'failed'
  observed: string
  threshold: string
}

export interface SchemaColumn {
  name: string
  type: string
  nullable: boolean
  description: string
}

export interface LogLine {
  timestamp: string
  level: 'INFO' | 'WARN' | 'SQL' | 'SUCCESS' | 'ERROR'
  source: string
  message: string
}

export interface DagNode {
  id: string
  name: string
  category: NodeCategory
  categoryLabel: string
  stageNumber: number
  stageTitle: string
  operator: string
  status: NodeStatus
  duration: string
  durationSec: number
  records: string
  bytes: string
  startedAt: string
  finishedAt: string
  target: string
  engine: string
  upstream: string[]
  downstream: string[]
  retries: string
  memoryPeak: string
  cpuPeak: string
  configParams: Record<string, string>
  qualityChecks: QualityCheck[]
  schemaColumns: SchemaColumn[]
  logs: LogLine[]
}

const pipelineNodes: DagNode[] = [
  {
    id: 'extract_stripe_charges',
    name: 'extract_stripe_charges',
    category: 'ingest',
    categoryLabel: 'INGEST',
    stageNumber: 1,
    stageTitle: 'Extract & Ingest',
    operator: 'StripeApiConnector',
    status: 'success',
    duration: '18s',
    durationSec: 18.2,
    records: '148,290 records',
    bytes: '42.6 MB',
    startedAt: '02:00:02 UTC',
    finishedAt: '02:00:20 UTC',
    target: 'raw_stripe.charges',
    engine: 'Airbyte / Stripe REST API v2024-06',
    upstream: [],
    downstream: ['transform_normalize_fx'],
    retries: '0 / 3',
    memoryPeak: '342 MB',
    cpuPeak: '18%',
    configParams: {
      endpoint: 'https://api.stripe.com/v1/charges',
      batch_size: '10,000',
      pagination_mode: 'starting_after cursor',
      target_s3_bucket: 's3://lakehouse-raw/stripe/charges/dt=2026-02-21/',
      compression_codec: 'snappy (parquet)',
      iam_role_arn: 'arn:aws:iam::12498214:role/etl-stripe-ingestion',
      secret_vault_ref: 'vault://production/credentials/stripe_api_key',
    },
    qualityChecks: [
      {
        id: 'q1',
        assertion: 'HTTP 200 Response Ratio',
        column: 'api_response',
        status: 'passed',
        observed: '100% (15/15 chunks)',
        threshold: '100%',
      },
      {
        id: 'q2',
        assertion: 'Payload Schema Checksum',
        column: 'raw_payload',
        status: 'passed',
        observed: 'sha256:8f4c91...',
        threshold: 'Valid JSON',
      },
      {
        id: 'q3',
        assertion: 'Record Count Lower Bound',
        column: 'id',
        status: 'passed',
        observed: '148,290 records',
        threshold: '> 50,000',
      },
    ],
    schemaColumns: [
      {
        name: 'id',
        type: 'VARCHAR(64)',
        nullable: false,
        description: 'Stripe unique charge identifier (ch_xxx)',
      },
      {
        name: 'amount',
        type: 'BIGINT',
        nullable: false,
        description: 'Charge amount in smallest currency unit (cents)',
      },
      {
        name: 'currency',
        type: 'VARCHAR(3)',
        nullable: false,
        description: 'Three-letter ISO currency code (USD, EUR, GBP)',
      },
      {
        name: 'customer_id',
        type: 'VARCHAR(64)',
        nullable: true,
        description: 'Associated customer reference (cus_xxx)',
      },
      {
        name: 'status',
        type: 'VARCHAR(32)',
        nullable: false,
        description: 'Charge status (succeeded, pending, failed)',
      },
      {
        name: 'created_at',
        type: 'TIMESTAMP_TZ',
        nullable: false,
        description: 'Stripe transaction creation epoch timestamp',
      },
    ],
    logs: [
      {
        timestamp: '02:00:02.104',
        level: 'INFO',
        source: 'worker_4',
        message: 'Initializing Stripe extraction worker on task runner runner-us-east-1a',
      },
      {
        timestamp: '02:00:02.482',
        level: 'INFO',
        source: 'auth',
        message: 'Authenticated with KMS secret token: sec_live_stripe_vault_****',
      },
      {
        timestamp: '02:00:03.119',
        level: 'INFO',
        source: 'query',
        message: 'Requesting charges filter: created >= 1708473600 (2026-02-21 00:00:00 UTC)',
      },
      {
        timestamp: '02:00:05.892',
        level: 'INFO',
        source: 'stream',
        message: 'Chunk 1/15 fetched: 10,000 records (HTTP 200 OK - 2.4s latency)',
      },
      {
        timestamp: '02:00:09.140',
        level: 'INFO',
        source: 'stream',
        message: 'Chunk 5/15 fetched: 50,000 records (HTTP 200 OK - 1.8s latency)',
      },
      {
        timestamp: '02:00:14.730',
        level: 'INFO',
        source: 'stream',
        message: 'Chunk 11/15 fetched: 110,000 records (HTTP 200 OK - 1.9s latency)',
      },
      {
        timestamp: '02:00:18.915',
        level: 'INFO',
        source: 'stream',
        message: 'Chunk 15/15 fetched: 148,290 records (HTTP 200 OK - 1.1s latency)',
      },
      {
        timestamp: '02:00:19.420',
        level: 'INFO',
        source: 'parquet',
        message: 'Staged parquet buffer to s3://lakehouse-raw/stripe/charges/dt=2026-02-21/part-001.parquet',
      },
      {
        timestamp: '02:00:20.312',
        level: 'SUCCESS',
        source: 'task',
        message: 'Task extract_stripe_charges completed successfully in 18.208s. Checksum verified: sha256:8f4c91',
      },
    ],
  },
  {
    id: 'extract_currency_rates',
    name: 'extract_currency_rates',
    category: 'ingest',
    categoryLabel: 'INGEST',
    stageNumber: 1,
    stageTitle: 'Extract & Ingest',
    operator: 'EcbRatesConnector',
    status: 'success',
    duration: '4s',
    durationSec: 4.1,
    records: '34 FX pairs',
    bytes: '128 KB',
    startedAt: '02:00:02 UTC',
    finishedAt: '02:00:06 UTC',
    target: 'raw_currency.rates',
    engine: 'ECB SDMX API / FastHTTP',
    upstream: [],
    downstream: ['transform_normalize_fx'],
    retries: '0 / 3',
    memoryPeak: '84 MB',
    cpuPeak: '6%',
    configParams: {
      endpoint: 'https://data-api.ecb.europa.eu/service/data/EXR/D..EUR.SP00.A',
      benchmark_currency: 'USD',
      feed_type: 'Daily Official Reference Spot',
      output_format: 'JSON / Arrow Table',
      target_s3_bucket: 's3://lakehouse-raw/rates/dt=2026-02-21/',
    },
    qualityChecks: [
      {
        id: 'q1',
        assertion: 'Base Currency Coverage',
        column: 'currency_code',
        status: 'passed',
        observed: '34/34 major currencies',
        threshold: '>= 30',
      },
      {
        id: 'q2',
        assertion: 'EUR/USD Rate Sanity Check',
        column: 'spot_rate',
        status: 'passed',
        observed: '1.0842 USD',
        threshold: '0.80 - 1.40',
      },
      {
        id: 'q3',
        assertion: 'Zero Value Absence',
        column: 'rate_multiplier',
        status: 'passed',
        observed: '0 non-zero values',
        threshold: '0 zeros',
      },
    ],
    schemaColumns: [
      {
        name: 'currency_code',
        type: 'VARCHAR(3)',
        nullable: false,
        description: 'Three letter ISO code (EUR, GBP, JPY, CAD)',
      },
      {
        name: 'rate_to_usd',
        type: 'DECIMAL(12, 6)',
        nullable: false,
        description: 'Standardized multiplier to convert 1 unit to USD',
      },
      {
        name: 'published_date',
        type: 'DATE',
        nullable: false,
        description: 'Official publication date by Central Bank',
      },
      {
        name: 'ingested_at',
        type: 'TIMESTAMP_TZ',
        nullable: false,
        description: 'Ingestion pipeline timestamp',
      },
    ],
    logs: [
      {
        timestamp: '02:00:02.108',
        level: 'INFO',
        source: 'worker_1',
        message: 'Starting currency spot exchange rate ingestion from European Central Bank API',
      },
      {
        timestamp: '02:00:02.740',
        level: 'INFO',
        source: 'http',
        message: 'GET https://data-api.ecb.europa.eu/service/data/EXR/D..EUR.SP00.A?startPeriod=2026-02-20',
      },
      {
        timestamp: '02:00:03.921',
        level: 'INFO',
        source: 'parser',
        message: 'SDMX-ML XML payload decoded (34 reference base currencies parsed)',
      },
      {
        timestamp: '02:00:04.450',
        level: 'INFO',
        source: 'transform',
        message:
          'Inverted base currency rates against USD benchmark (EUR/USD: 1.0842, GBP/USD: 1.2610, JPY/USD: 154.20)',
      },
      {
        timestamp: '02:00:05.620',
        level: 'INFO',
        source: 's3',
        message: 'Writing FX snapshots to s3://lakehouse-raw/rates/fx_daily_20260221.json',
      },
      {
        timestamp: '02:00:06.210',
        level: 'SUCCESS',
        source: 'task',
        message: 'Task extract_currency_rates completed in 4.102s. 34/34 currency pairs ingested.',
      },
    ],
  },
  {
    id: 'transform_normalize_fx',
    name: 'transform_normalize_fx',
    category: 'transform',
    categoryLabel: 'TRANSFORM',
    stageNumber: 2,
    stageTitle: 'Transform & Normalize',
    operator: 'PySparkBatchOperator',
    status: 'success',
    duration: '42s',
    durationSec: 42.6,
    records: '148,290 rows',
    bytes: '58.2 MB',
    startedAt: '02:00:21 UTC',
    finishedAt: '02:01:03 UTC',
    target: 'stg_payments_fx',
    engine: 'PySpark 3.5.1 / Apache Arrow 15.0',
    upstream: ['extract_stripe_charges', 'extract_currency_rates'],
    downstream: ['validate_schema_anomalies'],
    retries: '0 / 3',
    memoryPeak: '1,280 MB',
    cpuPeak: '74%',
    configParams: {
      spark_driver_memory: '4g',
      spark_executor_memory: '8g',
      executor_instances: '4',
      join_strategy: 'BroadcastHashJoin(stripe.currency = fx.currency_code)',
      precision_mode: 'DECIMAL(18, 4)',
      output_staging_path: 's3://lakehouse-stage/payments_fx/dt=2026-02-21/',
    },
    qualityChecks: [
      {
        id: 'q1',
        assertion: 'FX Broadcast Join Match Rate',
        column: 'currency',
        status: 'passed',
        observed: '100% matched (0 orphaned FX)',
        threshold: '100%',
      },
      {
        id: 'q2',
        assertion: 'Non-negative Amount USD',
        column: 'amount_usd',
        status: 'passed',
        observed: '0 negative rows',
        threshold: '0 negative',
      },
      {
        id: 'q3',
        assertion: 'Timestamp Timezone Normalization',
        column: 'created_at_utc',
        status: 'passed',
        observed: 'All UTC ISO-8601',
        threshold: 'Valid UTC',
      },
    ],
    schemaColumns: [
      {
        name: 'charge_id',
        type: 'VARCHAR(64)',
        nullable: false,
        description: 'Normalized unique charge identifier',
      },
      {
        name: 'customer_id',
        type: 'VARCHAR(64)',
        nullable: true,
        description: 'Customer identifier reference',
      },
      {
        name: 'original_amount',
        type: 'DECIMAL(18,2)',
        nullable: false,
        description: 'Amount in transaction original currency',
      },
      {
        name: 'original_currency',
        type: 'VARCHAR(3)',
        nullable: false,
        description: 'Original ISO transaction currency',
      },
      {
        name: 'fx_rate_applied',
        type: 'DECIMAL(12,6)',
        nullable: false,
        description: 'Exchange rate multiplier to USD',
      },
      {
        name: 'amount_usd',
        type: 'DECIMAL(18,4)',
        nullable: false,
        description: 'Standardized gross revenue in USD',
      },
      {
        name: 'net_interchange_fee_usd',
        type: 'DECIMAL(18,4)',
        nullable: false,
        description: 'Estimated payment processing fees in USD',
      },
      {
        name: 'created_at_utc',
        type: 'TIMESTAMP_TZ',
        nullable: false,
        description: 'UTC converted timestamp',
      },
    ],
    logs: [
      {
        timestamp: '02:00:21.050',
        level: 'INFO',
        source: 'spark',
        message: 'Initialized PySpark cluster (executor_count: 4, cores_per_exec: 4, memory: 8GB)',
      },
      {
        timestamp: '02:00:22.410',
        level: 'INFO',
        source: 'upstream',
        message: 'Joined dependencies: extract_stripe_charges (OK), extract_currency_rates (OK)',
      },
      {
        timestamp: '02:00:24.980',
        level: 'INFO',
        source: 'dag.plan',
        message: 'Logical plan: BroadcastHashJoin(stripe_charges.currency = fx_rates.currency_code)',
      },
      {
        timestamp: '02:00:30.120',
        level: 'INFO',
        source: 'spark.exec',
        message: 'Partition 0-7 completed: Normalized cents to standardized float amounts',
      },
      {
        timestamp: '02:00:37.450',
        level: 'INFO',
        source: 'spark.exec',
        message: 'Calculated converted_amount_usd, net_interchange_fee_usd, and tax_withheld_usd',
      },
      {
        timestamp: '02:00:48.890',
        level: 'INFO',
        source: 'spark.exec',
        message: 'Partition 8-15 completed: Applied ISO-8601 UTC timestamp timezone adjustments',
      },
      {
        timestamp: '02:00:59.320',
        level: 'INFO',
        source: 'io.write',
        message: 'Emitted staging dataset to s3://lakehouse-stage/payments_fx/dt=2026-02-21/ (148,290 records)',
      },
      {
        timestamp: '02:01:03.650',
        level: 'SUCCESS',
        source: 'task',
        message: 'Task transform_normalize_fx finished in 42.600s. 0 join drops, 100% matched FX rates.',
      },
    ],
  },
  {
    id: 'validate_schema_anomalies',
    name: 'validate_schema_anomalies',
    category: 'validate',
    categoryLabel: 'VALIDATE',
    stageNumber: 3,
    stageTitle: 'Quality & Audit',
    operator: 'GreatExpectationsOperator',
    status: 'success',
    duration: '14s',
    durationSec: 14.3,
    records: '18/18 checks',
    bytes: '1.2 MB',
    startedAt: '02:01:04 UTC',
    finishedAt: '02:01:18 UTC',
    target: 'anomalies_audit',
    engine: 'Great Expectations 0.18 + Monte Carlo',
    upstream: ['transform_normalize_fx'],
    downstream: ['load_snowflake_warehouse'],
    retries: '0 / 3',
    memoryPeak: '412 MB',
    cpuPeak: '28%',
    configParams: {
      suite_name: 'suite_stripe_payments_strict_v3',
      assertion_count: '18',
      anomaly_detection_model: 'Z-Score 3-Sigma Rolling Window (30-day baseline)',
      halt_pipeline_on_error: 'True',
      alerting_webhook: 'slack://#data-pipeline-alerts',
    },
    qualityChecks: [
      {
        id: 'q1',
        assertion: 'expect_column_values_to_not_be_null',
        column: 'charge_id',
        status: 'passed',
        observed: '148,290 / 148,290 (100%)',
        threshold: '100% non-null',
      },
      {
        id: 'q2',
        assertion: 'expect_column_values_to_be_unique',
        column: 'charge_id',
        status: 'passed',
        observed: '0 duplicate keys',
        threshold: '0 duplicates',
      },
      {
        id: 'q3',
        assertion: 'expect_column_values_to_be_in_set',
        column: 'status',
        status: 'passed',
        observed: 'succeeded, failed, refunded',
        threshold: 'Allowed set',
      },
      {
        id: 'q4',
        assertion: 'expect_column_values_to_be_between',
        column: 'amount_usd',
        status: 'passed',
        observed: '$0.50 - $24,900.00',
        threshold: '$0.50 - $250k',
      },
      {
        id: 'q5',
        assertion: 'expect_table_row_count_to_be_between',
        column: '*',
        status: 'passed',
        observed: '148,290 rows',
        threshold: '100,000 - 200,000',
      },
      {
        id: 'q6',
        assertion: 'expect_volume_drift_z_score_within_bound',
        column: 'daily_volume',
        status: 'passed',
        observed: 'z = +0.42 (Normal)',
        threshold: '|z| < 3.0',
      },
    ],
    schemaColumns: [
      {
        name: 'test_id',
        type: 'VARCHAR(64)',
        nullable: false,
        description: 'Unique assertion execution ID',
      },
      {
        name: 'expectation_type',
        type: 'VARCHAR(128)',
        nullable: false,
        description: 'Great Expectations rule name',
      },
      {
        name: 'target_column',
        type: 'VARCHAR(64)',
        nullable: true,
        description: 'Target column evaluated',
      },
      {
        name: 'result_status',
        type: 'VARCHAR(16)',
        nullable: false,
        description: 'PASS or FAIL status',
      },
      {
        name: 'observed_metrics',
        type: 'JSON',
        nullable: false,
        description: 'Computed profiling metrics summary',
      },
    ],
    logs: [
      {
        timestamp: '02:01:04.110',
        level: 'INFO',
        source: 'gx.suite',
        message: 'Loading expectation suite: suite_stripe_payments_strict_v3',
      },
      {
        timestamp: '02:01:05.420',
        level: 'INFO',
        source: 'assertion',
        message: '[1/18] expect_column_values_to_not_be_null(column=charge_id) -> PASSED (148,290/148,290 valid)',
      },
      {
        timestamp: '02:01:07.190',
        level: 'INFO',
        source: 'assertion',
        message: '[2/18] expect_column_values_to_be_unique(column=charge_id) -> PASSED (0 duplicate keys)',
      },
      {
        timestamp: '02:01:09.650',
        level: 'INFO',
        source: 'assertion',
        message: '[5/18] expect_column_values_to_be_in_set(column=status, set=[succeeded, failed, refunded]) -> PASSED',
      },
      {
        timestamp: '02:01:12.330',
        level: 'INFO',
        source: 'assertion',
        message:
          '[11/18] expect_column_values_to_be_between(column=amount_usd, min_value=0.50, max_value=250000.00) -> PASSED',
      },
      {
        timestamp: '02:01:15.840',
        level: 'INFO',
        source: 'assertion',
        message:
          '[18/18] expect_table_row_count_to_be_between(min_value=100000, max_value=200000) -> PASSED (148,290 rows)',
      },
      {
        timestamp: '02:01:17.200',
        level: 'INFO',
        source: 'anomaly',
        message:
          'Statistical z-score drift test: Revenue mean +1.4% vs 30d rolling window (within normal range: ±3.0σ)',
      },
      {
        timestamp: '02:01:18.410',
        level: 'SUCCESS',
        source: 'task',
        message: 'Quality suite passed with 100% score (18/18 expectations verified, 0 anomalies detected).',
      },
    ],
  },
  {
    id: 'load_snowflake_warehouse',
    name: 'load_snowflake_warehouse',
    category: 'load',
    categoryLabel: 'LOAD',
    stageNumber: 4,
    stageTitle: 'Warehouse Load',
    operator: 'SnowflakeMergeOperator',
    status: 'success',
    duration: '1m 20s',
    durationSec: 80.0,
    records: '148,290 rows',
    bytes: '74.8 MB',
    startedAt: '02:01:19 UTC',
    finishedAt: '02:02:39 UTC',
    target: 'fct_stripe_charges',
    engine: 'Snowflake / TRANSFORMING_XL',
    upstream: ['validate_schema_anomalies'],
    downstream: ['refresh_dbt_analytics_marts'],
    retries: '0 / 3',
    memoryPeak: '520 MB',
    cpuPeak: '15%',
    configParams: {
      database: 'PROD_ANALYTICS',
      schema: 'PAYMENTS',
      target_table: 'ANALYTICS.PAYMENTS.FCT_STRIPE_CHARGES',
      warehouse_name: 'TRANSFORMING_XL (4X-Large)',
      merge_primary_key: 'charge_id',
      clustering_keys: '(created_at_utc::date, original_currency)',
      auto_suspend_seconds: '60',
    },
    qualityChecks: [
      {
        id: 'q1',
        assertion: 'Snowflake Transaction ACID Commit',
        column: 'txn_id',
        status: 'passed',
        observed: 'Committed #TXN-89021',
        threshold: 'Committed',
      },
      {
        id: 'q2',
        assertion: 'Merge Mutation Parity',
        column: 'rows_merged',
        status: 'passed',
        observed: '142.4k ins / 5.8k upd',
        threshold: '148,290 total',
      },
      {
        id: 'q3',
        assertion: 'Clustering Depth Efficiency',
        column: 'clustering_depth',
        status: 'passed',
        observed: 'Average depth: 1.12',
        threshold: '< 2.0',
      },
    ],
    schemaColumns: [
      {
        name: 'charge_id',
        type: 'VARCHAR(64)',
        nullable: false,
        description: 'Primary key charge hash',
      },
      {
        name: 'customer_id',
        type: 'VARCHAR(64)',
        nullable: true,
        description: 'Foreign key to DIM_CUSTOMERS',
      },
      {
        name: 'amount_usd',
        type: 'NUMBER(18,4)',
        nullable: false,
        description: 'Standardized gross charge amount in USD',
      },
      {
        name: 'fee_usd',
        type: 'NUMBER(18,4)',
        nullable: false,
        description: 'Interchange and payment gateway fees',
      },
      {
        name: 'net_usd',
        type: 'NUMBER(18,4)',
        nullable: false,
        description: 'Net deposited funds (amount_usd - fee_usd)',
      },
      {
        name: 'status',
        type: 'VARCHAR(32)',
        nullable: false,
        description: 'Current transactional settlement state',
      },
      {
        name: 'created_at_utc',
        type: 'TIMESTAMP_NTZ',
        nullable: false,
        description: 'Event timestamp',
      },
      {
        name: '_dbt_loaded_at',
        type: 'TIMESTAMP_NTZ',
        nullable: false,
        description: 'Warehouse load audit timestamp',
      },
    ],
    logs: [
      {
        timestamp: '02:01:19.040',
        level: 'INFO',
        source: 'snowflake',
        message: 'Establishing TLS 1.3 session to acct_finance.snowflakecomputing.com',
      },
      {
        timestamp: '02:01:21.320',
        level: 'INFO',
        source: 'warehouse',
        message: 'Resumed warehouse TRANSFORMING_XL (cluster_size: 4X-Large, auto_suspend: 60s)',
      },
      {
        timestamp: '02:01:24.890',
        level: 'SQL',
        source: 'query',
        message:
          'MERGE INTO ANALYTICS.PAYMENTS.FCT_STRIPE_CHARGES AS target USING @STAGE_S3_PAYMENTS AS stage ON target.charge_id = stage.charge_id WHEN MATCHED THEN UPDATE SET target.status = stage.status WHEN NOT MATCHED THEN INSERT (charge_id, customer_id, amount_usd, fee_usd, net_usd, status, created_at_utc, _dbt_loaded_at) VALUES (stage.charge_id, stage.customer_id, stage.amount_usd, stage.net_interchange_fee_usd, stage.amount_usd - stage.net_interchange_fee_usd, stage.status, stage.created_at_utc, CURRENT_TIMESTAMP())',
      },
      {
        timestamp: '02:01:45.120',
        level: 'INFO',
        source: 'pruner',
        message: 'Partition pruning: 42 micro-partitions scanned out of 1,280 total (96.7% pruned)',
      },
      {
        timestamp: '02:02:12.780',
        level: 'INFO',
        source: 'stats',
        message: 'Merge stats: 142,400 rows inserted, 5,890 existing rows updated (disputes/refund status sync)',
      },
      {
        timestamp: '02:02:32.410',
        level: 'INFO',
        source: 'cluster',
        message: 'Automatic clustering key (created_at_utc::date, original_currency) re-balanced in background',
      },
      {
        timestamp: '02:02:38.100',
        level: 'INFO',
        source: 'warehouse',
        message: 'Auto-suspend timer armed for warehouse TRANSFORMING_XL',
      },
      {
        timestamp: '02:02:39.050',
        level: 'SUCCESS',
        source: 'task',
        message: 'Snowflake warehouse load completed successfully in 80.010s. Target table committed.',
      },
    ],
  },
  {
    id: 'refresh_dbt_analytics_marts',
    name: 'refresh_dbt_analytics_marts',
    category: 'model',
    categoryLabel: 'MODEL',
    stageNumber: 5,
    stageTitle: 'Analytics Marts',
    operator: 'DbtCloudRunOperator',
    status: 'success',
    duration: '1m 40s',
    durationSec: 100.0,
    records: '12 models',
    bytes: '112.4 MB',
    startedAt: '02:02:40 UTC',
    finishedAt: '02:04:20 UTC',
    target: 'mart_finance_revenue',
    engine: 'dbt Core 1.8.2 / Jinja',
    upstream: ['load_snowflake_warehouse'],
    downstream: [],
    retries: '0 / 3',
    memoryPeak: '890 MB',
    cpuPeak: '62%',
    configParams: {
      dbt_project: 'bi_marts',
      target_environment: 'prod_snowflake',
      threads: '8',
      models_selection: 'tag:finance_daily+ tag:revenue_marts+',
      manifest_version: 'dbt-core v1.8.2 (schema v12)',
      downstream_webhooks: 'Looker Cache Flush, Hex App Refresh, Metabase Sync',
    },
    qualityChecks: [
      {
        id: 'q1',
        assertion: 'dbt Schema & Custom Tests',
        column: 'all_marts',
        status: 'passed',
        observed: '48/48 tests passed (0 failures)',
        threshold: '100% pass',
      },
      {
        id: 'q2',
        assertion: 'Incremental Model Freshness',
        column: 'fct_daily_gross_revenue',
        status: 'passed',
        observed: 'Watermark: 2026-02-21 02:00 UTC',
        threshold: '< 3h',
      },
      {
        id: 'q3',
        assertion: 'BI Semantic Layer Sync',
        column: 'Looker/Hex',
        status: 'passed',
        observed: '3/3 endpoints acknowledged',
        threshold: 'All ACK',
      },
    ],
    schemaColumns: [
      {
        name: 'report_date',
        type: 'DATE',
        nullable: false,
        description: 'Reporting dimension day',
      },
      {
        name: 'gross_revenue_usd',
        type: 'DECIMAL(20,2)',
        nullable: false,
        description: 'Total daily revenue converted to USD',
      },
      {
        name: 'net_revenue_usd',
        type: 'DECIMAL(20,2)',
        nullable: false,
        description: 'Gross revenue minus fees and refunds',
      },
      {
        name: 'active_paying_customers',
        type: 'INTEGER',
        nullable: false,
        description: 'Distinct customer count for the day',
      },
      {
        name: 'dispute_rate_pct',
        type: 'DECIMAL(6,4)',
        nullable: false,
        description: 'Daily payment dispute percentage',
      },
      {
        name: 'mrr_impact_usd',
        type: 'DECIMAL(18,2)',
        nullable: false,
        description: 'MRR movement delta attribution',
      },
    ],
    logs: [
      {
        timestamp: '02:02:40.090',
        level: 'INFO',
        source: 'dbt',
        message: 'Found 12 models, 48 tests, 6 snapshots, 4 semantic metrics in project bi_marts',
      },
      {
        timestamp: '02:02:42.510',
        level: 'INFO',
        source: 'dbt',
        message: 'Concurrency: 8 threads across target database PROD_ANALYTICS',
      },
      {
        timestamp: '02:02:48.330',
        level: 'INFO',
        source: 'dbt',
        message: '1 of 12 START incremental model marts.fct_daily_gross_revenue ................ [RUN]',
      },
      {
        timestamp: '02:02:59.880',
        level: 'INFO',
        source: 'dbt',
        message: '1 of 12 OK created incremental model marts.fct_daily_gross_revenue ........... [SUCCESS 11.55s]',
      },
      {
        timestamp: '02:03:00.120',
        level: 'INFO',
        source: 'dbt',
        message: '2 of 12 START table model marts.dim_customer_ltv .............................. [RUN]',
      },
      {
        timestamp: '02:03:18.420',
        level: 'INFO',
        source: 'dbt',
        message: '2 of 12 OK created table model marts.dim_customer_ltv ......................... [SUCCESS 18.30s]',
      },
      {
        timestamp: '02:03:19.050',
        level: 'INFO',
        source: 'dbt',
        message: '3 of 12 START view model marts.finance_mrr_arr_summary ....................... [RUN]',
      },
      {
        timestamp: '02:03:26.700',
        level: 'INFO',
        source: 'dbt',
        message: '3 of 12 OK created view model marts.finance_mrr_arr_summary ................... [SUCCESS 7.65s]',
      },
      {
        timestamp: '02:03:27.100',
        level: 'INFO',
        source: 'dbt',
        message: '4 of 12 START incremental model marts.fct_payment_dispute_rates .............. [RUN]',
      },
      {
        timestamp: '02:03:45.920',
        level: 'INFO',
        source: 'dbt',
        message: '4 of 12 OK created incremental model marts.fct_payment_dispute_rates ........ [SUCCESS 18.82s]',
      },
      {
        timestamp: '02:03:46.300',
        level: 'INFO',
        source: 'dbt',
        message: '5 to 12 START remaining downstream aggregate semantic marts .................. [RUN]',
      },
      {
        timestamp: '02:04:12.180',
        level: 'INFO',
        source: 'dbt',
        message: 'Running 48 data integrity tests on rebuilt marts ............................ [PASS 48/48]',
      },
      {
        timestamp: '02:04:18.500',
        level: 'INFO',
        source: 'dbt',
        message: 'Generated docs manifest and catalog metadata to target/manifest.json',
      },
      {
        timestamp: '02:04:20.120',
        level: 'SUCCESS',
        source: 'dbt',
        message:
          'Finished running 12 models, 48 tests in 100.03s. All marts synchronized with Looker/Hex BI semantic layer.',
      },
    ],
  },
]

function getNodeCategoryBadgeClass(category: NodeCategory) {
  switch (category) {
    case 'ingest':
      return 'border-sky-500/30 bg-sky-500/10 text-sky-500'
    case 'transform':
      return 'border-indigo-500/30 bg-indigo-500/10 text-indigo-500'
    case 'validate':
      return 'border-amber-500/30 bg-amber-500/10 text-amber-500'
    case 'load':
      return 'border-cyan-500/30 bg-cyan-500/10 text-cyan-500'
    case 'model':
      return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500'
    default:
      return 'border-border bg-muted text-muted-foreground'
  }
}

function getNodeIcon(id: string) {
  switch (id) {
    case 'extract_stripe_charges':
      return CreditCard
    case 'extract_currency_rates':
      return Globe
    case 'transform_normalize_fx':
      return Cpu
    case 'validate_schema_anomalies':
      return ShieldCheck
    case 'load_snowflake_warehouse':
      return Database
    case 'refresh_dbt_analytics_marts':
      return Layers
    default:
      return Workflow
  }
}

export interface EtlPipelineDagProps extends React.HTMLAttributes<HTMLDivElement> {
  initialNodeId?: string
}

export function EtlPipelineDag({ initialNodeId = 'extract_stripe_charges', className, ...props }: EtlPipelineDagProps) {
  const [selectedNodeId, setSelectedNodeId] = React.useState<string>(initialNodeId)
  const [activeTab, setActiveTab] = React.useState<string>('logs')
  const [logSearchQuery, setLogSearchQuery] = React.useState<string>('')
  const [selectedLogLevel, setSelectedLogLevel] = React.useState<string>('ALL')
  const [isWrapped, setIsWrapped] = React.useState<boolean>(false)
  const [copiedLogs, setCopiedLogs] = React.useState<boolean>(false)
  const [copiedAllLogs, setCopiedAllLogs] = React.useState<boolean>(false)
  const [isTriggering, setIsTriggering] = React.useState<boolean>(false)
  const [triggerSuccessToast, setTriggerSuccessToast] = React.useState<boolean>(false)

  const selectedNode = React.useMemo(() => {
    return pipelineNodes.find((n) => n.id === selectedNodeId) ?? pipelineNodes[0]
  }, [selectedNodeId])

  const filteredLogs = React.useMemo(() => {
    const query = logSearchQuery.trim().toLowerCase()
    const level = selectedLogLevel

    return selectedNode.logs.filter((log) => {
      const matchesLevel = level === 'ALL' || log.level === level
      const matchesQuery =
        query === '' ||
        log.message.toLowerCase().includes(query) ||
        log.source.toLowerCase().includes(query) ||
        log.timestamp.toLowerCase().includes(query)

      return matchesLevel && matchesQuery
    })
  }, [selectedNode, logSearchQuery, selectedLogLevel])

  const handleTriggerDag = React.useCallback(() => {
    if (isTriggering) return
    setIsTriggering(true)
    setTriggerSuccessToast(false)

    setTimeout(() => {
      setIsTriggering(false)
      setTriggerSuccessToast(true)
      setTimeout(() => {
        setTriggerSuccessToast(false)
      }, 4000)
    }, 1600)
  }, [isTriggering])

  const handleCopyNodeLogs = React.useCallback(async () => {
    const text = selectedNode.logs.map((l) => `[${l.timestamp}] [${l.level}] [${l.source}] ${l.message}`).join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopiedLogs(true)
      setTimeout(() => {
        setCopiedLogs(false)
      }, 2000)
    } catch {
      // Clipboard fallback
    }
  }, [selectedNode])

  const handleExportFullRunLog = React.useCallback(async () => {
    const fullLog = pipelineNodes
      .map((node) => {
        const header = `=== Task: ${node.name} (${node.operator}) - Duration: ${node.duration} ===`
        const body = node.logs.map((l) => `[${l.timestamp}] [${l.level}] [${l.source}] ${l.message}`).join('\n')
        return `${header}\n${body}`
      })
      .join('\n\n')

    try {
      await navigator.clipboard.writeText(fullLog)
      setCopiedAllLogs(true)
      setTimeout(() => {
        setCopiedAllLogs(false)
      }, 2500)
    } catch {
      // Fallback
    }
  }, [])

  const SelectedIcon = getNodeIcon(selectedNode.id)

  return (
    <div data-slot="etl-pipeline-dag" className={cn('w-full space-y-6', className)} {...props}>
      {/* Top Pipeline Header Card */}
      <Card className="border-border bg-card shadow-xs">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          {/* Left Title and DAG Badges */}
          <div className="flex min-w-0 items-start gap-3.5 sm:items-center">
            <div className="border-primary/20 bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-xl border shadow-xs">
              <Workflow className="size-5" />
            </div>

            <div className="min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-foreground font-mono text-base font-semibold tracking-tight break-all sm:text-lg">
                  stripe_payments_daily_etl
                </h2>
                <Badge variant="secondary" className="font-mono text-xs">
                  v2.4.1
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* DAG Schedule Badge */}
                <Badge variant="outline" className="gap-1.5 font-mono text-xs shadow-xs">
                  <Clock className="text-muted-foreground size-3" />
                  <span>0 2 * * * · Daily at 02:00 UTC</span>
                </Badge>

                {/* State Badge */}
                <Badge variant="success" className="gap-1.5 font-mono text-xs shadow-xs">
                  <CheckCircle2 className="size-3" />
                  <span>State: Success · Run ID: #run_90412</span>
                </Badge>

                {/* Live Queue Toast */}
                {triggerSuccessToast && (
                  <Badge variant="info" className="animate-in fade-in-0 gap-1.5 font-mono text-xs duration-300">
                    <Sparkles className="size-3" />
                    <span>Triggered Run #run_90413 queued!</span>
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              className="h-8.5 gap-1.5 text-xs font-medium"
              disabled={copiedAllLogs}
              onClick={handleExportFullRunLog}
            >
              {copiedAllLogs ? <Check className="size-3.5" /> : <FileDown className="size-3.5" />}
              <span>{copiedAllLogs ? 'Run Log Copied!' : 'Export Run Log'}</span>
            </Button>

            <Button
              variant="default"
              size="sm"
              className="h-8.5 gap-1.5 text-xs font-medium"
              disabled={isTriggering}
              onClick={handleTriggerDag}
            >
              {isTriggering ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Play className="size-3.5 fill-current" />
              )}
              <span>{isTriggering ? 'Triggering DAG Run...' : 'Trigger DAG Run'}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 4 Pipeline Health Metric Cards */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Duration */}
        <Card className="border-border bg-card shadow-xs">
          <CardContent className="flex flex-col justify-between p-4.5">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-medium">Total Duration</span>
              <div className="border-border bg-muted/60 text-muted-foreground flex size-7 items-center justify-center rounded-md border">
                <Clock className="size-3.5" />
              </div>
            </div>
            <div className="mt-2 space-y-1">
              <div className="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">04m:18s</div>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-success font-medium">On schedule</span>
                <span className="text-muted-foreground font-mono tabular-nums">-14s vs 7d avg</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Completed */}
        <Card className="border-border bg-card shadow-xs">
          <CardContent className="flex flex-col justify-between p-4.5">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-medium">Tasks Completed</span>
              <div className="border-success/30 bg-success/10 text-success flex size-7 items-center justify-center rounded-md border">
                <CheckCircle2 className="size-3.5" />
              </div>
            </div>
            <div className="mt-2 space-y-1.5">
              <div className="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">
                8 / 8 tasks succeeded
              </div>
              <div className="space-y-1">
                <Progress value={100} className="h-1.5" />
                <p className="text-muted-foreground text-xs">100% completion · 0 retries · 0 failed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Records Ingested */}
        <Card className="border-border bg-card shadow-xs">
          <CardContent className="flex flex-col justify-between p-4.5">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-medium">Records Ingested</span>
              <div className="border-border bg-muted/60 text-muted-foreground flex size-7 items-center justify-center rounded-md border">
                <Database className="size-3.5" />
              </div>
            </div>
            <div className="mt-2 space-y-1">
              <div className="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">
                148,290 records
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-success font-medium">100% data fidelity</span>
                <span className="text-muted-foreground">0 dropped rows</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Freshness */}
        <Card className="border-border bg-card shadow-xs">
          <CardContent className="flex flex-col justify-between p-4.5">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-medium">Data Freshness</span>
              <div className="border-border bg-muted/60 text-muted-foreground flex size-7 items-center justify-center rounded-md border">
                <Zap className="size-3.5" />
              </div>
            </div>
            <div className="mt-2 space-y-1">
              <div className="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">
                Lag: 12m · SLA &lt; 1h
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-success font-medium">SLA Healthy</span>
                <span className="text-muted-foreground">Target: &lt; 60m sync</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive DAG Node Pipeline Graph */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-semibold">DAG Execution Topology</CardTitle>
                <Badge variant="outline" className="font-mono text-xs">
                  6 Connected Tasks
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Directed acyclic graph with dependency streams. Select any node to inspect telemetry and execution logs.
              </CardDescription>
            </div>

            {/* Quick Topology Status Info */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="border-border bg-muted/30 text-muted-foreground flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono">
                <span className="bg-success inline-block size-2 rounded-full" />
                <span>All Upstreams Resolved</span>
              </div>
              <div className="border-border bg-muted/30 text-muted-foreground flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono">
                <GitBranch className="size-3" />
                <span>Topology: 2 Branches &rarr; Converged</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-1 sm:p-6">
          {/* DAG Canvas Box */}
          <div className="border-border bg-muted/10 relative rounded-xl border p-4 sm:p-5">
            {/* Desktop 5-Stage Topology Pipeline Layout */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
              {/* Stage 1: Extract / Ingest (2 Parallel Sources) */}
              <div className="flex flex-col justify-between gap-3.5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-muted-foreground font-mono text-xs font-semibold tracking-wider uppercase">
                    01 · Extract (2)
                  </span>
                  <Badge variant="outline" className="text-xs">
                    Parallel
                  </Badge>
                </div>

                {/* Node 1: extract_stripe_charges */}
                <div
                  role="button"
                  tabIndex={0}
                  className={cn(
                    'group focus-visible:ring-ring relative cursor-pointer rounded-xl border p-3.5 transition-all duration-200 focus-visible:ring-2 focus-visible:outline-none',
                    selectedNodeId === 'extract_stripe_charges'
                      ? 'border-primary bg-primary/[0.04] ring-primary/30 shadow-xs ring-2'
                      : 'border-border bg-card hover:border-primary/50 hover:bg-muted/30',
                  )}
                  onClick={() => setSelectedNodeId('extract_stripe_charges')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setSelectedNodeId('extract_stripe_charges')
                    }
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex size-7 items-center justify-center rounded-md border border-sky-500/30 bg-sky-500/10 text-sky-500">
                        <CreditCard className="size-3.5" />
                      </div>
                      <Badge className={cn('font-mono text-xs', getNodeCategoryBadgeClass('ingest'))}>INGEST</Badge>
                    </div>
                    <Badge variant="success" className="gap-1 font-mono text-xs">
                      <Check className="size-3" />
                      18s
                    </Badge>
                  </div>

                  <div className="mt-2.5">
                    <div className="text-foreground font-mono text-xs font-semibold break-all">
                      extract_stripe_charges
                    </div>
                    <div className="text-muted-foreground mt-0.5 font-mono text-xs">148.3k records · 42.6 MB</div>
                  </div>

                  <div className="border-border/60 mt-3 flex items-center justify-between border-t pt-2 text-xs">
                    <span className="text-muted-foreground truncate font-mono">raw_stripe.charges</span>
                    <ArrowRight className="text-muted-foreground group-hover:text-primary size-3 shrink-0 transition-colors" />
                  </div>
                </div>

                {/* Node 2: extract_currency_rates */}
                <div
                  role="button"
                  tabIndex={0}
                  className={cn(
                    'group focus-visible:ring-ring relative cursor-pointer rounded-xl border p-3.5 transition-all duration-200 focus-visible:ring-2 focus-visible:outline-none',
                    selectedNodeId === 'extract_currency_rates'
                      ? 'border-primary bg-primary/[0.04] ring-primary/30 shadow-xs ring-2'
                      : 'border-border bg-card hover:border-primary/50 hover:bg-muted/30',
                  )}
                  onClick={() => setSelectedNodeId('extract_currency_rates')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setSelectedNodeId('extract_currency_rates')
                    }
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex size-7 items-center justify-center rounded-md border border-sky-500/30 bg-sky-500/10 text-sky-500">
                        <Globe className="size-3.5" />
                      </div>
                      <Badge className={cn('font-mono text-xs', getNodeCategoryBadgeClass('ingest'))}>INGEST</Badge>
                    </div>
                    <Badge variant="success" className="gap-1 font-mono text-xs">
                      <Check className="size-3" />
                      4s
                    </Badge>
                  </div>

                  <div className="mt-2.5">
                    <div className="text-foreground font-mono text-xs font-semibold break-all">
                      extract_currency_rates
                    </div>
                    <div className="text-muted-foreground mt-0.5 font-mono text-xs">34 FX pairs · 128 KB</div>
                  </div>

                  <div className="border-border/60 mt-3 flex items-center justify-between border-t pt-2 text-xs">
                    <span className="text-muted-foreground truncate font-mono">raw_currency.rates</span>
                    <ArrowRight className="text-muted-foreground group-hover:text-primary size-3 shrink-0 transition-colors" />
                  </div>
                </div>
              </div>

              {/* Stage 2: Transform (PySpark Normalization) */}
              <div className="flex flex-col justify-between gap-3.5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-muted-foreground font-mono text-xs font-semibold tracking-wider uppercase">
                    02 · Transform
                  </span>
                  <Badge variant="secondary" className="font-mono text-xs">
                    Join 2&rarr;1
                  </Badge>
                </div>

                {/* Node 3: transform_normalize_fx */}
                <div
                  role="button"
                  tabIndex={0}
                  className={cn(
                    'group focus-visible:ring-ring relative my-auto cursor-pointer rounded-xl border p-3.5 transition-all duration-200 focus-visible:ring-2 focus-visible:outline-none',
                    selectedNodeId === 'transform_normalize_fx'
                      ? 'border-primary bg-primary/[0.04] ring-primary/30 shadow-xs ring-2'
                      : 'border-border bg-card hover:border-primary/50 hover:bg-muted/30',
                  )}
                  onClick={() => setSelectedNodeId('transform_normalize_fx')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setSelectedNodeId('transform_normalize_fx')
                    }
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex size-7 items-center justify-center rounded-md border border-indigo-500/30 bg-indigo-500/10 text-indigo-500">
                        <Cpu className="size-3.5" />
                      </div>
                      <Badge className={cn('font-mono text-xs', getNodeCategoryBadgeClass('transform'))}>
                        TRANSFORM
                      </Badge>
                    </div>
                    <Badge variant="success" className="gap-1 font-mono text-xs">
                      <Check className="size-3" />
                      42s
                    </Badge>
                  </div>

                  <div className="mt-2.5">
                    <div className="text-foreground font-mono text-xs font-semibold break-all">
                      transform_normalize_fx
                    </div>
                    <div className="text-muted-foreground mt-0.5 font-mono text-xs">148,290 rows · PySpark 3.5</div>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="border-border bg-muted/60 text-muted-foreground rounded px-1.5 py-0.5 font-mono text-xs">
                      2 Upstreams
                    </span>
                    <span className="border-border bg-muted/60 text-muted-foreground rounded px-1.5 py-0.5 font-mono text-xs">
                      Snappy
                    </span>
                  </div>

                  <div className="border-border/60 mt-3 flex items-center justify-between border-t pt-2 text-xs">
                    <span className="text-muted-foreground truncate font-mono">stg_payments_fx</span>
                    <ArrowRight className="text-muted-foreground group-hover:text-primary size-3 shrink-0 transition-colors" />
                  </div>
                </div>
              </div>

              {/* Stage 3: Quality & Validation (Great Expectations) */}
              <div className="flex flex-col justify-between gap-3.5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-muted-foreground font-mono text-xs font-semibold tracking-wider uppercase">
                    03 · Quality
                  </span>
                  <Badge variant="outline" className="font-mono text-xs">
                    18 Checks
                  </Badge>
                </div>

                {/* Node 4: validate_schema_anomalies */}
                <div
                  role="button"
                  tabIndex={0}
                  className={cn(
                    'group focus-visible:ring-ring relative my-auto cursor-pointer rounded-xl border p-3.5 transition-all duration-200 focus-visible:ring-2 focus-visible:outline-none',
                    selectedNodeId === 'validate_schema_anomalies'
                      ? 'border-primary bg-primary/[0.04] ring-primary/30 shadow-xs ring-2'
                      : 'border-border bg-card hover:border-primary/50 hover:bg-muted/30',
                  )}
                  onClick={() => setSelectedNodeId('validate_schema_anomalies')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setSelectedNodeId('validate_schema_anomalies')
                    }
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex size-7 items-center justify-center rounded-md border border-amber-500/30 bg-amber-500/10 text-amber-500">
                        <ShieldCheck className="size-3.5" />
                      </div>
                      <Badge className={cn('font-mono text-xs', getNodeCategoryBadgeClass('validate'))}>VALIDATE</Badge>
                    </div>
                    <Badge variant="success" className="gap-1 font-mono text-xs">
                      <Check className="size-3" />
                      14s
                    </Badge>
                  </div>

                  <div className="mt-2.5">
                    <div className="text-foreground font-mono text-xs font-semibold break-all">
                      validate_schema_anomalies
                    </div>
                    <div className="text-muted-foreground mt-0.5 font-mono text-xs">18/18 checks passed (100%)</div>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="border-success/30 bg-success/10 text-success rounded px-1.5 py-0.5 font-mono text-xs">
                      0 Anomalies
                    </span>
                    <span className="border-border bg-muted/60 text-muted-foreground rounded px-1.5 py-0.5 font-mono text-xs">
                      Z-Score 3σ
                    </span>
                  </div>

                  <div className="border-border/60 mt-3 flex items-center justify-between border-t pt-2 text-xs">
                    <span className="text-muted-foreground truncate font-mono">anomalies_audit</span>
                    <ArrowRight className="text-muted-foreground group-hover:text-primary size-3 shrink-0 transition-colors" />
                  </div>
                </div>
              </div>

              {/* Stage 4: Warehouse Load (Snowflake) */}
              <div className="flex flex-col justify-between gap-3.5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-muted-foreground font-mono text-xs font-semibold tracking-wider uppercase">
                    04 · Load
                  </span>
                  <Badge variant="outline" className="font-mono text-xs">
                    Snowflake
                  </Badge>
                </div>

                {/* Node 5: load_snowflake_warehouse */}
                <div
                  role="button"
                  tabIndex={0}
                  className={cn(
                    'group focus-visible:ring-ring relative my-auto cursor-pointer rounded-xl border p-3.5 transition-all duration-200 focus-visible:ring-2 focus-visible:outline-none',
                    selectedNodeId === 'load_snowflake_warehouse'
                      ? 'border-primary bg-primary/[0.04] ring-primary/30 shadow-xs ring-2'
                      : 'border-border bg-card hover:border-primary/50 hover:bg-muted/30',
                  )}
                  onClick={() => setSelectedNodeId('load_snowflake_warehouse')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setSelectedNodeId('load_snowflake_warehouse')
                    }
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex size-7 items-center justify-center rounded-md border border-cyan-500/30 bg-cyan-500/10 text-cyan-500">
                        <Database className="size-3.5" />
                      </div>
                      <Badge className={cn('font-mono text-xs', getNodeCategoryBadgeClass('load'))}>LOAD</Badge>
                    </div>
                    <Badge variant="success" className="gap-1 font-mono text-xs">
                      <Check className="size-3" />
                      1m 20s
                    </Badge>
                  </div>

                  <div className="mt-2.5">
                    <div className="text-foreground font-mono text-xs font-semibold break-all">
                      load_snowflake_warehouse
                    </div>
                    <div className="text-muted-foreground mt-0.5 font-mono text-xs">148,290 rows merged</div>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="border-border bg-muted/60 text-muted-foreground rounded px-1.5 py-0.5 font-mono text-xs">
                      4X-Large
                    </span>
                    <span className="border-border bg-muted/60 text-muted-foreground rounded px-1.5 py-0.5 font-mono text-xs">
                      Clustered
                    </span>
                  </div>

                  <div className="border-border/60 mt-3 flex items-center justify-between border-t pt-2 text-xs">
                    <span className="text-muted-foreground truncate font-mono">fct_stripe_charges</span>
                    <ArrowRight className="text-muted-foreground group-hover:text-primary size-3 shrink-0 transition-colors" />
                  </div>
                </div>
              </div>

              {/* Stage 5: Analytics Modeling (dbt Core) */}
              <div className="flex flex-col justify-between gap-3.5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-muted-foreground font-mono text-xs font-semibold tracking-wider uppercase">
                    05 · Marts
                  </span>
                  <Badge variant="outline" className="font-mono text-xs">
                    dbt Core
                  </Badge>
                </div>

                {/* Node 6: refresh_dbt_analytics_marts */}
                <div
                  role="button"
                  tabIndex={0}
                  className={cn(
                    'group focus-visible:ring-ring relative my-auto cursor-pointer rounded-xl border p-3.5 transition-all duration-200 focus-visible:ring-2 focus-visible:outline-none',
                    selectedNodeId === 'refresh_dbt_analytics_marts'
                      ? 'border-primary bg-primary/[0.04] ring-primary/30 shadow-xs ring-2'
                      : 'border-border bg-card hover:border-primary/50 hover:bg-muted/30',
                  )}
                  onClick={() => setSelectedNodeId('refresh_dbt_analytics_marts')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setSelectedNodeId('refresh_dbt_analytics_marts')
                    }
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex size-7 items-center justify-center rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-500">
                        <Layers className="size-3.5" />
                      </div>
                      <Badge className={cn('font-mono text-xs', getNodeCategoryBadgeClass('model'))}>MODEL</Badge>
                    </div>
                    <Badge variant="success" className="gap-1 font-mono text-xs">
                      <Check className="size-3" />
                      1m 40s
                    </Badge>
                  </div>

                  <div className="mt-2.5">
                    <div className="text-foreground font-mono text-xs font-semibold break-all">
                      refresh_dbt_analytics_marts
                    </div>
                    <div className="text-muted-foreground mt-0.5 font-mono text-xs">12 models · 48 tests</div>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="border-border bg-muted/60 text-muted-foreground rounded px-1.5 py-0.5 font-mono text-xs">
                      8 Threads
                    </span>
                    <span className="border-success/30 bg-success/10 text-success rounded px-1.5 py-0.5 font-mono text-xs">
                      BI Synced
                    </span>
                  </div>

                  <div className="border-border/60 mt-3 flex items-center justify-between border-t pt-2 text-xs">
                    <span className="text-muted-foreground truncate font-mono">mart_finance_revenue</span>
                    <CheckCircle2 className="text-success size-3 shrink-0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Node Log Inspector Panel */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Selected Task Metadata */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <div className="border-primary/30 bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg border">
                  <SelectedIcon className="size-4" />
                </div>
                <span className="text-foreground font-mono text-base font-semibold">{selectedNode.name}</span>
                <Badge className={cn('font-mono text-xs', getNodeCategoryBadgeClass(selectedNode.category))}>
                  {selectedNode.categoryLabel}
                </Badge>
                <Badge variant="success" className="gap-1 font-mono text-xs">
                  <Check className="size-3" />
                  Success
                </Badge>
              </div>

              {/* Task Telemetry Chips */}
              <div className="text-muted-foreground flex flex-wrap items-center gap-2 font-mono text-xs">
                <span>Operator: {selectedNode.operator}</span>
                <span>•</span>
                <span className="tabular-nums">Duration: {selectedNode.duration}</span>
                <span>•</span>
                <span className="tabular-nums">Retries: {selectedNode.retries}</span>
                <span>•</span>
                <span className="tabular-nums">RAM: {selectedNode.memoryPeak}</span>
                <span>•</span>
                <span className="tabular-nums">CPU: {selectedNode.cpuPeak}</span>
              </div>
            </div>

            {/* Log Controls & Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Search Logs Input */}
              <div className="relative w-44 sm:w-56">
                <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
                <input
                  value={logSearchQuery}
                  onChange={(e) => setLogSearchQuery(e.target.value)}
                  type="text"
                  placeholder="Filter logs..."
                  className="border-border bg-muted/40 text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-8 w-full rounded-md border pr-7 pl-8 text-xs focus-visible:ring-[2px] focus-visible:outline-none"
                />
                {logSearchQuery && (
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2"
                    aria-label="Clear log search"
                    onClick={() => setLogSearchQuery('')}
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              {/* Wrap Toggle */}
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1 text-xs"
                onClick={() => setIsWrapped(!isWrapped)}
              >
                <span>{isWrapped ? 'Unwrap Lines' : 'Wrap Lines'}</span>
              </Button>

              {/* Copy Logs Button */}
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs font-medium"
                disabled={copiedLogs}
                onClick={handleCopyNodeLogs}
              >
                {copiedLogs ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                <span>{copiedLogs ? 'Logs Copied' : 'Copy Logs'}</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="logs" className="gap-1.5 font-mono text-xs">
                <Terminal className="size-3.5" />
                <span>Stdout Logs ({selectedNode.logs.length})</span>
              </TabsTrigger>
              <TabsTrigger value="params" className="gap-1.5 font-mono text-xs">
                <Code2 className="size-3.5" />
                <span>Task Parameters</span>
              </TabsTrigger>
              <TabsTrigger value="lineage" className="gap-1.5 font-mono text-xs">
                <GitBranch className="size-3.5" />
                <span>Lineage & Schema</span>
              </TabsTrigger>
              <TabsTrigger value="quality" className="gap-1.5 font-mono text-xs">
                <ShieldCheck className="size-3.5" />
                <span>Quality Assertions ({selectedNode.qualityChecks.length})</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Stdout Execution Logs */}
            <TabsContent value="logs" className="space-y-2">
              {/* Filter Bar for Log Levels */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground mr-1 text-xs font-medium">Level:</span>
                  {(['ALL', 'INFO', 'WARN', 'SQL', 'SUCCESS'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      className={cn(
                        'min-h-6 rounded-md px-2 py-0.5 font-mono text-xs transition-colors',
                        selectedLogLevel === lvl
                          ? 'bg-primary text-primary-foreground font-semibold'
                          : 'border-border bg-muted/30 text-muted-foreground hover:text-foreground border',
                      )}
                      onClick={() => setSelectedLogLevel(lvl)}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>

                <div className="text-muted-foreground font-mono text-xs">
                  Showing {filteredLogs.length} of {selectedNode.logs.length} lines
                </div>
              </div>

              {/* Dark Terminal Window Container */}
              <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-md">
                {/* Terminal Header Bar */}
                <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-4 py-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-block size-2.5 rounded-full bg-rose-500/80" />
                      <span className="inline-block size-2.5 rounded-full bg-amber-500/80" />
                      <span className="inline-block size-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="font-mono text-xs text-zinc-400">stdout &middot; {selectedNode.operator}</span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
                    <span>host: runner-us-east-1a</span>
                    <span>&middot;</span>
                    <span>exit: 0 (success)</span>
                  </div>
                </div>

                {/* Terminal Body Viewport */}
                <div className="max-h-[380px] overflow-y-auto p-4 font-mono text-xs leading-relaxed">
                  {filteredLogs.length === 0 ? (
                    <div className="py-8 text-center text-zinc-500">
                      No log entries matching current search or level filters.
                    </div>
                  ) : (
                    filteredLogs.map((log, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          '-mx-1 flex items-start rounded px-1 py-0.5 hover:bg-zinc-900/60',
                          isWrapped ? 'break-all whitespace-pre-wrap' : 'overflow-x-auto whitespace-pre',
                        )}
                      >
                        {/* Line Number */}
                        <span className="mr-3 w-7 shrink-0 text-right text-zinc-600 tabular-nums select-none">
                          {idx + 1}
                        </span>

                        {/* Timestamp */}
                        <span className="mr-2 shrink-0 text-emerald-400/90 tabular-nums select-none">
                          [{log.timestamp}]
                        </span>

                        {/* Level Tag */}
                        <span
                          className={cn(
                            'mr-2 shrink-0 font-semibold',
                            log.level === 'INFO' && 'text-sky-400',
                            log.level === 'WARN' && 'text-amber-400',
                            log.level === 'SQL' && 'text-purple-400',
                            log.level === 'SUCCESS' && 'font-bold text-emerald-400',
                            log.level === 'ERROR' && 'font-bold text-rose-400',
                          )}
                        >
                          [{log.level}]
                        </span>

                        {/* Source Tag */}
                        <span className="mr-2 shrink-0 text-zinc-400 select-none">[{log.source}]</span>

                        {/* Message */}
                        <span className="flex-1 text-zinc-200">{log.message}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Tab 2: Task Parameters & Config */}
            <TabsContent value="params" className="space-y-4">
              <div className="border-border bg-card overflow-hidden rounded-xl border">
                <div className="border-border bg-muted/40 px-4 py-3 text-xs font-semibold">
                  Task Configuration Manifest ({selectedNode.operator})
                </div>
                <div className="divide-border divide-y text-xs">
                  {Object.entries(selectedNode.configParams).map(([key, val]) => (
                    <div key={key} className="flex flex-col gap-1 p-3.5 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-muted-foreground font-mono font-medium sm:w-1/3">{key}</span>
                      <span className="text-foreground border-border bg-muted/30 rounded border px-2 py-1 font-mono break-all sm:w-2/3">
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Tab 3: Lineage & Schema */}
            <TabsContent value="lineage" className="space-y-4">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* Upstream Dependencies */}
                <div className="border-border bg-card rounded-xl border p-4">
                  <div className="text-foreground flex items-center gap-2 text-xs font-semibold">
                    <GitCommit className="text-muted-foreground size-3.5" />
                    <span>Upstream Dependencies ({selectedNode.upstream.length})</span>
                  </div>
                  {selectedNode.upstream.length === 0 ? (
                    <div className="text-muted-foreground mt-3 text-xs">
                      Root extraction node. No upstream parent dependencies.
                    </div>
                  ) : (
                    <div className="mt-3 space-y-2">
                      {selectedNode.upstream.map((up) => (
                        <div
                          key={up}
                          role="button"
                          tabIndex={0}
                          className="border-border bg-muted/20 hover:border-primary/40 focus-visible:ring-ring flex cursor-pointer items-center justify-between rounded-lg border p-2.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                          onClick={() => setSelectedNodeId(up)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              setSelectedNodeId(up)
                            }
                          }}
                        >
                          <span className="text-foreground font-mono text-xs font-medium">{up}</span>
                          <Badge variant="success" className="text-xs">
                            Resolved
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Downstream Dependents */}
                <div className="border-border bg-card rounded-xl border p-4">
                  <div className="text-foreground flex items-center gap-2 text-xs font-semibold">
                    <CornerDownRight className="text-muted-foreground size-3.5" />
                    <span>Downstream Consumers ({selectedNode.downstream.length})</span>
                  </div>
                  {selectedNode.downstream.length === 0 ? (
                    <div className="text-muted-foreground mt-3 text-xs">
                      Terminal node. Emits finalized reporting dataset.
                    </div>
                  ) : (
                    <div className="mt-3 space-y-2">
                      {selectedNode.downstream.map((down) => (
                        <div
                          key={down}
                          role="button"
                          tabIndex={0}
                          className="border-border bg-muted/20 hover:border-primary/40 focus-visible:ring-ring flex cursor-pointer items-center justify-between rounded-lg border p-2.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                          onClick={() => setSelectedNodeId(down)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              setSelectedNodeId(down)
                            }
                          }}
                        >
                          <span className="text-foreground font-mono text-xs font-medium">{down}</span>
                          <Badge variant="outline" className="text-xs">
                            Triggered
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Target Schema Column Table */}
              <div className="border-border bg-card overflow-hidden rounded-xl border">
                <div className="border-border bg-muted/40 px-4 py-3 text-xs font-semibold">
                  Target Dataset Schema ({selectedNode.target})
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-border bg-muted/20 text-muted-foreground border-b font-mono font-medium">
                      <tr>
                        <th className="px-4 py-2.5">Column Name</th>
                        <th className="px-4 py-2.5">Data Type</th>
                        <th className="px-4 py-2.5">Nullable</th>
                        <th className="px-4 py-2.5">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-border divide-y font-mono">
                      {selectedNode.schemaColumns.map((col) => (
                        <tr key={col.name} className="hover:bg-muted/30">
                          <td className="text-foreground px-4 py-2.5 font-semibold">{col.name}</td>
                          <td className="px-4 py-2.5 text-sky-500">{col.type}</td>
                          <td className="text-muted-foreground px-4 py-2.5">{col.nullable ? 'YES' : 'NO'}</td>
                          <td className="text-muted-foreground px-4 py-2.5 font-sans">{col.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* Tab 4: Quality Assertions */}
            <TabsContent value="quality" className="space-y-4">
              <div className="border-border bg-card overflow-hidden rounded-xl border">
                <div className="border-border bg-muted/40 flex items-center justify-between px-4 py-3 text-xs font-semibold">
                  <span>Great Expectations / Assertion Test Suite</span>
                  <span className="text-success font-mono">
                    {selectedNode.qualityChecks.filter((c) => c.status === 'passed').length} /{' '}
                    {selectedNode.qualityChecks.length} PASSED
                  </span>
                </div>
                <div className="divide-border divide-y text-xs">
                  {selectedNode.qualityChecks.map((check) => (
                    <div
                      key={check.id}
                      className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="success" className="text-xs">
                            PASSED
                          </Badge>
                          <span className="text-foreground font-mono font-semibold">{check.assertion}</span>
                        </div>
                        <p className="text-muted-foreground text-xs">
                          Target column: <code className="text-foreground font-mono">{check.column}</code>
                        </p>
                      </div>

                      <div className="text-muted-foreground flex items-center gap-4 font-mono text-xs">
                        <div>
                          <span className="text-muted-foreground/80">Observed:</span>
                          <span className="text-foreground ml-1 font-semibold">{check.observed}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground/80">Threshold:</span>
                          <span className="text-muted-foreground ml-1">{check.threshold}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default EtlPipelineDag
