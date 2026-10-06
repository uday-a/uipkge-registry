<script lang="ts">
  import { LoadingBar, createLoadingBar } from '@svelte-registry/loading-bar'
  import { Button } from '@svelte-registry/button'
  import { Loader2 } from '@lucide/svelte'

  let { story }: { story: string } = $props()

  const pageBar = createLoadingBar()
  const formBar = createLoadingBar()
  const bottomBar = createLoadingBar()

  let manualValue = $state(40)
  let formStatus = $state<'idle' | 'saving' | 'done' | 'error'>('idle')

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

  async function simulatePageLoad() {
    pageBar.start()
    await sleep(1800)
    pageBar.finish()
  }

  async function simulateApiError() {
    pageBar.start()
    await sleep(1400)
    pageBar.error()
  }

  async function submitForm() {
    formStatus = 'saving'
    formBar.start()
    await sleep(2000)
    formBar.finish()
    formStatus = 'done'
    setTimeout(() => (formStatus = 'idle'), 1500)
  }

  async function runBottomBar() {
    bottomBar.start()
    await sleep(1800)
    bottomBar.finish()
  }
</script>

<LoadingBar bind:this={pageBar.current} />
<LoadingBar bind:this={formBar.current} color="#22c55e" />
<LoadingBar bind:this={bottomBar.current} position="bottom" color="#6366f1" />

{#if story === 'Page navigation'}
  <div class="flex flex-wrap gap-2">
    <Button onclick={simulatePageLoad}>
      <Loader2 class="mr-2 size-4 animate-spin {pageBar.loading ? 'opacity-100' : 'opacity-0'}" />
      Load dashboard
    </Button>
    <Button variant="destructive" onclick={simulateApiError}>Simulate error</Button>
  </div>
{/if}

{#if story === 'Form submission'}
  <div class="flex max-w-sm flex-col gap-3">
    <Button onclick={submitForm} disabled={formStatus === 'saving'}>
      {formStatus === 'saving' ? 'Saving…' : formStatus === 'done' ? 'Saved!' : 'Save changes'}
    </Button>
    <p class="text-muted-foreground text-xs">Green bar runs while the fake save completes.</p>
  </div>
{/if}

{#if story === 'Manual control'}
  <div class="flex max-w-sm flex-col gap-3">
    <input
      type="range"
      min="0"
      max="100"
      value={manualValue}
      oninput={(e) => (manualValue = Number(e.currentTarget.value))}
      class="w-full accent-(--primary)"
    />
    <LoadingBar bind:value={manualValue} color="#f59e0b" />
    <p class="text-muted-foreground text-xs tabular-nums">Drag the slider — {Math.round(manualValue)}%</p>
  </div>
{/if}

{#if story === 'Indeterminate fetching'}
  <div class="flex flex-col gap-3">
    <LoadingBar indeterminate spinner />
    <p class="text-muted-foreground max-w-sm text-xs">
      Sliding bar for unknown durations. This story's bar is always on — combine with a boolean in real code.
    </p>
  </div>
{/if}

{#if story === 'Bottom-anchored bar'}
  <Button onclick={runBottomBar}>Run bottom bar</Button>
{/if}
