<script setup lang="ts">
import type { Component } from 'vue'
import {
  CalendarDays,
  FilePlus2,
  GitCommitHorizontal,
  Link,
  Mail,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Star,
} from 'lucide-vue-next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface DetailRow {
  icon: Component
  label: string
  value: string
}

interface ActivityItem {
  icon: Component
  sentence: string
  time: string
}

interface ProjectCard {
  name: string
  description: string
  progress: number
}

const details: DetailRow[] = [
  { icon: Mail, label: 'Email', value: 'amara@acme.com' },
  { icon: MapPin, label: 'Location', value: 'Lisbon, Portugal' },
  { icon: CalendarDays, label: 'Joined', value: 'March 2023' },
  { icon: Link, label: 'Website', value: 'amaraosei.dev' },
]

const activity: ActivityItem[] = [
  { icon: GitCommitHorizontal, sentence: 'Pushed 6 commits to design-tokens', time: '2h ago' },
  { icon: MessageSquare, sentence: 'Commented on "Sidebar collapse behavior"', time: '5h ago' },
  { icon: FilePlus2, sentence: 'Created project Marketing site refresh', time: 'Yesterday' },
  { icon: Star, sentence: 'Starred repository uipkge-ui', time: '3d ago' },
]

const projects: ProjectCard[] = [
  { name: 'Design tokens', description: 'Shared OKLCH palette and theme bindings.', progress: 92 },
  { name: 'Marketing site', description: 'Astro rebuild of the public landing pages.', progress: 64 },
  { name: 'Component audit', description: 'Parity pass across Vue and React mirrors.', progress: 41 },
  { name: 'Docs search', description: 'Client-side fuzzy search over registry items.', progress: 18 },
]
</script>

<template>
  <div data-slot="user-profile-page" class="bg-background border-border overflow-hidden rounded-xl border shadow-xs">
    <div class="from-primary/20 via-primary/5 h-32 bg-gradient-to-br to-transparent" aria-hidden="true" />

    <div class="px-6 pb-6">
      <div class="ring-background -mt-10 ml-6 flex size-20 items-center justify-center rounded-full ring-4">
        <Avatar size="2xl" class="size-20">
          <AvatarImage src="https://i.pravatar.cc/160?img=47" alt="Amara Osei" />
          <AvatarFallback>AO</AvatarFallback>
        </Avatar>
      </div>

      <div class="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <h1 class="text-xl font-semibold tracking-tight">Amara Osei</h1>
            <Badge variant="secondary">Design engineer</Badge>
          </div>
          <p class="text-muted-foreground mt-1 text-sm">@amara</p>
        </div>
        <div class="flex items-center gap-2">
          <Button variant="outline" size="sm">Edit profile</Button>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" size="icon" aria-label="More actions">
                <MoreHorizontal class="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Copy profile link</DropdownMenuItem>
              <DropdownMenuItem>Share…</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">Block user</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <p class="mt-4 text-sm">
        <span class="font-semibold">24</span> <span class="text-muted-foreground">Projects</span>
        <span class="font-semibold">1,248</span> <span class="text-muted-foreground">Followers</span>
        <span class="font-semibold">380</span> <span class="text-muted-foreground">Following</span>
      </p>

      <Tabs default-value="overview" class="mt-6 gap-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" class="space-y-6 pt-2">
          <p class="max-w-prose text-sm leading-relaxed">
            Design engineer focused on token systems and component architecture. Previously at a fintech startup, now
            building the shared UI language for Acme. Writes about OKLCH color and registry-driven workflows.
          </p>
          <Separator />
          <dl class="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            <div v-for="detail in details" :key="detail.label" class="flex items-center gap-3">
              <component :is="detail.icon" class="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
              <dt class="text-muted-foreground text-sm">{{ detail.label }}</dt>
              <dd class="ml-auto text-sm font-medium">{{ detail.value }}</dd>
            </div>
          </dl>
        </TabsContent>

        <TabsContent value="activity" class="pt-2">
          <ul class="divide-y">
            <li v-for="item in activity" :key="item.sentence" class="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <span class="bg-muted text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-md">
                <component :is="item.icon" class="size-4" aria-hidden="true" />
              </span>
              <p class="min-w-0 flex-1 truncate text-sm">{{ item.sentence }}</p>
              <time class="text-muted-foreground text-xs whitespace-nowrap">{{ item.time }}</time>
            </li>
          </ul>
        </TabsContent>

        <TabsContent value="projects" class="pt-2">
          <div class="grid gap-4 sm:grid-cols-2">
            <Card v-for="project in projects" :key="project.name">
              <CardHeader>
                <CardTitle class="text-sm font-medium">{{ project.name }}</CardTitle>
                <CardDescription class="truncate text-sm">{{ project.description }}</CardDescription>
              </CardHeader>
              <CardContent class="flex items-center gap-3">
                <Progress :model-value="project.progress" class="flex-1" />
                <span class="text-muted-foreground text-xs tabular-nums">{{ project.progress }}%</span>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>
