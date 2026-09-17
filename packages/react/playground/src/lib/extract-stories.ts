/**
 * Extracts self-contained, copy-paste-ready code snippets for each
 * `<Story title="…" description="…">…</Story>` block in a demo file.
 *
 * `extractStories`     — Vue SFC demos (assembles <script setup lang="ts"> + <template>).
 * `extractStoriesJsx`  — React TSX demos (assembles complete `export default function ...` with imports and state).
 */

const MAX_RESOLVE_DEPTH = 5;

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

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
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

interface DeclarationChunk {
  names: string[];
  source: string;
  order: number;
  isTopLevel: boolean;
}

interface ImportStatement {
  clause: string;
  specifiers: { imported: string; local: string }[];
  isDefault: boolean;
  defaultName?: string;
  isNamespace: boolean;
  namespaceName?: string;
  sourcePath: string;
  order: number;
}

function parseImports(code: string): ImportStatement[] {
  const imports: ImportStatement[] = [];
  const importRe =
    /^[ \t]*import\s+([\s\S]*?)\s+from\s+(['"][^'"]+['"])[ \t]*;?/gm;
  let m: RegExpExecArray | null;
  while ((m = importRe.exec(code)) !== null) {
    const clause = m[1].trim();
    const sourcePath = m[2].slice(1, -1);

    let isNamespace = false;
    let namespaceName: string | undefined;
    let isDefault = false;
    let defaultName: string | undefined;
    const specifiers: { imported: string; local: string }[] = [];

    const nsMatch = clause.match(/\*\s+as\s+([A-Za-z_$][\w$]*)/);
    if (nsMatch) {
      isNamespace = true;
      namespaceName = nsMatch[1];
    }

    const defaultMatch = clause.match(/^([A-Za-z_$][\w$]*)\s*(?:,|$)/);
    if (defaultMatch && defaultMatch[1] !== "type") {
      isDefault = true;
      defaultName = defaultMatch[1];
    }

    const namedMatch = clause.match(/\{([^}]*)\}/);
    if (namedMatch) {
      for (const seg of namedMatch[1].split(",")) {
        const piece = seg.trim().replace(/^type\s+/, "");
        if (!piece) continue;
        const asMatch = piece.match(
          /^([A-Za-z_$][\w$]*)\s+as\s+([A-Za-z_$][\w$]*)$/,
        );
        if (asMatch) {
          specifiers.push({ imported: asMatch[1], local: asMatch[2] });
        } else {
          const directMatch = piece.match(/^([A-Za-z_$][\w$]*)$/);
          if (directMatch) {
            specifiers.push({
              imported: directMatch[1],
              local: directMatch[1],
            });
          }
        }
      }
    }

    imports.push({
      clause,
      specifiers,
      isDefault,
      defaultName,
      isNamespace,
      namespaceName,
      sourcePath,
      order: m.index,
    });
  }
  return imports;
}

