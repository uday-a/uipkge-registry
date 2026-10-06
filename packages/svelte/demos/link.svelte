<script lang="ts">
  import { Link } from '@svelte-registry/link'
  import { ArrowRight, ArrowUpRight, Download, Lock } from '@lucide/svelte'

  let { story }: { story: string } = $props()
</script>

{#if story === 'Inline in body copy'}
  <p class="max-w-md text-sm leading-relaxed">
    Read the <Link href="/docs">documentation</Link> to get started, or jump straight to the
    <Link href="/docs/installation">installation guide</Link>.
  </p>
{/if}

{#if story === 'Color & underline'}
  <div class="flex flex-col items-start gap-2">
    <Link href="#" color="default">Default color</Link>
    <Link href="#">Primary color</Link>
    <Link href="#" color="muted">Muted color</Link>
    <Link href="#" underline="always">Always underlined</Link>
    <Link href="#" underline="none">Never underlined</Link>
  </div>
{/if}

{#if story === 'Sizes'}
  <div class="flex flex-col items-start gap-2">
    <Link href="#" size="sm">Small link</Link>
    <Link href="#">Default link</Link>
    <Link href="#" size="lg">Large link</Link>
  </div>
{/if}

{#if story === 'With icons'}
  <div class="flex flex-col items-start gap-2">
    <Link href="#">
      {#snippet left()}
        <Download />
      {/snippet}
      Download report
    </Link>
    <Link href="#">
      Continue
      {#snippet right()}
        <ArrowRight />
      {/snippet}
    </Link>
    <Link href="https://example.com">
      External site
      {#snippet right()}
        <ArrowUpRight />
      {/snippet}
    </Link>
  </div>
{/if}

{#if story === 'External vs internal'}
  <div class="flex flex-col items-start gap-2">
    <Link href="/dashboard">Internal — same tab</Link>
    <Link href="https://uipkge.dev">External — new tab with rel</Link>
    <Link href="https://uipkge.dev" external={false}>Forced same-tab</Link>
  </div>
{/if}

{#if story === 'Disabled'}
  <div class="flex flex-col items-start gap-2">
    <Link href="/billing" disabled>
      {#snippet left()}
        <Lock />
      {/snippet}
      Upgrade to continue
    </Link>
  </div>
{/if}

{#if story === 'Child snippet'}
  <Link href="/custom">
    {#snippet child({ props })}
      <a {...props} class="{props.class} font-bold tracking-tight">
        Fully custom anchor, link styles applied
      </a>
    {/snippet}
  </Link>
{/if}
