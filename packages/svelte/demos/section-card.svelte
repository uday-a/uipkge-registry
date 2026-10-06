<script lang="ts">
  import { SectionCard } from '@svelte-registry/section-card'
  import { Button } from '@svelte-registry/button'
  import { Pencil, Plus, Trash2, Users } from '@lucide/svelte'

  let { story }: { story: string } = $props()
</script>

{#if story === 'With icon action'}
  <SectionCard title="Team members" description="Manage who has access to this workspace.">
    {#snippet headerAction()}
      <Button size="sm">
        <Plus /> Invite
      </Button>
    {/snippet}
    <div class="flex items-center gap-3">
      <div class="bg-muted flex size-9 items-center justify-center rounded-full">
        <Users class="size-4" />
      </div>
      <div>
        <p class="text-sm font-medium">Acme Corp</p>
        <p class="text-muted-foreground text-xs">12 members · 3 pending invites</p>
      </div>
    </div>
  </SectionCard>
{/if}

{#if story === 'Account settings'}
  <SectionCard title="Profile" description="How you appear to your team.">
    {#snippet headerAction()}
      <Button variant="outline" size="sm">
        <Pencil /> Edit
      </Button>
    {/snippet}
    <dl class="grid grid-cols-2 gap-4 text-sm">
      <div>
        <dt class="text-muted-foreground text-xs">Display name</dt>
        <dd class="font-medium">Ada Lovelace</dd>
      </div>
      <div>
        <dt class="text-muted-foreground text-xs">Email</dt>
        <dd class="font-medium">ada@example.com</dd>
      </div>
    </dl>
    {#snippet footer()}
      <div class="flex justify-end gap-2 border-t px-6 py-4">
        <Button variant="outline" size="sm">Cancel</Button>
        <Button size="sm">Save changes</Button>
      </div>
    {/snippet}
  </SectionCard>
{/if}

{#if story === 'Without action'}
  <SectionCard title="About" description="General information about this project.">
    <p class="text-muted-foreground text-sm">
      Section cards compose a title, an optional description, and flexible content with an optional footer for
      save/cancel actions.
    </p>
  </SectionCard>
{/if}

{#if story === 'Danger zone'}
  <SectionCard title="Danger zone" description="Irreversible actions. Proceed with caution." class="border-destructive/40">
    {#snippet headerAction()}
      <Button variant="destructive" size="sm">
        <Trash2 /> Delete workspace
      </Button>
    {/snippet}
    <p class="text-muted-foreground text-sm">
      Deleting a workspace removes all projects, members, and billing history. This cannot be undone.
    </p>
  </SectionCard>
{/if}
