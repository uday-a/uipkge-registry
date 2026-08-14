'use client'

import * as React from 'react'
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
} from 'lucide-react'
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

export interface AssignmentSubmissionDropzoneProps {
  initialFile?: AttachedFile | null
  initialNotes?: string
  initialSubmitted?: boolean
  className?: string
}

const defaultRubricCategories: RubricCategory[] = [
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

export function AssignmentSubmissionDropzone({
  initialFile = {
    name: 'distributed_system_v1.zip',
    size: '18.4 MB',
    uploadedAt: 'Aug 24, 14:22 PST',
    similarity: 0.8,
    status: 'Ready to submit',
  },
  initialNotes = 'Included benchmark logs in the /docs folder. All 12 distributed Raft consensus nodes passed the Chaos Mesh partition tests under 500ms latency simulation.',
  initialSubmitted = false,
  className,
}: AssignmentSubmissionDropzoneProps) {
  const [file, setFile] = React.useState<AttachedFile | null>(initialFile)
  const [notes, setNotes] = React.useState(initialNotes)
  const [isSubmitted, setIsSubmitted] = React.useState(initialSubmitted)
  const [isDraftSaved, setIsDraftSaved] = React.useState(false)
  const [isDragging, setIsDragging] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)

  const isCleanSimilarity = !file || file.similarity < 10

  const triggerBrowse = () => {
    fileInputRef.current?.click()
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const f = e.target.files[0]
      setFile({
        name: f.name,
        size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadedAt: 'Just now',
        similarity: 0.8,
        status: 'Ready to submit',
      })
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      const f = e.dataTransfer.files[0]
      setFile({
        name: f.name,
        size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadedAt: 'Just now',
        similarity: 0.8,
        status: 'Ready to submit',
      })
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const removeFile = () => {
    setFile(null)
  }

  const restoreSampleFile = () => {
    setFile({
      name: 'distributed_system_v1.zip',
      size: '18.4 MB',
      uploadedAt: 'Aug 24, 14:22 PST',
      similarity: 0.8,
      status: 'Ready to submit',
    })
  }

  const handleSaveDraft = () => {
    setIsDraftSaved(true)
    setTimeout(() => {
      setIsDraftSaved(false)
    }, 3000)
  }

  const handleSubmit = () => {
    if (!file) return
    setIsSubmitted(true)
  }

  const handleResetSubmission = () => {
    setIsSubmitted(false)
  }

  return (
    <div data-slot="assignment-submission-dropzone" className={cn('space-y-6', className)}>
      {/* Assignment Header Card */}
      <Card className="shadow-xs">
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge wrap variant="outline" className="gap-1.5 font-medium">
                  <GraduationCap className="text-primary size-3.5" aria-hidden="true" />
                  CS 401 · Advanced Distributed Systems
                </Badge>
                <Badge wrap variant="secondary" className="gap-1 text-xs">
                  <Award className="text-muted-foreground size-3" aria-hidden="true" />
                  100 Points Possible
                </Badge>
              </div>

              <h1 className="text-foreground text-xl font-semibold tracking-tight sm:text-2xl">
                Final Project: Distributed Microservices Architecture
              </h1>

              <p className="text-muted-foreground text-sm">
                Term: Fall 2026 · Instructor: Prof. Elena Rostova · Stanford School of Engineering
              </p>
            </div>

            {/* Deadline Timer & Badges */}
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end">
              <Badge wrap variant="warning" className="gap-1.5 px-3 py-1 text-xs font-medium">
                <Clock className="size-3.5" aria-hidden="true" />
                Due Friday, Aug 28 at 23:59 PST · 4 Days Left
              </Badge>

              {/* Countdown blocks */}
              <div className="border-border bg-muted/40 flex items-center gap-2 rounded-lg border px-3 py-1.5 shadow-xs">
                <Timer className="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-foreground font-semibold">04</span>
                    <span className="text-muted-foreground text-xs">d</span>
                  </div>
                  <span className="text-muted-foreground">:</span>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-foreground font-semibold">07</span>
                    <span className="text-muted-foreground text-xs">h</span>
                  </div>
                  <span className="text-muted-foreground">:</span>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-foreground font-semibold">32</span>
                    <span className="text-muted-foreground text-xs">m</span>
                  </div>
                  <span className="text-muted-foreground">:</span>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-foreground font-semibold">15</span>
                    <span className="text-muted-foreground text-xs">s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submitted Confirmation Banner */}
      {isSubmitted && (
        <div
          className="border-success/30 bg-success/10 text-foreground flex flex-col gap-4 rounded-xl border p-5 sm:flex-row sm:items-center sm:justify-between"
          role="status"
        >
          <div className="flex items-start gap-3">
            <div className="bg-success/20 text-success flex size-9 shrink-0 items-center justify-center rounded-full">
              <CheckCircle2 className="size-5" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold">Coursework Submitted Successfully</h2>
                <Badge wrap variant="success" className="text-xs">
                  Receipt #SUB-CS401-2026-98124
                </Badge>
              </div>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Submission timestamp: August 24, 2026 at 14:25 PST · Hash:{' '}
                <code className="font-mono text-xs">sha256:4a8b...7f12</code>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleResetSubmission}>
              <RotateCcw className="size-3.5" aria-hidden="true" />
              Edit Submission
            </Button>
          </div>
        </div>
      )}

      {/* 2-Column Submission Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Submission & Dropzone Form */}
        <div className="space-y-6 lg:col-span-7 xl:col-span-7">
          <Card className="shadow-xs">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-semibold">Submission & File Upload</CardTitle>
                  <CardDescription>
                    Upload your completed project archive, code repository bundle, and accompanying documentation.
                  </CardDescription>
                </div>
                <Badge wrap variant="outline" className="text-xs">
                  Attempt 1 of 3
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Submission Instructions & Constraints */}
              <div className="border-border bg-muted/40 flex items-start gap-3 rounded-lg border p-3.5 text-xs shadow-xs">
                <Info className="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <div className="space-y-0.5">
                  <p className="text-foreground font-medium">
                    Accepted formats: PDF, ZIP, TAR.GZ · Max file size: 50 MB
                  </p>
                  <p className="text-muted-foreground">
                    Ensure all Docker Compose manifests, benchmarking scripts, and unit tests are included in the
                    archive root.
                  </p>
                </div>
              </div>

              {/* File Dropzone */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".zip,.tar.gz,.tar,.pdf"
                  onChange={handleFileInput}
                />

                <div
                  className={cn(
                    'group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200',
                    isDragging
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-muted/10 hover:border-primary/50 hover:bg-muted/20',
                  )}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-105">
                    <UploadCloud className="size-6" aria-hidden="true" />
                  </div>

                  <div className="mt-3 space-y-1">
                    <p className="text-foreground text-sm font-medium">Drag and drop your project archive here</p>
                    <p className="text-muted-foreground text-xs">
                      or select a file directly from your local filesystem
                    </p>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <Button variant="outline" size="sm" type="button" onClick={triggerBrowse}>
                      Browse files
                    </Button>
                  </div>

                  <div className="text-muted-foreground mt-4 flex items-center gap-1.5 text-xs">
                    <span className="border-border bg-muted rounded px-1.5 py-0.5 font-mono text-xs">.zip</span>
                    <span className="border-border bg-muted rounded px-1.5 py-0.5 font-mono text-xs">.tar.gz</span>
                    <span className="border-border bg-muted rounded px-1.5 py-0.5 font-mono text-xs">.pdf</span>
                  </div>
                </div>
              </div>

              {/* Attached Files List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-foreground text-xs font-semibold tracking-wider uppercase">
                    Attached Files ({file ? '1' : '0'} / 1)
                  </span>
                  {!file && <span className="text-muted-foreground text-xs">No file attached</span>}
                </div>

                {/* File Item Card */}
                {file ? (
                  <div className="border-border bg-card flex flex-col gap-3 rounded-lg border p-3.5 shadow-xs transition-colors sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-md">
                        <FileArchive className="size-5" aria-hidden="true" />
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <p className="text-foreground truncate text-sm font-medium">{file.name}</p>
                        <p className="text-muted-foreground text-xs">
                          {file.size} · {file.uploadedAt}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <Badge wrap variant="secondary" className="text-xs">
                        {file.size}
                      </Badge>
                      <Badge wrap variant="outline" className="border-success/30 text-success text-xs font-medium">
                        {file.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-muted-foreground hover:text-destructive"
                        title="Remove file"
                        aria-label="Remove attached file"
                        onClick={removeFile}
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border-border bg-muted/20 flex items-center justify-between rounded-lg border border-dashed p-3 text-xs">
                    <span className="text-muted-foreground">Sample archive cleared.</span>
                    <Button variant="ghost" size="xs" className="text-primary text-xs" onClick={restoreSampleFile}>
                      Restore default file
                    </Button>
                  </div>
                )}
              </div>

              {/* Plagiarism & Similarity Pre-scan Indicator */}
              {file && (
                <div
                  className={cn(
                    'space-y-3 rounded-lg border p-4 shadow-xs transition-colors',
                    isCleanSimilarity
                      ? 'border-success/30 bg-success/5 dark:bg-success/10'
                      : 'border-warning/30 bg-warning/5 dark:bg-warning/10',
                  )}
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      {isCleanSimilarity ? (
                        <ShieldCheck className="text-success size-5 shrink-0" aria-hidden="true" />
                      ) : (
                        <ShieldAlert className="text-warning size-5 shrink-0" aria-hidden="true" />
                      )}
                      <div>
                        <h3 className="text-foreground text-sm font-semibold">
                          Academic Integrity & Plagiarism Pre-Scan
                        </h3>
                        <p className="text-muted-foreground text-xs">
                          Scanned against 14.2M academic repositories & public open-source codebases
                        </p>
                      </div>
                    </div>

                    <Badge
                      wrap
                      variant={isCleanSimilarity ? 'success' : 'warning'}
                      className="gap-1 self-start text-xs font-medium sm:self-auto"
                    >
                      <Sparkles className="size-3" aria-hidden="true" />
                      {file.similarity}% Similarity · {isCleanSimilarity ? 'Clean' : 'Needs Review'}
                    </Badge>
                  </div>

                  {/* Mini metric progress line */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Overall similarity index</span>
                      <span className="text-foreground font-mono font-medium">
                        {file.similarity}% (Max threshold: 15.0%)
                      </span>
                    </div>
                    <Progress value={file.similarity * 6.66} className="h-1.5" />
                  </div>

                  {/* Integrity breakdown chips */}
                  <div className="grid grid-cols-1 gap-2 pt-1 text-xs sm:grid-cols-3">
                    <div className="border-border/60 bg-card/60 rounded border p-2">
                      <span className="text-muted-foreground block text-xs">Internet Sources</span>
                      <span className="text-foreground font-medium">0.0% match</span>
                    </div>
                    <div className="border-border/60 bg-card/60 rounded border p-2">
                      <span className="text-muted-foreground block text-xs">Peer Submissions</span>
                      <span className="text-foreground font-medium">0.0% match</span>
                    </div>
                    <div className="border-border/60 bg-card/60 rounded border p-2">
                      <span className="text-muted-foreground block text-xs">Standard Boilerplate</span>
                      <span className="text-foreground font-medium">{file.similarity}% (Apache 2.0)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Student Submission Notes Textarea */}
              <div className="space-y-2">
                <label htmlFor="react-submission-notes" className="text-foreground text-sm font-medium">
                  Student Submission Notes & Execution Instructions
                </label>
                <Textarea
                  id="react-submission-notes"
                  value={notes}
                  onValueChange={setNotes}
                  rows={3}
                  placeholder="Included benchmark logs in the /docs folder..."
                  className="text-sm"
                />
                <p className="text-muted-foreground text-xs">
                  Provide notes on environment configurations, docker flags, or benchmark reproducibility steps.
                </p>
              </div>
            </CardContent>

            <CardFooter className="border-border flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <span className="bg-success size-2 rounded-full" />
                {isDraftSaved ? (
                  <span className="text-success font-medium">Draft saved successfully!</span>
                ) : (
                  <span>Draft auto-saved 2 mins ago · rev 3</span>
                )}
              </div>

              <div className="flex w-full flex-wrap items-center gap-2.5 sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-initial"
                  disabled={isSubmitted}
                  onClick={handleSaveDraft}
                >
                  <Save className="size-3.5" aria-hidden="true" />
                  Save Draft
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1 sm:flex-initial"
                  disabled={!file || isSubmitted}
                  onClick={handleSubmit}
                >
                  <Send className="size-3.5" aria-hidden="true" />
                  Submit Assignment
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Right Column: Grading Rubric & Assessment Criteria */}
        <div className="space-y-6 lg:col-span-5 xl:col-span-5">
          <Card className="shadow-xs">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                    <BookOpen className="text-primary size-5" aria-hidden="true" />
                    Grading Rubric
                  </CardTitle>
                  <CardDescription>100 Points Total · Evaluated against course criteria</CardDescription>
                </div>
                <Badge wrap variant="outline" className="font-mono text-xs">
                  Pass: 70 pts
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Rubric Categories */}
              {defaultRubricCategories.map((category, index) => (
                <div key={category.id} className="space-y-3">
                  {/* Category Header */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-foreground text-sm font-medium">{category.title}</h4>
                      <Badge wrap variant="secondary" className="font-mono text-xs">
                        {category.points} pts ({category.percentage}%)
                      </Badge>
                    </div>
                    <Progress value={category.percentage} className="h-1.5" />
                  </div>

                  {/* Specific Sub-criteria */}
                  <ul className="border-border/60 bg-muted/20 space-y-2 rounded-lg border p-2.5 text-xs">
                    {category.criteria.map((criterion, cIndex) => (
                      <li key={cIndex} className="flex items-start justify-between gap-2">
                        <div className="flex min-w-0 items-start gap-1.5">
                          <span className="text-primary font-bold">·</span>
                          <span className="text-muted-foreground">{criterion.label}</span>
                        </div>
                        <span className="text-foreground shrink-0 font-mono font-medium">{criterion.points} pts</span>
                      </li>
                    ))}
                  </ul>

                  {index < defaultRubricCategories.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </CardContent>

            <CardFooter className="border-border bg-muted/30 text-muted-foreground flex flex-col gap-2 rounded-b-xl border-t p-4 text-xs">
              <div className="flex items-start gap-2">
                <Info className="text-muted-foreground mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <p>
                  <strong className="text-foreground font-medium">Late Submission Policy:</strong> Deductions of 5%
                  apply per 24 hours delayed up to a maximum 48-hour grace period.
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AssignmentSubmissionDropzone
