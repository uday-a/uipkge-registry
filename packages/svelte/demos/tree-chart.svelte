<script lang="ts">
  import { TreeChart } from '@svelte-registry/tree-chart'

  let { story }: { story: string } = $props()

  const fileTree = {
    name: 'src',
    children: [
      {
        name: 'components',
        children: [{ name: 'Button.vue' }, { name: 'Card.vue' }, { name: 'Input.vue' }],
      },
      {
        name: 'composables',
        children: [{ name: 'useTheme.ts' }, { name: 'useRegistry.ts' }],
      },
      {
        name: 'pages',
        children: [{ name: 'index.vue' }, { name: 'about.vue' }],
      },
      { name: 'main.ts' },
    ],
  }

  const orgTree = {
    name: 'CEO',
    children: [
      {
        name: 'CTO',
        children: [{ name: 'VP Eng', children: [{ name: 'EM Backend' }, { name: 'EM Frontend' }] }, { name: 'VP Data' }],
      },
      { name: 'CFO', children: [{ name: 'Controller' }, { name: 'FP&A' }] },
      { name: 'CMO', children: [{ name: 'VP Brand' }, { name: 'VP Growth' }] },
    ],
  }

  // Larger tree with one branch pre-collapsed via the `collapsed` flag.
  const decisionTree = {
    name: 'Should we ship?',
    children: [
      {
        name: 'CI green?',
        children: [
          {
            name: 'Yes',
            children: [
              {
                name: 'Risk score < 5?',
                children: [
                  { name: 'Ship' },
                  {
                    name: 'Review needed',
                    collapsed: true,
                    children: [{ name: 'Tech lead approves' }, { name: 'Eng manager approves' }],
                  },
                ],
              },
            ],
          },
          { name: 'No', children: [{ name: 'Block + retry' }] },
        ],
      },
    ],
  }
</script>

{#if story === 'Left-to-right (file tree)'}
  <TreeChart data={fileTree} height="420" />
{/if}

{#if story === 'Top-down org chart'}
  <TreeChart data={orgTree} orient="TB" height="400" />
{/if}

{#if story === 'Radial'}
  <TreeChart data={orgTree} orient="radial" height="420" />
{/if}

{#if story === 'With roam (decision tree)'}
  <TreeChart data={decisionTree} roam height="420" />
{/if}

{#if story === 'Right-to-left compact'}
  <TreeChart data={fileTree} orient="RL" height="300" />
{/if}
