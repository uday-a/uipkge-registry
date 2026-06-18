<script setup lang="ts">
import { TreeChart } from '@/components/ui/charts'
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

<template>
  <Story
    title="Left-to-right (file tree)"
    description="Default LR orientation. Good for nested file systems, expression trees, decision trees."
  >
    <TreeChart :data="fileTree" height="420" />
  </Story>

  <Story
    title="Top-down org chart"
    description="orient='TB' for the classic management chart layout — root at the top, descendants fanning down."
  >
    <TreeChart :data="orgTree" orient="TB" height="400" />
  </Story>

  <Story
    title="Radial"
    description="Hierarchy radiating from a central root. Works well for medium-depth trees where horizontal real estate is tight (modals, side panels)."
  >
    <TreeChart :data="orgTree" orient="radial" height="420" />
  </Story>

  <Story
    title="With roam (decision tree)"
    description="Set roam=true to enable drag-to-pan and wheel-zoom. Worth it once the tree spills past the viewport. Pre-collapsed branches use the collapsed flag."
  >
    <TreeChart :data="decisionTree" :roam="true" height="420" />
  </Story>

  <Story
    title="Right-to-left compact"
    description="orient='RL' mirrors the default — handy for sidebar layouts where the root anchors to the right edge."
  >
    <TreeChart :data="fileTree" orient="RL" height="300" />
  </Story>
</template>
