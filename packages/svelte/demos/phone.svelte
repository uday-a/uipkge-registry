<script lang="ts">
  import { Phone } from '@svelte-registry/phone'
  import hrmsScreenshot from '../../assets/templates/hrms.jpeg?url'
  import trackingScreenshot from '../../assets/templates/tracking.jpeg?url'

  let { story }: { story: string } = $props()

  const transactions = ['Coffee shop', 'Metro card', 'Payroll']
  const schedule: Array<[string, string]> = [
    ['09:00', 'Standup'],
    ['11:30', 'Design review'],
    ['15:00', 'Ship checklist'],
  ]
</script>

{#if story === 'Marketing screenshots'}
  <div class="grid place-items-center gap-12 py-10 lg:grid-cols-2">
    <Phone model="iphone-17-pro" color="deep-blue" showStatusBar={false} showHomeIndicator={false}>
      <img
        src={hrmsScreenshot}
        alt="HR management dashboard"
        class="absolute inset-0 size-full object-cover object-left"
      />
      <div
        class="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 via-black/55 to-transparent p-5 pt-24 text-white"
      >
        <p class="text-xs font-medium tracking-[0.18em] text-white/65 uppercase">Workforce</p>
        <p class="mt-1 text-xl font-semibold tracking-tight">Your team, in focus.</p>
      </div>
    </Phone>

    <Phone model="galaxy-s26-ultra" color="cobalt-violet" showStatusBar={false} showNavBar={false}>
      <img
        src={trackingScreenshot}
        alt="Shipment tracking dashboard"
        class="absolute inset-0 size-full object-cover object-center"
      />
      <div
        class="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 via-black/55 to-transparent p-5 pt-24 text-white"
      >
        <p class="text-xs font-medium tracking-[0.18em] text-white/65 uppercase">Live tracking</p>
        <p class="mt-1 text-xl font-semibold tracking-tight">Every shipment. One view.</p>
      </div>
    </Phone>
  </div>
{/if}

{#if story === 'Device chrome'}
  <div class="flex flex-wrap items-end justify-center gap-12 py-10">
    <Phone model="iphone-17-pro" color="cosmic-orange">
      <div class="flex h-full flex-col bg-background px-4 pt-14 pb-7">
        <p class="text-xs text-muted-foreground">Good morning</p>
        <h3 class="text-xl font-semibold tracking-tight">Alex Morgan</h3>
        <div class="mt-5 rounded-[1.4rem] bg-primary p-4 text-primary-foreground">
          <p class="text-xs text-primary-foreground/70">Available balance</p>
          <p class="mt-1 text-2xl font-semibold tracking-tight">$4,280.00</p>
        </div>
        <div class="mt-4 flex flex-col gap-2">
          {#each transactions as item}
            <div class="flex items-center justify-between rounded-xl border bg-card px-3 py-2.5 text-xs">
              <span>{item}</span>
              <span class="text-muted-foreground tabular-nums">$12.40</span>
            </div>
          {/each}
        </div>
      </div>
    </Phone>

    <Phone model="galaxy-s26-ultra" color="titanium-black">
      <div class="flex h-full flex-col bg-muted/40 px-4 pt-12 pb-7">
        <p class="text-xs text-muted-foreground">Tuesday, 11 July</p>
        <h3 class="text-xl font-semibold tracking-tight">Schedule</h3>
        <div class="mt-5 flex flex-col gap-2">
          {#each schedule as [time, title], index (index)}
            <div class="rounded-[1.2rem] border bg-card p-3">
              <span class="text-xs text-muted-foreground tabular-nums">{time}</span>
              <p class="mt-1 text-sm font-medium">{title}</p>
            </div>
          {/each}
        </div>
      </div>
    </Phone>
  </div>
{/if}

{#if story === 'Finishes'}
  <div class="flex flex-wrap items-end justify-center gap-7 py-8">
    <Phone model="iphone-17-pro" color="cosmic-orange" size="sm" />
    <Phone model="iphone-17-pro" color="deep-blue" size="sm" />
    <Phone model="iphone-17-pro" color="silver" size="sm" />
    <Phone model="galaxy-s26-ultra" color="titanium-black" size="sm" />
    <Phone model="galaxy-s26-ultra" color="cobalt-violet" size="sm" />
  </div>
{/if}
