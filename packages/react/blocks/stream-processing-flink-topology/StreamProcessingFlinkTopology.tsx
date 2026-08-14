'use client'

import * as React from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Camera,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Cpu,
  Database,
  Flame,
  Loader2,
  Radio,
  Server,
  ShieldCheck,
  Square,
  Workflow,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface FlinkSubtask {
  id: number
  host: string
  status: 'RUNNING' | 'DEPLOYING' | 'RECONCILING'
  inRate: string
  outRate: string
  cpu: string
  heapMemory: string
  backpressure: number
  watermarkLag: string
  checkpointAckMs: number
}

export interface FlinkOperatorNode {
  id: string
  name: string
  shortTitle: string
  stageNumber: number
  category: 'source' | 'window' | 'inference' | 'sink'
  operatorClass: string
  parallelism: number
  status: 'RUNNING' | 'CANCELED' | 'FAILING'
  backpressure: number
  inputRecordsRate: string
  inputBytesRate: string
  outputRecordsRate: string
  outputBytesRate: string
  totalRecordsIn: number
  totalRecordsOut: number
  managedStateSize: string
  stateBackend: string
  heapMemory: string
  managedMemory: string
  gcTime: string
  cpuPeak: string
  watermarkLag: string
  currentWatermark: string
  description: string
  config: Record<string, string>
  subtasks: FlinkSubtask[]
}

export interface StreamProcessingFlinkTopologyProps {
  className?: string
}

