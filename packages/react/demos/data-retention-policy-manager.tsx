import Story from '../../components/story/Story'
import {
  DataRetentionPolicyManager,
  type RetentionPolicy,
} from '@react-registry-blocks/data-retention-policy-manager/DataRetentionPolicyManager'

const auditPolicies: RetentionPolicy[] = [
  {
    id: 'pol-audit-1',
    tableName: 'finance_ledger.journal_entries',
    database: 'SNOWFLAKE_FINANCE_SECURE',
    engine: 'Snowflake',
    partitionColumn: 'entry_date (MONTH)',
    retentionPeriod: '7 Years Compliance',
    lifecycleAction: 'Hot 1 Year -> Glacier Vault Lock 7 Years',
    archiveTier: 'Glacier Deep',
    complianceReason: 'SOX Compliance',
    totalSize: '8.4 TB',
    coldSize: '7.2 TB',
    estimatedMonthlySavings: '$840.00 / mo',
    enabled: true,
    lastRun: '12 hours ago',
    nextRun: 'Tonight at 00:00 UTC',
    rowCount: '840M rows',
  },
  {
    id: 'pol-audit-2',
    tableName: 'patient_health.clinical_encounters',
    database: 'BIGQUERY_HIPAA_STORE',
    engine: 'BigQuery',
    partitionColumn: 'encounter_timestamp (DAY)',
    retentionPeriod: '7 Years Compliance',
    lifecycleAction: 'Active 180d -> KMS Encrypted Coldline 7yr',
    archiveTier: 'Coldline',
    complianceReason: 'HIPAA Omnibus',
    totalSize: '5.2 TB',
    coldSize: '4.8 TB',
    estimatedMonthlySavings: '$520.00 / mo',
    enabled: true,
    lastRun: '1 day ago',
    nextRun: 'Sep 01 at 00:00 UTC',
    rowCount: '310M rows',
  },
  {
    id: 'pol-audit-3',
    tableName: 'identity_access.user_credentials_history',
    database: 'SNOWFLAKE_IAM_AUDIT',
    engine: 'Snowflake',
    partitionColumn: 'rotated_at (DAY)',
    retentionPeriod: '365 Days Active',
    lifecycleAction: 'Transition to Cold Glacier at 90d -> Hard Purge at 365d',
    archiveTier: 'Glacier Deep',
    complianceReason: 'PCI-DSS v4.0',
    totalSize: '1.9 TB',
    coldSize: '1.6 TB',
    estimatedMonthlySavings: '$190.00 / mo',
    enabled: true,
    lastRun: '3 hours ago',
    nextRun: 'Tomorrow at 02:00 UTC',
    rowCount: '190M rows',
  },
]

const streamingPolicies: RetentionPolicy[] = [
  {
    id: 'pol-stream-1',
    tableName: 'telemetry.edge_gateway_beacons',
    database: 'BIGQUERY_IOT_STREAM',
    engine: 'BigQuery',
    partitionColumn: 'beacon_time (HOUR)',
    retentionPeriod: '14 Days TTL',
    lifecycleAction: 'Direct Partition Drop at 14d TTL -> Zero Archive',
    archiveTier: 'Purge Immediately',
    complianceReason: 'Storage Optimization',
    totalSize: '24.0 TB',
    coldSize: '0.0 TB',
    estimatedMonthlySavings: '$2,400.00 / mo',
    enabled: true,
    lastRun: '5 min ago',
    nextRun: 'Continuous partition sweep',
    rowCount: '48.0B rows',
  },
  {
    id: 'pol-stream-2',
    tableName: 'clickstream.realtime_pageviews',
    database: 'DATABRICKS_LAKEHOUSE',
    engine: 'Databricks',
    partitionColumn: 'event_date (DAY)',
    retentionPeriod: '30 Days TTL',
    lifecycleAction: 'Delta Lake VACUUM & Partition Drop > 30d',
    archiveTier: 'Purge Immediately',
    complianceReason: 'Storage Optimization',
    totalSize: '16.5 TB',
    coldSize: '0.0 TB',
    estimatedMonthlySavings: '$1,650.00 / mo',
    enabled: true,
    lastRun: '15 min ago',
    nextRun: 'Continuous hourly sweep',
    rowCount: '19.2B rows',
  },
]

export default function DataRetentionPolicyManagerDemo() {
  return (
    <>
      <Story
        title="Default"
        description="Snowflake and BigQuery style automated data retention policy manager, partition TTL scheduler, and cold storage archive tiering with cost impact metrics, lifecycle action execution, and compliance tracking."
      >
        <DataRetentionPolicyManager />
      </Story>

      <Story
        title="Compliance Audit & Legal Hold"
        description="Strict regulatory compliance configuration for SOX, GDPR, and HIPAA immutable vault archive tiers."
      >
        <DataRetentionPolicyManager
          initialStats={{
            totalManagedData: '28.4 TB',
            totalManagedSubtitle: 'Across 64 regulated tables',
            coldArchivedData: '21.6 TB',
            archivedPercentage: 76,
            archivedSubtitle: '76% in Immutable Glacier Vault Lock',
            projectedMonthlySavings: '$2,840.00 / mo saved',
            savingsSubtitle: 'WORM compliant retention tiering',
            purged30d: '3.4 TB',
            purgedSubtitle: 'Hard-deleted per GDPR Art. 17 mandate',
          }}
          initialPolicies={auditPolicies}
        />
      </Story>

      <Story
        title="High-Throughput Streaming TTL Pruning"
        description="Aggressive partition time-to-live drops for real-time IoT and telemetry event streams."
      >
        <DataRetentionPolicyManager
          initialStats={{
            totalManagedData: '46.0 TB',
            totalManagedSubtitle: 'Across 12 IoT streaming tables',
            coldArchivedData: '0.0 TB',
            archivedPercentage: 0,
            archivedSubtitle: 'Direct TTL partition drops without archiving',
            projectedMonthlySavings: '$4,600.00 / mo saved',
            savingsSubtitle: '100% ephemeral ingestion cost control',
            purged30d: '18.2 TB',
            purgedSubtitle: 'Hourly micro-partition drops',
          }}
          initialPolicies={streamingPolicies}
        />
      </Story>
    </>
  )
}
