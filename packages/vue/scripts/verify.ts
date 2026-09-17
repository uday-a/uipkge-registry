import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { verifyRegistry } from "../../shared/scripts/verify-registry.ts";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

verifyRegistry({
  framework: process.env.REGISTRY_FRAMEWORK ?? "vue",
  root: ROOT,
  itemSchema: "https://shadcn-vue.com/schema/registry-item.json",
  indexSchema: "https://shadcn-vue.com/schema/registry.json",
}).catch((e) => {
  console.error("[verify] crashed:", e);
  process.exit(2);
});
