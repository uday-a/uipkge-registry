<script lang="ts">
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
  } from '@svelte-registry/menubar'

  let { story }: { story: string } = $props()

  let showBookmarks = $state(true)
  let showFullUrls = $state(false)
  let profile = $state('benoit')
</script>

{#if story === 'Default'}
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
{/if}

{#if story === 'With checkbox items'}
  <Menubar class="max-w-md">
    <MenubarMenu>
      <MenubarTrigger>View</MenubarTrigger>
      <MenubarContent>
        <MenubarLabel>Appearance</MenubarLabel>
        <MenubarSeparator />
        <MenubarCheckboxItem bind:checked={showBookmarks}>Always Show Bookmarks Bar</MenubarCheckboxItem>
        <MenubarCheckboxItem bind:checked={showFullUrls}>Always Show Full URLs</MenubarCheckboxItem>
      </MenubarContent>
    </MenubarMenu>
  </Menubar>
  <p class="text-muted-foreground mt-2 text-xs">
    Bookmarks: {showBookmarks ? 'on' : 'off'} · Full URLs: {showFullUrls ? 'on' : 'off'}
  </p>
{/if}

{#if story === 'With radio group'}
  <Menubar class="max-w-md">
    <MenubarMenu>
      <MenubarTrigger>Profile</MenubarTrigger>
      <MenubarContent>
        <MenubarLabel>People</MenubarLabel>
        <MenubarSeparator />
        <MenubarRadioGroup bind:value={profile}>
          <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
          <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
          <MenubarRadioItem value="luis">Luis</MenubarRadioItem>
        </MenubarRadioGroup>
      </MenubarContent>
    </MenubarMenu>
  </Menubar>
  <p class="text-muted-foreground mt-2 text-xs">Selected: {profile}</p>
{/if}

{#if story === 'With submenu'}
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
{/if}

{#if story === 'Destructive item'}
  <Menubar class="max-w-md">
    <MenubarMenu>
      <MenubarTrigger>File</MenubarTrigger>
      <MenubarContent>
        <MenubarItem>Rename</MenubarItem>
        <MenubarItem>Duplicate</MenubarItem>
        <MenubarSeparator />
        <MenubarItem variant="destructive">Delete permanently</MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  </Menubar>
{/if}
