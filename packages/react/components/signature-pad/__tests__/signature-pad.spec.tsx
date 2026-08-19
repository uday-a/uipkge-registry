import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { SignaturePad } from "../index";

describe("SignaturePad", () => {
  it('renders container with data-slot="signature-pad"', () => {
    const { container } = render(<SignaturePad />);
    expect(container.querySelector('[data-slot="signature-pad"]')).toBeTruthy();
  });

  it("has data-uipkge on container", () => {
    const { container } = render(<SignaturePad />);
    expect(
      container
        .querySelector('[data-slot="signature-pad"]')
        ?.hasAttribute("data-uipkge"),
    ).toBe(true);
  });

  it("renders a canvas element", () => {
    const { container } = render(<SignaturePad />);
    expect(container.querySelector("canvas")).toBeTruthy();
  });

  it("renders clear button with default label", () => {
    const { container } = render(<SignaturePad />);
    expect(container.textContent).toContain("Clear");
  });

  it("does not render clear button when showClearButton is false", () => {
    const { container } = render(<SignaturePad showClearButton={false} />);
    expect(container.querySelector("button")).toBeNull();
  });

  it("applies data-disabled when disabled is true", () => {
    const { container } = render(<SignaturePad disabled />);
    expect(
      container
        .querySelector('[data-slot="signature-pad"]')
        ?.hasAttribute("data-disabled"),
    ).toBe(true);
  });

  it("does not render clear button when disabled", () => {
    const { container } = render(<SignaturePad disabled />);
    expect(container.querySelector("button")).toBeNull();
  });
});
