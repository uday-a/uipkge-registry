import path from "node:path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

const root = path.resolve(__dirname);

import { existsSync } from "node:fs";

// Mirrors the astro-site registryAtAlias plugin:
//  - `@/components/blocks/PaymentForm` -> `blocks/payment-form/PaymentForm.tsx`
//    (derives the kebab dir from the PascalCase file name).
//  - `@/lib/<name>` -> `bootstrap/<name>/<name>` or `bootstrap/<name>/<camel>`
//    (bootstrap hooks live as <kebab>/<kebab-or-camel> files, no index.ts).
function registryBlocksAlias() {
  return {
    name: "uipkge-registry-blocks-alias",
    enforce: "pre" as const,
    resolveId(source: string) {
      if (source.startsWith("@/components/blocks/")) {
        let name = source.slice("@/components/blocks/".length);
        if (!name.includes("/")) {
          const file = name.replace(/\.(tsx?)$/, "");
          const dir = file.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
          name = `${dir}/${name}`;
        }
        return path.join(root, "blocks", name);
      }
      if (source.startsWith("@/lib/") && !source.endsWith("utils")) {
        const name = source.slice("@/lib/".length);
        const camel = name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        for (const cand of [
          path.join(root, "bootstrap", name, `${name}.ts`),
          path.join(root, "bootstrap", name, `${camel}.ts`),
        ]) {
          if (existsSync(cand)) return cand;
        }
      }
      return null;
    },
  };
}

export default defineConfig({
  plugins: [react(), registryBlocksAlias()],
  resolve: {
    alias: [
      {
        find: "@/lib/utils",
        replacement: path.join(root, "bootstrap/utils/utils.ts"),
      },
      {
        find: "@/lib/use-kanban",
        replacement: path.join(root, "bootstrap/use-kanban/useKanban.ts"),
      },
      {
        find: "@/lib/use-month-grid",
        replacement: path.join(
          root,
          "bootstrap/use-month-grid/useMonthGrid.ts",
        ),
      },
      {
        find: /^@\/components\/ui\/(.*)$/,
        replacement: path.join(root, "components/$1"),
      },
      { find: /^@\/lib\/(.*)$/, replacement: path.join(root, "bootstrap/$1") },
      {
        find: /^@\/bootstrap\/(.*)$/,
        replacement: path.join(root, "bootstrap/$1"),
      },
    ],
  },
  test: {
    name: "registry-react",
    environment: "jsdom",
    setupFiles: [path.join(root, "components/data-table/__tests__/setup.ts")],
    include: [
      "components/**/__tests__/**/*.{spec,test}.tsx",
      "components/**/__tests__/**/*.{spec,test}.ts",
      "bootstrap/**/__tests__/**/*.{spec,test}.tsx",
      "bootstrap/**/__tests__/**/*.{spec,test}.ts",
    ],
    css: false,
    globals: false,
    testTimeout: 30000,
  },
});
