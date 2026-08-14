import Story from '../../components/story/Story'
import {
  ReverseEtlSyncManager,
  type FieldMapping,
  type ReverseEtlMetrics,
  type SyncRunRecord,
} from '@react-registry-blocks/reverse-etl-sync-manager/ReverseEtlSyncManager'

const highVolumeMetrics: ReverseEtlMetrics = {
  recordsSynced: 128450,
  successRate: 99.8,
  duration: '04m:32s',
  warehouseName: 'Snowflake 2X-Large Warehouse',
  insertions: 3420,
  updates: 124800,
  deletions: 230,
  scheduleInterval: 'Every 15 minutes',
  nextRunIn: '08m',
}

const customMappings: FieldMapping[] = [
  {
    id: 'custom-1',
    sourceColumn: 'organization_uuid',
    sourceType: 'VARCHAR(36) [PK]',
    sourceTable: 'gold_marts.fct_enterprise_accounts',
    destinationField: 'Enterprise_UUID__c',
    destinationObject: 'Account',
    destinationType: 'Text(36) [Unique Match Key]',
    isMatchKey: true,
    syncMode: 'Upsert on Match Key',
    transform: 'Direct GUID Indexing',
    sampleValue: '9f8b1c4e-8812-402a-991f-08e7a1849201',
    active: true,
  },
  {
    id: 'custom-2',
    sourceColumn: 'predicted_churn_risk_pct',
    sourceType: 'FLOAT',
    sourceTable: 'gold_marts.fct_enterprise_accounts',
    destinationField: 'Churn_Risk_Score__c',
    destinationObject: 'Account',
    destinationType: 'Percent(3,2)',
    isMatchKey: false,
    syncMode: 'Update if Newer',
    transform: 'Decimal to Percent',
    sampleValue: '14.5%',
    active: true,
  },
  {
    id: 'custom-3',
    sourceColumn: 'billing_country_iso2',
    sourceType: 'VARCHAR(2)',
    sourceTable: 'gold_marts.fct_enterprise_accounts',
    destinationField: 'BillingCountryCode',
    destinationObject: 'Account',
    destinationType: 'Picklist(ISO)',
    isMatchKey: false,
    syncMode: 'Always Overwrite',
    transform: 'ISO Alpha-2 Mapping',
    sampleValue: 'US',
    active: true,
  },
  {
    id: 'custom-4',
    sourceColumn: 'active_seat_utilization_ratio',
    sourceType: 'NUMBER(5,2)',
    sourceTable: 'gold_marts.fct_enterprise_accounts',
    destinationField: 'Seat_Utilization__c',
    destinationObject: 'Account',
    destinationType: 'Number(5,2)',
    isMatchKey: false,
    syncMode: 'Update if Newer',
    transform: 'Ratio Calculation',
    sampleValue: '88.40',
    active: true,
  },
]

const recentHistoryWithRetries: SyncRunRecord[] = [
  {
    id: 'run-9901',
    runNumber: '#SYNC-9901',
    startedAt: '2026-08-21T14:30:00Z',
    duration: '02m:15s',
    durationSec: 135,
    status: 'succeeded',
    statusLabel: 'Succeeded (1 Retry)',
    totalRecords: 48200,
    insertedRecords: 1200,
    updatedRecords: 47000,
    deletedRecords: 0,
    failedRecords: 0,
    warehouse: 'SNOWFLAKE_WH_LARGE',
    queryId: '01b64e9a-0001-3c99-0000-00049299e821',
    batchId: 'sf-bulk-batch-8891024',
    syncTrigger: 'Scheduled Cron',
  },
  {
    id: 'run-9900',
    runNumber: '#SYNC-9900',
    startedAt: '2026-08-21T14:15:00Z',
    duration: '01m:52s',
    durationSec: 112,
    status: 'succeeded',
    statusLabel: 'Succeeded',
    totalRecords: 48100,
    insertedRecords: 450,
    updatedRecords: 47650,
    deletedRecords: 0,
    failedRecords: 0,
    warehouse: 'SNOWFLAKE_WH_LARGE',
    queryId: '01b64e9a-0001-3c98-0000-00049288d710',
    batchId: 'sf-bulk-batch-8890912',
    syncTrigger: 'Scheduled Cron',
  },
]

export default function ReverseEtlSyncManagerDemo() {
  return (
    <>
      <Story
        title="Default"
        description="Census and Hightouch style Reverse ETL sync manager synchronizing Snowflake data warehouse marts to Salesforce CRM & HubSpot with live telemetry metrics, field mapping matrix, and execution audit log."
      >
        <ReverseEtlSyncManager />
      </Story>

      <Story
        title="High-Volume Real-Time Sync"
        description="Large-scale reverse ETL data activation pipeline processing 128k+ records per sync with multi-cluster Snowflake compute."
      >
        <ReverseEtlSyncManager initialMetrics={highVolumeMetrics} />
      </Story>

      <Story
        title="Custom Field Mappings"
        description="Custom enterprise schema transformations featuring GUID match keys, churn risk scoring, and ISO country normalizers."
      >
        <ReverseEtlSyncManager initialMappings={customMappings} />
      </Story>

      <Story
        title="Execution History with API Retry Telemetry"
        description="Detailed run logs showing automated retry handling and Bulk API 2.0 batch ingestion timings."
      >
        <ReverseEtlSyncManager initialRuns={recentHistoryWithRetries} />
      </Story>
    </>
  )
}