const operators: FlinkOperatorNode[] = [
  {
    id: 'op-kafka-source',
    name: 'Source: Kafka Ingestion (events.fraud.transactions)',
    shortTitle: 'Kafka Ingestion Source',
    stageNumber: 1,
    category: 'source',
    operatorClass: 'org.apache.flink.connector.kafka.source.KafkaSource',
    parallelism: 8,
    status: 'RUNNING',
    backpressure: 0.0,
    inputRecordsRate: '42,500 rec/s',
    inputBytesRate: '8.4 MB/s',
    outputRecordsRate: '42,500 rec/s',
    outputBytesRate: '8.4 MB/s',
    totalRecordsIn: 184290410,
    totalRecordsOut: 184290410,
    managedStateSize: '0 MB (Stateless)',
    stateBackend: 'None (Stateless Source)',
    heapMemory: '412 MB',
    managedMemory: '0 MB',
    gcTime: '0.8 ms/min',
    cpuPeak: '14%',
    watermarkLag: '28ms',
    currentWatermark: '2026-08-21 14:32:45.892 UTC',
    description:
      'Consumes high-throughput payment transaction stream with snappy decompression and bounded out-of-orderness watermark generation.',
    config: {
      topic: 'events.fraud.transactions',
      'consumer.group.id': 'flink-fraud-scoring-v2',
      'scan.startup.mode': 'latest-offset',
      'watermark.strategy': 'BoundedOutOfOrderness(Duration.ofMillis(200))',
      'partition.discovery.interval.ms': '30000',
      'deserializer.format': 'AvroConfluentSchemaRegistry',
    },
    subtasks: [
      {
        id: 0,
        host: 'taskmanager-pod-0.k8s',
        status: 'RUNNING',
        inRate: '5,320 rec/s',
        outRate: '5,320 rec/s',
        cpu: '14%',
        heapMemory: '52 MB',
        backpressure: 0.0,
        watermarkLag: '22ms',
        checkpointAckMs: 42,
      },
      {
        id: 1,
        host: 'taskmanager-pod-0.k8s',
        status: 'RUNNING',
        inRate: '5,310 rec/s',
        outRate: '5,310 rec/s',
        cpu: '13%',
        heapMemory: '51 MB',
        backpressure: 0.0,
        watermarkLag: '24ms',
        checkpointAckMs: 44,
      },
      {
        id: 2,
        host: 'taskmanager-pod-1.k8s',
        status: 'RUNNING',
        inRate: '5,315 rec/s',
        outRate: '5,315 rec/s',
        cpu: '15%',
        heapMemory: '53 MB',
        backpressure: 0.0,
        watermarkLag: '26ms',
        checkpointAckMs: 41,
      },
      {
        id: 3,
        host: 'taskmanager-pod-1.k8s',
        status: 'RUNNING',
        inRate: '5,305 rec/s',
        outRate: '5,305 rec/s',
        cpu: '14%',
        heapMemory: '50 MB',
        backpressure: 0.0,
        watermarkLag: '23ms',
        checkpointAckMs: 45,
      },
      {
        id: 4,
        host: 'taskmanager-pod-2.k8s',
        status: 'RUNNING',
        inRate: '5,325 rec/s',
        outRate: '5,325 rec/s',
        cpu: '14%',
        heapMemory: '52 MB',
        backpressure: 0.0,
        watermarkLag: '25ms',
        checkpointAckMs: 40,
      },
      {
        id: 5,
        host: 'taskmanager-pod-2.k8s',
        status: 'RUNNING',
        inRate: '5,310 rec/s',
        outRate: '5,310 rec/s',
        cpu: '13%',
        heapMemory: '51 MB',
        backpressure: 0.0,
        watermarkLag: '24ms',
        checkpointAckMs: 43,
      },
      {
        id: 6,
        host: 'taskmanager-pod-3.k8s',
        status: 'RUNNING',
        inRate: '5,308 rec/s',
        outRate: '5,308 rec/s',
        cpu: '15%',
        heapMemory: '52 MB',
        backpressure: 0.0,
        watermarkLag: '28ms',
        checkpointAckMs: 42,
      },
      {
        id: 7,
        host: 'taskmanager-pod-3.k8s',
        status: 'RUNNING',
        inRate: '5,307 rec/s',
        outRate: '5,307 rec/s',
        cpu: '14%',
        heapMemory: '51 MB',
        backpressure: 0.0,
        watermarkLag: '25ms',
        checkpointAckMs: 43,
      },
    ],
  },
  {
    id: 'op-keyed-window',
    name: 'Keyed Sliding Window (5-min window, 10s slide)',
    shortTitle: 'Keyed Sliding Window',
    stageNumber: 2,
    category: 'window',
    operatorClass: 'org.apache.flink.streaming.runtime.operators.windowing.WindowOperator',
    parallelism: 16,
    status: 'RUNNING',
    backpressure: 0.0,
    inputRecordsRate: '42,500 rec/s',
    inputBytesRate: '8.4 MB/s',
    outputRecordsRate: '38,200 rec/s',
    outputBytesRate: '6.9 MB/s',
    totalRecordsIn: 184290410,
    totalRecordsOut: 165861369,
    managedStateSize: '18.4 MB (RocksDB)',
    stateBackend: 'EmbeddedRocksDBStateBackend',
    heapMemory: '780 MB',
    managedMemory: '1,024 MB',
    gcTime: '1.2 ms/min',
    cpuPeak: '28%',
    watermarkLag: '34ms',
    currentWatermark: '2026-08-21 14:32:45.886 UTC',
    description:
      'Aggregates velocity, cumulative transaction volumes, and rapid card-testing frequency per cardholder ID across 5m windows triggered every 10s.',
    config: {
      'window.assigner': 'SlidingEventTimeWindows.of(Time.minutes(5), Time.seconds(10))',
      'allowed.lateness': '0ms',
      'state.backend.ttl': '600000ms (10m TTL)',
      'state.active.cardholders': '12,400 keys in state',
      trigger: 'EventTimeTrigger.create()',
      evictor: 'TimeEvictor.of(Time.minutes(5))',
    },
    subtasks: [
      {
        id: 0,
        host: 'taskmanager-pod-0.k8s',
        status: 'RUNNING',
        inRate: '2,660 rec/s',
        outRate: '2,390 rec/s',
        cpu: '28%',
        heapMemory: '49 MB',
        backpressure: 0.0,
        watermarkLag: '32ms',
        checkpointAckMs: 65,
      },
      {
        id: 1,
        host: 'taskmanager-pod-0.k8s',
        status: 'RUNNING',
        inRate: '2,655 rec/s',
        outRate: '2,385 rec/s',
        cpu: '27%',
        heapMemory: '48 MB',
        backpressure: 0.0,
        watermarkLag: '34ms',
        checkpointAckMs: 68,
      },
      {
        id: 2,
        host: 'taskmanager-pod-1.k8s',
        status: 'RUNNING',
        inRate: '2,662 rec/s',
        outRate: '2,392 rec/s',
        cpu: '29%',
        heapMemory: '50 MB',
        backpressure: 0.0,
        watermarkLag: '33ms',
        checkpointAckMs: 64,
      },
      {
        id: 3,
        host: 'taskmanager-pod-1.k8s',
        status: 'RUNNING',
        inRate: '2,650 rec/s',
        outRate: '2,380 rec/s',
        cpu: '28%',
        heapMemory: '48 MB',
        backpressure: 0.0,
        watermarkLag: '35ms',
        checkpointAckMs: 66,
      },
      {
        id: 4,
        host: 'taskmanager-pod-2.k8s',
        status: 'RUNNING',
        inRate: '2,658 rec/s',
        outRate: '2,388 rec/s',
        cpu: '27%',
        heapMemory: '49 MB',
        backpressure: 0.0,
        watermarkLag: '34ms',
        checkpointAckMs: 65,
      },
      {
        id: 5,
        host: 'taskmanager-pod-2.k8s',
        status: 'RUNNING',
        inRate: '2,654 rec/s',
        outRate: '2,386 rec/s',
        cpu: '29%',
        heapMemory: '50 MB',
        backpressure: 0.0,
        watermarkLag: '33ms',
        checkpointAckMs: 67,
      },
      {
        id: 6,
        host: 'taskmanager-pod-3.k8s',
        status: 'RUNNING',
        inRate: '2,660 rec/s',
        outRate: '2,390 rec/s',
        cpu: '28%',
        heapMemory: '49 MB',
        backpressure: 0.0,
        watermarkLag: '35ms',
        checkpointAckMs: 66,
      },
      {
        id: 7,
        host: 'taskmanager-pod-3.k8s',
        status: 'RUNNING',
        inRate: '2,652 rec/s',
        outRate: '2,384 rec/s',
        cpu: '28%',
        heapMemory: '48 MB',
        backpressure: 0.0,
        watermarkLag: '34ms',
        checkpointAckMs: 64,
      },
      {
        id: 8,
        host: 'taskmanager-pod-4.k8s',
        status: 'RUNNING',
        inRate: '2,659 rec/s',
        outRate: '2,389 rec/s',
        cpu: '29%',
        heapMemory: '50 MB',
        backpressure: 0.0,
        watermarkLag: '33ms',
        checkpointAckMs: 65,
      },
      {
        id: 9,
        host: 'taskmanager-pod-4.k8s',
        status: 'RUNNING',
        inRate: '2,655 rec/s',
        outRate: '2,385 rec/s',
        cpu: '27%',
        heapMemory: '48 MB',
        backpressure: 0.0,
        watermarkLag: '36ms',
        checkpointAckMs: 68,
      },
      {
        id: 10,
        host: 'taskmanager-pod-5.k8s',
        status: 'RUNNING',
        inRate: '2,661 rec/s',
        outRate: '2,391 rec/s',
        cpu: '28%',
        heapMemory: '49 MB',
        backpressure: 0.0,
        watermarkLag: '34ms',
        checkpointAckMs: 63,
      },
      {
        id: 11,
        host: 'taskmanager-pod-5.k8s',
        status: 'RUNNING',
        inRate: '2,650 rec/s',
        outRate: '2,380 rec/s',
        cpu: '28%',
        heapMemory: '48 MB',
        backpressure: 0.0,
        watermarkLag: '35ms',
        checkpointAckMs: 66,
      },
      {
        id: 12,
        host: 'taskmanager-pod-6.k8s',
        status: 'RUNNING',
        inRate: '2,657 rec/s',
        outRate: '2,387 rec/s',
        cpu: '27%',
        heapMemory: '49 MB',
        backpressure: 0.0,
        watermarkLag: '33ms',
        checkpointAckMs: 67,
      },
      {
        id: 13,
        host: 'taskmanager-pod-6.k8s',
        status: 'RUNNING',
        inRate: '2,653 rec/s',
        outRate: '2,383 rec/s',
        cpu: '29%',
        heapMemory: '50 MB',
        backpressure: 0.0,
        watermarkLag: '34ms',
        checkpointAckMs: 65,
      },
      {
        id: 14,
        host: 'taskmanager-pod-7.k8s',
        status: 'RUNNING',
        inRate: '2,658 rec/s',
        outRate: '2,388 rec/s',
        cpu: '28%',
        heapMemory: '49 MB',
        backpressure: 0.0,
        watermarkLag: '35ms',
        checkpointAckMs: 66,
      },
      {
        id: 15,
        host: 'taskmanager-pod-7.k8s',
        status: 'RUNNING',
        inRate: '2,651 rec/s',
        outRate: '2,382 rec/s',
        cpu: '28%',
        heapMemory: '48 MB',
        backpressure: 0.0,
        watermarkLag: '34ms',
        checkpointAckMs: 64,
      },
    ],
  },
  {
    id: 'op-ml-scoring',
    name: 'ML Fraud Scoring Pattern Matcher (CEP + XGBoost ONNX)',
    shortTitle: 'ML Fraud Scoring Pattern Matcher',
    stageNumber: 3,
    category: 'inference',
    operatorClass: 'com.uipkge.fraud.engine.AsyncFraudScoringKeyedProcessFunction',
    parallelism: 16,
    status: 'RUNNING',
    backpressure: 0.0,
    inputRecordsRate: '38,200 rec/s',
    inputBytesRate: '6.9 MB/s',
    outputRecordsRate: '38,200 rec/s',
    outputBytesRate: '7.1 MB/s',
    totalRecordsIn: 165861369,
    totalRecordsOut: 165861369,
    managedStateSize: '38.2 MB (RocksDB)',
    stateBackend: 'EmbeddedRocksDBStateBackend',
    heapMemory: '1,420 MB',
    managedMemory: '2,048 MB',
    gcTime: '1.4 ms/min',
    cpuPeak: '38%',
    watermarkLag: '38ms',
    currentWatermark: '2026-08-21 14:32:45.882 UTC',
    description:
      'Evaluates stateful complex event patterns (CEP) and executes low-latency XGBoost model scoring via embedded ONNX native runtime.',
    config: {
      'model.runtime': 'ONNX Runtime 1.18 (AVX-512)',
      'model.artifact': 's3://ml-models-registry/fraud/xgboost_v4_18.onnx',
      'inference.latency.p99': '1.2ms',
      'rocksdb.block.cache.size': '512 MB',
      'rocksdb.compaction.style': 'LEVEL',
      'alert.confidence.threshold': '0.85',
    },
    subtasks: [
      {
        id: 0,
        host: 'taskmanager-pod-0.k8s',
        status: 'RUNNING',
        inRate: '2,390 rec/s',
        outRate: '2,390 rec/s',
        cpu: '38%',
        heapMemory: '89 MB',
        backpressure: 0.0,
        watermarkLag: '37ms',
        checkpointAckMs: 110,
      },
      {
        id: 1,
        host: 'taskmanager-pod-0.k8s',
        status: 'RUNNING',
        inRate: '2,385 rec/s',
        outRate: '2,385 rec/s',
        cpu: '37%',
        heapMemory: '88 MB',
        backpressure: 0.0,
        watermarkLag: '38ms',
        checkpointAckMs: 114,
      },
      {
        id: 2,
        host: 'taskmanager-pod-1.k8s',
        status: 'RUNNING',
        inRate: '2,392 rec/s',
        outRate: '2,392 rec/s',
        cpu: '39%',
        heapMemory: '90 MB',
        backpressure: 0.0,
        watermarkLag: '36ms',
        checkpointAckMs: 108,
      },
      {
        id: 3,
        host: 'taskmanager-pod-1.k8s',
        status: 'RUNNING',
        inRate: '2,380 rec/s',
        outRate: '2,380 rec/s',
        cpu: '38%',
        heapMemory: '87 MB',
        backpressure: 0.0,
        watermarkLag: '39ms',
        checkpointAckMs: 112,
      },
      {
        id: 4,
        host: 'taskmanager-pod-2.k8s',
        status: 'RUNNING',
        inRate: '2,388 rec/s',
        outRate: '2,388 rec/s',
        cpu: '37%',
        heapMemory: '88 MB',
        backpressure: 0.0,
        watermarkLag: '38ms',
        checkpointAckMs: 111,
      },
      {
        id: 5,
        host: 'taskmanager-pod-2.k8s',
        status: 'RUNNING',
        inRate: '2,386 rec/s',
        outRate: '2,386 rec/s',
        cpu: '39%',
        heapMemory: '90 MB',
        backpressure: 0.0,
        watermarkLag: '37ms',
        checkpointAckMs: 115,
      },
      {
        id: 6,
        host: 'taskmanager-pod-3.k8s',
        status: 'RUNNING',
        inRate: '2,390 rec/s',
        outRate: '2,390 rec/s',
        cpu: '38%',
        heapMemory: '89 MB',
        backpressure: 0.0,
        watermarkLag: '39ms',
        checkpointAckMs: 110,
      },
      {
        id: 7,
        host: 'taskmanager-pod-3.k8s',
        status: 'RUNNING',
        inRate: '2,384 rec/s',
        outRate: '2,384 rec/s',
        cpu: '37%',
        heapMemory: '87 MB',
        backpressure: 0.0,
        watermarkLag: '38ms',
        checkpointAckMs: 112,
      },
      {
        id: 8,
        host: 'taskmanager-pod-4.k8s',
        status: 'RUNNING',
        inRate: '2,389 rec/s',
        outRate: '2,389 rec/s',
        cpu: '38%',
        heapMemory: '89 MB',
        backpressure: 0.0,
        watermarkLag: '37ms',
        checkpointAckMs: 109,
      },
      {
        id: 9,
        host: 'taskmanager-pod-4.k8s',
        status: 'RUNNING',
        inRate: '2,385 rec/s',
        outRate: '2,385 rec/s',
        cpu: '37%',
        heapMemory: '88 MB',
        backpressure: 0.0,
        watermarkLag: '39ms',
        checkpointAckMs: 113,
      },
      {
        id: 10,
        host: 'taskmanager-pod-5.k8s',
        status: 'RUNNING',
        inRate: '2,391 rec/s',
        outRate: '2,391 rec/s',
        cpu: '39%',
        heapMemory: '90 MB',
        backpressure: 0.0,
        watermarkLag: '37ms',
        checkpointAckMs: 108,
      },
      {
        id: 11,
        host: 'taskmanager-pod-5.k8s',
        status: 'RUNNING',
        inRate: '2,380 rec/s',
        outRate: '2,380 rec/s',
        cpu: '38%',
        heapMemory: '87 MB',
        backpressure: 0.0,
        watermarkLag: '38ms',
        checkpointAckMs: 112,
      },
      {
        id: 12,
        host: 'taskmanager-pod-6.k8s',
        status: 'RUNNING',
        inRate: '2,387 rec/s',
        outRate: '2,387 rec/s',
        cpu: '37%',
        heapMemory: '88 MB',
        backpressure: 0.0,
        watermarkLag: '36ms',
        checkpointAckMs: 111,
      },
      {
        id: 13,
        host: 'taskmanager-pod-6.k8s',
        status: 'RUNNING',
        inRate: '2,383 rec/s',
        outRate: '2,383 rec/s',
        cpu: '39%',
        heapMemory: '90 MB',
        backpressure: 0.0,
        watermarkLag: '38ms',
        checkpointAckMs: 114,
      },
      {
        id: 14,
        host: 'taskmanager-pod-7.k8s',
        status: 'RUNNING',
        inRate: '2,388 rec/s',
        outRate: '2,388 rec/s',
        cpu: '38%',
        heapMemory: '89 MB',
        backpressure: 0.0,
        watermarkLag: '39ms',
        checkpointAckMs: 110,
      },
      {
        id: 15,
        host: 'taskmanager-pod-7.k8s',
        status: 'RUNNING',
        inRate: '2,382 rec/s',
        outRate: '2,382 rec/s',
        cpu: '38%',
        heapMemory: '88 MB',
        backpressure: 0.0,
        watermarkLag: '37ms',
        checkpointAckMs: 112,
      },
    ],
  },
  {
    id: 'op-sink-dispatcher',
    name: 'Sink: Alert Dispatcher & Redis Cache',
    shortTitle: 'Sink: Alert Dispatcher & Redis Cache',
    stageNumber: 4,
    category: 'sink',
    operatorClass: 'com.uipkge.fraud.sink.TwoPhaseCommitRedisAlertSink',
    parallelism: 8,
    status: 'RUNNING',
    backpressure: 0.0,
    inputRecordsRate: '38,200 rec/s',
    inputBytesRate: '7.1 MB/s',
    outputRecordsRate: '42,500 rec/s',
    outputBytesRate: '9.2 MB/s',
    totalRecordsIn: 165861369,
    totalRecordsOut: 165861369,
    managedStateSize: '0.4 MB (2PC WAL)',
    stateBackend: 'Transactional Two-Phase Commit',
    heapMemory: '380 MB',
    managedMemory: '128 MB',
    gcTime: '0.9 ms/min',
    cpuPeak: '16%',
    watermarkLag: '42ms',
    currentWatermark: '2026-08-21 14:32:45.878 UTC',
    description:
      'Commits risk scoring states to Redis Cluster for zero-latency checkout authorization gates and pushes flagged transactions to incident queues.',
    config: {
      'sink.semantics': 'EXACTLY_ONCE (2PC Transactional)',
      'redis.cluster.nodes': 'redis-cluster.internal:6379 (6 nodes)',
      'redis.ttl': '86400s (24-hour key expiration)',
      'webhook.alert.queue': 'https://alerts.security.internal/v1/fraud',
      'batch.flush.interval.ms': '50',
    },
    subtasks: [
      {
        id: 0,
        host: 'taskmanager-pod-0.k8s',
        status: 'RUNNING',
        inRate: '4,775 rec/s',
        outRate: '5,312 rec/s',
        cpu: '16%',
        heapMemory: '48 MB',
        backpressure: 0.0,
        watermarkLag: '41ms',
        checkpointAckMs: 52,
      },
      {
        id: 1,
        host: 'taskmanager-pod-1.k8s',
        status: 'RUNNING',
        inRate: '4,770 rec/s',
        outRate: '5,308 rec/s',
        cpu: '15%',
        heapMemory: '47 MB',
        backpressure: 0.0,
        watermarkLag: '43ms',
        checkpointAckMs: 55,
      },
      {
        id: 2,
        host: 'taskmanager-pod-2.k8s',
        status: 'RUNNING',
        inRate: '4,780 rec/s',
        outRate: '5,315 rec/s',
        cpu: '17%',
        heapMemory: '49 MB',
        backpressure: 0.0,
        watermarkLag: '40ms',
        checkpointAckMs: 51,
      },
      {
        id: 3,
        host: 'taskmanager-pod-3.k8s',
        status: 'RUNNING',
        inRate: '4,765 rec/s',
        outRate: '5,305 rec/s',
        cpu: '16%',
        heapMemory: '46 MB',
        backpressure: 0.0,
        watermarkLag: '44ms',
        checkpointAckMs: 56,
      },
      {
        id: 4,
        host: 'taskmanager-pod-4.k8s',
        status: 'RUNNING',
        inRate: '4,778 rec/s',
        outRate: '5,314 rec/s',
        cpu: '16%',
        heapMemory: '48 MB',
        backpressure: 0.0,
        watermarkLag: '42ms',
        checkpointAckMs: 53,
      },
      {
        id: 5,
        host: 'taskmanager-pod-5.k8s',
        status: 'RUNNING',
        inRate: '4,772 rec/s',
        outRate: '5,310 rec/s',
        cpu: '15%',
        heapMemory: '47 MB',
        backpressure: 0.0,
        watermarkLag: '43ms',
        checkpointAckMs: 54,
      },
      {
        id: 6,
        host: 'taskmanager-pod-6.k8s',
        status: 'RUNNING',
        inRate: '4,782 rec/s',
        outRate: '5,318 rec/s',
        cpu: '17%',
        heapMemory: '49 MB',
        backpressure: 0.0,
        watermarkLag: '41ms',
        checkpointAckMs: 50,
      },
      {
        id: 7,
        host: 'taskmanager-pod-7.k8s',
        status: 'RUNNING',
        inRate: '4,768 rec/s',
        outRate: '5,308 rec/s',
        cpu: '16%',
        heapMemory: '47 MB',
        backpressure: 0.0,
        watermarkLag: '43ms',
        checkpointAckMs: 55,
      },
    ],
  },
]

