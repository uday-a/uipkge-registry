import * as React from "react";
import { cn } from "@/lib/utils";

export interface ListProps extends React.HTMLAttributes<HTMLElement> {
  as?: "ul" | "ol" | "div";
}

const List = React.forwardRef<HTMLElement, ListProps>(
  ({ as: Comp = "ul", className, children, ...props }, ref) => (
    <Comp
      ref={ref as never}
      data-uipkge=""
      data-slot="list"
      className={cn("list-none space-y-1", className)}
      {...props}
    >
      {children}
    </Comp>
  ),
);
List.displayName = "List";

export interface ListItemProps extends React.HTMLAttributes<HTMLElement> {
  as?: "li" | "div" | "a";
  active?: boolean;
  disabled?: boolean;
  href?: string;
}

const ListItem = React.forwardRef<HTMLElement, ListItemProps>(
  (
    {
      as: Comp = "li",
      active,
      disabled,
      className,
      children,
      onClick,
      href,
      ...props
    },
    ref,
  ) => {
    // Only show pointer/hover affordances when the item is actually interactive.
    const isInteractive =
      !disabled &&
      (Comp === "a" || href != null || typeof onClick === "function");

    return (
      <Comp
        ref={ref as never}
        {...props}
        data-uipkge=""
        data-slot="list-item"
        data-active={active ? "" : undefined}
        data-disabled={disabled ? "" : undefined}
        aria-disabled={disabled ? "true" : undefined}
        aria-current={active ? "true" : undefined}
        tabIndex={disabled ? -1 : undefined}
        href={Comp === "a" && !disabled ? href : undefined}
        className={cn(
          "rounded-md px-2 py-1.5 text-sm transition-colors duration-200 select-none focus-visible:outline-none",
          "has-[>[data-slot=list-item-content]]:flex has-[>[data-slot=list-item-content]]:items-center has-[>[data-slot=list-item-content]]:gap-3",
          isInteractive &&
            "hover:bg-accent focus-visible:bg-accent cursor-pointer",
          active && "bg-accent text-accent-foreground",
          disabled && "pointer-events-none cursor-not-allowed opacity-50",
          className,
        )}
        onClick={
          disabled
            ? (e: React.MouseEvent) => {
                e.preventDefault();
                e.stopPropagation;
              }
            : onClick
        }
      >
        {children}
      </Comp>
    );
  },
);
ListItem.displayName = "ListItem";

export interface ListItemMediaProps extends React.HTMLAttributes<HTMLDivElement> {}

const ListItemMedia = React.forwardRef<HTMLDivElement, ListItemMediaProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      data-uipkge=""
      data-slot="list-item-media"
      className={cn(
        "flex shrink-0 items-center justify-center self-center",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);
ListItemMedia.displayName = "ListItemMedia";

export interface ListItemContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const ListItemContent = React.forwardRef<HTMLDivElement, ListItemContentProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      data-uipkge=""
      data-slot="list-item-content"
      className={cn(
        "flex min-w-0 flex-1 flex-col gap-0.5 self-center",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);
ListItemContent.displayName = "ListItemContent";

export interface ListItemTitleProps extends React.HTMLAttributes<HTMLDivElement> {}

const ListItemTitle = React.forwardRef<HTMLDivElement, ListItemTitleProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      data-uipkge=""
      data-slot="list-item-title"
      className={cn(
        "text-foreground truncate text-sm leading-none font-medium",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);
ListItemTitle.displayName = "ListItemTitle";

export interface ListItemDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {}

const ListItemDescription = React.forwardRef<
  HTMLDivElement,
  ListItemDescriptionProps
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    data-uipkge=""
    data-slot="list-item-description"
    className={cn("text-muted-foreground line-clamp-1 text-xs", className)}
    {...props}
  >
    {children}
  </div>
));
ListItemDescription.displayName = "ListItemDescription";

export interface ListItemActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

const ListItemActions = React.forwardRef<HTMLDivElement, ListItemActionsProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      data-uipkge=""
      data-slot="list-item-actions"
      className={cn(
        "text-muted-foreground flex shrink-0 items-center gap-1.5 self-center",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);
ListItemActions.displayName = "ListItemActions";

export interface ListSubheaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const ListSubheader = React.forwardRef<HTMLDivElement, ListSubheaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      data-uipkge=""
      data-slot="list-subheader"
      className={cn(
        "text-muted-foreground px-2 py-1 text-xs font-medium tracking-wider uppercase",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);
ListSubheader.displayName = "ListSubheader";

export {
  List,
  ListItem,
  ListItemMedia,
  ListItemContent,
  ListItemTitle,
  ListItemDescription,
  ListItemActions,
  ListSubheader,
};
