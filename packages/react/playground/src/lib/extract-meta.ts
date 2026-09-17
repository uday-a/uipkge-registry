import type { PropMeta } from "./extract-props";

export interface TypeDecl {
  name: string;
  body: string;
}

type File = { path: string; content: string };

/**
 * Schema: exported `interface`/`type` aliases declared in the item's source
 * (e.g. KpiItem, StepperStep). Skips the component's own `*Props` interface --
 * that surfaces in the Props table. Works on both Vue (<script setup>) and
 * React (.ts/.tsx) files. Ported from registry-site RegistryItemDetail.
 */
export function extractTypeDecls(files: File[]): TypeDecl[] {
  const seen = new Set<string>();
  const out: TypeDecl[] = [];
  const re =
    /(?:^|\n)\s*(?:export\s+)?(interface|type)\s+(\w+)\s*=?\s*(\{[\s\S]*?\n\})/g;
  for (const f of files) {
    let body: string | null = null;
    if (f.path.endsWith(".vue")) {
      const s = f.content.match(/<script[^>]*setup[^>]*>([\s\S]*?)<\/script>/);
      if (s) body = s[1];
    } else if (/\.(ts|tsx)$/.test(f.path)) {
      body = f.content;
    }
    if (!body) continue;
    let m: RegExpExecArray | null;
    re.lastIndex = 0;
    while ((m = re.exec(body)) !== null) {
      if (seen.has(m[2]) || /Props$/.test(m[2])) continue;
      seen.add(m[2]);
      out.push({ name: m[2], body: `${m[1]} ${m[2]} ${m[3]}` });
    }
  }
  return out;
}

/** Balanced-brace slice: given the index of an opening `{`, return the
 *  substring through its matching `}` (inclusive). */
function sliceBraces(s: string, open: number): string {
  let depth = 0;
  for (let i = open; i < s.length; i++) {
    if (s[i] === "{") depth++;
    else if (s[i] === "}") {
      depth--;
      if (depth === 0) return s.slice(open, i + 1);
    }
  }
  return s.slice(open);
}

/** Pull the cva `variants: { key: { v1, v2 } }` block + `defaultVariants` so
 *  React props that come from a `*.variants.ts` (variant, size, ...) show up in
 *  the Props table with their value sets. */
/**
 * Theming: CSS custom properties (`var(--token)`) referenced anywhere in the
 * item's files. Consumers override these in :root or per-element to retheme.
 * Ported from registry-site RegistryItemDetail.
 */
export function extractThemeTokens(files: File[]): string[] {
  const seen = new Set<string>();
  for (const f of files) {
    for (const m of f.content.matchAll(/var\((--[\w-]+)\)/g)) {
      if (m[1]) seen.add(m[1]);
    }
  }
  return [...seen].sort();
}

