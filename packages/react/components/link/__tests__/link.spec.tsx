import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Link } from "../index";

describe("Link", () => {
  it('renders with data-slot="link"', () => {
    const { container } = render(<Link href="/about" />);
    expect(container.querySelector('[data-slot="link"]')).toBeTruthy();
  });

  it("has data-uipkge", () => {
    const { container } = render(<Link href="/about" />);
    expect(container.querySelector("[data-uipkge]")).toBeTruthy();
  });

  it("renders as an anchor element", () => {
    const { container } = render(<Link href="/about" />);
    expect(
      container.querySelector('[data-slot="link"]')?.tagName.toLowerCase(),
    ).toBe("a");
  });

  it("renders the href attribute", () => {
    const { container } = render(<Link href="/about" />);
    expect(
      container.querySelector('[data-slot="link"]')?.getAttribute("href"),
    ).toBe("/about");
  });

  it("renders children content", () => {
    const { container } = render(<Link href="/about">Click here</Link>);
    expect(container.textContent).toContain("Click here");
  });

  it("applies data-color attribute", () => {
    const { container } = render(<Link href="/about" color="muted" />);
    expect(
      container.querySelector('[data-slot="link"]')?.getAttribute("data-color"),
    ).toBe("muted");
  });

  it("applies data-underline attribute", () => {
    const { container } = render(<Link href="/about" underline="always" />);
    expect(
      container
        .querySelector('[data-slot="link"]')
        ?.getAttribute("data-underline"),
    ).toBe("always");
  });

  it("opens external http href in a new tab", () => {
    const { container } = render(<Link href="https://example.com" />);
    const el = container.querySelector('[data-slot="link"]');
    expect(el?.getAttribute("target")).toBe("_blank");
    expect(el?.getAttribute("rel")).toBe("noopener noreferrer");
  });
});
