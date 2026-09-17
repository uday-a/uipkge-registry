"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>
>(({ ...props }, ref) => (
  <DialogPrimitive.Trigger
    ref={ref}
    data-uipkge=""
    data-slot="dialog-trigger"
    {...props}
  />
));
DialogTrigger.displayName = DialogPrimitive.Trigger.displayName;

const DialogClose = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
>(({ ...props }, ref) => (
  <DialogPrimitive.Close
    ref={ref}
    data-uipkge=""
    data-slot="dialog-close"
    {...props}
  />
));
DialogClose.displayName = DialogPrimitive.Close.displayName;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    data-uipkge=""
    data-slot="dialog-overlay"
    className={cn(
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:ease-emphasized data-[state=open]:blur-in-2 data-[state=closed]:blur-out-2 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 bg-foreground/50 fixed inset-0 z-50 data-[state=closed]:duration-[var(--dur-exit)] data-[state=open]:duration-200",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

interface DialogContentProps extends React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
> {
  showCloseButton?: boolean;
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, children, showCloseButton = true, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      data-uipkge=""
      data-slot="dialog-content"
      role="dialog"
      className={cn(
        "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:ease-emphasized data-[state=open]:blur-in-2 data-[state=closed]:blur-out-2 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 data-[state=closed]:duration-[var(--dur-exit)] data-[state=open]:duration-200 sm:max-w-lg",
        className,
      )}
      {...props}
    >
      {children}

      {showCloseButton && (
        <DialogPrimitive.Close
          data-uipkge=""
          data-slot="dialog-close"
          className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
        >
          <X aria-hidden="true" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogScrollContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay
      data-uipkge=""
      data-slot="dialog-overlay"
      className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:ease-emphasized data-[state=open]:blur-in-2 data-[state=closed]:blur-out-2 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 bg-foreground/50 fixed inset-0 z-50 grid place-items-center overflow-y-auto data-[state=closed]:duration-[var(--dur-exit)] data-[state=open]:duration-200"
    >
      <DialogPrimitive.Content
        ref={ref}
        data-uipkge=""
        data-slot="dialog-content"
        role="dialog"
        className={cn(
          "bg-background relative z-50 my-8 grid w-full max-w-lg gap-4 border p-6 shadow-lg duration-200 sm:rounded-lg md:w-full",
          className,
        )}
        onPointerDownOutside={(event) => {
          const originalEvent = event.detail.originalEvent;
          const target = originalEvent.target as HTMLElement;
          if (
            originalEvent.offsetX > target.clientWidth ||
            originalEvent.offsetY > target.clientHeight
          ) {
            event.preventDefault();
          }
        }}
        {...props}
      >
        {children}

        <DialogPrimitive.Close
          data-uipkge=""
          data-slot="dialog-close"
          className="hover:bg-secondary absolute top-4 right-4 rounded-md p-0.5 transition-colors duration-200"
        >
          <X className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Overlay>
  </DialogPrimitive.Portal>
));
DialogScrollContent.displayName = "DialogScrollContent";

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-uipkge=""
    data-slot="dialog-header"
    className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  showCloseButton?: boolean;
}

const DialogFooter = ({
  className,
  children,
  showCloseButton = false,
  ...props
}: DialogFooterProps) => (
  <div
    data-uipkge=""
    data-slot="dialog-footer"
    className={cn(
      "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
      className,
    )}
    {...props}
  >
    {children}
    {showCloseButton && (
      <DialogPrimitive.Close asChild>
        <Button variant="outline">Close</Button>
      </DialogPrimitive.Close>
    )}
  </div>
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    data-uipkge=""
    data-slot="dialog-title"
    className={cn("text-lg leading-none font-semibold", className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    data-uipkge=""
    data-slot="dialog-description"
    className={cn("text-muted-foreground text-sm", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogScrollContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
