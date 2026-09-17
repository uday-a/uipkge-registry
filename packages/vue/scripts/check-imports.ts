import { readFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import fg from "fast-glob";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// Vue runtime helpers that Nuxt auto-imports but a plain Vite/Vue project does not.
// Any source file we ship must import these explicitly to remain portable.
const RUNTIME_HELPERS = [
  "ref",
  "computed",
  "reactive",
  "shallowRef",
  "shallowReactive",
  "readonly",
  "shallowReadonly",
  "toRef",
  "toRefs",
  "toRaw",
  "unref",
  "markRaw",
  "isRef",
  "isReactive",
  "isReadonly",
  "isProxy",
  "watch",
  "watchEffect",
  "watchPostEffect",
  "watchSyncEffect",
  "onMounted",
  "onUnmounted",
  "onBeforeMount",
  "onBeforeUnmount",
  "onUpdated",
  "onBeforeUpdate",
  "onActivated",
  "onDeactivated",
  "onErrorCaptured",
  "nextTick",
  "provide",
  "inject",
  "getCurrentInstance",
  "useSlots",
  "useAttrs",
  "h",
  "createApp",
  "defineComponent",
  "defineAsyncComponent",
  "effectScope",
] as const;

const SCRIPT_BLOCK = /<script\b[^>]*\bsetup\b[^>]*>([\s\S]*?)<\/script>/i;

function extractImportedFromVue(script: string): Set<string> {
  // Matches: import { a, b as c, type X } from 'vue'
  // and: import type { X } from 'vue'
  const named = new Set<string>();
  const importRe = /import\s+(?:type\s+)?\{([^}]+)\}\s+from\s+['"]vue['"]/g;
  let m: RegExpExecArray | null;
  while ((m = importRe.exec(script)) !== null) {
    for (const part of m[1].split(",")) {
      const cleaned = part.trim().replace(/^type\s+/, "");
      if (!cleaned) continue;
      // Handle `a as b` — register both the alias (used in code) and the original
      const asMatch = cleaned.match(/^(\w+)\s+as\s+(\w+)$/);
      if (asMatch) {
        named.add(asMatch[2]);
      } else {
        named.add(cleaned);
      }
    }
  }
  return named;
}

function stripCommentsAndStrings(script: string): string {
  // Remove block comments, line comments, then string and template literals,
  // so a token like `h(...)` inside a comment doesn't trigger a false positive.
  return script
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "")
    .replace(/'(?:\\.|[^'\\])*'/g, "''")
    .replace(/"(?:\\.|[^"\\])*"/g, '""')
    .replace(/`(?:\\.|[^`\\])*`/g, "``");
}

function findUnimportedHelpers(
  script: string,
  imported: Set<string>,
): string[] {
  const cleaned = stripCommentsAndStrings(script);
  const missing: string[] = [];
  for (const helper of RUNTIME_HELPERS) {
    if (imported.has(helper)) continue;
    // Match `helper(` as a function call, after a non-identifier character.
    // Excludes property access (`.helper(`) and substrings of longer identifiers.
    const re = new RegExp(`(^|[^\\w.$])${helper}\\s*\\(`);
    if (re.test(cleaned)) missing.push(helper);
  }
  return missing;
}

// Import specifiers that must never appear in shipped Vue source.
const REACT_LEAKS = [
  "react",
  "react-dom",
  "@radix-ui",
  "lucide-react",
  "@tanstack/react-",
];

/** True when `idx` sits inside a template literal, quoted string, or comment. */
function insideStringOrComment(source: string, idx: number): boolean {
  const before = source.slice(0, idx);
  if (before.lastIndexOf("/*") > before.lastIndexOf("*/")) return true;
  const lineBefore = before.slice(before.lastIndexOf("\n") + 1);
  if (lineBefore.includes("//")) return true;
  const count = (s: string, ch: string) =>
    s.split("").filter((c, i) => c === ch && s[i - 1] !== "\\").length;
  if (count(lineBefore, '"') % 2 === 1 || count(lineBefore, "'") % 2 === 1)
    return true;
  const backticks = before
    .split("")
    .filter((c, i) => c === "`" && before[i - 1] !== "\\").length;
  return backticks % 2 === 1;
}

/** Real import statements only -- matches inside demo-code strings don't count. */
function findReactLeaks(source: string): string[] {
  const leaks: string[] = [];
  const re =
    /\bimport\s+[^'";]*?\bfrom\s*['"]([^'"]+)['"]|\bimport\s*\(\s*['"]([^'"]+)['"]|\brequire\(\s*['"]([^'"]+)['"]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(source)) !== null) {
    const spec = m[1] ?? m[2] ?? m[3];
    if (!spec) continue;
    if (insideStringOrComment(source, m.index)) continue;
    if (spec.endsWith(".tsx") || spec.endsWith(".jsx"))
      leaks.push(`'${spec}' (React file)`);
    else if (REACT_LEAKS.some((r) => spec === r || spec.startsWith(r)))
      leaks.push(`'${spec}'`);
  }
  return leaks;
}

async function main() {
  const files = await fg(["components/**/*.vue"], {
    cwd: ROOT,
    absolute: true,
  });
  const tsFiles = await fg(
    ["components/**/*.ts", "blocks/**/*.{ts,vue}", "bootstrap/**/*.ts"],
    {
      cwd: ROOT,
      absolute: true,
      ignore: ["**/__tests__/**", "**/*.registry.ts"],
    },
  );
  const failures: { file: string; missing: string[] }[] = [];
  const leakFailures: { file: string; leaks: string[] }[] = [];

  for (const file of files) {
    const source = await readFile(file, "utf8");
    const block = source.match(SCRIPT_BLOCK);
    if (!block) continue;
    const script = block[1];
    const imported = extractImportedFromVue(script);
    const missing = findUnimportedHelpers(script, imported);
    if (missing.length) failures.push({ file, missing });
  }

  for (const file of tsFiles) {
    const leaks = findReactLeaks(await readFile(file, "utf8"));
    if (leaks.length) leakFailures.push({ file, leaks });
  }

  if (leakFailures.length) {
    console.error(
      `\n[check-imports] ${leakFailures.length} file(s) import React-ecosystem modules:\n`,
    );
    for (const { file, leaks } of leakFailures) {
      console.error(`  ${relative(ROOT, file)}`);
      console.error(`    leaks: ${leaks.join(", ")}`);
    }
    console.error(
      `\n  Fix: swap in the Vue equivalent (reka-ui, lucide-vue-next, vue-sonner, ...).\n`,
    );
    process.exit(1);
  }

  if (failures.length) {
    console.error(
      `\n[check-imports] ${failures.length} file(s) use Vue runtime helpers without importing them:\n`,
    );
    for (const { file, missing } of failures) {
      console.error(`  ${relative(ROOT, file)}`);
      console.error(`    missing: ${missing.join(", ")}`);
    }
    console.error(
      `\n  These work in Nuxt (auto-imports) but break when consumers copy the source into a plain Vue/Vite project.`,
    );
    console.error(
      `  Fix: add the helper to the existing \`import { ... } from 'vue'\` line.\n`,
    );
    process.exit(1);
  }

  console.log(
    `[check-imports] ${files.length} component file(s) + ${tsFiles.length} ts/vue file(s) checked -- no missing Vue imports, no React leaks.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
