"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  accordionVariants,
  accordionItemVariants,
  accordionTriggerVariants,
} from "./accordion.variants";

type AccordionVariant = "default" | "separated" | "ghost";

// The Vue source threads the chosen variant from <Accordion> down to each
// <AccordionItem>/<AccordionTrigger> via provide/inject. React's equivalent is
// context — the Root sets it, Item/Trigger read it (default 'default').
const AccordionVariantContext =
  React.createContext<AccordionVariant>("default");

const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root> & {
    variant?: AccordionVariant;
  }
>(({ className, variant = "default", ...props }, ref) => (
  <AccordionVariantContext.Provider value={variant}>
    <AccordionPrimitive.Root
      ref={ref}
      data-uipkge=""
      data-slot="accordion"
      data-variant={variant}
      className={cn(accordionVariants({ variant }), className)}
      {...props}
    />
  </AccordionVariantContext.Provider>
));
Accordion.displayName = "Accordion";

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => {
  const variant = React.useContext(AccordionVariantContext);
  return (
    <AccordionPrimitive.Item
      ref={ref}
      data-uipkge=""
      data-slot="accordion-item"
      className={cn(accordionItemVariants({ variant }), className)}
      {...props}
    />
  );
});
AccordionItem.displayName = "AccordionItem";

const AccordionHeader = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Header>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Header>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Header
    ref={ref}
    data-uipkge=""
    data-slot="accordion-header"
    className={cn("flex", className)}
    {...props}
  />
));
AccordionHeader.displayName = "AccordionHeader";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
  const variant = React.useContext(AccordionVariantContext);
  // Do not wrap Header here — matches Vue/Reka and lets consumers use
  // <AccordionHeader> for custom layouts (e.g. price outside the trigger).
  return (
    <AccordionPrimitive.Trigger
      ref={ref}
      data-uipkge=""
      data-slot="accordion-trigger"
      className={cn(accordionTriggerVariants({ variant }), className)}
      {...props}
    >
      {children}
      <ChevronDown
        className="text-muted-foreground size-4 shrink-0 transition-transform duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] group-data-[state=open]/accordion-trigger:rotate-180 motion-reduce:transition-none"
        aria-hidden="true"
      />
    </AccordionPrimitive.Trigger>
  );
});
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    data-uipkge=""
    data-slot="accordion-content"
    className={cn(
      "text-muted-foreground overflow-hidden text-sm",
      // Height via Radix CSS vars + tw-animate-css (not height:auto).
      // duration/ease set --tw-duration/--tw-ease consumed by the utility.
      "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      "duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]",
      "motion-reduce:animate-none",
      className,
    )}
    {...props}
  >
    <div className="pt-0 pb-4">{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = "AccordionContent";

export {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
};
