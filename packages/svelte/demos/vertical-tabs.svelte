<script lang="ts">
  import { Button } from '@svelte-registry/button'
  import {
    VerticalTabs,
    VerticalTabsContent,
    VerticalTabsList,
    VerticalTabsSection,
    VerticalTabsTrigger,
  } from '@svelte-registry/vertical-tabs'
  import {
    AlertTriangle,
    Bell,
    GitBranch,
    Key,
    RefreshCw,
    Settings,
    Shield,
    User,
  } from '@lucide/svelte'

  let { story }: { story: string } = $props()

  // Settings-with-forms demo state. Mock save handler so the demo emits
  // to the console rather than hitting a backend.
  let profile = $state({
    name: 'Alex Morgan',
    email: 'alex@example.com',
    bio: 'Frontend engineer working on dashboards and design systems.',
  })
  let security = $state({ twoFactor: true, sessionTimeout: '30' })
  let notifications = $state({ productUpdates: true, weeklyDigest: false, securityAlerts: true })

  function onSave(section: string) {
    // eslint-disable-next-line no-console
    console.log(`saved ${section}`, { profile, security, notifications })
  }

  const inputClass =
    'border-input bg-background focus-visible:ring-ring/50 flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2'
  const labelClass = 'text-sm font-medium'
  const hintClass = 'text-muted-foreground text-xs'
</script>

