<script setup lang="ts">
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineDescription,
  TimelineItem,
  TimelineMedia,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline";
import {
  Bell,
  Calendar,
  Check,
  Circle,
  CircleDashed,
  ClipboardCheck,
  CreditCard,
  Database,
  FileText,
  GitCommit,
  GitMerge,
  GitPullRequest,
  ImageIcon,
  MessageSquare,
  Package,
  Rocket,
  AlertTriangle,
  Truck,
} from "lucide-vue-next";

const events = [
  { id: 1, title: "Project created", time: "May 1, 2026", icon: Rocket },
  { id: 2, title: "First commit pushed", time: "May 2, 2026", icon: GitCommit },
  {
    id: 3,
    title: "Documentation drafted",
    time: "May 3, 2026",
    icon: FileText,
  },
  {
    id: 4,
    title: "Public release scheduled",
    time: "May 5, 2026",
    icon: Calendar,
  },
];

const statuses = [
  {
    id: 1,
    title: "Build #482",
    desc: "Compiled in 38s",
    status: "success" as const,
    icon: Check,
  },
  {
    id: 2,
    title: "Build #483",
    desc: "Compiled in 42s",
    status: "success" as const,
    icon: Check,
  },
  {
    id: 3,
    title: "Build #484",
    desc: "Lint failed at app/utils.ts",
    status: "error" as const,
    icon: AlertTriangle,
  },
  {
    id: 4,
    title: "Build #485",
    desc: "Queued · waiting on runner",
    status: "warning" as const,
    icon: CircleDashed,
  },
];

const ship = [
  {
    id: 1,
    title: "Order placed",
    time: "May 1",
    icon: CreditCard,
    status: "success" as const,
  },
  {
    id: 2,
    title: "Packed",
    time: "May 2",
    icon: Package,
    status: "info" as const,
  },
  {
    id: 3,
    title: "Out for delivery",
    time: "May 3",
    icon: Truck,
    status: "current" as const,
  },
  {
    id: 4,
    title: "Delivered",
    time: "May 4",
    icon: Check,
    status: "muted" as const,
  },
];

const milestones = [
  { id: 1, title: "Q1 Kickoff", time: "Jan 2026", status: "success" as const },
  {
    id: 2,
    title: "MVP launched",
    time: "Mar 2026",
    status: "success" as const,
  },
  { id: 3, title: "GA release", time: "Jun 2026", status: "info" as const },
  { id: 4, title: "v2 planning", time: "Sep 2026", status: "muted" as const },
];

const compact = [
  { id: 1, title: "09:14 — Logged in from Chrome" },
  { id: 2, title: "09:22 — Created new workspace" },
  { id: 3, title: "09:31 — Invited 3 members" },
  { id: 4, title: "10:02 — Updated billing details" },
  { id: 5, title: "10:15 — Generated API key" },
];

const activity = [
  {
    id: 1,
    title: "opened pull request",
    user: "alice",
    time: "2h ago",
    icon: GitPullRequest,
    status: "info" as const,
  },
  {
    id: 2,
    title: "merged main into feature/x",
    user: "bob",
    time: "4h ago",
    icon: GitMerge,
    status: "success" as const,
  },
  {
    id: 3,
    title: "reviewed and approved",
    user: "carol",
    time: "6h ago",
    icon: Check,
    status: "success" as const,
  },
];

const activityFiles = [
  { name: "Project-Spec-v3.pdf", size: "1.9 MB", icon: FileText },
  { name: "Hero-mockups.zip", size: "18 KB", icon: FileText },
  { name: "Brand-system.css", size: "20 MB", icon: FileText },
];

const activityGallery = [
  { id: 1, label: "Concept A" },
  { id: 2, label: "Concept B" },
  { id: 3, label: "Concept C" },
];

