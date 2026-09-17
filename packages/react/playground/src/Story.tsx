import React, { useState, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Eye, Code2, Copy, Check, Maximize2, Minimize2 } from "lucide-react";
import { useStoryCode } from "./StoryContext";

export interface StoryProps {
  title: string;
  description?: string;
  code?: string;
  children: ReactNode;
}

export default function Story({
  title,
  description,
  code,
  children,
}: StoryProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const contextCode = useStoryCode(title);
  const sourceCode = code || contextCode;

  const copyCode = async () => {
    if (!sourceCode) return;
    try {
      await navigator.clipboard.writeText(sourceCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy snippet:", err);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  const storyContent = (
    <>
      {isFullscreen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsFullscreen(false)}
        />
      )}
      <section
        id={title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
        className={`group overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-xs transition-all duration-200 ${
          isFullscreen
            ? "flex flex-col shadow-2xl bg-card border-border/80 animate-in zoom-in-95 duration-150"
            : "relative mb-8"
        }`}
        style={
          isFullscreen
            ? {
                position: "fixed",
                top: "2rem",
                bottom: "2rem",
                left: "2rem",
                right: "2rem",
                zIndex: 50,
              }
            : undefined
        }
      >
        {/* Header bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/20 px-4 py-3 sm:px-5 shrink-0">
          <div className="flex flex-col gap-0.5 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">
                {title}
              </h3>
              {isFullscreen && (
                <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  Focused View
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0 text-xs">
            {/* Preview / Code tabs */}
            <div className="flex items-center rounded-lg border border-border bg-background/80 p-0.5 shadow-xs">
              <button
                type="button"
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-colors cursor-pointer ${
                  activeTab === "preview"
                    ? "bg-muted text-foreground shadow-xs font-semibold border border-border/80"
                    : "text-muted-foreground hover:text-foreground border border-transparent"
                }`}
                onClick={() => setActiveTab("preview")}
              >
                <Eye className="size-3.5" />
                <span>Preview</span>
              </button>

              <button
                type="button"
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-colors cursor-pointer ${
                  activeTab === "code"
                    ? "bg-muted text-foreground shadow-xs font-semibold border border-border/80"
                    : "text-muted-foreground hover:text-foreground border border-transparent"
                }`}
                onClick={() => setActiveTab("code")}
              >
                <Code2 className="size-3.5" />
                <span>Code</span>
              </button>
            </div>

            {/* One-click copy source */}
            {sourceCode && (
              <button
                type="button"
                title={copied ? "Copied!" : "Copy source code"}
                className="flex size-7 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition shadow-xs cursor-pointer"
                onClick={copyCode}
              >
                {copied ? (
                  <Check className="size-3.5 text-emerald-500" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </button>
            )}

            {/* Fullscreen / focus view */}
            <button
              type="button"
              title={isFullscreen ? "Exit focus (Esc)" : "Focus story"}
              className="flex size-7 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition shadow-xs cursor-pointer"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? (
                <Minimize2 className="size-3.5" />
              ) : (
                <Maximize2 className="size-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Story Canvas / Preview Content */}
        <div
          className={`relative overflow-x-auto p-6 sm:p-8 ${
            isFullscreen ? "flex-1 overflow-y-auto" : ""
          } ${activeTab === "preview" ? "block" : "hidden"}`}
        >
          {children}
        </div>

        {/* Story Source Code View */}
        <div
          className={`relative bg-muted/40 p-4 sm:p-5 ${
            isFullscreen ? "flex-1 overflow-y-auto" : ""
          } ${activeTab === "code" ? "block" : "hidden"}`}
        >
          {sourceCode ? (
            <div className="relative">
              <pre className="code-block rounded-lg border border-border bg-card p-4 text-xs font-mono text-foreground overflow-x-auto leading-relaxed">
                <code>{sourceCode}</code>
              </pre>
            </div>
          ) : (
            <div className="py-12 text-center text-xs font-mono text-muted-foreground">
              Source code available in inspector tab below.
            </div>
          )}
        </div>
      </section>
    </>
  );

  if (isFullscreen && typeof document !== "undefined") {
    return createPortal(storyContent, document.body);
  }

  return storyContent;
}
