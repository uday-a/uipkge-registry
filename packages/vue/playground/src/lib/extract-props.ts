/**
 * Best-effort extraction of `defineProps<>` fields from a Vue SFC's <script setup>.
 *
 * Handles:
 *   1. `defineProps<{ inline... }>()`
 *   2. `interface Props { ... }` + `defineProps<Props>()`
 *   3. `type Props = { ... }` + `defineProps<Props>()`
 *   4. `defineProps<ExternalType & { inline... }>()` — extracts inline portion,
 *      reports ExternalType as a forward.
 *   5. `defineProps<ExternalType>()` — reports ExternalType as a forward
 *      when no local declaration exists.
 *
 * Also detects `withDefaults(defineProps<...>(), { ... })` to populate `default`,
 * and parses string-literal unions (`'sm' | 'md'`) into `values[]`.
 *
 * Forwarded types are matched against the file's `import` statements so the
 * UI can link them ("Forwards `LabelProps` from `reka-ui`").
 */
export interface PropMeta {
  name: string;
  type: string;
  required: boolean;
  doc?: string;
  default?: string;
  values?: string[];
}

export interface PropForward {
  name: string;
  source: string | null;
}

export interface PropsExtractResult {
  props: PropMeta[];
  forwards: PropForward[];
}

export function extractProps(source: string): PropsExtractResult {
  const setup = source.match(/<script[^>]*setup[^>]*>([\s\S]*?)<\/script>/);
  if (!setup) return { props: [], forwards: [] };
  const block = setup[1];

  const typeExpr = findDefinePropsTypeExpr(block);
  if (!typeExpr) return { props: [], forwards: [] };

  const segments = splitIntersection(typeExpr);
  let body = "";
  const identifierTokens: string[] = [];

  for (const seg of segments) {
    const trimmed = seg.trim();
    if (trimmed.startsWith("{")) {
      body += trimmed.slice(1, trimmed.lastIndexOf("}")) + "\n";
    } else {
      identifierTokens.push(trimmed);
    }
  }

  // If no inline body but a single identifier, try to resolve it locally.
  const forwards: PropForward[] = [];
  for (const id of identifierTokens) {
    const bareName = id.replace(/<[\s\S]*$/, "").trim(); // strip generic args
    if (!bareName) continue;
    const localBody = findLocalTypeBody(block, bareName);
    if (localBody) {
      body += localBody + "\n";
    } else {
      forwards.push({
        name: bareName,
        source: findImportSource(block, bareName),
      });
    }
  }

  const fields = body ? parseFields(body) : [];
  const defaults = parseWithDefaults(block);
  if (Object.keys(defaults).length) {
    for (const f of fields) {
      if (defaults[f.name] !== undefined) f.default = defaults[f.name];
    }
  }

  // Resolve local type aliases like `type Variant = 'default' | 'destructive' | ...`
  for (const f of fields) {
    if (!f.values || f.values.length === 0) {
      const aliasMatch = block.match(
        new RegExp(`(?:type|interface)\\s+${f.type}\\s*=\\s*([^;\\n]+)`),
      );
      if (aliasMatch) {
        f.type = aliasMatch[1].trim();
        const vals = parseUnionLiterals(f.type);
        if (vals.length) f.values = vals;
      }
    }
  }

  // Dedup forwards by name.
  const seen = new Set<string>();
  const dedupedForwards = forwards.filter((f) => {
    if (seen.has(f.name)) return false;
    seen.add(f.name);
    return true;
  });

  return { props: fields, forwards: dedupedForwards };
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => " ".repeat(m.length))
    .replace(/\/\/.*$/gm, (m) => " ".repeat(m.length));
}

/**
 * Find `defineProps<TYPE>` and return TYPE as a string. Handles nested
 * generics (`<>`) and inline object types (`{}`). Angle brackets inside doc
 * comments and string literals are skipped -- a prop documented as
 * `pitch > 0` used to close the generic early and drop every later field.
 * Returns null if not found.
 */
function findDefinePropsTypeExpr(block: string): string | null {
  const clean = stripComments(block);
  const idx = clean.indexOf("defineProps<");
  if (idx < 0) return null;
  const start = idx + "defineProps<".length;
  let depth = 1;
  let quote = "";
  let comment: "" | "line" | "block" = "";
  for (let i = start; i < block.length; i++) {
    const ch = block[i];
    const next = block[i + 1];
    if (comment === "line") {
      if (ch === "\n") comment = "";
      continue;
    }
    if (comment === "block") {
      if (ch === "*" && next === "/") {
        comment = "";
        i++;
      }
      continue;
    }
    if (quote) {
      if (ch === "\\") i++;
      else if (ch === quote) quote = "";
      continue;
    }
    if (ch === "/" && next === "/") {
      comment = "line";
      i++;
    } else if (ch === "/" && next === "*") {
      comment = "block";
      i++;
    } else if (ch === "'" || ch === '"' || ch === "`") {
      quote = ch;
    } else if (ch === "<") depth++;
    else if (ch === ">") {
      depth--;
      if (depth === 0) return block.slice(start, i);
    }
  }
  return null;
}

/**
 * Split a type expression at top-level `&` operators. Handles `{...}`, `(...)`,
 * `<...>`, `[...]` balancing.
 */
function splitIntersection(expr: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (ch === "(" || ch === "{" || ch === "[" || ch === "<") depth++;
    else if (ch === ")" || ch === "}" || ch === "]" || ch === ">") depth--;
    else if (ch === "&" && depth === 0) {
      out.push(expr.slice(start, i));
      start = i + 1;
    }
  }
  out.push(expr.slice(start));
  return out.map((s) => s.trim()).filter(Boolean);
}

