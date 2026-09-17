<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  Cloud,
  CreditCard,
  GitBranch,
  HelpCircle,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-vue-next";

const showStatus = ref(true);
const showActivity = ref(false);
const showPanel = ref(true);

const position = ref("center");
</script>

<template>
  <Story
    title="Account menu"
    description="Label + grouped items with separators. Destructive item uses text-destructive."
  >
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="outline">Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-56">
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem><User class="size-4" /> Profile</DropdownMenuItem>
          <DropdownMenuItem
            ><CreditCard class="size-4" /> Billing</DropdownMenuItem
          >
          <DropdownMenuItem
            ><Settings class="size-4" /> Settings</DropdownMenuItem
          >
          <DropdownMenuItem
            ><Keyboard class="size-4" /> Shortcuts</DropdownMenuItem
          >
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem class="text-destructive focus:text-destructive">
          <LogOut class="size-4" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </Story>

  <Story
    title="With shortcuts"
    description="DropdownMenuShortcut renders a right-aligned hint per item — common for editor menus."
  >
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="outline">Edit</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-56">
        <DropdownMenuItem>
          New tab
          <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          New window
          <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          New private window
          <DropdownMenuShortcut>⇧⌘N</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Print
          <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </Story>

  <Story
    title="With checkbox items"
    description="DropdownMenuCheckboxItem holds v-model:checked state — multiple toggles can stay open across opens."
  >
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="outline">View options</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-56">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem v-model:checked="showStatus">
          Status bar
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem v-model:checked="showActivity">
          Activity bar
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem v-model:checked="showPanel">
          Panel
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </Story>

  <Story
    title="With radio group"
    description="DropdownMenuRadioGroup holds a single selected value across DropdownMenuRadioItem children."
  >
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="outline">Panel position</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-56">
        <DropdownMenuLabel>Panel position</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup v-model="position">
          <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="center">Center</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  </Story>

  <Story
    title="With submenus"
    description="DropdownMenuSub + SubTrigger + SubContent build a nested cascading menu."
  >
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="outline">Help</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-56">
        <DropdownMenuItem><LifeBuoy class="size-4" /> Support</DropdownMenuItem>
        <DropdownMenuItem><GitBranch class="size-4" /> GitHub</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <UserPlus class="size-4" /> Invite teammates
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem><Mail class="size-4" /> Email</DropdownMenuItem>
            <DropdownMenuItem
              ><MessageSquare class="size-4" /> Message</DropdownMenuItem
            >
            <DropdownMenuSeparator />
            <DropdownMenuItem
              ><PlusCircle class="size-4" /> Send invite link</DropdownMenuItem
            >
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem
          ><HelpCircle class="size-4" /> Keyboard shortcuts</DropdownMenuItem
        >
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <Cloud class="size-4" /> API (coming soon)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </Story>

  <Story
    title="Icon trigger (row action)"
    description="Common table-row pattern — icon-only trigger that opens a small action menu."
  >
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="ghost" size="icon" aria-label="Row actions">
          <MoreHorizontal class="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" class="w-44">
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuItem>Rename…</DropdownMenuItem>
        <DropdownMenuItem>Move to folder…</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem class="text-destructive focus:text-destructive"
          >Delete</DropdownMenuItem
        >
      </DropdownMenuContent>
    </DropdownMenu>
  </Story>

  <Story
    title="Action menu"
    description="Chevron-trigger pattern for create-new menus."
  >
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button>
          <Plus class="size-3.5" /> New
          <ChevronDown class="size-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" class="w-44">
        <DropdownMenuItem><Plus class="size-4" /> Project</DropdownMenuItem>
        <DropdownMenuItem><Users class="size-4" /> Team</DropdownMenuItem>
        <DropdownMenuItem><Cloud class="size-4" /> Workspace</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </Story>
</template>
