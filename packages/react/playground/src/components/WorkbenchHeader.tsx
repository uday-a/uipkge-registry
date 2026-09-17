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
    <header className="flex h-13 shrink-0 items-center justify-between border-b border-border bg-card px-4 select-none z-20">
      {/* Left: Brand & Component Info */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-md bg-foreground text-background font-mono font-black text-xs">
            UI
          </div>
          <span className="rounded-md border border-border bg-muted/40 px-2 py-0.5 text-xs font-mono font-medium text-foreground">
            React 19
          </span>
          <a
            href="http://localhost:5173"
            title="Open Vue 3.5 Playground"
            className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground font-mono transition"
          >
            <span>Vue 3.5</span>
            <ExternalLink className="size-2.5" />
          </a>
        </div>

        <div className="h-4 w-px bg-border" />

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-foreground tracking-tight">
            {componentName}
          </span>
          <span className="rounded bg-primary/10 text-primary px-1.5 py-0.5 text-[10px] font-mono uppercase font-bold tracking-wider">
            {{ "registry:block": "BLOCK", "registry:ui": "UI" }[
              componentType
            ] || componentType.replace("registry:", "")}
          </span>
          {category && (
            <span className="hidden sm:inline-block rounded border border-border px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
              {category}
            </span>
          )}
        </div>

        {/* Install Command */}
        <button
          type="button"
          title="Click to copy install command"
          className="hidden md:flex items-center gap-1.5 rounded-md border border-border bg-muted/30 hover:bg-muted px-2 py-1 text-xs font-mono text-muted-foreground hover:text-foreground transition shadow-2xs"
          onClick={copyInstallCommand}
        >
          {copiedCmd ? (
            <Check className="size-3 text-emerald-500" />
          ) : (
            <Copy className="size-3" />
          )}
          <span>npx shadcn add @uipkge/{componentId}</span>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Viewport switcher */}
        <div className="hidden lg:flex items-center rounded-lg border border-border bg-muted/30 p-0.5 shadow-2xs">
          {VIEWPORT_PRESETS.map((vp) => (
            <button
              key={vp.id}
              type="button"
              title={`${vp.name} (${vp.width === "100%" ? "fluid" : vp.width})`}
              className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-mono transition-colors ${
                activeViewport === vp.id
                  ? "bg-background text-foreground shadow-xs font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => onChangeViewport(vp.id)}
            >
              {vp.id === "fluid" && <Maximize className="size-3" />}
              {vp.id === "desktop" && <Monitor className="size-3" />}
              {vp.id === "laptop" && <Laptop className="size-3" />}
              {vp.id === "tablet" && <Tablet className="size-3" />}
              {vp.id === "mobile" && <Smartphone className="size-3" />}
              <span>{vp.name}</span>
            </button>
          ))}
        </div>

        {/* Canvas background switcher */}
        <div className="hidden sm:flex items-center rounded-lg border border-border bg-muted/30 p-0.5 shadow-2xs">
          <button
            type="button"
            title="Dots canvas background"
            className={`flex size-7 items-center justify-center rounded-md transition-colors ${
              canvasBg === "dots"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => onChangeCanvasBg("dots")}
          >
            <CircleDot className="size-3.5" />
          </button>
          <button
            type="button"
            title="Grid canvas background"
            className={`flex size-7 items-center justify-center rounded-md transition-colors ${
              canvasBg === "grid"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => onChangeCanvasBg("grid")}
          >
            <Grid className="size-3.5" />
          </button>
          <button
            type="button"
            title="Solid canvas background"
            className={`flex size-7 items-center justify-center rounded-md transition-colors ${
              canvasBg === "solid"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => onChangeCanvasBg("solid")}
          >
            <Square className="size-3.5" />
          </button>
        </div>

        {/* Remount component button */}
        <button
          type="button"
          title="Remount component"
          className="flex size-7 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition shadow-2xs"
          onClick={onRemount}
        >
          <RotateCcw className="size-3.5" />
        </button>

        {/* Theme Customizer Trigger */}
        <div className="relative">
          <button
            type="button"
            title="Customize Theme & Radius"
            className="flex size-7 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition shadow-2xs"
            onClick={() => setShowThemePopover(!showThemePopover)}
          >
            <Palette className="size-3.5" />
          </button>

          {/* Theme Customizer Popover */}
          {showThemePopover && (
            <div className="absolute right-0 top-9 w-72 rounded-xl border border-border bg-card p-4 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between border-b border-border pb-2 mb-3">
                <span className="text-xs font-semibold text-foreground">
                  Theme Customizer
                </span>
                <span className="text-[10px] font-mono text-muted-foreground uppercase">
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
                      <span className="text-[10px] text-muted-foreground group-hover:text-foreground">
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
          className="flex size-7 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition shadow-2xs"
          onClick={onToggleDark}
        >
          {isDark ? (
            <Sun className="size-3.5" />
          ) : (
            <Moon className="size-3.5" />
          )}
        </button>

        {/* Test Bench Drawer Toggle */}
        <button
          type="button"
          title="Toggle Test Bench & Inspector"
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition shadow-2xs ${
            isInspectorOpen
              ? "bg-foreground text-background"
              : "border border-border bg-background text-foreground hover:bg-muted"
          }`}
          onClick={onToggleInspector}
        >
          <SlidersHorizontal className="size-3.5" />
          <span className="hidden sm:inline">Test Bench</span>
        </button>
      </div>
    </header>
  );
}
