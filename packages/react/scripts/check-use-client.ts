/**
 * CI gate for the React mirror: every shipped source file that can only run in
 * the browser must declare `'use client'` as its first statement.
 *
 * Consumers copy this source into Next.js App Router projects, where modules
 * are Server Components by default. A file that calls a hook or creates a
 * context without the directive fails their build
 * ("You're importing a component that needs useState ..."). The directive is
 * part of the shipped contract, not a local concern -- and it must live on the
 * file itself: a consumer may import `./JsonTreeNode` directly rather than
 * through the component's `index.ts`.
 *
 * Detected client-only markers -- the constructs React actually rejects in a
 * Server Component:
 *   - React hooks (Server Components may only use `use`)
 *   - `createContext`
 *
 * Browser globals are deliberately NOT flagged: a server module may import a
 * helper that touches `document` inside a function body without erroring, so
 * requiring the directive there would be noise.
 *
 * Matches inside comments and strings are ignored (blocks embed demo snippets).
 *
 * Run by `bun run build`, `bun run verify` and `bun run check:use-client`.
 */
import { readFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import fg from "fast-glob";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_ROOT = resolve(__dirname, "..");

/** Server Components may call `use` and nothing else. */
const CLIENT_HOOKS = [
  "useState",
  "useEffect",
  "useLayoutEffect",
  "useInsertionEffect",
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
  "useOptimistic",
  "useActionState",
  "useFormStatus",
] as const;

function stripCommentsAndStrings(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "")
    .replace(/'(?:\\.|[^'\\])*'/g, "''")
    .replace(/"(?:\\.|[^"\\])*"/g, '""')
    .replace(/`(?:\\.|[^`\\])*`/g, "``");
}

/**
 * True when the directive is the first statement. Leading comments and blank
 * lines are allowed before it; anything else (an import, a type) is too late --
 * bundlers ignore a directive that is not at the top of the module.
 */
function hasUseClientDirective(source: string): boolean {
  const withoutComments = source
    .replace(/^\uFEFF/, "")
    .replace(/^(?:\s*(?:\/\/[^\n]*|\/\*[\s\S]*?\*\/)\s*)*/, "");
  return /^(['"])use client\1\s*;?/.test(withoutComments.trimStart());
}

/** Client-only constructs used by this file, as human-readable reasons. */
export function findClientOnlyMarkers(source: string): string[] {
  const cleaned = stripCommentsAndStrings(source);
  const reasons: string[] = [];

  for (const hook of CLIENT_HOOKS) {
    // `useState(` or `React.useState(`, but not `myUseState(`.
    if (new RegExp(`(^|[^\\w$])(React\\.)?${hook}\\s*[(<]`).test(cleaned))
      reasons.push(`${hook}()`);
  }
  if (/(^|[^\w$])(React\.)?createContext\s*[(<]/.test(cleaned))
    reasons.push("createContext()");
  return reasons;
}

export interface UseClientViolation {
  file: string;
  reasons: string[];
}

/** Files scanned by the last checkUseClient() call, for the PASS message. */
let lastScanned = 0;

export async function checkUseClient(
  root: string = DEFAULT_ROOT,
): Promise<UseClientViolation[]> {
  const files = await fg(
    [
      "components/**/*.{ts,tsx}",
      "blocks/**/*.{ts,tsx}",
      "bootstrap/**/*.{ts,tsx}",
    ],
    {
      cwd: root,
      absolute: true,
      ignore: ["**/__tests__/**", "**/*.registry.ts"],
    },
  );

  lastScanned = files.length;
  const violations: UseClientViolation[] = [];
  for (const file of files) {
    const source = await readFile(file, "utf8");
    if (hasUseClientDirective(source)) continue;
    const reasons = findClientOnlyMarkers(source);
    if (reasons.length)
      violations.push({ file: relative(root, file), reasons });
  }
  return violations;
}

export function reportUseClient(
  violations: UseClientViolation[],
  checked: number = lastScanned,
) {
  if (!violations.length) {
    console.log(
      `[check-use-client] ${checked} source file(s) checked -- every client-only file declares 'use client'.`,
    );
    return;
  }
  console.error(
    `\n[check-use-client] ${violations.length} file(s) are client-only but do not declare 'use client':\n`,
  );
  for (const { file, reasons } of violations) {
    console.error(`  ${file}`);
    console.error(`    uses: ${[...new Set(reasons)].slice(0, 6).join(", ")}`);
  }
  console.error(
    `\n  Fix: add \`'use client'\` as the first line of the file. Next.js App Router consumers`,
  );
  console.error(
    `  import these modules from Server Components and their build fails without it.\n`,
  );
}

async function main() {
  const violations = await checkUseClient();
  reportUseClient(violations);
  if (violations.length) process.exit(1);
}

// Only run the CLI when invoked directly, not when imported by verify.ts.
if (import.meta.main) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
