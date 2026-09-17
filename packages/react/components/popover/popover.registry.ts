import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "popover",
  type: "registry:ui",
  categories: ["overlay"],
  description:
    "Click-triggered floating panel anchored to a trigger element. Supports optional localStorage persistence and configurable dismissal (click-outside, escape, manual). Built on @radix-ui/react-popover with collision detection.",
  files: [
    { path: "popover.tsx", target: "components/ui/popover/popover.tsx" },
    { path: "index.ts", target: "components/ui/popover/index.ts" },
  ],
  dependencies: ["@radix-ui/react-popover"],
  registryDependencies: [],
});
