import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "utils",
  type: "registry:lib",
  description:
    "Tailwind class merge helper: cn(). Combines clsx and tailwind-merge.",
  files: [{ path: "utils.ts", target: "lib/utils.ts" }],
  dependencies: ["clsx", "tailwind-merge"],
  registryDependencies: [],
});
