<script setup lang="ts">
import type { Component, HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
import {
  ArrowRight,
  Briefcase,
  Coins,
  Globe,
  GraduationCap,
  HeartHandshake,
  MapPin,
  Search,
  SearchX,
  Sparkles,
  TrendingUp,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Perk {
  icon: Component
  title: string
  description: string
}

interface JobOpening {
  id: string
  title: string
  department: 'Engineering' | 'Design' | 'Product' | 'Marketing'
  location: 'Remote' | 'San Francisco, CA' | 'London, UK'
  type: string
  level: string
  salary: string
  description: string
}

const props = withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    class?: HTMLAttributes['class']
  }>(),
  {
    title: 'Join our team',
    subtitle: 'Help us build the open-source UI infrastructure of tomorrow',
  },
)

const PERKS: Perk[] = [
  {
    icon: Globe,
    title: 'Remote-first',
    description: 'Work from anywhere in the world with flexible hours.',
  },
  {
    icon: GraduationCap,
    title: '$5k learning budget',
    description: 'Annual stipend for courses, books, tools, and conferences.',
  },
  {
    icon: HeartHandshake,
    title: '100% health coverage',
    description: 'Comprehensive medical, dental, and vision for you and dependents.',
  },
  {
    icon: TrendingUp,
    title: 'Equity packages',
    description: 'Meaningful ownership stake with transparent vesting schedules.',
  },
]

const DEPARTMENTS = [
  { id: 'all', label: 'All', count: 12 },
  { id: 'Engineering', label: 'Engineering', count: 6 },
  { id: 'Design', label: 'Design', count: 2 },
  { id: 'Product', label: 'Product', count: 2 },
  { id: 'Marketing', label: 'Marketing', count: 2 },
] as const

const LOCATIONS = [
  { id: 'all', label: 'All Locations' },
  { id: 'Remote', label: 'Remote' },
  { id: 'San Francisco, CA', label: 'San Francisco, CA' },
  { id: 'London, UK', label: 'London, UK' },
] as const

const JOBS: JobOpening[] = [
  {
    id: 'eng-1',
    title: 'Staff Frontend Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    level: 'Staff',
    salary: '$190k - $240k · 0.3% - 0.6%',
    description:
      'Lead the architecture of our high-performance UI components, compiler toolchains, and multi-framework design systems.',
  },
  {
    id: 'eng-2',
    title: 'Senior Full-Stack Engineer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    type: 'Full-time',
    level: 'Senior',
    salary: '$160k - $210k · 0.25% - 0.5%',
    description:
      'Build end-to-end features spanning serverless edge runtimes, component registries, and developer tooling.',
  },
  {
    id: 'eng-3',
    title: 'Systems & Performance Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    level: 'Senior',
    salary: '$170k - $220k · 0.25% - 0.5%',
    description:
      'Optimize bundling pipelines, AST transformers, and static site generation latency across large workspaces.',
  },
  {
    id: 'eng-4',
    title: 'Design Systems Engineer',
    department: 'Engineering',
    location: 'London, UK',
    type: 'Full-time',
    level: 'Mid-Senior',
    salary: '£110k - £140k · 0.2% - 0.4%',
    description:
      'Bridge design and code by maintaining tokens, accessible headless primitives, and fluid interaction standards.',
  },
  {
    id: 'eng-5',
    title: 'Developer Experience Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    level: 'Mid-Senior',
    salary: '$150k - $190k · 0.2% - 0.4%',
    description:
      'Craft exceptional CLI workflows, interactive documentation playgrounds, and starter template engines.',
  },
  {
    id: 'eng-6',
    title: 'QA & Automation Engineer',
    department: 'Engineering',
    location: 'London, UK',
    type: 'Full-time',
    level: 'Mid-Senior',
    salary: '£95k - £125k · 0.15% - 0.3%',
    description:
      'Expand cross-browser visual regression testing suites, accessibility audits, and automated release checks.',
  },
  {
    id: 'des-1',
    title: 'Senior Product Designer',
    department: 'Design',
    location: 'San Francisco, CA',
    type: 'Full-time',
    level: 'Senior',
    salary: '$155k - $195k · 0.25% - 0.45%',
    description:
      'Define micro-interactions, responsive dashboard workflows, and layout ergonomics across our block catalog.',
  },
  {
    id: 'des-2',
    title: 'Brand & Motion Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    level: 'Mid-Senior',
    salary: '$140k - $180k · 0.2% - 0.35%',
    description:
      'Create fluid motion principles, brand identity assets, and polished launch visuals for major releases.',
  },
  {
    id: 'prd-1',
    title: 'Staff Technical Product Manager',
    department: 'Product',
    location: 'Remote',
    type: 'Full-time',
    level: 'Staff',
    salary: '$180k - $230k · 0.3% - 0.5%',
    description:
      'Drive product roadmap for developer workflows, unbundled registry distribution, and monorepo orchestration.',
  },
  {
    id: 'prd-2',
    title: 'Product Operations Lead',
    department: 'Product',
    location: 'San Francisco, CA',
    type: 'Full-time',
    level: 'Senior',
    salary: '$145k - $185k · 0.2% - 0.35%',
    description: 'Manage release triage, community feature requests, and cross-team execution cadences.',
  },
  {
    id: 'mkt-1',
    title: 'Developer Advocate / Technical Writer',
    department: 'Marketing',
    location: 'Remote',
    type: 'Full-time',
    level: 'Mid-Senior',
    salary: '$140k - $180k · 0.2% - 0.4%',
    description:
      'Author technical deep-dives, create interactive video tutorials, and engage with the open-source community.',
  },
  {
    id: 'mkt-2',
    title: 'Growth Marketing Lead',
    department: 'Marketing',
    location: 'London, UK',
    type: 'Full-time',
    level: 'Senior',
    salary: '£105k - £135k · 0.2% - 0.4%',
    description:
      'Lead developer-focused growth experiments, SEO architecture, launch campaigns, and analytics instrumentation.',
  },
]

