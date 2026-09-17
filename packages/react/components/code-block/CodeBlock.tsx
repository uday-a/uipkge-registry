"use client";

import * as React from "react";
import { Check, ChevronDown, ChevronUp, Copy } from "lucide-react";
import {
  codeToTokens,
  type ThemedToken,
  type BundledLanguage,
} from "shiki/bundle/web";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface CodeBlockProps {
  /** Source code to display. */
  code: string;
  /** Language label shown in the header. */
  language?: string;
  /** Render line numbers in the gutter. */
  showLineNumbers?: boolean;
  /** Maximum height of the code body before scrolling kicks in. CSS length (e.g. '400px'). */
  maxHeight?: string;
  /** Render expanded on first paint. Default true. */
  defaultExpanded?: boolean;
  /** Show the language label / copy / collapse header. */
  showHeader?: boolean;
  className?: string;
}

interface HighlightSegment {
  content: string;
  style?: ThemedToken["htmlStyle"];
}

function toHighlightSegments(
  tokens: ThemedToken[][],
  source: string,
): HighlightSegment[] {
  const segments: HighlightSegment[] = [];
  let cursor = 0;

  for (const token of tokens.flat()) {
    if (token.offset > cursor)
      segments.push({ content: source.slice(cursor, token.offset) });
    segments.push({ content: token.content, style: token.htmlStyle });
    cursor = token.offset + token.content.length;
  }

  if (cursor < source.length) segments.push({ content: source.slice(cursor) });
  return segments;
}

function CodeBlock({
  code,
  language = "tsx",
  showLineNumbers = true,
  maxHeight = "400px",
  defaultExpanded = true,
  showHeader = true,
  className,
}: CodeBlockProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);
  const [copyStatus, setCopyStatus] = React.useState<
    "idle" | "copied" | "error"
  >("idle");
  const [highlightedSegments, setHighlightedSegments] = React.useState<
    HighlightSegment[] | null
  >(null);
  const copyResetTimer = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const bodyId = `code-block-${React.useId()}`;
  const lines = React.useMemo(() => code.split("\n"), [code]);
  const bodyVisible = !showHeader || isExpanded;
  const copyLabel =
    copyStatus === "copied"
      ? "Copied"
      : copyStatus === "error"
        ? "Copy failed"
        : "Copy";

  React.useEffect(() => {
    return () => {
      if (copyResetTimer.current) clearTimeout(copyResetTimer.current);
    };
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    setHighlightedSegments(null);

    codeToTokens(code, {
      lang: language.toLowerCase() as BundledLanguage,
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
    })
      .then(({ tokens }) => {
        if (!cancelled)
          setHighlightedSegments(toHighlightSegments(tokens, code));
      })
      .catch(() => {
        if (!cancelled) setHighlightedSegments(null);
      });

    return () => {
      cancelled = true;
    };
  }, [code, language]);

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(code);
      setCopyStatus("copied");
    } catch (e) {
      setCopyStatus("error");
      console.warn("Clipboard write failed", e);
    } finally {
      if (copyResetTimer.current) clearTimeout(copyResetTimer.current);
      copyResetTimer.current = setTimeout(() => setCopyStatus("idle"), 1600);
    }
  }

  return (
    <div
      data-uipkge=""
      data-slot="code-block"
      className={cn(
        "group border-border bg-muted/20 relative overflow-hidden rounded-lg border",
        className,
      )}
    >
      {/* Header */}
      {showHeader && (
        <div className="border-border bg-muted/40 flex items-center justify-between gap-2 border-b px-3 py-2">
          <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            {language}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="xs"
              className="h-7 gap-1.5 px-2"
              onClick={copyToClipboard}
            >
              {copyStatus === "copied" ? (
                <Check className="text-success size-3" aria-hidden="true" />
              ) : (
                <Copy className="size-3" aria-hidden="true" />
              )}
              <span
                className={cn(
                  "text-xs",
                  copyStatus === "error" && "text-destructive",
                )}
                aria-live="polite"
                aria-atomic="true"
              >
                {copyLabel}
              </span>
            </Button>
            <Button
              variant="ghost"
              size="xs"
              className="h-7 gap-1.5 px-2"
              aria-expanded={isExpanded}
              aria-controls={bodyId}
              onClick={() => setIsExpanded((v) => !v)}
            >
              {isExpanded ? (
                <ChevronUp className="size-3" aria-hidden="true" />
              ) : (
                <ChevronDown className="size-3" aria-hidden="true" />
              )}
              <span className="text-xs">
                {isExpanded ? "Hide" : "Show"} code
              </span>
            </Button>
          </div>
        </div>
      )}

      {/* Shiki token offsets preserve the original source exactly, including
          whitespace between highlighted tokens. */}
      <div
        id={bodyId}
        role="region"
        aria-label={`${language} code sample`}
        tabIndex={0}
        hidden={!bodyVisible}
        className="bg-background/40 focus-visible:ring-ring overflow-auto font-mono text-sm leading-relaxed focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
        style={{ maxHeight }}
      >
        <div className="flex w-max min-w-full">
          {showLineNumbers && (
            <div
              aria-hidden="true"
              className="text-muted-foreground/60 border-border/60 bg-muted/30 sticky left-0 border-r px-3 py-3 text-right tabular-nums select-none"
            >
              {lines.map((_, i) => (
                <span key={i} className="block">
                  {i + 1}
                </span>
              ))}
            </div>
          )}
          <pre className="m-0 min-w-max flex-1">
            <code className="block cursor-text px-4 py-3 whitespace-pre">
              {highlightedSegments
                ? highlightedSegments.map((segment, i) => (
                    <span
                      key={i}
                      data-syntax-token=""
                      className="text-[var(--shiki-light)] dark:text-[var(--shiki-dark)]"
                      style={segment.style as React.CSSProperties}
                    >
                      {segment.content}
                    </span>
                  ))
                : code}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}

export { CodeBlock };
