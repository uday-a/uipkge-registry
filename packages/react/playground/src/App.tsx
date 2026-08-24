import React, { useState, useEffect, useRef, useMemo } from "react";
import WorkbenchHeader from "./components/WorkbenchHeader";
import WorkbenchSidebar, {
  type SidebarItem,
} from "./components/WorkbenchSidebar";
import TestBenchDrawer, {
  type LoggedEvent,
} from "./components/TestBenchDrawer";
import { StoryCodeContext } from "./StoryContext";
import { extractProps, type PropMeta } from "./lib/extract-props";
import { extractTypeDecls, type TypeDecl } from "./lib/extract-meta";
import { extractStories } from "./lib/extract-stories";
import {
  COLOR_THEMES,
  RADIUS_PRESETS,
  VIEWPORT_PRESETS,
  type CanvasBackground,
} from "./theme";
import registryManifest from "../../registry.json";

// Vite globs for React demos and raw source
const demoModules = import.meta.glob("../../demos/*.tsx");
const demoRawModules = import.meta.glob("../../demos/*.tsx", {
  query: "?raw",
  import: "default",
});

const manifestMap = new Map(
  (registryManifest.items as any[]).map((it) => [it.name, it]),
);

// Build catalog items from demos and enrich with registry.json
const demoKeys = Object.keys(demoModules);
const items: SidebarItem[] = demoKeys
  .map((p) => {
    const filename = p.split("/").pop()?.replace(".tsx", "") || "";
    const meta = manifestMap.get(filename);
    let category = "UI";
    if (
      filename.includes("chart") ||
      meta?.categories?.includes("chart") ||
      meta?.categories?.includes("data-visualization")
    ) {
      category = "Charts";
    } else if (meta?.categories?.[0]) {
      category =
        meta.categories[0].charAt(0).toUpperCase() +
        meta.categories[0].slice(1);
    }

    return {
      id: filename,
      name: filename
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      type: (meta?.type || "registry:ui") as any,
      category,
      categories: meta?.categories || [],
    };
  })
  .filter(
    (item) =>
      item.type !== "registry:block" &&
      item.category !== "Blocks" &&
      !item.id.includes("dashboard-") &&
      !item.id.includes("block-"),
  )
  .sort((a, b) => a.name.localeCompare(b.name));

