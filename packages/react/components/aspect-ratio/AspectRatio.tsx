"use client";

import * as React from "react";
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

const AspectRatio = React.forwardRef<
  React.ElementRef<typeof AspectRatioPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root>
>(({ ...props }, ref) => (
  <AspectRatioPrimitive.Root
    ref={ref}
    data-uipkge=""
    data-slot="aspect-ratio"
    {...props}
  />
));
AspectRatio.displayName = "AspectRatio";

export { AspectRatio };
