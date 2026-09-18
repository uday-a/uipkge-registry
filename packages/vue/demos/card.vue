<script setup lang="ts">
import { ArrowUpRight, Check } from 'lucide-vue-next'
</script>

<template>
  <Story title="Simple" description="Header (title + description) plus content.">
    <Card class="max-w-md">
      <CardHeader>
        <CardTitle>Simple card</CardTitle>
        <CardDescription>A basic Card with header and content.</CardDescription>
      </CardHeader>
      <CardContent>
        <p class="text-sm">
          Cards group related content. They include headers, content, and footers — each as separate slots.
        </p>
      </CardContent>
    </Card>
  </Story>

  <Story title="With footer actions" description="CardFooter slot for save/cancel patterns.">
    <Card class="max-w-md">
      <CardHeader>
        <CardTitle>Edit profile</CardTitle>
        <CardDescription>Update your account details.</CardDescription>
      </CardHeader>
      <CardContent>
        <p class="text-muted-foreground text-sm">Form fields go here.</p>
      </CardContent>
      <CardFooter class="gap-2 border-t pt-4">
        <Button size="sm">Save</Button>
        <Button variant="ghost" size="sm">Cancel</Button>
      </CardFooter>
    </Card>
  </Story>

  <Story title="With header action" description="Secondary action in the top-right corner.">
    <Card class="max-w-md">
      <CardHeader>
        <div class="flex items-start justify-between">
          <div>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Last 7 days.</CardDescription>
          </div>
          <Button variant="ghost" size="icon-sm" class="-mt-1 -mr-2"><ArrowUpRight class="size-4" /></Button>
        </div>
      </CardHeader>
      <CardContent>
        <p class="text-muted-foreground text-sm">No new activity.</p>
      </CardContent>
    </Card>
  </Story>

  <Story
    title="Pricing card"
    description="Highlighted with border-primary. Badge in the header denotes recommendation."
  >
    <Card class="border-primary max-w-sm">
      <CardHeader>
        <Badge class="w-fit">Recommended</Badge>
        <CardTitle class="mt-2">Pro plan</CardTitle>
        <CardDescription>$24 / month, billed annually.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-2 text-sm">
        <p class="flex gap-2"><Check class="size-4 text-emerald-500" /> Unlimited projects</p>
        <p class="flex gap-2"><Check class="size-4 text-emerald-500" /> Priority support</p>
        <p class="flex gap-2"><Check class="size-4 text-emerald-500" /> Custom themes</p>
      </CardContent>
      <CardFooter>
        <Button class="w-full">Choose Pro</Button>
      </CardFooter>
    </Card>
  </Story>
</template>
