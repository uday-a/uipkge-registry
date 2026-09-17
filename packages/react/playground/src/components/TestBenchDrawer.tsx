import React, { useState, useMemo, useEffect } from "react";
import {
  Layers,
  FileCode,
  Package,
  Activity,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  ExternalLink,
  Trash2,
  Sliders,
  Code2,
} from "lucide-react";
import type { PropMeta } from "../lib/extract-props";
import type { TypeDecl } from "../lib/extract-meta";

export interface LoggedEvent {
  id: string;
  timestamp: string;
  type: string;
  target: string;
  detail?: string;
}

export interface TestBenchDrawerProps {
  componentId: string;
  componentName: string;
  componentType: string;
  propsList: PropMeta[];
  typeDecls: TypeDecl[];
  files: Array<{ path: string; target: string; content?: string }>;
  dependencies: string[];
  registryDependencies: string[];
  events: LoggedEvent[];
  isOpen: boolean;
  onToggleOpen: () => void;
  onSelectComponent: (id: string) => void;
  onClearEvents: () => void;
}

type TabKey = "props" | "files" | "manifest" | "events";

export default function TestBenchDrawer({
  componentId,
  componentName,
  componentType,
  propsList,
  typeDecls,
  files,
  dependencies,
  registryDependencies,
  events,
  isOpen,
  onToggleOpen,
  onSelectComponent,
  onClearEvents,
}: TestBenchDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("props");
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);
  const [copiedFile, setCopiedFile] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [copiedManifest, setCopiedManifest] = useState(false);

  // Interactive controls state
  const [interactiveValues, setInteractiveValues] = useState<
    Record<string, any>
  >({});
  const [customSlotText, setCustomSlotText] = useState("Test Action");

  // Reset interactive values when propsList changes
  useEffect(() => {
    const vals: Record<string, any> = {};
    for (const p of propsList) {
      if (p.values && p.values.length > 0) {
        vals[p.name] = p.default ? p.default.replace(/['"]/g, "") : p.values[0];
      } else if (p.type.includes("boolean")) {
        vals[p.name] = p.default === "true";
      } else if (p.name === "label" || p.name === "title") {
        vals[p.name] = p.default
          ? p.default.replace(/['"]/g, "")
          : "Example Label";
      }
    }
    setInteractiveValues(vals);
  }, [propsList]);

  // Generated code snippet
  const generatedSnippet = useMemo(() => {
    const compTag = componentId
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join("");

    const attrs: string[] = [];
    for (const [key, val] of Object.entries(interactiveValues)) {
      if (val === undefined || val === "") continue;
      if (typeof val === "boolean") {
        if (val) attrs.push(key);
      } else {
        attrs.push(`${key}="${val}"`);
      }
    }

    const attrStr = attrs.length ? " " + attrs.join(" ") : "";
    return `<${compTag}${attrStr}>\n  ${customSlotText}\n</${compTag}>`;
  }, [componentId, interactiveValues, customSlotText]);

  const copyGeneratedSnippet = async () => {
    try {
      await navigator.clipboard.writeText(generatedSnippet);
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 1500);
    } catch (err) {
      console.error("Failed to copy snippet:", err);
    }
  };

  const currentFileContent = files[selectedFileIdx]?.content || "";

  const copyCurrentFile = async () => {
    if (!currentFileContent) return;
    try {
      await navigator.clipboard.writeText(currentFileContent);
      setCopiedFile(true);
      setTimeout(() => setCopiedFile(false), 1500);
    } catch (err) {
      console.error("Failed to copy file:", err);
    }
  };

  const copyJsonManifest = async () => {
    const manifest = {
      name: componentId,
      type: componentType,
      dependencies,
      registryDependencies,
      files: files.map((f) => ({ target: f.target })),
    };
    try {
      await navigator.clipboard.writeText(JSON.stringify(manifest, null, 2));
      setCopiedManifest(true);
      setTimeout(() => setCopiedManifest(false), 1500);
    } catch (err) {
      console.error("Failed to copy manifest:", err);
    }
  };

  const parseDepName = (depUrl: string) => {
    return depUrl.replace(/.*\//, "").replace(/\.json$/, "");
  };

  return (
    <div
      className={`flex flex-col border-t border-border bg-card transition-all duration-200 shadow-lg z-30 ${
        isOpen ? "h-80 sm:h-96" : "h-11"
      }`}
    >
      {/* Header Bar */}
      <div
        className="flex h-11 shrink-0 items-center justify-between border-b border-border bg-muted/30 px-4 cursor-pointer select-none"
        onClick={onToggleOpen}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Sliders className="size-4 text-primary" />
            <span className="text-xs font-semibold tracking-tight text-foreground">
              Test Bench & Inspector
            </span>
          </div>

          <div className="h-3 w-px bg-border" />

          {/* Tab buttons */}
          {isOpen && (
            <div
              className="flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                  activeTab === "props"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
                onClick={() => setActiveTab("props")}
              >
                <Layers className="size-3.5" />
                <span>Props & Workbench</span>
                {propsList.length > 0 && (
                  <span className="ml-1 rounded-full bg-muted px-1.5 py-0.2 font-mono text-[10px]">
                    {propsList.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                  activeTab === "files"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
                onClick={() => setActiveTab("files")}
              >
                <FileCode className="size-3.5" />
                <span>Source Files</span>
                <span className="ml-1 rounded-full bg-muted px-1.5 py-0.2 font-mono text-[10px]">
                  {files.length}
                </span>
              </button>

              <button
                type="button"
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                  activeTab === "manifest"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
                onClick={() => setActiveTab("manifest")}
              >
                <Package className="size-3.5" />
                <span>Dependencies</span>
                {dependencies.length + registryDependencies.length > 0 && (
                  <span className="ml-1 rounded-full bg-muted px-1.5 py-0.2 font-mono text-[10px]">
                    {dependencies.length + registryDependencies.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                  activeTab === "events"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
                onClick={() => setActiveTab("events")}
              >
                <Activity className="size-3.5" />
                <span>Action Log</span>
                {events.length > 0 && (
                  <span className="ml-1 rounded-full bg-primary/10 text-primary px-1.5 py-0.2 font-mono text-[10px]">
                    {events.length}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Right Toggle */}
        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition"
            onClick={onToggleOpen}
          >
            <span className="text-[11px]">
              {isOpen ? "Collapse" : "Expand Inspector"}
            </span>
            {isOpen ? (
              <ChevronDown className="size-3.5" />
            ) : (
              <ChevronUp className="size-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Drawer Body */}
      {isOpen && (
        <div className="flex-1 overflow-hidden bg-background">
          {/* 1. Props & Schema Tab */}
          {activeTab === "props" && (
            <div className="h-full overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* Interactive Workbench Control Card */}
              {propsList.some(
                (p) => p.values?.length || p.type.includes("boolean"),
              ) && (
                <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
                  <div className="flex items-center justify-between mb-3 border-b border-border pb-2">
                    <div className="flex items-center gap-2">
                      <Code2 className="size-4 text-primary" />
                      <h4 className="text-xs font-semibold text-foreground tracking-tight">
                        Interactive Props Bench & Code Generator
                      </h4>
                    </div>
                    <button
                      type="button"
                      className="flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1 text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-muted transition shadow-xs"
                      onClick={copyGeneratedSnippet}
                    >
                      {copiedSnippet ? (
                        <Check className="size-3 text-emerald-500" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                      <span>Copy Component JSX</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    {propsList
                      .filter(
                        (p) => p.values?.length || p.type.includes("boolean"),
                      )
                      .map((prop) => (
                        <div key={prop.name} className="space-y-1.5">
                          <label className="text-[11px] font-mono font-medium text-foreground flex items-center justify-between">
                            <span>{prop.name}</span>
                            <span className="text-[10px] text-muted-foreground">
                              {prop.required ? "required" : "optional"}
                            </span>
                          </label>

                          {/* Enum dropdown */}
                          {prop.values && prop.values.length > 0 ? (
                            <select
                              value={interactiveValues[prop.name] || ""}
                              onChange={(e) =>
                                setInteractiveValues((prev) => ({
                                  ...prev,
                                  [prop.name]: e.target.value,
                                }))
                              }
                              className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono shadow-xs"
                            >
                              {prop.values.map((val) => (
                                <option key={val} value={val}>
                                  {val}
                                </option>
                              ))}
                            </select>
                          ) : prop.type.includes("boolean") ? (
                            <div className="flex items-center gap-2 pt-1">
                              <input
                                id={`toggle-${prop.name}`}
                                type="checkbox"
                                checked={!!interactiveValues[prop.name]}
                                onChange={(e) =>
                                  setInteractiveValues((prev) => ({
                                    ...prev,
                                    [prop.name]: e.target.checked,
                                  }))
                                }
                                className="size-4 rounded border-border text-primary focus:ring-primary"
                              />
                              <label
                                htmlFor={`toggle-${prop.name}`}
                                className="text-xs text-muted-foreground cursor-pointer select-none"
                              >
                                {interactiveValues[prop.name]
                                  ? "Enabled"
                                  : "Disabled"}
                              </label>
                            </div>
                          ) : null}
                        </div>
                      ))}

                    {/* Custom Slot Text */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono font-medium text-foreground">
                        Slot Children / Text
                      </label>
                      <input
                        type="text"
                        value={customSlotText}
                        onChange={(e) => setCustomSlotText(e.target.value)}
                        placeholder="Button label..."
                        className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Generated Code Preview */}
                  <pre className="code-block rounded-lg border border-border bg-muted/30 p-3 text-[11px] font-mono text-foreground overflow-x-auto leading-relaxed">
                    <code>{generatedSnippet}</code>
                  </pre>
                </div>
              )}

              {/* Props Specification Table */}
              {propsList.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-semibold text-foreground tracking-tight">
                      Component Props & Slots Specification
                    </h4>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {propsList.length} declared properties
                    </span>
                  </div>

                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground">
                        <th className="pb-2 font-medium font-mono">Prop</th>
                        <th className="pb-2 font-medium font-mono">Type</th>
                        <th className="pb-2 font-medium font-mono">Default</th>
                        <th className="pb-2 font-medium font-mono">Required</th>
                        <th className="pb-2 font-medium">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {propsList.map((prop) => (
                        <tr key={prop.name} className="hover:bg-muted/20">
                          <td className="py-2.5 font-mono font-medium text-foreground pr-3">
                            {prop.name}
                          </td>
                          <td className="py-2.5 pr-3 font-mono text-muted-foreground">
                            <span className="rounded bg-muted px-1.5 py-0.5 text-[11px]">
                              {prop.type}
                            </span>
                          </td>
                          <td className="py-2.5 pr-3 font-mono text-muted-foreground">
                            {prop.default ? (
                              <span className="text-foreground/80 font-medium">
                                {prop.default}
                              </span>
                            ) : (
                              <span className="text-muted-foreground/40">
                                —
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 pr-3 font-mono text-xs">
                            {prop.required ? (
                              <span className="text-rose-500 font-semibold">
                                Yes
                              </span>
                            ) : (
                              <span className="text-muted-foreground">No</span>
                            )}
                          </td>
                          <td className="py-2.5 text-muted-foreground leading-relaxed">
                            {prop.doc || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-muted-foreground">
                  <p>No declared props extracted for this component.</p>
                  <p className="mt-1 text-[11px]">
                    This component may forward props directly to headless slots
                    or children.
                  </p>
                </div>
              )}

              {/* Exported Types / Schemas */}
              {typeDecls.length > 0 && (
                <div className="border-t border-border pt-4">
                  <h4 className="text-xs font-semibold text-foreground mb-3">
                    Exported Types & Schemas
                  </h4>
                  <div className="space-y-3">
                    {typeDecls.map((decl) => (
                      <div
                        key={decl.name}
                        className="rounded-lg border border-border bg-card p-3"
                      >
                        <div className="text-xs font-mono font-bold text-foreground mb-1.5">
                          {decl.name}
                        </div>
                        <pre className="code-block text-[11px] text-muted-foreground font-mono overflow-x-auto">
                          <code>{decl.body}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. Source Files Tab */}
          {activeTab === "files" && (
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-border bg-muted/20 px-4 py-2">
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {files.map((f, idx) => (
                    <button
                      key={f.path}
                      type="button"
                      className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-mono transition ${
                        selectedFileIdx === idx
                          ? "bg-card border border-border text-foreground shadow-xs font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                      onClick={() => setSelectedFileIdx(idx)}
                    >
                      <FileCode className="size-3" />
                      <span>{f.path.split("/").pop()}</span>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition shadow-xs"
                  onClick={copyCurrentFile}
                >
                  {copiedFile ? (
                    <Check className="size-3 text-emerald-500" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                  <span>Copy file</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 bg-muted/10">
                <pre className="code-block rounded-lg border border-border bg-card p-4 text-xs font-mono text-foreground overflow-x-auto leading-relaxed">
                  <code>{currentFileContent || "// Content loading..."}</code>
                </pre>
              </div>
            </div>
          )}

          {/* 3. Manifest & Dependencies Tab */}
          {activeTab === "manifest" && (
            <div className="h-full overflow-y-auto p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-5">
                  <div>
                    <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-2">
                      <span>NPM Dependencies</span>
                      <span className="rounded bg-muted px-1.5 py-0.2 font-mono text-[10px]">
                        {dependencies.length}
                      </span>
                    </h4>
                    {dependencies.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {dependencies.map((dep) => (
                          <span
                            key={dep}
                            className="rounded-md border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                          >
                            {dep}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        No third-party npm packages required.
                      </p>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-2">
                      <span>Registry Dependencies</span>
                      <span className="rounded bg-muted px-1.5 py-0.2 font-mono text-[10px]">
                        {registryDependencies.length}
                      </span>
                    </h4>
                    {registryDependencies.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {registryDependencies.map((dep) => (
                          <button
                            key={dep}
                            type="button"
                            className="flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 font-mono text-xs text-foreground hover:bg-muted transition"
                            onClick={() => onSelectComponent(parseDepName(dep))}
                          >
                            <span>@uipkge/{parseDepName(dep)}</span>
                            <ExternalLink className="size-2.5 opacity-60" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        No internal registry dependencies.
                      </p>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-foreground mb-2">
                      Target Installation Paths
                    </h4>
                    <div className="space-y-1">
                      {files.map((f) => (
                        <div
                          key={f.target}
                          className="rounded border border-border/80 bg-muted/20 px-2.5 py-1.5 font-mono text-xs text-muted-foreground"
                        >
                          {f.target}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-foreground">
                      Registry Item Manifest
                    </h4>
                    <button
                      type="button"
                      className="flex items-center gap-1 rounded-md border border-border bg-card px-2 py-0.5 text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted transition shadow-xs"
                      onClick={copyJsonManifest}
                    >
                      {copiedManifest ? (
                        <Check className="size-3 text-emerald-500" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                      <span>Copy JSON</span>
                    </button>
                  </div>
                  <pre className="code-block rounded-lg border border-border bg-card p-3 text-[11px] font-mono text-foreground overflow-x-auto leading-relaxed">
                    <code>
                      {JSON.stringify(
                        {
                          name: componentId,
                          type: componentType,
                          dependencies,
                          registryDependencies,
                          files: files.map((f) => ({
                            path: f.path,
                            target: f.target,
                          })),
                        },
                        null,
                        2,
                      )}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* 4. Action & Event Logger Tab */}
          {activeTab === "events" && (
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-border bg-muted/20 px-4 py-2">
                <div className="text-xs text-muted-foreground">
                  Capturing user interactions dispatched from the live component
                  canvas.
                </div>
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition shadow-xs"
                  onClick={onClearEvents}
                >
                  <Trash2 className="size-3" />
                  <span>Clear Events</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-1.5 font-mono text-xs">
                {events.map((ev) => (
                  <div
                    key={ev.id}
                    className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-1.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-muted-foreground text-[11px]">
                        {ev.timestamp}
                      </span>
                      <span className="rounded bg-primary/10 px-1.5 py-0.5 font-bold text-primary text-[10px] uppercase">
                        {ev.type}
                      </span>
                      <span className="text-foreground">{ev.target}</span>
                    </div>
                    {ev.detail && (
                      <div className="text-muted-foreground text-[11px] truncate max-w-xs">
                        {ev.detail}
                      </div>
                    )}
                  </div>
                ))}

                {events.length === 0 && (
                  <div className="py-12 text-center text-muted-foreground font-sans text-xs">
                    No events logged yet. Interact with the component above
                    (click, type, toggle) to see actions stream here!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
