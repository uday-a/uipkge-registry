<script setup lang="ts">
import { computed, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import { AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, FileSpreadsheet, Upload } from 'lucide-vue-next'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SectionCard } from '@/components/ui/section-card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Stepper } from '@/components/ui/stepper'

type TargetField = 'Full name' | 'Email' | 'Department' | 'Job title' | 'Start date' | 'Skip'

interface CsvRow {
  full_name: string
  email_address: string
  dept: string
  job_title: string
  start_date: string
  manager: string
}

const props = withDefaults(
  defineProps<{
    /** Jump straight to a step (1 Upload · 2 Map · 3 Preview · 4 Result). */
    initialStep?: number
    /** Show the upload step with the file already parsed. */
    initialFileSelected?: boolean
    /** Override the auto-mapping so demos can show unmapped required fields. */
    initialMapping?: Record<string, TargetField>
    class?: HTMLAttributes['class']
  }>(),
  {
    initialStep: 1,
    initialFileSelected: false,
    initialMapping: undefined,
  },
)

const steps = [
  { id: 1, title: 'Upload' },
  { id: 2, title: 'Map fields' },
  { id: 3, title: 'Preview' },
  { id: 4, title: 'Result' },
]

const columns = ['full_name', 'email_address', 'dept', 'job_title', 'start_date', 'manager'] as const

const defaultMapping: Record<string, TargetField> = {
  full_name: 'Full name',
  email_address: 'Email',
  dept: 'Department',
  job_title: 'Job title',
  start_date: 'Start date',
  manager: 'Skip',
}

const confidence: Record<string, 'high' | 'medium'> = {
  full_name: 'high',
  email_address: 'high',
  dept: 'medium',
  job_title: 'high',
  start_date: 'medium',
  manager: 'high',
}

const targetOptions: TargetField[] = ['Full name', 'Email', 'Department', 'Job title', 'Start date', 'Skip']
const requiredTargets: TargetField[] = ['Full name', 'Email']

const rows: CsvRow[] = [
  {
    full_name: 'Amara Osei',
    email_address: 'amara@acme.com',
    dept: 'Engineering',
    job_title: 'Backend engineer',
    start_date: '2026-09-01',
    manager: 'j.weber@acme.com',
  },
  {
    full_name: 'Marcus Lee',
    email_address: 'marcus.lee@acme.com',
    dept: 'Design',
    job_title: 'Product designer',
    start_date: '2026-09-01',
    manager: 'a.osei@acme.com',
  },
  {
    full_name: '',
    email_address: 'no-name@acme.com',
    dept: 'Sales',
    job_title: 'Account exec',
    start_date: '2026-09-08',
    manager: 'p.nair@acme.com',
  },
  {
    full_name: 'Priya Nair',
    email_address: 'not-an-email',
    dept: 'People',
    job_title: 'Recruiter',
    start_date: '2026-09-15',
    manager: 'a.osei@acme.com',
  },
  {
    full_name: 'Jonas Weber',
    email_address: 'jonas@acme.com',
    dept: 'Engineering',
    job_title: 'Eng manager',
    start_date: '2026-08-24',
    manager: '',
  },
]

const step = ref(props.initialStep)
const fileSelected = ref(props.initialFileSelected || props.initialStep > 1)
const mapping = ref<Record<string, TargetField>>(props.initialMapping ?? { ...defaultMapping })

const mappedTargets = computed<TargetField[]>(() => Object.values(mapping.value).filter((t) => t !== 'Skip'))
const missingRequired = computed(() => requiredTargets.filter((target) => !mappedTargets.value.includes(target)))

function cellInvalid(row: CsvRow, column: string): boolean {
  if (mapping.value[column] === 'Full name') return row.full_name.trim() === ''
  if (mapping.value[column] === 'Email') return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email_address)
  return false
}

const flaggedCount = computed(() => rows.filter((row) => columns.some((col) => cellInvalid(row, col))).length)
const importedCount = 245

function onStepperInput(value: number) {
  // Free backward navigation; forward goes through the footer button only.
  if (value < step.value && !(step.value === 4)) step.value = value
}

function goNext() {
  if (step.value === 1 && !fileSelected.value) fileSelected.value = true
  if (step.value === 2 && missingRequired.value.length > 0) return
  if (step.value < 4) step.value += 1
}

function reset() {
  step.value = 1
  fileSelected.value = false
  mapping.value = { ...defaultMapping }
}
</script>

