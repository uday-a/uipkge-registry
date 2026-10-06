<script lang="ts">
  import { PinInput, PinInputGroup, PinInputSeparator, PinInputSlot } from '@svelte-registry/pin-input'

  let { story }: { story: string } = $props()

  let value = $state<string[]>([])
  let password = $state<string[]>([])
  let statusError = $state<string[]>([])
  let statusSuccess = $state<string[]>(['1', '2', '3', '4'])
  let small = $state<string[]>([])
  let large = $state<string[]>([])
  let shakeCode = $state<string[]>([])
  let shakeStatus = $state<'default' | 'error'>('default')

  function onShakeComplete(v: string) {
    if (v === '1234') {
      shakeStatus = 'default'
      return
    }
    shakeStatus = 'error'
    // Allow re-trigger: clear status then re-apply after a tick when user edits.
    window.setTimeout(() => {
      if (shakeStatus === 'error') shakeCode = []
    }, 450)
  }

  function onShakeUpdate(v: string[]) {
    if (shakeStatus === 'error' && v.some(Boolean)) {
      shakeStatus = 'default'
    }
  }

  const labelClass = 'text-sm font-medium'
</script>

{#if story === 'Default'}
  <div class="space-y-2">
    <label class={labelClass} for="pin-default-0">One-time code</label>
    <PinInput bind:value length={6} placeholder="•">
      <PinInputGroup>
        {#each [0, 1, 2, 3, 4, 5] as i}
          <PinInputSlot index={i} id={i === 0 ? 'pin-default-0' : undefined} />
        {/each}
      </PinInputGroup>
    </PinInput>
    <p class="text-xs text-muted-foreground">
      Value: <code class="text-foreground">{value.join('') || '—'}</code>
    </p>
  </div>
{/if}

{#if story === 'Masked (Password)'}
  <div class="space-y-2">
    <label class={labelClass} for="pin-masked-0">Secure PIN</label>
    <PinInput bind:value={password} length={4} mask placeholder="•">
      <PinInputGroup>
        {#each [0, 1, 2, 3] as i}
          <PinInputSlot index={i} id={i === 0 ? 'pin-masked-0' : undefined} />
        {/each}
      </PinInputGroup>
    </PinInput>
    <p class="text-xs text-muted-foreground">
      Value: <code class="text-foreground">{password.join('') || '—'}</code>
    </p>
  </div>
{/if}

{#if story === 'Sizes'}
  <div class="space-y-4">
    <div class="space-y-2">
      <label class="text-xs font-medium" for="pin-sm-0">Small</label>
      <PinInput bind:value={small} length={4} size="sm">
        <PinInputGroup>
          {#each [0, 1, 2, 3] as i}
            <PinInputSlot index={i} id={i === 0 ? 'pin-sm-0' : undefined} />
          {/each}
        </PinInputGroup>
      </PinInput>
    </div>
    <div class="space-y-2">
      <label class={labelClass} for="pin-md-0">Medium (default)</label>
      <PinInput bind:value length={4}>
        <PinInputGroup>
          {#each [0, 1, 2, 3] as i}
            <PinInputSlot index={i} id={i === 0 ? 'pin-md-0' : undefined} />
          {/each}
        </PinInputGroup>
      </PinInput>
    </div>
    <div class="space-y-2">
      <label class="text-lg font-medium" for="pin-lg-0">Large</label>
      <PinInput bind:value={large} length={4} size="lg">
        <PinInputGroup>
          {#each [0, 1, 2, 3] as i}
            <PinInputSlot index={i} id={i === 0 ? 'pin-lg-0' : undefined} />
          {/each}
        </PinInputGroup>
      </PinInput>
    </div>
  </div>
{/if}

{#if story === 'Status'}
  <div class="space-y-4">
    <div class="space-y-2">
      <label class={labelClass} for="pin-err-0">Error</label>
      <PinInput bind:value={statusError} length={4} status="error">
        <PinInputGroup>
          {#each [0, 1, 2, 3] as i}
            <PinInputSlot index={i} id={i === 0 ? 'pin-err-0' : undefined} />
          {/each}
        </PinInputGroup>
      </PinInput>
    </div>
    <div class="space-y-2">
      <label class={labelClass} for="pin-ok-0">Success</label>
      <PinInput bind:value={statusSuccess} length={4} status="success">
        <PinInputGroup>
          {#each [0, 1, 2, 3] as i}
            <PinInputSlot index={i} id={i === 0 ? 'pin-ok-0' : undefined} />
          {/each}
        </PinInputGroup>
      </PinInput>
    </div>
  </div>
{/if}

{#if story === 'Error shake'}
  <div class="space-y-2">
    <label class={labelClass} for="pin-shake-0">Try a code (correct: 1234)</label>
    <PinInput
      bind:value={shakeCode}
      length={4}
      status={shakeStatus}
      onValueChange={onShakeUpdate}
      onComplete={onShakeComplete}
    >
      <PinInputGroup>
        {#each [0, 1, 2, 3] as i}
          <PinInputSlot index={i} id={i === 0 ? 'pin-shake-0' : undefined} />
        {/each}
      </PinInputGroup>
    </PinInput>
    <p class="text-xs text-muted-foreground">
      Status: <code class="text-foreground">{shakeStatus}</code>
    </p>
  </div>
{/if}

{#if story === 'With Separator'}
  <div class="space-y-2">
    <label class={labelClass} for="pin-sep-0">Grouped code</label>
    <PinInput bind:value length={6} placeholder="0">
      <PinInputGroup>
        {#each [0, 1, 2] as i}
          <PinInputSlot index={i} id={i === 0 ? 'pin-sep-0' : undefined} />
        {/each}
      </PinInputGroup>
      <PinInputSeparator />
      <PinInputGroup>
        {#each [3, 4, 5] as i}
          <PinInputSlot index={i} id={i === 0 ? 'pin-sepx-0' : undefined} />
        {/each}
      </PinInputGroup>
    </PinInput>
  </div>
{/if}

{#if story === 'Auto Submit'}
  <div class="space-y-2">
    <label class={labelClass} for="pin-auto-0">Auto-submit PIN</label>
    <PinInput length={4} autoSubmit onComplete={(v) => alert('PIN complete: ' + v)}>
      <PinInputGroup>
        {#each [0, 1, 2, 3] as i}
          <PinInputSlot index={i} id={i === 0 ? 'pin-auto-0' : undefined} />
        {/each}
      </PinInputGroup>
    </PinInput>
    <p class="text-xs text-muted-foreground">Fill all 4 digits to trigger the complete event</p>
  </div>
{/if}

{#if story === 'Disabled'}
  <div class="space-y-2">
    <label class={labelClass} for="pin-disabled-0">Disabled</label>
    <PinInput value={['1', '2', '3', '4']} length={4} disabled>
      <PinInputGroup>
        {#each [0, 1, 2, 3] as i}
          <PinInputSlot index={i} id={i === 0 ? 'pin-disabled-0' : undefined} />
        {/each}
      </PinInputGroup>
    </PinInput>
  </div>
{/if}
