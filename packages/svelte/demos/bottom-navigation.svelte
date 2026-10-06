<script lang="ts">
  import { BottomNavigation, type BottomNavItem } from '@svelte-registry/bottom-navigation'
  import { Bell, Heart, Home, Inbox, Menu, Search, Settings, ShoppingCart, User } from '@lucide/svelte'

  let { story }: { story: string } = $props()

  let active = $state('home')
  let shopActive = $state('shop')
  let fiveActive = $state('a')
  let narrowActive = $state('a')

  const items: BottomNavItem[] = [
    { value: 'home', label: 'Home', icon: Home },
    { value: 'search', label: 'Search', icon: Search },
    { value: 'notifications', label: 'Alerts', icon: Bell, badge: 3 },
    { value: 'profile', label: 'Profile', icon: User },
  ]

  const shopItems: BottomNavItem[] = [
    { value: 'shop', label: 'Shop', icon: ShoppingCart },
    { value: 'saved', label: 'Saved', icon: Heart, badge: 12 },
    { value: 'inbox', label: 'Inbox', icon: Inbox, badge: '!' },
    { value: 'menu', label: 'More', icon: Menu },
  ]

  const fiveItems: BottomNavItem[] = [
    { value: 'a', label: 'Home', icon: Home },
    { value: 'b', label: 'Search', icon: Search },
    { value: 'c', label: 'Alerts', icon: Bell, badge: 5 },
    { value: 'd', label: 'Settings', icon: Settings },
    { value: 'e', label: 'Profile', icon: User },
  ]

  const narrowItems: BottomNavItem[] = [
    { value: 'a', label: 'Dashboard', icon: Home },
    { value: 'b', label: 'Notifications', icon: Bell, badge: 99 },
    { value: 'c', label: 'Account Settings', icon: Settings },
  ]

  const routerItems: BottomNavItem[] = [
    { value: 'home', label: 'Home', icon: Home, to: '/' },
    { value: 'about', label: 'About', icon: Search, to: '/about' },
    { value: 'settings', label: 'Settings', icon: Settings, to: '/settings' },
  ]

  const views: Record<string, string> = {
    home: 'Welcome back — your feed is up to date.',
    search: 'Search across products, orders, and stores.',
    notifications: '3 new alerts waiting for you.',
    profile: 'Manage your account and preferences.',
  }
</script>

{#if story === 'Mobile app shell'}
  <div class="border-border mx-auto w-full max-w-sm overflow-hidden rounded-2xl border shadow-sm">
    <div class="bg-background flex h-56 flex-col items-center justify-center gap-2 p-6 text-center">
      <p class="text-sm font-medium">{items.find((i) => i.value === active)?.label}</p>
      <p class="text-muted-foreground text-xs">{views[active]}</p>
    </div>
    <BottomNavigation {items} bind:value={active} fixed={false} />
  </div>
{/if}

{#if story === 'Shopping app with badges'}
  <div class="border-border mx-auto w-full max-w-sm overflow-hidden rounded-2xl border shadow-sm">
    <div class="bg-background flex h-48 flex-col items-center justify-center gap-1 p-6 text-center">
      <p class="text-sm font-medium">{shopItems.find((i) => i.value === shopActive)?.label}</p>
      <p class="text-muted-foreground text-xs">Your shopping hub</p>
    </div>
    <BottomNavigation items={shopItems} bind:value={shopActive} fixed={false} />
  </div>
{/if}

{#if story === 'Custom active color'}
  <div class="border-border mx-auto w-full max-w-sm overflow-hidden rounded-2xl border shadow-sm">
    <div class="bg-muted/30 text-muted-foreground flex h-40 items-center justify-center text-sm">Violet brand</div>
    <BottomNavigation {items} bind:value={active} fixed={false} activeColor="text-violet-600" />
  </div>
{/if}

{#if story === '5 tabs & no indicator'}
  <div class="grid max-w-md gap-4 sm:grid-cols-2">
    <div class="border-border overflow-hidden rounded-2xl border">
      <div class="bg-muted/30 text-muted-foreground flex h-36 items-center justify-center text-xs">Five tabs</div>
      <BottomNavigation items={fiveItems} bind:value={fiveActive} fixed={false} />
    </div>
    <div class="border-border overflow-hidden rounded-2xl border">
      <div class="bg-muted/30 text-muted-foreground flex h-36 items-center justify-center text-xs">No pill</div>
      <BottomNavigation {items} bind:value={active} fixed={false} showIndicator={false} />
    </div>
  </div>
{/if}

{#if story === 'Long labels on narrow screens'}
  <div class="border-border mx-auto w-full max-w-[200px] overflow-hidden rounded-2xl border">
    <div class="bg-muted/30 text-muted-foreground flex h-40 items-center justify-center text-xs">Narrow</div>
    <BottomNavigation items={narrowItems} bind:value={narrowActive} fixed={false} />
  </div>
{/if}

{#if story === 'Router integration'}
  <div class="border-border mx-auto w-full max-w-sm overflow-hidden rounded-2xl border">
    <div class="bg-muted/30 text-muted-foreground flex h-40 items-center justify-center text-xs">Router-ready</div>
    <BottomNavigation items={routerItems} fixed={false} />
  </div>
{/if}