<template>
  <SectionCard
    data-slot="import-wizard"
    title="Import employees"
    description="Bring your people data in as CSV — map, review, then commit."
    :class="props.class"
  >
    <Stepper :steps="steps" :model-value="step" class="mb-6" @update:model-value="onStepperInput" />

    <!-- Step 1 · Upload -->
    <div v-if="step === 1" class="space-y-4">
      <button
        v-if="!fileSelected"
        type="button"
        class="border-border hover:border-primary/50 hover:bg-accent/50 focus-visible:ring-ring flex w-full cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed px-6 py-10 transition-colors focus-visible:ring-2 focus-visible:outline-none"
        @click="fileSelected = true"
      >
        <Upload class="text-muted-foreground size-6" aria-hidden="true" />
        <span class="text-sm font-medium">Drop your CSV here or browse</span>
        <span class="text-muted-foreground text-xs">Up to 10 MB · comma or semicolon separated</span>
      </button>
      <div v-else class="border-border flex flex-wrap items-center gap-3 rounded-lg border p-4">
        <span
          class="bg-muted text-muted-foreground flex size-9 items-center justify-center rounded-md"
          aria-hidden="true"
        >
          <FileSpreadsheet class="size-4" />
        </span>
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-medium">employees.csv</p>
          <p class="text-muted-foreground text-xs">248 rows · 6 columns · 38 KB</p>
        </div>
        <Badge wrap class="" variant="success">Parsed</Badge>
      </div>
    </div>

    <!-- Step 2 · Map fields -->
    <div v-else-if="step === 2" class="space-y-4">
      <Alert v-if="missingRequired.length > 0" class="border-warning/40 bg-warning/5">
        <AlertTriangle class="text-warning size-4" aria-hidden="true" />
        <AlertTitle>Required fields unmapped</AlertTitle>
        <AlertDescription>Map {{ missingRequired.join(' and ') }} before continuing.</AlertDescription>
      </Alert>
      <ul class="divide-y rounded-lg border">
        <li v-for="column in columns" :key="column" class="flex flex-wrap items-center gap-3 p-3">
          <code class="w-32 shrink-0 truncate font-mono text-xs">{{ column }}</code>
          <ChevronRight class="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
          <Select v-model="mapping[column]">
            <SelectTrigger class="flex-1" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="option in targetOptions" :key="option" :value="option">{{ option }}</SelectItem>
            </SelectContent>
          </Select>
          <Badge
            wrap
            class=""
            v-if="mapping[column] !== 'Skip'"
            :variant="confidence[column] === 'high' ? 'success' : 'info'"
          >
            {{ confidence[column] === 'high' ? 'Auto · high' : 'Auto · medium' }}
          </Badge>
        </li>
      </ul>
    </div>

    <!-- Step 3 · Preview -->
    <div v-else-if="step === 3" class="space-y-3">
      <div class="overflow-x-auto rounded-lg border">
        <table class="w-full max-w-[640px] min-w-full text-sm">
          <thead>
            <tr class="bg-muted/50 border-b">
              <th v-for="column in columns" :key="column" class="px-3 py-2 text-left font-medium">
                {{ mapping[column] === 'Skip' ? '—' : mapping[column] }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in rows.slice(0, 5)" :key="i" class="border-b last:border-b-0">
              <td
                v-for="column in columns"
                :key="column"
                class="px-3 py-2"
                :class="cellInvalid(row, column) ? 'bg-destructive/10 text-destructive font-medium' : ''"
                :title="cellInvalid(row, column) ? 'This value will be rejected' : undefined"
              >
                {{ mapping[column] === 'Skip' ? '·' : row[column] }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="text-muted-foreground text-xs">
        Showing first 5 of 248 rows ·
        <span :class="flaggedCount > 0 ? 'text-warning font-medium' : 'text-success font-medium'">
          {{ importedCount }} valid · {{ flaggedCount }} flagged
        </span>
      </p>
    </div>

    <!-- Step 4 · Result -->
    <div v-else class="space-y-4 py-4 text-center">
      <CheckCircle2 class="text-success mx-auto size-10" aria-hidden="true" />
      <div>
        <p class="text-lg font-semibold">{{ importedCount }} records imported</p>
        <p class="text-muted-foreground mt-1 text-sm">
          {{ flaggedCount }} rows were skipped — fix them and re-import anytime.
        </p>
      </div>
      <Button variant="outline" size="sm" @click="reset">Import another file</Button>
    </div>

    <template #footer>
      <div class="flex items-center justify-between">
        <Button v-if="step > 1 && step < 4" variant="ghost" size="sm" @click="step -= 1">
          <ChevronLeft aria-hidden="true" />
          Back
        </Button>
        <span v-else></span>
        <Button v-if="step < 4" size="sm" :disabled="step === 2 && missingRequired.length > 0" @click="goNext">
          {{ step === 1 ? 'Continue' : step === 2 ? 'Review' : 'Import' }}
          <ChevronRight aria-hidden="true" />
        </Button>
      </div>
    </template>
  </SectionCard>
</template>
