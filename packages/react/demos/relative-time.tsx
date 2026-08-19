import Story from "../../components/story/Story";
import { cn } from "@/lib/utils";
import { RelativeTime } from "@react-registry/relative-time";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@react-registry/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@react-registry/table";
import { Avatar, AvatarFallback } from "@react-registry/avatar";
import { Badge } from "@react-registry/badge";
import { Chip } from "@react-registry/chip";
import { Kbd } from "@react-registry/kbd";
import {
  AlertCircle,
  Clock,
  GitCommit,
  Globe,
  RefreshCw,
  UserCheck,
} from "lucide-react";

const now = new Date("2026-08-14T12:00:00.000Z");

const users = [
  {
    id: "usr_01",
    name: "Maya Chen",
    email: "maya.chen@acme.corp",
    initials: "MC",
    role: "Admin",
    status: "active" as const,
    createdAt: "2026-08-14T10:15:00.000Z",
    lastActive: "2026-08-14T11:58:00.000Z",
  },
  {
    id: "usr_02",
    name: "Omar Farid",
    email: "omar.f@acme.corp",
    initials: "OF",
    role: "Engineer",
    status: "active" as const,
    createdAt: "2026-08-13T14:30:00.000Z",
    lastActive: "2026-08-14T09:40:00.000Z",
  },
  {
    id: "usr_03",
    name: "Priya Shah",
    email: "priya.s@acme.corp",
    initials: "PS",
    role: "Designer",
    status: "away" as const,
    createdAt: "2026-08-07T08:00:00.000Z",
    lastActive: "2026-08-13T16:20:00.000Z",
  },
  {
    id: "usr_04",
    name: "Leo Park",
    email: "leo.park@acme.corp",
    initials: "LP",
    role: "Member",
    status: "offline" as const,
    createdAt: "2026-07-12T11:00:00.000Z",
    lastActive: "2026-08-01T15:10:00.000Z",
  },
];

const commits = [
  {
    hash: "7a2f1b4",
    message: "fix(auth): handle expired refresh tokens gracefully",
    author: "maya",
    time: "2026-08-14T11:42:00.000Z",
  },
  {
    hash: "c89e023",
    message: "feat(billing): add stripe webhook verification",
    author: "omar",
    time: "2026-08-14T08:15:00.000Z",
  },
  {
    hash: "419d8ea",
    message: "chore(deps): bump tailwindcss from 4.2 to 4.3",
    author: "renovate",
    time: "2026-08-13T22:00:00.000Z",
  },
  {
    hash: "9d3a1f8",
    message: "docs(api): update rate limiting headers specification",
    author: "priya",
    time: "2026-08-07T14:30:00.000Z",
  },
];

const scheduledJobs = [
  {
    name: "Database backup",
    nextRun: "2026-08-14T12:20:00.000Z",
    sla: "normal" as const,
  },
  {
    name: "Weekly analytics sync",
    nextRun: "2026-08-15T00:00:00.000Z",
    sla: "normal" as const,
  },
  {
    name: "Invoice consolidation",
    nextRun: "2026-08-17T09:00:00.000Z",
    sla: "urgent" as const,
  },
  {
    name: "Quarterly compliance audit",
    nextRun: "2026-09-01T00:00:00.000Z",
    sla: "normal" as const,
  },
];

const auditEvents = [
  {
    id: 1,
    action: "API key created",
    target: "prod_read_only",
    actor: "Maya Chen",
    time: "2026-08-14T11:55:00.000Z",
    badge: "Security",
  },
  {
    id: 2,
    action: "Billing plan changed",
    target: "Team → Enterprise",
    actor: "Priya Shah",
    time: "2026-08-14T09:12:00.000Z",
    badge: "Billing",
  },
  {
    id: 3,
    action: "Member invited",
    target: "alex.k@acme.corp",
    actor: "Maya Chen",
    time: "2026-08-13T17:00:00.000Z",
    badge: "Team",
  },
  {
    id: 4,
    action: "SSO enforced",
    target: "Google Workspace",
    actor: "System",
    time: "2026-08-01T00:00:00.000Z",
    badge: "Security",
  },
];

const globalRelease = "2026-08-14T15:30:00.000Z";

