import * as React from "react";
import { cn } from "@/lib/utils";

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  // Match DataTable's density enum so consumers can opt into the same
  // runtime feel without wiring DataTable. `cozy` is the canonical default
  // for bare tables (cells: py-2, head: h-10); the other two are escape
  // hatches for high-density admin lists and roomy patient-facing views.
  density?: "compact" | "cozy" | "comfortable";
  // Extra classes for the scroll container div (e.g. `min-h-0 flex-1` inside a
  // flex column). A sticky TableHeader pins to THIS div -- an outer overflow
  // wrapper around <Table> breaks stickiness, so size the scroller here.
  containerClassName?: string;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, containerClassName, density, ...props }, ref) => {
    const densityClass =
      density === "compact"
        ? "[&_td]:py-1.5 [&_td]:text-xs [&_th]:h-8 [&_th]:text-xs"
        : density === "comfortable"
          ? "[&_td]:py-3 [&_th]:h-12"
          : // cozy is the new TableCell/TableHead baseline (py-2 / h-10) -- no override.
            "";

    return (
      <div
        data-uipkge=""
        data-slot="table-container"
        className={cn("relative w-full overflow-auto", containerClassName)}
      >
        <table
          ref={ref}
          data-uipkge=""
          data-slot="table"
          className={cn(
            "w-full caption-bottom text-sm",
            densityClass,
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    data-uipkge=""
    data-slot="table-header"
    className={cn("bg-muted/50 [&_tr]:border-b", className)}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    data-uipkge=""
    data-slot="table-body"
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    data-uipkge=""
    data-slot="table-footer"
    className={cn(
      "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
      className,
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    data-uipkge=""
    data-slot="table-row"
    className={cn(
      "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors duration-150",
      className,
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    data-uipkge=""
    data-slot="table-head"
    className={cn(
      "text-foreground h-10 px-3 text-left align-middle text-sm font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className,
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    data-uipkge=""
    data-slot="table-cell"
    className={cn(
      "px-3 py-2 align-middle text-sm whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className,
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    data-uipkge=""
    data-slot="table-caption"
    className={cn("text-muted-foreground mt-4 text-sm", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export interface TableEmptyProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  colSpan?: number;
}

const TableEmpty = React.forwardRef<HTMLTableCellElement, TableEmptyProps>(
  ({ className, colSpan = 1, children, ...props }, ref) => (
    <TableRow>
      <TableCell
        ref={ref}
        colSpan={colSpan}
        className={cn(
          "text-foreground p-4 align-middle text-sm whitespace-nowrap",
          className,
        )}
        {...props}
      >
        <div className="flex items-center justify-center py-10">{children}</div>
      </TableCell>
    </TableRow>
  ),
);
TableEmpty.displayName = "TableEmpty";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableEmpty,
};
