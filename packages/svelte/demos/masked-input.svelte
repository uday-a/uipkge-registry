<script lang="ts">
  import { MaskedInput } from '@svelte-registry/masked-input'

  let { story }: { story: string } = $props()

  let phone = $state('')
  let date = $state('')
  let card = $state('')
  let completed = $state('')
  let validated = $state('')
</script>

{#if story === 'Phone'}
  <div class="max-w-sm">
    <p class="text-sm font-medium">Phone Number</p>
    <MaskedInput bind:value={phone} mask="(###) ###-####" class="mt-1.5" />
    <p class="text-muted-foreground mt-1 text-xs">
      Value: <code class="text-foreground">{phone || '—'}</code>
    </p>
  </div>
{/if}

{#if story === 'Date'}
  <div class="max-w-sm">
    <p class="text-sm font-medium">Date of Birth</p>
    <MaskedInput bind:value={date} mask="##/##/####" placeholderChar="0" class="mt-1.5" />
    <p class="text-muted-foreground mt-1 text-xs">
      Value: <code class="text-foreground">{date || '—'}</code>
    </p>
  </div>
{/if}

{#if story === 'Credit Card'}
  <div class="max-w-sm">
    <p class="text-sm font-medium">Credit Card</p>
    <MaskedInput bind:value={card} mask="#### #### #### ####" class="mt-1.5" />
    <p class="text-muted-foreground mt-1 text-xs">
      Value: <code class="text-foreground">{card || '—'}</code>
    </p>
  </div>
{/if}

{#if story === 'Completed event'}
  <div class="max-w-sm">
    <p class="text-sm font-medium">One-time passcode</p>
    <MaskedInput
      mask="######"
      showMask={false}
      placeholder="6-digit code"
      class="mt-1.5"
      oncomplete={(v) => (completed = v)}
    />
    <p class="text-muted-foreground mt-1 text-xs">
      Completed: <code class="text-foreground">{completed || '—'}</code>
    </p>
  </div>
{/if}

{#if story === 'Validation'}
  <div class="max-w-sm">
    <p class="text-sm font-medium">ZIP code</p>
    <MaskedInput
      mask="#####"
      bind:value={validated}
      class="mt-1.5"
      validate={(_, raw) => (raw.length === 5 ? true : 'Enter all 5 digits')}
    />
    <p class="text-muted-foreground mt-1 text-xs">
      Value: <code class="text-foreground">{validated || '—'}</code>
    </p>
  </div>
{/if}

{#if story === 'Disabled & readonly'}
  <div class="grid max-w-sm gap-3">
    <div>
      <p class="text-sm font-medium">Disabled</p>
      <MaskedInput mask="(###) ###-####" value="(555) 010-2030" disabled class="mt-1.5" />
    </div>
    <div>
      <p class="text-sm font-medium">Readonly</p>
      <MaskedInput mask="(###) ###-####" value="(555) 010-2030" readonly class="mt-1.5" />
    </div>
  </div>
{/if}