export default function App() {
  const [selectedId, setSelectedId] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const param = params.get("c") || params.get("component");
      if (param && items.some((it) => it.id === param)) {
        return param;
      }
    }
    return items.some((it) => it.id === "button") ? "button" : items[0]?.id || "";
  });
  const [ActiveComponent, setActiveComponent] =
    useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(false);
  const [remountKey, setRemountKey] = useState(0);
  const previewContainerRef = useRef<HTMLDivElement | null>(null);

  // Theme & Canvas state
  const [isDark, setIsDark] = useState(false);
  const [activeColorTheme, setActiveColorTheme] = useState("default");
  const [activeRadius, setActiveRadius] = useState("0.5rem");
  const [activeViewport, setActiveViewport] = useState("fluid");
  const [canvasBg, setCanvasBg] = useState<CanvasBackground>("dots");
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Component Metadata
  const [currentMeta, setCurrentMeta] = useState<{
    type: string;
    description?: string;
    categories: string[];
    dependencies: string[];
    registryDependencies: string[];
    files: Array<{ path: string; target: string; content?: string }>;
  }>({
    type: "registry:ui",
    categories: [],
    dependencies: [],
    registryDependencies: [],
    files: [],
  });

  // Props & Types
  const [propsList, setPropsList] = useState<PropMeta[]>([]);
  const [typeDecls, setTypeDecls] = useState<TypeDecl[]>([]);
  const [storyCodeMap, setStoryCodeMap] = useState<Record<string, string>>({});

  // Event Logger
  const [loggedEvents, setLoggedEvents] = useState<LoggedEvent[]>([]);

  const logEvent = (ev: Event) => {
    const target = ev.target as HTMLElement | null;
    const tagName = target?.tagName?.toLowerCase() || "unknown";
    const slot = target?.getAttribute("data-slot") || "";
    const targetDesc = slot ? `${tagName}[data-slot=${slot}]` : tagName;

    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const now = new Date();
    const timestamp = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}.${now
      .getMilliseconds()
      .toString()
      .padStart(3, "0")}`;

    let detail: string | undefined;
    if (ev.type === "input" || ev.type === "change") {
      const val = (target as HTMLInputElement)?.value;
      if (val !== undefined) detail = `value: "${val}"`;
    }

    setLoggedEvents((prev) => [
      {
        id,
        timestamp,
        type: ev.type,
        target: targetDesc,
        detail,
      },
      ...prev.slice(0, 49),
    ]);
  };

  useEffect(() => {
    const el = previewContainerRef.current;
    if (!el) return;
    const opts = { capture: true, passive: true };
    el.addEventListener("click", logEvent, opts);
    el.addEventListener("input", logEvent, opts);
    el.addEventListener("change", logEvent, opts);
    el.addEventListener("submit", logEvent, opts);

    return () => {
      el.removeEventListener("click", logEvent, opts);
      el.removeEventListener("input", logEvent, opts);
      el.removeEventListener("change", logEvent, opts);
      el.removeEventListener("submit", logEvent, opts);
    };
  }, [remountKey, ActiveComponent]);

  // Sync selectedId to URL query param (?c=<id>)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (url.searchParams.get("c") !== selectedId) {
        url.searchParams.set("c", selectedId);
        url.searchParams.delete("component");
        window.history.replaceState({ component: selectedId }, "", url.toString());
      }
    }
  }, [selectedId]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window === "undefined") return;
      const params = new URLSearchParams(window.location.search);
      const param = params.get("c") || params.get("component");
      if (param && items.some((it) => it.id === param)) {
        setSelectedId(param);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Load Component
  useEffect(() => {
    let isCancelled = false;

    const loadComponent = async (id: string) => {
      setLoading(true);
      const demoPath = `../../demos/${id}.tsx`;
      const compLoader = demoModules[demoPath];

      if (compLoader) {
        try {
          const mod: any = await compLoader();
          if (!isCancelled) {
            setActiveComponent(() => mod.default);
          }
        } catch (err) {
          console.error(`Failed to load component ${id}:`, err);
        }
      }

      // Load raw demo source for story snippets
      const rawLoader = demoRawModules[demoPath];
      if (rawLoader) {
        try {
          const rawCode: any = await rawLoader();
          if (typeof rawCode === "string" && !isCancelled) {
            setStoryCodeMap(extractStories(rawCode));
          }
        } catch (err) {
          console.error("Failed to load raw demo source:", err);
        }
      }

      // Pre-populate from manifestMap immediately
      const localMeta = manifestMap.get(id);
      if (localMeta && !isCancelled) {
        setCurrentMeta({
          type: localMeta.type || "registry:ui",
          description: localMeta.description,
          categories: localMeta.categories || [],
          dependencies: localMeta.dependencies || [],
          registryDependencies: localMeta.registryDependencies || [],
          files: localMeta.files || [],
        });

        const mainTsx = localMeta.files?.find(
          (f: any) => f.path?.endsWith(".tsx") || f.path?.endsWith(".ts"),
        );
        const variantFile = localMeta.files?.find((f: any) =>
          f.path?.includes(".variants."),
        );
        if (mainTsx && mainTsx.content) {
          setPropsList(
            extractProps(mainTsx.content, variantFile?.content).props,
          );
        }
        if (localMeta.files?.length) {
          setTypeDecls(extractTypeDecls(localMeta.files));
        }
      }

      // Refine from item JSON manifest if available
      try {
        const res = await fetch(`/r/react/${id}.json`);
        if (res.ok && !isCancelled) {
          const json = await res.json();
          setCurrentMeta({
            type: json.type || "registry:ui",
            description: json.description,
            categories: json.categories || [],
            dependencies: json.dependencies || [],
            registryDependencies: json.registryDependencies || [],
            files: json.files || [],
          });

          const mainTsxFile = json.files?.find(
            (f: any) => f.path.endsWith(".tsx") || f.path.endsWith(".ts"),
          );
          const varFile = json.files?.find((f: any) =>
            f.path.includes(".variants."),
          );
          if (mainTsxFile && mainTsxFile.content) {
            setPropsList(
              extractProps(mainTsxFile.content, varFile?.content).props,
            );
          }
          if (json.files?.length) {
            setTypeDecls(extractTypeDecls(json.files));
          }
        }
      } catch (err) {
        // Fallback already provided by localMeta
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    loadComponent(selectedId);

    return () => {
      isCancelled = true;
    };
  }, [selectedId, remountKey]);

  // Sync dark class on document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // Sync color theme on document element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", activeColorTheme);
  }, [activeColorTheme]);

  // Sync radius on document element
  useEffect(() => {
    document.documentElement.style.setProperty("--radius", activeRadius);
  }, [activeRadius]);

  // Global hotkeys: ⌘B / Ctrl+B for sidebar, ⌘J / Ctrl+J for inspector
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      if (modKey && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setIsSidebarOpen((prev) => !prev);
      }
      if (modKey && e.key.toLowerCase() === "j") {
        e.preventDefault();
        setIsInspectorOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const selectedItemName = useMemo(() => {
    const item = items.find((i) => i.id === selectedId);
    return item ? item.name : selectedId;
  }, [selectedId]);

  const viewportStyle = useMemo(() => {
    const vp = VIEWPORT_PRESETS.find((v) => v.id === activeViewport);
    if (!vp || vp.width === "100%") return { width: "100%" };
    return {
      width: vp.width,
      maxWidth: "100%",
      margin: "0 auto",
      transition: "width 200ms ease-out",
    };
  }, [activeViewport]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground font-sans antialiased">
      {/* Sidebar Catalog */}
      <WorkbenchSidebar
        items={items}
        selectedId={selectedId}
        collapsed={!isSidebarOpen}
        onSelect={(id) => setSelectedId(id)}
      />

      {/* Main Workbench Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header Controls */}
        <WorkbenchHeader
          componentId={selectedId}
          componentName={selectedItemName}
          componentType={currentMeta.type}
          category={currentMeta.categories[0]}
          isDark={isDark}
          onToggleDark={() => setIsDark(!isDark)}
          activeColorTheme={activeColorTheme}
          onChangeColorTheme={(theme) => setActiveColorTheme(theme)}
          activeRadius={activeRadius}
          onChangeRadius={(radius) => setActiveRadius(radius)}
          activeViewport={activeViewport}
          onChangeViewport={(vp) => setActiveViewport(vp)}
          canvasBg={canvasBg}
          onChangeCanvasBg={(bg) => setCanvasBg(bg)}
          onRemount={() => setRemountKey((k) => k + 1)}
          isInspectorOpen={isInspectorOpen}
          onToggleInspector={() => setIsInspectorOpen(!isInspectorOpen)}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Canvas Preview Area */}
        <main
          className={`relative flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10 ${
            canvasBg === "dots"
              ? "canvas-dots"
              : canvasBg === "grid"
                ? "canvas-grid"
                : "canvas-solid"
          }`}
        >
          <div
            ref={previewContainerRef}
            style={viewportStyle}
            className={`transition-all duration-200 ${
              activeViewport !== "fluid"
                ? "rounded-2xl border border-border/80 bg-background/95 p-4 sm:p-6 shadow-2xl backdrop-blur-xs ring-1 ring-black/5 dark:ring-white/10 my-4"
                : "max-w-7xl mx-auto"
            }`}
          >
            {/* Viewport Frame Header badge if simulated */}
            {activeViewport !== "fluid" && (
              <div className="mb-4 flex items-center justify-between border-b border-border/60 pb-2.5 text-xs font-mono text-muted-foreground">
                <div className="flex items-center gap-1.5 font-medium text-foreground">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="uppercase tracking-wider">
                    {
                      VIEWPORT_PRESETS.find((v) => v.id === activeViewport)
                        ?.label
                    }{" "}
                    VIEWPORT
                  </span>
                </div>
                <span>
                  {VIEWPORT_PRESETS.find((v) => v.id === activeViewport)?.width}{" "}
                  &times; auto
                </span>
              </div>
            )}

            {/* Dynamic React Demo Component wrapped in StoryCodeContext */}
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground font-mono">
                  <div className="size-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  <span>Loading {selectedItemName}...</span>
                </div>
              </div>
            ) : ActiveComponent ? (
              <StoryCodeContext.Provider value={storyCodeMap}>
                <ActiveComponent key={`${selectedId}-${remountKey}`} />
              </StoryCodeContext.Provider>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-border text-center text-xs text-muted-foreground">
                No demo component found for &quot;{selectedId}&quot;.
              </div>
            )}
          </div>
        </main>

        {/* Bottom Test Bench Drawer */}
        <TestBenchDrawer
          componentId={selectedId}
          componentName={selectedItemName}
          componentType={currentMeta.type}
          propsList={propsList}
          typeDecls={typeDecls}
          files={currentMeta.files}
          dependencies={currentMeta.dependencies}
          registryDependencies={currentMeta.registryDependencies}
          events={loggedEvents}
          isOpen={isInspectorOpen}
          onToggleOpen={() => setIsInspectorOpen(!isInspectorOpen)}
          onSelectComponent={(id) => setSelectedId(id)}
          onClearEvents={() => setLoggedEvents([])}
        />
      </div>
    </div>
  );
}
