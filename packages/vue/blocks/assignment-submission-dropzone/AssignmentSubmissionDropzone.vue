<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  FileArchive,
  GraduationCap,
  Info,
  RotateCcw,
  Save,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Timer,
  Trash2,
  UploadCloud,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

export interface AttachedFile {
  name: string
  size: string
  uploadedAt: string
  similarity: number
  status: string
}

export interface RubricCriterion {
  label: string
  points: number
}

export interface RubricCategory {
  id: string
  title: string
  points: number
  percentage: number
  criteria: RubricCriterion[]
}

interface Props {
  initialFile?: AttachedFile | null
  initialNotes?: string
  initialSubmitted?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  initialFile: () => ({
    name: 'distributed_system_v1.zip',
    size: '18.4 MB',
    uploadedAt: 'Aug 24, 14:22 PST',
    similarity: 0.8,
    status: 'Ready to submit',
  }),
  initialNotes:
    'Included benchmark logs in the /docs folder. All 12 distributed Raft consensus nodes passed the Chaos Mesh partition tests under 500ms latency simulation.',
  initialSubmitted: false,
})

const file = ref<AttachedFile | null>(props.initialFile)
const notes = ref(props.initialNotes)
const isSubmitted = ref(props.initialSubmitted)
const isDraftSaved = ref(false)
const isDragging = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

const rubricCategories: RubricCategory[] = [
  {
    id: 'architecture',
    title: 'Architecture & Fault Tolerance',
    points: 40,
    percentage: 40,
    criteria: [
      { label: 'Consensus algorithm implementation (Raft / Paxos) & partition resilience', points: 20 },
      { label: 'Service discovery, dynamic load balancing, & circuit breaking', points: 15 },
      { label: 'Data replication & linearizable consistency guarantees', points: 5 },
    ],
  },
  {
    id: 'code-quality',
    title: 'Code Quality & Test Coverage',
    points: 30,
    percentage: 30,
    criteria: [
      { label: 'Automated unit, fuzz, & integration test suite (>85% coverage)', points: 15 },
      { label: 'Idiomatic concurrency patterns, memory safety, clean modularity', points: 10 },
      { label: 'Reproducible CI/CD pipeline automation & static analysis pass', points: 5 },
    ],
  },
  {
    id: 'performance',
    title: 'Performance Benchmarks',
    points: 20,
    percentage: 20,
    criteria: [
      { label: 'Sustained throughput under load (>15,000 req/sec benchmark)', points: 10 },
      { label: 'P99 latency SLA (<25ms under 50% simulated node failure)', points: 10 },
    ],
  },
  {
    id: 'documentation',
    title: 'Documentation & API Specs',
    points: 10,
    percentage: 10,
    criteria: [
      { label: 'OpenAPI 3.1 & gRPC Protobuf schema specifications', points: 5 },
      { label: 'System architecture design doc & production deployment runbook', points: 5 },
    ],
  },
]

const isCleanSimilarity = computed(() => {
  if (!file.value) return true
  return file.value.similarity < 10
})

function triggerBrowse() {
  fileInputRef.value?.click()
}

function handleFileInput(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const f = target.files[0]
    file.value = {
      name: f.name,
      size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadedAt: 'Just now',
      similarity: 0.8,
      status: 'Ready to submit',
    }
  }
}

function handleDrop(e: DragEvent) {
  isDragging.value = false
  if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
    const f = e.dataTransfer.files[0]
    file.value = {
      name: f.name,
      size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadedAt: 'Just now',
      similarity: 0.8,
      status: 'Ready to submit',
    }
  }
}

function removeFile() {
  file.value = null
}

function restoreSampleFile() {
  file.value = {
    name: 'distributed_system_v1.zip',
    size: '18.4 MB',
    uploadedAt: 'Aug 24, 14:22 PST',
    similarity: 0.8,
    status: 'Ready to submit',
  }
}

function handleSaveDraft() {
  isDraftSaved.value = true
  setTimeout(() => {
    isDraftSaved.value = false
  }, 3000)
}

function handleSubmit() {
  if (!file.value) return
  isSubmitted.value = true
}

function handleResetSubmission() {
  isSubmitted.value = false
}
</script>

