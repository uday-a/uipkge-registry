<script setup lang="ts">
import { computed, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  ArrowRight,
  Binary,
  Check,
  Code2,
  Columns3,
  Copy,
  Download,
  FileCode2,
  FolderTree,
  HardDrive,
  Layers,
  Search,
  Table2,
} from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

interface Props {
  class?: HTMLAttributes['class']
  filePath?: string
  formatSpec?: string
  totalRows?: string
  fileSize?: string
  compressionRatio?: string
  uncompressedSize?: string
}

const props = withDefaults(defineProps<Props>(), {
  filePath: 's3://lakehouse-gold/orders_2026_q3_part0042.parquet',
  formatSpec: 'Apache Parquet v2.10 · Snappy Compressed',
  totalRows: '250,000 Rows',
  fileSize: '18.4 MB',
  compressionRatio: '74.2%',
  uncompressedSize: '71.4 MB',
})

const selectedRowGroup = ref<number>(0)
const activeTab = ref<string>('chunks')
const searchQuery = ref<string>('')
const encodingFilter = ref<'all' | 'dictionary' | 'plain'>('all')
const copiedJson = ref<boolean>(false)
const copiedUri = ref<boolean>(false)
const downloadingJson = ref<boolean>(false)

interface ColumnChunk {
  name: string
  physicalType: string
  logicalType: string
  fieldId: number
  encodings: string[]
  compression: string
  numValues: string
  nullCount: number
  nullPct: string
  minStat: string
  maxStat: string
  uncompressedBytes: string
  compressedBytes: string
  compressionRatio: string
  compressionPct: number
  isDictionaryEncoded: boolean
  dictEntries: number | null
  dictPageOffset: string | null
  dataPageOffset: string
  bitWidth: number | null
}

interface RowGroupMeta {
  id: number
  numRows: number
  numRowsFormatted: string
  totalByteSize: string
  totalCompressedSize: string
  compressionRatio: string
  fileOffset: string
  columns: ColumnChunk[]
}

