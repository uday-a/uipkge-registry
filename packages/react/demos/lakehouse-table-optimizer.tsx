import Story from '../../components/story/Story'
import { LakehouseTableOptimizer } from '@react-registry-blocks/lakehouse-table-optimizer/LakehouseTableOptimizer'

export default function LakehouseTableOptimizerDemo() {
  return (
    <>
      <Story
        title="Default"
        description="Apache Iceberg and Delta Lake table maintenance manager, compaction optimizer, snapshot history visualizer, and time-travel SQL query helper."
      >
        <LakehouseTableOptimizer />
      </Story>

      <Story
        title="Delta Lake Gold Aggregate Table"
        description="Delta Lake v3 table layout with Liquid Clustering and predictive I/O optimization for daily financial rollups."
      >
        <LakehouseTableOptimizer
          initialTable={{
            name: 'lakehouse.gold_financial_daily_rollups',
            format: 'Delta Lake v3 · Parquet',
            totalSize: '1.8 TB',
            rowCount: '340M Rows',
            statusText: 'Liquid Clustered · 0 Small Files',
            catalog: 'Databricks Unity Catalog (us-west-2)',
            storageLocation: 's3://lakehouse-finance-prod/gold/financial_rollups/',
            lastCompacted: '14 mins ago',
            compressionCodec: 'ZSTD (Level 9)',
          }}
        />
      </Story>
    </>
  )
}
