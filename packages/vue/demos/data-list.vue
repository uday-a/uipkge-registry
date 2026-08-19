<script setup lang="ts">
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataList, DataListItem } from "@/components/ui/data-list";
import { Check, Shield, Zap } from "lucide-vue-next";
</script>

<template>
  <Story
    title="Default"
    description="Key/value rows inside a card with mixed text and badge values."
  >
    <Card class="max-w-md">
      <DataList class="p-6">
        <DataListItem>
          <span class="text-sm font-medium">Plan</span>
          <Badge>Pro</Badge>
        </DataListItem>
        <DataListItem>
          <span class="text-sm font-medium">Renewal</span>
          <span class="text-muted-foreground text-sm">Sep 12, 2026</span>
        </DataListItem>
        <DataListItem>
          <span class="text-sm font-medium">Status</span>
          <Badge variant="secondary">Active</Badge>
        </DataListItem>
      </DataList>
    </Card>
  </Story>

  <Story
    title="Multi-column grid"
    description="Three-column responsive grid of label/value pairs for compact summaries."
  >
    <Card class="max-w-3xl">
      <div class="grid gap-x-8 gap-y-3 p-6 sm:grid-cols-3">
        <DataListItem class="border-0 py-1">
          <span class="text-muted-foreground text-xs tracking-wide uppercase"
            >MRR</span
          >
          <span class="text-sm font-semibold">$48,392</span>
        </DataListItem>
        <DataListItem class="border-0 py-1">
          <span class="text-muted-foreground text-xs tracking-wide uppercase"
            >Customers</span
          >
          <span class="text-sm font-semibold">1,284</span>
        </DataListItem>
        <DataListItem class="border-0 py-1">
          <span class="text-muted-foreground text-xs tracking-wide uppercase"
            >Churn</span
          >
          <span class="text-sm font-semibold">2.1%</span>
        </DataListItem>
        <DataListItem class="border-0 py-1">
          <span class="text-muted-foreground text-xs tracking-wide uppercase"
            >NPS</span
          >
          <span class="text-sm font-semibold">62</span>
        </DataListItem>
        <DataListItem class="border-0 py-1">
          <span class="text-muted-foreground text-xs tracking-wide uppercase"
            >Trials</span
          >
          <span class="text-sm font-semibold">38</span>
        </DataListItem>
        <DataListItem class="border-0 py-1">
          <span class="text-muted-foreground text-xs tracking-wide uppercase"
            >Active seats</span
          >
          <span class="text-sm font-semibold">2,940</span>
        </DataListItem>
      </div>
    </Card>
  </Story>

  <Story
    title="With chips and badges"
    description="Values rendered as status badges and feature chips."
  >
    <Card class="max-w-md">
      <DataList class="p-6">
        <DataListItem>
          <span class="text-sm font-medium">Environment</span>
          <Badge variant="secondary">Production</Badge>
        </DataListItem>
        <DataListItem>
          <span class="text-sm font-medium">Region</span>
          <div class="flex gap-1.5">
            <Badge variant="outline">us-east</Badge>
            <Badge variant="outline">eu-west</Badge>
          </div>
        </DataListItem>
        <DataListItem>
          <span class="text-sm font-medium">Tier</span>
          <Badge
            class="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
            >Enterprise</Badge
          >
        </DataListItem>
        <DataListItem>
          <span class="text-sm font-medium">SSO</span>
          <Badge class="bg-sky-500/10 text-sky-700 dark:text-sky-400"
            >SAML</Badge
          >
        </DataListItem>
      </DataList>
    </Card>
  </Story>

  <Story
    title="In a card with header"
    description="DataList paired with a Card header for a labeled detail panel."
  >
    <Card class="max-w-md">
      <CardHeader>
        <CardTitle class="text-base">Subscription</CardTitle>
        <CardDescription
          >Billing and plan details for this workspace.</CardDescription
        >
      </CardHeader>
      <CardContent>
        <DataList>
          <DataListItem>
            <span class="text-muted-foreground text-sm">Plan</span>
            <span class="text-sm font-medium">Pro · Annual</span>
          </DataListItem>
          <DataListItem>
            <span class="text-muted-foreground text-sm">Seats</span>
            <span class="text-sm font-medium">24 of 50</span>
          </DataListItem>
          <DataListItem>
            <span class="text-muted-foreground text-sm">Next invoice</span>
            <span class="text-sm font-medium">$2,400 on Sep 12</span>
          </DataListItem>
          <DataListItem>
            <div class="flex items-center gap-2">
              <Shield class="text-muted-foreground size-3.5" />
              <span class="text-sm font-medium">SOC 2</span>
            </div>
            <Check class="text-success size-4" aria-hidden="true" />
          </DataListItem>
          <DataListItem>
            <div class="flex items-center gap-2">
              <Zap class="text-muted-foreground size-3.5" />
              <span class="text-sm font-medium">Priority support</span>
            </div>
            <Check class="text-success size-4" aria-hidden="true" />
          </DataListItem>
        </DataList>
      </CardContent>
    </Card>
  </Story>
</template>
