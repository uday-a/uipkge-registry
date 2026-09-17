<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import {
  CalendarCheck,
  ClipboardCheck,
  Download,
  GraduationCap,
  Mail,
  MoreHorizontal,
  Pencil,
  Plus,
  User,
  Users,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export type LetterGrade = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-'

export interface StudentGradeRecord {
  id: string
  name: string
  studentId: string
  homework: string
  midterm: string
  labProjects: string
  finalProject: string
  overallGrade: string
  letterGrade: LetterGrade
  attendanceRate: string
  absences: number
}

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const metrics = [
  {
    title: 'Class GPA',
    value: '3.62 / 4.0',
    description: '+0.18 vs departmental target',
    icon: GraduationCap,
    iconClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    valueClass: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    title: 'Total Enrolled Students',
    value: '28 students',
    description: '100% active roster',
    icon: Users,
    iconClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    valueClass: 'text-foreground',
  },
  {
    title: 'Assignments Graded',
    value: '12 / 14 assignments',
    description: '2 pending final submissions',
    icon: ClipboardCheck,
    iconClass: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    valueClass: 'text-foreground',
  },
  {
    title: 'Class Attendance Rate',
    value: '96.2% average',
    description: '36 lectures & labs logged',
    icon: CalendarCheck,
    iconClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    valueClass: 'text-foreground',
  },
]

const gradeBadgeConfig: Record<LetterGrade, { class: string }> = {
  'A+': {
    class: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-semibold',
  },
  A: {
    class: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-semibold',
  },
  'A-': {
    class: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-semibold',
  },
  'B+': {
    class: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 font-semibold',
  },
  B: {
    class: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-semibold',
  },
  'B-': {
    class: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-semibold',
  },
}

const students: StudentGradeRecord[] = [
  {
    id: 's1',
    name: 'Elena Rostova',
    studentId: '#STU-84920',
    homework: '95.0%',
    midterm: '92.0%',
    labProjects: '98.0%',
    finalProject: '94.0%',
    overallGrade: '94.5%',
    letterGrade: 'A',
    attendanceRate: '100%',
    absences: 0,
  },
  {
    id: 's2',
    name: 'David Chen',
    studentId: '#STU-84921',
    homework: '88.0%',
    midterm: '91.0%',
    labProjects: '86.0%',
    finalProject: '89.0%',
    overallGrade: '88.6%',
    letterGrade: 'B+',
    attendanceRate: '96%',
    absences: 1,
  },
  {
    id: 's3',
    name: 'Sarah Jenkins',
    studentId: '#STU-84922',
    homework: '98.0%',
    midterm: '96.0%',
    labProjects: '100.0%',
    finalProject: '95.0%',
    overallGrade: '97.1%',
    letterGrade: 'A',
    attendanceRate: '100%',
    absences: 0,
  },
  {
    id: 's4',
    name: 'Marcus Vance',
    studentId: '#STU-84923',
    homework: '82.0%',
    midterm: '79.0%',
    labProjects: '85.0%',
    finalProject: '80.0%',
    overallGrade: '81.4%',
    letterGrade: 'B',
    attendanceRate: '92%',
    absences: 2,
  },
  {
    id: 's5',
    name: 'Sofia Rossi',
    studentId: '#STU-84924',
    homework: '91.0%',
    midterm: '88.0%',
    labProjects: '94.0%',
    finalProject: '90.0%',
    overallGrade: '90.6%',
    letterGrade: 'A-',
    attendanceRate: '98%',
    absences: 1,
  },
  {
    id: 's6',
    name: 'Alex Rivera',
    studentId: '#STU-84925',
    homework: '84.0%',
    midterm: '86.0%',
    labProjects: '82.0%',
    finalProject: '85.0%',
    overallGrade: '84.3%',
    letterGrade: 'B',
    attendanceRate: '94%',
    absences: 2,
  },
]

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
</script>

<template>
  <div data-slot="student-gradebook-table" :class="cn('w-full space-y-6', props.class)">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div class="flex flex-wrap items-center gap-2.5">
          <h2 class="text-2xl font-bold tracking-tight">CS 301: Advanced Software Systems &amp; Compilers</h2>
          <Badge variant="outline" class="font-mono text-xs">CS-301-B</Badge>
        </div>
        <div class="text-muted-foreground mt-1.5 flex flex-wrap items-center gap-2 text-sm">
          <span>Fall 2026 · Section B</span>
          <span class="text-foreground inline-flex items-center gap-1 font-medium">
            Class Average: <span class="tabular-nums">88.4%</span> · Grade B+
          </span>
        </div>
      </div>
      <div class="flex flex-wrap items-center gap-2.5">
        <Button aria-label="Download attachment" variant="outline">
          <Download aria-hidden="true" />
          Export Grades CSV
        </Button>
        <Button>
          <Plus aria-hidden="true" />
          New Grade Entry
        </Button>
      </div>
    </div>

    <!-- 4 Class Overview Metric Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card v-for="metric in metrics" :key="metric.title" class="shadow-xs">
        <CardContent class="space-y-2 p-5">
          <div class="flex items-center justify-between">
            <p class="text-muted-foreground text-sm font-medium">{{ metric.title }}</p>
            <div :class="cn('flex size-8 items-center justify-center rounded-md', metric.iconClass)">
              <component :is="metric.icon" aria-hidden="true" class="size-4" />
            </div>
          </div>
          <div>
            <p :class="cn('text-2xl font-bold tracking-tight tabular-nums', metric.valueClass)">
              {{ metric.value }}
            </p>
            <p class="text-muted-foreground mt-1 text-xs">{{ metric.description }}</p>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Gradebook Table -->
    <div class="bg-card overflow-x-auto rounded-lg border shadow-xs">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead class="text-right">Homework (25%)</TableHead>
            <TableHead class="text-right">Midterm (30%)</TableHead>
            <TableHead class="text-right">Lab Projects (25%)</TableHead>
            <TableHead class="text-right">Final Project (20%)</TableHead>
            <TableHead class="text-right font-semibold">Overall Grade</TableHead>
            <TableHead class="text-center">Letter Grade</TableHead>
            <TableHead>Attendance</TableHead>
            <TableHead class="w-12 text-right">
              <span class="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="student in students" :key="student.id" class="hover:bg-muted/50">
            <TableCell>
              <div class="flex items-center gap-3">
                <Avatar class="size-8">
                  <AvatarFallback class="text-xs font-medium">{{ initials(student.name) }}</AvatarFallback>
                </Avatar>
                <div class="min-w-0">
                  <p class="truncate text-sm font-semibold">{{ student.name }}</p>
                  <p class="text-muted-foreground font-mono text-xs">{{ student.studentId }}</p>
                </div>
              </div>
            </TableCell>
            <TableCell class="text-right font-medium tabular-nums">{{ student.homework }}</TableCell>
            <TableCell class="text-right font-medium tabular-nums">{{ student.midterm }}</TableCell>
            <TableCell class="text-right font-medium tabular-nums">{{ student.labProjects }}</TableCell>
            <TableCell class="text-right font-medium tabular-nums">{{ student.finalProject }}</TableCell>
            <TableCell class="text-foreground text-right font-bold tabular-nums">{{ student.overallGrade }}</TableCell>
            <TableCell class="text-center">
              <Badge variant="outline" :class="cn('font-semibold', gradeBadgeConfig[student.letterGrade].class)">
                {{ student.letterGrade }}
              </Badge>
            </TableCell>
            <TableCell>
              <div class="inline-flex items-center gap-1.5 text-xs">
                <span
                  class="inline-block size-1.5 rounded-full"
                  :class="student.absences === 0 ? 'bg-emerald-500' : 'bg-amber-500'"
                  aria-hidden="true"
                />
                <span class="text-foreground font-medium tabular-nums">{{ student.attendanceRate }}</span>
                <span class="text-muted-foreground">
                  ·
                  {{
                    student.absences === 0
                      ? '0 absences'
                      : `${student.absences} absence${student.absences > 1 ? 's' : ''}`
                  }}
                </span>
              </div>
            </TableCell>
            <TableCell class="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button variant="ghost" size="icon-sm" class="text-muted-foreground">
                    <MoreHorizontal aria-hidden="true" />
                    <span class="sr-only">Open actions for {{ student.name }}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" class="w-48">
                  <DropdownMenuItem>
                    <Pencil aria-hidden="true" />
                    Edit Grades
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <User aria-hidden="true" />
                    View Student Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Mail aria-hidden="true" />
                    Send Email Alert
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Table Footer / Pagination -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-muted-foreground text-sm">
        Showing <span class="text-foreground font-medium">6</span> of
        <span class="text-foreground font-medium">28</span> enrolled students
      </p>
      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled> Previous </Button>
        <Button variant="outline" size="sm"> Next </Button>
      </div>
    </div>
  </div>
</template>
