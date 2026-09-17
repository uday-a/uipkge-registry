/**
 * Extracts a self-contained code snippet for each `<Story title="…" description="…">…</Story>`
 * block in a demo file. Ported from the registry-site so the Astro Story cards'
 * Code tab shows the same installable source as uipkge.dev.
 *
 * `extractStories`     — Vue SFC demos (assembles <script setup> + <template>).
 * `extractStoriesJsx`  — React TSX demos (grabs the JSX slot per story).
 */
const MAX_RESOLVE_DEPTH = 3;

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export function extractStories(rawSource: string): Record<string, string> {
  const re = /<Story\s+([^>]*?)>([\s\S]*?)<\/Story>/g;
  const out: Record<string, string> = {};
  const setupBlock =
    rawSource.match(/<script[^>]*setup[^>]*>([\s\S]*?)<\/script>/)?.[1] ?? "";

  let m: RegExpExecArray | null;
  while ((m = re.exec(rawSource)) !== null) {
    const titleMatch = m[1].match(/title=["']([^"']+)["']/);
    if (!titleMatch) continue;
    const slot = dedent(m[2]).trim();
    out[decodeHtmlEntities(titleMatch[1])] = assembleSnippet(slot, setupBlock);
  }
  return out;
}

/**
 * React demos: pull the JSX between each `<Story title=… description=…>…</Story>`
 * tag. Returns the dedented inner JSX as the Code-tab source. The demos are
 * authored so this slot is a ready-to-use fragment (className, lucide-react).
 */
export function extractStoriesJsx(rawSource: string): Record<string, string> {
  const re = /<Story\s+([^>]*?)>([\s\S]*?)<\/Story>/g;
  const out: Record<string, string> = {};
  let m: RegExpExecArray | null;
  while ((m = re.exec(rawSource)) !== null) {
    const titleMatch = m[1].match(/title=["']([^"']+)["']/);
    if (!titleMatch) continue;
    out[decodeHtmlEntities(titleMatch[1])] = dedent(m[2]).replace(
      /^\n+|\s+$/g,
      "",
    );
  }
  return out;
}

function assembleSnippet(template: string, setup: string): string {
  if (!setup) return template;

  const wanted = new Set<string>();
  collectTemplateBindings(template, wanted);

  const declarations: { name: string; source: string }[] = [];
  const seen = new Set<string>();
  const queue = [...wanted];
  let depth = 0;
  while (queue.length && depth < MAX_RESOLVE_DEPTH) {
    const layer = queue.splice(0, queue.length);
    depth++;
    for (const ident of layer) {
      if (seen.has(ident)) continue;
      seen.add(ident);
      const decl = findDeclaration(setup, ident);
      if (!decl) continue;
      declarations.push({ name: ident, source: decl });
      const inner = new Set<string>();
      collectFreeIdents(decl, inner);
      for (const n of inner) {
        if (!seen.has(n)) queue.push(n);
      }
    }
  }

  if (!declarations.length) return template;

  // Preserve the demo author's order so dependencies appear before dependents.
  const order = new Map<string, number>();
  declarations.forEach((d) => {
    const idx = setup.indexOf(d.source);
    order.set(d.name, idx >= 0 ? idx : Number.MAX_SAFE_INTEGER);
  });
  declarations.sort((a, b) => order.get(a.name)! - order.get(b.name)!);

  const referencedIdents = new Set<string>();
  collectTemplateBindings(template, referencedIdents);
  for (const d of declarations) collectFreeIdents(d.source, referencedIdents);
  const imports = findRelevantImports(setup, referencedIdents);

  const scriptParts: string[] = [];
  if (imports.length) scriptParts.push(imports.join("\n"));
  if (declarations.length)
    scriptParts.push(declarations.map((d) => d.source).join("\n\n"));

  return [
    '<script setup lang="ts">',
    scriptParts.join("\n\n"),
    "</script>",
    "",
    "<template>",
    indent(template, "  "),
    "</template>",
  ].join("\n");
}

const KEYWORDS = new Set([
  "true",
  "false",
  "null",
  "undefined",
  "in",
  "of",
  "as",
  "is",
  "new",
  "this",
  "await",
  "async",
  "function",
  "return",
  "if",
  "else",
  "switch",
  "case",
  "default",
  "for",
  "while",
  "do",
  "break",
  "continue",
  "typeof",
  "instanceof",
  "void",
  "delete",
  "class",
  "extends",
  "super",
  "try",
  "catch",
  "finally",
  "throw",
  "import",
  "export",
  "from",
  "const",
  "let",
  "var",
]);