const selectedDepartment = ref<string>('all')
const selectedLocation = ref<string>('all')
const searchQuery = ref('')

const filteredJobs = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return JOBS.filter((job) => {
    const matchDept = selectedDepartment.value === 'all' || job.department === selectedDepartment.value
    const matchLoc = selectedLocation.value === 'all' || job.location === selectedLocation.value
    if (!matchDept || !matchLoc) return false
    if (!q) return true
    return (
      job.title.toLowerCase().includes(q) ||
      job.description.toLowerCase().includes(q) ||
      job.department.toLowerCase().includes(q) ||
      job.level.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q) ||
      job.type.toLowerCase().includes(q) ||
      job.salary.toLowerCase().includes(q)
    )
  })
})

const departmentGroups = computed(() => {
  const allDepts = ['Engineering', 'Design', 'Product', 'Marketing'] as const
  const targetDepartments =
    selectedDepartment.value === 'all' ? allDepts : allDepts.filter((dept) => dept === selectedDepartment.value)

  return targetDepartments
    .map((dept) => ({
      name: dept,
      jobs: filteredJobs.value.filter((job) => job.department === dept),
    }))
    .filter((group) => group.jobs.length > 0)
})

const isFiltered = computed(
  () => selectedDepartment.value !== 'all' || selectedLocation.value !== 'all' || searchQuery.value.trim() !== '',
)

function resetFilters() {
  selectedDepartment.value = 'all'
  selectedLocation.value = 'all'
  searchQuery.value = ''
}
</script>

