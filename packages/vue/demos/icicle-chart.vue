<script setup lang="ts">
import { IcicleChart } from "@/components/ui/charts";

const volume = {
  name: "Air cargo · 2,780 t",
  children: [
    {
      name: "Transpacific",
      children: [
        { name: "PVG–LAX", value: 520 },
        { name: "ICN–ORD", value: 410 },
        { name: "NRT–DFW", value: 350 },
      ],
    },
    {
      name: "Intra-Asia",
      children: [
        { name: "SIN–HKG", value: 380 },
        { name: "HKG–ANC", value: 290 },
        { name: "SIN–ICN", value: 190 },
      ],
    },
    {
      name: "Europe",
      children: [
        { name: "FRA–JFK", value: 360 },
        { name: "DXB–SIN", value: 280 },
      ],
    },
  ],
};

const capacity = {
  name: "Capacity · 2,200 t",
  children: [
    {
      name: "Star Alliance",
      children: [
        { name: "SQ", value: 380 },
        { name: "LH", value: 320 },
        { name: "BR", value: 240 },
      ],
    },
    {
      name: "Oneworld",
      children: [
        { name: "CX", value: 410 },
        { name: "JL", value: 310 },
      ],
    },
    {
      name: "SkyTeam",
      children: [
        { name: "KE", value: 300 },
        { name: "CI", value: 240 },
      ],
    },
  ],
};
</script>

<template>
  <Story
    title="Volume by trade lane"
    description="Top-down partition: region, then lane. Width is tonnage."
  >
    <IcicleChart :data="volume" height="360" />
  </Story>

  <Story
    title="Capacity by alliance"
    description="Same shape for carrier splits — colour follows the top-level branch."
  >
    <IcicleChart :data="capacity" height="360" />
  </Story>
</template>
