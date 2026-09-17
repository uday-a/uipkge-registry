import path from "node:path";
import { existsSync } from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import type { Plugin } from "vite";

const root = path.resolve(__dirname);

function registryBlocksAlias(): Plugin {
  return {
    name: "uipkge-registry-blocks-alias",
    enforce: "pre",
    resolveId(source: string) {
      if (source.startsWith("@/components/blocks/")) {
        let name = source.slice("@/components/blocks/".length);
        if (!name.includes("/")) {
          const file = name.replace(/\.(tsx?)$/, "");
          const dir = file.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
          name = `${dir}/${name}`;
        }
        const candidate = path.join(root, "blocks", name);
        if (existsSync(candidate)) return candidate;
        if (existsSync(`${candidate}.tsx`)) return `${candidate}.tsx`;
        if (existsSync(`${candidate}.ts`)) return `${candidate}.ts`;
        if (existsSync(path.join(candidate, "index.ts")))
          return path.join(candidate, "index.ts");
        if (existsSync(path.join(candidate, "index.tsx")))
          return path.join(candidate, "index.tsx");
        return candidate;
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
  root: path.resolve(__dirname, "playground"),
  publicDir: path.resolve(__dirname, "public"),
  plugins: [react(), tailwindcss(), registryBlocksAlias()],
  server: {
    port: 5174,
    open: false,
    fs: {
      allow: ["..", root, path.resolve(root, "..", "..")],
    },
  },
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
        find: "@/lib/use-theme",
        replacement: path.join(root, "bootstrap/use-theme/use-theme.ts"),
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
      // Demo compatibility aliases
      {
        find: /.*\/components\/story\/Story(\.tsx?)?$/,
        replacement: path.join(root, "playground/src/Story.tsx"),
      },
      {
        find: /^@react-registry\/(.*)$/,
        replacement: path.join(root, "components/$1"),
      },
    ],
  },
});
