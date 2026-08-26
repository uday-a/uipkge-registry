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
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-3 sm:px-4 select-none z-20 gap-2 sm:gap-4 overflow-hidden">
      {/* Left: Brand & Component Info */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 min-w-0">
        {/* Toggle sidebar button */}
        <button
          type="button"
          className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition shadow-2xs cursor-pointer"
          onClick={onToggleSidebar}
          title={isSidebarOpen ? "Hide sidebar (⌘B)" : "Show sidebar (⌘B)"}
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="size-4 shrink-0" />
          ) : (
            <PanelLeft className="size-4 shrink-0" />
          )}
        </button>

        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-foreground text-background font-mono font-bold text-xs shadow-xs select-none">
            UI
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span className="inline-flex items-center h-7 px-2 rounded-md border border-border bg-muted/40 text-xs font-mono font-medium text-foreground whitespace-nowrap shrink-0">
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
          <span className="text-xs sm:text-sm font-semibold text-foreground tracking-tight truncate whitespace-nowrap shrink min-w-0 max-w-[110px] md:max-w-[160px] 2xl:max-w-xs">
            {componentName}
          </span>
          {category && (
            <span className="hidden 2xl:inline-block rounded-md border border-border px-2 py-0.5 text-xs font-mono text-muted-foreground whitespace-nowrap shrink-0">
              {category}
            </span>
          )}
        </div>

        {/* Install Command: Full on 2xl+, compact icon on smaller */}
        <button
          type="button"
          title="Click to copy install command"
          className="hidden 2xl:flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 h-8 text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-muted transition shadow-xs whitespace-nowrap shrink-0 cursor-pointer"
          onClick={copyInstallCommand}
        >
          {copiedCmd ? (
            <Check className="size-3 text-emerald-500 shrink-0" />
          ) : (
            <Copy className="size-3 shrink-0" />
          )}
          <span className="whitespace-nowrap">add @uipkge/{componentId}</span>
        </button>
        <button
          type="button"
          title={`Copy add @uipkge/${componentId}`}
          className="flex 2xl:hidden size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition shadow-xs cursor-pointer"
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
        {/* Viewport switcher (Visible on xl+) */}
        <div className="hidden xl:flex items-center rounded-lg border border-border bg-muted/40 p-0.5 shadow-xs shrink-0">
          {VIEWPORT_PRESETS.map((vp) => (
            <button
              key={vp.id}
              type="button"
              title={`${vp.name} (${vp.width === "100%" ? "fluid" : vp.width})`}
              className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-mono transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeViewport === vp.id
                  ? "bg-background text-foreground shadow-xs font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => onChangeViewport(vp.id)}
            >
              {vp.id === "fluid" && <Maximize className="size-3 shrink-0" />}
              {vp.id === "desktop" && <Monitor className="size-3 shrink-0" />}
              {vp.id === "laptop" && <Laptop className="size-3 shrink-0" />}
              {vp.id === "tablet" && <Tablet className="size-3 shrink-0" />}
              {vp.id === "mobile" && <Smartphone className="size-3 shrink-0" />}
              <span>{vp.name}</span>
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
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
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
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
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
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
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
          className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition shadow-xs cursor-pointer"
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

          {/* Theme Customizer Popover */}
          {showThemePopover && (
            <div className="absolute right-0 top-10 w-72 rounded-xl border border-border bg-card p-4 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between border-b border-border pb-2 mb-3">
                <span className="text-xs font-semibold text-foreground">
                  Theme Customizer
                </span>
                <span className="text-xs font-mono text-muted-foreground uppercase">
                  OKLCH
                </span>
              </div>

              {/* Color Themes */}
              <div className="space-y-2 mb-4">
                <label className="text-xs text-muted-foreground font-medium">
                  Accent Color
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {COLOR_THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      className={`group flex flex-col items-center gap-1 rounded-lg border p-1.5 transition ${
                        activeColorTheme === theme.id
                          ? "border-primary bg-primary/10 shadow-xs"
                          : "border-border/60 hover:border-border hover:bg-muted/40"
                      }`}
                      onClick={() => onChangeColorTheme(theme.id)}
                    >
                      <div
                        className="size-4 rounded-full border border-black/10 dark:border-white/10"
                        style={{ backgroundColor: theme.swatch }}
                      />
                      <span className="text-xs text-muted-foreground group-hover:text-foreground">
                        {theme.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Border Radius */}
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground font-medium">
                  Border Radius
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {RADIUS_PRESETS.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      className={`rounded-md border py-1 text-xs font-mono transition ${
                        activeRadius === r.value
                          ? "border-primary bg-primary text-primary-foreground font-medium shadow-xs"
                          : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                      onClick={() => onChangeRadius(r.value)}
                    >
                      {r.name.split(" ")[0]}
                    </button>
                  ))}
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
