import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Toggle } from "../toggle";

describe("Toggle", () => {
  it('renders with data-slot="toggle"', () => {
    const { container } = render(<Toggle>Toggle</Toggle>);
    expect(container.querySelector('[data-slot="toggle"]')).toBeTruthy();
  });

  it("renders button", () => {
    const { container } = render(<Toggle>Toggle</Toggle>);
    expect(
      container.querySelector('[data-slot="toggle"]')?.tagName.toLowerCase(),
    ).toBe("button");
  });

  it("renders children", () => {
    const { getByText } = render(<Toggle>My Toggle</Toggle>);
    expect(getByText("My Toggle")).toBeTruthy();
  });

  it('shows off state (data-state="off")', () => {
    const { container } = render(
      <Toggle pressed={false} onPressedChange={() => {}}>
        Toggle
      </Toggle>,
    );
    expect(
      container
        .querySelector('[data-slot="toggle"]')
        ?.getAttribute("data-state"),
    ).toBe("off");
  });

  it('shows on state (data-state="on")', () => {
    const { container } = render(
      <Toggle pressed={true} onPressedChange={() => {}}>
        Toggle
      </Toggle>,
    );
    expect(
      container
        .querySelector('[data-slot="toggle"]')
        ?.getAttribute("data-state"),
    ).toBe("on");
  });

  it("calls onPressedChange when clicked", () => {
    const onPressedChange = vi.fn();
    const { container } = render(
      <Toggle pressed={false} onPressedChange={onPressedChange}>
        Toggle
      </Toggle>,
    );
    const toggle = container.querySelector('[data-slot="toggle"]')!;
    fireEvent.click(toggle);
    expect(onPressedChange).toHaveBeenCalled();
  });

  it("disables when disabled", () => {
    const { container } = render(<Toggle disabled>Toggle</Toggle>);
    expect(
      container.querySelector('[data-slot="toggle"]')?.hasAttribute("disabled"),
    ).toBe(true);
  });

  it("uses defaultPressed when uncontrolled", () => {
    const { container } = render(<Toggle defaultPressed>Toggle</Toggle>);
    expect(
      container
        .querySelector('[data-slot="toggle"]')
        ?.getAttribute("data-state"),
    ).toBe("on");
  });

  it("renders as off by default when uncontrolled", () => {
    const { container } = render(<Toggle>Toggle</Toggle>);
    expect(
      container
        .querySelector('[data-slot="toggle"]')
        ?.getAttribute("data-state"),
    ).toBe("off");
  });

  it("applies variant outline class", () => {
    const { container } = render(<Toggle variant="outline">Toggle</Toggle>);
    const toggle = container.querySelector('[data-slot="toggle"]')!;
    expect(toggle.className).toContain("border");
  });

  it("applies size sm class", () => {
    const { container } = render(<Toggle size="sm">Toggle</Toggle>);
    const toggle = container.querySelector('[data-slot="toggle"]')!;
    expect(toggle.className).toContain("h-8");
  });

  it("toggles state when clicked in uncontrolled mode", () => {
    const { container } = render(<Toggle>Toggle</Toggle>);
    const toggle = container.querySelector('[data-slot="toggle"]')!;
    expect(toggle.getAttribute("data-state")).toBe("off");
    fireEvent.click(toggle);
    expect(toggle.getAttribute("data-state")).toBe("on");
  });
});
