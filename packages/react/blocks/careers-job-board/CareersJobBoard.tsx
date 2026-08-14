'use client'

import * as React from 'react'
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
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export interface JobOpening {
  id: string
  title: string
  department: 'Engineering' | 'Design' | 'Product' | 'Marketing'
  location: 'Remote' | 'San Francisco, CA' | 'London, UK'
  type: string
  level: string
  salary: string
  description: string
}

export interface Perk {
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>
  title: string
  description: string
}

export interface CareersJobBoardProps {
  title?: string
  subtitle?: string
  className?: string
}

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

export function CareersJobBoard({
  title = 'Join our team',
  subtitle = 'Help us build the open-source UI infrastructure of tomorrow',
  className,
}: CareersJobBoardProps) {
  const [selectedDepartment, setSelectedDepartment] = React.useState<string>('all')
  const [selectedLocation, setSelectedLocation] = React.useState<string>('all')
  const [searchQuery, setSearchQuery] = React.useState<string>('')

  const filteredJobs = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return JOBS.filter((job) => {
      const matchDept = selectedDepartment === 'all' || job.department === selectedDepartment
      const matchLoc = selectedLocation === 'all' || job.location === selectedLocation
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
  }, [selectedDepartment, selectedLocation, searchQuery])

  const departmentGroups = React.useMemo(() => {
    const allDepts = ['Engineering', 'Design', 'Product', 'Marketing'] as const
    const targetDepartments =
      selectedDepartment === 'all' ? allDepts : allDepts.filter((dept) => dept === selectedDepartment)

    return targetDepartments
      .map((dept) => ({
        name: dept,
        jobs: filteredJobs.filter((job) => job.department === dept),
      }))
      .filter((group) => group.jobs.length > 0)
  }, [selectedDepartment, filteredJobs])

  const isFiltered = selectedDepartment !== 'all' || selectedLocation !== 'all' || searchQuery.trim() !== ''

  const resetFilters = () => {
    setSelectedDepartment('all')
    setSelectedLocation('all')
    setSearchQuery('')
  }

  return (
    <section data-slot="careers-job-board" className={cn('w-full space-y-12 py-6', className)}>
      {/* Hero / Header */}
      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-xs font-medium">
          <Sparkles className="text-primary size-3.5" aria-hidden="true" />
          We're hiring
        </Badge>
        <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{title}</h1>
        <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">{subtitle}</p>
      </div>

      {/* Perks summary row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PERKS.map((perk) => {
          const Icon = perk.icon
          return (
            <div key={perk.title} className="bg-card border-border flex flex-col gap-3 rounded-xl border p-4 shadow-xs">
              <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-lg">
                <Icon className="size-4.5" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <p className="text-foreground text-sm font-semibold">{perk.title}</p>
                <p className="text-muted-foreground text-xs leading-relaxed">{perk.description}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Filter Toolbar */}
      <div className="bg-card border-border space-y-4 rounded-xl border p-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {DEPARTMENTS.map((dept) => (
            <Button
              key={dept.id}
              variant={selectedDepartment === dept.id ? 'default' : 'outline'}
              size="sm"
              className="h-8 rounded-lg text-xs"
              onClick={() => setSelectedDepartment(dept.id)}
            >
              {dept.label}
              <span
                className={cn(
                  'ml-1.5 rounded-full px-1.5 py-0.5 text-xs font-medium tabular-nums',
                  selectedDepartment === dept.id
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {dept.count}
              </span>
            </Button>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
              aria-hidden="true"
            />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search roles, technologies, or keywords..."
              className="pl-9 text-sm"
              aria-label="Search open positions"
            />
          </div>

          <div className="w-full shrink-0 sm:w-56">
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-full text-xs sm:text-sm" aria-label="Filter by location">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                {LOCATIONS.map((loc) => (
                  <SelectItem key={loc.id} value={loc.id}>
                    {loc.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isFiltered && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground text-xs"
              onClick={resetFilters}
            >
              Reset filters
            </Button>
          )}
        </div>
      </div>

      {/* Grouped Job Openings list */}
      {departmentGroups.length > 0 ? (
        <div className="space-y-10">
          {departmentGroups.map((group) => (
            <div key={group.name} className="space-y-4">
              <div className="border-border flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-foreground text-lg font-semibold tracking-tight">{group.name}</h2>
                  <Badge variant="secondary" className="text-xs font-normal">
                    {group.jobs.length} {group.jobs.length === 1 ? 'opening' : 'openings'}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                {group.jobs.map((job) => (
                  <article
                    key={job.id}
                    className="group bg-card border-border hover:border-primary/40 relative flex flex-col justify-between gap-4 rounded-xl border p-5 shadow-xs transition-all duration-150 hover:shadow-sm md:flex-row md:items-center"
                  >
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="group-hover:text-primary text-foreground text-base font-semibold tracking-tight transition-colors sm:text-lg">
                          {job.title}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {job.level}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">{job.description}</p>
                      <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-xs">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="text-muted-foreground size-3.5 shrink-0" aria-hidden="true" />
                          {job.location}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Briefcase className="text-muted-foreground size-3.5 shrink-0" aria-hidden="true" />
                          {job.type}
                        </span>
                        <span className="text-foreground inline-flex items-center gap-1.5 font-medium">
                          <Coins className="text-muted-foreground size-3.5 shrink-0" aria-hidden="true" />
                          {job.salary}
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0 pt-2 md:pt-0">
                      <Button className="w-full gap-1.5 md:w-auto" size="sm">
                        Apply now
                        <ArrowRight
                          className="size-3.5 transition-transform group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="border-border flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
          <div className="bg-muted text-muted-foreground mb-4 flex size-12 items-center justify-center rounded-full">
            <SearchX className="size-6" aria-hidden="true" />
          </div>
          <h3 className="text-foreground text-base font-semibold">No matching positions found</h3>
          <p className="text-muted-foreground mt-1 mb-4 max-w-sm text-sm leading-normal">
            We could not find any roles matching your current search or filters. Try adjusting your criteria.
          </p>
          <Button variant="outline" size="sm" onClick={resetFilters}>
            Clear all filters
          </Button>
        </div>
      )}

      {/* Don't see your role? CTA Card */}
      <div className="bg-card border-border flex flex-col items-start justify-between gap-6 rounded-2xl border p-6 shadow-xs sm:flex-row sm:items-center sm:p-8">
        <div className="max-w-xl space-y-1.5">
          <h3 className="text-foreground text-lg font-semibold tracking-tight">Don't see your role?</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            We are always looking for curious, high-craft engineers, designers, and thinkers. Send us an open
            application and tell us what you'd love to build with us.
          </p>
        </div>
        <Button variant="outline" className="shrink-0 gap-2">
          Send open application
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </section>
  )
}