function collectTemplateBindings(template: string, out: Set<string>) {
  const patterns = [
    /:[\w-]+="([^"]+)"/g, // :prop="expr"
    /v-bind="([^"]+)"/g, // v-bind="obj"
    /v-bind:[\w-]+="([^"]+)"/g,
    /v-model(?::[\w-]+)?="([^"]+)"/g,
    /v-for="[^"]*?\bin\s+([^"\s]+)"/g,
    /v-for="[^"]*?\bof\s+([^"\s]+)"/g,
    /v-if="([^"]+)"/g,
    /v-else-if="([^"]+)"/g,
    /v-show="([^"]+)"/g,
    /\{\{\s*([\s\S]+?)\s*\}\}/g,
    /@[\w-]+(?::[\w-]+)?(?:\.[\w-]+)*="([^"]+)"/g, // @click="handler"
  ];
  for (const re of patterns) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(template)) !== null) extractIdents(m[1], out);
  }
}

function collectFreeIdents(source: string, out: Set<string>) {
  const cleaned = source
    .replace(/\/\/[^\n]*/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(['"`])(?:\\.|(?!\1).)*\1/g, "");
  extractIdents(cleaned, out);
}

function extractIdents(expr: string, out: Set<string>) {
  const cleaned = expr.replace(/(['"`])(?:\\.|(?!\1).)*\1/g, "");
  const idRe = /(?<![\w$.])[A-Za-z_$][\w$]*/g;
  let m: RegExpExecArray | null;
  while ((m = idRe.exec(cleaned)) !== null) {
    const id = m[0];
    if (KEYWORDS.has(id)) continue;
    out.add(id);
  }
}

function findDeclaration(setup: string, name: string): string | null {
  const re = new RegExp(`(?:^|\\n)([ \\t]*)(const|let|var)\\s+${name}\\b`, "m");
  const match = setup.match(re);
  if (!match || match.index === undefined) return null;
  const declStart =
    match.index + (match[0].startsWith("\n") ? 1 : 0) + match[1].length;
  let depth = 0;
  let inString: string | null = null;
  let escape = false;
  for (let i = declStart; i < setup.length; i++) {
    const ch = setup[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (inString) {
      if (ch === "\\") {
        escape = true;
        continue;
      }
      if (ch === inString) inString = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      inString = ch;
      continue;
    }
    if (ch === "{" || ch === "(" || ch === "[") depth++;
    else if (ch === "}" || ch === ")" || ch === "]") depth--;
    if (depth === 0 && ch === "\n") {
      const rest = setup.slice(i + 1);
      const nextLine = rest.match(/^([ \t]*)(\S)/);
      if (!nextLine) return setup.slice(declStart, i).trim();
      const nextCh = nextLine[2];
      if (!/[.,?:+\-*/`)\]}]/.test(nextCh))
        return setup.slice(declStart, i).trim();
    }
  }
  return setup.slice(declStart).trim();
}

function findRelevantImports(setup: string, referenced: Set<string>): string[] {
  const out: string[] = [];
  const lineRe = /^[ \t]*import\s+([\s\S]*?)\s+from\s+(['"][^'"]+['"]).*$/gm;
  let m: RegExpExecArray | null;
  while ((m = lineRe.exec(setup)) !== null) {
    const clause = m[1];
    const locals = parseImportLocals(clause);
    if (locals.some((n) => referenced.has(n))) out.push(m[0].trim());
  }
  return out;
}

function parseImportLocals(clause: string): string[] {
  const out: string[] = [];
  const trimmed = clause.trim().replace(/^type\s+/, "");
  const defaultMatch = trimmed.match(/^([A-Za-z_$][\w$]*)\s*(?:,|$)/);
  if (defaultMatch) out.push(defaultMatch[1]);
  const namedBlock = trimmed.match(/\{([^}]*)\}/);
  if (namedBlock) {
    for (const piece of namedBlock[1].split(",")) {
      const seg = piece.trim().replace(/^type\s+/, "");
      if (!seg) continue;
      const asIdx = seg.search(/\s+as\s+/);
      const local =
        asIdx >= 0
          ? seg
              .slice(asIdx)
              .replace(/^\s+as\s+/, "")
              .trim()
          : seg;
      if (local) out.push(local);
    }
  }
  const ns = trimmed.match(/\*\s+as\s+([A-Za-z_$][\w$]*)/);
  if (ns) out.push(ns[1]);
  return out;
}

function dedent(s: string): string {
  const lines = s.split("\n");
  const indents = lines
    .filter((l) => l.trim().length > 0)
    .map((l) => l.match(/^[ \t]*/)?.[0].length ?? 0);
  if (!indents.length) return s;
  const min = Math.min(...indents);
  return lines.map((l) => l.slice(min)).join("\n");
}

function indent(s: string, prefix: string): string {
  return s
    .split("\n")
    .map((l) => (l.length ? prefix + l : l))
    .join("\n");
}
