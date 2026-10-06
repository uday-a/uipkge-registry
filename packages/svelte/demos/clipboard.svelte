<script lang="ts">
  import { Clipboard } from '@svelte-registry/clipboard'

  let { story }: { story: string } = $props()

  // Card is not ported to the Svelte registry yet — plain card-class divs stand in.
  const cardClass = 'rounded-xl border bg-card text-card-foreground shadow-xs'

  let lastCopied = $state('')
  let log = $state<string[]>([])

  function onCopy(t: string) {
    lastCopied = t
    log = [`Copied "${t.slice(0, 40)}${t.length > 40 ? '…' : ''}" at ${new Date().toLocaleTimeString()}`, ...log]
  }
</script>

{#if story === 'Install command'}
  <div class="bg-muted flex max-w-md items-center justify-between rounded-md p-3">
    <code class="text-sm">npm install @uipkge/ui</code>
    <Clipboard text="npm install @uipkge/ui" oncopy={onCopy} />
  </div>
{/if}

{#if story === 'API key & secrets'}
  <div class="{cardClass} max-w-md">
    <div class="flex flex-col space-y-1.5 p-6">
      <h3 class="font-semibold">Live API key</h3>
      <p class="text-muted-foreground text-sm">Use this key in your server-side code. Keep it secret.</p>
    </div>
    <div class="space-y-3 p-6 pt-0">
      <div class="bg-muted flex items-center justify-between rounded-md p-3">
        <code class="text-sm">mock_key_a1b2c3d4e5f6g7h8i9j0</code>
        <Clipboard text="mock_key_a1b2c3d4e5f6g7h8i9j0" label="Copy key" timeout={3000} oncopy={onCopy} />
      </div>
      <div class="bg-muted/50 flex items-center justify-between rounded-md p-3">
        <code class="text-muted-foreground text-sm">sk_test_z9y8x7w6v5u4t3s2r1</code>
        <Clipboard text="sk_test_z9y8x7w6v5u4t3s2r1" label="Copy test key" oncopy={onCopy} />
      </div>
    </div>
  </div>
{/if}

{#if story === 'Code snippets'}
  <div class="max-w-md space-y-3">
    <div class="bg-muted flex items-center justify-between rounded-md p-3">
      <code class="text-sm">git clone https://github.com/uday-a/sveltekit-boilerplate.git</code>
      <Clipboard text="git clone https://github.com/uday-a/sveltekit-boilerplate.git" oncopy={onCopy} />
    </div>
    <div class="bg-muted flex items-center justify-between rounded-md p-3">
      <code class="text-sm">VITE_API_URL=https://api.example.com</code>
      <Clipboard text="VITE_API_URL=https://api.example.com" oncopy={onCopy} />
    </div>
  </div>
{/if}

{#if story === 'Contact details'}
  <div class="flex max-w-md flex-wrap items-center gap-4">
    <Clipboard
      text="support@uipkge.dev"
      tooltip="Copy email"
      successText="Email copied!"
      label="support@uipkge.dev"
      oncopy={onCopy}
    />
    <Clipboard
      text="https://uipkge.dev/docs/getting-started"
      tooltip="Copy link"
      successText="Link copied!"
      label="Copy docs link"
      oncopy={onCopy}
    />
  </div>
{/if}

{#if story === 'Label-only & custom slot'}
  <div class="flex max-w-md flex-wrap items-center gap-4">
    <Clipboard text="label-only-text" label="Copy this text" hideIcon oncopy={onCopy} />
    <Clipboard text="slot-demo" oncopy={onCopy}>
      {#snippet children({ state })}
        <span
          class="{state === 'success' ? 'text-emerald-500' : 'text-muted-foreground'} text-xs font-medium"
        >
          {state === 'success' ? 'Done!' : 'Copy me'}
        </span>
      {/snippet}
    </Clipboard>
  </div>
{/if}

{#if story === 'Button-styled'}
  <Clipboard
    text="npx shadcn-vue@latest add https://uipkge.dev/r/vue/button.json"
    class="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground px-3 py-1.5"
    label="Copy install command"
    oncopy={onCopy}
  />
{/if}

{#if story === 'Event log'}
  <div class="max-w-md space-y-3">
    <div class="flex flex-wrap items-center gap-3">
      <Clipboard text="event-demo-1" oncopy={onCopy} />
      <Clipboard text="event-demo-2" label="Copy second" oncopy={onCopy} />
      <Clipboard text="cannot-copy" disabled tooltip="Disabled" />
    </div>
    <p class="text-muted-foreground text-xs">Last copied: {lastCopied || '—'}</p>
    <div class="bg-muted/40 rounded-md p-3 text-xs">
      {#if !log.length}
        <p class="text-muted-foreground">No copies yet — click a button above.</p>
      {:else}
        <ul class="space-y-1">
          {#each log.slice(0, 5) as line, i (i)}
            <li class="text-foreground">{line}</li>
          {/each}
        </ul>
      {/if}
    </div>
  </div>
{/if}
