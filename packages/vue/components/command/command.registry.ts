import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "command",
  type: "registry:ui",
  categories: ["overlay"],
  framework: "vue",
  description:
    "Searchable command palette à la Cmd-K — keyboard-driven menu with grouped items, icons, shortcuts, and fuzzy filtering. Use as a global launcher (mounted in a Dialog) or inline as a typeahead select.",
  files: [
    { path: "Command.vue", target: "components/ui/command/Command.vue" },
    {
      path: "CommandDialog.vue",
      target: "components/ui/command/CommandDialog.vue",
    },
    {
      path: "CommandEmpty.vue",
      target: "components/ui/command/CommandEmpty.vue",
    },
    {
      path: "CommandGroup.vue",
      target: "components/ui/command/CommandGroup.vue",
    },
    {
      path: "CommandInput.vue",
      target: "components/ui/command/CommandInput.vue",
    },
    {
      path: "CommandItem.vue",
      target: "components/ui/command/CommandItem.vue",
    },
    {
      path: "CommandList.vue",
      target: "components/ui/command/CommandList.vue",
    },
    {
      path: "CommandSeparator.vue",
      target: "components/ui/command/CommandSeparator.vue",
    },
    {
      path: "CommandShortcut.vue",
      target: "components/ui/command/CommandShortcut.vue",
    },
    { path: "index.ts", target: "components/ui/command/index.ts" },
  ],
  dependencies: ["@vueuse/core", "lucide-vue-next", "reka-ui"],
  registryDependencies: ["https://uipkge.dev/r/dialog.json"],
});
