import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Badge } from "../Badge";

describe("Badge", () => {
  it('renders with data-slot="badge"', () => {
    const { container } = render(<Badge>New</Badge>);
    expect(container.querySelector('[data-slot="badge"]')).toBeTruthy();
  });

  it("has data-uipkge", () => {
    const { container } = render(<Badge>New</Badge>);
    expect(container.querySelector("[data-uipkge]")).toBeTruthy();
  });

  it("renders as a span by default", () => {
    const { container } = render(<Badge>New</Badge>);
    expect(
      container.querySelector('[data-slot="badge"]')?.tagName.toLowerCase(),
    ).toBe("span");
  });

  it("renders children", () => {
    const { container } = render(<Badge>Beta</Badge>);
    expect(container.textContent).toContain("Beta");
  });

  it("applies default variant classes", () => {
    const { container } = render(<Badge>Default</Badge>);
    expect(container.querySelector('[data-slot="badge"]')?.className).toContain(
      "bg-primary",
    );
  });

  it("applies secondary variant classes", () => {
    const { container } = render(<Badge variant="secondary">Secondary</Badge>);
    expect(container.querySelector('[data-slot="badge"]')?.className).toContain(
      "bg-secondary",
    );
  });

  it("applies destructive variant classes", () => {
    const { container } = render(
      <Badge variant="destructive">Destructive</Badge>,
    );
    expect(container.querySelector('[data-slot="badge"]')?.className).toContain(
      "bg-destructive",
    );
  });

  it("applies outline variant classes", () => {
    const { container } = render(<Badge variant="outline">Outline</Badge>);
    expect(container.querySelector('[data-slot="badge"]')?.className).toContain(
      "text-foreground",
    );
  });

  it("applies success variant classes", () => {
    const { container } = render(<Badge variant="success">Success</Badge>);
    expect(container.querySelector('[data-slot="badge"]')?.className).toContain(
      "text-success",
    );
  });

  it("applies warning variant classes", () => {
    const { container } = render(<Badge variant="warning">Warning</Badge>);
    expect(container.querySelector('[data-slot="badge"]')?.className).toContain(
      "text-warning",
    );
  });

  it("applies info variant classes", () => {
    const { container } = render(<Badge variant="info">Info</Badge>);
    expect(container.querySelector('[data-slot="badge"]')?.className).toContain(
      "text-info",
    );
  });

  it("accepts asChild prop", () => {
    const { container } = render(
      <Badge asChild>
        <a href="#">Link Badge</a>
      </Badge>,
    );
    expect(container.querySelector("a")).toBeTruthy();
    expect(container.querySelector("a")?.textContent).toContain("Link Badge");
  });

  it("accepts custom className", () => {
    const { container } = render(
      <Badge className="custom-class">Custom</Badge>,
    );
    expect(
      container
        .querySelector('[data-slot="badge"]')
        ?.classList.contains("custom-class"),
    ).toBe(true);
  });
});
