import Story from '../../components/story/Story'
import { ParquetMetadataInspector } from '@react-registry-blocks/parquet-metadata-inspector/ParquetMetadataInspector'

export default function ParquetMetadataInspectorDemo() {
  return (
    <>
      <Story
        title="Default"
        description="Apache Parquet file format deep-dive inspector with telemetry overview, row groups switcher, column chunk statistics, dictionary encoding metrics, and hierarchical schema tree with repetition and definition levels."
      >
        <ParquetMetadataInspector />
      </Story>

      <Story
        title="Custom Dataset Partition"
        description="Parquet metadata inspector with customized lakehouse file path, storage specs, row volume, and compressed footprint."
      >
        <ParquetMetadataInspector
          filePath="s3://data-lake-telemetry/events_2026_w34_part0088.parquet"
          formatSpec="Apache Parquet v2.10 · ZSTD Compressed"
          totalRows="1,200,000 Rows"
          fileSize="42.6 MB"
          compressionRatio="79.8%"
          uncompressedSize="210.8 MB"
        />
      </Story>
    </>
  )
}
