import Story from "../../components/story/Story";
import { Avatar, AvatarFallback } from "@react-registry/avatar";
import { Badge } from "@react-registry/badge";
import { Button } from "@react-registry/button";
import { Card, CardContent, CardHeader, CardTitle } from "@react-registry/card";
import { Tabs, TabsList, TabsTrigger } from "@react-registry/tabs";
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineDescription,
  TimelineHeader,
  TimelineItem,
  TimelineMedia,
  TimelineSeparator,
  TimelineTitle,
} from "@react-registry/timeline";
import {
  AlertTriangle,
  Bell,
  Calendar,
  Check,
  Circle,
  CircleDashed,
  CircleDot,
  ClipboardCheck,
  Clock,
  CreditCard,
  Database,
  ExternalLink,
  FileText,
  GitCommit,
  GitMerge,
  GitPullRequest,
  ImageIcon,
  MessageSquare,
  Package,
  Rocket,
  Truck,
} from "lucide-react";

const releaseEvents = [
  {
    id: 1,
    title: "Release v2.4.0 tagged",
    time: "12m ago",
    desc: "Tagged on main and artifacts pushed to staging registry.",
  },
  {
    id: 2,
    title: "Automated test suites passed",
    time: "35m ago",
    desc: "All 84 unit, integration, and cross-framework parity tests passed.",
  },
  {
    id: 3,
    title: "Security audit cleared",
    time: "50m ago",
    desc: "Static analysis and dependency vulnerability scan cleared with 0 findings.",
  },
  {
    id: 4,
    title: "Pull request approved",
    time: "1h ago",
    desc: "Changes reviewed and signed off by core platform maintainers.",
  },
];

const deploymentStages = [
  {
    id: 1,
    title: "Commit pushed to main",
    time: "10:14 AM",
    desc: "feat(auth): enable WebAuthn biometric passkey authentication",
    icon: GitCommit,
  },
  {
    id: 2,
    title: "Pull request merged",
    time: "10:18 AM",
    desc: "PR #892 merged into main with 3 approvals",
    icon: GitPullRequest,
  },
  {
    id: 3,
    title: "Container image packaged",
    time: "10:22 AM",
    desc: "Docker image built and pushed digest to registry",
    icon: Package,
  },
  {
    id: 4,
    title: "Production deploy completed",
    time: "10:25 AM",
    desc: "Live traffic switched across all 18 edge CDN clusters",
    icon: Check,
  },
];

const pipelineStages = [
  {
    id: 1,
    title: "Static Analysis & Lint",
    desc: "ESLint and TypeScript strict typechecks passed",
    time: "14s",
    status: "success" as const,
    icon: Check,
  },
  {
    id: 2,
    title: "Automated Test Suites",
    desc: "128 unit and browser integration tests completed",
    time: "38s",
    status: "success" as const,
    icon: Check,
  },
  {
    id: 3,
    title: "Container Image Build",
    desc: "Compiling multi-arch Docker image (layer 8/12)",
    time: "In progress",
    status: "current" as const,
    icon: CircleDot,
  },
  {
    id: 4,
    title: "Canary Rollout (10%)",
    desc: "Queued behind container build completion",
    time: "Pending",
    status: "muted" as const,
    icon: Circle,
  },
];

