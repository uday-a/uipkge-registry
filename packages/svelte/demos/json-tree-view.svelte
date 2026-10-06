<script lang="ts">
  import { JsonTreeView, type JsonValue } from '@svelte-registry/json-tree-view'

  let { story }: { story: string } = $props()

  const apiResponse: JsonValue = {
    status: 'success',
    data: {
      user: {
        id: 8421,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@acme.com',
        role: 'admin',
        verified: true,
        createdAt: '2023-04-12T08:30:00Z',
      },
      organization: {
        id: 'org_abc123',
        name: 'Acme Inc.',
        plan: 'enterprise',
        seats: 50,
        usedSeats: 37,
      },
      permissions: ['read', 'write', 'delete', 'admin'],
      metadata: {
        lastLogin: '2024-03-15T14:22:11Z',
        ipAddress: '192.168.1.42',
        factors: null,
      },
    },
    pagination: { page: 1, perPage: 20, total: 1, hasNext: false },
  }

  const errorResponse: JsonValue = {
    error: {
      code: 'VALIDATION_FAILED',
      message: 'The request body did not match the expected schema.',
      details: [
        { field: 'email', issue: 'must be a valid email address' },
        { field: 'age', issue: 'must be a positive integer' },
      ],
      requestId: 'req_01HZK8XJ9F2P3Q4R5S6T7U8V9W',
      timestamp: '2024-03-15T14:23:01Z',
    },
  }

  let lastCopied = $state('')
</script>

{#if story === 'API response'}
  <JsonTreeView data={apiResponse} class="max-h-96 max-w-2xl" oncopy={(value) => (lastCopied = value)} />
  {#if lastCopied}
    <p class="text-muted-foreground mt-2 max-w-2xl truncate text-xs">Copied: {lastCopied}</p>
  {/if}
{/if}

{#if story === 'Error payload'}
  <JsonTreeView data={errorResponse} rootLabel="error" class="max-h-96 max-w-2xl" />
{/if}

{#if story === 'Expanded deep'}
  <JsonTreeView data={apiResponse} expandDepth={4} class="max-h-96 max-w-2xl" />
{/if}

{#if story === 'No toolbar'}
  <JsonTreeView data={apiResponse} showToolbar={false} showSearch={false} class="max-h-96 max-w-2xl" />
{/if}
