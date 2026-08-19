import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Kbd } from "../index";

describe("Kbd", () => {
  it('renders a kbd element with data-slot="kbd"', () => {
    const { container } = render(<Kbd />);
    const el = container.querySelector('[data-slot="kbd"]');
    expect(el).toBeTruthy();
    expect(el?.tagName.toLowerCase()).toBe("kbd");
  });

  it("has data-uipkge", () => {
    const { container } = render(<Kbd />);
    expect(container.querySelector("[data-uipkge]")).toBeTruthy();
  });

  it("renders key text via children", () => {
    const { container } = render(<Kbd>Ctrl</Kbd>);
    expect(container.textContent).toContain("Ctrl");
  });

  it("applies custom class", () => {
    const { container } = render(<Kbd className="custom-class" />);
    expect(container.querySelector('[data-slot="kbd"]')?.className).toContain(
      "custom-class",
    );
  });
});
