import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Spinner } from "../Spinner";

describe("Spinner", () => {
  it('renders with data-slot="spinner"', () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector('[data-slot="spinner"]')).toBeTruthy();
  });

  it("has data-uipkge", () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector("[data-uipkge]")).toBeTruthy();
  });

  it("renders an svg element", () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it('has role="status"', () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector('[role="status"]')).toBeTruthy();
  });

  it('has aria-label="Loading"', () => {
    const { container } = render(<Spinner />);
    expect(
      container
        .querySelector('[data-slot="spinner"]')
        ?.getAttribute("aria-label"),
    ).toBe("Loading");
  });

  it("applies size classes", () => {
    const { container } = render(<Spinner size="lg" />);
    // SVG elements expose className as SVGAnimatedString; use getAttribute instead.
    expect(
      container.querySelector('[data-slot="spinner"]')?.getAttribute("class"),
    ).toContain("size-8");
  });
});
