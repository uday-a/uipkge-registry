import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "border-beam",
  type: "registry:ui",
  categories: ["feedback", "motion"],
  description:
    "Rotating conic light beam that traces the border ring of its parent. Place inside a `relative` parent (e.g. a Card); the overlay is absolutely positioned, pointer-events-none, and masked down to a ring of `size` px thickness. Tune `duration`, `delay`, and `color`, or set `paused` to freeze it. Keyframes and the `--uipkge-border-angle` @property ship in the canonical tailwind tokens — re-pull init/tailwind if upgrading.",
  files: [
    {
      path: "BorderBeam.tsx",
      target: "components/ui/border-beam/BorderBeam.tsx",
    },
    { path: "index.ts", target: "components/ui/border-beam/index.ts" },
  ],
  dependencies: [],
  registryDependencies: [],
});
