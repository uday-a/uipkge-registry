import * as React from "react";
import { ChevronDown, ChevronRight, Copy, Check } from "lucide-react";
import type { XmlNode } from "./types";
import { isExpandable, serializeXml, pathKey, childEntries } from "./types";

export interface XmlTreeNodeProps {
  node: XmlNode;
  path: string[];
  isRoot?: boolean;
  search?: string;
  maxDepth?: number;
  matchesSearch: (node: XmlNode) => boolean;
  isExpanded: (path: string[]) => boolean;
  toggle: (path: string[]) => void;
  tagColor: string;
  attrNameColor: string;
  attrValueColor: string;
  textColor: string;
  commentColor: string;
  punctColor: string;
  copiedPath?: string | null;
  onCopy?: (value: string, path: string[]) => void;
}

function XmlTreeNode(props: XmlTreeNodeProps): React.ReactElement {
  const {
    node,
    path,
    isRoot = false,
    search = "",
    maxDepth = 100,
    matchesSearch,
    isExpanded,
    toggle,
    tagColor,
    attrNameColor,
    attrValueColor,
    textColor,
    commentColor,
    punctColor,
    copiedPath = null,
    onCopy,
  } = props;

  const key = pathKey(path);
  const open = isExpanded(path);
  const expandable = isExpandable(node);
  const dimmed = !!search && !matchesSearch(node);
  const indent = isRoot ? 0 : 20;
  const parentKey = path.length ? pathKey(path.slice(0, -1)) : null;

  const entries = React.useMemo(() => childEntries(node, path), [node, path]);
  const childCount = node.children.filter((c) => c.type === "element").length;

  const collapsedPreview = React.useMemo(() => {
    if (open || !expandable) return "";
    const tags = node.children.filter((c) => c.type === "element").slice(0, 3);
    const parts = tags.map(
      (c) => `<${c.name}${c.attributes.length ? " …" : ""}>`,
    );
    const suffix = childCount > 3 ? " …" : "";
    return parts.join(" ") + suffix;
  }, [open, expandable, node.children, childCount]);

  const textOnlyChild =
    node.type === "element" &&
    node.children.length === 1 &&
    node.children[0]!.type === "text"
      ? node.children[0]!.text
      : null;

  function handleCopy() {
    const value = node.type === "element" ? serializeXml(node) : node.text;
    onCopy?.(value, path);
  }

  function getTreeRows(from: HTMLElement): HTMLElement[] {
    const tree = from.closest('[role="tree"]');
    if (!tree) return [];
    return Array.from(tree.querySelectorAll<HTMLElement>("[data-tree-row]"));
  }

  function focusRow(row: HTMLElement | null | undefined) {
    row?.focus();
  }

  function handleRowKeydown(e: React.KeyboardEvent) {
    const target = e.currentTarget as HTMLElement;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (expandable) toggle(path);
      else handleCopy();
      return;
    }

    if (e.key === "ArrowRight") {
      e.preventDefault();
      if (expandable && !open) {
        toggle(path);
      } else if (expandable && open) {
        const rows = getTreeRows(target);
        const idx = rows.indexOf(target);
        if (idx >= 0 && idx < rows.length - 1) focusRow(rows[idx + 1]);
      }
      return;
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (expandable && open) {
        toggle(path);
      } else if (parentKey) {
        const tree = target.closest('[role="tree"]');
        const parent = tree?.querySelector<HTMLElement>(
          `[data-tree-row][data-tree-id="${CSS.escape(parentKey)}"]`,
        );
        focusRow(parent);
      }
      return;
    }

    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const rows = getTreeRows(target);
      const idx = rows.indexOf(target);
      if (idx < 0) return;
      focusRow(e.key === "ArrowDown" ? rows[idx + 1] : rows[idx - 1]);
      return;
    }

    if (e.key === "Home") {
      e.preventDefault();
      focusRow(getTreeRows(target)[0]);
      return;
    }

    if (e.key === "End") {
      e.preventDefault();
      const rows = getTreeRows(target);
      focusRow(rows[rows.length - 1]);
    }
  }

  const copyBtn = (
    <button
      type="button"
      className="text-muted-foreground hover:text-foreground focus-visible:ring-ring ml-auto inline-flex size-5 shrink-0 items-center justify-center rounded opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-1"
      title="Copy"
      aria-label="Copy"
      tabIndex={-1}
      onClick={(e) => {
        e.stopPropagation();
        handleCopy();
      }}
    >
      {copiedPath === key ? (
        <Check className="size-3 text-emerald-500" />
      ) : (
        <Copy className="size-3" />
      )}
    </button>
  );

  const attrs = node.attributes.map((attr) => (
    <React.Fragment key={attr.name}>
      <span className="select-none">&nbsp;</span>
      <span className={`${attrNameColor} select-none`}>{attr.name}</span>
      <span className={`${punctColor} select-none`}>=</span>
      <span className={`${attrValueColor} select-none`}>"{attr.value}"</span>
    </React.Fragment>
  ));

  return (
    <div
      data-dimmed={dimmed ? "" : undefined}
      className={dimmed ? "opacity-30" : ""}
      role="treeitem"
      aria-expanded={expandable ? open : undefined}
    >
      {node.type === "element" && expandable && (
        <>
          <div
            data-tree-row
            data-tree-id={key}
            data-tree-parent={parentKey ?? undefined}
            tabIndex={0}
            className="group hover:bg-accent/40 focus-visible:ring-ring/50 -mx-1 flex items-center gap-0.5 rounded px-1 py-0.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
            style={{ paddingLeft: `${indent}px` }}
            onClick={() => toggle(path)}
            onKeyDown={handleRowKeydown}
          >
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex size-4 shrink-0 items-center justify-center rounded"
              aria-expanded={open}
              aria-label={open ? "Collapse" : "Expand"}
              tabIndex={-1}
              onClick={(e) => {
                e.stopPropagation();
                toggle(path);
              }}
            >
              {open ? (
                <ChevronDown className="size-3.5" />
              ) : (
                <ChevronRight className="size-3.5" />
              )}
            </button>
            <span className={`${punctColor} select-none`}>&lt;</span>
            <span className={`${tagColor} select-none`}>{node.name}</span>
            {attrs}
            <span className={`${punctColor} select-none`}>&gt;</span>
            {open ? (
              <span className="text-muted-foreground ml-0.5 text-xs">
                {childCount} {childCount === 1 ? "child" : "children"}
              </span>
            ) : (
              <span className="text-muted-foreground ml-1 truncate text-xs select-none">
                {collapsedPreview}
              </span>
            )}
            {copyBtn}
          </div>

          {open && (
            <div role="group">
              {entries.map((entry) => (
                <XmlTreeNode
                  key={entry.segment}
                  node={entry.child}
                  path={entry.path}
                  isRoot={false}
                  search={search}
                  maxDepth={maxDepth}
                  matchesSearch={matchesSearch}
                  isExpanded={isExpanded}
                  toggle={toggle}
                  tagColor={tagColor}
                  attrNameColor={attrNameColor}
                  attrValueColor={attrValueColor}
                  textColor={textColor}
                  commentColor={commentColor}
                  punctColor={punctColor}
                  copiedPath={copiedPath}
                  onCopy={onCopy}
                />
              ))}
              <div
                className="flex items-center gap-0.5 py-0.5 select-none"
                style={{ paddingLeft: `${indent}px` }}
              >
                <span className="inline-flex size-4 shrink-0" />
                <span className={punctColor}>&lt;/</span>
                <span className={tagColor}>{node.name}</span>
                <span className={punctColor}>&gt;</span>
              </div>
            </div>
          )}
        </>
      )}

      {node.type === "element" && !expandable && (
        <div
          data-tree-row
          data-tree-id={key}
          data-tree-parent={parentKey ?? undefined}
          tabIndex={0}
          className="group hover:bg-accent/40 focus-visible:ring-ring/50 -mx-1 flex items-center gap-0.5 rounded px-1 py-0.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
          style={{ paddingLeft: `${indent}px` }}
          onClick={handleCopy}
          onKeyDown={handleRowKeydown}
        >
          <span className="inline-flex size-4 shrink-0" />
          <span className={`${punctColor} select-none`}>&lt;</span>
          <span className={`${tagColor} select-none`}>{node.name}</span>
          {attrs}
          {textOnlyChild !== null ? (
            <>
              <span className={`${punctColor} select-none`}>&gt;</span>
              <span className={`${textColor} truncate`}>{textOnlyChild}</span>
              <span className={`${punctColor} shrink-0 select-none`}>
                &lt;/
              </span>
              <span className={`${tagColor} shrink-0 select-none`}>
                {node.name}
              </span>
              <span className={`${punctColor} shrink-0 select-none`}>&gt;</span>
            </>
          ) : (
            <span className={`${punctColor} select-none`}> /&gt;</span>
          )}
          {copyBtn}
        </div>
      )}

      {node.type === "comment" && (
        <div
          data-tree-row
          data-tree-id={key}
          data-tree-parent={parentKey ?? undefined}
          tabIndex={0}
          className="group hover:bg-accent/40 focus-visible:ring-ring/50 -mx-1 flex items-center gap-0.5 rounded px-1 py-0.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
          style={{ paddingLeft: `${indent}px` }}
          onClick={handleCopy}
          onKeyDown={handleRowKeydown}
        >
          <span className="inline-flex size-4 shrink-0" />
          <span className={`${commentColor} truncate italic select-none`}>
            &lt;!--{node.text}--&gt;
          </span>
          {copyBtn}
        </div>
      )}

      {node.type === "cdata" && (
        <div
          data-tree-row
          data-tree-id={key}
          data-tree-parent={parentKey ?? undefined}
          tabIndex={0}
          className="group hover:bg-accent/40 focus-visible:ring-ring/50 -mx-1 flex items-center gap-0.5 rounded px-1 py-0.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
          style={{ paddingLeft: `${indent}px` }}
          onClick={handleCopy}
          onKeyDown={handleRowKeydown}
        >
          <span className="inline-flex size-4 shrink-0" />
          <span className={`${punctColor} select-none`}>&lt;![CDATA[</span>
          <span className={`${textColor} truncate`}>{node.text}</span>
          <span className={`${punctColor} shrink-0 select-none`}>]]&gt;</span>
          {copyBtn}
        </div>
      )}

      {node.type === "text" && (
        <div
          data-tree-row
          data-tree-id={key}
          data-tree-parent={parentKey ?? undefined}
          tabIndex={0}
          className="group hover:bg-accent/40 focus-visible:ring-ring/50 -mx-1 flex items-center gap-0.5 rounded px-1 py-0.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
          style={{ paddingLeft: `${indent}px` }}
          onClick={handleCopy}
          onKeyDown={handleRowKeydown}
        >
          <span className="inline-flex size-4 shrink-0" />
          <span className={`${textColor} truncate`}>{node.text}</span>
          {copyBtn}
        </div>
      )}
    </div>
  );
}

export { XmlTreeNode };
