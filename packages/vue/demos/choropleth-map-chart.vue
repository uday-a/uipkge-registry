<script setup lang="ts">
import { ChoroplethMapChart } from "@/components/ui/charts";
import { WORLD_GEOJSON } from "@/lib/world-geo";
import { US_GEOJSON } from "@/lib/us-geo";
import { EU_GEOJSON } from "@/lib/eu-geo";
import { INDIA_GEOJSON } from "@/lib/india-geo";
import { US_DEMOGRAPHICS } from "@/lib/us-demographics";

// ── 1. Global internet adoption (World GeoJSON) ──
const worldData = [
  { id: "United States of America", value: 92 },
  { id: "Canada", value: 94 },
  { id: "United Kingdom", value: 95 },
  { id: "Germany", value: 93 },
  { id: "France", value: 92 },
  { id: "Spain", value: 94 },
  { id: "Italy", value: 85 },
  { id: "Japan", value: 93 },
  { id: "South Korea", value: 97 },
  { id: "Australia", value: 91 },
  { id: "India", value: 52 },
  { id: "China", value: 74 },
  { id: "Brazil", value: 81 },
  { id: "Mexico", value: 76 },
  { id: "South Africa", value: 72 },
  { id: "Nigeria", value: 45 },
  { id: "Egypt", value: 71 },
  { id: "Indonesia", value: 66 },
  { id: "Saudi Arabia", value: 99 },
  { id: "Turkey", value: 83 },
  { id: "Argentina", value: 87 },
  { id: "Poland", value: 87 },
  { id: "Sweden", value: 96 },
  { id: "Norway", value: 98 },
  { id: "Netherlands", value: 96 },
];
const worldTooltip = {
  formatter: (p: any) =>
    p.value == null ? p.name : `${p.name}: ${p.value}% internet penetration`,
};

// ── 2. Regional unemployment (US sample) ──
const EXCLUDED = new Set(["AK", "HI", "PR"]);
const CONUS_GEOJSON = {
  ...US_GEOJSON,
  features: US_GEOJSON.features.filter((f: any) => !EXCLUDED.has(f.id)),
};
const unemployed = Object.entries(US_DEMOGRAPHICS).map(([id, d]) => ({
  id,
  value: d.unemployment,
}));
const stateName = Object.fromEntries(
  Object.entries(US_DEMOGRAPHICS).map(([id, d]) => [id, d.name]),
);
const usTooltip = {
  formatter: (p: any) =>
    `${stateName[p.name] ?? p.name}: ${p.value == null ? "—" : `${p.value}%`}`,
};
const usBins = [
  { lte: 3, label: "0 – 3%", color: "#fefce8" },
  { gt: 3, lte: 4, label: "3 – 4%", color: "#fde68a" },
  { gt: 4, lte: 5, label: "4 – 5%", color: "#fbbf24" },
  { gt: 5, lte: 6, label: "5 – 6%", color: "#d97706" },
  { gt: 6, label: "> 6%", color: "#92400e" },
];

// ── 3. Europe population (EU GeoJSON) ──
const EU_POP: [string, string, number][] = [
  ["DE", "Germany", 83.5],
  ["FR", "France", 68.2],
  ["GB", "United Kingdom", 69.3],
  ["IT", "Italy", 58.9],
  ["ES", "Spain", 48.6],
  ["PL", "Poland", 36.6],
  ["RO", "Romania", 19.1],
  ["NL", "Netherlands", 17.9],
  ["BE", "Belgium", 11.8],
  ["CZ", "Czechia", 10.9],
  ["SE", "Sweden", 10.5],
  ["PT", "Portugal", 10.4],
  ["GR", "Greece", 10.3],
  ["HU", "Hungary", 9.6],
  ["AT", "Austria", 9.1],
  ["CH", "Switzerland", 8.9],
  ["BG", "Bulgaria", 6.4],
  ["DK", "Denmark", 5.9],
  ["FI", "Finland", 5.6],
  ["NO", "Norway", 5.5],
  ["SK", "Slovakia", 5.4],
  ["IE", "Ireland", 5.3],
  ["HR", "Croatia", 3.9],
  ["LT", "Lithuania", 2.9],
  ["SI", "Slovenia", 2.1],
  ["LV", "Latvia", 1.9],
  ["EE", "Estonia", 1.4],
  ["CY", "Cyprus", 1.4],
  ["LU", "Luxembourg", 0.7],
];
const euData = EU_POP.map(([id, , value]) => ({ id, value }));
const euName = Object.fromEntries(EU_POP.map(([id, name]) => [id, name]));
const euTooltip = {
  formatter: (p: any) =>
    p.value == null
      ? (euName[p.name] ?? p.name)
      : `${euName[p.name] ?? p.name}: ${p.value}M`,
};

