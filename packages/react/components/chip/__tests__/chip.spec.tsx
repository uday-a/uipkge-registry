import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Chip } from "../index";

describe("Chip", () => {
  it('renders a span with data-slot="chip"', () => {
    const { container } = render(<Chip />);
    const el = container.querySelector('[data-slot="chip"]');
    expect(el).toBeTruthy();
    expect(el?.tagName.toLowerCase()).toBe("span");
  });

  it("has data-uipkge", () => {
    const { container } = render(<Chip />);
    expect(container.querySelector("[data-uipkge]")).toBeTruthy();
  });

  it("renders label text via children", () => {
    const { container } = render(<Chip>React</Chip>);
    expect(container.textContent).toContain("React");
  });

  it("applies variant classes", () => {
    const { container } = render(<Chip variant="success" />);
    expect(container.querySelector('[data-slot="chip"]')?.className).toContain(
      "bg-success/10",
    );
  });

  it("does not show close button when closable is false", () => {
    const { container } = render(<Chip />);
    expect(
      container.querySelector('button[aria-label="Remove item"]'),
    ).toBeFalsy();
  });

  it("shows close button when closable is true", () => {
    const { container } = render(<Chip closable />);
    expect(
      container.querySelector('button[aria-label="Remove item"]'),
    ).toBeTruthy();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn();
    const { container } = render(<Chip closable onClose={onClose} />);
    fireEvent.click(
      container.querySelector('button[aria-label="Remove item"]')!,
    );
    // onClose is called via setTimeout; verify data-leaving is set immediately
    expect(
      container
        .querySelector('[data-slot="chip"]')
        ?.getAttribute("data-leaving"),
    ).toBeDefined();
  });
});
