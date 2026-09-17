/**
 * Shared spec-compliance verifier for packages/registry-*.
 *
 * Checks each public/r/<framework>/<name>.json plus the top-level
 * registry.json against the registry-item schema for that framework. Exits
 * non-zero with a summary on any failure so it can gate CI.
 *
 * Specs:
 *   Vue:   https://shadcn-vue.com/schema/registry-item.json
 *          https://shadcn-vue.com/schema/registry.json
 *   React: https://ui.shadcn.com/schema/registry-item.json
 *          https://ui.shadcn.com/schema/registry.json
 */
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

export interface RegistryVerifyConfig {
  /** Reads public/r/<framework>/*.json and expects /r/<framework>/ dep URLs. */
  framework: string;
  /** Absolute path of the registry package root. */
  root: string;
  itemSchema: string;
  indexSchema: string;
}

const ALLOWED_TYPES = new Set([
  "registry:ui",
  "registry:block",
  "registry:lib",
  "registry:hook",
  "registry:style",
  "registry:theme",
  "registry:component",
  "registry:page",
  "registry:file",
]);
const FORBIDDEN_FIELDS = ["framework", "manifest", "doc", "preview"];

interface Failure {
  item: string;
  check: string;
  detail: string;
}

export async function verifyRegistry(cfg: RegistryVerifyConfig) {
  const OUT_DIR = join(cfg.root, "public", "r", cfg.framework);
  const INDEX_FILE = join(cfg.root, "registry.json");
  // registryDependencies must point at the framework-namespaced path on the
  // live origin.
  const CANONICAL_HOST = process.env.REGISTRY_SITE ?? "https://uipkge.dev";
  const CANONICAL_DEP_BASE = `${CANONICAL_HOST}/r/${cfg.framework}/`;

  const failures: Failure[] = [];
  const fail = (item: string, check: string, detail: string) =>
    failures.push({ item, check, detail });

  async function checkItem(jsonPath: string) {
    const raw = await readFile(jsonPath, "utf8");
    const item = JSON.parse(raw);
    const name = item.name ?? jsonPath;

    if (item.$schema !== cfg.itemSchema)
      fail(
        name,
        "$schema",
        `expected '${cfg.itemSchema}', got '${item.$schema}'`,
      );
    if (!item.name) fail(name, "name", "missing");
    if (!item.title) fail(name, "title", "missing");
    if (!item.description) fail(name, "description", "missing");
    if (!ALLOWED_TYPES.has(item.type))
      fail(name, "type", `'${item.type}' not in spec`);
    for (const field of FORBIDDEN_FIELDS) {
      if (field in item)
        fail(name, `forbidden:${field}`, "should not be in output");
    }
    if (Array.isArray(item.files)) {
      for (const f of item.files) {
        if (!f.path) fail(name, "files[].path", "missing");
        if (!f.target) fail(name, "files[].target", `missing on '${f.path}'`);
        if (!f.type) fail(name, "files[].type", `missing on '${f.path}'`);
      }
    }
    if (Array.isArray(item.registryDependencies)) {
      for (const url of item.registryDependencies) {
        if (typeof url !== "string") continue;
        if (url.startsWith("http") && !url.startsWith(CANONICAL_DEP_BASE)) {
          fail(
            name,
            "registryDependencies host",
            `'${url}' should start with '${CANONICAL_DEP_BASE}'`,
          );
        }
      }
    }
  }

  async function checkIndex() {
    const raw = await readFile(INDEX_FILE, "utf8");
    const idx = JSON.parse(raw);
    if (idx.$schema !== cfg.indexSchema)
      fail(
        "<index>",
        "$schema",
        `expected '${cfg.indexSchema}', got '${idx.$schema}'`,
      );
    if (!idx.name) fail("<index>", "name", "missing");
    if (!idx.homepage) fail("<index>", "homepage", "missing");
    if (!Array.isArray(idx.items)) fail("<index>", "items", "not an array");
    if (Array.isArray(idx.items)) {
      for (const it of idx.items) {
        if ("manifest" in it || "doc" in it || "preview" in it) {
          fail(
            "<index>",
            "items[]",
            `entry '${it.name}' has bespoke fields (manifest/doc/preview); expected full registry-item shape`,
          );
        }
        if (!it.title)
          fail("<index>", "items[].title", `'${it.name}' missing title`);
      }
    }
  }

  const files = (await readdir(OUT_DIR)).filter(
    (f) => f.endsWith(".json") && f !== "registry.json",
  );
  for (const f of files) await checkItem(join(OUT_DIR, f));
  await checkIndex();

  if (failures.length === 0) {
    console.log(
      `[verify] PASS — ${files.length} items + index conform to spec`,
    );
    return;
  }
  const byCheck = new Map<string, Failure[]>();
  for (const f of failures) {
    const k = f.check;
    if (!byCheck.has(k)) byCheck.set(k, []);
    byCheck.get(k)!.push(f);
  }
  console.error(
    `[verify] FAIL — ${failures.length} issue(s) across ${byCheck.size} category(ies):`,
  );
  for (const [check, fs] of byCheck.entries()) {
    console.error(`\n  ${check} (${fs.length}):`);
    for (const f of fs.slice(0, 5))
      console.error(`    - ${f.item}: ${f.detail}`);
    if (fs.length > 5) console.error(`    ... and ${fs.length - 5} more`);
  }
  process.exit(1);
}
