import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "countdown",
  type: "registry:ui",
  categories: ["display", "utility"],
  framework: "react",
  description:
    "Countdown timer that shows time remaining to a target date. Digits flip on each tick. Supports DD:HH:MM:SS, HH:MM:SS, MM:SS, and SS formats plus custom token formats, render props for days/hours/minutes/seconds, a label, leading-zero padding, a custom separator, paused state, and on-finish/tick events.",
  files: [
    { path: "Countdown.tsx", target: "components/ui/countdown/Countdown.tsx" },
    { path: "index.ts", target: "components/ui/countdown/index.ts" },
  ],
  dependencies: [],
  registryDependencies: [],
});
