<script lang="ts">
  import {
    List,
    ListItem,
    ListItemActions,
    ListItemContent,
    ListItemDescription,
    ListItemMedia,
    ListItemTitle,
    ListSubheader,
  } from '@svelte-registry/list'
  import { Bell, ChevronRight, CreditCard, Globe, Moon, ShieldCheck } from '@lucide/svelte'

  let { story }: { story: string } = $props()
</script>

{#if story === 'Default'}
  <List class="max-w-sm">
    <ListItem>Dashboard</ListItem>
    <ListItem>Transactions</ListItem>
    <ListItem>Reports</ListItem>
    <ListItem>Settings</ListItem>
  </List>
{/if}

{#if story === 'With subheaders'}
  <List class="max-w-sm">
    <ListSubheader>Workspace</ListSubheader>
    <ListItem>Projects</ListItem>
    <ListItem>Members</ListItem>
    <ListSubheader>Billing</ListSubheader>
    <ListItem>Invoices</ListItem>
    <ListItem>Usage</ListItem>
  </List>
{/if}

{#if story === 'Active state'}
  <List class="max-w-sm">
    <ListItem onclick={() => {}}>Overview</ListItem>
    <ListItem active onclick={() => {}}>Analytics</ListItem>
    <ListItem onclick={() => {}}>Exports</ListItem>
  </List>
{/if}

{#if story === 'Disabled state'}
  <List class="max-w-sm">
    <ListItem onclick={() => {}}>Profile</ListItem>
    <ListItem disabled>Sessions</ListItem>
    <ListItem onclick={() => {}}>Notifications</ListItem>
  </List>
{/if}

{#if story === 'Anchor links'}
  <List class="max-w-sm">
    <ListItem as="a" href="/docs">Documentation</ListItem>
    <ListItem as="a" href="/changelog">Changelog</ListItem>
    <ListItem as="a" href="/status">Status page</ListItem>
  </List>
{/if}

{#if story === 'Structured item rows'}
  <List class="max-w-md">
    <ListItem onclick={() => {}}>
      <ListItemMedia>
        <span class="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-full">
          <Bell class="size-4" />
        </span>
      </ListItemMedia>
      <ListItemContent>
        <ListItemTitle>Notifications</ListItemTitle>
        <ListItemDescription>Email and push preferences</ListItemDescription>
      </ListItemContent>
      <ListItemActions>
        <ChevronRight class="size-4" />
      </ListItemActions>
    </ListItem>
    <ListItem onclick={() => {}}>
      <ListItemMedia>
        <span class="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-full">
          <Moon class="size-4" />
        </span>
      </ListItemMedia>
      <ListItemContent>
        <ListItemTitle>Appearance</ListItemTitle>
        <ListItemDescription>Light, dark, or system theme</ListItemDescription>
      </ListItemContent>
      <ListItemActions>
        <ChevronRight class="size-4" />
      </ListItemActions>
    </ListItem>
    <ListItem onclick={() => {}}>
      <ListItemMedia>
        <span class="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-full">
          <Globe class="size-4" />
        </span>
      </ListItemMedia>
      <ListItemContent>
        <ListItemTitle>Language & region</ListItemTitle>
        <ListItemDescription>English (US)</ListItemDescription>
      </ListItemContent>
      <ListItemActions>
        <ChevronRight class="size-4" />
      </ListItemActions>
    </ListItem>
    <ListItem onclick={() => {}}>
      <ListItemMedia>
        <span class="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-full">
          <ShieldCheck class="size-4" />
        </span>
      </ListItemMedia>
      <ListItemContent>
        <ListItemTitle>Security</ListItemTitle>
        <ListItemDescription>2FA enabled · 3 sessions</ListItemDescription>
      </ListItemContent>
      <ListItemActions>
        <ChevronRight class="size-4" />
      </ListItemActions>
    </ListItem>
    <ListItem onclick={() => {}}>
      <ListItemMedia>
        <span class="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-full">
          <CreditCard class="size-4" />
        </span>
      </ListItemMedia>
      <ListItemContent>
        <ListItemTitle>Billing</ListItemTitle>
        <ListItemDescription>Pro plan · renews Sep 30</ListItemDescription>
      </ListItemContent>
      <ListItemActions>
        <ChevronRight class="size-4" />
      </ListItemActions>
    </ListItem>
  </List>
{/if}
