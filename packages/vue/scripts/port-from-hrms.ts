/**
 * Port shadcn-vue components from HRMS into the registry.
 *
 * Reads: <HRMS>/app/components/ui/<name>/<files>
 * Writes:
 *   - packages/registry-vue/components/<name>/<files>            (copy of source)
 *   - packages/registry-vue/components/<name>/<name>.registry.ts (auto-generated sidecar)
 *
 * Detection:
 *   - dependencies: external imports (not relative, not @/, not vue/nuxt builtins)
 *   - registryDependencies: cross-component imports (@/components/ui/<other>)
 *
 * Idempotent: re-running overwrites previous port.
 */
import { readFile, writeFile, mkdir, readdir, stat } from "node:fs/promises";
import { join } from "node:path";

const HRMS_UI = "/Users/uday/code/HRM/hrms/app/components/ui";
const TARGET = new URL("../components/", import.meta.url).pathname;

const VUE_BUILTINS = new Set(["vue", "nuxt", "#imports", "#app", "nuxt/app"]);
const REGISTRY_URL = process.env.REGISTRY_URL ?? "https://uipkge.dev/r";

const IMPORT_RE = /import\s+(?:[\s\S]+?\s+from\s+)?['"]([^'"]+)['"]/g;

interface Detected {
  dependencies: Set<string>;
  registryDependencies: Set<string>;
  nuxtFlag: boolean;
}

async function listFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir);
  const files: string[] = [];
  for (const e of entries) {
    const full = join(dir, e);
    const s = await stat(full);
    if (s.isFile() && (e.endsWith(".vue") || e.endsWith(".ts"))) files.push(e);
  }
  return files;
}

function detect(source: string, det: Detected) {
  for (const m of source.matchAll(IMPORT_RE)) {
    const spec = m[1];
    if (!spec) continue;
    if (spec.startsWith(".")) continue;

    if (spec.startsWith("@/components/ui/")) {
      const dep = spec.split("/")[3]?.split(".")[0];
      if (dep) det.registryDependencies.add(dep);
      continue;
    }

    if (
      spec.startsWith("@/") ||
      spec.startsWith("~/") ||
      spec.startsWith("~~/")
    )
      continue;

    if (VUE_BUILTINS.has(spec) || spec.startsWith("#")) {
      if (spec === "nuxt" || spec.startsWith("#") || spec === "nuxt/app")
        det.nuxtFlag = true;
      continue;
    }

    // Normalize scoped packages: @scope/pkg/sub → @scope/pkg
    const pkg = spec.startsWith("@")
      ? spec.split("/").slice(0, 2).join("/")
      : spec.split("/")[0];
    if (pkg) det.dependencies.add(pkg);
  }
}

async function portOne(name: string) {
  const srcDir = join(HRMS_UI, name);
  const destDir = join(TARGET, name);
  await mkdir(destDir, { recursive: true });

  const files = await listFiles(srcDir);
  if (files.length === 0) return null;

  const det: Detected = {
    dependencies: new Set(),
    registryDependencies: new Set(),
    nuxtFlag: false,
  };

  for (const f of files) {
    const src = await readFile(join(srcDir, f), "utf8");
    detect(src, det);
    await writeFile(join(destDir, f), src);
  }

  // Don't list self as a registry dep (e.g. button's index.ts may reference '.')
  det.registryDependencies.delete(name);

  const sidecar = `import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: '${name}',
  type: 'registry:ui',
  framework: '${det.nuxtFlag ? "nuxt" : "vue"}',
  files: [
${files.map((f) => `    { path: '${f}', target: 'components/ui/${name}/${f}' },`).join("\n")}
  ],
  dependencies: [${[...det.dependencies]
    .sort()
    .map((d) => `'${d}'`)
    .join(", ")}],
  registryDependencies: [${[...det.registryDependencies]
    .sort()
    .map((d) => `'${REGISTRY_URL}/${d}.json'`)
    .join(", ")}],
})
`;
  await writeFile(join(destDir, `${name}.registry.ts`), sidecar);

  return {
    name,
    files: files.length,
    deps: det.dependencies.size,
    registryDeps: det.registryDependencies.size,
    nuxt: det.nuxtFlag,
  };
}

async function main() {
  const all = await readdir(HRMS_UI);
  const folders: string[] = [];
  for (const e of all) {
    const s = await stat(join(HRMS_UI, e));
    if (s.isDirectory()) folders.push(e);
  }

  console.log(`[port] found ${folders.length} components in ${HRMS_UI}`);

  const results = [];
  for (const f of folders) {
    const r = await portOne(f);
    if (r) results.push(r);
  }

  console.log(
    "\nname".padEnd(28) +
      "files".padStart(6) +
      "  deps".padEnd(8) +
      "reg-deps".padEnd(10) +
      "nuxt",
  );
  console.log("-".repeat(60));
  for (const r of results) {
    console.log(
      r.name.padEnd(28) +
        String(r.files).padStart(6) +
        String(r.deps).padStart(6) +
        "  " +
        String(r.registryDeps).padStart(8) +
        "  " +
        (r.nuxt ? "YES" : "-"),
    );
  }
  console.log(`\n[port] total: ${results.length} components`);
  console.log(
    `[port] nuxt-flagged: ${results.filter((r) => r.nuxt).length} (review manually)`,
  );
}

main().catch((e) => {
  console.error("[port] failed:", e);
  process.exit(1);
});
