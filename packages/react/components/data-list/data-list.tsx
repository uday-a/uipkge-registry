import * as React from "react";
import { cn } from "@/lib/utils";

const DataList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-uipkge=""
    data-slot="data-list"
    className={cn("flex flex-col", className)}
    {...props}
  />
));
DataList.displayName = "DataList";

const DataListItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-uipkge=""
    data-slot="data-list-item"
    className={cn(
      "flex flex-row items-center justify-between border-b py-4 transition-colors duration-200 first:pt-0 last:border-0 last:pb-0",
      className,
    )}
    {...props}
  />
));
DataListItem.displayName = "DataListItem";

export { DataList, DataListItem };
