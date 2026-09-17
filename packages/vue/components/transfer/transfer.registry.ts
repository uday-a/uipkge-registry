import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "transfer",
  type: "registry:ui",
  categories: ["data-display"],
  framework: "vue",
  description:
    "Dual-list move-between control. Two columns plus a center pair of move buttons. Optional search, pagination, and one-way mode.",
  files: [
    { path: "Transfer.vue", target: "components/ui/transfer/Transfer.vue" },
    {
      path: "TransferList.vue",
      target: "components/ui/transfer/TransferList.vue",
    },
    {
      path: "TransferOperation.vue",
      target: "components/ui/transfer/TransferOperation.vue",
    },
    { path: "context.ts", target: "components/ui/transfer/context.ts" },
    { path: "index.ts", target: "components/ui/transfer/index.ts" },
  ],
  dependencies: ["lucide-vue-next"],
  registryDependencies: [
    "https://uipkge.dev/r/input.json",
    "https://uipkge.dev/r/checkbox.json",
    "https://uipkge.dev/r/button.json",
    "https://uipkge.dev/r/scroll-area.json",
  ],
});
