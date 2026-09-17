import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Anchor } from "../index";

describe("Anchor", () => {
  it('renders nav element with data-slot="anchor"', () => {
    const { container } = render(<Anchor />);
    expect(container.querySelector('[data-slot="anchor"]')).toBeTruthy();
    expect(container.querySelector('nav[data-slot="anchor"]')).toBeTruthy();
  });

  it("has data-uipkge on nav", () => {
    const { container } = render(<Anchor />);
    expect(
      container.querySelector('[data-slot="anchor"][data-uipkge]'),
    ).toBeTruthy();
  });

  it("renders AnchorLink children from items prop", () => {
    const { container } = render(
      <Anchor
        items={[
          { href: "#section-1", title: "Section 1" },
          { href: "#section-2", title: "Section 2" },
        ]}
      />,
    );
    const links = container.querySelectorAll('[data-slot="anchor-link"]');
    expect(links.length).toBe(2);
  });

  it("renders href on anchor links", () => {
    const { container } = render(
      <Anchor items={[{ href: "#section-1", title: "Section 1" }]} />,
    );
    const link = container.querySelector(
      '[data-slot="anchor-link"] a',
    ) as HTMLAnchorElement;
    expect(link.getAttribute("href")).toBe("#section-1");
  });

  it("renders title text on anchor links", () => {
    const { container } = render(
      <Anchor items={[{ href: "#sec", title: "My Section" }]} />,
    );
    expect(container.textContent).toContain("My Section");
  });

  it("renders children when no items provided", () => {
    const { container } = render(<Anchor>Custom content</Anchor>);
    expect(container.textContent).toContain("Custom content");
  });
});
