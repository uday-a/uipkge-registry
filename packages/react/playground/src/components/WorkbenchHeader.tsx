import React, { useState } from "react";
import {
  ExternalLink,
  Copy,
  Check,
  RotateCcw,
  Palette,
  Sun,
  Moon,
  SlidersHorizontal,
  CircleDot,
  Grid,
  Square,
  Maximize,
  Monitor,
  Laptop,
  Tablet,
  Smartphone,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import {
  COLOR_THEMES,
  RADIUS_PRESETS,
  VIEWPORT_PRESETS,
  type CanvasBackground,
} from "../theme";

export interface WorkbenchHeaderProps {
  componentId: string;
  componentName: string;
  componentType: string;
  category?: string;
  isDark: boolean;
  onToggleDark: () => void;
  activeColorTheme: string;
  onChangeColorTheme: (id: string) => void;
  activeRadius: string;
  onChangeRadius: (val: string) => void;
  activeViewport: string;
  onChangeViewport: (id: string) => void;
  canvasBg: CanvasBackground;
  onChangeCanvasBg: (bg: CanvasBackground) => void;
  onRemount: () => void;
  isInspectorOpen: boolean;
  onToggleInspector: () => void;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

const VIEWPORT_LABELS: Record<string, { title: string; short: string }> = {
  fluid: { title: "Fluid (100%)", short: "Full" },
  desktop: { title: "Desktop (1280px)", short: "1280" },
  laptop: { title: "Laptop (1024px)", short: "1024" },
  tablet: { title: "Tablet (768px)", short: "768" },
  mobile: { title: "Mobile (375px)", short: "375" },
};

export default function WorkbenchHeader({
  componentId,
  componentName,
  componentType,
  category,
  isDark,
  onToggleDark,
  activeColorTheme,
  onChangeColorTheme,
  activeRadius,
  onChangeRadius,
  activeViewport,
  onChangeViewport,
  canvasBg,
  onChangeCanvasBg,
  onRemount,
  isInspectorOpen,
  onToggleInspector,
  isSidebarOpen = true,
  onToggleSidebar,
}: WorkbenchHeaderProps) {
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [showThemePopover, setShowThemePopover] = useState(false);

  const copyInstallCommand = async () => {
    const cmd = `npx shadcn add @uipkge/${componentId}`;
    try {
      await navigator.clipboard.writeText(cmd);
      setCopiedCmd(true);
      setTimeout(() => setCopiedCmd(false), 1500);
    } catch (err) {
      console.error("Failed to copy install command:", err);
    }
  };

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-3 sm:px-4 select-none z-20 gap-2 sm:gap-4">
      {/* Left: Brand & Component Info */}
      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
        {/* Toggle sidebar button (only when sidebar is closed) */}
        {!isSidebarOpen && (
          <button
            type="button"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition shadow-2xs cursor-pointer"
            onClick={onToggleSidebar}
            title="Show sidebar (⌘B)"
          >
            <PanelLeft className="size-4 shrink-0" />
          </button>
        )}

        {/* UIPKGE brand icon (only when sidebar is closed) */}
        {!isSidebarOpen && (
          <div
            className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card shadow-xs select-none"
            title="UIPKGE Dev Workbench"
          >
            <svg width="22" height="22" viewBox="0 0 32 32" className="shrink-0" aria-hidden="true">
              <rect x="0.5" y="0.5" width="31" height="31" rx="7" className="fill-card stroke-border" strokeWidth="1" />
              <rect x="6" y="6" width="8" height="8" rx="1.6" className="fill-foreground" />
              <rect x="18" y="6" width="8" height="8" rx="1.6" className="fill-primary" />
              <rect x="6" y="18" width="8" height="8" rx="1.6" className="fill-muted" />
              <rect x="18" y="18" width="8" height="8" rx="1.6" className="fill-foreground" />
            </svg>
          </div>
        )}

        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-center gap-1 shrink-0">
            <span className="inline-flex items-center h-7 px-2 rounded-md border border-border bg-muted/40 font-mono text-xs font-semibold text-foreground whitespace-nowrap shrink-0 shadow-2xs">
              React 19
            </span>
            <a
              href={`http://localhost:5173?c=${componentId}`}
              target="_blank"
              rel="noreferrer"
              title="Open Vue 3.5 Playground on :5173"
              className="hidden sm:inline-flex items-center h-7 px-2 rounded-md border border-border bg-muted/40 font-mono text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition whitespace-nowrap shrink-0"
            >
              <span>Vue 3.5</span>
              <ExternalLink className="size-2.5 ml-1" />
            </a>
          </div>
        </div>

        <div className="hidden sm:block h-4 w-px bg-border shrink-0" />

        <div className="flex items-center gap-1.5 min-w-0 shrink">
          <span className="text-xs sm:text-sm font-semibold text-foreground tracking-tight truncate whitespace-nowrap shrink min-w-0 max-w-[140px] md:max-w-[200px]">
            {componentName}
          </span>
          {category && (
            <span className="hidden xl:inline-block rounded-md border border-border px-2 py-0.5 text-xs font-mono text-muted-foreground whitespace-nowrap shrink-0">
              {category}
            </span>
          )}
        </div>

        {/* Install Command: Full on wide screens, compact icon on smaller */}
        <button
          type="button"
          title="Copy install command"
          className="hidden min-[1400px]:flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 h-8 text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-muted transition shadow-xs whitespace-nowrap shrink-0 cursor-pointer"
          onClick={copyInstallCommand}
        >
          {copiedCmd ? (
            <Check className="size-3 text-emerald-500 shrink-0" />
          ) : (
            <Copy className="size-3 shrink-0" />
          )}
          <span className="whitespace-nowrap max-w-[180px] truncate">add @uipkge/{componentId}</span>
        </button>
        <button
          type="button"
          title={`Copy install command: add @uipkge/${componentId}`}
          className="flex min-[1400px]:hidden size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition shadow-xs cursor-pointer"
          onClick={copyInstallCommand}
        >
          {copiedCmd ? (
            <Check className="size-3.5 text-emerald-500 shrink-0" />
          ) : (
            <Copy className="size-3.5 shrink-0" />
          )}
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Viewport switcher (Visible on lg+) */}
        <div className="hidden lg:flex items-center rounded-lg border border-border bg-muted/40 p-0.5 shadow-xs shrink-0">
          {VIEWPORT_PRESETS.map((vp) => (
            <button
              key={vp.id}
              type="button"
              title={VIEWPORT_LABELS[vp.id]?.title || vp.name}
              className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition whitespace-nowrap shrink-0 cursor-pointer ${
                activeViewport === vp.id
                  ? "bg-background text-foreground shadow-xs font-semibold border border-border/80"
                  : "text-muted-foreground hover:text-foreground border border-transparent"
              }`}
              onClick={() => onChangeViewport(vp.id)}
            >
              {vp.id === "fluid" && <Maximize className="size-3.5 shrink-0" />}
              {vp.id === "desktop" && <Monitor className="size-3.5 shrink-0" />}
              {vp.id === "laptop" && <Laptop className="size-3.5 shrink-0" />}
              {vp.id === "tablet" && <Tablet className="size-3.5 shrink-0" />}
              {vp.id === "mobile" && <Smartphone className="size-3.5 shrink-0" />}
              <span className="hidden min-[1600px]:inline">{VIEWPORT_LABELS[vp.id]?.short || vp.name}</span>
            </button>
          ))}
        </div>

        {/* Canvas background switcher */}
        <div className="hidden lg:flex items-center rounded-lg border border-border bg-muted/40 p-0.5 shadow-xs shrink-0">
          <button
            type="button"
            title="Dots canvas background"
            className={`flex size-7 shrink-0 items-center justify-center rounded-md transition-colors cursor-pointer ${
              canvasBg === "dots"
                ? "bg-background text-foreground shadow-xs border border-border/80"
                : "text-muted-foreground hover:text-foreground border border-transparent"
            }`}
            onClick={() => onChangeCanvasBg("dots")}
          >
            <CircleDot className="size-3.5 shrink-0" />
          </button>
          <button
            type="button"
            title="Grid canvas background"
            className={`flex size-7 shrink-0 items-center justify-center rounded-md transition-colors cursor-pointer ${
              canvasBg === "grid"
                ? "bg-background text-foreground shadow-xs border border-border/80"
                : "text-muted-foreground hover:text-foreground border border-transparent"
            }`}
            onClick={() => onChangeCanvasBg("grid")}
          >
            <Grid className="size-3.5 shrink-0" />
          </button>
          <button
            type="button"
            title="Solid canvas background"
            className={`flex size-7 shrink-0 items-center justify-center rounded-md transition-colors cursor-pointer ${
              canvasBg === "solid"
                ? "bg-background text-foreground shadow-xs border border-border/80"
                : "text-muted-foreground hover:text-foreground border border-transparent"
            }`}
            onClick={() => onChangeCanvasBg("solid")}
          >
            <Square className="size-3.5 shrink-0" />
          </button>
        </div>

        {/* Remount component button */}
        <button
          type="button"
          title="Remount component"
          className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted active:rotate-180 transition-all duration-300 shadow-xs cursor-pointer"
          onClick={onRemount}
        >
          <RotateCcw className="size-3.5 shrink-0" />
        </button>

        {/* Theme Customizer Trigger */}
        <div className="relative shrink-0">
          <button
            type="button"
            title="Customize Theme & Radius"
            className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition shadow-xs cursor-pointer"
            onClick={() => setShowThemePopover(!showThemePopover)}
          >
            <Palette className="size-3.5 shrink-0" />
          </button>

          {/* Click outside backdrop */}
          {showThemePopover && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowThemePopover(false)}
            />
          )}

          {/* Theme Customizer Popover */}
          {showThemePopover && (
            <div className="absolute right-0 top-11 w-80 rounded-[14px] border border-border bg-popover/95 text-popover-foreground p-4 shadow-2xl backdrop-blur-md z-50 animate-in fade-in-0 zoom-in-95 duration-150">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border pb-3 mb-3.5">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-[8px] border border-border bg-muted/50 text-foreground shadow-2xs">
                    <Palette className="size-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-semibold text-foreground tracking-tight">
                        Theme Customizer
                      </h4>
                      <span className="rounded-[4px] bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground uppercase">
                        OKLCH
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Tokens & preview settings</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onChangeColorTheme("default");
                    onChangeRadius("0.5rem");
                  }}
                  title="Reset to default theme & radius"
                  className="flex shrink-0 items-center gap-1 rounded-[6px] px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer border border-transparent hover:border-border/60"
                >
                  <RotateCcw className="size-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Appearance / Color Mode */}
              <div className="space-y-1.5 mb-3.5">
                <label className="text-xs font-medium text-muted-foreground">Appearance</label>
                <div className="grid grid-cols-2 gap-1 rounded-[8px] border border-border/60 bg-muted/40 p-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (isDark) onToggleDark();
                    }}
                    className={`flex items-center justify-center gap-2 rounded-[6px] py-1.5 text-xs font-medium transition cursor-pointer ${
                      !isDark
                        ? "bg-background text-foreground shadow-xs border border-border/80 font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Sun className="size-3.5" />
                    <span>Light</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!isDark) onToggleDark();
                    }}
                    className={`flex items-center justify-center gap-2 rounded-[6px] py-1.5 text-xs font-medium transition cursor-pointer ${
                      isDark
                        ? "bg-background text-foreground shadow-xs border border-border/80 font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Moon className="size-3.5" />
                    <span>Dark</span>
                  </button>
                </div>
              </div>

              {/* Accent Color */}
              <div className="space-y-1.5 mb-3.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-muted-foreground">Accent Color</label>
                  <span className="text-[11px] font-mono text-muted-foreground capitalize flex items-center gap-1.5">
                    <span
                      className="size-2 rounded-full border border-black/10 dark:border-white/20"
                      style={{
                        backgroundColor:
                          activeColorTheme === "default"
                            ? isDark
                              ? "#fafafa"
                              : "#18181b"
                            : COLOR_THEMES.find((t) => t.id === activeColorTheme)?.swatch || "#18181b",
                      }}
                    />
                    {COLOR_THEMES.find((t) => t.id === activeColorTheme)?.name || "Neutral"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {COLOR_THEMES.map((theme) => {
                    const isSelected = activeColorTheme === theme.id;
                    const swatchBg =
                      theme.id === "default"
                        ? isDark
                          ? "#fafafa"
                          : "#18181b"
                        : theme.swatch;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => onChangeColorTheme(theme.id)}
                        title={theme.name}
                        className={`group flex items-center gap-2 rounded-[6px] border px-2 py-1.5 text-xs font-medium transition cursor-pointer ${
                          isSelected
                            ? "border-primary bg-primary/10 text-foreground font-semibold shadow-2xs"
                            : "border-border/50 bg-background/60 text-muted-foreground hover:border-border hover:bg-muted/60 hover:text-foreground"
                        }`}
                      >
                        <span
                          className="relative size-3.5 shrink-0 rounded-full border border-black/10 dark:border-white/20 shadow-2xs transition-transform group-hover:scale-110 flex items-center justify-center"
                          style={{ backgroundColor: swatchBg }}
                        >
                          {isSelected && (
                            <Check
                              className={`size-2 stroke-[3] ${
                                theme.id === "default"
                                  ? isDark
                                    ? "text-black"
                                    : "text-white"
                                  : theme.id === "amber" || theme.id === "cyan"
                                  ? "text-black"
                                  : "text-white"
                              }`}
                            />
                          )}
                        </span>
                        <span className="truncate">{theme.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Border Radius */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-muted-foreground">Border Radius</label>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {RADIUS_PRESETS.find((r) => r.value === activeRadius)?.name || activeRadius}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1 rounded-[8px] border border-border/60 bg-muted/40 p-1">
                  {RADIUS_PRESETS.map((r) => {
                    const isSelected = activeRadius === r.value;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => onChangeRadius(r.value)}
                        title={r.name}
                        className={`flex items-center justify-center rounded-[6px] py-1.5 text-xs font-mono transition cursor-pointer ${
                          isSelected
                            ? "bg-background text-foreground font-semibold shadow-xs border border-border/80"
                            : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                        }`}
                      >
                        {r.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dark/Light mode toggle */}
        <button
          type="button"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition shadow-xs cursor-pointer"
          onClick={onToggleDark}
        >
          {isDark ? (
            <Sun className="size-4 shrink-0" />
          ) : (
            <Moon className="size-4 shrink-0" />
          )}
        </button>

        <div className="h-4 w-px bg-border shrink-0" />

        {/* Test Bench Drawer Toggle */}
        <button
          type="button"
          title="Toggle Test Bench & Inspector"
          className={`flex items-center gap-1.5 rounded-md px-2.5 h-8 text-xs font-medium transition shadow-xs border whitespace-nowrap shrink-0 cursor-pointer ${
            isInspectorOpen
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
          onClick={onToggleInspector}
        >
          <SlidersHorizontal className="size-3.5 shrink-0" />
          <span className="hidden md:inline whitespace-nowrap">Test Bench</span>
        </button>
      </div>
    </header>
  );
}
