import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { Img } from "../index";

// The global setup polyfills IntersectionObserver with a no-op that never
// fires, so the img never becomes visible. Removing it makes the component
// fall back to visible=true (the IntersectionObserver-undefined branch),
// letting us assert the lazy <img> renders.
const originalIO = globalThis.IntersectionObserver;

describe("Img (lazy-image)", () => {
  beforeEach(() => {
    // @ts-expect-error test override
    delete globalThis.IntersectionObserver;
  });
  afterEach(() => {
    // @ts-expect-error test restore
    globalThis.IntersectionObserver = originalIO;
  });

  it('renders container with data-slot="lazy-image"', () => {
    const { container } = render(<Img src="/test.png" alt="test" />);
    expect(container.querySelector('[data-slot="lazy-image"]')).toBeTruthy();
  });

  it("has data-uipkge", () => {
    const { container } = render(<Img src="/test.png" alt="test" />);
    expect(container.querySelector("[data-uipkge]")).toBeTruthy();
  });

  it("renders an img element with the given src", () => {
    const { container } = render(<Img src="/test.png" alt="test" />);
    const img = container.querySelector("img");
    expect(img).toBeTruthy();
    expect(img?.getAttribute("src")).toBe("/test.png");
  });

  it('applies loading="lazy" by default', () => {
    const { container } = render(<Img src="/test.png" alt="test" />);
    expect(container.querySelector("img")?.getAttribute("loading")).toBe(
      "lazy",
    );
  });

  it('applies loading="eager" when eager prop is set', () => {
    const { container } = render(<Img src="/test.png" alt="test" eager />);
    expect(container.querySelector("img")?.getAttribute("loading")).toBe(
      "eager",
    );
  });

  it("renders the alt attribute on the img", () => {
    const { container } = render(<Img src="/test.png" alt="description" />);
    expect(container.querySelector("img")?.getAttribute("alt")).toBe(
      "description",
    );
  });
});
