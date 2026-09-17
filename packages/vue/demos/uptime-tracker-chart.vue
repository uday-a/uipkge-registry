<script setup lang="ts">
import { UptimeTrackerChart, type StatusDay } from "@/components/ui/charts";

function seeded(i: number) {
  const x = Math.sin(i * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

const anchor = new Date("2026-09-05T00:00:00Z");
function build(outages: Record<number, "degraded" | "down">): StatusDay[] {
  return Array.from({ length: 90 }, (_, i) => {
    const d = new Date(anchor);
    d.setUTCDate(anchor.getUTCDate() - (89 - i));
    return {
      date: d.toISOString().slice(0, 10),
      status: outages[i] ?? (seeded(i) > 0.97 ? "unknown" : "up"),
    };
  });
}

const healthy = build({});
const incident = build({
  62: "degraded",
  63: "degraded",
  64: "down",
  81: "degraded",
});
</script>

<template>
  <Story
    title="Healthy quarter"
    description="90 daily bars; uptime % computes from the data."
  >
    <UptimeTrackerChart :days="healthy" />
  </Story>

  <Story
    title="With incidents"
    description="Degraded stretches and a full outage day. Hover any bar for its date."
  >
    <UptimeTrackerChart :days="incident" />
  </Story>

  <Story title="Compact" description="Hide the legend for status-page grids.">
    <UptimeTrackerChart
      :days="incident.slice(60)"
      :show-legend="false"
      :height="36"
    />
  </Story>
</template>
