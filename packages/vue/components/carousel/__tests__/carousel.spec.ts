import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../index";

function mountCarousel() {
  return mount(
    {
      template:
        "<Carousel><CarouselContent><CarouselItem>Slide 1</CarouselItem><CarouselItem>Slide 2</CarouselItem><CarouselItem>Slide 3</CarouselItem></CarouselContent><CarouselPrevious /><CarouselNext /></Carousel>",
      components: {
        Carousel,
        CarouselContent,
        CarouselItem,
        CarouselPrevious,
        CarouselNext,
      },
    },
    { attachTo: document.body },
  );
}

describe("Carousel", () => {
  it('renders with data-slot="carousel"', () => {
    const w = mountCarousel();
    expect(w.find('[data-slot="carousel"]').exists()).toBe(true);
    w.unmount();
  });

  it("has data-uipkge", () => {
    const w = mountCarousel();
    expect(
      w.find('[data-slot="carousel"]').attributes("data-uipkge"),
    ).toBeDefined();
    w.unmount();
  });

  it('has role="region"', () => {
    const w = mountCarousel();
    expect(w.find('[data-slot="carousel"]').attributes("role")).toBe("region");
    w.unmount();
  });

  it('CarouselContent renders with data-slot="carousel-content"', () => {
    const w = mountCarousel();
    expect(w.find('[data-slot="carousel-content"]').exists()).toBe(true);
    w.unmount();
  });

  it('CarouselItem renders with data-slot="carousel-item"', () => {
    const w = mountCarousel();
    expect(w.findAll('[data-slot="carousel-item"]').length).toBe(3);
    w.unmount();
  });

  it('CarouselItem has role="group"', () => {
    const w = mountCarousel();
    expect(w.find('[data-slot="carousel-item"]').attributes("role")).toBe(
      "group",
    );
    w.unmount();
  });

  it("renders all slide items", () => {
    const w = mountCarousel();
    const items = w.findAll('[data-slot="carousel-item"]');
    expect(items[0].text()).toContain("Slide 1");
    expect(items[1].text()).toContain("Slide 2");
    expect(items[2].text()).toContain("Slide 3");
    w.unmount();
  });

  it("CarouselPrevious renders a button", () => {
    const w = mountCarousel();
    const prev = w.find('[data-slot="carousel"]').findAll("button")[0];
    expect(prev.exists()).toBe(true);
    expect(prev.attributes("aria-label")).toBe("Previous slide");
    w.unmount();
  });

  it("CarouselNext renders a button", () => {
    const w = mountCarousel();
    const buttons = w.find('[data-slot="carousel"]').findAll("button");
    const next = buttons[buttons.length - 1];
    expect(next.exists()).toBe(true);
    expect(next.attributes("aria-label")).toBe("Next slide");
    w.unmount();
  });

  it("CarouselContent applies aria-orientation", () => {
    const w = mountCarousel();
    // Carousel root doesn't expose data-orientation; CarouselContent does via aria-orientation
    expect(
      w.find('[data-slot="carousel-content"]').attributes("aria-orientation"),
    ).toBe("horizontal");
    w.unmount();
  });
});