function parseDeclarations(
  code: string,
  isTopLevel = false,
  baseOffset = 0,
): DeclarationChunk[] {
  const chunks: DeclarationChunk[] = [];
  const declPattern =
    /(?:^|\n)([ \t]*)((?:export\s+)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)|(?:const|let|var)\s+([\s\S]*?)=|(?:type|interface)\s+([A-Za-z_$][\w$]*))/g;

  let match: RegExpExecArray | null;
  while ((match = declPattern.exec(code)) !== null) {
    const startIndex =
      match.index + (match[0].startsWith("\n") ? 1 : 0) + match[1].length;
    const fnName = match[3];
    const varPattern = match[4];
    const typeName = match[5];

    const names: string[] = [];
    if (fnName) {
      names.push(fnName);
    } else if (typeName) {
      names.push(typeName);
    } else if (varPattern) {
      const trimmed = varPattern.trim();
      if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        const inner = trimmed.slice(1, -1);
        for (const part of inner.split(",")) {
          const id = part.trim();
          if (/^[A-Za-z_$][\w$]*$/.test(id)) names.push(id);
        }
      } else if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
        const inner = trimmed.slice(1, -1);
        for (const part of inner.split(",")) {
          const p = part.trim();
          const colon = p.indexOf(":");
          const id = (colon >= 0 ? p.slice(colon + 1) : p).trim();
          if (/^[A-Za-z_$][\w$]*$/.test(id)) names.push(id);
        }
      } else {
        const id = trimmed.split(/\s|:/)[0];
        if (/^[A-Za-z_$][\w$]*$/.test(id)) names.push(id);
      }
    }

    if (!names.length) continue;

    let parenDepth = 0;
    let braceDepth = 0;
    let bracketDepth = 0;
    let hasOpenedBody = false;
    let inString: string | null = null;
    let escape = false;
    let endIndex = code.length;

    for (let i = startIndex; i < code.length; i++) {
      const ch = code[i];
      if (escape) {
        escape = false;
        continue;
      }
      if (inString) {
        if (ch === "\\") escape = true;
        else if (ch === inString) inString = null;
        continue;
      }
      if (ch === '"' || ch === "'" || ch === "`") {
        inString = ch;
        continue;
      }

      if (ch === "(") parenDepth++;
      else if (ch === ")") parenDepth--;
      else if (ch === "[") bracketDepth++;
      else if (ch === "]") bracketDepth--;
      else if (ch === "{") {
        braceDepth++;
        hasOpenedBody = true;
      } else if (ch === "}") {
        braceDepth--;
        if (hasOpenedBody && braceDepth === 0 && (fnName || typeName)) {
          endIndex = i + 1;
          break;
        }
      }

      if (
        !fnName &&
        parenDepth === 0 &&
        bracketDepth === 0 &&
        braceDepth === 0 &&
        ch === "\n"
      ) {
        const rest = code.slice(i + 1);
        const nextLine = rest.match(/^([ \t]*)(\S)/);
        if (!nextLine || !/[.,?:+\-*/`)\]}]/.test(nextLine[2])) {
          endIndex = i;
          break;
        }
      }
    }

    const declSource = code
      .slice(startIndex, endIndex)
      .trim()
      .replace(/;$/, "");
    chunks.push({
      names,
      source: declSource,
      order: baseOffset + startIndex,
      isTopLevel,
    });
  }

  return chunks;
}

function extractIdents(expr: string, out: Set<string>) {
  const cleaned = expr.replace(/(['"`])(?:\\.|(?!\1).)*\1/g, "");
  const idRe = /(?<![\w$.])[A-Za-z_$][\w$]*/g;
  let m: RegExpExecArray | null;
  while ((m = idRe.exec(cleaned)) !== null) {
    const id = m[0];
    if (!KEYWORDS.has(id)) out.add(id);
  }
}

function collectTemplateBindings(template: string, out: Set<string>) {
  // Tags: <Button, </Button, <DialogContent, etc.
  const tagRe = /<\/?([A-Z][A-Za-z0-9_$]*)/g;
  let m: RegExpExecArray | null;
  while ((m = tagRe.exec(template)) !== null) {
    out.add(m[1]);
  }

  // Vue bindings
  const vuePatterns = [
    /:[\w-]+="([^"]+)"/g,
    /v-bind="([^"]+)"/g,
    /v-bind:[\w-]+="([^"]+)"/g,
    /v-model(?::[\w-]+)?="([^"]+)"/g,
    /v-for="[^"]*?\bin\s+([^"\s]+)"/g,
    /v-for="[^"]*?\bof\s+([^"\s]+)"/g,
    /v-if="([^"]+)"/g,
    /v-else-if="([^"]+)"/g,
    /v-show="([^"]+)"/g,
    /\{\{\s*([\s\S]+?)\s*\}\}/g,
    /@[\w-]+(?::[\w-]+)?(?:\.[\w-]+)*="([^"]+)"/g,
  ];
  for (const re of vuePatterns) {
    re.lastIndex = 0;
    while ((m = re.exec(template)) !== null) extractIdents(m[1], out);
  }

  // React JSX curly expressions: { ... }
  let depth = 0;
  let start = -1;
  let inString: string | null = null;
  let escape = false;
  for (let i = 0; i < template.length; i++) {
    const ch = template[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (inString) {
      if (ch === "\\") escape = true;
      else if (ch === inString) inString = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      inString = ch;
      continue;
    }
    if (ch === "{") {
      if (depth === 0) start = i + 1;
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0 && start >= 0) {
        extractIdents(template.slice(start, i), out);
        start = -1;
      }
    }
  }
}

