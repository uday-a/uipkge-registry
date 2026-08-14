<script lang="ts">
export interface TeamMember {
  name: string
  role: string
  bio?: string
  /** When any member has a department, the grid groups under uppercase headers. */
  department?: string
  twitter?: string
  github?: string
  linkedin?: string
}
</script>

<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

/**
 * Marketing team section. The roster below is stub data — swap
 * DEFAULT_MEMBERS for your data source after installing, or pass `members`.
 */

const DEFAULT_MEMBERS: TeamMember[] = [
  {
    name: 'Amara Okafor',
    role: 'Co-founder & CEO',
    bio: 'Sets the vision and still reviews every release note before it ships.',
    twitter: 'https://x.com/amaraokafor',
    linkedin: 'https://linkedin.com/in/amaraokafor',
  },
  {
    name: 'Jonas Lindqvist',
    role: 'Co-founder & CTO',
    bio: 'Owns architecture and keeps p95 latency under 80ms in every region.',
    github: 'https://github.com/jonaslindqvist',
    linkedin: 'https://linkedin.com/in/jonaslindqvist',
  },
  {
    name: 'Priya Raghavan',
    role: 'Staff Engineer',
    bio: 'Leads the platform team and maintains our public REST and GraphQL APIs.',
    github: 'https://github.com/priyaraghavan',
  },
  {
    name: 'Marco Deluca',
    role: 'Product Designer',
    bio: 'Turns messy workflows into calm interfaces and runs our weekly design critique.',
    twitter: 'https://x.com/marcodeluca',
    github: 'https://github.com/marcodeluca',
    linkedin: 'https://linkedin.com/in/marcodeluca',
  },
  {
    name: 'Tomoko Saito',
    role: 'Head of People',
    bio: 'Builds hiring loops that respect candidates and onboarding that actually sticks.',
    linkedin: 'https://linkedin.com/in/tomokosaito',
  },
  {
    name: 'Felix Adeyemi',
    role: 'Growth Engineer',
    bio: 'Experiments across onboarding and pricing pages; ships behind flags daily.',
    twitter: 'https://x.com/felixadeyemi',
  },
]

const props = defineProps<{
  eyebrow?: string
  title?: string
  description?: string
  members?: TeamMember[]
  /** 'grid' shows full cards with bios; 'compact' tightens cards and drops them. */
  variant?: 'grid' | 'compact'
  class?: HTMLAttributes['class']
}>()

const compact = computed(() => props.variant === 'compact')
const showHeader = computed(() => Boolean(props.eyebrow || props.title || props.description))

interface MemberSection {
  department?: string
  members: TeamMember[]
}

const sections = computed<MemberSection[]>(() => {
  const members = props.members ?? DEFAULT_MEMBERS
  if (!members.some((member) => member.department)) return [{ members }]
  const grouped = new Map<string, TeamMember[]>()
  for (const member of members) {
    const key = member.department ?? ''
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(member)
  }
  return Array.from(grouped.entries()).map(([department, groupedMembers]) => ({
    department: department || undefined,
    members: groupedMembers,
  }))
})

function initialsFor(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}
</script>

<template>
  <section data-slot="team-section" :class="cn('bg-background', props.class)">
    <div class="mx-auto max-w-6xl px-6 py-24">
      <div v-if="showHeader" data-slot="team-section-header" class="mx-auto max-w-2xl text-center">
        <p v-if="eyebrow" class="text-primary text-sm font-medium tracking-widest uppercase">{{ eyebrow }}</p>
        <h2 v-if="title" class="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{{ title }}</h2>
        <p v-if="description" class="text-muted-foreground mt-3 text-lg leading-relaxed">{{ description }}</p>
      </div>

      <div
        v-for="(section, i) in sections"
        :key="section.department ?? 'team'"
        data-slot="team-section-group"
        :class="i > 0 || showHeader ? 'mt-12' : undefined"
      >
        <h3 v-if="section.department" class="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
          {{ section.department }}
        </h3>
        <div
          data-slot="team-section-grid"
          :class="cn('grid gap-6 sm:grid-cols-2 lg:grid-cols-3', compact && 'gap-4', section.department && 'mt-6')"
        >
          <Card v-for="member in section.members" :key="member.name" class="text-center">
            <CardContent :class="cn('flex flex-col items-center', compact ? 'gap-3 p-4' : 'gap-4 p-6')">
              <Avatar :class="compact ? 'size-10' : 'size-16'">
                <AvatarFallback :class="compact ? 'text-sm' : 'text-lg'">
                  {{ initialsFor(member.name) }}
                </AvatarFallback>
              </Avatar>
              <div class="space-y-1">
                <p class="text-sm font-semibold">{{ member.name }}</p>
                <Badge variant="secondary">{{ member.role }}</Badge>
                <p v-if="!compact && member.bio" class="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
                  {{ member.bio }}
                </p>
              </div>
              <div v-if="member.twitter || member.github || member.linkedin" class="flex items-center gap-0.5">
                <Button v-if="member.twitter" variant="ghost" size="icon-sm" as-child>
                  <a
                    :href="member.twitter"
                    target="_blank"
                    rel="noreferrer"
                    :aria-label="`${member.name} on X (Twitter)`"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" class="size-4" aria-hidden="true">
                      <path
                        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                      />
                    </svg>
                  </a>
                </Button>
                <Button v-if="member.github" variant="ghost" size="icon-sm" as-child>
                  <a :href="member.github" target="_blank" rel="noreferrer" :aria-label="`${member.name} on GitHub`">
                    <svg viewBox="0 0 24 24" fill="currentColor" class="size-4" aria-hidden="true">
                      <path
                        d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.15c-3.2.69-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.02 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.78 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.26 5.66.41.35.78 1.05.78 2.12v3.14c0 .31.21.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"
                      />
                    </svg>
                  </a>
                </Button>
                <Button v-if="member.linkedin" variant="ghost" size="icon-sm" as-child>
                  <a
                    :href="member.linkedin"
                    target="_blank"
                    rel="noreferrer"
                    :aria-label="`${member.name} on LinkedIn`"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" class="size-4" aria-hidden="true">
                      <path
                        d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0z"
                      />
                    </svg>
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </section>
</template>
