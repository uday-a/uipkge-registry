/**
 * CI lint for the React mirror, ported from registry-vue's check-imports.
 *
 * Two checks over shipped .ts/.tsx source:
 *
 * 1. React helpers (hooks, memo, createContext, ...) must be imported
 *    explicitly. Consumers copy this source into plain Vite/Next projects --
 *    nothing auto-imports for them. Covered means: a named import from ANY
 *    module (echarts exports `use` too), a React namespace/default import
 *    (`React.useState`), or a local `const`/`function` of the same name.
 *
 * 2. No Vue-ecosystem imports (`vue`, `reka-ui`, `lucide-vue-next`, `.vue`
 *    specifiers) in REAL import statements. Matches inside strings/comments
 *    (demo code snippets are common in blocks) are ignored.
 *
 * Run automatically as part of `bun run build` / `bun run check:imports`.
 */
import { readFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import fg from "fast-glob";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const RUNTIME_HELPERS = [
  "useState",
  "useEffect",
  "useLayoutEffect",
  "useMemo",
  "useCallback",
  "useRef",
  "useContext",
  "useReducer",
  "useId",
  "useTransition",
  "useDeferredValue",
  "useSyncExternalStore",
  "useImperativeHandle",
  "useInsertionEffect",
  "useOptimistic",
  "useActionState",
  "useFormStatus",
  "memo",
  "forwardRef",
  "createContext",
  "lazy",
  "startTransition",
  "use",
] as const;

// Import specifiers that must never appear in React source.
const VUE_LEAKS = [
  "vue",
  "reka-ui",
  "lucide-vue-next",
  "vue-sonner",
  "@vueuse/",
];

/** Named imports from ANY module (`import { use } from 'echarts/core'` counts). */
function extractNamedImports(source: string): Set<string> {
  const named = new Set<string>();
  const importRe =
    /import\s+(?:type\s+)?(?:[\w$]+(?:\s+as\s+\w+)?\s*,\s*)?(?:\*\s+as\s+\w+\s*,\s*)?\{([^}]+)\}\s+from\s+['"][^'"]+['"]/g;
  let m: RegExpExecArray | null;
  while ((m = importRe.exec(source)) !== null) {
    for (const part of m[1].split(",")) {
      const cleaned = part.trim().replace(/^type\s+/, "");
      if (!cleaned) continue;
      const asMatch = cleaned.match(/^(\w+)\s+as\s+(\w+)$/);
      named.add(asMatch ? asMatch[2] : cleaned);
    }
  }
  return named;
}

/** `import React from` / `import * as React from` gives access to React.useX. */
function hasReactNamespace(source: string): boolean {
  return /import\s+(?:\*\s+as\s+)?React(?:\s*,|\s+from)/.test(source);
}

