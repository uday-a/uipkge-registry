"use client";

import * as React from "react";
import * as echartsCore from "echarts/core";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import {
  LineChart as EChartsLineChart,
  BarChart as EChartsBarChart,
  PieChart as EChartsPieChart,
  ScatterChart as EChartsScatterChart,
  EffectScatterChart as EChartsEffectScatter,
  PictorialBarChart as EChartsPictorialBar,
  RadarChart as EChartsRadarChart,
  GaugeChart as EChartsGaugeChart,
  HeatmapChart as EChartsHeatmap,
  TreemapChart as EChartsTreemapChart,
  FunnelChart as EChartsFunnelChart,
  BoxplotChart as EChartsBoxplotChart,
  CandlestickChart as EChartsCandlestickChart,
  CustomChart as EChartsCustomChart,
  ChordChart as EChartsChordChart,
  MapChart as EChartsMapChart,
  GraphChart as EChartsGraphChart,
  ParallelChart as EChartsParallelChart,
  SankeyChart as EChartsSankeyChart,
  SunburstChart as EChartsSunburstChart,
  ThemeRiverChart,
  TreeChart as EChartsTreeChart,
} from "echarts/charts";
import {
  GridComponent,
  PolarComponent,
  TooltipComponent,
  LegendComponent,
  MarkLineComponent,
  MarkAreaComponent,
  MarkPointComponent,
  GraphicComponent,
  RadarComponent,
  VisualMapComponent,
  CalendarComponent,
  DataZoomComponent,
  ParallelComponent,
  SingleAxisComponent,
  TitleComponent,
} from "echarts/components";
import ReactECharts from "echarts-for-react/esm/core";
import { cn } from "@/lib/utils";

export function heightToStyle(height: number | string): string {
  return /^\d+$/.test(String(height)) ? `${height}px` : String(height);
}

interface ChartFrameProps {
  height: number | string;
  className?: string;
  /** Apply the accessible role/tabindex/focus-ring chrome. Some chart
   *  wrappers ship a bare `w-full` frame -- pass `false` for those. */
  focusable?: boolean;
  /** Accessible name for role="img". Defaults to "Chart". */
  ariaLabel?: string;
}

/** Shared `<div>` wrapper around the ECharts canvas. */
export const ChartFrame = React.forwardRef<
  HTMLDivElement,
  ChartFrameProps & { children: React.ReactNode }
>(({ height, className, focusable = true, ariaLabel, children }, ref) => (
  <div
    ref={ref}
    role="img"
    aria-label={ariaLabel || "Chart"}
    tabIndex={focusable ? 0 : undefined}
    style={{ height: heightToStyle(height) }}
    className={
      focusable
        ? cn(
            "focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none",
            className,
          )
        : cn("w-full", className)
    }
  >
    {children}
  </div>
));
ChartFrame.displayName = "ChartFrame";

/** ECharts canvas filling its parent frame. */
export function EChart({ option }: { option: any }) {
  return (
    <ReactECharts
      echarts={echartsCore as any}
      option={option}
      notMerge
      lazyUpdate
      style={{ width: "100%", height: "100%" }}
    />
  );
}

export const echartsCoreModule = echartsCore;

// Register every chart type the wrappers need once at module load.
use([
  CanvasRenderer,
  EChartsLineChart,
  EChartsBarChart,
  EChartsPieChart,
  EChartsScatterChart,
  EChartsEffectScatter,
  EChartsPictorialBar,
  EChartsRadarChart,
  EChartsGaugeChart,
  EChartsHeatmap,
  EChartsTreemapChart,
  EChartsFunnelChart,
  EChartsBoxplotChart,
  EChartsCandlestickChart,
  EChartsCustomChart,
  EChartsChordChart,
  EChartsMapChart,
  EChartsGraphChart,
  EChartsParallelChart,
  EChartsSankeyChart,
  EChartsSunburstChart,
  ThemeRiverChart,
  EChartsTreeChart,
  GridComponent,
  PolarComponent,
  TooltipComponent,
  LegendComponent,
  MarkLineComponent,
  MarkAreaComponent,
  MarkPointComponent,
  GraphicComponent,
  RadarComponent,
  VisualMapComponent,
  CalendarComponent,
  DataZoomComponent,
  ParallelComponent,
  SingleAxisComponent,
  TitleComponent,
]);