const rowGroupsData: RowGroupMeta[] = [
  {
    id: 0,
    numRows: 125000,
    numRowsFormatted: '125,000 rows',
    totalByteSize: '35.7 MB',
    totalCompressedSize: '9.2 MB',
    compressionRatio: '74.2%',
    fileOffset: '0x00000004',
    columns: [
      {
        name: 'order_id',
        physicalType: 'FIXED_LEN_BYTE_ARRAY(16)',
        logicalType: 'UUID',
        fieldId: 1,
        encodings: ['PLAIN', 'RLE'],
        compression: 'Snappy',
        numValues: '125,000',
        nullCount: 0,
        nullPct: '0.0%',
        minStat: '001a4e21-9a7c-4821-bc10-1a29f8c00192',
        maxStat: 'ffe918b2-3c11-4fa0-8914-df7201bca908',
        uncompressedBytes: '4.8 MB',
        compressedBytes: '1.2 MB',
        compressionRatio: '75.0%',
        compressionPct: 75,
        isDictionaryEncoded: false,
        dictEntries: null,
        dictPageOffset: null,
        dataPageOffset: '0x00000020',
        bitWidth: null,
      },
      {
        name: 'customer_id',
        physicalType: 'INT64',
        logicalType: 'INTEGER(64, true)',
        fieldId: 2,
        encodings: ['PLAIN_DICTIONARY', 'RLE'],
        compression: 'Snappy',
        numValues: '125,000',
        nullCount: 0,
        nullPct: '0.0%',
        minStat: '10,001',
        maxStat: '994,210',
        uncompressedBytes: '3.2 MB',
        compressedBytes: '0.9 MB',
        compressionRatio: '71.9%',
        compressionPct: 71.9,
        isDictionaryEncoded: true,
        dictEntries: 54200,
        dictPageOffset: '0x00125000',
        dataPageOffset: '0x00140200',
        bitWidth: 16,
      },
      {
        name: 'order_status',
        physicalType: 'BYTE_ARRAY',
        logicalType: 'STRING (UTF8)',
        fieldId: 3,
        encodings: ['PLAIN_DICTIONARY', 'RLE'],
        compression: 'Snappy',
        numValues: '125,000',
        nullCount: 0,
        nullPct: '0.0%',
        minStat: "'cancelled'",
        maxStat: "'shipped'",
        uncompressedBytes: '1.8 MB',
        compressedBytes: '0.2 MB',
        compressionRatio: '88.9%',
        compressionPct: 88.9,
        isDictionaryEncoded: true,
        dictEntries: 5,
        dictPageOffset: '0x0021a400',
        dataPageOffset: '0x0021a480',
        bitWidth: 3,
      },
      {
        name: 'gross_amount',
        physicalType: 'FIXED_LEN_BYTE_ARRAY(9)',
        logicalType: 'DECIMAL(18, 2)',
        fieldId: 4,
        encodings: ['PLAIN_DICTIONARY', 'RLE'],
        compression: 'Snappy',
        numValues: '125,000',
        nullCount: 0,
        nullPct: '0.0%',
        minStat: '$4.50',
        maxStat: '$14,820.00',
        uncompressedBytes: '3.4 MB',
        compressedBytes: '0.8 MB',
        compressionRatio: '76.5%',
        compressionPct: 76.5,
        isDictionaryEncoded: true,
        dictEntries: 28450,
        dictPageOffset: '0x0023a100',
        dataPageOffset: '0x0026e000',
        bitWidth: 15,
      },
      {
        name: 'created_at',
        physicalType: 'INT64',
        logicalType: 'TIMESTAMP(MICROS, UTC)',
        fieldId: 5,
        encodings: ['DELTA_BINARY_PACKED', 'RLE'],
        compression: 'Snappy',
        numValues: '125,000',
        nullCount: 0,
        nullPct: '0.0%',
        minStat: '2026-07-01 00:00:00.124000',
        maxStat: '2026-07-26 23:59:58.910000',
        uncompressedBytes: '3.1 MB',
        compressedBytes: '0.7 MB',
        compressionRatio: '77.4%',
        compressionPct: 77.4,
        isDictionaryEncoded: false,
        dictEntries: null,
        dictPageOffset: null,
        dataPageOffset: '0x002e1000',
        bitWidth: null,
      },
      {
        name: 'shipping_country',
        physicalType: 'BYTE_ARRAY',
        logicalType: 'STRING (UTF8)',
        fieldId: 6,
        encodings: ['PLAIN_DICTIONARY', 'RLE'],
        compression: 'Snappy',
        numValues: '125,000',
        nullCount: 24,
        nullPct: '0.02%',
        minStat: "'AE'",
        maxStat: "'US'",
        uncompressedBytes: '1.6 MB',
        compressedBytes: '0.3 MB',
        compressionRatio: '81.2%',
        compressionPct: 81.2,
        isDictionaryEncoded: true,
        dictEntries: 48,
        dictPageOffset: '0x0034a000',
        dataPageOffset: '0x0034a240',
        bitWidth: 6,
      },
      {
        name: 'discount_rate',
        physicalType: 'FLOAT',
        logicalType: 'FLOAT(32)',
        fieldId: 7,
        encodings: ['PLAIN_DICTIONARY', 'RLE'],
        compression: 'Snappy',
        numValues: '125,000',
        nullCount: 0,
        nullPct: '0.0%',
        minStat: '0.00',
        maxStat: '0.35',
        uncompressedBytes: '1.5 MB',
        compressedBytes: '0.4 MB',
        compressionRatio: '73.3%',
        compressionPct: 73.3,
        isDictionaryEncoded: true,
        dictEntries: 12,
        dictPageOffset: '0x00390100',
        dataPageOffset: '0x00390180',
        bitWidth: 4,
      },
      {
        name: 'fulfillment_node',
        physicalType: 'BYTE_ARRAY',
        logicalType: 'STRING (UTF8)',
        fieldId: 8,
        encodings: ['PLAIN_DICTIONARY', 'RLE'],
        compression: 'Snappy',
        numValues: '125,000',
        nullCount: 82,
        nullPct: '0.07%',
        minStat: "'wh-ap-east-1'",
        maxStat: "'wh-us-west-2'",
        uncompressedBytes: '1.7 MB',
        compressedBytes: '0.3 MB',
        compressionRatio: '82.4%',
        compressionPct: 82.4,
        isDictionaryEncoded: true,
        dictEntries: 16,
        dictPageOffset: '0x003e4000',
        dataPageOffset: '0x003e4120',
        bitWidth: 4,
      },
    ],
  },
  {
    id: 1,
    numRows: 125000,
    numRowsFormatted: '125,000 rows',
    totalByteSize: '35.7 MB',
    totalCompressedSize: '9.2 MB',
    compressionRatio: '74.2%',
    fileOffset: '0x00933250',
    columns: [
      {
        name: 'order_id',
        physicalType: 'FIXED_LEN_BYTE_ARRAY(16)',
        logicalType: 'UUID',
        fieldId: 1,
        encodings: ['PLAIN', 'RLE'],
        compression: 'Snappy',
        numValues: '125,000',
        nullCount: 0,
        nullPct: '0.0%',
        minStat: '00021c90-410a-49bf-a870-19efbc441200',
        maxStat: 'fff8a910-1840-4221-a109-ccb001928371',
        uncompressedBytes: '4.8 MB',
        compressedBytes: '1.2 MB',
        compressionRatio: '75.0%',
        compressionPct: 75,
        isDictionaryEncoded: false,
        dictEntries: null,
        dictPageOffset: null,
        dataPageOffset: '0x00933270',
        bitWidth: null,
      },
      {
        name: 'customer_id',
        physicalType: 'INT64',
        logicalType: 'INTEGER(64, true)',
        fieldId: 2,
        encodings: ['PLAIN_DICTIONARY', 'RLE'],
        compression: 'Snappy',
        numValues: '125,000',
        nullCount: 0,
        nullPct: '0.0%',
        minStat: '10,042',
        maxStat: '995,800',
        uncompressedBytes: '3.2 MB',
        compressedBytes: '0.9 MB',
        compressionRatio: '71.9%',
        compressionPct: 71.9,
        isDictionaryEncoded: true,
        dictEntries: 53900,
        dictPageOffset: '0x00a58000',
        dataPageOffset: '0x00a73000',
        bitWidth: 16,
      },
      {
        name: 'order_status',
        physicalType: 'BYTE_ARRAY',
        logicalType: 'STRING (UTF8)',
        fieldId: 3,
        encodings: ['PLAIN_DICTIONARY', 'RLE'],
        compression: 'Snappy',
        numValues: '125,000',
        nullCount: 0,
        nullPct: '0.0%',
        minStat: "'cancelled'",
        maxStat: "'shipped'",
        uncompressedBytes: '1.8 MB',
        compressedBytes: '0.2 MB',
        compressionRatio: '88.9%',
        compressionPct: 88.9,
        isDictionaryEncoded: true,
        dictEntries: 5,
        dictPageOffset: '0x00b41000',
        dataPageOffset: '0x00b41080',
        bitWidth: 3,
      },
      {
        name: 'gross_amount',
        physicalType: 'FIXED_LEN_BYTE_ARRAY(9)',
        logicalType: 'DECIMAL(18, 2)',
        fieldId: 4,
        encodings: ['PLAIN_DICTIONARY', 'RLE'],
        compression: 'Snappy',
        numValues: '125,000',
        nullCount: 0,
        nullPct: '0.0%',
        minStat: '$3.90',
        maxStat: '$16,240.00',
        uncompressedBytes: '3.4 MB',
        compressedBytes: '0.8 MB',
        compressionRatio: '76.5%',
        compressionPct: 76.5,
        isDictionaryEncoded: true,
        dictEntries: 28120,
        dictPageOffset: '0x00b65000',
        dataPageOffset: '0x00b99000',
        bitWidth: 15,
      },
      {
        name: 'created_at',
        physicalType: 'INT64',
        logicalType: 'TIMESTAMP(MICROS, UTC)',
        fieldId: 5,
        encodings: ['DELTA_BINARY_PACKED', 'RLE'],
        compression: 'Snappy',
        numValues: '125,000',
        nullCount: 0,
        nullPct: '0.0%',
        minStat: '2026-07-27 00:00:01.002000',
        maxStat: '2026-08-21 14:28:00.000000',
        uncompressedBytes: '3.1 MB',
        compressedBytes: '0.7 MB',
        compressionRatio: '77.4%',
        compressionPct: 77.4,
        isDictionaryEncoded: false,
        dictEntries: null,
        dictPageOffset: null,
        dataPageOffset: '0x00c12000',
        bitWidth: null,
      },
      {
        name: 'shipping_country',
        physicalType: 'BYTE_ARRAY',
        logicalType: 'STRING (UTF8)',
        fieldId: 6,
        encodings: ['PLAIN_DICTIONARY', 'RLE'],
        compression: 'Snappy',
        numValues: '125,000',
        nullCount: 18,
        nullPct: '0.01%',
        minStat: "'AE'",
        maxStat: "'US'",
        uncompressedBytes: '1.6 MB',
        compressedBytes: '0.3 MB',
        compressionRatio: '81.2%',
        compressionPct: 81.2,
        isDictionaryEncoded: true,
        dictEntries: 48,
        dictPageOffset: '0x00c7b000',
        dataPageOffset: '0x00c7b240',
        bitWidth: 6,
      },
      {
        name: 'discount_rate',
        physicalType: 'FLOAT',
        logicalType: 'FLOAT(32)',
        fieldId: 7,
        encodings: ['PLAIN_DICTIONARY', 'RLE'],
        compression: 'Snappy',
        numValues: '125,000',
        nullCount: 0,
        nullPct: '0.0%',
        minStat: '0.00',
        maxStat: '0.35',
        uncompressedBytes: '1.5 MB',
        compressedBytes: '0.4 MB',
        compressionRatio: '73.3%',
        compressionPct: 73.3,
        isDictionaryEncoded: true,
        dictEntries: 12,
        dictPageOffset: '0x00cc1000',
        dataPageOffset: '0x00cc1080',
        bitWidth: 4,
      },
      {
        name: 'fulfillment_node',
        physicalType: 'BYTE_ARRAY',
        logicalType: 'STRING (UTF8)',
        fieldId: 8,
        encodings: ['PLAIN_DICTIONARY', 'RLE'],
        compression: 'Snappy',
        numValues: '125,000',
        nullCount: 64,
        nullPct: '0.05%',
        minStat: "'wh-ap-east-1'",
        maxStat: "'wh-us-west-2'",
        uncompressedBytes: '1.7 MB',
        compressedBytes: '0.3 MB',
        compressionRatio: '82.4%',
        compressionPct: 82.4,
        isDictionaryEncoded: true,
        dictEntries: 16,
        dictPageOffset: '0x00d15000',
        dataPageOffset: '0x00d15120',
        bitWidth: 4,
      },
    ],
  },
]

