<script setup lang="ts">
import ParquetMetadataInspector from '@/components/blocks/parquet-metadata-inspector/ParquetMetadataInspector.vue'
</script>

<template>
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
      file-path="s3://data-lake-telemetry/events_2026_w34_part0088.parquet"
      format-spec="Apache Parquet v2.10 · ZSTD Compressed"
      total-rows="1,200,000 Rows"
      file-size="42.6 MB"
      compression-ratio="79.8%"
      uncompressed-size="210.8 MB"
    />
  </Story>
</template>
