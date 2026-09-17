import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "command",
  type: "registry:ui",
  categories: ["overlay"],
  description:
    "Searchable command palette à la Cmd-K — keyboard-driven menu with grouped items, icons, shortcuts, and fuzzy filtering. Use as a global launcher (mounted in a Dialog) or inline as a typeahead select.",
  files: [
    { path: "command.tsx", target: "components/ui/command/command.tsx" },
    { path: "index.ts", target: "components/ui/command/index.ts" },
  ],
  dependencies: ["cmdk", "lucide-react", "@radix-ui/react-dialog"],
  registryDependencies: [],
});