interface SchemaTreeNode {
  id: number
  path: string
  name: string
  repetition: 'REQUIRED' | 'OPTIONAL' | 'REPEATED'
  physicalType: string
  logicalType: string
  defLevel: number
  repLevel: number
  depth: number
  isGroup?: boolean
  description: string
}

const schemaTreeNodes: SchemaTreeNode[] = [
  {
    id: 1,
    path: 'schema.order_id',
    name: 'order_id',
    repetition: 'REQUIRED',
    physicalType: 'FIXED_LEN_BYTE_ARRAY(16)',
    logicalType: 'UUID',
    defLevel: 0,
    repLevel: 0,
    depth: 0,
    description: 'Unique RFC 4122 order identifier binary token.',
  },
  {
    id: 2,
    path: 'schema.customer_id',
    name: 'customer_id',
    repetition: 'REQUIRED',
    physicalType: 'INT64',
    logicalType: 'INTEGER(64, true)',
    defLevel: 0,
    repLevel: 0,
    depth: 0,
    description: 'Foreign purchaser identity key.',
  },
  {
    id: 3,
    path: 'schema.order_status',
    name: 'order_status',
    repetition: 'OPTIONAL',
    physicalType: 'BYTE_ARRAY',
    logicalType: 'STRING (UTF8)',
    defLevel: 1,
    repLevel: 0,
    depth: 0,
    description: 'Lifecycle transition stage enumerated string.',
  },
  {
    id: 4,
    path: 'schema.gross_amount',
    name: 'gross_amount',
    repetition: 'REQUIRED',
    physicalType: 'FIXED_LEN_BYTE_ARRAY(9)',
    logicalType: 'DECIMAL(18, 2)',
    defLevel: 0,
    repLevel: 0,
    depth: 0,
    description: 'High-precision billing total charge with 2 scale points.',
  },
  {
    id: 5,
    path: 'schema.created_at',
    name: 'created_at',
    repetition: 'REQUIRED',
    physicalType: 'INT64',
    logicalType: 'TIMESTAMP(MICROS, UTC)',
    defLevel: 0,
    repLevel: 0,
    depth: 0,
    description: 'UTC microsecond epoch transaction timestamp.',
  },
  {
    id: 6,
    path: 'schema.customer_metadata',
    name: 'customer_metadata',
    repetition: 'OPTIONAL',
    physicalType: 'GROUP',
    logicalType: 'STRUCT',
    defLevel: 1,
    repLevel: 0,
    depth: 0,
    isGroup: true,
    description: 'Nested profile attributes struct.',
  },
  {
    id: 7,
    path: 'schema.customer_metadata.loyalty_tier',
    name: 'loyalty_tier',
    repetition: 'OPTIONAL',
    physicalType: 'BYTE_ARRAY',
    logicalType: 'STRING (UTF8)',
    defLevel: 2,
    repLevel: 0,
    depth: 1,
    description: 'Customer loyalty tier status membership level.',
  },
  {
    id: 8,
    path: 'schema.customer_metadata.lifetime_orders',
    name: 'lifetime_orders',
    repetition: 'OPTIONAL',
    physicalType: 'INT32',
    logicalType: 'INTEGER(32, true)',
    defLevel: 2,
    repLevel: 0,
    depth: 1,
    description: 'Cumulative prior purchases count.',
  },
  {
    id: 9,
    path: 'schema.line_items',
    name: 'line_items',
    repetition: 'OPTIONAL',
    physicalType: 'GROUP',
    logicalType: 'LIST',
    defLevel: 1,
    repLevel: 0,
    depth: 0,
    isGroup: true,
    description: '3-level Parquet Standard list layout.',
  },
  {
    id: 10,
    path: 'schema.line_items.list',
    name: 'list',
    repetition: 'REPEATED',
    physicalType: 'GROUP',
    logicalType: 'BAG',
    defLevel: 2,
    repLevel: 1,
    depth: 1,
    isGroup: true,
    description: 'Repeated list item wrapper group.',
  },
  {
    id: 11,
    path: 'schema.line_items.list.element',
    name: 'element',
    repetition: 'REQUIRED',
    physicalType: 'GROUP',
    logicalType: 'STRUCT',
    defLevel: 2,
    repLevel: 1,
    depth: 2,
    isGroup: true,
    description: 'Item tuple struct.',
  },
  {
    id: 12,
    path: 'schema.line_items.list.element.sku',
    name: 'sku',
    repetition: 'REQUIRED',
    physicalType: 'BYTE_ARRAY',
    logicalType: 'STRING (UTF8)',
    defLevel: 2,
    repLevel: 1,
    depth: 3,
    description: 'Stock keeping unit barcode tag.',
  },
  {
    id: 13,
    path: 'schema.line_items.list.element.quantity',
    name: 'quantity',
    repetition: 'REQUIRED',
    physicalType: 'INT32',
    logicalType: 'INTEGER(32, true)',
    defLevel: 2,
    repLevel: 1,
    depth: 3,
    description: 'Purchased quantity count.',
  },
  {
    id: 14,
    path: 'schema.shipping_country',
    name: 'shipping_country',
    repetition: 'OPTIONAL',
    physicalType: 'BYTE_ARRAY',
    logicalType: 'STRING (UTF8)',
    defLevel: 1,
    repLevel: 0,
    depth: 0,
    description: 'ISO-3166-1 alpha-2 destination country.',
  },
  {
    id: 15,
    path: 'schema.discount_rate',
    name: 'discount_rate',
    repetition: 'OPTIONAL',
    physicalType: 'FLOAT',
    logicalType: 'FLOAT(32)',
    defLevel: 1,
    repLevel: 0,
    depth: 0,
    description: 'Promotional discount multiplier applied.',
  },
  {
    id: 16,
    path: 'schema.fulfillment_node',
    name: 'fulfillment_node',
    repetition: 'OPTIONAL',
    physicalType: 'BYTE_ARRAY',
    logicalType: 'STRING (UTF8)',
    defLevel: 1,
    repLevel: 0,
    depth: 0,
    description: 'Assigned logistics warehouse cluster.',
  },
]