/** Locally defined `const useId =` / `function useId(` shadows the helper. */
function extractLocalDefs(source: string): Set<string> {
  const defs = new Set<string>();
  const defRe = /(?:const|let|var|function)\s+(\w+)\s*[=(]/g;
  let m: RegExpExecArray | null;
  while ((m = defRe.exec(source)) !== null) defs.add(m[1]);
  return defs;
}

function stripCommentsAndStrings(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "")
    .replace(/'(?:\\.|[^'\\])*'/g, "''")
    .replace(/"(?:\\.|[^"\\])*"/g, '""')
    .replace(/`(?:\\.|[^`\\])*`/g, "``");
}

function findUnimportedHelpers(source: string): string[] {
  const cleaned = stripCommentsAndStrings(source);
  const covered = new Set([
    ...extractNamedImports(source),
    ...extractLocalDefs(source),
  ]);
  const reactNs = hasReactNamespace(source);
  const missing: string[] = [];
  for (const helper of RUNTIME_HELPERS) {
    if (reactNs || covered.has(helper)) continue;
    // `helper(` after a non-identifier char. Excludes `.helper(` member
    // access (React.useState) and substrings of longer identifiers.
    const re = new RegExp(`(^|[^\\w.$])${helper}\\s*\\(`);
    if (re.test(cleaned)) missing.push(helper);
  }
  return missing;
}

/** True when `idx` sits inside a template literal, quoted string, or comment. */
function insideStringOrComment(source: string, idx: number): boolean {
  const before = source.slice(0, idx);
  // Block comment: last `/*` after last `*/`.
  if (before.lastIndexOf("/*") > before.lastIndexOf("*/")) return true;
  // Line comment on the same line.
  const lineStart = before.lastIndexOf("\n") + 1;
  const lineBefore = before.slice(lineStart);
  if (lineBefore.includes("//")) return true;
  // Quote parity on the same physical line (single/double quotes can't span
  // raw newlines, so per-line parity is sufficient).
  const count = (s: string, ch: string) =>
    s.split("").filter((c, i) => c === ch && s[i - 1] !== "\\").length;
  if (count(lineBefore, '"') % 2 === 1 || count(lineBefore, "'") % 2 === 1)
    return true;
  // Template literal: odd unescaped backticks before the position.
  const backticks = before
    .split("")
    .filter((c, i) => c === "`" && before[i - 1] !== "\\").length;
  return backticks % 2 === 1;
}

function findVueLeaks(source: string): string[] {
  const leaks: string[] = [];
  // Real import statements only: `import ... from 'spec'`, dynamic
  // `import('spec')`, `require('spec')`.
  const re =
    /\bimport\s+[^'";]*?\bfrom\s*['"]([^'"]+)['"]|\bimport\s*\(\s*['"]([^'"]+)['"]|\brequire\(\s*['"]([^'"]+)['"]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(source)) !== null) {
    const spec = m[1] ?? m[2] ?? m[3];
    if (!spec) continue;
    if (insideStringOrComment(source, m.index)) continue;
    if (spec.endsWith(".vue")) leaks.push(`'${spec}' (.vue file)`);
    else if (VUE_LEAKS.some((v) => spec === v || spec.startsWith(v)))
      leaks.push(`'${spec}'`);
  }
  return leaks;
}

async function main() {
  const files = await fg(
    ["components/**/*.{ts,tsx}", "blocks/**/*.{ts,tsx}", "bootstrap/**/*.ts"],
    {
      cwd: ROOT,
      absolute: true,
      ignore: ["**/__tests__/**", "**/*.registry.ts"],
    },
  );
  const missingFailures: { file: string; missing: string[] }[] = [];
  const leakFailures: { file: string; leaks: string[] }[] = [];

  for (const file of files) {
    const source = await readFile(file, "utf8");
    const missing = findUnimportedHelpers(source);
    if (missing.length) missingFailures.push({ file, missing });
    const leaks = findVueLeaks(source);
    if (leaks.length) leakFailures.push({ file, leaks });
  }

  let failed = false;
  if (missingFailures.length) {
    failed = true;
    console.error(
      `\n[check-imports] ${missingFailures.length} file(s) use React helpers without importing them:\n`,
    );
    for (const { file, missing } of missingFailures) {
      console.error(`  ${relative(ROOT, file)}`);
      console.error(`    missing: ${missing.join(", ")}`);
    }
    console.error(
      `\n  Fix: add the helper to the file's \`import { ... } from 'react'\` line.`,
    );
  }
  if (leakFailures.length) {
    failed = true;
    console.error(
      `\n[check-imports] ${leakFailures.length} file(s) import Vue-ecosystem modules:\n`,
    );
    for (const { file, leaks } of leakFailures) {
      console.error(`  ${relative(ROOT, file)}`);
      console.error(`    leaks: ${leaks.join(", ")}`);
    }
    console.error(
      `\n  Fix: swap in the React equivalent (@radix-ui, lucide-react, sonner, ...).`,
    );
  }
  if (failed) {
    console.error();
    process.exit(1);
  }

  console.log(
    `[check-imports] ${files.length} source file(s) checked -- imports are React-clean.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
