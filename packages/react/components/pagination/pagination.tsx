import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Native React port of the Vue (reka-ui) pagination. reka-ui's PaginationRoot
 * owns the page-window/ellipsis logic and exposes it through slot props; React
 * (radix) has no pagination primitive, so — following shadcn-react — these are
 * presentational parts. The caller drives `currentPage` and renders the page
 * items. The Tailwind classes carried by the Vue parts are preserved 1:1.
 */

const Pagination = ({
  className,
  "aria-label": ariaLabel,
  ...props
}: React.ComponentPropsWithoutRef<"nav">) => (
  <nav
    aria-label={ariaLabel ?? "Pagination"}
    data-uipkge=""
    data-slot="pagination"
    className={cn("flex items-center gap-1", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationList = React.forwardRef<
  HTMLUListElement,
  React.ComponentPropsWithoutRef<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-uipkge=""
    data-slot="pagination-list"
    className={cn("flex items-center gap-1", className)}
    {...props}
  />
));
PaginationList.displayName = "PaginationList";

const PaginationListItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-uipkge=""
    data-slot="pagination-list-item"
    className={cn("shrink-0", className)}
    {...props}
  />
));
PaginationListItem.displayName = "PaginationListItem";

const PaginationFirst = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button">
>(({ children, ...props }, ref) => (
  <button ref={ref} type="button" aria-label="Go to first page" {...props}>
    {children ?? <ChevronsLeft className="size-4" aria-hidden="true" />}
  </button>
));
PaginationFirst.displayName = "PaginationFirst";

const PaginationPrev = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button">
>(({ children, ...props }, ref) => (
  <button ref={ref} type="button" aria-label="Go to previous page" {...props}>
    {children ?? <ChevronLeft className="size-4" aria-hidden="true" />}
  </button>
));
PaginationPrev.displayName = "PaginationPrev";

const PaginationNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button">
>(({ children, ...props }, ref) => (
  <button ref={ref} type="button" aria-label="Go to next page" {...props}>
    {children ?? <ChevronRight className="size-4" aria-hidden="true" />}
  </button>
));
PaginationNext.displayName = "PaginationNext";

const PaginationLast = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button">
>(({ children, ...props }, ref) => (
  <button ref={ref} type="button" aria-label="Go to last page" {...props}>
    {children ?? <ChevronsRight className="size-4" aria-hidden="true" />}
  </button>
));
PaginationLast.displayName = "PaginationLast";

const PaginationEllipsis = ({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"span">) => (
  <span aria-hidden="true" {...props}>
    {children ?? <MoreHorizontal className="size-4" aria-hidden="true" />}
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationList,
  PaginationListItem,
  PaginationFirst,
  PaginationPrev,
  PaginationNext,
  PaginationLast,
  PaginationEllipsis,
};