// ── 4. Diverging economic growth (Europe) ──
const EU_GROWTH: [string, number][] = [
  ["IE", 4.2],
  ["HR", 3.1],
  ["PL", 2.9],
  ["CY", 2.8],
  ["ES", 2.5],
  ["GR", 2.1],
  ["DK", 1.8],
  ["PT", 1.6],
  ["BE", 1.1],
  ["FR", 0.9],
  ["NL", 0.8],
  ["IT", 0.7],
  ["SE", 0.4],
  ["GB", 0.3],
  ["DE", -0.2],
  ["AT", -0.4],
  ["FI", -0.6],
  ["EE", -1.2],
];
const growthData = EU_GROWTH.map(([id, value]) => ({ id, value }));
const growthBins = [
  { gt: 2, label: "> +2.0%", color: "#15803d" },
  { gt: 0, lte: 2, label: "0 to +2.0%", color: "#86efac" },
  { lte: 0, label: "< 0% (Contraction)", color: "#f87171" },
];
const growthTooltip = {
  formatter: (p: any) =>
    p.value == null
      ? (euName[p.name] ?? p.name)
      : `${euName[p.name] ?? p.name}: ${p.value > 0 ? "+" : ""}${p.value}% GDP growth`,
};

// ── 5. India state breakdown (India GeoJSON) ──
const IN_POP: [string, string, number][] = [
  ["UP", "Uttar Pradesh", 236],
  ["MH", "Maharashtra", 126],
  ["BR", "Bihar", 129],
  ["WB", "West Bengal", 99],
  ["MP", "Madhya Pradesh", 86],
  ["RJ", "Rajasthan", 81],
  ["TN", "Tamil Nadu", 77],
  ["KA", "Karnataka", 68],
  ["GJ", "Gujarat", 64],
  ["AP", "Andhra Pradesh", 53],
  ["OD", "Odisha", 46],
  ["TS", "Telangana", 38],
  ["KL", "Kerala", 36],
  ["JH", "Jharkhand", 39],
  ["AS", "Assam", 36],
  ["PB", "Punjab", 30],
  ["CT", "Chhattisgarh", 30],
  ["HR", "Haryana", 30],
  ["DL", "Delhi", 33],
  ["JK", "Jammu and Kashmir", 13],
  ["LA", "Ladakh", 0.3],
  ["UT", "Uttarakhand", 12],
  ["HP", "Himachal Pradesh", 7.5],
  ["TR", "Tripura", 4.1],
  ["ML", "Meghalaya", 3.4],
  ["MN", "Manipur", 3.1],
  ["NL", "Nagaland", 2.3],
  ["GA", "Goa", 1.6],
  ["AR", "Arunachal Pradesh", 1.7],
  ["MZ", "Mizoram", 1.2],
  ["SK", "Sikkim", 0.7],
  ["AN", "Andaman and Nicobar Islands", 0.4],
  ["CH", "Chandigarh", 1.2],
  ["DN", "Dadra and Nagar Haveli and Daman and Diu", 0.6],
  ["LD", "Lakshadweep", 0.1],
  ["PY", "Puducherry", 1.7],
];
const inData = IN_POP.map(([id, , value]) => ({ id, value }));
const inName = Object.fromEntries(IN_POP.map(([id, name]) => [id, name]));
const inTooltip = {
  formatter: (p: any) =>
    p.value == null
      ? (inName[p.name] ?? p.name)
      : `${inName[p.name] ?? p.name}: ${p.value}M`,
};

