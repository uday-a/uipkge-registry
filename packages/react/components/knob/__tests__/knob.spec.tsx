import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Knob } from "../index";

describe("Knob", () => {
  it("renders an svg container", () => {
    const { container } = render(<Knob value={50} />);
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it('has data-slot="knob"', () => {
    const { container } = render(<Knob value={50} />);
    expect(container.querySelector('[data-slot="knob"]')).toBeTruthy();
  });

  it("has data-uipkge", () => {
    const { container } = render(<Knob value={50} />);
    expect(container.querySelector("[data-uipkge]")).toBeTruthy();
  });

  it("renders two path elements (range and value arcs)", () => {
    const { container } = render(<Knob value={50} />);
    expect(container.querySelectorAll("path").length).toBe(2);
  });

  it("renders value text when showValue is true", () => {
    const { container } = render(<Knob value={42} />);
    expect(container.querySelector("text")?.textContent).toContain("42");
  });

  it("does not render value text when showValue is false", () => {
    const { container } = render(<Knob value={42} showValue={false} />);
    expect(container.querySelector("text")).toBeNull();
  });

  it("sets aria-valuenow to the clamped value", () => {
    const { container } = render(<Knob value={75} />);
    expect(container.querySelector("svg")?.getAttribute("aria-valuenow")).toBe(
      "75",
    );
  });

  it("applies aria-disabled when disabled", () => {
    const { container } = render(<Knob value={50} disabled />);
    expect(
      container.querySelector("svg")?.getAttribute("aria-disabled"),
    ).toBeDefined();
  });
});
