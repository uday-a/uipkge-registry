<script lang="ts">
  import { Button } from '@svelte-registry/button'
  import { PaymentCard } from '@svelte-registry/payment-card'

  let { story }: { story: string } = $props()

  let typedNumber = $state('')
  const brands = ['4111 1111 1111 1111', '5454 5454 5454 5454', '3782 822463 10005', '6011 1111 1111 1117']
  let brandIdx = 0
  let charIdx = 0

  $effect(() => {
    const timer = setInterval(() => {
      const target = brands[brandIdx]!
      if (charIdx <= target.length) {
        typedNumber = target.slice(0, charIdx)
        charIdx++
      } else {
        brandIdx = (brandIdx + 1) % brands.length
        charIdx = 0
        typedNumber = ''
      }
    }, 180)
    return () => clearInterval(timer)
  })

  // Live interactive example — format as the user types.
  let liveNumber = $state('')
  let liveName = $state('Jane Doe')
  let liveExpiry = $state('12/29')
  let liveCvc = $state('')
  let liveCvcFocused = $state(false)

  function formatCardNumber(raw: string) {
    const digits = raw.replace(/\D/g, '').slice(0, 16)
    // Amex uses 4-6-5; everything else 4-4-4-4. Detect as soon as we can.
    if (/^3[47]/.test(digits)) {
      return [digits.slice(0, 4), digits.slice(4, 10), digits.slice(10, 15)].filter(Boolean).join(' ')
    }
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
  }

  function formatExpiry(raw: string) {
    const d = raw.replace(/\D/g, '').slice(0, 4)
    if (d.length <= 2) return d
    return `${d.slice(0, 2)}/${d.slice(2)}`
  }

  function onNumberInput(raw: string) {
    liveNumber = formatCardNumber(raw)
  }

  function onExpiryInput(raw: string) {
    liveExpiry = formatExpiry(raw)
  }

  function onCvcInput(raw: string) {
    const isAmex = /^3[47]/.test(liveNumber.replace(/\D/g, ''))
    liveCvc = raw.replace(/\D/g, '').slice(0, isAmex ? 4 : 3)
  }

  // Click-to-flip story.
  let flipOpen = $state(false)

  const inputClass =
    'flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50'
</script>

{#if story === 'Default'}
  <div class="flex justify-center py-4">
    <PaymentCard number="4242 4242 4242 4242" name="Jane Doe" expiry="12/29" />
  </div>
{/if}

{#if story === 'Flipped'}
  <div class="flex justify-center py-4">
    <PaymentCard number="4242 4242 4242 4242" name="Jane Doe" expiry="12/29" cvc="123" flipped />
  </div>
{/if}

{#if story === 'Brand auto-detect'}
  <div class="flex flex-col items-center gap-3 py-4">
    <PaymentCard number={typedNumber} name="Jane Doe" expiry="12/29" />
    <code class="text-xs text-muted-foreground">{typedNumber || '(typing…)'}</code>
  </div>
{/if}

{#if story === 'Live typing'}
  <div class="mx-auto flex w-full max-w-sm flex-col gap-4 py-4">
    <div class="flex justify-center">
      <PaymentCard
        number={liveNumber}
        name={liveName}
        expiry={liveExpiry}
        cvc={liveCvc}
        flipped={liveCvcFocused}
      />
    </div>
    <div class="grid gap-1.5">
      <label class="text-sm font-medium" for="demo-cc-number">Card number</label>
      <input
        id="demo-cc-number"
        value={liveNumber}
        oninput={(e) => onNumberInput(e.currentTarget.value)}
        inputmode="numeric"
        autocomplete="cc-number"
        placeholder="4242 4242 4242 4242"
        class={inputClass}
      />
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="grid gap-1.5">
        <label class="text-sm font-medium" for="demo-cc-name">Name</label>
        <input
          id="demo-cc-name"
          bind:value={liveName}
          autocomplete="cc-name"
          placeholder="Jane Doe"
          class={inputClass}
        />
      </div>
      <div class="grid gap-1.5">
        <label class="text-sm font-medium" for="demo-cc-expiry">Expiry</label>
        <input
          id="demo-cc-expiry"
          value={liveExpiry}
          oninput={(e) => onExpiryInput(e.currentTarget.value)}
          inputmode="numeric"
          autocomplete="cc-exp"
          placeholder="MM/YY"
          class={inputClass}
        />
      </div>
    </div>
    <div class="grid gap-1.5">
      <label class="text-sm font-medium" for="demo-cc-cvc">CVC</label>
      <input
        id="demo-cc-cvc"
        value={liveCvc}
        oninput={(e) => onCvcInput(e.currentTarget.value)}
        inputmode="numeric"
        autocomplete="cc-csc"
        placeholder="123"
        onfocus={() => (liveCvcFocused = true)}
        onblur={() => (liveCvcFocused = false)}
        class={inputClass}
      />
    </div>
  </div>
{/if}

{#if story === 'Click to flip'}
  <div class="flex flex-col items-center gap-4 py-4">
    <PaymentCard number="5454 5454 5454 5454" name="Jane Doe" expiry="08/27" cvc="917" flipped={flipOpen} />
    <Button variant="outline" size="sm" onclick={() => (flipOpen = !flipOpen)}>
      {flipOpen ? 'Show front' : 'Show back'}
    </Button>
  </div>
{/if}

{#if story === 'Tilt + shimmer'}
  <div class="flex justify-center py-6">
    <PaymentCard number="5454 5454 5454 5454" name="Jane Doe" expiry="08/27" tilt shimmer />
  </div>
{/if}

{#if story === 'Empty / placeholder'}
  <div class="flex justify-center py-4">
    <PaymentCard name="" expiry="" />
  </div>
{/if}

{#if story === 'Compact variant'}
  <div class="flex flex-wrap items-center justify-center gap-3 py-4">
    <PaymentCard number="4242 4242 4242 4242" expiry="12/29" variant="compact" flip={false} />
    <PaymentCard number="5454 5454 5454 5454" expiry="08/27" variant="compact" flip={false} />
    <PaymentCard number="3782 822463 10005" expiry="03/30" variant="compact" flip={false} />
    <PaymentCard number="6011 1111 1111 1117" expiry="11/28" variant="compact" flip={false} />
  </div>
{/if}

{#if story === 'All brands'}
  <div class="grid grid-cols-1 gap-3 py-4 sm:grid-cols-2">
    <PaymentCard number="4111 1111 1111 1111" name="Jane Doe" expiry="12/29" brand="visa" />
    <PaymentCard number="5555 5555 5555 4444" name="Jane Doe" expiry="08/27" brand="mastercard" />
    <PaymentCard number="3782 822463 10005" name="Jane Doe" expiry="03/30" brand="amex" />
    <PaymentCard number="6011 1111 1111 1117" name="Jane Doe" expiry="11/28" brand="discover" />
  </div>
{/if}

{#if story === 'Sizes'}
  <div class="flex flex-wrap items-end justify-center gap-4 py-4">
    <PaymentCard number="4242 4242 4242 4242" expiry="12/29" size="sm" />
    <PaymentCard number="4242 4242 4242 4242" expiry="12/29" size="md" />
    <PaymentCard number="4242 4242 4242 4242" expiry="12/29" size="lg" />
  </div>
{/if}