const onboarding = [
  {
    id: 1,
    title: "Create your workspace",
    desc: "Pick a name and invite your team.",
    done: true,
  },
  {
    id: 2,
    title: "Connect a data source",
    desc: "Postgres, MySQL, or BigQuery.",
    done: true,
  },
  {
    id: 3,
    title: "Configure billing",
    desc: "Add a payment method to unlock production.",
    done: true,
  },
  {
    id: 4,
    title: "Invite your first member",
    desc: "Send a magic-link invitation by email.",
    done: false,
  },
  {
    id: 5,
    title: "Publish your first dashboard",
    desc: "Pick a template or start from scratch.",
    done: false,
  },
  {
    id: 6,
    title: "Set up alerts",
    desc: "Slack, email, or PagerDuty integrations.",
    done: false,
  },
];
</script>

<template>
  <Story
    title="Default"
    description="Vertical timeline with TimelineMedia (icon variant) and status colors. Connector auto-hides on the last item."
  >
    <Timeline class="max-w-md">
      <TimelineItem v-for="e in events" :key="e.id">
        <TimelineMedia variant="icon">
          <component :is="e.icon" />
        </TimelineMedia>
        <TimelineContent>
          <TimelineTitle>{{ e.title }}</TimelineTitle>
          <TimelineDate>{{ e.time }}</TimelineDate>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  </Story>

  <Story
    title="Status colors"
    description="Set status on TimelineItem (or directly on TimelineMedia) to color the marker per token: success, warning, error, info, muted."
  >
    <Timeline class="max-w-md">
      <TimelineItem v-for="s in statuses" :key="s.id" :status="s.status">
        <TimelineMedia variant="icon">
          <component :is="s.icon" />
        </TimelineMedia>
        <TimelineContent>
          <TimelineTitle>{{ s.title }}</TimelineTitle>
          <TimelineDescription>{{ s.desc }}</TimelineDescription>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  </Story>

  <Story
    title="Side: right"
    description="Move the rail to the right side with side='right' on Timeline."
  >
    <Timeline side="right" class="max-w-md">
      <TimelineItem v-for="s in ship" :key="s.id" :status="s.status">
        <TimelineMedia variant="icon">
          <component :is="s.icon" />
        </TimelineMedia>
        <TimelineContent>
          <TimelineTitle>{{ s.title }}</TimelineTitle>
          <TimelineDate>{{ s.time }}</TimelineDate>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  </Story>

  <Story
    title="Alternating (zigzag)"
    description="align='center' alternates content across the rail per item — classic milestones layout."
  >
    <Timeline align="center" class="max-w-2xl">
      <TimelineItem v-for="m in milestones" :key="m.id" :status="m.status">
        <TimelineMedia variant="dot" />
        <TimelineContent class="space-y-1">
          <TimelineTitle>{{ m.title }}</TimelineTitle>
          <TimelineDate>{{ m.time }}</TimelineDate>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  </Story>

  <Story
    title="Horizontal"
    description="direction='horizontal' threads the rail left-to-right; markers sit on top by default."
  >
    <Timeline direction="horizontal" class="w-full overflow-x-auto py-2">
      <TimelineItem
        v-for="s in ship"
        :key="s.id"
        :status="s.status"
        class="min-w-32"
      >
        <TimelineMedia variant="icon">
          <component :is="s.icon" />
        </TimelineMedia>
        <TimelineContent>
          <TimelineTitle>{{ s.title }}</TimelineTitle>
          <TimelineDate>{{ s.time }}</TimelineDate>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  </Story>

  <Story
    title="Avatar markers"
    description="variant='avatar' on TimelineMedia lets you slot in an image or initials for activity-feed style timelines."
  >
    <Timeline class="max-w-md">
      <TimelineItem v-for="a in activity" :key="a.id" :status="a.status">
        <TimelineMedia variant="icon">
          <component :is="a.icon" />
        </TimelineMedia>
        <TimelineContent>
          <div class="flex items-center gap-1.5 text-sm">
            <span class="font-semibold">{{ a.user }}</span>
            <span class="text-muted-foreground">{{ a.title }}</span>
          </div>
          <TimelineDate>{{ a.time }}</TimelineDate>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  </Story>

  <Story
    title="Compact density"
    description="density='compact' tightens row spacing for audit-log streams. Use TimelineSeparator for the smaller 16px marker."
  >
    <Timeline density="compact" class="max-w-md">
      <TimelineItem v-for="c in compact" :key="c.id">
        <TimelineSeparator />
        <TimelineContent>
          <p class="text-sm">{{ c.title }}</p>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  </Story>

  <Story
    title="Comfortable density"
    description="density='comfortable' adds breathing room for sparse milestone-style timelines."
  >
    <Timeline density="comfortable" class="max-w-md">
      <TimelineItem v-for="e in events.slice(0, 3)" :key="e.id">
        <TimelineMedia variant="icon">
          <component :is="e.icon" />
        </TimelineMedia>
        <TimelineContent>
          <TimelineTitle>{{ e.title }}</TimelineTitle>
          <TimelineDate>{{ e.time }}</TimelineDate>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  </Story>

  <Story
    title="Mixed content"
    description="Rich event entries combining title, paragraph, and inline action buttons."
  >
    <Timeline class="max-w-lg">
      <TimelineItem status="info">
        <TimelineMedia variant="icon"><Rocket /></TimelineMedia>
        <TimelineContent>
          <TimelineDate>May 1, 2026 · 09:14</TimelineDate>
          <TimelineTitle>v2.0 released</TimelineTitle>
          <TimelineDescription>
            Major release with the new theming engine, 12 new components, and
            improved CLI ergonomics.
          </TimelineDescription>
          <div class="flex gap-2 pt-1">
            <Button size="sm" variant="outline">Read changelog</Button>
            <Button size="sm" variant="ghost">Dismiss</Button>
          </div>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem status="success">
        <TimelineMedia variant="icon"><GitCommit /></TimelineMedia>
        <TimelineContent>
          <TimelineDate>May 2, 2026 · 14:02</TimelineDate>
          <TimelineTitle>Pull request merged</TimelineTitle>
          <TimelineDescription>
            feat(carousel): add vertical orientation and indicator pagination ·
            #248
          </TimelineDescription>
          <div class="flex gap-2 pt-1">
            <Button size="sm" variant="outline">View PR</Button>
          </div>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineMedia variant="icon"><FileText /></TimelineMedia>
        <TimelineContent>
          <TimelineDate>May 3, 2026 · 11:30</TimelineDate>
          <TimelineTitle>Docs updated</TimelineTitle>
          <TimelineDescription>
            Component preview pages now extract demo source automatically with
            the Story block format.
          </TimelineDescription>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  </Story>

  <Story
    title="Activity feed (day-grouped)"
    description="Day-grouped feed with filter tabs and heterogeneous entry types (text event, task with badge + assignees, file list, image gallery, notification with CTA). Each day is its own Timeline so the connector line breaks cleanly under each header."
  >
    <div class="max-w-2xl space-y-6">
      <Tabs default-value="today">
        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="year">2026</TabsTrigger>
        </TabsList>
      </Tabs>

      <div>
        <h3 class="text-foreground mb-4 text-sm font-semibold">Jan 23, 2026</h3>
        <Timeline>
          <TimelineItem status="info">
            <TimelineMedia variant="icon"><MessageSquare /></TimelineMedia>
            <TimelineContent>
              <div class="flex items-center gap-2 text-sm">
                <span class="font-semibold">Meeting with customer</span>
                <span class="text-muted-foreground">· 10:45 AM</span>
              </div>
              <TimelineDescription
                >Discussed Q2 onboarding flow with Robert
                Fox.</TimelineDescription
              >
              <div class="flex items-center gap-2 pt-1">
                <Avatar class="size-6"
                  ><AvatarFallback>RF</AvatarFallback></Avatar
                >
                <span class="text-muted-foreground text-xs">Robert Fox</span>
              </div>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineMedia variant="icon"><ClipboardCheck /></TimelineMedia>
            <TimelineContent>
              <div class="flex items-center gap-2">
                <TimelineTitle>Project Delivery Preparation</TimelineTitle>
                <Badge variant="secondary">In Progress</Badge>
              </div>
              <TimelineDescription
                >CRM Project deliverables and pre-flight
                checklist.</TimelineDescription
              >
              <div class="flex items-center justify-between pt-1">
                <div class="flex -space-x-2">
                  <Avatar class="ring-background size-6 ring-2"
                    ><AvatarFallback>AB</AvatarFallback></Avatar
                  >
                  <Avatar class="ring-background size-6 ring-2"
                    ><AvatarFallback>CD</AvatarFallback></Avatar
                  >
                  <Avatar class="ring-background size-6 ring-2"
                    ><AvatarFallback>EF</AvatarFallback></Avatar
                  >
                </div>
                <Badge variant="outline">CRM</Badge>
              </div>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineMedia variant="icon"><FileText /></TimelineMedia>
            <TimelineContent>
              <TimelineTitle>3 files were uploaded</TimelineTitle>
              <ul class="mt-1 space-y-1.5">
                <li
                  v-for="f in activityFiles"
                  :key="f.name"
                  class="border-border bg-muted/40 flex items-center justify-between rounded-md border px-3 py-1.5 text-sm"
                >
                  <span class="flex items-center gap-2">
                    <component
                      :is="f.icon"
                      class="text-muted-foreground size-4"
                    />
                    <span class="font-medium">{{ f.name }}</span>
                  </span>
                  <span class="text-muted-foreground text-xs">{{
                    f.size
                  }}</span>
                </li>
              </ul>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </div>

      <div>
        <h3 class="text-foreground mb-4 text-sm font-semibold">Jan 22, 2026</h3>
        <Timeline>
          <TimelineItem status="muted">
            <TimelineMedia variant="icon"><ImageIcon /></TimelineMedia>
            <TimelineContent>
              <TimelineTitle>3 new design concepts shared</TimelineTitle>
              <TimelineDescription
                >Explore the homepage and dashboard
                explorations.</TimelineDescription
              >
              <div class="grid grid-cols-3 gap-2 pt-2">
                <div
                  v-for="img in activityGallery"
                  :key="img.id"
                  class="border-border bg-muted/50 text-muted-foreground flex aspect-video items-center justify-center rounded-md border text-xs font-medium"
                >
                  {{ img.label }}
                </div>
              </div>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem status="success">
            <TimelineMedia variant="icon"><Database /></TimelineMedia>
            <TimelineContent>
              <TimelineTitle>Database Backup Process Completed!</TimelineTitle>
              <TimelineDescription>
                All workspace snapshots are now mirrored to the EU region.
              </TimelineDescription>
              <div class="pt-1">
                <Button size="sm" variant="outline">Proceed</Button>
              </div>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem status="info">
            <TimelineMedia variant="icon"><Bell /></TimelineMedia>
            <TimelineContent>
              <div class="text-sm">
                <span class="font-semibold">New case #67890</span>
                <span class="text-muted-foreground"> assigned to </span>
                <span class="font-semibold">Cody Fisher</span>
              </div>
              <TimelineDate>02:14 PM</TimelineDate>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </div>
    </div>
  </Story>

  <Story
    title="Checklist (done / pending)"
    description="Map a boolean state to status: done items use status='success' (green) with a Check icon, pending items use status='muted' (gray) with an outlined Circle. Opt in to `colored-connector` on TimelineMedia so the line below each marker adopts the same status color — done rows get a green connector, pending rows get a muted one."
  >
    <Timeline class="max-w-lg">
      <TimelineItem
        v-for="item in onboarding"
        :key="item.id"
        :status="item.done ? 'success' : 'muted'"
      >
        <TimelineMedia variant="icon" colored-connector>
          <Check v-if="item.done" />
          <Circle v-else />
        </TimelineMedia>
        <TimelineContent>
          <div class="flex items-center gap-2">
            <TimelineTitle
              :class="item.done && 'text-muted-foreground line-through'"
            >
              {{ item.title }}
            </TimelineTitle>
            <Badge
              :variant="item.done ? 'secondary' : 'outline'"
              class="text-xs"
            >
              {{ item.done ? "Done" : "Pending" }}
            </Badge>
          </div>
          <TimelineDescription>{{ item.desc }}</TimelineDescription>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  </Story>
</template>
