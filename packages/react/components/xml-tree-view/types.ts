export type XmlNodeType = "element" | "text" | "comment" | "cdata";

export interface XmlAttr {
  name: string;
  value: string;
}

export interface XmlNode {
  type: XmlNodeType;
  /** Tag name for elements; empty for text / comment / cdata. */
  name: string;
  attributes: XmlAttr[];
  /** Character data for text / comment / cdata nodes. */
  text: string;
  children: XmlNode[];
}

export interface ParseXmlResult {
  root: XmlNode | null;
  error: string | null;
}

/**
 * Convert a DOM node into a lightweight tree for rendering.
 * Whitespace-only text nodes are dropped so the tree stays readable.
 */
function domToNode(node: Node): XmlNode | null {
  if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as Element;
    const attributes: XmlAttr[] = Array.from(el.attributes).map((a) => ({
      name: a.name,
      value: a.value,
    }));
    const children: XmlNode[] = [];
    for (const child of Array.from(el.childNodes)) {
      const n = domToNode(child);
      if (n) children.push(n);
    }
    return {
      type: "element",
      name: el.tagName,
      attributes,
      text: "",
      children,
    };
  }

  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent ?? "";
    if (!text.trim()) return null;
    return { type: "text", name: "", attributes: [], text, children: [] };
  }

  if (node.nodeType === Node.COMMENT_NODE) {
    return {
      type: "comment",
      name: "",
      attributes: [],
      text: node.textContent ?? "",
      children: [],
    };
  }

  if (node.nodeType === Node.CDATA_SECTION_NODE) {
    return {
      type: "cdata",
      name: "",
      attributes: [],
      text: node.textContent ?? "",
      children: [],
    };
  }

  return null;
}

/**
 * Parse an XML string with the browser DOMParser.
 * Returns a structured tree or a human-readable error.
 */
export function parseXml(source: string): ParseXmlResult {
  const trimmed = source?.trim() ?? "";
  if (!trimmed) return { root: null, error: "Empty XML" };

  if (typeof DOMParser === "undefined") {
    return {
      root: null,
      error: "DOMParser is not available in this environment",
    };
  }

  try {
    const doc = new DOMParser().parseFromString(trimmed, "application/xml");
    const parseError = doc.querySelector("parsererror");
    if (parseError) {
      const msg =
        parseError.textContent?.replace(/\s+/g, " ").trim() || "Invalid XML";
      return { root: null, error: msg };
    }
    const el = doc.documentElement;
    if (!el) return { root: null, error: "Empty document" };
    const root = domToNode(el);
    if (!root) return { root: null, error: "Could not read document element" };
    return { root, error: null };
  } catch (e) {
    return {
      root: null,
      error: e instanceof Error ? e.message : "Failed to parse XML",
    };
  }
}

/** Serialize a tree node (and descendants) back to XML. */
export function serializeXml(node: XmlNode, indent = 0): string {
  const pad = "  ".repeat(indent);

  if (node.type === "text") return node.text;
  if (node.type === "comment") return `${pad}<!--${node.text}-->`;
  if (node.type === "cdata") return `${pad}<![CDATA[${node.text}]]>`;

  const attrs =
    node.attributes.length > 0
      ? " " +
        node.attributes
          .map((a) => `${a.name}="${escapeAttr(a.value)}"`)
          .join(" ")
      : "";

  if (node.children.length === 0) {
    return `${pad}<${node.name}${attrs} />`;
  }

  // Single text child → keep on one line
  if (node.children.length === 1 && node.children[0]!.type === "text") {
    return `${pad}<${node.name}${attrs}>${escapeText(node.children[0]!.text)}</${node.name}>`;
  }

  const inner = node.children
    .map((c) => serializeXml(c, indent + 1))
    .join("\n");
  return `${pad}<${node.name}${attrs}>\n${inner}\n${pad}</${node.name}>`;
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function escapeText(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

/** True when an element expands (has non-trivial children). */
export function isExpandable(node: XmlNode): boolean {
  if (node.type !== "element") return false;
  if (node.children.length === 0) return false;
  // Single text child stays inline — no expand
  if (node.children.length === 1 && node.children[0]!.type === "text")
    return false;
  return true;
}

/** Count element descendants (for summary). */
export function countElements(node: XmlNode): number {
  let n = node.type === "element" ? 1 : 0;
  for (const c of node.children) n += countElements(c);
  return n;
}

/** Path key for expand/collapse set. */
export function pathKey(path: string[]): string {
  return path.length ? "/" + path.join("/") : "/";
}

/** Walk expandable nodes with consistent sibling-indexed path segments. */
export function walkExpandable(
  node: XmlNode,
  path: string[],
  depth: number,
  max: number,
  visit: (path: string[], node: XmlNode) => void,
) {
  if (depth >= max) return;
  if (isExpandable(node)) {
    visit(path, node);
    const counts = new Map<string, number>();
    const totals = new Map<string, number>();
    for (const c of node.children) {
      if (c.type === "element")
        totals.set(c.name, (totals.get(c.name) ?? 0) + 1);
    }
    node.children.forEach((child, i) => {
      let segment: string;
      if (child.type === "element") {
        const n = (counts.get(child.name) ?? 0) + 1;
        counts.set(child.name, n);
        const total = totals.get(child.name) ?? 1;
        segment = total > 1 ? `${child.name}[${n}]` : child.name;
      } else if (child.type === "comment") {
        segment = `comment()[${i}]`;
      } else {
        segment = `text()[${i}]`;
      }
      walkExpandable(child, [...path, segment], depth + 1, max, visit);
    });
  }
}

export function childEntries(node: XmlNode, path: string[]) {
  const counts = new Map<string, number>();
  const totals = new Map<string, number>();
  for (const c of node.children) {
    if (c.type === "element") totals.set(c.name, (totals.get(c.name) ?? 0) + 1);
  }
  return node.children.map((child, i) => {
    let segment: string;
    if (child.type === "element") {
      const n = (counts.get(child.name) ?? 0) + 1;
      counts.set(child.name, n);
      const total = totals.get(child.name) ?? 1;
      segment = total > 1 ? `${child.name}[${n}]` : child.name;
    } else if (child.type === "comment") {
      segment = `comment()[${i}]`;
    } else {
      segment = `text()[${i}]`;
    }
    return { child, segment, path: [...path, segment] as string[] };
  });
}
