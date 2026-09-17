import Story from '../../components/story/Story'
import { BorderBeam } from '@react-registry/border-beam'
import { Progress } from '@react-registry/progress'
import { FileUp, Loader2 } from 'lucide-react'

export default function BorderBeamDemo() {
  return (
    <>
      <Story
        title="Default"
        description="Place BorderBeam inside a relative parent — it overlays the parent and traces its border ring. Inherits the parent's radius."
      >
        <div className="bg-card relative rounded-xl border p-6">
          <BorderBeam />
          <h3 className="text-sm font-medium">Deploy complete</h3>
          <p className="text-muted-foreground mt-1 text-xs">uipkge.dev · production · 42s ago</p>
        </div>
      </Story>

      <Story
        title="Colors"
        description="Any CSS color works. Primary for neutral emphasis, destructive and success tokens for tone."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="bg-card relative rounded-xl border p-6">
            <BorderBeam color="var(--primary)" />
            <p className="text-xs font-medium">Primary</p>
            <p className="text-muted-foreground mt-1 text-xs">Default emphasis</p>
          </div>
          <div className="bg-card relative rounded-xl border p-6">
            <BorderBeam color="var(--destructive)" />
            <p className="text-xs font-medium">Destructive</p>
            <p className="text-muted-foreground mt-1 text-xs">Needs attention</p>
          </div>
          <div className="bg-card relative rounded-xl border p-6">
            <BorderBeam color="var(--success)" />
            <p className="text-xs font-medium">Success</p>
            <p className="text-muted-foreground mt-1 text-xs">All clear</p>
          </div>
        </div>
      </Story>

      <Story
        title="Slow ambient"
        description="duration 12 — a calm, ambient sweep that reads as background life rather than urgency."
      >
        <div className="bg-card relative rounded-xl border p-6">
          <BorderBeam duration={12} />
          <h3 className="text-sm font-medium">System healthy</h3>
          <p className="text-muted-foreground mt-1 text-xs">All services operational · 99.98% uptime</p>
        </div>
      </Story>

      <Story
        title="Fast attention"
        description="duration 2 — a rapid sweep that pulls the eye, useful for transient states like syncing or live activity."
      >
        <div className="bg-card relative rounded-xl border p-6">
          <BorderBeam duration={2} />
          <h3 className="text-sm font-medium">Live region</h3>
          <p className="text-muted-foreground mt-1 text-xs">Streaming events in real time</p>
        </div>
      </Story>

      <Story
        title="Thickness"
        description="size controls ring thickness in px — 4px reads as a bold frame, 1px stays a hairline whisper."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="bg-card relative rounded-xl border p-6">
            <BorderBeam size={4} />
            <p className="text-xs font-medium">Thick — size 4</p>
            <p className="text-muted-foreground mt-1 text-xs">Bold frame</p>
          </div>
          <div className="bg-card relative rounded-xl border p-6">
            <BorderBeam size={1} />
            <p className="text-xs font-medium">Hairline — size 1</p>
            <p className="text-muted-foreground mt-1 text-xs">Subtle shimmer</p>
          </div>
        </div>
      </Story>

      <Story
        title="Paused"
        description="paused freezes the beam mid-track (animation-play-state: paused). A negative delay picks where it stops — here -3s lands it halfway around the ring."
      >
        <div className="bg-card relative rounded-xl border p-6">
          <BorderBeam paused delay={-3} />
          <h3 className="text-sm font-medium">Paused beam</h3>
          <p className="text-muted-foreground mt-1 text-xs">Static half-track highlight</p>
        </div>
      </Story>

      <Story
        title="Offset pair"
        description="Negative delay offsets the starting position around the ring — delay 0 and delay -3s put two beams on opposite sides of the same layout."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="bg-card relative rounded-xl border p-6">
            <BorderBeam />
            <p className="text-xs font-medium">delay 0</p>
            <p className="text-muted-foreground mt-1 text-xs">Starts at the top edge</p>
          </div>
          <div className="bg-card relative rounded-xl border p-6">
            <BorderBeam delay={-3} />
            <p className="text-xs font-medium">delay -3s</p>
            <p className="text-muted-foreground mt-1 text-xs">Starts halfway around</p>
          </div>
        </div>
      </Story>

      <Story
        title="AI processing"
        description="Classic magicui pairing — a beam around a card while a spinner communicates work in progress."
      >
        <div className="bg-card relative rounded-xl border p-6">
          <BorderBeam size={3} />
          <div className="flex items-center gap-3">
            <Loader2 className="text-muted-foreground size-4 animate-spin" aria-hidden="true" />
            <span className="text-sm">Generating response…</span>
          </div>
        </div>
      </Story>

      <Story
        title="Upload progress"
        description="Pair the beam with a Progress bar so the whole card reads as an active transfer."
      >
        <div className="bg-card relative rounded-xl border p-6">
          <BorderBeam color="var(--success)" />
          <div className="flex items-center gap-3">
            <FileUp className="text-muted-foreground size-4" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">quarterly-report.pdf</p>
              <Progress value={68} className="mt-2" />
              <p className="text-muted-foreground mt-2 text-xs">68% uploaded</p>
            </div>
          </div>
        </div>
      </Story>

      <Story
        title="Pill"
        description="rounded-[inherit] means any parent shape works — here the beam wraps a fully-rounded pill badge."
      >
        <div className="bg-card relative inline-flex items-center gap-2 rounded-full border px-5 py-2">
          <BorderBeam size={2} />
          <span className="bg-success relative size-2 rounded-full" aria-hidden="true" />
          <span className="text-xs font-medium">All systems operational</span>
        </div>
      </Story>

      <Story
        title="Dashboard highlight"
        description="Draw the eye to one KPI among many — label, big number, and delta with the beam framing the tile."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="bg-card rounded-xl border p-6">
            <p className="text-muted-foreground text-xs tracking-wide uppercase">Sessions</p>
            <p className="mt-2 text-2xl font-bold tabular-nums">18,204</p>
            <p className="text-muted-foreground mt-1 text-xs">+4.1% vs last week</p>
          </div>
          <div className="bg-card relative rounded-xl border p-6">
            <BorderBeam />
            <p className="text-muted-foreground text-xs tracking-wide uppercase">Revenue</p>
            <p className="mt-2 text-2xl font-bold tabular-nums">$48,910</p>
            <p className="text-success mt-1 text-xs font-medium">+12.6% vs last week</p>
          </div>
          <div className="bg-card rounded-xl border p-6">
            <p className="text-muted-foreground text-xs tracking-wide uppercase">Churn</p>
            <p className="mt-2 text-2xl font-bold tabular-nums">1.8%</p>
            <p className="text-muted-foreground mt-1 text-xs">-0.3% vs last week</p>
          </div>
        </div>
      </Story>
    </>
  )
}
