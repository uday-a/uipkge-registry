<script setup lang="ts">
import { ref } from 'vue'
import { Fab } from '@/components/ui/fab'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Edit, Mail, MessageSquare, Plus, Send, Trash2 } from 'lucide-vue-next'

const clicks = ref(0)
</script>

<template>
  <Story
    title="In a settings panel"
    description="A primary action FAB anchored to the bottom-right of a card — the classic 'add new' affordance in a list view."
  >
    <Card class="relative max-w-md overflow-hidden">
      <CardHeader>
        <CardTitle>Team members</CardTitle>
        <CardDescription>5 of 10 seats used.</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-2">
          <div class="bg-muted/40 flex items-center justify-between rounded-md px-3 py-2 text-sm">
            <span>Alex Morgan</span>
            <span class="text-muted-foreground text-xs">Owner</span>
          </div>
          <div class="bg-muted/40 flex items-center justify-between rounded-md px-3 py-2 text-sm">
            <span>Priya Sharma</span>
            <span class="text-muted-foreground text-xs">Admin</span>
          </div>
          <div class="bg-muted/40 flex items-center justify-between rounded-md px-3 py-2 text-sm">
            <span>Diego Reyes</span>
            <span class="text-muted-foreground text-xs">Editor</span>
          </div>
        </div>
      </CardContent>
      <Fab absolute position="bottom-right" aria-label="Invite member" @click="clicks++"><Plus /></Fab>
    </Card>
    <p class="text-muted-foreground mt-3 text-xs">Invites triggered: {{ clicks }}</p>
  </Story>

  <Story
    title="Variants & sizes"
    description="All four color variants and three circular sizes in one row, so the visual weight reads at a glance."
  >
    <div class="flex flex-wrap items-center gap-8">
      <div class="flex items-center gap-4">
        <Fab position="inline" aria-label="Add"><Plus /></Fab>
        <Fab variant="secondary" position="inline" aria-label="Edit"><Edit /></Fab>
        <Fab variant="destructive" position="inline" aria-label="Delete"><Trash2 /></Fab>
        <Fab variant="outline" position="inline" aria-label="Send"><Send /></Fab>
      </div>
      <div class="flex items-center gap-4">
        <Fab size="mini" position="inline" aria-label="Mini"><Plus /></Fab>
        <Fab size="default" position="inline" aria-label="Default"><Plus /></Fab>
        <Fab size="large" position="inline" aria-label="Large"><Plus /></Fab>
      </div>
    </div>
  </Story>

  <Story
    title="Extended FAB"
    description="Pass label to render a pill-shaped extended FAB — used for the primary action on a screen when a label aids discoverability."
  >
    <div class="flex flex-wrap items-center gap-4">
      <Fab label="Compose" position="inline"><Mail /></Fab>
      <Fab label="New message" variant="secondary" position="inline"><MessageSquare /></Fab>
    </div>
  </Story>

  <Story
    title="Positioning"
    description="Five anchor positions rendered inside a positioned preview box. In a real page these are fixed to the viewport."
  >
    <div class="border-border relative h-56 w-full overflow-hidden rounded-md border">
      <Fab position="top-left" aria-label="Top left"><Plus /></Fab>
      <Fab position="top-right" aria-label="Top right"><Plus /></Fab>
      <Fab position="bottom-left" aria-label="Bottom left"><Plus /></Fab>
      <Fab position="bottom-right" aria-label="Bottom right"><Plus /></Fab>
      <Fab position="bottom-center" label="Center" aria-label="Bottom center"><Plus /></Fab>
    </div>
  </Story>

  <Story
    title="With badge"
    description="Layer a notification count over the FAB — common for a messaging compose button with unread drafts."
  >
    <div class="relative w-fit">
      <Fab position="inline" aria-label="Messages"><Mail /></Fab>
      <span
        class="bg-destructive text-destructive-foreground absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-semibold"
        >3</span
      >
    </div>
  </Story>

  <Story title="Disabled" description="Non-interactive FABs are dimmed and ignore clicks.">
    <div class="flex items-center gap-4">
      <Fab disabled position="inline" aria-label="Disabled"><Plus /></Fab>
      <Fab disabled label="Disabled" position="inline"><Plus /></Fab>
    </div>
  </Story>

  <Story
    title="Fixed to viewport"
    description="A real fixed FAB pinned to the demo viewport bottom-right. Scroll the page — it stays put."
  >
    <p class="text-muted-foreground max-w-md text-sm">
      The button in the corner is live. It remains anchored to the viewport as you scroll.
    </p>
    <Fab label="Action" aria-label="Fixed action"><Plus /></Fab>
  </Story>
</template>
