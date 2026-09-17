"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface HighlightProps extends Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  "children"
> {
  /** Text to search within. */
  text: string;
  /** Query string or RegExp to highlight. */
  query: string | RegExp;
  /** HTML tag used to wrap matched substrings. Default 'mark'. */
  highlightTag?: "mark" | "span";
  /** Class applied to each highlight wrapper. */
  highlightClass?: React.HTMLAttributes<HTMLSpanElement>["className"];
  /** Inline style applied to each highlight wrapper. */
  highlightStyle?: React.CSSProperties;
  /** Case-sensitive matching. Default false. */
  caseSensitive?: boolean;
  /** Match whole words only. Default false. */
  wholeWord?: boolean;
  /** Cap the number of highlights rendered. 0 = unlimited. Default 0. */
  maxHighlights?: number;
  /** Fired with the number of highlights actually rendered (after maxHighlights cap). */
  onMatchCount?: (count: number) => void;
  /** Fired with the total match count (before maxHighlights cap). */
  onTotalMatchCount?: (count: number) => void;
}

interface Segment {
  text: string;
  match: boolean;
}

function buildPattern(
  query: string | RegExp,
  caseSensitive: boolean,
  wholeWord: boolean,
): RegExp | null {
  if (query instanceof RegExp) {
    const flags = query.flags.includes("g") ? query.flags : query.flags + "g";
    return new RegExp(query.source, flags);
  }
  if (!query) return null;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const body = wholeWord ? `\\b${escaped}\\b` : escaped;
  const flags = caseSensitive ? "g" : "gi";
  return new RegExp(body, flags);
}

const Highlight = React.forwardRef<HTMLSpanElement, HighlightProps>(
  (
    {
      className,
      text,
      query,
      highlightTag = "mark",
      highlightClass,
      highlightStyle,
      caseSensitive = false,
      wholeWord = false,
      maxHighlights = 0,
      onMatchCount,
      onTotalMatchCount,
      ...props
    },
    ref,
  ) => {
    const segments = React.useMemo<Segment[]>(() => {
      if (!text) return [];
      if (!query) return [{ text, match: false }];

      const pattern = buildPattern(query, caseSensitive, wholeWord);
      if (!pattern) return [{ text, match: false }];

      const out: Segment[] = [];
      let last = 0;
      let count = 0;
      let m: RegExpExecArray | null;
      while ((m = pattern.exec(text)) !== null) {
        if (m.index > last)
          out.push({ text: text.slice(last, m.index), match: false });
        out.push({ text: m[0], match: true });
        last = m.index + m[0].length;
        count++;
        if (maxHighlights > 0 && count >= maxHighlights) break;
        if (m[0] === "") pattern.lastIndex++;
      }
      if (last < text.length)
        out.push({ text: text.slice(last), match: false });

      return out;
    }, [text, query, caseSensitive, wholeWord, maxHighlights]);

    const totalMatchCount = React.useMemo(() => {
      if (!text || !query) return 0;
      const pattern = buildPattern(query, caseSensitive, wholeWord);
      if (!pattern) return 0;

      let total = 0;
      let m: RegExpExecArray | null;
      while ((m = pattern.exec(text)) !== null) {
        total++;
        if (m[0] === "") pattern.lastIndex++;
      }
      return total;
    }, [text, query, caseSensitive, wholeWord]);

    const renderedMatchCount = React.useMemo(
      () => segments.filter((s) => s.match).length,
      [segments],
    );

    React.useEffect(() => {
      onMatchCount?.(renderedMatchCount);
    }, [renderedMatchCount, onMatchCount]);

    React.useEffect(() => {
      onTotalMatchCount?.(totalMatchCount);
    }, [totalMatchCount, onTotalMatchCount]);

    const Tag = highlightTag;

    return (
      <span
        ref={ref}
        data-uipkge=""
        data-slot="highlight"
        className={cn(className)}
        {...props}
      >
        {segments.map((seg, i) =>
          seg.match ? (
            <Tag
              key={i}
              data-slot="highlight-match"
              className={cn(
                "bg-accent text-accent-foreground dark:bg-accent/30 dark:text-accent-foreground rounded px-0.5 font-medium",
                highlightClass,
              )}
              style={highlightStyle}
            >
              {seg.text}
            </Tag>
          ) : (
            <React.Fragment key={i}>{seg.text}</React.Fragment>
          ),
        )}
      </span>
    );
  },
);
Highlight.displayName = "Highlight";

export { Highlight };
