<script lang="ts">
  import { CircularProgress } from '@svelte-registry/circular-progress'
  import { Check, Loader2, Upload } from '@lucide/svelte'

  let { story }: { story: string } = $props()

  // Card is not ported to the Svelte registry yet — plain card-class divs stand in.
  const cardClass = 'rounded-xl border bg-card text-card-foreground shadow-xs'

  let uploadProgress = $state(0)

  $effect(() => {
    const timer = window.setInterval(() => {
      uploadProgress = uploadProgress >= 100 ? 0 : uploadProgress + 4
    }, 400)
    return () => window.clearInterval(timer)
  })
</script>

{#if story === 'Dashboard stat card'}
  <div class="grid max-w-md grid-cols-2 gap-4">
    <div class={cardClass}>
      <div class="flex items-center gap-4 p-5">
        <CircularProgress value={78} size="lg" showValue />
        <div>
          <p class="text-2xl font-semibold tabular-nums">78%</p>
          <p class="text-muted-foreground text-xs">Monthly target</p>
        </div>
      </div>
    </div>
    <div class={cardClass}>
      <div class="flex items-center gap-4 p-5">
        <CircularProgress value={42} size="lg" color="#3b82f6" trackColor="#dbeafe" showValue />
        <div>
          <p class="text-2xl font-semibold tabular-nums">42%</p>
          <p class="text-muted-foreground text-xs">Quarterly goal</p>
        </div>
      </div>
    </div>
  </div>
{/if}

{#if story === 'File upload progress'}
  <div class="{cardClass} max-w-md">
    <div class="flex items-center gap-4 p-5">
      <CircularProgress value={uploadProgress} size="lg" color={uploadProgress >= 100 ? '#22c55e' : undefined}>
        {#if uploadProgress >= 100}
          <Check class="size-7 text-emerald-500" />
        {:else}
          <Loader2 class="text-muted-foreground size-6 animate-spin" />
        {/if}
      </CircularProgress>
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-2">
          <Upload class="text-muted-foreground size-4" />
          <p class="truncate text-sm font-medium">quarterly-report.xlsx</p>
        </div>
        <p class="text-muted-foreground mt-1 text-xs">
          {uploadProgress >= 100 ? 'Upload complete' : `Uploading… ${uploadProgress}%`}
        </p>
      </div>
    </div>
  </div>
{/if}

{#if story === 'Size variants'}
  <div class="flex items-end gap-8">
    <div class="flex flex-col items-center gap-2">
      <CircularProgress value={60} size="sm" showValue />
      <span class="text-muted-foreground text-xs">sm</span>
    </div>
    <div class="flex flex-col items-center gap-2">
      <CircularProgress value={60} size="default" showValue />
      <span class="text-muted-foreground text-xs">default</span>
    </div>
    <div class="flex flex-col items-center gap-2">
      <CircularProgress value={60} size="lg" showValue />
      <span class="text-muted-foreground text-xs">lg</span>
    </div>
    <div class="flex flex-col items-center gap-2">
      <CircularProgress value={60} size={120} thickness={12} showValue />
      <span class="text-muted-foreground text-xs">custom 120px</span>
    </div>
  </div>
{/if}

{#if story === 'Status colors'}
  <div class="flex items-center gap-8">
    <div class="flex flex-col items-center gap-2">
      <CircularProgress value={100} color="#22c55e" trackColor="#dcfce7" showValue />
      <span class="text-muted-foreground text-xs">Complete</span>
    </div>
    <div class="flex flex-col items-center gap-2">
      <CircularProgress value={35} color="#ef4444" trackColor="#fee2e2" showValue />
      <span class="text-muted-foreground text-xs">At risk</span>
    </div>
    <div class="flex flex-col items-center gap-2">
      <CircularProgress value={65} color="#3b82f6" trackColor="#dbeafe" showValue />
      <span class="text-muted-foreground text-xs">In progress</span>
    </div>
  </div>
{/if}

{#if story === 'Indeterminate spinner'}
  <div class="flex items-center gap-8">
    <CircularProgress indeterminate size="sm" />
    <CircularProgress indeterminate size="default" />
    <CircularProgress indeterminate size="lg" />
  </div>
{/if}

{#if story === 'Task checklist'}
  <div class="{cardClass} max-w-md">
    <div class="flex flex-col space-y-1.5 p-6 pb-2">
      <h3 class="text-base font-semibold">Onboarding progress</h3>
    </div>
    <div class="flex items-center gap-5 p-6 pt-2">
      <CircularProgress value={67} size="lg">
        <span class="text-foreground text-sm font-semibold tabular-nums">4/6</span>
      </CircularProgress>
      <ul class="text-muted-foreground flex-1 space-y-1.5 text-sm">
        <li class="text-foreground flex items-center gap-2">
          <Check class="size-4 text-emerald-500" /> Create account
        </li>
        <li class="text-foreground flex items-center gap-2">
          <Check class="size-4 text-emerald-500" /> Verify email
        </li>
        <li class="text-foreground flex items-center gap-2">
          <Check class="size-4 text-emerald-500" /> Set up workspace
        </li>
        <li class="text-foreground flex items-center gap-2">
          <Check class="size-4 text-emerald-500" /> Invite teammates
        </li>
        <li>Connect calendar</li>
        <li>Complete profile</li>
      </ul>
    </div>
  </div>
{/if}
