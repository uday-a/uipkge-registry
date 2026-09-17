import path from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import type { Plugin } from "vite";

const root = path.resolve(__dirname);

function registryAtAlias(): Plugin {
  return {
    name: "uipkge-registry-at-alias",
    enforce: "pre",
    async resolveId(source: string, importer?: string) {
      if (!source.startsWith("@/") && !source.startsWith("~/")) return null;
      const rest = source.slice(2);

      if (rest === "lib/utils") {
        return path.join(root, "lib/utils.ts");
      }

      if (rest.startsWith("composables/")) {
        const comp = rest
          .slice("composables/".length)
          .replace(/\.(ts|js)$/, "");
        const dir = comp.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
        return path.join(root, "bootstrap", dir, `${comp}.ts`);
      }

      if (source.startsWith("~/composables/")) {
        const comp = source
          .slice("~/composables/".length)
          .replace(/\.(ts|js)$/, "");
        const dir = comp.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
        return path.join(root, "bootstrap", dir, `${comp}.ts`);
      }

      if (rest.startsWith("components/ui/")) {
        const comp = rest.slice("components/ui/".length);
        return path.join(root, "components", comp);
      }

      return null;
    },
  };
}

export default defineConfig({
  root: path.resolve(__dirname, "playground"),
  publicDir: path.resolve(__dirname, "public"),
  plugins: [vue(), tailwindcss(), registryAtAlias()],
  server: {
    port: 5173,
    open: false,
    fs: {
      allow: ["..", root, path.resolve(root, "..", "..")],
    },
  },
  resolve: {
    alias: [
      {
        find: /^@\/components\/ui\/(.*)$/,
        replacement: path.join(root, "components/$1"),
      },
      { find: "@/lib/utils", replacement: path.join(root, "lib/utils.ts") },
      { find: /^@\/lib\/(.*)$/, replacement: path.join(root, "lib/$1") },
      {
        find: /^@\/bootstrap\/(.*)$/,
        replacement: path.join(root, "bootstrap/$1"),
      },
    ],
  },
});
