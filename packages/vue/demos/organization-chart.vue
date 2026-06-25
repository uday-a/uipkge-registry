<script setup lang="ts">
import { ref } from 'vue'
import { OrganizationChart, type OrgNode } from '@/components/ui/organization-chart'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
        {
          id: '6',
          name: 'Sam Patel',
          title: 'DevOps Lead',
          department: 'Engineering',
        },
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

const selectedNode = ref<OrgNode | null>(null)
const lastToggle = ref('')

function onClick(node: OrgNode) {
  selectedNode.value = node
}
</script>

<template>
  <Story
    title="Acme Inc. leadership"
    description="A real company reporting structure — CEO at the top, three VPs, and their direct reports with avatars and titles."
  >
    <OrganizationChart :data="acmeOrg" @node-click="onClick" class="w-full" />
    <p v-if="selectedNode" class="text-muted-foreground mt-3 text-xs">
      Selected: <span class="text-foreground font-medium">{{ selectedNode.name }}</span> ·
      {{ selectedNode.title }}
    </p>
  </Story>

  <Story
    title="With department badges"
    description="Use the node slot to render a department badge inside each card — useful for filtering by team."
  >
    <OrganizationChart :data="acmeOrg" class="w-full">
      <template #node="{ node }">
        <div v-if="node.department" class="mt-1">
          <Badge variant="secondary" class="text-xs">{{ node.department }}</Badge>
        </div>
      </template>
    </OrganizationChart>
  </Story>

  <Story
    title="Horizontal layout"
    description="direction='left-right' flows the tree sideways — better for wide orgs with many direct reports per level."
  >
    <OrganizationChart :data="acmeOrg" direction="left-right" class="w-full" />
  </Story>

  <Story
    title="Zoomable explorer"
    description="Add zoom controls plus expand/collapse-all for large orgs where users need to navigate and resize."
  >
    <OrganizationChart :data="acmeOrg" zoomable class="w-full" />
  </Story>

  <Story
    title="Collapsed by default"
    description="Start with only the root visible — users drill into the branches they care about."
  >
    <OrganizationChart :data="acmeOrg" :default-expanded="false" class="w-full" />
  </Story>

  <Story
    title="In a reporting card"
    description="The chart embedded in a Card with a header — how it looks in a People or HR dashboard section."
  >
    <Card class="max-w-3xl">
      <CardHeader>
        <CardTitle class="text-base">Reporting structure</CardTitle>
      </CardHeader>
      <CardContent>
        <OrganizationChart
          :data="acmeOrg"
          :default-expanded="false"
          @toggle="(n, e) => (lastToggle = `${n.name}: ${e ? 'expanded' : 'collapsed'}`)"
          class="w-full"
        />
        <p v-if="lastToggle" class="text-muted-foreground mt-2 text-xs">{{ lastToggle }}</p>
      </CardContent>
    </Card>
  </Story>

  <Story
    title="Initials fallback"
    description="Nodes without an avatar show colored initials — the default for ICs who haven't uploaded a photo."
  >
    <OrganizationChart
      :data="{
        id: 'r',
        name: 'Robin Hayes',
        title: 'Director',
        children: [
          { id: 'a', name: 'Alice Carter', title: 'Team Lead' },
          { id: 'b', name: 'Ben Walsh', title: 'Team Lead' },
        ],
      }"
      class="w-full"
    />
  </Story>
</template>