<template>
  <section data-slot="careers-job-board" :class="cn('w-full space-y-12 py-6', props.class)">
    <!-- Hero / Header -->
    <div class="mx-auto max-w-3xl space-y-4 text-center">
      <Badge variant="secondary" class="gap-1.5 px-3 py-1 text-xs font-medium">
        <Sparkles class="text-primary size-3.5" aria-hidden="true" />
        We're hiring
      </Badge>
      <h1 class="text-foreground text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
        {{ title }}
      </h1>
      <p class="text-muted-foreground text-base leading-relaxed sm:text-lg">
        {{ subtitle }}
      </p>
    </div>

    <!-- Perks summary row -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="perk in PERKS"
        :key="perk.title"
        class="bg-card border-border flex flex-col gap-3 rounded-xl border p-4 shadow-xs"
      >
        <div class="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-lg">
          <component :is="perk.icon" class="size-4.5" aria-hidden="true" />
        </div>
        <div class="space-y-1">
          <p class="text-foreground text-sm font-semibold">{{ perk.title }}</p>
          <p class="text-muted-foreground text-xs leading-relaxed">{{ perk.description }}</p>
        </div>
      </div>
    </div>

    <!-- Filter Toolbar -->
    <div class="bg-card border-border space-y-4 rounded-xl border p-4 shadow-xs">
      <div class="flex flex-wrap items-center gap-1.5">
        <Button
          v-for="dept in DEPARTMENTS"
          :key="dept.id"
          :variant="selectedDepartment === dept.id ? 'default' : 'outline'"
          size="sm"
          class="h-8 rounded-lg text-xs"
          @click="selectedDepartment = dept.id"
        >
          {{ dept.label }}
          <span
            :class="
              cn(
                'ml-1.5 rounded-full px-1.5 py-0.5 text-xs font-medium tabular-nums',
                selectedDepartment === dept.id
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'bg-muted text-muted-foreground',
              )
            "
          >
            {{ dept.count }}
          </span>
        </Button>
      </div>

      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div class="relative flex-1">
          <Search
            class="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
            aria-hidden="true"
          />
          <Input
            v-model="searchQuery"
            placeholder="Search roles, technologies, or keywords..."
            class="pl-9 text-sm"
            aria-label="Search open positions"
          />
        </div>

        <div class="w-full shrink-0 sm:w-56">
          <Select v-model="selectedLocation">
            <SelectTrigger class="w-full text-xs sm:text-sm" aria-label="Filter by location">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="loc in LOCATIONS" :key="loc.id" :value="loc.id">
                {{ loc.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          v-if="isFiltered"
          variant="ghost"
          size="sm"
          class="text-muted-foreground hover:text-foreground text-xs"
          @click="resetFilters"
        >
          Reset filters
        </Button>
      </div>
    </div>

    <!-- Grouped Job Openings list -->
    <div v-if="departmentGroups.length > 0" class="space-y-10">
      <div v-for="group in departmentGroups" :key="group.name" class="space-y-4">
        <div class="border-border flex items-center justify-between border-b pb-3">
          <div class="flex items-center gap-2.5">
            <h2 class="text-foreground text-lg font-semibold tracking-tight">{{ group.name }}</h2>
            <Badge variant="secondary" class="text-xs font-normal">
              {{ group.jobs.length }} {{ group.jobs.length === 1 ? 'opening' : 'openings' }}
            </Badge>
          </div>
        </div>

        <div class="space-y-3">
          <article
            v-for="job in group.jobs"
            :key="job.id"
            class="group bg-card border-border hover:border-primary/40 relative flex flex-col justify-between gap-4 rounded-xl border p-5 shadow-xs transition-all duration-150 hover:shadow-sm md:flex-row md:items-center"
          >
            <div class="min-w-0 flex-1 space-y-2">
              <div class="flex flex-wrap items-center gap-2">
                <h3
                  class="group-hover:text-primary text-foreground text-base font-semibold tracking-tight transition-colors sm:text-lg"
                >
                  {{ job.title }}
                </h3>
                <Badge variant="outline" class="text-xs">{{ job.level }}</Badge>
              </div>
              <p class="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                {{ job.description }}
              </p>
              <div class="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-xs">
                <span class="inline-flex items-center gap-1.5">
                  <MapPin class="text-muted-foreground size-3.5 shrink-0" aria-hidden="true" />
                  {{ job.location }}
                </span>
                <span class="inline-flex items-center gap-1.5">
                  <Briefcase class="text-muted-foreground size-3.5 shrink-0" aria-hidden="true" />
                  {{ job.type }}
                </span>
                <span class="text-foreground inline-flex items-center gap-1.5 font-medium">
                  <Coins class="text-muted-foreground size-3.5 shrink-0" aria-hidden="true" />
                  {{ job.salary }}
                </span>
              </div>
            </div>
            <div class="shrink-0 pt-2 md:pt-0">
              <Button class="w-full gap-1.5 md:w-auto" size="sm">
                Apply now
                <ArrowRight class="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Button>
            </div>
          </article>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="border-border flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center"
    >
      <div class="bg-muted text-muted-foreground mb-4 flex size-12 items-center justify-center rounded-full">
        <SearchX class="size-6" aria-hidden="true" />
      </div>
      <h3 class="text-foreground text-base font-semibold">No matching positions found</h3>
      <p class="text-muted-foreground mt-1 mb-4 max-w-sm text-sm leading-normal">
        We could not find any roles matching your current search or filters. Try adjusting your criteria.
      </p>
      <Button variant="outline" size="sm" @click="resetFilters"> Clear all filters </Button>
    </div>

    <!-- Don't see your role? CTA Card -->
    <div
      class="bg-card border-border flex flex-col items-start justify-between gap-6 rounded-2xl border p-6 shadow-xs sm:flex-row sm:items-center sm:p-8"
    >
      <div class="max-w-xl space-y-1.5">
        <h3 class="text-foreground text-lg font-semibold tracking-tight">Don't see your role?</h3>
        <p class="text-muted-foreground text-sm leading-relaxed">
          We are always looking for curious, high-craft engineers, designers, and thinkers. Send us an open application
          and tell us what you'd love to build with us.
        </p>
      </div>
      <Button variant="outline" class="shrink-0 gap-2">
        Send open application
        <ArrowRight class="size-4" aria-hidden="true" />
      </Button>
    </div>
  </section>
</template>
