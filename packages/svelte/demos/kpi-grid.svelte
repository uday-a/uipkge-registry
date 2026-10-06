<script lang="ts">
  import { KpiGrid } from '@svelte-registry/kpi-grid'
  import { CalendarClock, UserCheck, Users } from '@lucide/svelte'

  let { story }: { story: string } = $props()
</script>

{#if story === 'Default — four explicit tiles'}
  <KpiGrid>
    <div class="bg-card text-card-foreground flex flex-col justify-between rounded-xl border shadow-xs">
      <div class="flex flex-row items-center justify-between p-6 pb-2">
        <h3 class="text-muted-foreground text-xs font-medium tracking-widest uppercase">Total employees</h3>
        <div class="bg-primary/10 text-primary/70 rounded-lg p-2"><Users class="size-4" aria-hidden="true" /></div>
      </div>
      <div class="px-6"><div class="text-2xl font-bold tracking-tight">124</div></div>
      <div class="flex items-center justify-end gap-1.5 px-6 pb-4 text-xs">
        <span class="bg-success/10 text-success inline-flex items-center rounded-full px-1.5 py-0.5 font-medium"
          >+12</span
        >
        <span class="text-muted-foreground">this month</span>
      </div>
    </div>

    <div class="bg-card text-card-foreground flex flex-col justify-between rounded-xl border shadow-xs">
      <div class="flex flex-row items-center justify-between p-6 pb-2">
        <h3 class="text-muted-foreground text-xs font-medium tracking-widest uppercase">Active</h3>
        <div class="bg-primary/10 text-primary/70 rounded-lg p-2">
          <UserCheck class="size-4" aria-hidden="true" />
        </div>
      </div>
      <div class="px-6"><div class="text-2xl font-bold tracking-tight">116</div></div>
      <div class="flex items-center justify-end gap-1.5 px-6 pb-4 text-xs">
        <span class="bg-success/10 text-success inline-flex items-center rounded-full px-1.5 py-0.5 font-medium"
          >+2%</span
        >
        <span class="text-muted-foreground">QoQ</span>
      </div>
    </div>

    <div class="bg-card text-card-foreground rounded-xl border shadow-xs">
      <div class="flex flex-row items-center justify-between p-6 pb-2">
        <h3 class="text-muted-foreground text-xs font-medium tracking-widest uppercase">On leave</h3>
        <CalendarClock class="text-muted-foreground size-4" aria-hidden="true" />
      </div>
      <div class="px-6 pb-6"><div class="text-2xl font-bold tracking-tight">5</div></div>
    </div>

    <div class="bg-card text-card-foreground rounded-xl border shadow-xs">
      <div class="flex flex-row items-center justify-between p-6 pb-2">
        <h3 class="text-muted-foreground text-xs font-medium tracking-widest uppercase">Open roles</h3>
        <Users class="text-muted-foreground size-4" aria-hidden="true" />
      </div>
      <div class="px-6 pb-6"><div class="text-2xl font-bold tracking-tight">8</div></div>
    </div>
  </KpiGrid>
{/if}

{#if story === 'Three columns'}
  <KpiGrid columns={3}>
    <div class="bg-card text-card-foreground rounded-xl border p-6 shadow-xs">
      <div class="text-muted-foreground text-xs font-medium tracking-widest uppercase">Revenue</div>
      <div class="mt-2 text-2xl font-bold tracking-tight">$1.18M</div>
    </div>
    <div class="bg-card text-card-foreground rounded-xl border p-6 shadow-xs">
      <div class="text-muted-foreground text-xs font-medium tracking-widest uppercase">Active users</div>
      <div class="mt-2 text-2xl font-bold tracking-tight">8,421</div>
    </div>
    <div class="bg-card text-card-foreground rounded-xl border p-6 shadow-xs">
      <div class="text-muted-foreground text-xs font-medium tracking-widest uppercase">Churn</div>
      <div class="mt-2 text-2xl font-bold tracking-tight">1.2%</div>
    </div>
  </KpiGrid>
{/if}

{#if story === 'Two columns'}
  <KpiGrid columns={2}>
    <div class="bg-card text-card-foreground rounded-xl border p-6 shadow-xs">
      <div class="text-muted-foreground text-xs font-medium tracking-widest uppercase">Signups</div>
      <div class="mt-2 text-2xl font-bold tracking-tight">2,304</div>
    </div>
    <div class="bg-card text-card-foreground rounded-xl border p-6 shadow-xs">
      <div class="text-muted-foreground text-xs font-medium tracking-widest uppercase">Conversion</div>
      <div class="mt-2 text-2xl font-bold tracking-tight">4.8%</div>
    </div>
  </KpiGrid>
{/if}