function collectFreeIdents(source: string, out: Set<string>) {
  const cleaned = source
    .replace(/\/\/[^\n]*/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(['"`])(?:\\.|(?!\1).)*\1/g, "");
  extractIdents(cleaned, out);
}

function toPascalCase(str: string): string {
  const clean = str.replace(/[^a-zA-Z0-9]+/g, " ").trim();
  if (!clean) return "Demo";
  return clean
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

function deriveComponentName(
  componentName: string | undefined,
  storyTitle: string,
): string {
  const compPrefix = componentName ? toPascalCase(componentName) : "";
  const storyPascal = toPascalCase(storyTitle);
  if (!compPrefix) return `${storyPascal}Demo`;
  if (storyPascal.toLowerCase().startsWith(compPrefix.toLowerCase())) {
    return storyPascal;
  }
  return `${compPrefix}${storyPascal}`;
}

function rewriteImportPath(sourcePath: string): string {
  return sourcePath
    .replace(/^@react-registry-blocks\//, "@/components/blocks/")
    .replace(/^@react-registry\//, "@/components/ui/");
}

function formatNamedImport(specifiers: string[], sourcePath: string): string {
  const singleLine = `import { ${specifiers.join(", ")} } from '${sourcePath}'`;
  if (singleLine.length <= 100) return singleLine;
  return `import {\n${specifiers.map((s) => `  ${s},`).join("\n")}\n} from '${sourcePath}'`;
}

function renderImports(
  imports: ImportStatement[],
  referencedIdents: Set<string>,
  isReact = false,
): string[] {
  const lines: string[] = [];
  for (const imp of imports) {
    if (imp.sourcePath.includes("components/story/Story")) continue;
    const rewrittenPath = isReact
      ? rewriteImportPath(imp.sourcePath)
      : imp.sourcePath;

    const usedSpecifiers: string[] = [];
    for (const spec of imp.specifiers) {
      if (referencedIdents.has(spec.local)) {
        usedSpecifiers.push(
          spec.imported === spec.local
            ? spec.local
            : `${spec.imported} as ${spec.local}`,
        );
      }
    }

    const hasDefault = Boolean(
      imp.isDefault && imp.defaultName && referencedIdents.has(imp.defaultName),
    );
    const hasNamespace = Boolean(
      imp.isNamespace &&
      imp.namespaceName &&
      referencedIdents.has(imp.namespaceName),
    );

    if (!usedSpecifiers.length && !hasDefault && !hasNamespace) continue;

    if (hasDefault && !usedSpecifiers.length && !hasNamespace) {
      lines.push(`import ${imp.defaultName} from '${rewrittenPath}'`);
    } else if (hasNamespace && !usedSpecifiers.length && !hasDefault) {
      lines.push(`import * as ${imp.namespaceName} from '${rewrittenPath}'`);
    } else if (hasDefault && usedSpecifiers.length) {
      lines.push(
        `import ${imp.defaultName}, { ${usedSpecifiers.join(", ")} } from '${rewrittenPath}'`,
      );
    } else if (usedSpecifiers.length) {
      lines.push(formatNamedImport(usedSpecifiers, rewrittenPath));
    }
  }
  return lines;
}

function hasMultipleRoots(jsx: string): boolean {
  const trimmed = jsx.trim();
  if (!trimmed.startsWith("<")) return false;
  if (trimmed.startsWith("<>") && trimmed.endsWith("</>")) return false;

  let depth = 0;
  let inString: string | null = null;
  let escape = false;
  let i = 0;

  while (i < trimmed.length) {
    const ch = trimmed[i];
    if (escape) {
      escape = false;
      i++;
      continue;
    }
    if (inString) {
      if (ch === "\\") escape = true;
      else if (ch === inString) inString = null;
      i++;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      inString = ch;
      i++;
      continue;
    }

    if (ch === "<") {
      if (trimmed.slice(i, i + 2) === "</") {
        depth--;
        const closeIdx = trimmed.indexOf(">", i);
        if (closeIdx === -1) break;
        i = closeIdx + 1;
        if (depth === 0) {
          const rest = trimmed.slice(i).trim();
          return rest.length > 0;
        }
        continue;
      } else if (trimmed.slice(i, i + 4) === "<!--") {
        const endComment = trimmed.indexOf("-->", i);
        i = endComment === -1 ? trimmed.length : endComment + 3;
        continue;
      } else {
        const closeIdx = trimmed.indexOf(">", i);
        if (closeIdx === -1) break;
        const isSelfClosing = trimmed[closeIdx - 1] === "/";
        if (!isSelfClosing) {
          depth++;
        } else if (depth === 0) {
          const rest = trimmed.slice(closeIdx + 1).trim();
          return rest.length > 0;
        }
        i = closeIdx + 1;
        continue;
      }
    }
    i++;
  }

  return false;
}

/**
 * Extracts a complete, self-contained SFC snippet for each story block in a Vue demo file.
 */
export function extractStories(
  rawSource: string,
  _componentName?: string,
): Record<string, string> {
  const re = /<Story\s+([^>]*?)>([\s\S]*?)<\/Story>/g;
  const out: Record<string, string> = {};
  const setupBlock =
    rawSource.match(/<script[^>]*setup[^>]*>([\s\S]*?)<\/script>/)?.[1] ?? "";

  const allImports = parseImports(setupBlock);
  const allDecls = parseDeclarations(setupBlock, false, 0);

  let m: RegExpExecArray | null;
  while ((m = re.exec(rawSource)) !== null) {
    const titleMatch = m[1].match(/title=["']([^"']+)["']/);
    if (!titleMatch) continue;
    const title = decodeHtmlEntities(titleMatch[1]);
    const slot = dedent(m[2]).trim();

    const wanted = new Set<string>();
    collectTemplateBindings(slot, wanted);

    const selectedDecls: DeclarationChunk[] = [];
    const seenNames = new Set<string>();
    const queue = [...wanted];
    let depth = 0;
    while (queue.length && depth < MAX_RESOLVE_DEPTH) {
      const layer = queue.splice(0, queue.length);
      depth++;
      for (const ident of layer) {
        if (seenNames.has(ident)) continue;
        seenNames.add(ident);
        const decl = allDecls.find((d) => d.names.includes(ident));
        if (!decl || selectedDecls.includes(decl)) continue;
        selectedDecls.push(decl);
        const inner = new Set<string>();
        collectFreeIdents(decl.source, inner);
        for (const n of inner) {
          if (!seenNames.has(n)) queue.push(n);
        }
      }
    }

    selectedDecls.sort((a, b) => a.order - b.order);

    const totalReferenced = new Set<string>(wanted);
    for (const d of selectedDecls) {
      collectFreeIdents(d.source, totalReferenced);
    }

    const importLines = renderImports(allImports, totalReferenced, false);

    const scriptParts: string[] = [];
    if (importLines.length) scriptParts.push(importLines.join("\n"));
    if (selectedDecls.length)
      scriptParts.push(selectedDecls.map((d) => d.source).join("\n\n"));

    if (scriptParts.length) {
      out[title] = [
        '<script setup lang="ts">',
        scriptParts.join("\n\n"),
        "</script>",
        "",
        "<template>",
        indent(slot, "  "),
        "</template>",
      ].join("\n");
    } else {
      out[title] = ["<template>", indent(slot, "  "), "</template>"].join("\n");
    }
  }

  return out;
}

/**
 * Extracts a complete, self-contained React component snippet for each story block in a React demo file.
 * Returns `export default function <Name>() { ... }` with all required imports and state included.
 */
export function extractStoriesJsx(
  rawSource: string,
  componentName?: string,
): Record<string, string> {
  const re = /<Story\s+([^>]*?)>([\s\S]*?)<\/Story>/g;
  const out: Record<string, string> = {};

  const allImports = parseImports(rawSource);

  const fnMatch = rawSource.match(
    /export\s+default\s+function\s+([A-Za-z_$][\w$]*)\s*\([^)]*\)\s*\{([\s\S]*)\n\}/,
  );
  const inferredCompName = componentName ?? fnMatch?.[1]?.replace(/Demo$/, "");

  const topLevelCode = fnMatch ? rawSource.slice(0, fnMatch.index) : "";
  const insideFnCode = fnMatch ? fnMatch[2] : "";
  const returnIdx = insideFnCode.indexOf("return (");
  const localDeclarationsCode =
    returnIdx >= 0 ? insideFnCode.slice(0, returnIdx) : insideFnCode;

  const allDecls: DeclarationChunk[] = [
    ...parseDeclarations(topLevelCode, true, 0),
    ...parseDeclarations(
      localDeclarationsCode,
      false,
      fnMatch ? fnMatch.index! : 0,
    ),
  ];

  let m: RegExpExecArray | null;
  while ((m = re.exec(rawSource)) !== null) {
    const titleMatch = m[1].match(/title=["']([^"']+)["']/);
    if (!titleMatch) continue;
    const title = decodeHtmlEntities(titleMatch[1]);
    const slot = dedent(m[2]).replace(/^\n+|\s+$/g, "");

    const wanted = new Set<string>();
    collectTemplateBindings(slot, wanted);

    const selectedDecls: DeclarationChunk[] = [];
    const seenNames = new Set<string>();
    const queue = [...wanted];
    let depth = 0;
    while (queue.length && depth < MAX_RESOLVE_DEPTH) {
      const layer = queue.splice(0, queue.length);
      depth++;
      for (const ident of layer) {
        if (seenNames.has(ident)) continue;
        seenNames.add(ident);
        const decl = allDecls.find((d) => d.names.includes(ident));
        if (!decl || selectedDecls.includes(decl)) continue;
        selectedDecls.push(decl);
        const inner = new Set<string>();
        collectFreeIdents(decl.source, inner);
        for (const n of inner) {
          if (!seenNames.has(n)) queue.push(n);
        }
      }
    }

    selectedDecls.sort((a, b) => a.order - b.order);

    const totalReferenced = new Set<string>(wanted);
    for (const d of selectedDecls) {
      collectFreeIdents(d.source, totalReferenced);
    }

    const importLines = renderImports(allImports, totalReferenced, true);
    const topDecls = selectedDecls.filter((d) => d.isTopLevel);
    const localDecls = selectedDecls.filter((d) => !d.isTopLevel);

    const fnName = deriveComponentName(inferredCompName, title);

    const lines: string[] = [];
    if (importLines.length) {
      lines.push(importLines.join("\n"));
      lines.push("");
    }
    if (topDecls.length) {
      lines.push(topDecls.map((d) => d.source).join("\n\n"));
      lines.push("");
    }

    lines.push(`export default function ${fnName}() {`);
    if (localDecls.length) {
      lines.push(indent(localDecls.map((d) => d.source).join("\n\n"), "  "));
      lines.push("");
    }

    if (hasMultipleRoots(slot)) {
      lines.push("  return (");
      lines.push("    <>");
      lines.push(indent(slot, "      "));
      lines.push("    </>");
      lines.push("  )");
    } else {
      lines.push("  return (");
      lines.push(indent(slot, "    "));
      lines.push("  )");
    }
    lines.push("}");

    out[title] = lines.join("\n");
  }

  return out;
}
