<script lang="ts">
  import { OrganizationChart, type OrgNode } from '@svelte-registry/organization-chart'

  let { story }: { story: string } = $props()

  const acmeOrg: OrgNode = {
    id: '1',
    name: 'Sarah Johnson',
    title: 'Chief Executive Officer',
    avatar: 'https://i.pravatar.cc/80?img=47',
    department: 'Executive',
    children: [
      {
        id: '2',
        name: 'Michael Chen',
        title: 'VP of Engineering',
        avatar: 'https://i.pravatar.cc/80?img=12',
        department: 'Engineering',
        children: [
          {
            id: '5',
            name: 'Alex Rivera',
            title: 'Engineering Lead',
            avatar: 'https://i.pravatar.cc/80?img=33',
            department: 'Engineering',
            children: [
              { id: '8', name: 'Jordan Lee', title: 'Senior Engineer', department: 'Engineering' },
              { id: '9', name: 'Taylor Brooks', title: 'Frontend Engineer', department: 'Engineering' },
            ],
          },
          { id: '6', name: 'Sam Patel', title: 'DevOps Lead', department: 'Engineering' },
        ],
      },
      {
        id: '3',
        name: 'Emily Davis',
        title: 'VP of Sales',
        avatar: 'https://i.pravatar.cc/80?img=45',
        department: 'Sales',
        children: [
          { id: '7', name: 'Chris Brown', title: 'Sales Manager', department: 'Sales' },
          { id: '10', name: 'Maria Garcia', title: 'Account Executive', department: 'Sales' },
        ],
      },
      {
        id: '4',
        name: 'David Wilson',
        title: 'VP of Marketing',
        avatar: 'https://i.pravatar.cc/80?img=60',
        department: 'Marketing',
      },
    ],
  }

  let clicked = $state('—')
</script>

{#snippet departmentBadge({ node }: { node: OrgNode })}
  {#if node.department}
    <span
      class="bg-secondary text-secondary-foreground mt-2 inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10px] font-medium"
    >
      {node.department}
    </span>
  {/if}
{/snippet}

{#if story === 'Acme Inc. leadership'}
  <div class="space-y-2">
    <OrganizationChart data={acmeOrg} onnodeclick={(n) => (clicked = `${n.name} — ${n.title ?? 'no title'}`)} />
    <p class="text-muted-foreground text-xs">Clicked: {clicked}</p>
  </div>
{/if}

{#if story === 'With department badges'}
  <OrganizationChart data={acmeOrg} nodeSnippet={departmentBadge} />
{/if}

{#if story === 'Horizontal layout'}
  <OrganizationChart data={acmeOrg} direction="left-right" />
{/if}

{#if story === 'Zoomable explorer'}
  <OrganizationChart data={acmeOrg} zoomable />
{/if}

{#if story === 'Collapsed by default'}
  <OrganizationChart data={acmeOrg} defaultExpanded={false} />
{/if}