const parquetHeaderJson = `{
  "version": 2,
  "created_by": "parquet-mr version 1.13.1 (build e29fa2b)",
  "num_rows": 250000,
  "num_row_groups": 2,
  "file_size_bytes": 19293798,
  "uncompressed_bytes": 74868326,
  "compression_codec": "SNAPPY",
  "encryption_algorithm": null,
  "schema": [
    { "name": "schema", "num_children": 10 },
    { "name": "order_id", "type": "FIXED_LEN_BYTE_ARRAY", "type_length": 16, "repetition_type": "REQUIRED", "field_id": 1, "converted_type": "UUID" },
    { "name": "customer_id", "type": "INT64", "repetition_type": "REQUIRED", "field_id": 2, "converted_type": "INT_64" },
    { "name": "order_status", "type": "BYTE_ARRAY", "repetition_type": "OPTIONAL", "field_id": 3, "converted_type": "UTF8" },
    { "name": "gross_amount", "type": "FIXED_LEN_BYTE_ARRAY", "type_length": 9, "repetition_type": "REQUIRED", "field_id": 4, "converted_type": "DECIMAL", "scale": 2, "precision": 18 },
    { "name": "created_at", "type": "INT64", "repetition_type": "REQUIRED", "field_id": 5, "converted_type": "TIMESTAMP_MICROS" },
    { "name": "customer_metadata", "num_children": 2, "repetition_type": "OPTIONAL", "field_id": 6 },
    { "name": "loyalty_tier", "type": "BYTE_ARRAY", "repetition_type": "OPTIONAL", "field_id": 7, "converted_type": "UTF8" },
    { "name": "lifetime_orders", "type": "INT32", "repetition_type": "OPTIONAL", "field_id": 8, "converted_type": "INT_32" },
    { "name": "line_items", "num_children": 1, "repetition_type": "OPTIONAL", "field_id": 9, "converted_type": "LIST" },
    { "name": "list", "num_children": 1, "repetition_type": "REPEATED" },
    { "name": "element", "num_children": 2, "repetition_type": "REQUIRED" },
    { "name": "sku", "type": "BYTE_ARRAY", "repetition_type": "REQUIRED", "field_id": 12, "converted_type": "UTF8" },
    { "name": "quantity", "type": "INT32", "repetition_type": "REQUIRED", "field_id": 13, "converted_type": "INT_32" },
    { "name": "shipping_country", "type": "BYTE_ARRAY", "repetition_type": "OPTIONAL", "field_id": 14, "converted_type": "UTF8" },
    { "name": "discount_rate", "type": "FLOAT", "repetition_type": "OPTIONAL", "field_id": 15 },
    { "name": "fulfillment_node", "type": "BYTE_ARRAY", "repetition_type": "OPTIONAL", "field_id": 16, "converted_type": "UTF8" }
  ],
  "row_groups": [
    {
      "ordinal": 0,
      "num_rows": 125000,
      "total_byte_size": 37434163,
      "total_compressed_size": 9646899,
      "file_offset": 4,
      "columns_count": 14
    },
    {
      "ordinal": 1,
      "num_rows": 125000,
      "total_byte_size": 37434163,
      "total_compressed_size": 9646899,
      "file_offset": 9646903,
      "columns_count": 14
    }
  ],
  "key_value_metadata": [
    { "key": "org.apache.spark.sql.parquet.row.metadata", "value": "{\\"type\\":\\"struct\\",\\"fields\\":[...]}" },
    { "key": "writer.model.name", "value": "lakehouse-batch-pipeline-gold-orders" },
    { "key": "parquet.version", "value": "2.10.0" }
  ]
}`

const activeRowGroup = computed(() => {
  return rowGroupsData[selectedRowGroup.value] ?? rowGroupsData[0]
})

const filteredColumns = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return activeRowGroup.value.columns.filter((col) => {
    const matchesSearch =
      !query ||
      col.name.toLowerCase().includes(query) ||
      col.physicalType.toLowerCase().includes(query) ||
      col.logicalType.toLowerCase().includes(query) ||
      col.encodings.some((enc) => enc.toLowerCase().includes(query))

    const matchesEncoding =
      encodingFilter.value === 'all' ||
      (encodingFilter.value === 'dictionary' && col.isDictionaryEncoded) ||
      (encodingFilter.value === 'plain' && !col.isDictionaryEncoded)

    return matchesSearch && matchesEncoding
  })
})