export function StreamProcessingFlinkTopology({ className }: StreamProcessingFlinkTopologyProps) {
  const [selectedOperatorId, setSelectedOperatorId] = React.useState<string>('op-ml-scoring')
  const [activeInspectorTab, setActiveInspectorTab] = React.useState<'subtasks' | 'state' | 'resources' | 'config'>(
    'subtasks',
  )
  const [isTriggeringSavepoint, setIsTriggeringSavepoint] = React.useState<boolean>(false)
  const [savepointNotice, setSavepointNotice] = React.useState<string | null>(null)
  const [isCanceling, setIsCanceling] = React.useState<boolean>(false)
  const [cancelConfirmed, setCancelConfirmed] = React.useState<boolean>(false)
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null)

  const selectedOperator = React.useMemo(() => {
    return operators.find((op) => op.id === selectedOperatorId) ?? operators[0]
  }, [selectedOperatorId])

  const handleTriggerSavepoint = () => {
    if (isTriggeringSavepoint) return
    setIsTriggeringSavepoint(true)
    setSavepointNotice(null)

    setTimeout(() => {
      setIsTriggeringSavepoint(false)
      setSavepointNotice('s3://flink-savepoints/prod/savepoint-fraud-90412-20260821-143245/')
      setTimeout(() => {
        setSavepointNotice((curr) => (curr?.includes('savepoint-fraud-90412') ? null : curr))
      }, 6500)
    }, 1800)
  }

  const handleCancelJob = () => {
    if (isCanceling) return
    setIsCanceling(true)
    setTimeout(() => {
      setIsCanceling(false)
      setCancelConfirmed(true)
      setTimeout(() => {
        setCancelConfirmed(false)
      }, 4500)
    }, 2000)
  }

  const copyText = (key: string, value: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(value)
      setCopiedKey(key)
      setTimeout(() => {
        setCopiedKey((curr) => (curr === key ? null : curr))
      }, 2000)
    }
  }

  return (
    <div data-slot="stream-processing-flink-topology" className={cn('w-full space-y-6', className)}>
      {/* 1. Header Section */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <div
              className="bg-muted text-muted-foreground border-border flex size-9 shrink-0 items-center justify-center rounded-lg border shadow-xs"
              aria-hidden="true"
            >
              <Workflow className="text-primary size-4.5" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-foreground font-mono text-xl font-bold tracking-tight break-all sm:text-2xl">
                realtime-fraud-scoring-pipeline
              </h1>
              <Badge variant="outline" className="font-mono text-xs">
                Flink 1.19 on Kubernetes
              </Badge>
            </div>
            <Badge variant="success" className="gap-1.5 text-xs font-medium">
              <span className="relative flex size-2 shrink-0">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span>Job Running · Checkpointing Healthy</span>
            </Badge>
          </div>
          <p className="text-muted-foreground font-mono text-xs">
            Checkpoint Interval: Every 10s · RocksDB StateBackend · SLA Target: &lt; 50ms Lag · Job ID: flink_job_992014
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs font-medium"
            disabled={isTriggeringSavepoint}
            onClick={handleTriggerSavepoint}
          >
            {isTriggeringSavepoint ? (
              <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <Camera className="size-3.5 text-sky-500" aria-hidden="true" />
            )}
            <span>{isTriggeringSavepoint ? 'Creating Savepoint...' : 'Trigger Savepoint'}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:border-destructive/40 hover:bg-destructive/10 gap-1.5 text-xs font-medium"
            disabled={isCanceling}
            onClick={handleCancelJob}
          >
            {isCanceling ? (
              <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <Square className="size-3.5 fill-current" aria-hidden="true" />
            )}
            <span>{isCanceling ? 'Canceling with Savepoint...' : 'Cancel Job with Savepoint'}</span>
          </Button>
        </div>
      </div>

      {/* Active Savepoint Notice Banner */}
      {savepointNotice && (
        <div
          className="text-foreground flex items-center justify-between rounded-lg border border-sky-500/30 bg-sky-500/10 p-3 text-xs shadow-xs"
          role="status"
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="size-4 shrink-0 text-sky-500" aria-hidden="true" />
            <div>
              <span className="font-semibold text-sky-600 dark:text-sky-400">Savepoint completed successfully:</span>
              <span className="ml-1 font-mono text-xs">{savepointNotice}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="xs"
            className="h-6 gap-1 px-2 text-xs"
            onClick={() => copyText('savepoint', savepointNotice)}
          >
            {copiedKey === 'savepoint' ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
            <span>{copiedKey === 'savepoint' ? 'Copied' : 'Copy URI'}</span>
          </Button>
        </div>
      )}

      {/* Active Cancellation Notice Banner */}
      {cancelConfirmed && (
        <div
          className="text-foreground flex items-center justify-between rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs shadow-xs"
          role="status"
        >
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="size-4 shrink-0 text-amber-500" aria-hidden="true" />
            <div>
              <span className="font-semibold text-amber-600 dark:text-amber-400">Graceful Job Drain Initiated:</span>
              <span className="ml-1">
                Stopping topology sources and committing final RocksDB savepoint to S3 storage.
              </span>
            </div>
          </div>
          <Badge variant="outline" className="font-mono text-xs">
            Drain Status: 100%
          </Badge>
        </div>
      )}

      {/* 2. 4 Stream Telemetry KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Current Ingestion Throughput */}
        <Card className="flex flex-col justify-between shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <div
                  className="bg-muted text-muted-foreground border-border flex size-8 shrink-0 items-center justify-center rounded-lg border shadow-xs"
                  aria-hidden="true"
                >
                  <Activity className="text-primary size-4" />
                </div>
                <CardTitle className="truncate text-xs font-medium">Current Ingestion Throughput</CardTitle>
              </div>
              <Badge variant="outline" className="shrink-0 text-xs font-normal tabular-nums">
                +4.2% 10m
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">
                42,500 records/sec
              </div>
              <p className="text-muted-foreground font-mono text-xs tabular-nums">8.4 MB/s ingress bandwidth</p>
            </div>
            <div className="space-y-1.5">
              <div className="text-muted-foreground flex items-center justify-between text-xs">
                <span>Ingress Capacity</span>
                <span className="text-foreground font-mono font-medium tabular-nums">68% allocated</span>
              </div>
              <Progress value={68} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Checkpoint Duration */}
        <Card className="flex flex-col justify-between shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <div
                  className="bg-muted text-muted-foreground border-border flex size-8 shrink-0 items-center justify-center rounded-lg border shadow-xs"
                  aria-hidden="true"
                >
                  <Clock className="size-4 text-emerald-500" />
                </div>
                <CardTitle className="truncate text-xs font-medium">Checkpoint Duration</CardTitle>
              </div>
              <Badge variant="success" className="shrink-0 font-mono text-xs">
                100% Succeeded
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">
                185ms duration
              </div>
              <p className="text-muted-foreground font-mono text-xs tabular-nums">
                42 MB state size · Checkpoint #1,420
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="text-muted-foreground flex items-center justify-between text-xs">
                <span>SLA Budget (1,000ms)</span>
                <span className="text-foreground font-mono font-medium tabular-nums">18.5% of interval</span>
              </div>
              <Progress value={18.5} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Watermark Alignment Latency */}
        <Card className="flex flex-col justify-between shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <div
                  className="bg-muted text-muted-foreground border-border flex size-8 shrink-0 items-center justify-center rounded-lg border shadow-xs"
                  aria-hidden="true"
                >
                  <Zap className="size-4 text-amber-500" />
                </div>
                <CardTitle className="truncate text-xs font-medium">Watermark Alignment</CardTitle>
              </div>
              <Badge
                variant="outline"
                className="shrink-0 border-emerald-500/30 font-mono text-xs text-emerald-600 dark:text-emerald-400"
              >
                Event Time
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">Lag: 42ms</div>
              <p className="text-muted-foreground font-mono text-xs tabular-nums">
                Event Time Alignment · 0 Late Drops
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="text-muted-foreground flex items-center justify-between text-xs">
                <span>Skew Drift</span>
                <span className="text-foreground font-mono font-medium tabular-nums">Max 12ms cross-partition</span>
              </div>
              <Progress value={8.4} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Max Backpressure Heat Ratio */}
        <Card className="flex flex-col justify-between shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <div
                  className="bg-muted text-muted-foreground border-border flex size-8 shrink-0 items-center justify-center rounded-lg border shadow-xs"
                  aria-hidden="true"
                >
                  <Flame className="size-4 text-emerald-500" />
                </div>
                <CardTitle className="truncate text-xs font-medium">Max Backpressure Heat</CardTitle>
              </div>
              <Badge variant="success" className="shrink-0 font-mono text-xs">
                Low Risk
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">
                0.0% Backpressure
              </div>
              <p className="text-muted-foreground font-mono text-xs tabular-nums">
                All 4 operators running at nominal load
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="text-muted-foreground flex items-center justify-between text-xs">
                <span>Choked Subtasks</span>
                <span className="font-mono font-medium text-emerald-600 tabular-nums dark:text-emerald-400">
                  0 / 48 active
                </span>
              </div>
              <Progress value={0} className="h-1.5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Interactive 4-Operator Streaming Topology DAG */}
      <Card className="shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-semibold">Streaming Execution Topology DAG</CardTitle>
                <Badge variant="outline" className="font-mono text-xs">
                  4 Stateful Operators
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Live dataflow graph with event-time watermarking, state sizes, and backpressure telemetry. Click any
                operator to inspect metrics and subtasks.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="border-border bg-muted/40 text-muted-foreground flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-xs">
                <span className="size-2 rounded-full bg-emerald-500" />
                <span>Backpressure Heat: 0.0% (Green)</span>
              </div>
              <div className="border-border bg-muted/40 text-muted-foreground flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-xs">
                <Database className="size-3" />
                <span>Total Managed State: 57.0 MB</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-1 sm:p-6">
          <div className="border-border bg-muted/15 rounded-xl border p-4 sm:p-5">
            {/* 4 Connected Nodes Grid */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
              {/* Node 1: Kafka Ingestion Source */}
              <div
                role="button"
                tabIndex={0}
                className={cn(
                  'group focus-visible:ring-ring relative flex cursor-pointer flex-col justify-between rounded-xl border p-4 transition-all duration-200 focus-visible:ring-2 focus-visible:outline-none',
                  selectedOperatorId === 'op-kafka-source'
                    ? 'border-primary bg-primary/[0.04] ring-primary/30 shadow-xs ring-2'
                    : 'border-border bg-card hover:border-primary/50 hover:bg-muted/30',
                )}
                onClick={() => setSelectedOperatorId('op-kafka-source')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setSelectedOperatorId('op-kafka-source')
                  }
                }}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex size-7 items-center justify-center rounded-md border border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400">
                        <Radio className="size-3.5" />
                      </div>
                      <Badge
                        variant="outline"
                        className="border-sky-500/30 font-mono text-xs text-sky-600 dark:text-sky-400"
                      >
                        SOURCE
                      </Badge>
                    </div>
                    <Badge variant="outline" className="font-mono text-xs">
                      p=8
                    </Badge>
                  </div>

                  <div>
                    <div className="text-foreground font-mono text-xs leading-snug font-bold">
                      Kafka Ingestion Source
                    </div>
                    <p className="text-muted-foreground mt-1 font-mono text-xs">42.5k rec/s · Backpressure: 0%</p>
                  </div>

                  <div className="border-border/60 space-y-1.5 border-t pt-2.5 font-mono text-xs">
                    <div className="text-muted-foreground flex items-center justify-between">
                      <span>Throughput:</span>
                      <span className="text-foreground font-semibold tabular-nums">8.4 MB/s</span>
                    </div>
                    <div className="text-muted-foreground flex items-center justify-between">
                      <span>State Size:</span>
                      <span className="text-foreground tabular-nums">0 MB (Stateless)</span>
                    </div>
                  </div>
                </div>

                <div className="border-border/60 mt-3 flex items-center justify-between border-t pt-2 text-xs">
                  <span className="text-muted-foreground font-mono">events.fraud.transactions</span>
                  <ArrowRight className="text-muted-foreground group-hover:text-primary size-3.5 shrink-0 transition-colors" />
                </div>
              </div>

              {/* Node 2: Keyed Sliding Window */}
              <div
                role="button"
                tabIndex={0}
                className={cn(
                  'group focus-visible:ring-ring relative flex cursor-pointer flex-col justify-between rounded-xl border p-4 transition-all duration-200 focus-visible:ring-2 focus-visible:outline-none',
                  selectedOperatorId === 'op-keyed-window'
                    ? 'border-primary bg-primary/[0.04] ring-primary/30 shadow-xs ring-2'
                    : 'border-border bg-card hover:border-primary/50 hover:bg-muted/30',
                )}
                onClick={() => setSelectedOperatorId('op-keyed-window')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setSelectedOperatorId('op-keyed-window')
                  }
                }}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex size-7 items-center justify-center rounded-md border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                        <Clock className="size-3.5" />
                      </div>
                      <Badge
                        variant="outline"
                        className="border-indigo-500/30 font-mono text-xs text-indigo-600 dark:text-indigo-400"
                      >
                        WINDOW
                      </Badge>
                    </div>
                    <Badge variant="outline" className="font-mono text-xs">
                      p=16
                    </Badge>
                  </div>

                  <div>
                    <div className="text-foreground font-mono text-xs leading-snug font-bold">Keyed Sliding Window</div>
                    <p className="text-muted-foreground mt-1 font-mono text-xs">
                      5-min window, 10s slide · 12,400 keys
                    </p>
                  </div>

                  <div className="border-border/60 space-y-1.5 border-t pt-2.5 font-mono text-xs">
                    <div className="text-muted-foreground flex items-center justify-between">
                      <span>Output Rate:</span>
                      <span className="text-foreground font-semibold tabular-nums">38.2k rec/s</span>
                    </div>
                    <div className="text-muted-foreground flex items-center justify-between">
                      <span>RocksDB State:</span>
                      <span className="text-foreground font-semibold text-indigo-600 tabular-nums dark:text-indigo-400">
                        18.4 MB
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-border/60 mt-3 flex items-center justify-between border-t pt-2 text-xs">
                  <span className="text-muted-foreground font-mono">Cardholder Velocity Agg</span>
                  <ArrowRight className="text-muted-foreground group-hover:text-primary size-3.5 shrink-0 transition-colors" />
                </div>
              </div>

              {/* Node 3: ML Fraud Scoring Pattern Matcher */}
              <div
                role="button"
                tabIndex={0}
                className={cn(
                  'group focus-visible:ring-ring relative flex cursor-pointer flex-col justify-between rounded-xl border p-4 transition-all duration-200 focus-visible:ring-2 focus-visible:outline-none',
                  selectedOperatorId === 'op-ml-scoring'
                    ? 'border-primary bg-primary/[0.04] ring-primary/30 shadow-xs ring-2'
                    : 'border-border bg-card hover:border-primary/50 hover:bg-muted/30',
                )}
                onClick={() => setSelectedOperatorId('op-ml-scoring')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setSelectedOperatorId('op-ml-scoring')
                  }
                }}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex size-7 items-center justify-center rounded-md border border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400">
                        <Cpu className="size-3.5" />
                      </div>
                      <Badge
                        variant="outline"
                        className="border-purple-500/30 font-mono text-xs text-purple-600 dark:text-purple-400"
                      >
                        CEP & ML
                      </Badge>
                    </div>
                    <Badge variant="outline" className="font-mono text-xs">
                      p=16
                    </Badge>
                  </div>

                  <div>
                    <div className="text-foreground font-mono text-xs leading-snug font-bold">
                      ML Fraud Scoring Matcher
                    </div>
                    <p className="text-muted-foreground mt-1 font-mono text-xs">Inference: 1.2ms · RocksDB: 38.2 MB</p>
                  </div>

                  <div className="border-border/60 space-y-1.5 border-t pt-2.5 font-mono text-xs">
                    <div className="text-muted-foreground flex items-center justify-between">
                      <span>ONNX Inference:</span>
                      <span className="font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                        p99 &lt; 1.2ms
                      </span>
                    </div>
                    <div className="text-muted-foreground flex items-center justify-between">
                      <span>Managed State:</span>
                      <span className="text-foreground font-semibold text-purple-600 tabular-nums dark:text-purple-400">
                        38.2 MB
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-border/60 mt-3 flex items-center justify-between border-t pt-2 text-xs">
                  <span className="text-muted-foreground font-mono">xgboost_v4.onnx</span>
                  <ArrowRight className="text-muted-foreground group-hover:text-primary size-3.5 shrink-0 transition-colors" />
                </div>
              </div>

              {/* Node 4: Sink: Alert Dispatcher & Redis Cache */}
              <div
                role="button"
                tabIndex={0}
                className={cn(
                  'group focus-visible:ring-ring relative flex cursor-pointer flex-col justify-between rounded-xl border p-4 transition-all duration-200 focus-visible:ring-2 focus-visible:outline-none',
                  selectedOperatorId === 'op-sink-dispatcher'
                    ? 'border-primary bg-primary/[0.04] ring-primary/30 shadow-xs ring-2'
                    : 'border-border bg-card hover:border-primary/50 hover:bg-muted/30',
                )}
                onClick={() => setSelectedOperatorId('op-sink-dispatcher')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setSelectedOperatorId('op-sink-dispatcher')
                  }
                }}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex size-7 items-center justify-center rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <Database className="size-3.5" />
                      </div>
                      <Badge
                        variant="outline"
                        className="border-emerald-500/30 font-mono text-xs text-emerald-600 dark:text-emerald-400"
                      >
                        SINK
                      </Badge>
                    </div>
                    <Badge variant="outline" className="font-mono text-xs">
                      p=8
                    </Badge>
                  </div>

                  <div>
                    <div className="text-foreground font-mono text-xs leading-snug font-bold">
                      Sink: Alert Dispatcher
                    </div>
                    <p className="text-muted-foreground mt-1 font-mono text-xs">Redis Cache & Webhooks · 42.5k rec/s</p>
                  </div>

                  <div className="border-border/60 space-y-1.5 border-t pt-2.5 font-mono text-xs">
                    <div className="text-muted-foreground flex items-center justify-between">
                      <span>Semantics:</span>
                      <span className="text-foreground font-semibold">2PC Exactly-Once</span>
                    </div>
                    <div className="text-muted-foreground flex items-center justify-between">
                      <span>Fan-Out:</span>
                      <span className="text-foreground font-semibold tabular-nums">42.5k rec/s</span>
                    </div>
                  </div>
                </div>

                <div className="border-border/60 mt-3 flex items-center justify-between border-t pt-2 text-xs">
                  <span className="text-muted-foreground font-mono">redis:6379 + alerts.queue</span>
                  <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Operator Detailed Performance & State Inspector Panel */}
      <Card className="shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="font-mono text-base font-bold">{selectedOperator.name}</CardTitle>
                <Badge variant="success" className="gap-1 font-mono text-xs">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  {selectedOperator.status}
                </Badge>
                <Badge variant="outline" className="font-mono text-xs">
                  Parallelism: {selectedOperator.parallelism} subtasks
                </Badge>
              </div>
              <CardDescription className="text-xs">{{ ...selectedOperator }.description}</CardDescription>
            </div>

            {/* Inspector Tab Navigation Buttons */}
            <div className="bg-muted/60 flex flex-wrap items-center gap-1 rounded-lg border p-1">
              <button
                type="button"
                className={cn(
                  'focus-visible:ring-ring rounded-md px-2.5 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                  activeInspectorTab === 'subtasks'
                    ? 'bg-card text-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                onClick={() => setActiveInspectorTab('subtasks')}
              >
                Subtasks & Distribution
              </button>
              <button
                type="button"
                className={cn(
                  'focus-visible:ring-ring rounded-md px-2.5 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                  activeInspectorTab === 'state'
                    ? 'bg-card text-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                onClick={() => setActiveInspectorTab('state')}
              >
                RocksDB Managed State
              </button>
              <button
                type="button"
                className={cn(
                  'focus-visible:ring-ring rounded-md px-2.5 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                  activeInspectorTab === 'resources'
                    ? 'bg-card text-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                onClick={() => setActiveInspectorTab('resources')}
              >
                JVM & GC Telemetry
              </button>
              <button
                type="button"
                className={cn(
                  'focus-visible:ring-ring rounded-md px-2.5 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                  activeInspectorTab === 'config'
                    ? 'bg-card text-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                onClick={() => setActiveInspectorTab('config')}
              >
                Configuration Parameters
              </button>
            </div>
          </div>
        </CardHeader>

        {/* Key Operator Telemetry Bar */}
        <div className="bg-muted/20 divide-border/60 grid grid-cols-2 divide-x border-y sm:grid-cols-4 lg:grid-cols-6">
          <div className="p-3">
            <div className="text-muted-foreground text-xs font-medium">Input Rate</div>
            <div className="text-foreground mt-0.5 font-mono text-sm font-bold tabular-nums">
              {selectedOperator.inputRecordsRate}
            </div>
            <div className="text-muted-foreground font-mono text-xs tabular-nums">
              {selectedOperator.inputBytesRate}
            </div>
          </div>
          <div className="p-3">
            <div className="text-muted-foreground text-xs font-medium">Output Rate</div>
            <div className="text-foreground mt-0.5 font-mono text-sm font-bold tabular-nums">
              {selectedOperator.outputRecordsRate}
            </div>
            <div className="text-muted-foreground font-mono text-xs tabular-nums">
              {selectedOperator.outputBytesRate}
            </div>
          </div>
          <div className="p-3">
            <div className="text-muted-foreground text-xs font-medium">Managed State</div>
            <div className="text-primary mt-0.5 font-mono text-sm font-bold tabular-nums">
              {selectedOperator.managedStateSize}
            </div>
            <div className="text-muted-foreground truncate font-mono text-xs">{selectedOperator.stateBackend}</div>
          </div>
          <div className="p-3">
            <div className="text-muted-foreground text-xs font-medium">Watermark Lag</div>
            <div className="mt-0.5 font-mono text-sm font-bold text-emerald-600 tabular-nums dark:text-emerald-400">
              {selectedOperator.watermarkLag}
            </div>
            <div className="text-muted-foreground font-mono text-xs">Event Time OK</div>
          </div>
          <div className="p-3">
            <div className="text-muted-foreground text-xs font-medium">CPU Core Load</div>
            <div className="text-foreground mt-0.5 font-mono text-sm font-bold tabular-nums">
              {selectedOperator.cpuPeak}
            </div>
            <div className="text-muted-foreground font-mono text-xs">Across {selectedOperator.parallelism} cores</div>
          </div>
          <div className="p-3">
            <div className="text-muted-foreground text-xs font-medium">GC Pause Time</div>
            <div className="text-foreground mt-0.5 font-mono text-sm font-bold tabular-nums">
              {selectedOperator.gcTime}
            </div>
            <div className="text-muted-foreground font-mono text-xs">G1 Garbage Collector</div>
          </div>
        </div>

        <CardContent className="p-0">
          {/* TAB 1: Subtasks Table */}
          {activeInspectorTab === 'subtasks' && (
            <div className="overflow-x-auto">
              <Table density="cozy">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs font-semibold">Subtask Index</TableHead>
                    <TableHead className="text-xs font-semibold">Host / Pod</TableHead>
                    <TableHead className="text-right text-xs font-semibold">Input Rate</TableHead>
                    <TableHead className="text-right text-xs font-semibold">Output Rate</TableHead>
                    <TableHead className="text-right text-xs font-semibold">CPU %</TableHead>
                    <TableHead className="text-right text-xs font-semibold">Heap Usage</TableHead>
                    <TableHead className="text-right text-xs font-semibold">Watermark Lag</TableHead>
                    <TableHead className="text-right text-xs font-semibold">Checkpoint Ack</TableHead>
                    <TableHead className="text-center text-xs font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedOperator.subtasks.map((subtask) => (
                    <TableRow key={subtask.id} className="group">
                      <TableCell className="py-2.5">
                        <div className="flex items-center gap-2">
                          <span className="size-2 rounded-full bg-emerald-500" aria-hidden="true" />
                          <span className="font-mono text-xs font-semibold">Subtask #{subtask.id}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground py-2.5 font-mono text-xs">{subtask.host}</TableCell>
                      <TableCell className="text-foreground py-2.5 text-right font-mono text-xs font-medium tabular-nums">
                        {subtask.inRate}
                      </TableCell>
                      <TableCell className="text-foreground py-2.5 text-right font-mono text-xs font-medium tabular-nums">
                        {subtask.outRate}
                      </TableCell>
                      <TableCell className="py-2.5 text-right font-mono text-xs tabular-nums">
                        <Badge variant="outline" className="font-mono text-xs">
                          {subtask.cpu}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground py-2.5 text-right font-mono text-xs tabular-nums">
                        {subtask.heapMemory}
                      </TableCell>
                      <TableCell className="py-2.5 text-right font-mono text-xs font-medium text-emerald-600 tabular-nums dark:text-emerald-400">
                        {subtask.watermarkLag}
                      </TableCell>
                      <TableCell className="text-muted-foreground py-2.5 text-right font-mono text-xs tabular-nums">
                        {subtask.checkpointAckMs}ms
                      </TableCell>
                      <TableCell className="py-2.5 text-center">
                        <Badge variant="success" className="font-mono text-xs">
                          {subtask.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* TAB 2: RocksDB Managed State */}
          {activeInspectorTab === 'state' && (
            <div className="space-y-5 p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="bg-muted/10 space-y-2 rounded-lg border p-4">
                  <div className="text-muted-foreground text-xs font-medium">State Backend Engine</div>
                  <div className="text-foreground font-mono text-base font-bold">{selectedOperator.stateBackend}</div>
                  <p className="text-muted-foreground text-xs">
                    Off-heap SSD persistence with block caching and incremental checkpoints
                  </p>
                </div>
                <div className="bg-muted/10 space-y-2 rounded-lg border p-4">
                  <div className="text-muted-foreground text-xs font-medium">Total Live State Size</div>
                  <div className="text-primary font-mono text-base font-bold">{selectedOperator.managedStateSize}</div>
                  <p className="text-muted-foreground text-xs">Incremental checkpoint delta: ~2.4 MB / snapshot</p>
                </div>
                <div className="bg-muted/10 space-y-2 rounded-lg border p-4">
                  <div className="text-muted-foreground text-xs font-medium">Key Eviction & TTL</div>
                  <div className="text-foreground font-mono text-base font-bold">10-min Sliding TTL</div>
                  <p className="text-muted-foreground text-xs">
                    Automatic compaction filter evicts expired cardholder keys on disk
                  </p>
                </div>
              </div>

              {/* RocksDB Performance Metrics Grid */}
              <div className="bg-card space-y-3 rounded-lg border p-4">
                <h4 className="text-foreground text-xs font-semibold">RocksDB Native Engine Statistics</h4>
                <div className="grid grid-cols-2 gap-4 font-mono text-xs sm:grid-cols-4">
                  <div>
                    <span className="text-muted-foreground">Block Cache Hit Ratio:</span>
                    <div className="text-foreground mt-0.5 font-bold tabular-nums">99.42% (512 MB cache)</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">MemTable Flush Rate:</span>
                    <div className="text-foreground mt-0.5 font-bold tabular-nums">14.2 MB/min</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">SST Files Count:</span>
                    <div className="text-foreground mt-0.5 font-bold tabular-nums">128 active SSTs</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Level-0 Compaction Stall:</span>
                    <div className="mt-0.5 font-bold text-emerald-600 tabular-nums dark:text-emerald-400">
                      0.0ms (No stalls)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: JVM & Resource Metrics */}
          {activeInspectorTab === 'resources' && (
            <div className="space-y-5 p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="bg-muted/10 space-y-3 rounded-lg border p-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-foreground font-medium">JVM Heap Memory Utilization</span>
                    <span className="text-muted-foreground font-mono">{selectedOperator.heapMemory} / 4,096 MB</span>
                  </div>
                  <Progress value={34} className="h-2" />
                  <div className="text-muted-foreground flex justify-between font-mono text-xs">
                    <span>Survivor: 64 MB</span>
                    <span>Tenured / Old: 348 MB</span>
                  </div>
                </div>

                <div className="bg-muted/10 space-y-3 rounded-lg border p-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-foreground font-medium">Managed Off-Heap & Native Memory</span>
                    <span className="text-muted-foreground font-mono">{selectedOperator.managedMemory} Allocated</span>
                  </div>
                  <Progress value={50} className="h-2" />
                  <div className="text-muted-foreground flex justify-between font-mono text-xs">
                    <span>RocksDB Cache: 512 MB</span>
                    <span>Network Buffers: 256 MB</span>
                  </div>
                </div>
              </div>

              <div className="bg-card space-y-2 rounded-lg border p-4">
                <div className="text-foreground text-xs font-semibold">Garbage Collection Profile</div>
                <p className="text-muted-foreground font-mono text-xs">
                  Collector: Garbage-First (G1) GC · Max Pause Target: 20ms · Current Observed Pause:{' '}
                  {selectedOperator.gcTime}
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: Configuration Parameters */}
          {activeInspectorTab === 'config' && (
            <div className="space-y-4 p-5">
              <div className="overflow-hidden rounded-lg border">
                <div className="bg-muted/50 text-foreground flex items-center justify-between border-b p-3 text-xs font-semibold">
                  <span>Runtime Operator Configuration</span>
                  <Badge variant="outline" className="font-mono text-xs">
                    {selectedOperator.operatorClass}
                  </Badge>
                </div>
                <div className="divide-y font-mono text-xs">
                  {Object.entries(selectedOperator.config).map(([key, val]) => (
                    <div
                      key={key}
                      className="hover:bg-muted/20 flex flex-col justify-between gap-2 p-3 transition-colors sm:flex-row sm:items-center"
                    >
                      <span className="text-muted-foreground font-medium">{key}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-foreground font-semibold">{val}</span>
                        <Button
                          aria-label={`Copy ${key}`}
                          variant="ghost"
                          size="xs"
                          className="text-muted-foreground hover:text-foreground h-6 w-6 p-0"
                          onClick={() => copyText(String(key), String(val))}
                        >
                          {copiedKey === String(key) ? (
                            <Check className="size-3 text-emerald-500" />
                          ) : (
                            <Copy className="size-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>

        {/* Bottom Engine Metadata Strip */}
        <div className="bg-muted/40 flex flex-col gap-2.5 border-t px-4 py-3 font-mono text-xs sm:flex-row sm:items-center sm:justify-between">
          <div className="text-muted-foreground flex flex-wrap items-center gap-4">
            <div className="text-foreground flex items-center gap-1.5 font-medium">
              <Activity className="size-3.5 text-emerald-500" aria-hidden="true" />
              <span>Pipeline Ingestion:</span>
              <span>42,500 records/sec (8.4 MB/s)</span>
            </div>

            <Separator orientation="vertical" className="hidden h-3.5 sm:block" />

            <div className="flex items-center gap-1.5">
              <Server className="size-3.5 text-sky-500" aria-hidden="true" />
              <span>TaskManagers:</span>
              <span className="text-foreground">8 Kubernetes Pods</span>
            </div>

            <Separator orientation="vertical" className="hidden h-3.5 sm:block" />

            <div className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-emerald-500" aria-hidden="true" />
              <span>State Consistency:</span>
              <span className="text-foreground">Exactly-Once (2PC)</span>
            </div>
          </div>

          <div className="text-muted-foreground flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            <span>Watermark Alignment: 42ms · Checkpoint #1,420 OK</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
