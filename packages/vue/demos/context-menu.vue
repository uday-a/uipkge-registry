<script setup lang="ts">
import { ref } from "vue";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
const showBookmarks = ref(true);
const showFullUrls = ref(false);
const person = ref("pedro");
</script>

<template>
  <Story
    title="Default"
    description="Right-click the target to open a menu with items and a separator."
  >
    <ContextMenu>
      <ContextMenuTrigger
        class="border-border bg-muted/30 grid h-32 w-72 place-items-center rounded-md border border-dashed text-sm"
      >
        Right-click here
      </ContextMenuTrigger>
      <ContextMenuContent class="w-48">
        <ContextMenuItem>Back</ContextMenuItem>
        <ContextMenuItem>Forward</ContextMenuItem>
        <ContextMenuItem>Reload</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Inspect</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  </Story>

  <Story
    title="Checkbox items"
    description="ContextMenuCheckboxItem with two-way bound v-model state showing the check indicator."
  >
    <ContextMenu>
      <ContextMenuTrigger
        class="border-border bg-muted/30 grid h-32 w-72 place-items-center rounded-md border border-dashed text-sm"
      >
        Right-click for view options
      </ContextMenuTrigger>
      <ContextMenuContent class="w-56">
        <ContextMenuLabel>View</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem v-model:checked="showBookmarks">
          Show Bookmarks Bar
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem v-model:checked="showFullUrls">
          Show Full URLs
        </ContextMenuCheckboxItem>
      </ContextMenuContent>
    </ContextMenu>
    <p class="text-muted-foreground mt-2 text-xs">
      Bookmarks: {{ showBookmarks }} · Full URLs: {{ showFullUrls }}
    </p>
  </Story>

  <Story
    title="Radio group"
    description="ContextMenuRadioGroup + ContextMenuRadioItem for single-select state."
  >
    <ContextMenu>
      <ContextMenuTrigger
        class="border-border bg-muted/30 grid h-32 w-72 place-items-center rounded-md border border-dashed text-sm"
      >
        Right-click to pick a person
      </ContextMenuTrigger>
      <ContextMenuContent class="w-56">
        <ContextMenuLabel>People</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuRadioGroup v-model="person">
          <ContextMenuRadioItem value="pedro"
            >Pedro Duarte</ContextMenuRadioItem
          >
          <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
          <ContextMenuRadioItem value="benoit"
            >Benoît Grélard</ContextMenuRadioItem
          >
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </ContextMenu>
    <p class="text-muted-foreground mt-2 text-xs">Selected: {{ person }}</p>
  </Story>

  <Story
    title="Submenu"
    description="Nest a ContextMenuSub inside the content for a hover-revealed submenu."
  >
    <ContextMenu>
      <ContextMenuTrigger
        class="border-border bg-muted/30 grid h-32 w-72 place-items-center rounded-md border border-dashed text-sm"
      >
        Right-click for share options
      </ContextMenuTrigger>
      <ContextMenuContent class="w-56">
        <ContextMenuItem>Open</ContextMenuItem>
        <ContextMenuItem>Rename</ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>Share</ContextMenuSubTrigger>
          <ContextMenuSubContent class="w-44">
            <ContextMenuItem>Email link</ContextMenuItem>
            <ContextMenuItem>Copy link</ContextMenuItem>
            <ContextMenuItem>Slack</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem>Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  </Story>

  <Story
    title="With shortcuts"
    description="ContextMenuShortcut renders a muted, right-aligned keyboard hint per item."
  >
    <ContextMenu>
      <ContextMenuTrigger
        class="border-border bg-muted/30 grid h-32 w-72 place-items-center rounded-md border border-dashed text-sm"
      >
        Right-click for shortcuts
      </ContextMenuTrigger>
      <ContextMenuContent class="w-56">
        <ContextMenuItem>
          Back
          <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Forward
          <ContextMenuShortcut>⌘]</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Reload
          <ContextMenuShortcut>⌘R</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>
          Print
          <ContextMenuShortcut>⌘P</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  </Story>

  <Story
    title="Disabled item"
    description="Disable an action with the disabled prop — keeps it visible but greyed out and unclickable."
  >
    <ContextMenu>
      <ContextMenuTrigger
        class="border-border bg-muted/30 grid h-32 w-72 place-items-center rounded-md border border-dashed text-sm"
      >
        Right-click here
      </ContextMenuTrigger>
      <ContextMenuContent class="w-48">
        <ContextMenuItem>Cut</ContextMenuItem>
        <ContextMenuItem>Copy</ContextMenuItem>
        <ContextMenuItem disabled>Paste (clipboard empty)</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem disabled>Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  </Story>
</template>
