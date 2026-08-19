import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Label } from "../Label";

describe("Label", () => {
  it('renders with data-slot="label"', () => {
    const { container } = render(<Label>My Label</Label>);
    expect(container.querySelector('[data-slot="label"]')).toBeTruthy();
    expect(container.querySelector("[data-uipkge]")).toBeTruthy();
  });

  it("renders children", () => {
    const { getByText } = render(<Label>Username</Label>);
    expect(getByText("Username")).toBeTruthy();
  });

  it("renders a label element by default", () => {
    const { container } = render(<Label>Test</Label>);
    expect(container.querySelector("label")).toBeTruthy();
  });

  it("accepts htmlFor attribute", () => {
    const { container } = render(<Label htmlFor="input-id">Test</Label>);
    expect(container.querySelector("label")?.getAttribute("for")).toBe(
      "input-id",
    );
  });

  it("applies custom className", () => {
    const { container } = render(<Label className="custom-class">Test</Label>);
    expect(
      container
        .querySelector('[data-slot="label"]')
        ?.classList.contains("custom-class"),
    ).toBe(true);
  });
});
