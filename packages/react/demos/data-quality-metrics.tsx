import Story from '../../components/story/Story'
import { DataQualityMetrics, type AssertionItem } from '@react-registry-blocks/data-quality-metrics/DataQualityMetrics'

const ecommerceAssertions: AssertionItem[] = [
  {
    id: 'assert-fct-1',
    assertionType: 'expect_column_values_to_not_be_null',
    columnName: 'order_id',
    category: 'Completeness',
    ruleDefinition: 'Global primary order identity key completeness constraint across all operational shards.',
    targetThreshold: '100.0%',
    observedValue: '100.0%',
    observedPercent: 100.0,
    failedCount: 0,
    totalEvaluated: 4820000,
    status: 'Passing',
    statusVariant: 'success',
    executionTime: '210ms',
    expectationConfig: {
      expectation_type: 'expect_column_values_to_not_be_null',
      kwargs: { column: 'order_id', mostly: 1.0 },
    },
    remediationQuery:
      '-- Order ID integrity verified across 4.82M rows.\nSELECT COUNT(*) FROM warehouse.fct_orders_daily WHERE order_id IS NULL;',
    anomalies: [],
  },
  {
    id: 'assert-fct-2',
    assertionType: 'expect_column_values_to_be_between',
    columnName: 'total_amount_cents',
    category: 'Validity',
    ruleDefinition: 'Order monetary value strictly non-negative and below catastrophic threshold ($0 to $50,000).',
    targetThreshold: '100.0%',
    observedValue: '100.0%',
    observedPercent: 100.0,
    failedCount: 0,
    totalEvaluated: 4820000,
    status: 'Passing',
    statusVariant: 'success',
    executionTime: '450ms',
    expectationConfig: {
      expectation_type: 'expect_column_values_to_be_between',
      kwargs: { column: 'total_amount_cents', min_value: 0, max_value: 5000000, mostly: 1.0 },
    },
    remediationQuery:
      '-- Zero negative or anomalous gross order values detected.\nSELECT MIN(total_amount_cents), MAX(total_amount_cents) FROM warehouse.fct_orders_daily;',
    anomalies: [],
  },
  {
    id: 'assert-fct-3',
    assertionType: 'expect_column_distinct_values_to_be_in_set',
    columnName: 'payment_status',
    category: 'Validity',
    ruleDefinition: 'Order settlement lifecycle status enumerated in [captured, refunded, voided, pending].',
    targetThreshold: '100.0%',
    observedValue: '100.0%',
    observedPercent: 100.0,
    failedCount: 0,
    totalEvaluated: 4820000,
    status: 'Passing',
    statusVariant: 'success',
    executionTime: '310ms',
    expectationConfig: {
      expectation_type: 'expect_column_distinct_values_to_be_in_set',
      kwargs: {
        column: 'payment_status',
        value_set: ['captured', 'refunded', 'voided', 'pending'],
      },
    },
    remediationQuery:
      '-- All payment status tokens match the permitted schema enum.\nSELECT DISTINCT payment_status FROM warehouse.fct_orders_daily;',
    anomalies: [],
  },
  {
    id: 'assert-fct-4',
    assertionType: 'expect_table_row_count_to_be_between',
    columnName: 'table: fct_orders_daily',
    category: 'Volume',
    ruleDefinition: 'Daily orders batch volume expectation between 3.5M and 6.0M transaction rows.',
    targetThreshold: '3.5M .. 6.0M',
    observedValue: '4,820,000',
    observedPercent: 100.0,
    failedCount: 0,
    totalEvaluated: 4820000,
    status: 'Passing',
    statusVariant: 'success',
    executionTime: '88ms',
    expectationConfig: {
      expectation_type: 'expect_table_row_count_to_be_between',
      kwargs: { min_value: 3500000, max_value: 6000000 },
    },
    remediationQuery:
      '-- Volume check passed within target window (4.82M rows in [3.5M, 6.0M]).\nSELECT COUNT(*) AS daily_orders FROM warehouse.fct_orders_daily;',
    anomalies: [],
  },
]

export default function DataQualityMetricsDemo() {
  return (
    <>
      <Story
        title="Default"
        description="Great Expectations and Soda style automated data quality assertions, schema validation, and drift detector dashboard: top header with overall quality score and run triggers, 4 assertion metric cards, data quality assertions table with category filters, and an interactive anomaly inspector drawer with SQL quarantine remediation."
      >
        <DataQualityMetrics />
      </Story>

      <Story
        title="High-Volume E-Commerce Orders Partition"
        description="Daily financial transaction partition (warehouse.fct_orders_daily) with 100% Quality Score across 4.82M audited records, payment status enum validations, and volumetric bounds."
      >
        <DataQualityMetrics
          datasetTitle="warehouse.fct_orders_daily"
          suiteName="financial_transactions_strict_v2"
          qualityScore={100}
          lastRun="Ran 6m ago · 32 assertions evaluated"
          passedAssertions="32 / 32 Passing · 100%"
          failedWarnings="0 Warnings · Clean run"
          schemaDriftStatus="0 breaking schema changes"
          totalRowsAudited="4,820,000 rows"
          assertions={ecommerceAssertions}
        />
      </Story>
    </>
  )
}
