export interface ColorTheme {
  id: string;
  name: string;
  swatch: string;
}

export const COLOR_THEMES: ColorTheme[] = [
  { id: "default", name: "Neutral", swatch: "#18181b" },
  { id: "blue", name: "Blue", swatch: "#2563eb" },
  { id: "indigo", name: "Indigo", swatch: "#4f46e5" },
  { id: "violet", name: "Violet", swatch: "#7c3aed" },
  { id: "purple", name: "Purple", swatch: "#9c27b0" },
  { id: "rose", name: "Rose", swatch: "#e11d48" },
  { id: "orange", name: "Orange", swatch: "#ea580c" },
  { id: "amber", name: "Amber", swatch: "#d97706" },
  { id: "emerald", name: "Emerald", swatch: "#10b981" },
  { id: "teal", name: "Teal", swatch: "#0d9488" },
  { id: "cyan", name: "Cyan", swatch: "#0891b2" },
  { id: "slate", name: "Slate", swatch: "#475569" },
];

export interface RadiusPreset {
  id: string;
  name: string;
  label: string;
  value: string;
}

export const RADIUS_PRESETS: RadiusPreset[] = [
  { id: "none", name: "Sharp (0)", label: "0", value: "0rem" },
  { id: "sm", name: "Subtle (0.25rem)", label: "0.25", value: "0.25rem" },
  { id: "md", name: "Default (0.5rem)", label: "0.5", value: "0.5rem" },
  { id: "lg", name: "Round (0.75rem)", label: "0.75", value: "0.75rem" },
];

export interface ViewportPreset {
  id: string;
  name: string;
  width: string;
  icon: string;
}

export const VIEWPORT_PRESETS: ViewportPreset[] = [
  { id: "fluid", name: "100%", width: "100%", icon: "Maximize2" },
  { id: "desktop", name: "1280px", width: "1280px", icon: "Monitor" },
  { id: "laptop", name: "1024px", width: "1024px", icon: "Laptop" },
  { id: "tablet", name: "768px", width: "768px", icon: "Tablet" },
  { id: "mobile", name: "375px", width: "375px", icon: "Smartphone" },
];

export type CanvasBackground = "dots" | "grid" | "checker" | "solid";