export default function RelativeTimeDemo() {
  return (
    <>
      <Story
        title="User directory table"
        description="Created and last-active columns in a user directory table. Hover any timestamp for the full localized datetime."
      >
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Last active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar size="sm">
                        <AvatarFallback>{u.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{u.name}</p>
                        <p className="text-muted-foreground text-xs">
                          {u.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
                      <span
                        className={cn(
                          "size-1.5 rounded-full",
                          u.status === "active"
                            ? "bg-emerald-500"
                            : u.status === "away"
                              ? "bg-amber-500"
                              : "bg-muted-foreground",
                        )}
                      />
                      <span>
                        {u.status === "active"
                          ? "Active"
                          : u.status === "away"
                            ? "Away"
                            : "Offline"}
                      </span>
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{u.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <RelativeTime
                      date={u.createdAt}
                      now={now}
                      locale="en"
                      formatStyle="short"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <RelativeTime date={u.lastActive} now={now} locale="en" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Story>

      <Story
        title="Inside status chips and badges"
        description="Relative time nested in chips and badges for filter toolbars, sync banners, and card status headers."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Chip variant="filled" className="gap-1.5">
            <Clock className="size-3" aria-hidden="true" />
            <span>Synced</span>
            <RelativeTime
              date="2026-08-14T11:58:00.000Z"
              now={now}
              locale="en"
              formatStyle="narrow"
            />
          </Chip>

          <Chip variant="outlined" className="gap-1.5">
            <RefreshCw className="size-3" aria-hidden="true" />
            <span>Last polled:</span>
            <RelativeTime
              date="2026-08-14T11:50:00.000Z"
              now={now}
              locale="en"
              formatStyle="short"
            />
          </Chip>

          <Badge variant="secondary" className="gap-1">
            <UserCheck className="size-3" aria-hidden="true" />
            <span>Verified</span>
            <RelativeTime
              date="2026-08-13T10:00:00.000Z"
              now={now}
              locale="en"
            />
          </Badge>

          <Badge variant="destructive" className="gap-1">
            <AlertCircle className="size-3" aria-hidden="true" />
            <span>Failed</span>
            <RelativeTime
              date="2026-08-14T11:15:00.000Z"
              now={now}
              locale="en"
            />
          </Badge>
        </div>
      </Story>

      <Story
        title="Audit log event stream"
        description="Event cards with category tags, action description, and live relative timestamps in the header."
      >
        <div className="space-y-2.5">
          {auditEvents.map((e) => (
            <Card key={e.id}>
              <CardContent className="flex flex-col gap-2 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {e.badge}
                    </Badge>
                    <p className="text-sm font-medium">{e.action}</p>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Target:{" "}
                    <span className="text-foreground font-mono">
                      {e.target}
                    </span>{" "}
                    · Actor: {e.actor}
                  </p>
                </div>
                <RelativeTime
                  date={e.time}
                  now={now}
                  locale="en"
                  className="shrink-0 text-xs"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </Story>

      <Story
        title="Git commit history"
        description="Commit list with Kbd hashes, message summaries, author tags, and compact narrow relative times."
      >
        <Card className="max-w-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <GitCommit className="text-primary size-4" aria-hidden="true" />
              <span>Latest commits on main</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y p-0">
            {commits.map((c) => (
              <div
                key={c.hash}
                className="flex items-center justify-between gap-4 px-6 py-3 text-sm"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Kbd>{c.hash}</Kbd>
                  <span className="truncate">{c.message}</span>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-muted-foreground font-mono text-xs">
                    @{c.author}
                  </span>
                  <span className="text-muted-foreground text-xs">·</span>
                  <RelativeTime
                    date={c.time}
                    now={now}
                    locale="en"
                    formatStyle="narrow"
                    className="text-xs"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </Story>

      <Story
        title="Scheduled jobs (future deltas)"
        description="Future timestamps format seamlessly with positive phrases ('in 20 minutes', 'tomorrow', 'in 3 days')."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {scheduledJobs.map((job) => (
            <Card key={job.name}>
              <CardContent className="flex items-start justify-between py-4">
                <div>
                  <p className="text-sm font-medium">{job.name}</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Scheduled for{" "}
                    <RelativeTime
                      date={job.nextRun}
                      now={now}
                      locale="en"
                      className="text-foreground font-medium"
                    />
                  </p>
                </div>
                <Badge
                  variant={job.sla === "urgent" ? "destructive" : "secondary"}
                >
                  {job.sla === "urgent" ? "High priority" : "Queued"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </Story>

      <Story
        title="Multi-timezone matrix"
        description="The same global release event rendered across multiple target IANA time zones with absolute time."
      >
        <Card className="max-w-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="text-primary size-4" aria-hidden="true" />
                <CardTitle className="text-sm font-semibold">
                  v2.4.0 Global Deployment
                </CardTitle>
              </div>
              <Badge variant="outline">
                <RelativeTime date={globalRelease} now={now} locale="en" />
              </Badge>
            </div>
            <CardDescription>
              Target release scheduled in 3 hours 30 minutes.
            </CardDescription>
          </CardHeader>
          <CardContent className="divide-y p-0">
            <div className="flex items-center justify-between px-6 py-2.5 text-sm">
              <span className="text-muted-foreground">
                Universal Coordinated Time (UTC)
              </span>
              <RelativeTime
                date={globalRelease}
                now={now}
                locale="en-GB"
                display="absolute"
                timeZone="UTC"
                className="text-foreground font-mono text-xs"
              />
            </div>
            <div className="flex items-center justify-between px-6 py-2.5 text-sm">
              <span className="text-muted-foreground">New York (EDT)</span>
              <RelativeTime
                date={globalRelease}
                now={now}
                locale="en-US"
                display="absolute"
                timeZone="America/New_York"
                className="text-foreground font-mono text-xs"
              />
            </div>
            <div className="flex items-center justify-between px-6 py-2.5 text-sm">
              <span className="text-muted-foreground">London (BST)</span>
              <RelativeTime
                date={globalRelease}
                now={now}
                locale="en-GB"
                display="absolute"
                timeZone="Europe/London"
                className="text-foreground font-mono text-xs"
              />
            </div>
            <div className="flex items-center justify-between px-6 py-2.5 text-sm">
              <span className="text-muted-foreground">Tokyo (JST)</span>
              <RelativeTime
                date={globalRelease}
                now={now}
                locale="ja-JP"
                display="absolute"
                timeZone="Asia/Tokyo"
                className="text-foreground font-mono text-xs"
              />
            </div>
          </CardContent>
        </Card>
      </Story>

      <Story
        title="Combined relative and absolute format"
        description="display='both' prints the human relative delta alongside the formatted clock time."
      >
        <div className="space-y-2">
          <Card className="max-w-md">
            <CardContent className="py-4">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Payment Received
              </p>
              <p className="mt-0.5 text-lg font-semibold">$4,250.00 USD</p>
              <div className="mt-2 text-xs">
                <RelativeTime
                  date="2026-08-14T08:30:00.000Z"
                  now={now}
                  locale="en"
                  display="both"
                  timeZone="UTC"
                  numeric="always"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </Story>

      <Story
        title="Density styles comparison"
        description="Compare formatStyle='long' vs 'short' vs 'narrow' for compact badges and narrow columns."
      >
        <div className="grid max-w-lg gap-3 rounded-lg border p-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Long (default):</span>
            <RelativeTime
              date="2026-08-14T09:00:00.000Z"
              now={now}
              locale="en"
              formatStyle="long"
              numeric="always"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Short:</span>
            <RelativeTime
              date="2026-08-14T09:00:00.000Z"
              now={now}
              locale="en"
              formatStyle="short"
              numeric="always"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Narrow:</span>
            <RelativeTime
              date="2026-08-14T09:00:00.000Z"
              now={now}
              locale="en"
              formatStyle="narrow"
              numeric="always"
            />
          </div>
        </div>
      </Story>

      <Story
        title="ISO string parsing (naive vs UTC)"
        description="parseAs='utc' forces timezone-less ISO strings ('2026-08-14T12:00:00') to parse as UTC instead of local."
      >
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Badge variant="outline">parseAs="utc"</Badge>
            <RelativeTime
              date="2026-08-14T12:00:00"
              now={now}
              locale="en-GB"
              display="both"
              timeZone="UTC"
              parseAs="utc"
            />
          </div>
        </div>
      </Story>
    </>
  );
}
