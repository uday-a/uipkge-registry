import Story from "../../components/story/Story";
import { GraphChart } from "@react-registry/charts";

const services = [
  { name: "API", category: 0 },
  { name: "Worker", category: 1 },
  { name: "DB", category: 2 },
  { name: "Cache", category: 3 },
  { name: "Queue", category: 4 },
  { name: "CDN", category: 0 },
];
const serviceLinks = [
  { source: "API", target: "DB" },
  { source: "API", target: "Cache" },
  { source: "API", target: "Queue" },
  { source: "Queue", target: "Worker" },
  { source: "Worker", target: "DB" },
  { source: "CDN", target: "API" },
];
const serviceCategories = ["Edge", "Compute", "Storage", "Cache", "Messaging"];

const ring = [
  { name: "A", category: 0 },
  { name: "B", category: 0 },
  { name: "C", category: 1 },
  { name: "D", category: 1 },
  { name: "E", category: 2 },
  { name: "F", category: 2 },
];
const ringLinks = [
  { source: "A", target: "B" },
  { source: "B", target: "C" },
  { source: "C", target: "D" },
  { source: "D", target: "E" },
  { source: "E", target: "F" },
  { source: "F", target: "A" },
  { source: "A", target: "D" },
  { source: "C", target: "F" },
];

// Knowledge graph — undirected concept network with weighted edges.
const concepts = [
  { name: "Vue", category: 0, symbolSize: 44 },
  { name: "Reactivity", category: 0 },
  { name: "Composition API", category: 0 },
  { name: "Pinia", category: 1 },
  { name: "Nuxt", category: 1, symbolSize: 38 },
  { name: "Vite", category: 2 },
  { name: "Tailwind", category: 3, symbolSize: 36 },
  { name: "OKLCH tokens", category: 3 },
];
const conceptLinks = [
  { source: "Vue", target: "Reactivity", value: 5 },
  { source: "Vue", target: "Composition API", value: 5 },
  { source: "Vue", target: "Pinia", value: 3 },
  { source: "Vue", target: "Nuxt", value: 5 },
  { source: "Nuxt", target: "Vite", value: 4 },
  { source: "Nuxt", target: "Tailwind", value: 3 },
  { source: "Tailwind", target: "OKLCH tokens", value: 4 },
];
const conceptCategories = ["Core", "State", "Tooling", "Styling"];

export default function GraphChartDemo() {
  return (
    <>
      <Story
        title="Service dependency map"
        description="Force-directed layout with categorical colouring and arrowheads pointing at the dependency target. Standard shape for runtime architecture diagrams."
      >
        <GraphChart
          nodes={services}
          links={serviceLinks}
          categories={serviceCategories}
          height={420}
        />
      </Story>

      <Story
        title="Ring (circular layout)"
        description="Same data, different layout. Circular reads well for cycle / token-passing diagrams where the cycle itself is the story."
      >
        <GraphChart
          nodes={ring}
          links={ringLinks}
          layout="circular"
          directed={false}
          height={380}
        />
      </Story>

      <Story
        title="With roam (pan + zoom)"
        description="Turn roam on once the graph passes ~25 nodes. Users can drag-pan and wheel-zoom into dense clusters."
      >
        <GraphChart
          nodes={services}
          links={serviceLinks}
          categories={serviceCategories}
          roam
          height={420}
        />
      </Story>

      <Story
        title="Knowledge graph (undirected, weighted)"
        description="Drop arrowheads when relationships are symmetric, vary node size via symbolSize to encode importance, and use link value to widen/narrow edges in the layout."
      >
        <GraphChart
          nodes={concepts}
          links={conceptLinks}
          categories={conceptCategories}
          directed={false}
          roam
          height={420}
        />
      </Story>

      <Story
        title="Compact"
        description="A shorter height for in-card or side-panel placement. The force layout still resolves cleanly because the node count is small."
      >
        <GraphChart
          nodes={services}
          links={serviceLinks}
          categories={serviceCategories}
          height={240}
        />
      </Story>
    </>
  );
}
