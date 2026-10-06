<script lang="ts">
  import { Switch } from '@svelte-registry/switch'
  import { Check, X } from '@lucide/svelte'

  let { story }: { story: string } = $props()

  let enabled = $state(true)
</script>

{#if story === 'Default'}
  <div class="flex items-center gap-2">
    <Switch id="airplane" bind:checked={enabled} />
    <label for="airplane" class="text-sm font-medium">Airplane mode {enabled ? '(on)' : '(off)'}</label>
  </div>
{/if}

{#if story === 'States'}
  <div class="space-y-3">
    <div class="flex items-center gap-2">
      <Switch id="s1" defaultChecked />
      <label for="s1" class="text-sm font-medium">Default on</label>
    </div>
    <div class="flex items-center gap-2">
      <Switch id="s2" />
      <label for="s2" class="text-sm font-medium">Default off</label>
    </div>
    <div class="flex items-center gap-2">
      <Switch id="s3" disabled />
      <label for="s3" class="text-muted-foreground text-sm font-medium">Disabled</label>
    </div>
    <div class="flex items-center gap-2">
      <Switch id="s4" defaultChecked disabled />
      <label for="s4" class="text-muted-foreground text-sm font-medium">Disabled on</label>
    </div>
  </div>
{/if}

{#if story === 'With text'}
  <div class="flex flex-wrap items-center gap-4">
    <Switch checkedChildren="ON" unCheckedChildren="OFF" defaultChecked />
    <Switch checkedChildren="ON" unCheckedChildren="OFF" />
    <Switch checkedChildren="Yes" unCheckedChildren="No" size="lg" defaultChecked />
    <Switch checkedChildren="Yes" unCheckedChildren="No" size="lg" />
  </div>
{/if}

{#if story === 'With icons'}
  <div class="flex flex-wrap items-center gap-4">
    <Switch defaultChecked>
      {#snippet checkedSnippet()}<Check class="size-3" />{/snippet}
      {#snippet uncheckedSnippet()}<X class="size-3" />{/snippet}
    </Switch>
    <Switch>
      {#snippet checkedSnippet()}<Check class="size-3" />{/snippet}
      {#snippet uncheckedSnippet()}<X class="size-3" />{/snippet}
    </Switch>
    <Switch size="lg" defaultChecked>
      {#snippet checkedSnippet()}<Check class="size-3.5" />{/snippet}
      {#snippet uncheckedSnippet()}<X class="size-3.5" />{/snippet}
    </Switch>
  </div>
{/if}

{#if story === 'Loading'}
  <div class="flex flex-wrap items-center gap-4">
    <Switch loading defaultChecked />
    <Switch loading />
    <Switch loading size="lg" defaultChecked />
    <Switch loading size="lg" checkedChildren="ON" unCheckedChildren="OFF" defaultChecked />
  </div>
{/if}

{#if story === 'Sizes'}
  <div class="space-y-3">
    <div class="flex flex-wrap items-center gap-4">
      <Switch size="sm" defaultChecked />
      <Switch size="default" defaultChecked />
      <Switch size="lg" defaultChecked />
    </div>
    <div class="flex flex-wrap items-center gap-4">
      <Switch size="sm" checkedChildren="1" unCheckedChildren="0" defaultChecked />
      <Switch size="default" checkedChildren="ON" unCheckedChildren="OFF" defaultChecked />
      <Switch size="lg" checkedChildren="ON" unCheckedChildren="OFF" defaultChecked />
    </div>
  </div>
{/if}

{#if story === 'Colors'}
  <div class="flex flex-wrap items-center gap-4">
    <Switch color="success" defaultChecked />
    <Switch color="warning" defaultChecked />
    <Switch color="error" defaultChecked />
    <Switch color="info" defaultChecked />
    <Switch color="secondary" defaultChecked />
    <Switch color="#8b5cf6" defaultChecked />
  </div>
{/if}