/**
 * Find an `interface Name { ... }` or `type Name = { ... }` declaration body.
 * Returns the body content (between the braces) or null.
 */
function findLocalTypeBody(block: string, name: string): string | null {
  const re = new RegExp(
    `(?:interface|type)\\s+${name}(?:\\s+extends\\s+[^{]+)?\\s*=?\\s*\\{`,
    "m",
  );
  const m = block.match(re);
  if (!m || m.index === undefined) return null;
  const openIdx = block.indexOf("{", m.index);
  if (openIdx < 0) return null;
  let depth = 1;
  for (let i = openIdx + 1; i < block.length; i++) {
    const ch = block[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return block.slice(openIdx + 1, i);
    }
  }
  return null;
}

/**
 * Find which package a type identifier was imported from, if any.
 * Returns null if not found in an import statement.
 */
function findImportSource(block: string, name: string): string | null {
  const re = /import\s+(?:type\s+)?\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(block)) !== null) {
    const namedImports = m[1]
      .split(",")
      .map((s) => s.trim().replace(/\s+as\s+\w+$/, ""));
    if (namedImports.includes(name)) return m[2];
  }
  return null;
}

function parseFields(body: string): PropMeta[] {
  const lines = body.split("\n");
  const out: PropMeta[] = [];
  let pendingDoc = "";

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      pendingDoc = "";
      continue;
    }
    if (line.startsWith("//") || line.startsWith("*")) {
      pendingDoc = line
        .replace(/^[\/\*\s]+/, "")
        .replace(/\*\/$/, "")
        .trim();
      continue;
    }
    if (line.startsWith("/*")) {
      pendingDoc = line
        .replace(/^\/\*+\s*/, "")
        .replace(/\*\/$/, "")
        .trim();
      continue;
    }
    const field = line.match(
      /^(\w+)(\?)?:\s*(.+?)\s*[,;]?\s*(?:\/\/\s*(.*))?$/,
    );
    if (field) {
      const [, name, optional, type, trailing] = field;
      const cleanType = type.trim();
      const meta: PropMeta = {
        name,
        type: cleanType,
        required: !optional,
        doc: trailing?.trim() || pendingDoc || undefined,
      };
      const values = parseUnionLiterals(cleanType);
      if (values.length) meta.values = values;
      out.push(meta);
      pendingDoc = "";
    }
  }
  return out;
}

function parseUnionLiterals(type: string): string[] {
  if (!/['"]/.test(type) || !/\|/.test(type)) return [];
  const tokens = type.split("|").map((t) => t.trim());
  const out: string[] = [];
  for (const t of tokens) {
    const m = t.match(/^['"]([^'"]*)['"]$/);
    if (!m) return [];
    out.push(m[1]);
  }
  return out;
}

function parseWithDefaults(block: string): Record<string, string> {
  const out: Record<string, string> = {};
  const idx = block.indexOf("withDefaults(");
  if (idx < 0) return out;
  let depth = 0;
  let i = idx + "withDefaults(".length;
  let argStart = i;
  for (; i < block.length; i++) {
    const ch = block[i];
    if (ch === "(" || ch === "<" || ch === "{" || ch === "[") depth++;
    else if (ch === ")" || ch === ">" || ch === "}" || ch === "]") depth--;
    if (depth === 0 && ch === ",") {
      argStart = i + 1;
      break;
    }
  }
  if (i >= block.length) return out;
  while (argStart < block.length && /\s/.test(block[argStart])) argStart++;
  if (block[argStart] !== "{") return out;
  let braceDepth = 0;
  let bodyStart = argStart;
  let bodyEnd = -1;
  for (let j = argStart; j < block.length; j++) {
    const ch = block[j];
    if (ch === "{") braceDepth++;
    else if (ch === "}") {
      braceDepth--;
      if (braceDepth === 0) {
        bodyEnd = j;
        break;
      }
    }
  }
  if (bodyEnd < 0) return out;
  const body = block.slice(bodyStart + 1, bodyEnd);
  splitTopLevelCommas(body).forEach((entry) => {
    const colon = findTopLevelColon(entry);
    if (colon < 0) return;
    const key = entry
      .slice(0, colon)
      .trim()
      .replace(/^['"`]|['"`]$/g, "");
    const value = entry.slice(colon + 1).trim();
    if (key && value) out[key] = compactDefault(value);
  });
  return out;
}

function splitTopLevelCommas(s: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === "(" || ch === "{" || ch === "[" || ch === "<") depth++;
    else if (ch === ")" || ch === "}" || ch === "]" || ch === ">") depth--;
    else if (ch === "," && depth === 0) {
      out.push(s.slice(start, i));
      start = i + 1;
    }
  }
  out.push(s.slice(start));
  return out.map((x) => x.trim()).filter(Boolean);
}

function findTopLevelColon(s: string): number {
  let depth = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === "(" || ch === "{" || ch === "[" || ch === "<") depth++;
    else if (ch === ")" || ch === "}" || ch === "]" || ch === ">") depth--;
    else if (ch === ":" && depth === 0) return i;
  }
  return -1;
}

function compactDefault(v: string): string {
  const flat = v.replace(/\s+/g, " ").trim();
  return flat.length > 60 ? flat.slice(0, 57) + "…" : flat;
}
