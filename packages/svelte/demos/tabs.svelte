<script lang="ts">
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '@svelte-registry/tabs'
  import {
    Activity,
    Bell,
    CreditCard,
    Globe,
    Lock,
    Mail,
    Settings,
    Shield,
    User,
    Users,
  } from '@lucide/svelte'

  let { story }: { story: string } = $props()
</script>

{#if story === 'Default'}
  <Tabs defaultValue="account" class="max-w-md">
    <TabsList>
      <TabsTrigger value="account">Account</TabsTrigger>
      <TabsTrigger value="password">Password</TabsTrigger>
      <TabsTrigger value="team">Team</TabsTrigger>
    </TabsList>
    <TabsContent value="account">
      <p class="p-3 text-sm">Tabs let users switch between related sections without navigation.</p>
    </TabsContent>
    <TabsContent value="password">
      <p class="text-muted-foreground p-3 text-sm">Password fields go here.</p>
    </TabsContent>
    <TabsContent value="team">
      <p class="text-muted-foreground p-3 text-sm">Team management UI goes here.</p>
    </TabsContent>
  </Tabs>
{/if}

{#if story === 'Overflow scroll'}
  <Tabs defaultValue="overview" class="max-w-sm">
    <TabsList>
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="deployments">Deployments</TabsTrigger>
      <TabsTrigger value="observability">Observability</TabsTrigger>
      <TabsTrigger value="access-control">Access control</TabsTrigger>
      <TabsTrigger value="billing">Billing</TabsTrigger>
    </TabsList>
    <TabsContent value="overview">
      <p class="p-3 text-sm">Scroll the tab row — every trigger stays reachable.</p>
    </TabsContent>
    <TabsContent value="billing">
      <p class="text-muted-foreground p-3 text-sm">Billing settings go here.</p>
    </TabsContent>
  </Tabs>
{/if}

{#if story === 'Vertical orientation'}
  <Tabs defaultValue="profile" orientation="vertical" class="max-w-xl">
    <TabsList class="w-48 shrink-0">
      <TabsTrigger value="profile"><User class="size-4" /> Profile</TabsTrigger>
      <TabsTrigger value="notifications"><Bell class="size-4" /> Notifications</TabsTrigger>
      <TabsTrigger value="security"><Shield class="size-4" /> Security</TabsTrigger>
      <TabsTrigger value="billing"><CreditCard class="size-4" /> Billing</TabsTrigger>
    </TabsList>
    <TabsContent value="profile">
      <p class="text-sm">Update your profile information and avatar.</p>
    </TabsContent>
    <TabsContent value="notifications">
      <p class="text-sm">Manage email and push notification preferences.</p>
    </TabsContent>
    <TabsContent value="security">
      <p class="text-sm">Configure two-factor authentication and active sessions.</p>
    </TabsContent>
    <TabsContent value="billing">
      <p class="text-sm">View invoices and update your payment method.</p>
    </TabsContent>
  </Tabs>
{/if}

{#if story === 'Underline variant'}
  <Tabs defaultValue="overview" class="max-w-xl">
    <TabsList variant="underline">
      <TabsTrigger value="overview" variant="underline">Overview</TabsTrigger>
      <TabsTrigger value="analytics" variant="underline">Analytics</TabsTrigger>
      <TabsTrigger value="reports" variant="underline">Reports</TabsTrigger>
      <TabsTrigger value="settings" variant="underline">Settings</TabsTrigger>
    </TabsList>
    <TabsContent value="overview">
      <p class="text-muted-foreground p-3 text-sm">Overview content.</p>
    </TabsContent>
    <TabsContent value="analytics">
      <p class="text-muted-foreground p-3 text-sm">Analytics content.</p>
    </TabsContent>
    <TabsContent value="reports">
      <p class="text-muted-foreground p-3 text-sm">Reports content.</p>
    </TabsContent>
    <TabsContent value="settings">
      <p class="text-muted-foreground p-3 text-sm">Settings content.</p>
    </TabsContent>
  </Tabs>
{/if}

{#if story === 'Pill variant'}
  <Tabs defaultValue="day" class="max-w-md">
    <TabsList variant="pill">
      <TabsTrigger value="day" variant="pill">Day</TabsTrigger>
      <TabsTrigger value="week" variant="pill">Week</TabsTrigger>
      <TabsTrigger value="month" variant="pill">Month</TabsTrigger>
      <TabsTrigger value="year" variant="pill">Year</TabsTrigger>
    </TabsList>
    <TabsContent value="day"><p class="text-muted-foreground p-3 text-sm">Daily breakdown.</p></TabsContent>
    <TabsContent value="week"><p class="text-muted-foreground p-3 text-sm">Weekly trends.</p></TabsContent>
    <TabsContent value="month"><p class="text-muted-foreground p-3 text-sm">Monthly summary.</p></TabsContent>
    <TabsContent value="year"><p class="text-muted-foreground p-3 text-sm">Yearly review.</p></TabsContent>
  </Tabs>
{/if}

{#if story === 'With disabled tab'}
  <Tabs defaultValue="overview" class="max-w-md">
    <TabsList>
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="analytics">Analytics</TabsTrigger>
      <TabsTrigger value="reports" disabled>Reports (pro)</TabsTrigger>
      <TabsTrigger value="settings">Settings</TabsTrigger>
    </TabsList>
    <TabsContent value="overview">
      <p class="text-muted-foreground p-3 text-sm">Overview content.</p>
    </TabsContent>
    <TabsContent value="analytics">
      <p class="text-muted-foreground p-3 text-sm">Analytics content.</p>
    </TabsContent>
    <TabsContent value="settings">
      <p class="text-muted-foreground p-3 text-sm">Settings content.</p>
    </TabsContent>
  </Tabs>
{/if}

{#if story === 'Many tabs (overflow)'}
  <Tabs defaultValue="general" class="w-full max-w-2xl">
    <div class="overflow-x-auto">
      <TabsList class="w-max">
        <TabsTrigger value="general"><Settings class="size-4" /> General</TabsTrigger>
        <TabsTrigger value="users"><Users class="size-4" /> Users</TabsTrigger>
        <TabsTrigger value="security"><Lock class="size-4" /> Security</TabsTrigger>
        <TabsTrigger value="email"><Mail class="size-4" /> Email</TabsTrigger>
        <TabsTrigger value="billing"><CreditCard class="size-4" /> Billing</TabsTrigger>
        <TabsTrigger value="locale"><Globe class="size-4" /> Locale</TabsTrigger>
        <TabsTrigger value="metrics"><Activity class="size-4" /> Metrics</TabsTrigger>
        <TabsTrigger value="audit"><Shield class="size-4" /> Audit</TabsTrigger>
      </TabsList>
    </div>
    <TabsContent value="general"><p class="text-muted-foreground p-3 text-sm">General settings.</p></TabsContent>
    <TabsContent value="users"><p class="text-muted-foreground p-3 text-sm">User management.</p></TabsContent>
    <TabsContent value="security"><p class="text-muted-foreground p-3 text-sm">Security policies.</p></TabsContent>
    <TabsContent value="email"><p class="text-muted-foreground p-3 text-sm">Email configuration.</p></TabsContent>
    <TabsContent value="billing"><p class="text-muted-foreground p-3 text-sm">Billing details.</p></TabsContent>
    <TabsContent value="locale"><p class="text-muted-foreground p-3 text-sm">Locale and timezone.</p></TabsContent>
    <TabsContent value="metrics"><p class="text-muted-foreground p-3 text-sm">Metrics dashboard.</p></TabsContent>
    <TabsContent value="audit"><p class="text-muted-foreground p-3 text-sm">Audit log.</p></TabsContent>
  </Tabs>
{/if}

{#if story === 'Card-wrapped content'}
  <Tabs defaultValue="account" class="max-w-md">
    <TabsList>
      <TabsTrigger value="account">Account</TabsTrigger>
      <TabsTrigger value="password">Password</TabsTrigger>
      <TabsTrigger value="team">Team</TabsTrigger>
    </TabsList>
    <TabsContent value="account">
      <div class="bg-card rounded-lg border p-6">
        <h3 class="font-semibold">Account</h3>
        <p class="text-muted-foreground text-sm">Make changes to your account here.</p>
        <p class="mt-2 text-sm">Tabs let users switch between related sections without navigation.</p>
      </div>
    </TabsContent>
    <TabsContent value="password">
      <div class="bg-card rounded-lg border p-6">
        <h3 class="font-semibold">Password</h3>
        <p class="text-muted-foreground text-sm">Change your password.</p>
        <p class="text-muted-foreground mt-2 text-sm">Password fields go here.</p>
      </div>
    </TabsContent>
    <TabsContent value="team">
      <div class="bg-card rounded-lg border p-6">
        <h3 class="font-semibold">Team</h3>
        <p class="text-muted-foreground text-sm">Manage your team.</p>
        <p class="text-muted-foreground mt-2 text-sm">Team management UI goes here.</p>
      </div>
    </TabsContent>
  </Tabs>
{/if}