// ── 6. Flight corridors & freight hubs ──
const logisticsPins = [
  {
    name: "Frankfurt Air Cargo",
    coord: [8.6821, 50.1109] as [number, number],
    color: "#3b82f6",
  },
  {
    name: "Heathrow Logistics",
    coord: [-0.4543, 51.47] as [number, number],
    color: "#10b981",
  },
  {
    name: "Paris CDG Terminal",
    coord: [2.55, 49.0097] as [number, number],
    color: "#10b981",
  },
  {
    name: "Milan Malpensa",
    coord: [8.723, 45.63] as [number, number],
    color: "#f59e0b",
  },
];
const logisticsLinks = [
  {
    from: [8.6821, 50.1109] as [number, number],
    to: [-0.4543, 51.47] as [number, number],
    label: "FRA → LHR",
  },
  {
    from: [8.6821, 50.1109] as [number, number],
    to: [2.55, 49.0097] as [number, number],
    label: "FRA → CDG",
  },
  {
    from: [2.55, 49.0097] as [number, number],
    to: [8.723, 45.63] as [number, number],
    label: "CDG → MXP",
  },
];
</script>

<template>
  <Story
    title="Global internet adoption"
    description="World choropleth using Natural Earth 110m outlines. Continuous blue scale with full country coverage."
  >
    <ChoroplethMapChart
      :geo-json="WORLD_GEOJSON"
      map-name="uipkge-world"
      :data="worldData"
      :show-scale="true"
      :option="{
        series: [{ label: { show: false } }],
        visualMap: { inRange: { color: ['#dbeafe', '#1e3a8a'] } },
        tooltip: worldTooltip,
      }"
      height="460"
    />
  </Story>

  <Story
    title="Binned classification"
    description="Discrete classification intervals with an amber threshold palette. State abbreviations on regions, full names on hover."
  >
    <ChoroplethMapChart
      :geo-json="CONUS_GEOJSON"
      map-name="uipkge-conus"
      :data="unemployed"
      :show-scale="true"
      :option="{ visualMap: { pieces: usBins }, tooltip: usTooltip }"
      height="440"
    />
  </Story>

  <Story
    title="Diverging growth scale"
    description="Three-color diverging palette centered at 0% to distinguish economic expansion from contraction."
  >
    <ChoroplethMapChart
      :geo-json="EU_GEOJSON"
      map-name="uipkge-eu-growth"
      :data="growthData"
      :show-scale="true"
      :option="{ visualMap: { pieces: growthBins }, tooltip: growthTooltip }"
      height="440"
    />
  </Story>

  <Story
    title="Continuous sequential scale"
    description="European population across EU-27 and neighboring states. Countries without data render in neutral grey."
  >
    <ChoroplethMapChart
      :geo-json="EU_GEOJSON"
      map-name="uipkge-eu-pop"
      :data="euData"
      :show-scale="true"
      :option="{
        visualMap: { inRange: { color: ['#eff6ff', '#1d4ed8'] } },
        tooltip: euTooltip,
      }"
      height="440"
    />
  </Story>

  <Story
    title="High-density regional map"
    description="Subdivision-level administrative mapping across 36 states and union territories."
  >
    <ChoroplethMapChart
      :geo-json="INDIA_GEOJSON"
      map-name="uipkge-india"
      :data="inData"
      :show-scale="true"
      :option="{
        visualMap: { inRange: { color: ['#f0fdfa', '#0f766e'] } },
        tooltip: inTooltip,
      }"
      height="440"
    />
  </Story>

  <Story
    title="Freight corridors and hubs"
    description="Pin markers with curved connection lines between logistics nodes."
  >
    <ChoroplethMapChart
      :geo-json="EU_GEOJSON"
      map-name="uipkge-eu-logistics"
      :data="euData"
      :pins="logisticsPins"
      :links="logisticsLinks"
      height="440"
    />
  </Story>
</template>