<template>
  <div data-slot="assignment-submission-dropzone" :class="cn('space-y-6', props.class)">
    <!-- Assignment Header Card -->
    <Card class="shadow-xs">
      <CardContent class="p-6">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div class="space-y-2">
            <div class="flex flex-wrap items-center gap-2">
              <Badge wrap variant="outline" class="gap-1.5 font-medium">
                <GraduationCap class="text-primary size-3.5" aria-hidden="true" />
                CS 401 · Advanced Distributed Systems
              </Badge>
              <Badge wrap variant="secondary" class="gap-1 text-xs">
                <Award class="text-muted-foreground size-3" aria-hidden="true" />
                100 Points Possible
              </Badge>
            </div>

            <h1 class="text-foreground text-xl font-semibold tracking-tight sm:text-2xl">
              Final Project: Distributed Microservices Architecture
            </h1>

            <p class="text-muted-foreground text-sm">
              Term: Fall 2026 · Instructor: Prof. Elena Rostova · Stanford School of Engineering
            </p>
          </div>

          <!-- Deadline Timer & Badges -->
          <div class="flex flex-col items-start gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end">
            <Badge wrap variant="warning" class="gap-1.5 px-3 py-1 text-xs font-medium">
              <Clock class="size-3.5" aria-hidden="true" />
              Due Friday, Aug 28 at 23:59 PST · 4 Days Left
            </Badge>

            <!-- Countdown blocks -->
            <div class="border-border bg-muted/40 flex items-center gap-2 rounded-lg border px-3 py-1.5 shadow-xs">
              <Timer class="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
              <div class="flex items-center gap-1.5 text-xs font-medium">
                <div class="flex items-baseline gap-0.5">
                  <span class="text-foreground font-semibold">04</span>
                  <span class="text-muted-foreground text-xs">d</span>
                </div>
                <span class="text-muted-foreground">:</span>
                <div class="flex items-baseline gap-0.5">
                  <span class="text-foreground font-semibold">07</span>
                  <span class="text-muted-foreground text-xs">h</span>
                </div>
                <span class="text-muted-foreground">:</span>
                <div class="flex items-baseline gap-0.5">
                  <span class="text-foreground font-semibold">32</span>
                  <span class="text-muted-foreground text-xs">m</span>
                </div>
                <span class="text-muted-foreground">:</span>
                <div class="flex items-baseline gap-0.5">
                  <span class="text-foreground font-semibold">15</span>
                  <span class="text-muted-foreground text-xs">s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Submitted Confirmation Banner -->
    <div
      v-if="isSubmitted"
      class="border-success/30 bg-success/10 text-foreground flex flex-col gap-4 rounded-xl border p-5 sm:flex-row sm:items-center sm:justify-between"
      role="status"
    >
      <div class="flex items-start gap-3">
        <div class="bg-success/20 text-success flex size-9 shrink-0 items-center justify-center rounded-full">
          <CheckCircle2 class="size-5" aria-hidden="true" />
        </div>
        <div class="space-y-1">
          <div class="flex flex-wrap items-center gap-2">
            <h2 class="text-base font-semibold">Coursework Submitted Successfully</h2>
            <Badge wrap variant="success" class="text-xs">Receipt #SUB-CS401-2026-98124</Badge>
          </div>
          <p class="text-muted-foreground text-xs sm:text-sm">
            Submission timestamp: August 24, 2026 at 14:25 PST · Hash:
            <code class="font-mono text-xs">sha256:4a8b...7f12</code>
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm" @click="handleResetSubmission">
          <RotateCcw class="size-3.5" aria-hidden="true" />
          Edit Submission
        </Button>
      </div>
    </div>

    <!-- 2-Column Submission Layout -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <!-- Left Column: Submission & Dropzone Form -->
      <div class="space-y-6 lg:col-span-7 xl:col-span-7">
        <Card class="shadow-xs">
          <CardHeader>
            <div class="flex items-center justify-between">
              <div class="space-y-1">
                <CardTitle class="text-lg font-semibold">Submission & File Upload</CardTitle>
                <CardDescription>
                  Upload your completed project archive, code repository bundle, and accompanying documentation.
                </CardDescription>
              </div>
              <Badge wrap variant="outline" class="text-xs">Attempt 1 of 3</Badge>
            </div>
          </CardHeader>

          <CardContent class="space-y-5">
            <!-- Submission Instructions & Constraints -->
            <div class="border-border bg-muted/40 flex items-start gap-3 rounded-lg border p-3.5 text-xs shadow-xs">
              <Info class="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <div class="space-y-0.5">
                <p class="text-foreground font-medium">Accepted formats: PDF, ZIP, TAR.GZ · Max file size: 50 MB</p>
                <p class="text-muted-foreground">
                  Ensure all Docker Compose manifests, benchmarking scripts, and unit tests are included in the archive
                  root.
                </p>
              </div>
            </div>

            <!-- File Dropzone -->
            <div>
              <input
                ref="fileInputRef"
                type="file"
                class="hidden"
                accept=".zip,.tar.gz,.tar,.pdf"
                @change="handleFileInput"
              />

              <div
                class="group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200"
                :class="[
                  isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-muted/10 hover:border-primary/50 hover:bg-muted/20',
                ]"
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="handleDrop"
              >
                <div
                  class="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-105"
                >
                  <UploadCloud class="size-6" aria-hidden="true" />
                </div>

                <div class="mt-3 space-y-1">
                  <p class="text-foreground text-sm font-medium">Drag and drop your project archive here</p>
                  <p class="text-muted-foreground text-xs">or select a file directly from your local filesystem</p>
                </div>

                <div class="mt-4 flex items-center gap-2">
                  <Button variant="outline" size="sm" type="button" @click="triggerBrowse"> Browse files </Button>
                </div>

                <div class="text-muted-foreground mt-4 flex items-center gap-1.5 text-xs">
                  <span class="border-border bg-muted rounded px-1.5 py-0.5 font-mono text-xs">.zip</span>
                  <span class="border-border bg-muted rounded px-1.5 py-0.5 font-mono text-xs">.tar.gz</span>
                  <span class="border-border bg-muted rounded px-1.5 py-0.5 font-mono text-xs">.pdf</span>
                </div>
              </div>
            </div>

            <!-- Attached Files List -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-foreground text-xs font-semibold tracking-wider uppercase">
                  Attached Files ({{ file ? '1' : '0' }} / 1)
                </span>
                <span v-if="!file" class="text-muted-foreground text-xs">No file attached</span>
              </div>

              <!-- File Item Card -->
              <div
                v-if="file"
                class="border-border bg-card flex flex-col gap-3 rounded-lg border p-3.5 shadow-xs transition-colors sm:flex-row sm:items-center sm:justify-between"
              >
                <div class="flex min-w-0 items-center gap-3">
                  <div class="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-md">
                    <FileArchive class="size-5" aria-hidden="true" />
                  </div>
                  <div class="min-w-0 space-y-0.5">
                    <p class="text-foreground truncate text-sm font-medium">
                      {{ file.name }}
                    </p>
                    <p class="text-muted-foreground text-xs">{{ file.size }} · {{ file.uploadedAt }}</p>
                  </div>
                </div>

                <div class="flex items-center gap-2 self-end sm:self-center">
                  <Badge wrap variant="secondary" class="text-xs">
                    {{ file.size }}
                  </Badge>
                  <Badge wrap variant="outline" class="border-success/30 text-success text-xs font-medium">
                    {{ file.status }}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    class="text-muted-foreground hover:text-destructive"
                    title="Remove file"
                    aria-label="Remove attached file"
                    @click="removeFile"
                  >
                    <Trash2 class="size-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>

              <!-- Re-add sample file helper when cleared -->
              <div
                v-else
                class="border-border bg-muted/20 flex items-center justify-between rounded-lg border border-dashed p-3 text-xs"
              >
                <span class="text-muted-foreground">Sample archive cleared.</span>
                <Button variant="ghost" size="xs" class="text-primary text-xs" @click="restoreSampleFile">
                  Restore default file
                </Button>
              </div>
            </div>

            <!-- Plagiarism & Similarity Pre-scan Indicator -->
            <div
              v-if="file"
              :class="[
                'space-y-3 rounded-lg border p-4 shadow-xs transition-colors',
                isCleanSimilarity
                  ? 'border-success/30 bg-success/5 dark:bg-success/10'
                  : 'border-warning/30 bg-warning/5 dark:bg-warning/10',
              ]"
            >
              <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div class="flex items-center gap-2">
                  <ShieldCheck v-if="isCleanSimilarity" class="text-success size-5 shrink-0" aria-hidden="true" />
                  <ShieldAlert v-else class="text-warning size-5 shrink-0" aria-hidden="true" />
                  <div>
                    <h3 class="text-foreground text-sm font-semibold">Academic Integrity & Plagiarism Pre-Scan</h3>
                    <p class="text-muted-foreground text-xs">
                      Scanned against 14.2M academic repositories & public open-source codebases
                    </p>
                  </div>
                </div>

                <Badge
                  :variant="isCleanSimilarity ? 'success' : 'warning'"
                  class="gap-1 self-start text-xs font-medium whitespace-normal sm:self-auto"
                >
                  <Sparkles class="size-3" aria-hidden="true" />
                  {{ file.similarity }}% Similarity · {{ isCleanSimilarity ? 'Clean' : 'Needs Review' }}
                </Badge>
              </div>

              <!-- Mini metric progress line -->
              <div class="space-y-1.5 pt-1">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-muted-foreground">Overall similarity index</span>
                  <span class="text-foreground font-mono font-medium"
                    >{{ file.similarity }}% (Max threshold: 15.0%)</span
                  >
                </div>
                <Progress :model-value="file.similarity * 6.66" class="h-1.5" />
              </div>

              <!-- Integrity breakdown chips -->
              <div class="grid grid-cols-1 gap-2 pt-1 text-xs sm:grid-cols-3">
                <div class="border-border/60 bg-card/60 rounded border p-2">
                  <span class="text-muted-foreground block text-xs">Internet Sources</span>
                  <span class="text-foreground font-medium">0.0% match</span>
                </div>
                <div class="border-border/60 bg-card/60 rounded border p-2">
                  <span class="text-muted-foreground block text-xs">Peer Submissions</span>
                  <span class="text-foreground font-medium">0.0% match</span>
                </div>
                <div class="border-border/60 bg-card/60 rounded border p-2">
                  <span class="text-muted-foreground block text-xs">Standard Boilerplate</span>
                  <span class="text-foreground font-medium">{{ file.similarity }}% (Apache 2.0)</span>
                </div>
              </div>
            </div>

            <!-- Student Submission Notes Textarea -->
            <div class="space-y-2">
              <label for="submission-notes" class="text-foreground text-sm font-medium">
                Student Submission Notes & Execution Instructions
              </label>
              <Textarea
                id="submission-notes"
                v-model="notes"
                :rows="3"
                placeholder="Included benchmark logs in the /docs folder..."
                class="text-sm"
              />
              <p class="text-muted-foreground text-xs">
                Provide notes on environment configurations, docker flags, or benchmark reproducibility steps.
              </p>
            </div>
          </CardContent>

          <CardFooter
            class="border-border flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div class="text-muted-foreground flex items-center gap-2 text-xs">
              <span class="bg-success size-2 rounded-full" />
              <span v-if="isDraftSaved" class="text-success font-medium">Draft saved successfully!</span>
              <span v-else>Draft auto-saved 2 mins ago · rev 3</span>
            </div>

            <div class="flex w-full flex-wrap items-center gap-2.5 sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                class="flex-1 sm:flex-initial"
                :disabled="isSubmitted"
                @click="handleSaveDraft"
              >
                <Save class="size-3.5" aria-hidden="true" />
                Save Draft
              </Button>
              <Button
                variant="default"
                size="sm"
                class="flex-1 sm:flex-initial"
                :disabled="!file || isSubmitted"
                @click="handleSubmit"
              >
                <Send class="size-3.5" aria-hidden="true" />
                Submit Assignment
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      <!-- Right Column: Grading Rubric & Assessment Criteria -->
      <div class="space-y-6 lg:col-span-5 xl:col-span-5">
        <Card class="shadow-xs">
          <CardHeader>
            <div class="flex items-center justify-between">
              <div class="space-y-1">
                <CardTitle class="flex items-center gap-2 text-lg font-semibold">
                  <BookOpen class="text-primary size-5" aria-hidden="true" />
                  Grading Rubric
                </CardTitle>
                <CardDescription> 100 Points Total · Evaluated against course criteria </CardDescription>
              </div>
              <Badge wrap variant="outline" class="font-mono text-xs"> Pass: 70 pts </Badge>
            </div>
          </CardHeader>

          <CardContent class="space-y-5">
            <!-- Rubric Categories -->
            <div v-for="(category, index) in rubricCategories" :key="category.id" class="space-y-3">
              <!-- Category Header -->
              <div class="space-y-1.5">
                <div class="flex items-center justify-between">
                  <h4 class="text-foreground text-sm font-medium">
                    {{ category.title }}
                  </h4>
                  <Badge wrap variant="secondary" class="font-mono text-xs">
                    {{ category.points }} pts ({{ category.percentage }}%)
                  </Badge>
                </div>
                <Progress :model-value="category.percentage" class="h-1.5" />
              </div>

              <!-- Specific Sub-criteria -->
              <ul class="border-border/60 bg-muted/20 space-y-2 rounded-lg border p-2.5 text-xs">
                <li
                  v-for="(criterion, cIndex) in category.criteria"
                  :key="cIndex"
                  class="flex items-start justify-between gap-2"
                >
                  <div class="flex min-w-0 items-start gap-1.5">
                    <span class="text-primary font-bold">·</span>
                    <span class="text-muted-foreground">{{ criterion.label }}</span>
                  </div>
                  <span class="text-foreground shrink-0 font-mono font-medium"> {{ criterion.points }} pts </span>
                </li>
              </ul>

              <Separator v-if="index < rubricCategories.length - 1" class="mt-4" />
            </div>
          </CardContent>

          <CardFooter
            class="border-border bg-muted/30 text-muted-foreground flex flex-col gap-2 rounded-b-xl border-t p-4 text-xs"
          >
            <div class="flex items-start gap-2">
              <Info class="text-muted-foreground mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <p>
                <strong class="text-foreground font-medium">Late Submission Policy:</strong> Deductions of 5% apply per
                24 hours delayed up to a maximum 48-hour grace period.
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  </div>
</template>
