import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Skeleton, SkeletonGroup, SkeletonText } from "../skeleton";

describe("Skeleton", () => {
  it('renders with data-slot="skeleton"', () => {
    const { container } = render(<Skeleton />);
    expect(container.querySelector('[data-slot="skeleton"]')).toBeTruthy();
  });

  it("has data-uipkge", () => {
    const { container } = render(<Skeleton />);
    expect(container.querySelector("[data-uipkge]")).toBeTruthy();
  });

  it("renders as a div", () => {
    const { container } = render(<Skeleton />);
    expect(
      container.querySelector('[data-slot="skeleton"]')?.tagName.toLowerCase(),
    ).toBe("div");
  });

  it("applies rounded variant classes", () => {
    const { container } = render(<Skeleton variant="rounded" />);
    expect(
      container.querySelector('[data-slot="skeleton"]')?.className,
    ).toContain("rounded-md");
  });

  it("applies circular variant classes", () => {
    const { container } = render(<Skeleton variant="circular" />);
    expect(
      container.querySelector('[data-slot="skeleton"]')?.className,
    ).toContain("rounded-full");
  });

  it("applies text variant classes", () => {
    const { container } = render(<Skeleton variant="text" />);
    const el = container.querySelector('[data-slot="skeleton"]');
    expect(el?.className).toContain("h-4");
    expect(el?.className).toContain("w-full");
  });

  it("applies width style when width prop is set", () => {
    const { container } = render(<Skeleton width="200px" />);
    expect(
      container.querySelector('[data-slot="skeleton"]')?.getAttribute("style"),
    ).toContain("200px");
  });

  it("applies height style when height prop is set", () => {
    const { container } = render(<Skeleton height="100px" />);
    expect(
      container.querySelector('[data-slot="skeleton"]')?.getAttribute("style"),
    ).toContain("100px");
  });

  it("renders children when loading is false", () => {
    const { container } = render(
      <Skeleton loading={false}>Loaded content</Skeleton>,
    );
    expect(container.textContent).toContain("Loaded content");
    expect(container.querySelector('[data-slot="skeleton"]')).toBeFalsy();
  });

  it('SkeletonGroup renders with data-slot="skeleton-group"', () => {
    const { container } = render(<SkeletonGroup />);
    expect(
      container.querySelector('[data-slot="skeleton-group"]'),
    ).toBeTruthy();
  });

  it("SkeletonText renders multiple lines", () => {
    const { container } = render(<SkeletonText lines={4} />);
    expect(container.querySelector('[data-slot="skeleton-text"]')).toBeTruthy();
    expect(
      container.querySelectorAll('[data-slot="skeleton-text"] > div').length,
    ).toBe(4);
  });
});