const statuses = [
  {
    id: 1,
    title: "Build #482",
    desc: "Compiled successfully in 38s",
    status: "success" as const,
    icon: Check,
  },
  {
    id: 2,
    title: "Build #483",
    desc: "Integration test passed in 42s",
    status: "info" as const,
    icon: Check,
  },
  {
    id: 3,
    title: "Build #484",
    desc: "Lint check failed at app/utils.ts",
    status: "error" as const,
    icon: AlertTriangle,
  },
  {
    id: 4,
    title: "Build #485",
    desc: "Worker runner high memory load",
    status: "warning" as const,
    icon: CircleDashed,
  },
  {
    id: 5,
    title: "Build #486",
    desc: "Queued · waiting for runner slot",
    status: "muted" as const,
    icon: Clock,
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
  {
    id: 1,
    title: "Q1 2026 — Core Architecture",
    time: "Jan 2026",
    desc: "Distributed runtime RFC approved and core system interfaces defined.",
  },
  {
    id: 2,
    title: "Q2 2026 — Developer Preview",
    time: "Apr 2026",
    desc: "First cohort of 50 enterprise design partners onboarded to SDK.",
  },
  {
    id: 3,
    title: "Q3 2026 — Multi-Region Availability",
    time: "Jul 2026",
    desc: "Zero-downtime replication active across US, EU, and APAC clusters.",
  },
  {
    id: 4,
    title: "Q4 2026 — General Availability",
    time: "Oct 2026",
    desc: "Public launch with self-service signups and enterprise SLA.",
  },
];

const auditLogs = [
  {
    id: 1,
    time: "14:22:05",
    event: "API secret key rotated for staging-worker",
  },
  { id: 2, time: "14:18:40", event: "User permissions updated for admin_812" },
  { id: 3, time: "14:05:12", event: "SSO session authenticated via Okta" },
  {
    id: 4,
    time: "13:52:19",
    event: "Webhook endpoint verified: /api/v1/billing",
  },
  { id: 5, time: "13:40:02", event: "IP whitelist rule updated for eu-west-1" },
];

const activityMembers = [
  {
    id: 1,
    user: "Sarah Chen",
    initials: "SC",
    action: "opened pull request #402",
    time: "12m ago",
    detail:
      "feat(tokens): add support for OKLCH color spaces and dynamic contrast clamping",
  },
  {
    id: 2,
    user: "Marcus Vance",
    initials: "MV",
    action: "approved pull request with comments",
    time: "8m ago",
    detail:
      "Verified visual rendering and responsive layout across desktop and mobile.",
  },
  {
    id: 3,
    user: "Elena Rostova",
    initials: "ER",
    action: "merged into main and generated changelog",
    time: "Just now",
    detail: "Tagged v2.4.1 release candidate and published to edge nodes.",
  },
];

const roadmapEvents = [
  {
    id: 1,
    title: "Project Kickoff",
    time: "Jan 15, 2026",
    desc: "Scope alignment & team ramp-up",
    icon: Calendar,
  },
  {
    id: 2,
    title: "Internal Beta Testing",
    time: "Feb 20, 2026",
    desc: "Dogfooding with internal teams",
    icon: GitCommit,
  },
  {
    id: 3,
    title: "Security Audit & Compliance",
    time: "Mar 10, 2026",
    desc: "SOC2 Type II sign-off",
    icon: Check,
  },
];

const onboarding = [
  {
    id: 1,
    title: "Create your workspace",
    desc: "Pick a name and invite your core team.",
    done: true,
  },
  {
    id: 2,
    title: "Connect a data source",
    desc: "PostgreSQL, MySQL, or ClickHouse data warehouse.",
    done: true,
  },
  {
    id: 3,
    title: "Configure billing",
    desc: "Add a payment method to unlock production quotas.",
    done: true,
  },
  {
    id: 4,
    title: "Invite your first member",
    desc: "Send a magic-link invitation via email.",
    done: false,
  },
  {
    id: 5,
    title: "Publish your first dashboard",
    desc: "Pick a template or start from blank canvas.",
    done: false,
  },
  {
    id: 6,
    title: "Set up alerts",
    desc: "Configure Slack, email, or PagerDuty webhooks.",
    done: false,
  },
];

const activityFiles = [
  { name: "Project-Spec-v3.pdf", size: "1.9 MB", icon: FileText },
  { name: "Hero-mockups.zip", size: "18 KB", icon: FileText },
  { name: "Brand-system.css", size: "20 KB", icon: FileText },
];

const activityGallery = [
  { id: 1, label: "Concept A" },
  { id: 2, label: "Concept B" },
  { id: 3, label: "Concept C" },
];

export default function TimelineDemo() {
  return (
    <>
      <Story
        title="Default"
        description="Chronological event rail with minimalist dot markers and dynamic connector lines."
      >
        <Timeline className="max-w-md">
          {releaseEvents.map((e) => (
            <TimelineItem key={e.id}>
              <TimelineMedia />
              <TimelineContent>
                <TimelineHeader>
                  <TimelineTitle>{e.title}</TimelineTitle>
                  <TimelineDate>{e.time}</TimelineDate>
                </TimelineHeader>
                <TimelineDescription>{e.desc}</TimelineDescription>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Story>

      <Story
        title="Icon markers"
        description="Framed icon markers for categorical event feeds such as deployment and release workflows."
      >
        <Timeline className="max-w-md">
          {deploymentStages.map((s) => {
            const Icon = s.icon;
            return (
              <TimelineItem key={s.id}>
                <TimelineMedia variant="icon">
                  <Icon />
                </TimelineMedia>
                <TimelineContent>
                  <TimelineHeader>
                    <TimelineTitle>{s.title}</TimelineTitle>
                    <TimelineDate>{s.time}</TimelineDate>
                  </TimelineHeader>
                  <TimelineDescription>{s.desc}</TimelineDescription>
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      </Story>

      <Story
        title="Status indicators"
        description="Semantic status markers (success, current, muted) with subtle tonal accents for CI/CD pipelines."
      >
        <Timeline className="max-w-md">
          {pipelineStages.map((p) => {
            const Icon = p.icon;
            return (
              <TimelineItem key={p.id} status={p.status}>
                <TimelineMedia variant="icon">
                  <Icon />
                </TimelineMedia>
                <TimelineContent>
                  <TimelineHeader>
                    <TimelineTitle>{p.title}</TimelineTitle>
                    <Badge
                      variant={
                        p.status === "success"
                          ? "secondary"
                          : p.status === "current"
                            ? "default"
                            : "outline"
                      }
                      className="text-xs"
                    >
                      {p.time}
                    </Badge>
                  </TimelineHeader>
                  <TimelineDescription>{p.desc}</TimelineDescription>
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      </Story>

      <Story
        title="Status colors"
        description="Set status on TimelineItem (or TimelineMedia) to color the marker per token: success, info, warning, error, muted."
      >
        <Timeline className="max-w-md">
          {statuses.map((s) => {
            const Icon = s.icon;
            return (
              <TimelineItem key={s.id} status={s.status}>
                <TimelineMedia variant="icon">
                  <Icon />
                </TimelineMedia>
                <TimelineContent>
                  <TimelineTitle>{s.title}</TimelineTitle>
                  <TimelineDescription>{s.desc}</TimelineDescription>
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      </Story>

      <Story
        title="Side: right"
        description="Move the rail to the right side with side='right' on Timeline."
      >
        <Timeline side="right" className="max-w-md">
          {ship.map((s) => {
            const Icon = s.icon;
            return (
              <TimelineItem key={s.id} status={s.status}>
                <TimelineMedia variant="icon">
                  <Icon />
                </TimelineMedia>
                <TimelineContent>
                  <TimelineTitle>{s.title}</TimelineTitle>
                  <TimelineDate>{s.time}</TimelineDate>
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      </Story>

      <Story
        title="Alternating sides"
        description="align='center' alternates milestone entries across a centered thread."
      >
        <Timeline align="center" className="max-w-2xl">
          {milestones.map((m) => (
            <TimelineItem key={m.id}>
              <TimelineMedia variant="dot" />
              <TimelineContent className="space-y-1">
                <TimelineTitle>{m.title}</TimelineTitle>
                <TimelineDate>{m.time}</TimelineDate>
                <TimelineDescription>{m.desc}</TimelineDescription>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Story>

      <Story
        title="Horizontal"
        description="direction='horizontal' lays out lifecycle stages left-to-right for fulfillment and order tracking."
      >
        <Timeline
          direction="horizontal"
          className="w-full overflow-x-auto py-2"
        >
          {ship.map((step) => {
            const Icon = step.icon;
            return (
              <TimelineItem
                key={step.id}
                status={step.status}
                className="min-w-36"
              >
                <TimelineMedia variant="icon">
                  <Icon />
                </TimelineMedia>
                <TimelineContent>
                  <TimelineTitle className="text-xs font-semibold">
                    {step.title}
                  </TimelineTitle>
                  <TimelineDate className="text-xs">{step.time}</TimelineDate>
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      </Story>

      <Story
        title="Avatar markers"
        description="variant='avatar' on TimelineMedia embeds team member avatars for collaboration audit feeds."
      >
        <Timeline className="max-w-lg">
          {activityMembers.map((m) => (
            <TimelineItem key={m.id}>
              <TimelineMedia variant="avatar">
                <Avatar className="size-8">
                  <AvatarFallback className="text-xs font-medium">
                    {m.initials}
                  </AvatarFallback>
                </Avatar>
              </TimelineMedia>
              <TimelineContent>
                <TimelineHeader>
                  <div className="flex items-center gap-1.5 text-sm">
                    <span className="font-semibold">{m.user}</span>
                    <span className="text-muted-foreground">{m.action}</span>
                  </div>
                  <TimelineDate>{m.time}</TimelineDate>
                </TimelineHeader>
                <TimelineDescription>{m.detail}</TimelineDescription>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Story>

      <Story
        title="Compact density"
        description="density='compact' tightens row height for dense audit logs and security telemetry feeds."
      >
        <Timeline density="compact" className="max-w-md">
          {auditLogs.map((log) => (
            <TimelineItem key={log.id}>
              <TimelineSeparator />
              <TimelineContent>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground font-mono">
                    {log.time}
                  </span>
                  <span className="text-foreground">{log.event}</span>
                </div>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Story>

      <Story
        title="Comfortable density"
        description="density='comfortable' adds breathing room for sparse milestone-style timelines."
      >
        <Timeline density="comfortable" className="max-w-md">
          {roadmapEvents.map((r) => {
            const Icon = r.icon;
            return (
              <TimelineItem key={r.id}>
                <TimelineMedia variant="icon">
                  <Icon />
                </TimelineMedia>
                <TimelineContent>
                  <TimelineTitle>{r.title}</TimelineTitle>
                  <TimelineDate>{r.time}</TimelineDate>
                  <TimelineDescription>{r.desc}</TimelineDescription>
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      </Story>

      <Story
        title="Outline marker & dashed connector"
        description="Combine TimelineHeader for aligned titles/badges with variant='outline' markers and line-style='dashed' connectors."
      >
        <Timeline className="max-w-lg">
          <TimelineItem status="success">
            <TimelineMedia variant="outline" lineStyle="dashed">
              <Check />
            </TimelineMedia>
            <TimelineContent>
              <TimelineHeader>
                <TimelineTitle>Specification Approved</TimelineTitle>
                <Badge variant="outline" className="text-xs">
                  Phase 1
                </Badge>
              </TimelineHeader>
              <TimelineDate>September 15, 2026</TimelineDate>
              <TimelineDescription>
                System architecture and OpenAPI spec signed off by engineering
                leads.
              </TimelineDescription>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem status="info">
            <TimelineMedia variant="outline" lineStyle="dashed">
              <GitCommit />
            </TimelineMedia>
            <TimelineContent>
              <TimelineHeader>
                <TimelineTitle>Alpha Deployment</TimelineTitle>
                <Badge variant="secondary" className="text-xs">
                  In Progress
                </Badge>
              </TimelineHeader>
              <TimelineDate>September 18, 2026</TimelineDate>
              <TimelineDescription>
                Continuous integration runner deployed artifacts to staging
                sandbox for QA smoke tests.
              </TimelineDescription>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem status="muted">
            <TimelineMedia variant="outline" lineStyle="dashed">
              <Rocket />
            </TimelineMedia>
            <TimelineContent>
              <TimelineHeader>
                <TimelineTitle>Production Rollout</TimelineTitle>
                <Badge variant="outline" className="text-xs">
                  Scheduled
                </Badge>
              </TimelineHeader>
              <TimelineDate>October 1, 2026</TimelineDate>
              <TimelineDescription>
                Canary release at 10% traffic threshold before universal
                cutover.
              </TimelineDescription>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </Story>

      <Story
        title="Checklist (done / pending)"
        description="Map a boolean state to status: done items use status='success' with a Check icon, pending items use status='muted' with an outlined Circle. Opt in to colored-connector on TimelineMedia so the connector line adopts the item status color."
      >
        <Timeline className="max-w-lg">
          {onboarding.map((item) => (
            <TimelineItem
              key={item.id}
              status={item.done ? "success" : "muted"}
            >
              <TimelineMedia variant="icon" coloredConnector>
                {item.done ? <Check /> : <Circle />}
              </TimelineMedia>
              <TimelineContent>
                <div className="flex items-center gap-2">
                  <TimelineTitle
                    className={
                      item.done
                        ? "text-muted-foreground line-through"
                        : undefined
                    }
                  >
                    {item.title}
                  </TimelineTitle>
                  <Badge
                    variant={item.done ? "secondary" : "outline"}
                    className="text-xs"
                  >
                    {item.done ? "Done" : "Pending"}
                  </Badge>
                </div>
                <TimelineDescription>{item.desc}</TimelineDescription>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Story>

      <Story
        title="Mixed content"
        description="Rich event entries combining title, paragraph, and inline action buttons."
      >
        <Timeline className="max-w-lg">
          <TimelineItem status="info">
            <TimelineMedia variant="icon">
              <Rocket />
            </TimelineMedia>
            <TimelineContent>
              <TimelineDate>May 1, 2026 · 09:14</TimelineDate>
              <TimelineTitle>v2.0 released</TimelineTitle>
              <TimelineDescription>
                Major release with the new theming engine, 12 new components,
                and improved CLI ergonomics.
              </TimelineDescription>
              <div className="flex gap-2 pt-1">
                <Button size="sm" variant="outline">
                  Read changelog
                </Button>
                <Button size="sm" variant="ghost">
                  Dismiss
                </Button>
              </div>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem status="success">
            <TimelineMedia variant="icon">
              <GitCommit />
            </TimelineMedia>
            <TimelineContent>
              <TimelineDate>May 2, 2026 · 14:02</TimelineDate>
              <TimelineTitle>Pull request merged</TimelineTitle>
              <TimelineDescription>
                feat(carousel): add vertical orientation and indicator
                pagination · #248
              </TimelineDescription>
              <div className="flex gap-2 pt-1">
                <Button size="sm" variant="outline">
                  View PR
                </Button>
              </div>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineMedia variant="icon">
              <FileText />
            </TimelineMedia>
            <TimelineContent>
              <TimelineDate>May 3, 2026 · 11:30</TimelineDate>
              <TimelineTitle>Docs updated</TimelineTitle>
              <TimelineDescription>
                Component preview pages now extract demo source automatically
                with the Story block format.
              </TimelineDescription>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </Story>

      <Story
        title="Activity feed (day-grouped)"
        description="Day-grouped feed with filter tabs and heterogeneous entry types (text event, task with badge + assignees, file list, image gallery, notification with CTA). Each day is its own Timeline so the connector line breaks cleanly under each header."
      >
        <div className="max-w-2xl space-y-6">
          <Tabs defaultValue="today">
            <TabsList>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">2026</TabsTrigger>
            </TabsList>
          </Tabs>

          <div>
            <h3 className="text-foreground mb-4 text-sm font-semibold">
              Jan 23, 2026
            </h3>
            <Timeline>
              <TimelineItem status="info">
                <TimelineMedia variant="icon">
                  <MessageSquare />
                </TimelineMedia>
                <TimelineContent>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold">Meeting with customer</span>
                    <span className="text-muted-foreground">· 10:45 AM</span>
                  </div>
                  <TimelineDescription>
                    Discussed Q2 onboarding flow with Robert Fox.
                  </TimelineDescription>
                  <div className="flex items-center gap-2 pt-1">
                    <Avatar className="size-6">
                      <AvatarFallback>RF</AvatarFallback>
                    </Avatar>
                    <span className="text-muted-foreground text-xs">
                      Robert Fox
                    </span>
                  </div>
                </TimelineContent>
              </TimelineItem>

              <TimelineItem>
                <TimelineMedia variant="icon">
                  <ClipboardCheck />
                </TimelineMedia>
                <TimelineContent>
                  <div className="flex items-center gap-2">
                    <TimelineTitle>Project Delivery Preparation</TimelineTitle>
                    <Badge variant="secondary">In Progress</Badge>
                  </div>
                  <TimelineDescription>
                    CRM Project deliverables and pre-flight checklist.
                  </TimelineDescription>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex -space-x-2">
                      <Avatar className="ring-background size-6 ring-2">
                        <AvatarFallback>AB</AvatarFallback>
                      </Avatar>
                      <Avatar className="ring-background size-6 ring-2">
                        <AvatarFallback>CD</AvatarFallback>
                      </Avatar>
                      <Avatar className="ring-background size-6 ring-2">
                        <AvatarFallback>EF</AvatarFallback>
                      </Avatar>
                    </div>
                    <Badge variant="outline">CRM</Badge>
                  </div>
                </TimelineContent>
              </TimelineItem>

              <TimelineItem>
                <TimelineMedia variant="icon">
                  <FileText />
                </TimelineMedia>
                <TimelineContent>
                  <TimelineTitle>3 files were uploaded</TimelineTitle>
                  <ul className="mt-1 space-y-1.5">
                    {activityFiles.map((f) => {
                      const Icon = f.icon;
                      return (
                        <li
                          key={f.name}
                          className="border-border bg-muted/40 flex items-center justify-between rounded-md border px-3 py-1.5 text-sm"
                        >
                          <span className="flex items-center gap-2">
                            <Icon className="text-muted-foreground size-4" />
                            <span className="font-medium">{f.name}</span>
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {f.size}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </TimelineContent>
              </TimelineItem>
            </Timeline>
          </div>

          <div>
            <h3 className="text-foreground mb-4 text-sm font-semibold">
              Jan 22, 2026
            </h3>
            <Timeline>
              <TimelineItem status="muted">
                <TimelineMedia variant="icon">
                  <ImageIcon />
                </TimelineMedia>
                <TimelineContent>
                  <TimelineTitle>3 new design concepts shared</TimelineTitle>
                  <TimelineDescription>
                    Explore the homepage and dashboard explorations.
                  </TimelineDescription>
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    {activityGallery.map((img) => (
                      <div
                        key={img.id}
                        className="border-border bg-muted/50 text-muted-foreground flex aspect-video items-center justify-center rounded-md border text-xs font-medium"
                      >
                        {img.label}
                      </div>
                    ))}
                  </div>
                </TimelineContent>
              </TimelineItem>

              <TimelineItem status="success">
                <TimelineMedia variant="icon">
                  <Database />
                </TimelineMedia>
                <TimelineContent>
                  <TimelineTitle>
                    Database Backup Process Completed!
                  </TimelineTitle>
                  <TimelineDescription>
                    All workspace snapshots are now mirrored to the EU region.
                  </TimelineDescription>
                  <div className="pt-1">
                    <Button size="sm" variant="outline">
                      Proceed
                    </Button>
                  </div>
                </TimelineContent>
              </TimelineItem>

              <TimelineItem status="info">
                <TimelineMedia variant="icon">
                  <Bell />
                </TimelineMedia>
                <TimelineContent>
                  <div className="text-sm">
                    <span className="font-semibold">New case #67890</span>
                    <span className="text-muted-foreground"> assigned to </span>
                    <span className="font-semibold">Cody Fisher</span>
                  </div>
                  <TimelineDate>02:14 PM</TimelineDate>
                </TimelineContent>
              </TimelineItem>
            </Timeline>
          </div>
        </div>
      </Story>

      <Story
        title="Rich content cards"
        description="Nest cards and action triggers inside timeline items for detailed changelogs or incident post-mortems."
      >
        <Timeline className="max-w-lg">
          <TimelineItem status="success">
            <TimelineMedia variant="icon">
              <Check />
            </TimelineMedia>
            <TimelineContent>
              <TimelineHeader>
                <TimelineTitle>Version 2.4.0 Released</TimelineTitle>
                <Badge variant="secondary">Production</Badge>
              </TimelineHeader>
              <TimelineDate>September 20, 2026 · 11:30 AM</TimelineDate>
              <Card className="mt-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Core Enhancements
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-1.5 text-xs">
                  <p>
                    • Added dual-framework timeline and calendar components.
                  </p>
                  <p>• Calibrated optical alignment on dot and icon markers.</p>
                  <p>
                    • Clean monochromatic surfaces across light and dark modes.
                  </p>
                  <div className="pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 gap-1.5 text-xs"
                    >
                      View changelog
                      <ExternalLink className="size-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem status="muted">
            <TimelineMedia variant="icon">
              <Circle />
            </TimelineMedia>
            <TimelineContent>
              <TimelineHeader>
                <TimelineTitle>Scheduled Database Maintenance</TimelineTitle>
                <Badge variant="outline">Upcoming</Badge>
              </TimelineHeader>
              <TimelineDate>September 22, 2026 · 02:00 AM UTC</TimelineDate>
              <TimelineDescription>
                Zero-downtime replication failover to warm standby nodes in the
                secondary availability zone.
              </TimelineDescription>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </Story>
    </>
  );
}
