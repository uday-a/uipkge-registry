"use client";

/**
 * Carousel
 *
 * A flexible carousel / slider for cycling through content, built on
 * embla-carousel-react (the official shadcn carousel pattern). All parts are
 * consolidated into this single file and wired through a React context that
 * holds the embla api.
 *
 * Tailwind class strings are kept 1:1 with the Vue registry's carousel so the
 * two frameworks render identically.
 *
 * @example - Basic carousel with images
 * <Carousel>
 *   <CarouselContent>
 *     {images.map((img) => (
 *       <CarouselItem key={img.id}>
 *         <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
 *       </CarouselItem>
 *     ))}
 *   </CarouselContent>
 * </Carousel>
 *
 * @example - Carousel with navigation controls
 * <Carousel opts={{ loop: true }}>
 *   <CarouselContent>
 *     {slides.map((slide) => (
 *       <CarouselItem key={slide.id}>
 *         <SlideContent content={slide} />
 *       </CarouselItem>
 *     ))}
 *   </CarouselContent>
 *   <CarouselPrevious />
 *   <CarouselNext />
 * </Carousel>
 *
 * @example - Vertical carousel
 * <Carousel orientation="vertical">
 *   <CarouselContent>
 *     {items.map((item) => (
 *       <CarouselItem key={item}>{item}</CarouselItem>
 *     ))}
 *   </CarouselContent>
 * </Carousel>
 */
import * as React from "react";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

export interface CarouselProps {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
}

interface CarouselContextProps extends CarouselProps {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: CarouselApi;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  orientation: "horizontal" | "vertical";
}

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins,
    );
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) return;
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    }, []);

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        const isVertical = orientation === "vertical";
        if (
          (!isVertical && event.key === "ArrowLeft") ||
          (isVertical && event.key === "ArrowUp")
        ) {
          event.preventDefault();
          scrollPrev();
        } else if (
          (!isVertical && event.key === "ArrowRight") ||
          (isVertical && event.key === "ArrowDown")
        ) {
          event.preventDefault();
          scrollNext();
        }
      },
      [orientation, scrollPrev, scrollNext],
    );

    React.useEffect(() => {
      if (!api || !setApi) return;
      setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) return;
      onSelect(api);
      api.on("reInit", onSelect);
      api.on("select", onSelect);

      return () => {
        api?.off("select", onSelect);
      };
    }, [api, onSelect]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          data-uipkge=""
          data-slot="carousel"
          onKeyDownCapture={handleKeyDown}
          className={cn(
            "relative overflow-hidden",
            orientation === "horizontal" ? "w-full" : "h-full flex-col",
            className,
          )}
          role="region"
          aria-roledescription="carousel"
          aria-label="Carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  },
);
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div
      ref={carouselRef}
      data-uipkge=""
      data-slot="carousel-content"
      className={cn(
        orientation === "horizontal"
          ? "flex snap-x snap-mandatory overflow-x-auto scroll-smooth"
          : "flex snap-y snap-mandatory flex-col overflow-y-auto",
        "relative h-full w-full",
        "[scrollbar-width:none] [-ms-overflow-style:none]",
        "[&::-webkit-scrollbar]:hidden",
      )}
      aria-orientation={orientation}
      role="group"
    >
      <div
        ref={ref}
        className={cn(
          "flex",
          // w-full clamps the track to the viewport width. Without it the track's
          // min-width:auto sizes to the slides' intrinsic content and overflows the
          // viewport, so basis-full slides resolve against the wider track and
          // render too big — inflating aspect-ratio slide heights vs Vue (whose
          // CarouselContent is a single w-full div). Keeps the two frameworks 1:1.
          orientation === "horizontal" ? "w-full" : "flex-col",
          className,
        )}
        {...props}
      />
    </div>
  );
});
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();

  return (
    <div
      ref={ref}
      data-uipkge=""
      data-slot="carousel-item"
      className={cn(
        "flex shrink-0 grow-0 basis-full flex-col",
        orientation === "horizontal" ? "w-full" : "h-full",
        "snap-start",
        "relative",
        className,
      )}
      role="group"
      aria-roledescription="slide"
      {...props}
    />
  );
});
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button> & { label?: string }
>(
  (
    {
      className,
      variant = "outline",
      size = "icon",
      label = "Previous slide",
      children,
      ...props
    },
    ref,
  ) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel();
    const isHorizontal = orientation !== "vertical";

    return (
      <Button
        ref={ref}
        type="button"
        variant={variant}
        size={size}
        className={cn(
          "absolute z-10 size-8 shrink-0 rounded-full",
          "bg-background/80 border shadow-md backdrop-blur-sm",
          "hover:bg-accent hover:text-accent-foreground",
          "disabled:pointer-events-none disabled:opacity-50",
          isHorizontal
            ? "top-1/2 -left-3 -translate-y-1/2"
            : "-top-3 left-1/2 -translate-x-1/2 rotate-90",
          className,
        )}
        disabled={!canScrollPrev}
        aria-label={label}
        onClick={scrollPrev}
        {...props}
      >
        {children ?? <ChevronLeft className="size-4" aria-hidden="true" />}
      </Button>
    );
  },
);
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button> & { label?: string }
>(
  (
    {
      className,
      variant = "outline",
      size = "icon",
      label = "Next slide",
      children,
      ...props
    },
    ref,
  ) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel();
    const isHorizontal = orientation !== "vertical";

    return (
      <Button
        ref={ref}
        type="button"
        variant={variant}
        size={size}
        className={cn(
          "absolute z-10 size-8 shrink-0 rounded-full",
          "bg-background/80 border shadow-md backdrop-blur-sm",
          "hover:bg-accent hover:text-accent-foreground",
          "disabled:pointer-events-none disabled:opacity-50",
          isHorizontal
            ? "top-1/2 -right-3 -translate-y-1/2"
            : "-bottom-3 left-1/2 -translate-x-1/2 rotate-90",
          className,
        )}
        disabled={!canScrollNext}
        aria-label={label}
        onClick={scrollNext}
        {...props}
      >
        {children ?? <ChevronRight className="size-4" aria-hidden="true" />}
      </Button>
    );
  },
);
CarouselNext.displayName = "CarouselNext";

const CarouselHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-uipkge=""
    data-slot="carousel-header"
    className={cn("flex items-center justify-between px-1 pb-2", className)}
    {...props}
  />
));
CarouselHeader.displayName = "CarouselHeader";

const CarouselFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-uipkge=""
    data-slot="carousel-footer"
    className={cn("flex items-center justify-between px-1 pt-2", className)}
    {...props}
  />
));
CarouselFooter.displayName = "CarouselFooter";

const CarouselIndicators = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { api } = useCarousel();
  const [snaps, setSnaps] = React.useState<number[]>([]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    const onUpdate = () => {
      setSnaps(api.scrollSnapList());
      setSelectedIndex(api.selectedScrollSnap());
    };
    onUpdate();
    api.on("reInit", onUpdate);
    api.on("select", onUpdate);
    return () => {
      api?.off("reInit", onUpdate);
      api?.off("select", onUpdate);
    };
  }, [api]);

  if (!api) return null;

  return (
    <div
      ref={ref}
      data-uipkge=""
      data-slot="carousel-indicators"
      className={cn("flex items-center justify-center gap-1.5 py-2", className)}
      role="tablist"
      aria-label="Carousel navigation"
      {...props}
    >
      {snaps.map((_, index) => (
        <button
          key={index}
          type="button"
          role="tab"
          aria-label={`Go to slide ${index + 1}`}
          aria-selected={index === selectedIndex}
          className={cn(
            "h-2 w-2 rounded-full transition-colors duration-200",
            index === selectedIndex
              ? "bg-primary w-6"
              : "bg-muted-foreground/30 hover:bg-muted-foreground/50",
          )}
          onClick={() => api.scrollTo(index)}
        />
      ))}
    </div>
  );
});
CarouselIndicators.displayName = "CarouselIndicators";

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselHeader,
  CarouselFooter,
  CarouselIndicators,
  useCarousel,
};
