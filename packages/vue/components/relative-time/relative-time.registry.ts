import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "relative-time",
  type: "registry:ui",
  categories: ["display", "utility"],
  framework: "vue",
  description:
    'Live relative timestamp — "2 minutes ago", "yesterday", "in 3 days" — via Intl.RelativeTimeFormat. `display` switches the label to relative, absolute, or both. `timeZone` (IANA or `UTC`) formats the clock and tooltip; omit it for the browser local zone. `parseAs` treats naive ISO strings as local or UTC. Renders a semantic <time>. Pass `now` to freeze the clock for tests and SSR.',
  files: [
    {
      path: "RelativeTime.vue",
      target: "components/ui/relative-time/RelativeTime.vue",
    },
    {
      path: "format-relative-time.ts",
      target: "components/ui/relative-time/format-relative-time.ts",
    },
    { path: "index.ts", target: "components/ui/relative-time/index.ts" },
  ],
  dependencies: [],
  registryDependencies: [],
});
