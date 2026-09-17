'use client'

import * as React from 'react'
import { CheckCircle2, ChevronLeft, ChevronRight, FileSpreadsheet, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Alert } from '@/components/ui/alert'
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

export interface ImportWizardProps {
  /** Jump straight to a step (1 Upload · 2 Map · 3 Preview · 4 Result). */
  initialStep?: number
  /** Show the upload step with the file already parsed. */
  initialFileSelected?: boolean
  /** Override the auto-mapping so demos can show unmapped required fields. */
  initialMapping?: Record<string, TargetField>
  className?: string
}

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

export function ImportWizard({
  initialStep = 1,
  initialFileSelected = false,
  initialMapping,
  className,
}: ImportWizardProps) {
  const [step, setStep] = React.useState(initialStep)
  const [fileSelected, setFileSelected] = React.useState(initialFileSelected || initialStep > 1)
  const [mapping, setMapping] = React.useState<Record<string, TargetField>>(initialMapping ?? { ...defaultMapping })

  const mappedTargets: TargetField[] = Object.values(mapping).filter((t) => t !== 'Skip')
  const missingRequired = requiredTargets.filter((target) => !mappedTargets.includes(target))

  function cellInvalid(row: CsvRow, column: string): boolean {
    if (mapping[column] === 'Full name') return row.full_name.trim() === ''
    if (mapping[column] === 'Email') return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email_address)
    return false
  }

  const flaggedCount = rows.filter((row) => columns.some((col) => cellInvalid(row, col))).length
  const importedCount = 245

  function onStepperInput(value: number) {
    // Free backward navigation; forward goes through the footer button only.
    if (value < step && step !== 4) setStep(value)
  }

  function goNext() {
    if (step === 1 && !fileSelected) setFileSelected(true)
    if (step === 2 && missingRequired.length > 0) return
    if (step < 4) setStep(step + 1)
  }

  function reset() {
    setStep(1)
    setFileSelected(false)
    setMapping({ ...defaultMapping })
  }

  return (
    <SectionCard
      data-slot="import-wizard"
      title="Import employees"
      description="Bring your people data in as CSV — map, review, then commit."
      className={className}
      footer={
        <div className="flex items-center justify-between">
          {step > 1 && step < 4 ? (
            <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)}>
              <ChevronLeft aria-hidden="true" />
              Back
            </Button>
          ) : (
            <span></span>
          )}
          {step < 4 && (
            <Button size="sm" disabled={step === 2 && missingRequired.length > 0} onClick={goNext}>
              {step === 1 ? 'Continue' : step === 2 ? 'Review' : 'Import'}
              <ChevronRight aria-hidden="true" />
            </Button>
          )}
        </div>
      }
    >
      <Stepper steps={steps} value={step} onValueChange={onStepperInput} className="mb-6" />

      {step === 1 && (
        <div className="space-y-4">
          {!fileSelected ? (
            <button
              type="button"
              className="border-border hover:border-primary/50 hover:bg-accent/50 focus-visible:ring-ring flex w-full cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed px-6 py-10 transition-colors focus-visible:ring-2 focus-visible:outline-none"
              onClick={() => setFileSelected(true)}
            >
              <Upload className="text-muted-foreground size-6" aria-hidden="true" />
              <span className="text-sm font-medium">Drop your CSV here or browse</span>
              <span className="text-muted-foreground text-xs">Up to 10 MB · comma or semicolon separated</span>
            </button>
          ) : (
            <div className="border-border flex flex-wrap items-center gap-3 rounded-lg border p-4">
              <span
                className="bg-muted text-muted-foreground flex size-9 items-center justify-center rounded-md"
                aria-hidden="true"
              >
                <FileSpreadsheet className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">employees.csv</p>
                <p className="text-muted-foreground text-xs">248 rows · 6 columns · 38 KB</p>
              </div>
              <Badge wrap className="" variant="success">
                Parsed
              </Badge>
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          {missingRequired.length > 0 && (
            <Alert
              icon="warning"
              title="Required fields unmapped"
              text={`Map ${missingRequired.join(' and ')} before continuing.`}
            />
          )}
          <ul className="divide-y rounded-lg border">
            {columns.map((column) => (
              <li key={column} className="flex flex-wrap items-center gap-3 p-3">
                <code className="w-32 shrink-0 truncate font-mono text-xs">{column}</code>
                <ChevronRight className="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
                <Select
                  value={mapping[column]}
                  onValueChange={(value) => setMapping((m) => ({ ...m, [column]: value as TargetField }))}
                >
                  <SelectTrigger className="flex-1" size="sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {targetOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {mapping[column] !== 'Skip' && (
                  <Badge wrap className="" variant={confidence[column] === 'high' ? 'success' : 'info'}>
                    {confidence[column] === 'high' ? 'Auto · high' : 'Auto · medium'}
                  </Badge>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3">
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full max-w-[640px] min-w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b">
                  {columns.map((column) => (
                    <th key={column} className="px-3 py-2 text-left font-medium">
                      {mapping[column] === 'Skip' ? '—' : mapping[column]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 5).map((row, i) => (
                  <tr key={i} className="border-b last:border-b-0">
                    {columns.map((column) => (
                      <td
                        key={column}
                        title={cellInvalid(row, column) ? 'This value will be rejected' : undefined}
                        className={cn(
                          'px-3 py-2',
                          cellInvalid(row, column) && 'bg-destructive/10 text-destructive font-medium',
                        )}
                      >
                        {mapping[column] === 'Skip' ? '·' : row[column]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-muted-foreground text-xs">
            Showing first 5 of 248 rows ·{' '}
            <span className={flaggedCount > 0 ? 'text-warning font-medium' : 'text-success font-medium'}>
              {importedCount} valid · {flaggedCount} flagged
            </span>
          </p>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4 py-4 text-center">
          <CheckCircle2 className="text-success mx-auto size-10" aria-hidden="true" />
          <div>
            <p className="text-lg font-semibold">{importedCount} records imported</p>
            <p className="text-muted-foreground mt-1 text-sm">
              {flaggedCount} rows were skipped — fix them and re-import anytime.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={reset}>
            Import another file
          </Button>
        </div>
      )}
    </SectionCard>
  )
}
