<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Bell,
  Copy,
  Eye,
  EyeOff,
  GitBranch,
  Settings,
  Trash2,
} from "lucide-vue-next";

const visible = ref(false);
</script>

<template>
  <TooltipProvider :delay-duration="200">
    <Story
      title="Basic"
      description="Wrap any trigger; TooltipContent renders on hover/focus with a 200ms delay."
    >
      <Tooltip>
        <TooltipTrigger as-child>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>Tooltip content</TooltipContent>
      </Tooltip>
    </Story>

    <Story
      title="Sides"
      description="side='top' | 'right' | 'bottom' | 'left' positions the popover relative to the trigger."
    >
      <div class="flex flex-wrap gap-3">
        <Tooltip>
          <TooltipTrigger as-child
            ><Button variant="outline" size="sm">Top</Button></TooltipTrigger
          >
          <TooltipContent side="top">Top placement</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger as-child
            ><Button variant="outline" size="sm">Right</Button></TooltipTrigger
          >
          <TooltipContent side="right">Right placement</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger as-child
            ><Button variant="outline" size="sm">Bottom</Button></TooltipTrigger
          >
          <TooltipContent side="bottom">Bottom placement</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger as-child
            ><Button variant="outline" size="sm">Left</Button></TooltipTrigger
          >
          <TooltipContent side="left">Left placement</TooltipContent>
        </Tooltip>
      </div>
    </Story>

    <Story
      title="Icon-only buttons"
      description="The canonical case — pair every icon-only control with a tooltip describing its action."
    >
      <div class="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="icon" aria-label="Settings"
              ><Settings
            /></Button>
          </TooltipTrigger>
          <TooltipContent>Settings</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="icon" aria-label="Notifications"
              ><Bell
            /></Button>
          </TooltipTrigger>
          <TooltipContent>Notifications</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="icon" aria-label="Copy link"
              ><Copy
            /></Button>
          </TooltipTrigger>
          <TooltipContent>Copy link</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="icon" aria-label="Open on GitHub"
              ><GitBranch
            /></Button>
          </TooltipTrigger>
          <TooltipContent>Open on GitHub</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Delete"
              class="text-destructive hover:text-destructive"
            >
              <Trash2 />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete</TooltipContent>
        </Tooltip>
      </div>
    </Story>

    <Story
      title="With shortcut hint"
      description="Combine label and a kbd-styled span for editor / power-user hotkeys."
    >
      <Tooltip>
        <TooltipTrigger as-child>
          <Button variant="outline">
            <component :is="visible ? Eye : EyeOff" class="size-4" />
            <span>{{ visible ? "Visible" : "Hidden" }}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent class="flex items-center gap-2">
          <span>Toggle visibility</span>
          <kbd class="bg-background/20 rounded px-1.5 py-0.5 font-mono text-xs"
            >⌘ ⇧ V</kbd
          >
        </TooltipContent>
      </Tooltip>
    </Story>

    <Story
      title="Disabled trigger"
      description="Reka UI dispatches focus events on a wrapper span so tooltips fire even when the underlying control is disabled — useful for explaining why an action is unavailable."
    >
      <Tooltip>
        <TooltipTrigger as-child>
          <span tabindex="0">
            <Button disabled>Publish</Button>
          </span>
        </TooltipTrigger>
        <TooltipContent
          >Add a title and at least one section before
          publishing.</TooltipContent
        >
      </Tooltip>
    </Story>

    <Story
      title="Custom delay"
      description=":delay-duration on TooltipProvider sets the global hover lag — wrap a small subtree with its own provider to override."
    >
      <div class="flex flex-wrap gap-3">
        <TooltipProvider :delay-duration="0">
          <Tooltip>
            <TooltipTrigger as-child
              ><Button variant="outline" size="sm"
                >Instant</Button
              ></TooltipTrigger
            >
            <TooltipContent>Opens immediately</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider :delay-duration="700">
          <Tooltip>
            <TooltipTrigger as-child
              ><Button variant="outline" size="sm">Slow</Button></TooltipTrigger
            >
            <TooltipContent>Opens after 700ms</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </Story>
  </TooltipProvider>
</template>
