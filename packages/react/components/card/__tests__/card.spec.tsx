import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "../card";

describe("Card", () => {
  it('renders with data-slot="card"', () => {
    const { container } = render(<Card />);
    expect(container.querySelector('[data-slot="card"]')).toBeTruthy();
  });

  it("has data-uipkge", () => {
    const { container } = render(<Card />);
    expect(container.querySelector("[data-uipkge]")).toBeTruthy();
  });

  it("renders as a div", () => {
    const { container } = render(<Card />);
    expect(
      container.querySelector('[data-slot="card"]')?.tagName.toLowerCase(),
    ).toBe("div");
  });

  it('CardHeader renders with data-slot="card-header"', () => {
    const { container } = render(<CardHeader />);
    expect(container.querySelector('[data-slot="card-header"]')).toBeTruthy();
  });

  it('CardTitle renders with data-slot="card-title"', () => {
    const { container } = render(<CardTitle>Title</CardTitle>);
    expect(container.querySelector('[data-slot="card-title"]')).toBeTruthy();
  });

  it("CardTitle renders as h3 by default", () => {
    const { container } = render(<CardTitle>Title</CardTitle>);
    expect(
      container
        .querySelector('[data-slot="card-title"]')
        ?.tagName.toLowerCase(),
    ).toBe("h3");
  });

  it('CardDescription renders with data-slot="card-description"', () => {
    const { container } = render(
      <CardDescription>Description</CardDescription>,
    );
    expect(
      container.querySelector('[data-slot="card-description"]'),
    ).toBeTruthy();
  });

  it("CardDescription renders as a p element", () => {
    const { container } = render(
      <CardDescription>Description</CardDescription>,
    );
    expect(
      container
        .querySelector('[data-slot="card-description"]')
        ?.tagName.toLowerCase(),
    ).toBe("p");
  });

  it('CardContent renders with data-slot="card-content"', () => {
    const { container } = render(<CardContent />);
    expect(container.querySelector('[data-slot="card-content"]')).toBeTruthy();
  });

  it('CardFooter renders with data-slot="card-footer"', () => {
    const { container } = render(<CardFooter />);
    expect(container.querySelector('[data-slot="card-footer"]')).toBeTruthy();
  });

  it('CardAction renders with data-slot="card-action"', () => {
    const { container } = render(<CardAction />);
    expect(container.querySelector('[data-slot="card-action"]')).toBeTruthy();
  });

  it("renders children", () => {
    const { container } = render(<Card>Card body</Card>);
    expect(container.textContent).toContain("Card body");
  });

  it("applies variant classes", () => {
    const { container } = render(<Card variant="elevated" />);
    expect(container.querySelector('[data-slot="card"]')?.className).toContain(
      "shadow-md",
    );
  });

  it("CardHeader renders children", () => {
    const { container } = render(<CardHeader>Header content</CardHeader>);
    expect(container.textContent).toContain("Header content");
  });

  it("CardContent renders children", () => {
    const { container } = render(<CardContent>Content body</CardContent>);
    expect(container.textContent).toContain("Content body");
  });
});
