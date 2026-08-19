<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Calculator,
  Calendar,
  CreditCard,
  Mail,
  Settings,
  Smile,
  User,
} from "lucide-vue-next";

const dialogOpen = ref(false);
const loading = ref(true);

function openDialog() {
  dialogOpen.value = true;
}

// Toggle for the loading/empty showcase.
function toggleLoading() {
  loading.value = !loading.value;
}

// Cmd-K binding for the dialog story.
onMounted(() => {
  const handler = (e: KeyboardEvent) => {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      dialogOpen.value = !dialogOpen.value;
    }
  };
  document.addEventListener("keydown", handler);
  onBeforeUnmount(() => document.removeEventListener("keydown", handler));
});
</script>

<template>
  <Story
    title="Default"
    description="Searchable command palette with grouped items and an empty state."
  >
    <Command class="max-w-md rounded-lg border shadow-sm">
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem value="calendar">
            <Calendar />
            Calendar
          </CommandItem>
          <CommandItem value="emoji">
            <Smile />
            Search emoji
          </CommandItem>
          <CommandItem value="profile">
            <User />
            Profile
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  </Story>

  <Story
    title="With shortcuts"
    description="CommandShortcut renders a right-aligned keyboard hint on each item."
  >
    <Command class="max-w-md rounded-lg border shadow-sm">
      <CommandInput placeholder="Search actions…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem value="profile">
            <User />
            Profile
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem value="mail">
            <Mail />
            Mail
            <CommandShortcut>⌘M</CommandShortcut>
          </CommandItem>
          <CommandItem value="settings">
            <Settings />
            Settings
            <CommandShortcut>⌘,</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  </Story>

  <Story
    title="Multiple groups + separator"
    description="Multiple CommandGroup headings divided by a CommandSeparator."
  >
    <Command class="max-w-md rounded-lg border shadow-sm">
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem value="calendar">
            <Calendar />
            Calendar
          </CommandItem>
          <CommandItem value="emoji">
            <Smile />
            Search emoji
          </CommandItem>
          <CommandItem value="calculator">
            <Calculator />
            Calculator
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem value="profile">
            <User />
            Profile
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem value="billing">
            <CreditCard />
            Billing
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem value="settings">
            <Settings />
            Settings
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  </Story>

  <Story
    title="CommandDialog (modal)"
    description="Press ⌘K (or click the button) to open a modal command palette."
  >
    <div class="flex items-center gap-2">
      <Button variant="outline" @click="openDialog">
        Open command menu
        <kbd
          class="bg-muted text-muted-foreground ml-2 rounded px-1.5 py-0.5 text-xs"
          >⌘K</kbd
        >
      </Button>
      <span class="text-muted-foreground text-sm">open = {{ dialogOpen }}</span>
    </div>
    <CommandDialog v-model:open="dialogOpen">
      <CommandInput placeholder="Type a command or search…" auto-focus />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem value="calendar" @select="dialogOpen = false">
            <Calendar />
            Calendar
          </CommandItem>
          <CommandItem value="emoji" @select="dialogOpen = false">
            <Smile />
            Search emoji
          </CommandItem>
          <CommandItem value="calculator" @select="dialogOpen = false">
            <Calculator />
            Calculator
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem value="profile" @select="dialogOpen = false">
            <User />
            Profile
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem value="settings" @select="dialogOpen = false">
            <Settings />
            Settings
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  </Story>

  <Story
    title="Loading & empty state"
    description="Show a loading skeleton then fall through to CommandEmpty when no items match."
  >
    <div class="max-w-md space-y-3">
      <Button variant="outline" size="sm" @click="toggleLoading">
        Toggle: {{ loading ? "Loading" : "Empty" }}
      </Button>
      <Command class="rounded-lg border shadow-sm">
        <CommandInput placeholder="Search…" />
        <CommandList>
          <template v-if="loading">
            <div class="space-y-2 p-3">
              <div class="bg-muted h-4 w-3/4 animate-pulse rounded" />
              <div class="bg-muted h-4 w-1/2 animate-pulse rounded" />
              <div class="bg-muted h-4 w-2/3 animate-pulse rounded" />
            </div>
          </template>
          <template v-else>
            <CommandEmpty>No results found.</CommandEmpty>
          </template>
        </CommandList>
      </Command>
    </div>
  </Story>
</template>
