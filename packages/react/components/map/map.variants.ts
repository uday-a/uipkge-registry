import { cva, type VariantProps } from "class-variance-authority";

export type MapVariant =
  | "default"
  | "muted"
  | "streets"
  | "outdoors"
  | "light"
  | "dark"
  | "satellite"
  | "satellite-streets"
  | "navigation-day"
  | "navigation-night"
  | "standard";

export const MAPBOX_STYLES: Record<
  Exclude<MapVariant, "default" | "muted">,
  string
> = {
  streets: "mapbox://styles/mapbox/streets-v12",
  outdoors: "mapbox://styles/mapbox/outdoors-v12",
  light: "mapbox://styles/mapbox/light-v11",
  dark: "mapbox://styles/mapbox/dark-v11",
  satellite: "mapbox://styles/mapbox/satellite-v9",
  "satellite-streets": "mapbox://styles/mapbox/satellite-streets-v12",
  "navigation-day": "mapbox://styles/mapbox/navigation-day-v1",
  "navigation-night": "mapbox://styles/mapbox/navigation-night-v1",
  standard: "mapbox://styles/mapbox/standard",
};

export const mapVariants = cva("relative size-full overflow-hidden bg-muted", {
  variants: {
    variant: {
      default: "",
      muted: "data-[muted=true]:grayscale-[25%]",
      streets: "",
      outdoors: "",
      light: "",
      dark: "",
      satellite: "",
      "satellite-streets": "",
      "navigation-day": "",
      "navigation-night": "",
      standard: "",
    },
    size: {
      default: "h-96 w-full",
      sm: "h-64 w-full",
      lg: "h-[500px] w-full",
      xl: "h-[650px] w-full",
      full: "size-full",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export type MapVariants = VariantProps<typeof mapVariants>;
