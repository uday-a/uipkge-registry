<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { CalendarDays, Filter, MoreHorizontal, Settings, Share2 } from 'lucide-vue-next'

const filters = ref({ status: 'active', tier: 'pro' })
const open = ref(false)
</script>

<template>
  <Story
    title="With form fields"
    description="Click the trigger to open. PopoverContent floats above the page and traps focus until dismissed."
  >
    <Popover>
      <PopoverTrigger as-child>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent class="w-80">
        <div class="space-y-2">
          <h4 class="leading-none font-medium">Dimensions</h4>
          <p class="text-muted-foreground text-sm">Set the dimensions for the layer.</p>
        </div>
        <div class="mt-4 grid gap-2">
          <div class="grid grid-cols-3 items-center gap-3">
            <Label for="width">Width</Label>
            <Input id="width" model-value="100%" class="col-span-2 h-8" />
          </div>
          <div class="grid grid-cols-3 items-center gap-3">
            <Label for="height">Height</Label>
            <Input id="height" model-value="25px" class="col-span-2 h-8" />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  </Story>

  <Story title="Compact info" description="Use a smaller width for short summaries — session info, account hover, etc.">
    <Popover>
      <PopoverTrigger as-child>
        <Button variant="ghost" size="sm">Show details</Button>
      </PopoverTrigger>
      <PopoverContent class="w-56 space-y-1 text-sm">
        <p class="font-medium">Active session</p>
        <p class="text-muted-foreground text-xs">Started 2h ago · IP 192.0.2.1</p>
      </PopoverContent>
    </Popover>
  </Story>

  <Story
    title="Sides + alignment"
    description="side controls top / right / bottom / left; align controls start / center / end along that side."
  >
    <div class="flex flex-wrap items-center gap-3">
      <Popover>
        <PopoverTrigger as-child><Button variant="outline" size="sm">Top · start</Button></PopoverTrigger>
        <PopoverContent side="top" align="start" class="w-44"
          >Aligned to the start of the trigger's top edge.</PopoverContent
        >
      </Popover>
      <Popover>
        <PopoverTrigger as-child><Button variant="outline" size="sm">Right · center</Button></PopoverTrigger>
        <PopoverContent side="right" align="center" class="w-44">Centered on the right side.</PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger as-child><Button variant="outline" size="sm">Bottom · end</Button></PopoverTrigger>
        <PopoverContent side="bottom" align="end" class="w-44">Aligned to the end of the bottom edge.</PopoverContent>
      </Popover>
    </div>
  </Story>

  <Story title="Filter chips" description="Common pattern — an icon trigger that opens a panel of filter controls.">
    <Popover>
      <PopoverTrigger as-child>
        <Button variant="outline" size="sm">
          <Filter class="size-3.5" />
          Filters
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-72">
        <div class="space-y-3">
          <div class="space-y-1.5">
            <Label class="text-muted-foreground text-xs tracking-wider uppercase">Status</Label>
            <RadioGroup v-model="filters.status" class="flex gap-3">
              <label class="flex items-center gap-1.5 text-sm"> <RadioGroupItem value="all" /> All </label>
              <label class="flex items-center gap-1.5 text-sm"> <RadioGroupItem value="active" /> Active </label>
              <label class="flex items-center gap-1.5 text-sm"> <RadioGroupItem value="archived" /> Archived </label>
            </RadioGroup>
          </div>
          <div class="space-y-1.5">
            <Label class="text-muted-foreground text-xs tracking-wider uppercase">Tier</Label>
            <RadioGroup v-model="filters.tier" class="flex gap-3">
              <label class="flex items-center gap-1.5 text-sm"> <RadioGroupItem value="free" /> Free </label>
              <label class="flex items-center gap-1.5 text-sm"> <RadioGroupItem value="pro" /> Pro </label>
              <label class="flex items-center gap-1.5 text-sm"> <RadioGroupItem value="ent" /> Enterprise </label>
            </RadioGroup>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  </Story>

  <Story
    title="Icon-only quick actions"
    description="Each row-action button can open a contextual popover for delete-confirm, share-options, etc."
  >
    <div class="flex items-center gap-2">
      <Popover>
        <PopoverTrigger as-child>
          <Button variant="ghost" size="icon" aria-label="Settings"><Settings /></Button>
        </PopoverTrigger>
        <PopoverContent class="w-48 text-sm">
          <p class="mb-2 font-medium">Quick settings</p>
          <p class="text-muted-foreground text-xs">Choose a default view for new tabs.</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger as-child>
          <Button variant="ghost" size="icon" aria-label="Share"><Share2 /></Button>
        </PopoverTrigger>
        <PopoverContent class="w-48 space-y-1.5">
          <Button variant="ghost" size="sm" class="w-full justify-start">Copy link</Button>
          <Button variant="ghost" size="sm" class="w-full justify-start">Email</Button>
          <Button variant="ghost" size="sm" class="w-full justify-start">Slack</Button>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger as-child>
          <Button variant="ghost" size="icon" aria-label="Schedule"><CalendarDays /></Button>
        </PopoverTrigger>
        <PopoverContent class="w-auto p-0">
          <Calendar />
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger as-child>
          <Button variant="ghost" size="icon" aria-label="More"><MoreHorizontal /></Button>
        </PopoverTrigger>
        <PopoverContent align="end" class="w-44 space-y-0.5">
          <Button variant="ghost" size="sm" class="w-full justify-start">Duplicate</Button>
          <Button variant="ghost" size="sm" class="w-full justify-start">Archive</Button>
          <Button variant="ghost" size="sm" class="text-destructive hover:text-destructive w-full justify-start">
            Delete
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  </Story>

  <Story
    title="Controlled with v-model:open"
    description="Drive open state externally for programmatic open / close (form submission, keyboard shortcut, etc.)."
  >
    <div class="flex items-center gap-3">
      <Popover v-model:open="open">
        <PopoverTrigger as-child>
          <Button variant="outline">Toggle externally</Button>
        </PopoverTrigger>
        <PopoverContent class="w-64 text-sm">
          <p>Controlled via v-model:open.</p>
          <p class="text-muted-foreground mt-1 text-xs">Click 'Close' to dismiss.</p>
          <Button size="sm" variant="outline" class="mt-3" @click="open = false">Close</Button>
        </PopoverContent>
      </Popover>
      <span class="text-muted-foreground text-xs">open = {{ open }}</span>
    </div>
  </Story>

  <Story title="Persistent (localStorage)" description="Pass persist as a key. The open state survives page reload.">
    <Popover persist="demo-persist-1">
      <PopoverTrigger as-child>
        <Button variant="outline">Toggle, then reload</Button>
      </PopoverTrigger>
      <PopoverContent>I remember my state across reloads.</PopoverContent>
    </Popover>
  </Story>

  <Story
    title="Close behavior - manual"
    description='closeBehavior="manual" ignores click-outside and Escape. Use a Close button.'
  >
    <Popover close-behavior="manual">
      <PopoverTrigger as-child>
        <Button variant="outline">Open manual</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div class="space-y-2">
          <p class="text-sm">I won't close on outside click or Escape.</p>
          <PopoverTrigger as-child>
            <Button size="sm" variant="outline">Close</Button>
          </PopoverTrigger>
        </div>
      </PopoverContent>
    </Popover>
  </Story>

  <Story title="Close behavior - click-outside only" description="Escape is suppressed; clicking outside still closes.">
    <Popover close-behavior="click-outside">
      <PopoverTrigger as-child>
        <Button variant="outline">Open click-outside-only</Button>
      </PopoverTrigger>
      <PopoverContent>Press Escape - nothing happens. Click outside - I close.</PopoverContent>
    </Popover>
  </Story>
</template>
