<script lang="ts">
  import { BorderBeam } from '@svelte-registry/border-beam'
  import { FileUp, Loader2 } from '@lucide/svelte'

  let { story }: { story: string } = $props()
</script>

{#if story === 'Default'}
  <div class="bg-card relative rounded-xl border p-6">
    <BorderBeam />
    <h3 class="text-sm font-medium">Deploy complete</h3>
    <p class="text-muted-foreground mt-1 text-xs">uipkge.dev · production · 42s ago</p>
  </div>
{/if}

{#if story === 'Colors'}
  <div class="grid gap-4 sm:grid-cols-3">
    <div class="bg-card relative rounded-xl border p-6">
      <BorderBeam color="var(--primary)" />
      <p class="text-xs font-medium">Primary</p>
      <p class="text-muted-foreground mt-1 text-xs">Default emphasis</p>
    </div>
    <div class="bg-card relative rounded-xl border p-6">
      <BorderBeam color="var(--destructive)" />
      <p class="text-xs font-medium">Destructive</p>
      <p class="text-muted-foreground mt-1 text-xs">Needs attention</p>
    </div>
    <div class="bg-card relative rounded-xl border p-6">
      <BorderBeam color="var(--success)" />
      <p class="text-xs font-medium">Success</p>
      <p class="text-muted-foreground mt-1 text-xs">All clear</p>
    </div>
  </div>
{/if}

{#if story === 'Slow ambient'}
  <div class="bg-card relative rounded-xl border p-6">
    <BorderBeam duration={12} />
    <h3 class="text-sm font-medium">System healthy</h3>
    <p class="text-muted-foreground mt-1 text-xs">All services operational · 99.98% uptime</p>
  </div>
{/if}

{#if story === 'Fast attention'}
  <div class="bg-card relative rounded-xl border p-6">
    <BorderBeam duration={2} />
    <h3 class="text-sm font-medium">Live region</h3>
    <p class="text-muted-foreground mt-1 text-xs">Streaming events in real time</p>
  </div>
{/if}

{#if story === 'Thickness'}
  <div class="grid gap-4 sm:grid-cols-2">
    <div class="bg-card relative rounded-xl border p-6">
      <BorderBeam size={4} />
      <p class="text-xs font-medium">Thick — size 4</p>
      <p class="text-muted-foreground mt-1 text-xs">Bold frame</p>
    </div>
    <div class="bg-card relative rounded-xl border p-6">
      <BorderBeam size={1} />
      <p class="text-xs font-medium">Hairline — size 1</p>
      <p class="text-muted-foreground mt-1 text-xs">Subtle shimmer</p>
    </div>
  </div>
{/if}

{#if story === 'Paused'}
  <div class="bg-card relative rounded-xl border p-6">
    <BorderBeam paused delay={-3} />
    <h3 class="text-sm font-medium">Paused beam</h3>
    <p class="text-muted-foreground mt-1 text-xs">Static half-track highlight</p>
  </div>
{/if}

{#if story === 'Offset pair'}
  <div class="grid gap-4 sm:grid-cols-2">
    <div class="bg-card relative rounded-xl border p-6">
      <BorderBeam />
      <p class="text-xs font-medium">delay 0</p>
      <p class="text-muted-foreground mt-1 text-xs">Starts at the top edge</p>
    </div>
    <div class="bg-card relative rounded-xl border p-6">
      <BorderBeam delay={-3} />
      <p class="text-xs font-medium">delay -3s</p>
      <p class="text-muted-foreground mt-1 text-xs">Starts halfway around</p>
    </div>
  </div>
{/if}

{#if story === 'AI processing'}
  <div class="bg-card relative rounded-xl border p-6">
    <BorderBeam size={3} />
    <div class="flex items-center gap-3">
      <Loader2 class="text-muted-foreground size-4 animate-spin" aria-hidden="true" />
      <span class="text-sm">Generating response…</span>
    </div>
  </div>
{/if}

{#if story === 'Upload progress'}
  <div class="bg-card relative rounded-xl border p-6">
    <BorderBeam color="var(--success)" />
    <div class="flex items-center gap-3">
      <FileUp class="text-muted-foreground size-4" aria-hidden="true" />
      <div class="min-w-0 flex-1">
        <p class="truncate text-sm">quarterly-report.pdf</p>
        <div
          role="progressbar"
          aria-valuenow={68}
          aria-valuemin={0}
          aria-valuemax={100}
          class="bg-secondary mt-2 h-2 w-full overflow-hidden rounded-full"
        >
          <div class="bg-primary h-full rounded-full transition-all" style="width: 68%"></div>
        </div>
        <p class="text-muted-foreground mt-2 text-xs">68% uploaded</p>
      </div>
    </div>
  </div>
{/if}

{#if story === 'Pill'}
  <div class="bg-card relative inline-flex items-center gap-2 rounded-full border px-5 py-2">
    <BorderBeam size={2} />
    <span class="bg-success relative size-2 rounded-full" aria-hidden="true"></span>
    <span class="text-xs font-medium">All systems operational</span>
  </div>
{/if}

{#if story === 'Dashboard highlight'}
  <div class="grid gap-4 sm:grid-cols-3">
    <div class="bg-card rounded-xl border p-6">
      <p class="text-muted-foreground text-xs tracking-wide uppercase">Sessions</p>
      <p class="mt-2 text-2xl font-bold tabular-nums">18,204</p>
      <p class="text-muted-foreground mt-1 text-xs">+4.1% vs last week</p>
    </div>
    <div class="bg-card relative rounded-xl border p-6">
      <BorderBeam />
      <p class="text-muted-foreground text-xs tracking-wide uppercase">Revenue</p>
      <p class="mt-2 text-2xl font-bold tabular-nums">$48,910</p>
      <p class="text-success mt-1 text-xs font-medium">+12.6% vs last week</p>
    </div>
    <div class="bg-card rounded-xl border p-6">
      <p class="text-muted-foreground text-xs tracking-wide uppercase">Churn</p>
      <p class="mt-2 text-2xl font-bold tabular-nums">1.8%</p>
      <p class="text-muted-foreground mt-1 text-xs">-0.3% vs last week</p>
    </div>
  </div>
{/if}
