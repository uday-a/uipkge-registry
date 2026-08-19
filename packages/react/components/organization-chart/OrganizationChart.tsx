import * as React from "react";
import { cn } from "@/lib/utils";
import { organizationChartVariants } from "./organization-chart.variants";
import { OrgChartNode } from "./OrgChartNode";
import type { OrgNode } from "./types";
import "./organization-chart.css";

export interface OrganizationChartProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onClick" | "onToggle"
> {
  data: OrgNode;
  direction?: "top-down" | "left-right";
  defaultExpanded?: boolean;
  showConnectors?: boolean;
  zoomable?: boolean;
  onNodeClick?: (node: OrgNode) => void;
  onToggle?: (node: OrgNode, expanded: boolean) => void;
  renderNode?: (node: OrgNode) => React.ReactNode;
}

/** Imperative API mirrored from Vue `defineExpose`. */
export interface OrganizationChartHandle {
  expandAll: () => void;
  collapseAll: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
}

function collectIds(node: OrgNode, acc: string[] = []): string[] {
  acc.push(node.id);
  if (node.children) for (const c of node.children) collectIds(c, acc);
  return acc;
}

const OrganizationChart = React.forwardRef<
  OrganizationChartHandle,
  OrganizationChartProps
>(
  (
    {
      data,
      direction = "top-down",
      defaultExpanded = true,
      showConnectors = true,
      zoomable = false,
      className,
      onNodeClick,
      onToggle,
      renderNode,
      ...props
    },
    ref,
  ) => {
    const [expanded, setExpanded] = React.useState<Set<string>>(() => {
      if (defaultExpanded) return new Set(collectIds(data));
      return new Set([data.id]);
    });
    const [zoom, setZoom] = React.useState(1);

    // Re-sync expanded state when data or defaultExpanded changes
    React.useEffect(() => {
      if (defaultExpanded) {
        setExpanded(new Set(collectIds(data)));
      } else {
        setExpanded(new Set([data.id]));
      }
    }, [data, defaultExpanded]);

    function toggleNode(node: OrgNode) {
      setExpanded((prev) => {
        const next = new Set(prev);
        if (next.has(node.id)) next.delete(node.id);
        else next.add(node.id);
        onToggle?.(node, next.has(node.id));
        return next;
      });
    }

    function isExpanded(node: OrgNode): boolean {
      return expanded.has(node.id);
    }

    function expandAll() {
      setExpanded(new Set(collectIds(data)));
    }

    function collapseAll() {
      setExpanded(new Set([data.id]));
    }

    function zoomIn() {
      setZoom((z) => Math.min(2, z + 0.1));
    }

    function zoomOut() {
      setZoom((z) => Math.max(0.5, z - 0.1));
    }

    function resetZoom() {
      setZoom(1);
    }

    // Imperative handle mirroring Vue's defineExpose
    React.useImperativeHandle(ref, () => ({
      expandAll,
      collapseAll,
      zoomIn,
      zoomOut,
      resetZoom,
    }));

    const containerStyle = React.useMemo(
      () => ({
        transform: `scale(${zoom})`,
        transformOrigin: "top center",
      }),
      [zoom],
    );

    return (
      <div
        data-uipkge=""
        data-slot="organization-chart"
        data-direction={direction}
        className={cn(organizationChartVariants(), className)}
        {...props}
      >
        {zoomable && (
          <div className="border-border flex items-center gap-2 border-b px-3 py-2">
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex size-7 items-center justify-center rounded-md text-sm"
              aria-label="Zoom out"
              onClick={zoomOut}
            >
              −
            </button>
            <span className="text-muted-foreground w-12 text-center text-xs tabular-nums">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex size-7 items-center justify-center rounded-md text-sm"
              aria-label="Zoom in"
              onClick={zoomIn}
            >
              +
            </button>
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground hover:bg-accent ml-1 rounded-md px-2 py-1 text-xs"
              aria-label="Reset zoom"
              onClick={resetZoom}
            >
              Reset
            </button>
            <div className="ml-auto flex gap-1">
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-md px-2 py-1 text-xs"
                aria-label="Expand all"
                onClick={expandAll}
              >
                Expand all
              </button>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-md px-2 py-1 text-xs"
                aria-label="Collapse all"
                onClick={collapseAll}
              >
                Collapse all
              </button>
            </div>
          </div>
        )}
        <div className="overflow-auto p-4">
          <div
            style={containerStyle}
            className="transition-transform duration-200"
          >
            <OrgChartNode
              node={data}
              depth={0}
              isRoot
              direction={direction}
              showConnectors={showConnectors}
              isExpanded={isExpanded}
              toggle={toggleNode}
              onNodeClick={onNodeClick}
              renderNode={renderNode}
            />
          </div>
        </div>
      </div>
    );
  },
);
OrganizationChart.displayName = "OrganizationChart";

export { OrganizationChart };
