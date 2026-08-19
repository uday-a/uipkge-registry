import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "code-block",
  type: "registry:ui",
  categories: ["data-display"],
  description:
    "Syntax-highlighted code preview with a language header, copy button, optional line numbers, and collapsible `<pre>` content. Use for installation snippets, API examples, and source you want users to copy verbatim.",
  files: [
    { path: "CodeBlock.tsx", target: "components/ui/code-block/CodeBlock.tsx" },
    { path: "index.ts", target: "components/ui/code-block/index.ts" },
  ],
  dependencies: ["lucide-react", "shiki"],
  registryDependencies: ["https://uipkge.dev/r/button.json"],
});