export function extractCvaVariants(source: string): PropMeta[] {
  const vIdx = source.search(/\bvariants\s*:\s*\{/);
  if (vIdx < 0) return [];
  const open = source.indexOf("{", vIdx);
  const block = sliceBraces(source, open).slice(1, -1); // inner of variants:{...}

  // defaults
  const defaults: Record<string, string> = {};
  const dIdx = source.search(/\bdefaultVariants\s*:\s*\{/);
  if (dIdx >= 0) {
    const dBlock = sliceBraces(source, source.indexOf("{", dIdx)).slice(1, -1);
    for (const m of dBlock.matchAll(/(\w+)\s*:\s*['"]([^'"]+)['"]/g))
      defaults[m[1]] = m[2];
  }

  const out: PropMeta[] = [];
  // top-level keys of the variants block
  const keyRe = /(\w+)\s*:\s*\{/g;
  let km: RegExpExecArray | null;
  while ((km = keyRe.exec(block)) !== null) {
    const key = km[1];
    const inner = sliceBraces(block, block.indexOf("{", km.index)).slice(1, -1);
    const values = [...inner.matchAll(/(?:^|,)\s*(?:['"]?([\w-]+)['"]?)\s*:/g)]
      .map((m) => m[1])
      .filter(Boolean);
    out.push({
      name: key,
      type: values.map((v) => `'${v}'`).join(" | "),
      values,
      required: false,
      default: defaults[key] ?? "",
      doc: "",
    });
    keyRe.lastIndex = block.indexOf("}", km.index); // skip past this nested block
  }
  return out;
}

function parseInterfaceBody(body: string): PropMeta[] {
  const out: PropMeta[] = [];
  // strip nested object/function braces so member splitting is line-ish
  const lines = body.split("\n");
  let doc = "";
  for (let raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    const docM =
      line.match(/^\/\*\*?\s*(.*?)\s*\*?\*\/$/) || line.match(/^\/\/\s*(.*)$/);
    if (docM) {
      doc = docM[1];
      continue;
    }
    if (line.startsWith("*")) {
      doc =
        (doc ? doc + " " : "") +
        line.replace(/^\*\/?\s?/, "").replace(/\s*\*\/$/, "");
      continue;
    }
    const m = line.match(
      /^(?:readonly\s+)?([A-Za-z_$][\w$]*)(\?)?\s*:\s*(.+?);?$/,
    );
    if (m) {
      out.push({
        name: m[1],
        type: m[3].replace(/;$/, "").trim(),
        required: !m[2],
        default: "",
        doc: doc.trim(),
      });
      doc = "";
    } else {
      doc = "";
    }
  }
  return out;
}

/**
 * React Props: cva variant keys (from `*.variants.ts`) + the fields of the
 * component's own `interface *Props` (the extends-chain HTML/Radix props are
 * intentionally omitted -- same as the Vue table, which lists the item's own
 * surface, not the forwarded DOM props). Defaults are read from the forwardRef
 * destructure (`{ size = 'middle', ... }`).
 */
export function extractReactProps(files: File[]): PropMeta[] {
  const main = files.find(
    (f) => /\.tsx$/.test(f.path) && !/\.variants\./.test(f.path),
  );
  const variantsFile = files.find((f) => /\.variants\.ts$/.test(f.path));
  const seen = new Set<string>();
  const props: PropMeta[] = [];

  if (variantsFile) {
    for (const p of extractCvaVariants(variantsFile.content)) {
      if (!seen.has(p.name)) {
        seen.add(p.name);
        props.push(p);
      }
    }
  }
  if (main) {
    const im = main.content.match(
      /interface\s+\w*Props\b[^{]*\{([\s\S]*?)\n\}/,
    );
    if (im) {
      for (const p of parseInterfaceBody(im[1])) {
        if (!seen.has(p.name)) {
          seen.add(p.name);
          props.push(p);
        }
      }
    }
    // destructure defaults: ({ size = 'middle', variant = 'outlined', ... })
    const dm = main.content.match(
      /\(\s*\{([\s\S]*?)\}\s*(?:,\s*ref)?\s*\)\s*=>/,
    );
    if (dm) {
      for (const d of dm[1].matchAll(
        /(\w+)\s*=\s*('[^']*'|"[^"]*"|true|false|\d+)/g,
      )) {
        const p = props.find((x) => x.name === d[1]);
        if (p && !p.default) p.default = d[2].replace(/^['"]|['"]$/g, "");
      }
    }
  }
  return props;
}

/**
 * Vue Props: `defineProps` fields, with the cva `*.variants.ts` value sets
 * merged in. Vue types a cva-backed prop by its alias (`MapVariant`,
 * `MapVariants['size']`), so the table showed an opaque name and no default
 * while React -- which reads the same variants file -- listed the values. Merge
 * keeps the SFC's doc comment and any `withDefaults` value, and still appends
 * cva keys the SFC does not declare.
 */
export function mergeVueCvaProps(
  fields: PropMeta[],
  cva: PropMeta[],
): PropMeta[] {
  const byName = new Map(cva.map((p) => [p.name, p]));
  const declared = new Set(fields.map((p) => p.name));
  const merged = fields.map((f) => {
    const v = byName.get(f.name);
    // Leave fields that already spell out a literal union in the SFC, and
    // boolean props whose cva key is the `true:`/`false:` toggle form -- those
    // values document classes, not an API the consumer passes as a string.
    const boolToggle = (v?.values ?? []).every(
      (x) => x === "true" || x === "false",
    );
    if (!v || f.values?.length || /^boolean\b/.test(f.type) || boolToggle)
      return f;
    return {
      ...f,
      type: v.type,
      values: v.values,
      default: f.default || v.default,
    };
  });
  return [...cva.filter((p) => !declared.has(p.name)), ...merged];
}