const dictionaryColumns = computed(() => {
  return activeRowGroup.value.columns.filter((col) => col.isDictionaryEncoded)
})

function copyJsonToClipboard() {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(parquetHeaderJson)
    copiedJson.value = true
    setTimeout(() => {
      copiedJson.value = false
    }, 2000)
  }
}

function copyUriToClipboard() {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(props.filePath)
    copiedUri.value = true
    setTimeout(() => {
      copiedUri.value = false
    }, 2000)
  }
}

function handleDownloadJson() {
  downloadingJson.value = true
  setTimeout(() => {
    if (typeof document !== 'undefined') {
      const blob = new Blob([parquetHeaderJson], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'parquet-file-metadata.json'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
    downloadingJson.value = false
  }, 400)
}
</script>

<template>
  <div
    data-slot="parquet-metadata-inspector"
    :class="
      cn('bg-background text-foreground border-border w-full overflow-hidden rounded-xl border shadow-xs', props.class)
    "
  >
    <!-- Top Parquet File Header -->
    <header class="border-border bg-card/70 border-b px-4 py-4 sm:px-6">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div class="space-y-1.5">
          <div class="flex flex-wrap items-center gap-2.5">
            <div class="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
              <FileCode2 class="size-4" />
            </div>
            <h2 class="font-mono text-sm font-semibold tracking-tight break-all sm:text-base">
              {{ props.filePath }}
            </h2>
            <button
              type="button"
              class="text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              :aria-label="'Copy S3 URI'"
              @click="copyUriToClipboard"
            >
              <Check v-if="copiedUri" class="size-3.5 text-emerald-500" />
              <Copy v-else class="size-3.5" />
            </button>
          </div>

          <div class="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
            <Badge variant="outline" class="gap-1.5 font-mono text-xs font-normal">
              <span class="size-1.5 rounded-full bg-emerald-500" />
              <span>{{ props.formatSpec }}</span>
            </Badge>
            <span class="text-muted-foreground">
              Total Rows:
              <strong class="text-foreground font-semibold tabular-nums">{{ props.totalRows }}</strong>
            </span>
            <div
              class="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-xs font-medium text-emerald-700 dark:text-emerald-300"
            >
              <span>{{ props.fileSize }}</span>
              <span>·</span>
              <span class="tabular-nums">{{ props.compressionRatio }} Compression Ratio</span>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" class="h-8 gap-1.5 text-xs shadow-xs" @click="copyJsonToClipboard">
            <Check v-if="copiedJson" class="size-3.5 text-emerald-500" />
            <Copy v-else class="size-3.5" />
            <span>{{ copiedJson ? 'JSON Copied' : 'Copy Header JSON' }}</span>
          </Button>

          <Button
            aria-label="Download attachment"
            size="sm"
            class="h-8 gap-1.5 text-xs shadow-xs"
            :disabled="downloadingJson"
            @click="handleDownloadJson"
          >
            <Download v-if="!downloadingJson" class="size-3.5" />
            <span v-else class="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span>Download Parquet Header JSON</span>
          </Button>
        </div>
      </div>
    </header>

    <div class="space-y-6 p-4 sm:p-6">
      <!-- 4 Parquet File Telemetry Cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <!-- 1. Row Groups -->
        <Card class="border-border bg-card flex flex-col justify-between shadow-xs">
          <CardHeader class="pb-2">
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <div
                  class="flex size-7 items-center justify-center rounded-md border border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400"
                >
                  <Layers class="size-3.5" />
                </div>
                <CardTitle class="text-xs font-medium">Row Groups</CardTitle>
              </div>
              <Badge variant="outline" class="font-mono text-xs tabular-nums">2 Groups</Badge>
            </div>
          </CardHeader>
          <CardContent class="space-y-2 pt-1">
            <div class="flex items-baseline gap-1.5">
              <span class="text-foreground text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">2</span>
              <span class="text-muted-foreground text-xs font-medium">Row Groups</span>
            </div>
            <div class="border-border/60 border-t pt-2 text-xs">
              <div class="text-muted-foreground flex items-center justify-between gap-x-2">
                <span>Chunk Partitioning:</span>
                <span class="text-foreground font-medium tabular-nums">125,000 rows / group</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- 2. Columns / Schema -->
        <Card class="border-border bg-card flex flex-col justify-between shadow-xs">
          <CardHeader class="pb-2">
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <div
                  class="flex size-7 items-center justify-center rounded-md border border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-400"
                >
                  <Columns3 class="size-3.5" />
                </div>
                <CardTitle class="text-xs font-medium">Columns / Schema</CardTitle>
              </div>
              <Badge variant="outline" class="font-mono text-xs tabular-nums">14 Chunks</Badge>
            </div>
          </CardHeader>
          <CardContent class="space-y-2 pt-1">
            <div class="flex items-baseline gap-1.5">
              <span class="text-foreground text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">14</span>
              <span class="text-muted-foreground text-xs font-medium">Column Chunks</span>
            </div>
            <div class="border-border/60 border-t pt-2 text-xs">
              <div class="text-muted-foreground flex items-center justify-between gap-x-2">
                <span>Nested Topology:</span>
                <span class="text-foreground font-medium tabular-nums">2 Structs · 1 List</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- 3. Uncompressed Size -->
        <Card class="border-border bg-card flex flex-col justify-between shadow-xs">
          <CardHeader class="pb-2">
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <div
                  class="flex size-7 items-center justify-center rounded-md border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                >
                  <HardDrive class="size-3.5" />
                </div>
                <CardTitle class="text-xs font-medium">Uncompressed Size</CardTitle>
              </div>
              <Badge
                variant="secondary"
                class="border-emerald-500/30 font-mono text-xs text-emerald-600 tabular-nums dark:text-emerald-400"
                >3.88x Savings</Badge
              >
            </div>
          </CardHeader>
          <CardContent class="space-y-2 pt-1">
            <div class="flex items-baseline gap-1.5">
              <span class="text-foreground text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">{{
                props.uncompressedSize
              }}</span>
              <span class="text-muted-foreground text-xs font-medium">Raw</span>
            </div>
            <div class="border-border/60 border-t pt-2 text-xs">
              <div class="text-muted-foreground flex items-center justify-between gap-x-2">
                <span>Snappy Footprint:</span>
                <span class="text-foreground font-medium tabular-nums">{{ props.fileSize }} (Saved 53.0 MB)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- 4. Dictionary Encoding Ratio -->
        <Card class="border-border bg-card flex flex-col justify-between shadow-xs">
          <CardHeader class="pb-2">
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <div
                  class="flex size-7 items-center justify-center rounded-md border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                >
                  <Binary class="size-3.5" />
                </div>
                <CardTitle class="text-xs font-medium">Dictionary Encoding</CardTitle>
              </div>
              <Badge variant="outline" class="font-mono text-xs tabular-nums">85.7%</Badge>
            </div>
          </CardHeader>
          <CardContent class="space-y-2 pt-1">
            <div class="flex items-baseline gap-1.5">
              <span class="text-foreground text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">12 / 14</span>
              <span class="text-muted-foreground text-xs font-medium">Columns Encoded</span>
            </div>
            <div class="border-border/60 border-t pt-2 text-xs">
              <div class="text-muted-foreground flex items-center justify-between gap-x-2">
                <span>Encoding Algorithms:</span>
                <span class="text-foreground font-medium">RLE + PLAIN_DICT</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Row Groups Switcher Banner -->
      <Card class="border-border bg-card shadow-xs">
        <CardContent class="p-3">
          <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-muted-foreground text-xs font-semibold tracking-wider uppercase"
                >Inspect Row Group:</span
              >
              <div class="flex flex-wrap items-center gap-1.5">
                <button
                  v-for="rg in rowGroupsData"
                  :key="rg.id"
                  type="button"
                  :class="
                    cn(
                      'cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                      selectedRowGroup === rg.id
                        ? 'bg-primary/10 text-primary border-primary/30 shadow-xs'
                        : 'bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground border-transparent',
                    )
                  "
                  @click="selectedRowGroup = rg.id"
                >
                  <div class="flex items-center gap-2">
                    <Layers class="size-3.5 opacity-70" />
                    <span class="font-mono font-semibold">Row Group #{{ rg.id }}</span>
                    <span class="bg-muted text-muted-foreground rounded px-1.5 py-0.5 font-mono text-xs tabular-nums">
                      {{ rg.numRowsFormatted }}
                    </span>
                    <span class="text-muted-foreground font-mono text-xs tabular-nums">
                      ({{ rg.totalCompressedSize }})
                    </span>
                  </div>
                </button>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2 text-xs">
              <span class="text-muted-foreground whitespace-nowrap">Row Group Offset:</span>
              <Badge variant="outline" class="min-w-0 truncate font-mono text-xs">{{
                activeRowGroup.fileOffset
              }}</Badge>
              <span class="text-muted-foreground">Raw Footprint:</span>
              <span class="text-foreground font-mono font-medium tabular-nums">{{ activeRowGroup.totalByteSize }}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Main Tabs View -->
      <Tabs v-model="activeTab" default-value="chunks" class="w-full">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList class="grid h-9 w-full grid-cols-2 p-1 sm:w-auto md:grid-cols-4">
            <TabsTrigger value="chunks" class="gap-1.5 text-xs">
              <Table2 class="size-3.5" />
              <span>Column Chunks</span>
              <span class="bg-muted py-0.2 rounded-full px-1.5 font-mono text-xs">{{
                activeRowGroup.columns.length
              }}</span>
            </TabsTrigger>
            <TabsTrigger value="schema" class="gap-1.5 text-xs">
              <FolderTree class="size-3.5" />
              <span>Schema Tree</span>
              <span class="bg-muted py-0.2 rounded-full px-1.5 font-mono text-xs">{{ schemaTreeNodes.length }}</span>
            </TabsTrigger>
            <TabsTrigger value="dictionary" class="gap-1.5 text-xs">
              <Binary class="size-3.5" />
              <span>Dictionary Metrics</span>
              <span class="bg-muted py-0.2 rounded-full px-1.5 font-mono text-xs">{{ dictionaryColumns.length }}</span>
            </TabsTrigger>
            <TabsTrigger value="thrift" class="gap-1.5 text-xs">
              <Code2 class="size-3.5" />
              <span>Thrift Metadata</span>
            </TabsTrigger>
          </TabsList>

          <!-- Search & Filters when in Chunks view -->
          <div v-if="activeTab === 'chunks'" class="flex flex-wrap items-center gap-2">
            <div class="relative w-full sm:w-56">
              <Search class="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search column chunks..."
                class="border-border bg-background text-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-8 w-full rounded-md border pr-2.5 pl-8 text-xs focus-visible:ring-2 focus-visible:outline-none"
              />
            </div>
            <div class="bg-muted border-border flex items-center rounded-md border p-0.5 text-xs">
              <button
                type="button"
                :class="
                  cn(
                    'cursor-pointer rounded px-2 py-1 transition-colors',
                    encodingFilter === 'all'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )
                "
                @click="encodingFilter = 'all'"
              >
                All
              </button>
              <button
                type="button"
                :class="
                  cn(
                    'cursor-pointer rounded px-2 py-1 transition-colors',
                    encodingFilter === 'dictionary'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )
                "
                @click="encodingFilter = 'dictionary'"
              >
                Dict Encoded
              </button>
              <button
                type="button"
                :class="
                  cn(
                    'cursor-pointer rounded px-2 py-1 transition-colors',
                    encodingFilter === 'plain'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )
                "
                @click="encodingFilter = 'plain'"
              >
                Plain
              </button>
            </div>
          </div>
        </div>

        <!-- TAB 1: Column Chunks Breakdown Table -->
        <TabsContent value="chunks" class="mt-4 space-y-4">
          <Card class="border-border overflow-hidden border shadow-none">
            <div class="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow class="bg-muted/40 hover:bg-muted/40">
                    <TableHead class="min-w-[200px] text-xs font-semibold">Column Name & Type</TableHead>
                    <TableHead class="min-w-[170px] text-xs font-semibold">Encoding & Codec</TableHead>
                    <TableHead class="min-w-[280px] text-xs font-semibold">Min / Max Column Statistics</TableHead>
                    <TableHead class="min-w-[130px] text-xs font-semibold">Null Values</TableHead>
                    <TableHead class="min-w-[190px] text-xs font-semibold">Compressed / Raw Footprint</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="col in filteredColumns" :key="col.name" class="text-xs">
                    <!-- Column Name & Physical Type -->
                    <TableCell>
                      <div class="space-y-1">
                        <div class="flex items-center gap-1.5">
                          <span class="text-foreground font-mono text-xs font-semibold">{{ col.name }}</span>
                          <Badge variant="outline" class="font-mono text-xs">ID: {{ col.fieldId }}</Badge>
                        </div>
                        <div class="flex flex-wrap items-center gap-1 text-xs">
                          <Badge variant="secondary" class="font-mono text-xs font-normal">
                            {{ col.physicalType }}
                          </Badge>
                          <ArrowRight class="text-muted-foreground size-2.5" />
                          <span class="text-muted-foreground font-mono text-xs">{{ col.logicalType }}</span>
                        </div>
                      </div>
                    </TableCell>

                    <!-- Encoding & Compression -->
                    <TableCell>
                      <div class="space-y-1.5">
                        <div class="flex flex-wrap items-center gap-1">
                          <Badge
                            v-for="enc in col.encodings"
                            :key="enc"
                            :variant="enc.includes('DICTIONARY') ? 'default' : 'outline'"
                            class="font-mono text-xs font-normal"
                          >
                            {{ enc }}
                          </Badge>
                        </div>
                        <div class="text-muted-foreground flex items-center gap-1.5 text-xs">
                          <span class="text-foreground font-medium">Codec:</span>
                          <Badge variant="secondary" class="font-mono text-xs">{{ col.compression }}</Badge>
                        </div>
                      </div>
                    </TableCell>

                    <!-- Min / Max Column Statistics -->
                    <TableCell>
                      <div class="border-border/70 bg-muted/20 space-y-1 rounded-md border p-2 font-mono text-xs">
                        <div class="flex items-baseline gap-1.5">
                          <span class="text-muted-foreground shrink-0">Min:</span>
                          <span class="text-foreground truncate font-medium" :title="col.minStat">{{
                            col.minStat
                          }}</span>
                        </div>
                        <div class="flex items-baseline gap-1.5">
                          <span class="text-muted-foreground shrink-0">Max:</span>
                          <span class="text-foreground truncate font-medium" :title="col.maxStat">{{
                            col.maxStat
                          }}</span>
                        </div>
                      </div>
                    </TableCell>

                    <!-- Null Values Count -->
                    <TableCell>
                      <div class="space-y-1">
                        <div class="flex items-center gap-1.5">
                          <Badge
                            :variant="col.nullCount === 0 ? 'secondary' : 'outline'"
                            :class="
                              col.nullCount === 0
                                ? 'border-emerald-500/30 font-mono text-xs text-emerald-600 dark:text-emerald-400'
                                : 'font-mono text-xs'
                            "
                          >
                            {{ col.nullCount }} nulls
                          </Badge>
                        </div>
                        <p class="text-muted-foreground font-mono text-xs tabular-nums">
                          {{ col.nullPct }} of {{ col.numValues }} rows
                        </p>
                      </div>
                    </TableCell>

                    <!-- Compressed vs Uncompressed Footprint -->
                    <TableCell>
                      <div class="space-y-1.5">
                        <div class="flex items-center justify-between gap-x-2 font-mono text-xs">
                          <span class="text-foreground font-semibold tabular-nums">{{ col.compressedBytes }}</span>
                          <span class="text-muted-foreground tabular-nums">/ {{ col.uncompressedBytes }}</span>
                        </div>
                        <div class="space-y-1">
                          <Progress :model-value="col.compressionPct" class="h-1.5" />
                          <div class="text-muted-foreground flex items-center justify-between gap-x-2 text-xs">
                            <span class="font-mono font-medium text-emerald-600 tabular-nums dark:text-emerald-400"
                              >{{ col.compressionRatio }} saved</span
                            >
                            <span class="font-mono text-xs">Offset: {{ col.dataPageOffset }}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>

                  <TableRow v-if="filteredColumns.length === 0">
                    <TableCell colspan="5" class="text-muted-foreground py-8 text-center text-xs">
                      No matching column chunks found for filter criteria.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <!-- TAB 2: Parquet File Schema Tree Visualizer -->
        <TabsContent value="schema" class="mt-4 space-y-4">
          <Card class="border-border shadow-none">
            <CardHeader class="border-border border-b pb-3">
              <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle class="text-sm font-semibold">Parquet Schema Definition & Field Hierarchy</CardTitle>
                  <CardDescription class="text-xs">
                    Hierarchical view of logical schema nodes, repetition rules (REQUIRED, OPTIONAL, REPEATED), and
                    maximum definition / repetition levels for column projection.
                  </CardDescription>
                </div>
                <div class="flex flex-wrap items-center gap-1.5">
                  <Badge variant="outline" class="font-mono text-xs">D: Def Level</Badge>
                  <Badge variant="outline" class="font-mono text-xs">R: Rep Level</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent class="p-0">
              <div class="divide-border divide-y">
                <!-- Root node -->
                <div class="bg-muted/40 flex items-center justify-between gap-x-2 px-4 py-2.5 font-mono text-xs">
                  <div class="flex items-center gap-2">
                    <FolderTree class="text-primary size-4" />
                    <span class="text-foreground font-bold">message schema</span>
                    <Badge variant="secondary" class="font-mono text-xs">Root Message</Badge>
                  </div>
                  <span class="text-muted-foreground font-mono text-xs">14 column fields</span>
                </div>

                <!-- Hierarchical Tree Rows -->
                <div
                  v-for="node in schemaTreeNodes"
                  :key="node.id"
                  class="hover:bg-muted/30 flex flex-col justify-between gap-2 px-4 py-3 text-xs transition-colors md:flex-row md:items-center"
                  :style="{ paddingLeft: `${Math.max(1, node.depth * 1.5 + 1)}rem` }"
                >
                  <div class="flex min-w-0 items-center gap-2">
                    <span class="text-muted-foreground font-mono select-none">
                      {{ node.depth === 0 ? '├─' : '└─' }}
                    </span>
                    <span
                      :class="
                        cn(
                          'truncate font-mono font-medium',
                          node.isGroup ? 'text-primary font-bold' : 'text-foreground',
                        )
                      "
                    >
                      {{ node.name }}
                    </span>
                    <Badge
                      :variant="
                        node.repetition === 'REQUIRED'
                          ? 'default'
                          : node.repetition === 'REPEATED'
                            ? 'secondary'
                            : 'outline'
                      "
                      class="font-mono text-xs font-normal"
                    >
                      {{ node.repetition }}
                    </Badge>
                    <Badge variant="secondary" class="font-mono text-xs font-normal">
                      {{ node.physicalType }}
                    </Badge>
                    <ArrowRight class="text-muted-foreground size-3 shrink-0" />
                    <Badge variant="outline" class="text-muted-foreground font-mono text-xs font-normal">
                      {{ node.logicalType }}
                    </Badge>
                  </div>

                  <div class="flex shrink-0 flex-wrap items-center gap-2">
                    <span
                      class="text-muted-foreground hidden max-w-[220px] truncate text-xs lg:inline-block"
                      :title="node.description"
                    >
                      {{ node.description }}
                    </span>
                    <div
                      class="bg-muted/60 border-border flex items-center gap-2 rounded border px-2 py-0.5 font-mono text-xs"
                    >
                      <span title="Max Definition Level"
                        >max_def:
                        <strong class="text-foreground font-bold tabular-nums">{{ node.defLevel }}</strong></span
                      >
                      <span class="text-muted-foreground">|</span>
                      <span title="Max Repetition Level"
                        >max_rep:
                        <strong class="text-foreground font-bold tabular-nums">{{ node.repLevel }}</strong></span
                      >
                    </div>
                    <Badge variant="outline" class="font-mono text-xs">ID: {{ node.id }}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <!-- TAB 3: Dictionary & Compression Deep Dive -->
        <TabsContent value="dictionary" class="mt-4 space-y-4">
          <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <!-- Summary card -->
            <Card class="border-border shadow-none lg:col-span-1">
              <CardHeader class="pb-3">
                <CardTitle class="text-sm font-semibold">Dictionary Optimization Impact</CardTitle>
                <CardDescription class="text-xs">
                  Plain dictionary replaces repeated byte strings and integers with compact 3-bit to 16-bit dictionary
                  index pointers.
                </CardDescription>
              </CardHeader>
              <CardContent class="space-y-4 text-xs">
                <div class="border-border bg-muted/20 space-y-2 rounded-lg border p-3">
                  <div class="flex items-center justify-between gap-x-2">
                    <span class="text-muted-foreground">Dictionary Enabled Columns:</span>
                    <span class="text-foreground font-mono font-semibold">6 / 8 Monitored</span>
                  </div>
                  <div class="flex items-center justify-between gap-x-2">
                    <span class="text-muted-foreground">Avg Space Reduction:</span>
                    <span class="font-mono font-semibold text-emerald-600 tabular-nums dark:text-emerald-400"
                      >78.4%</span
                    >
                  </div>
                  <div class="flex items-center justify-between gap-x-2">
                    <span class="text-muted-foreground">Dictionary Page Overhead:</span>
                    <span class="text-foreground font-mono font-semibold tabular-nums">0.34 MB total</span>
                  </div>
                  <div class="flex items-center justify-between gap-x-2">
                    <span class="text-muted-foreground">RLE Run Length Efficiency:</span>
                    <span class="text-foreground font-mono font-semibold">Optimal</span>
                  </div>
                </div>

                <div class="space-y-2">
                  <span class="text-muted-foreground font-medium">Compression Distribution by Codec:</span>
                  <div class="space-y-1.5">
                    <div class="flex items-center justify-between gap-x-2 font-mono">
                      <span>Snappy + RLE Dict</span>
                      <span class="font-semibold tabular-nums">74.2%</span>
                    </div>
                    <Progress :model-value="74.2" class="h-1.5" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <!-- Dictionary Table -->
            <Card class="border-border overflow-hidden shadow-none lg:col-span-2">
              <div class="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow class="bg-muted/40 hover:bg-muted/40">
                      <TableHead class="text-xs font-semibold">Column</TableHead>
                      <TableHead class="text-xs font-semibold">Distinct Entries</TableHead>
                      <TableHead class="text-xs font-semibold">Bit Width</TableHead>
                      <TableHead class="text-xs font-semibold">Dict Page Offset</TableHead>
                      <TableHead class="text-xs font-semibold">Space Savings</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow v-for="col in dictionaryColumns" :key="col.name" class="text-xs">
                      <TableCell class="text-foreground font-mono font-medium">
                        {{ col.name }}
                      </TableCell>
                      <TableCell class="font-mono tabular-nums">
                        <Badge variant="secondary" class="font-mono text-xs">
                          {{ col.dictEntries?.toLocaleString() }} values
                        </Badge>
                      </TableCell>
                      <TableCell class="font-mono tabular-nums"> {{ col.bitWidth }} bits / row </TableCell>
                      <TableCell class="text-muted-foreground font-mono text-xs">
                        {{ col.dictPageOffset }}
                      </TableCell>
                      <TableCell>
                        <div class="flex items-center gap-2">
                          <span class="font-mono font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                            {{ col.compressionRatio }}
                          </span>
                          <span class="text-muted-foreground font-mono text-xs">({{ col.compressedBytes }})</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        </TabsContent>

        <!-- TAB 4: Parquet Header JSON (Thrift) -->
        <TabsContent value="thrift" class="mt-4 space-y-4">
          <div class="border-border bg-muted/30 overflow-hidden rounded-lg border">
            <div class="border-border bg-card flex items-center justify-between gap-x-2 border-b px-4 py-2.5">
              <div class="flex items-center gap-2">
                <Code2 class="text-primary size-4" />
                <span class="text-foreground font-mono text-xs font-medium">FileMetaData.thrift.json</span>
                <Badge variant="secondary" class="font-mono text-xs">Thrift Compact Protocol</Badge>
              </div>
              <Button variant="ghost" size="sm" class="h-7 gap-1 text-xs" @click="copyJsonToClipboard">
                <Check v-if="copiedJson" class="size-3 text-emerald-500" />
                <Copy v-else class="size-3" />
                <span>{{ copiedJson ? 'Copied' : 'Copy JSON' }}</span>
              </Button>
            </div>

            <div
              class="overflow-x-auto bg-neutral-950 p-4 font-mono text-xs leading-relaxed text-neutral-100 dark:bg-neutral-950"
            >
              <pre class="whitespace-pre"><code>{{ parquetHeaderJson }}</code></pre>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>
