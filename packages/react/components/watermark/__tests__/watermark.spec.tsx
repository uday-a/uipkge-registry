import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Watermark } from "../Watermark";

describe("Watermark", () => {
  it('renders container with data-slot="watermark"', () => {
    const { container } = render(<Watermark content="CONFIDENTIAL" />);
    expect(container.querySelector('[data-slot="watermark"]')).toBeTruthy();
  });

  it("has data-uipkge on container", () => {
    const { container } = render(<Watermark content="CONFIDENTIAL" />);
    expect(
      container
        .querySelector('[data-slot="watermark"]')
        ?.hasAttribute("data-uipkge"),
    ).toBe(true);
  });

  it('renders watermark overlay with data-slot="watermark-overlay"', () => {
    const { container } = render(<Watermark content="CONFIDENTIAL" />);
    expect(
      container.querySelector('[data-slot="watermark-overlay"]'),
    ).toBeTruthy();
  });

  it("overlay has data-uipkge", () => {
    const { container } = render(<Watermark content="CONFIDENTIAL" />);
    expect(
      container
        .querySelector('[data-slot="watermark-overlay"]')
        ?.hasAttribute("data-uipkge"),
    ).toBe(true);
  });

  it("renders children content", () => {
    const { container } = render(
      <Watermark content="CONFIDENTIAL">
        <p>Protected content</p>
      </Watermark>,
    );
    expect(container.textContent).toContain("Protected content");
  });

  it('overlay has aria-hidden="true"', () => {
    const { container } = render(<Watermark content="CONFIDENTIAL" />);
    expect(
      container
        .querySelector('[data-slot="watermark-overlay"]')
        ?.getAttribute("aria-hidden"),
    ).toBe("true");
  });

  it("overlay has pointer-events:none by default", () => {
    const { container } = render(<Watermark content="CONFIDENTIAL" />);
    const overlay = container.querySelector(
      '[data-slot="watermark-overlay"]',
    ) as HTMLElement;
    expect(overlay.style.pointerEvents).toBe("none");
  });
});
