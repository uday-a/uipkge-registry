<script setup lang="ts">
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Page, PageBody, PageHeader, PageHeaderHeading } from '@/components/ui/page'
import { Download, Filter, Plus } from 'lucide-vue-next'
</script>

<template>
  <Story
    title="Default"
    description="Page layout with a header (title, description, action slot) and a card body region."
  >
    <Page>
      <PageHeader>
        <PageHeaderHeading
          title="Page header"
          description="Page is the root layout for app screens. PageHeader stacks title + actions."
        />
        <template #actions>
          <Button variant="outline" size="sm">Cancel</Button>
          <Button size="sm">Save</Button>
        </template>
      </PageHeader>

      <PageBody>
        <Card>
          <CardContent class="text-muted-foreground py-8 text-center text-sm">
            Page body content goes here. Use SectionCard, blocks, or your own grid layout below the header.
          </CardContent>
        </Card>
      </PageBody>
    </Page>
  </Story>

  <Story
    title="Multiple actions"
    description="Header actions slot accepts any number of buttons — filter, export, and primary CTA."
  >
    <Page>
      <PageHeader>
        <PageHeaderHeading title="Reports" description="Sales performance across all channels." />
        <template #actions>
          <Button variant="outline" size="sm"><Filter class="size-4" aria-hidden="true" /> Filter</Button>
          <Button variant="outline" size="sm"><Download class="size-4" aria-hidden="true" /> Export</Button>
          <Button size="sm"><Plus class="size-4" aria-hidden="true" /> New report</Button>
        </template>
      </PageHeader>

      <PageBody>
        <Card>
          <CardContent class="text-muted-foreground py-8 text-center text-sm"> Reports table goes here. </CardContent>
        </Card>
      </PageBody>
    </Page>
  </Story>

  <Story title="Body with grid" description="PageBody is a plain region — drop your own grid of cards inside.">
    <Page>
      <PageHeader>
        <PageHeaderHeading title="Dashboard" description="Key metrics and recent activity." />
      </PageHeader>

      <PageBody>
        <div class="grid gap-4 sm:grid-cols-3">
          <Card v-for="kpi in ['Revenue', 'Active users', 'Conversion']" :key="kpi">
            <CardHeader class="pb-2">
              <CardDescription>{{ kpi }}</CardDescription>
              <CardTitle class="text-2xl">{{
                kpi === 'Revenue' ? '$48.2k' : kpi === 'Active users' ? '12,310' : '3.4%'
              }}</CardTitle>
            </CardHeader>
            <CardContent>
              <p class="text-muted-foreground text-xs">vs. previous period</p>
            </CardContent>
          </Card>
        </div>
      </PageBody>
    </Page>
  </Story>

  <Story title="Title only" description="Description is optional — drop it for compact pages.">
    <Page>
      <PageHeader>
        <PageHeaderHeading title="Settings" />
        <template #actions>
          <Button size="sm">Save changes</Button>
        </template>
      </PageHeader>

      <PageBody>
        <Card>
          <CardContent class="text-muted-foreground py-8 text-center text-sm"> Settings form goes here. </CardContent>
        </Card>
      </PageBody>
    </Page>
  </Story>

  <Story title="With breadcrumb" description="Stack a Breadcrumb above the heading for nested-page navigation context.">
    <Page>
      <PageHeader>
        <div class="space-y-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink href="#">Workspace</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink href="#">Projects</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>Acme website</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <PageHeaderHeading title="Acme website" description="Customer-facing marketing site." />
        </div>
        <template #actions>
          <Button variant="outline" size="sm">Archive</Button>
          <Button size="sm">Edit</Button>
        </template>
      </PageHeader>

      <PageBody>
        <Card>
          <CardContent class="text-muted-foreground py-8 text-center text-sm"> Project details go here. </CardContent>
        </Card>
      </PageBody>
    </Page>
  </Story>
</template>