{#if story === 'With forms (settings page)'}
  <div class="bg-card rounded-lg border p-6">
    <VerticalTabs defaultValue="profile">
      <VerticalTabsList>
        <VerticalTabsTrigger value="profile">
          <User />
          Profile
        </VerticalTabsTrigger>
        <VerticalTabsTrigger value="security">
          <Shield />
          Security
        </VerticalTabsTrigger>
        <VerticalTabsTrigger value="notifications">
          <Bell />
          Notifications
        </VerticalTabsTrigger>
      </VerticalTabsList>

      <VerticalTabsContent value="profile">
        <form class="space-y-5" onsubmit={(e) => { e.preventDefault(); onSave('profile') }}>
          <div>
            <h3 class="text-lg font-semibold">Profile</h3>
            <p class="text-muted-foreground mt-0.5 text-sm">How your account appears to teammates.</p>
          </div>
          <hr class="border-border" />
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="grid gap-1.5">
              <label class={labelClass} for="settings-name">Full name</label>
              <input id="settings-name" class={inputClass} bind:value={profile.name} />
            </div>
            <div class="grid gap-1.5">
              <label class={labelClass} for="settings-email">Email</label>
              <input id="settings-email" class={inputClass} bind:value={profile.email} type="email" />
            </div>
          </div>
          <div class="grid gap-1.5">
            <label class={labelClass} for="settings-bio">Bio</label>
            <textarea id="settings-bio" class={inputClass + ' h-auto min-h-16'} rows="3" bind:value={profile.bio}></textarea>
            <p class={hintClass}>Markdown supported. Shows on your public profile.</p>
          </div>
          <div class="flex justify-end gap-2">
            <Button type="button" variant="ghost">Cancel</Button>
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </VerticalTabsContent>

      <VerticalTabsContent value="security">
        <form class="space-y-5" onsubmit={(e) => { e.preventDefault(); onSave('security') }}>
          <div>
            <h3 class="text-lg font-semibold">Security</h3>
            <p class="text-muted-foreground mt-0.5 text-sm">Sign-in protection and session lifetime.</p>
          </div>
          <hr class="border-border" />
          <div class="flex items-center justify-between gap-4">
            <div class="space-y-0.5">
              <p class={labelClass}>Two-factor authentication</p>
              <p class={hintClass}>Require a one-time code on every new device.</p>
            </div>
            <input type="checkbox" class="accent-primary size-4" bind:checked={security.twoFactor} aria-label="Two-factor authentication" />
          </div>
          <div class="grid gap-1.5">
            <label class={labelClass} for="settings-timeout">Session timeout (minutes)</label>
            <input
              id="settings-timeout"
              class={inputClass}
              bind:value={security.sessionTimeout}
              type="number"
              min="5"
              max="240"
            />
          </div>
          <div class="flex justify-end gap-2">
            <Button type="button" variant="ghost">Cancel</Button>
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </VerticalTabsContent>

      <VerticalTabsContent value="notifications">
        <form class="space-y-5" onsubmit={(e) => { e.preventDefault(); onSave('notifications') }}>
          <div>
            <h3 class="text-lg font-semibold">Notifications</h3>
            <p class="text-muted-foreground mt-0.5 text-sm">
              Which emails we send to <span class="text-foreground font-medium">{profile.email}</span>.
            </p>
          </div>
          <hr class="border-border" />
          <div class="space-y-3">
            <div class="flex items-center justify-between gap-4">
              <div class="space-y-0.5">
                <p class={labelClass}>Product updates</p>
                <p class={hintClass}>Feature releases, breaking changes, deprecations.</p>
              </div>
              <input type="checkbox" class="accent-primary size-4" bind:checked={notifications.productUpdates} aria-label="Product updates" />
            </div>
            <div class="flex items-center justify-between gap-4">
              <div class="space-y-0.5">
                <p class={labelClass}>Weekly digest</p>
                <p class={hintClass}>Activity summary every Monday morning.</p>
              </div>
              <input type="checkbox" class="accent-primary size-4" bind:checked={notifications.weeklyDigest} aria-label="Weekly digest" />
            </div>
            <div class="flex items-center justify-between gap-4">
              <div class="space-y-0.5">
                <p class={labelClass}>Security alerts</p>
                <p class={hintClass}>New sign-ins, password changes. We recommend keeping these on.</p>
              </div>
              <input type="checkbox" class="accent-primary size-4" bind:checked={notifications.securityAlerts} aria-label="Security alerts" />
            </div>
          </div>
          <div class="flex justify-end gap-2">
            <Button type="button" variant="ghost">Cancel</Button>
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </VerticalTabsContent>
    </VerticalTabs>
  </div>
{/if}

{#if story === 'Default'}
  <div class="bg-card rounded-lg border p-6">
    <VerticalTabs defaultValue="general">
      <VerticalTabsList>
        <VerticalTabsSection label="Project" />
        <VerticalTabsTrigger value="general">
          <Settings />
          General
        </VerticalTabsTrigger>
        <VerticalTabsTrigger value="sync">
          <RefreshCw />
          Sync
        </VerticalTabsTrigger>
        <VerticalTabsSection label="Integrations" />
        <VerticalTabsTrigger value="git-sync">
          <GitBranch />
          Git Sync
        </VerticalTabsTrigger>
        <VerticalTabsTrigger value="api-key">
          <Key />
          API Key
        </VerticalTabsTrigger>
        <VerticalTabsSection label="Danger" />
        <VerticalTabsTrigger value="danger" class="text-destructive hover:text-destructive">
          <AlertTriangle />
          Danger Zone
        </VerticalTabsTrigger>
      </VerticalTabsList>

      <VerticalTabsContent value="general">
        <h3 class="text-lg font-semibold">General</h3>
        <p class="text-muted-foreground mt-1 text-sm">Basic project information and settings.</p>
      </VerticalTabsContent>
      <VerticalTabsContent value="sync">
        <h3 class="text-lg font-semibold">Sync</h3>
        <p class="text-muted-foreground mt-1 text-sm">Configure scheduled translation sync.</p>
      </VerticalTabsContent>
      <VerticalTabsContent value="git-sync">
        <h3 class="text-lg font-semibold">Git Sync</h3>
        <p class="text-muted-foreground mt-1 text-sm">Connect your repository for two-way sync.</p>
      </VerticalTabsContent>
      <VerticalTabsContent value="api-key">
        <h3 class="text-lg font-semibold">API Key</h3>
        <p class="text-muted-foreground mt-1 text-sm">Manage credentials used by your app.</p>
      </VerticalTabsContent>
      <VerticalTabsContent value="danger">
        <h3 class="text-destructive text-lg font-semibold">Danger Zone</h3>
        <p class="text-muted-foreground mt-1 text-sm">Permanently delete this project.</p>
      </VerticalTabsContent>
    </VerticalTabs>
  </div>
{/if}

{#if story === 'Without sections'}
  <div class="bg-card rounded-lg border p-6">
    <VerticalTabs defaultValue="profile">
      <VerticalTabsList>
        <VerticalTabsTrigger value="profile">
          <User />
          Profile
        </VerticalTabsTrigger>
        <VerticalTabsTrigger value="security">
          <Shield />
          Security
        </VerticalTabsTrigger>
        <VerticalTabsTrigger value="notifications">
          <Settings />
          Notifications
        </VerticalTabsTrigger>
      </VerticalTabsList>
      <VerticalTabsContent value="profile">
        <p class="text-muted-foreground text-sm">Profile preferences.</p>
      </VerticalTabsContent>
      <VerticalTabsContent value="security">
        <p class="text-muted-foreground text-sm">Two-factor and password options.</p>
      </VerticalTabsContent>
      <VerticalTabsContent value="notifications">
        <p class="text-muted-foreground text-sm">Email + in-app notification controls.</p>
      </VerticalTabsContent>
    </VerticalTabs>
  </div>
{/if}

{#if story === 'Disabled item'}
  <div class="bg-card rounded-lg border p-6">
    <VerticalTabs defaultValue="active">
      <VerticalTabsList>
        <VerticalTabsTrigger value="active">
          <Settings />
          Active option
        </VerticalTabsTrigger>
        <VerticalTabsTrigger value="locked" disabled>
          <Shield />
          Locked option
        </VerticalTabsTrigger>
        <VerticalTabsTrigger value="other">
          <User />
          Other
        </VerticalTabsTrigger>
      </VerticalTabsList>
      <VerticalTabsContent value="active">
        <p class="text-muted-foreground text-sm">Selectable.</p>
      </VerticalTabsContent>
      <VerticalTabsContent value="other">
        <p class="text-muted-foreground text-sm">Also selectable.</p>
      </VerticalTabsContent>
    </VerticalTabs>
  </div>
{/if}

{#if story === 'Compact (no icons)'}
  <div class="bg-card rounded-lg border p-6">
    <VerticalTabs defaultValue="overview">
      <VerticalTabsList class="w-44">
        <VerticalTabsTrigger value="overview">Overview</VerticalTabsTrigger>
        <VerticalTabsTrigger value="usage">Usage</VerticalTabsTrigger>
        <VerticalTabsTrigger value="billing">Billing</VerticalTabsTrigger>
        <VerticalTabsTrigger value="invoices">Invoices</VerticalTabsTrigger>
      </VerticalTabsList>
      <VerticalTabsContent value="overview">
        <p class="text-muted-foreground text-sm">Account summary.</p>
      </VerticalTabsContent>
      <VerticalTabsContent value="usage">
        <p class="text-muted-foreground text-sm">Resource usage breakdown.</p>
      </VerticalTabsContent>
      <VerticalTabsContent value="billing">
        <p class="text-muted-foreground text-sm">Plan and payment method.</p>
      </VerticalTabsContent>
      <VerticalTabsContent value="invoices">
        <p class="text-muted-foreground text-sm">Past invoices.</p>
      </VerticalTabsContent>
    </VerticalTabs>
  </div>
{/if}

{#if story === 'Static indicator'}
  <div class="bg-card rounded-lg border p-6">
    <VerticalTabs defaultValue="profile">
      <VerticalTabsList animated={false}>
        <VerticalTabsTrigger value="profile">
          <User />
          Profile
        </VerticalTabsTrigger>
        <VerticalTabsTrigger value="security">
          <Shield />
          Security
        </VerticalTabsTrigger>
        <VerticalTabsTrigger value="notifications">
          <Bell />
          Notifications
        </VerticalTabsTrigger>
      </VerticalTabsList>
      <VerticalTabsContent value="profile">
        <p class="text-muted-foreground text-sm">Static chrome — no slide between items.</p>
      </VerticalTabsContent>
      <VerticalTabsContent value="security">
        <p class="text-muted-foreground text-sm">Active styles snap instantly.</p>
      </VerticalTabsContent>
      <VerticalTabsContent value="notifications">
        <p class="text-muted-foreground text-sm">Useful when motion is undesired.</p>
      </VerticalTabsContent>
    </VerticalTabs>
  </div>
{/if}
