<script setup lang="ts">
import { ref } from 'vue'
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@/components/ui/menubar'
const showBookmarks = ref(true)
const showFullUrls = ref(false)
const profile = ref('benoit')
</script>

<template>
  <Story title="Default" description="Horizontal menubar with File, Edit, and View menus and keyboard shortcut hints.">
    <Menubar class="max-w-md">
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New Tab <MenubarShortcut>⌘T</MenubarShortcut></MenubarItem>
          <MenubarItem>New Window <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Print… <MenubarShortcut>⌘P</MenubarShortcut></MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Undo <MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem>
          <MenubarItem>Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut></MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Reload <MenubarShortcut>⌘R</MenubarShortcut></MenubarItem>
          <MenubarItem>Toggle Fullscreen</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  </Story>

  <Story
    title="With checkbox items"
    description="MenubarCheckboxItem holds a v-model:checked toggle so options stay sticky between opens."
  >
    <Menubar class="max-w-md">
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarLabel>Appearance</MenubarLabel>
          <MenubarSeparator />
          <MenubarCheckboxItem v-model:checked="showBookmarks"> Always Show Bookmarks Bar </MenubarCheckboxItem>
          <MenubarCheckboxItem v-model:checked="showFullUrls"> Always Show Full URLs </MenubarCheckboxItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
    <p class="text-muted-foreground mt-2 text-xs">
      Bookmarks: {{ showBookmarks ? 'on' : 'off' }} · Full URLs: {{ showFullUrls ? 'on' : 'off' }}
    </p>
  </Story>

  <Story
    title="With radio group"
    description="MenubarRadioGroup binds a single value across multiple MenubarRadioItem entries."
  >
    <Menubar class="max-w-md">
      <MenubarMenu>
        <MenubarTrigger>Profile</MenubarTrigger>
        <MenubarContent>
          <MenubarLabel>People</MenubarLabel>
          <MenubarSeparator />
          <MenubarRadioGroup v-model="profile">
            <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
            <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
            <MenubarRadioItem value="luis">Luis</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
    <p class="text-muted-foreground mt-2 text-xs">Selected: {{ profile }}</p>
  </Story>

  <Story
    title="With submenu"
    description="MenubarSub + MenubarSubTrigger + MenubarSubContent open a nested flyout on hover."
  >
    <Menubar class="max-w-md">
      <MenubarMenu>
        <MenubarTrigger>Share</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Email link</MenubarItem>
          <MenubarItem>Copy link</MenubarItem>
          <MenubarSub>
            <MenubarSubTrigger>Send to…</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Slack</MenubarItem>
              <MenubarItem>Discord</MenubarItem>
              <MenubarItem>WhatsApp</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>More apps…</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>Print</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  </Story>

  <Story title="With shortcuts" description="MenubarShortcut right-aligns a hint string with a muted style.">
    <Menubar class="max-w-md">
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Cut <MenubarShortcut>⌘X</MenubarShortcut></MenubarItem>
          <MenubarItem>Copy <MenubarShortcut>⌘C</MenubarShortcut></MenubarItem>
          <MenubarItem>Paste <MenubarShortcut>⌘V</MenubarShortcut></MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Find… <MenubarShortcut>⌘F</MenubarShortcut></MenubarItem>
          <MenubarItem>Find Next <MenubarShortcut>⌘G</MenubarShortcut></MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  </Story>

  <Story
    title="Full app menubar"
    description="Five top-level menus mixing items, separators, submenus, checkboxes, and shortcuts."
  >
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
          <MenubarItem>Open… <MenubarShortcut>⌘O</MenubarShortcut></MenubarItem>
          <MenubarSub>
            <MenubarSubTrigger>Open Recent</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>project-alpha.md</MenubarItem>
              <MenubarItem>roadmap.md</MenubarItem>
              <MenubarItem>notes.md</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>Save <MenubarShortcut>⌘S</MenubarShortcut></MenubarItem>
          <MenubarItem>Save As… <MenubarShortcut>⇧⌘S</MenubarShortcut></MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Undo <MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem>
          <MenubarItem>Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut></MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Cut <MenubarShortcut>⌘X</MenubarShortcut></MenubarItem>
          <MenubarItem>Copy <MenubarShortcut>⌘C</MenubarShortcut></MenubarItem>
          <MenubarItem>Paste <MenubarShortcut>⌘V</MenubarShortcut></MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem v-model:checked="showBookmarks">Bookmarks bar</MenubarCheckboxItem>
          <MenubarCheckboxItem v-model:checked="showFullUrls">Full URLs</MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarItem>Reload <MenubarShortcut>⌘R</MenubarShortcut></MenubarItem>
          <MenubarItem>Force Reload <MenubarShortcut>⇧⌘R</MenubarShortcut></MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Toggle Fullscreen</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Profiles</MenubarTrigger>
        <MenubarContent>
          <MenubarRadioGroup v-model="profile">
            <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
            <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
            <MenubarRadioItem value="luis">Luis</MenubarRadioItem>
          </MenubarRadioGroup>
          <MenubarSeparator />
          <MenubarItem>Edit…</MenubarItem>
          <MenubarItem>Add Profile…</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Help</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Documentation</MenubarItem>
          <MenubarItem>Release Notes</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>About</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  </Story>
</template>
