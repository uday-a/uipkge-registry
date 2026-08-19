import React, { useState, type ReactNode } from "react";
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

  return (
    <section
      className={`relative overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-xs transition-all ${
        isFullscreen
          ? "fixed inset-4 z-50 flex flex-col shadow-2xl bg-card"
          : "mb-8"
      }`}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2.5">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-semibold tracking-tight text-foreground">
              {title}
            </h3>
            {isFullscreen && (
              <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                Focused View
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          {/* Preview / Code tabs */}
          <div className="flex items-center rounded-lg border border-border bg-background/80 p-0.5 shadow-2xs">
            <button
              type="button"
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-colors ${
                activeTab === "preview"
                  ? "bg-muted text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("preview")}
            >
              <Eye className="size-3.5" />
              <span>Preview</span>
            </button>

            <button
              type="button"
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-colors ${
                activeTab === "code"
                  ? "bg-muted text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
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
              title="Copy snippet code"
              className="flex size-7 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition shadow-2xs"
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
            title={isFullscreen ? "Exit focus" : "Focus story"}
            className="flex size-7 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition shadow-2xs"
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
  );
}
