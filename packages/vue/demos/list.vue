<script setup lang="ts">
import {
  List,
  ListItem,
  ListItemMedia,
  ListItemContent,
  ListItemTitle,
  ListItemDescription,
  ListItemActions,
  ListSubheader,
} from "@/components/ui/list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  ExternalLink,
  Bell,
  Lock,
  CreditCard,
  User,
  Sparkles,
} from "lucide-vue-next";

const settings = [
  { id: 1, label: "Profile", desc: "Public profile and settings", icon: User },
  {
    id: 2,
    label: "Notifications",
    desc: "Email and push preferences",
    icon: Bell,
  },
  {
    id: 3,
    label: "Billing",
    desc: "Plan, payment, invoices",
    icon: CreditCard,
  },
  { id: 4, label: "Security", desc: "2FA, sessions, audit log", icon: Lock },
];

const docs = [
  { label: "Getting started", href: "#" },
  { label: "Components", href: "#" },
  { label: "Theming", href: "#" },
  { label: "CLI reference", href: "#" },
];
</script>

<template>
  <Story
    title="Default"
    description="Vertical list with two-line items and a trailing chevron, suitable for settings menus."
  >
    <List class="max-w-md">
      <ListItem
        v-for="i in settings"
        :key="i.id"
        class="flex items-center gap-3"
      >
        <component :is="i.icon" class="text-muted-foreground size-4" />
        <div class="flex-1">
          <p class="text-sm font-medium">{{ i.label }}</p>
          <p class="text-muted-foreground text-xs">{{ i.desc }}</p>
        </div>
        <ChevronRight class="text-muted-foreground size-4" />
      </ListItem>
    </List>
  </Story>

  <Story
    title="With subheaders"
    description="ListSubheader groups items into labeled sections inside a single list."
  >
    <List class="max-w-md">
      <ListSubheader>Account</ListSubheader>
      <ListItem class="flex items-center gap-2"
        ><User class="text-muted-foreground size-4" />Profile</ListItem
      >
      <ListItem class="flex items-center gap-2"
        ><Lock class="text-muted-foreground size-4" />Security</ListItem
      >
      <ListSubheader>Workspace</ListSubheader>
      <ListItem class="flex items-center gap-2"
        ><Bell class="text-muted-foreground size-4" />Notifications</ListItem
      >
      <ListItem class="flex items-center gap-2"
        ><CreditCard class="text-muted-foreground size-4" />Billing</ListItem
      >
    </List>
  </Story>

  <Story
    title="Active state"
    description="Set active on a ListItem to highlight the current selection."
  >
    <List class="max-w-md">
      <ListItem>Inbox</ListItem>
      <ListItem :active="true">Drafts</ListItem>
      <ListItem>Sent</ListItem>
      <ListItem>Archive</ListItem>
      <ListItem>Trash</ListItem>
    </List>
  </Story>

  <Story
    title="Disabled state"
    description="Disabled items are dimmed and ignore pointer events."
  >
    <List class="max-w-md">
      <ListItem>Available</ListItem>
      <ListItem :disabled="true">Unavailable (disabled)</ListItem>
      <ListItem>Available</ListItem>
      <ListItem :disabled="true">Coming soon</ListItem>
    </List>
  </Story>

  <Story
    title="Anchor links"
    description="Render items as anchors by setting the as prop on List and ListItem."
  >
    <List as="ul" class="max-w-md">
      <ListItem
        v-for="d in docs"
        :key="d.label"
        as="a"
        :href="d.href"
        class="flex items-center justify-between"
      >
        <span class="text-sm">{{ d.label }}</span>
        <ExternalLink class="text-muted-foreground size-3.5" />
      </ListItem>
    </List>
  </Story>

  <Story
    title="Structured Item Rows"
    description="Compound ListItemMedia, ListItemContent, and ListItemActions for settings and rich list feeds."
  >
    <List class="max-w-md space-y-1">
      <ListItem class="border-border hover:bg-muted/40 rounded-lg border p-2.5">
        <ListItemMedia>
          <div
            class="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full"
          >
            <Sparkles class="size-4" />
          </div>
        </ListItemMedia>
        <ListItemContent>
          <ListItemTitle>AI Copilot Assistant</ListItemTitle>
          <ListItemDescription
            >Automatic smart recommendations & summaries</ListItemDescription
          >
        </ListItemContent>
        <ListItemActions>
          <Badge variant="secondary">Pro</Badge>
          <Button size="xs" variant="outline">Configure</Button>
        </ListItemActions>
      </ListItem>

      <ListItem class="border-border hover:bg-muted/40 rounded-lg border p-2.5">
        <ListItemMedia>
          <div
            class="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-full"
          >
            <Lock class="size-4" />
          </div>
        </ListItemMedia>
        <ListItemContent>
          <ListItemTitle>Two-Factor Authentication</ListItemTitle>
          <ListItemDescription
            >Enabled via authenticator app</ListItemDescription
          >
        </ListItemContent>
        <ListItemActions>
          <Badge variant="outline" class="text-success border-success/30"
            >Active</Badge
          >
        </ListItemActions>
      </ListItem>
    </List>
  </Story>
</template>
