import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Rating } from "../Rating";

describe("Rating", () => {
  it('renders with data-slot="rating"', () => {
    const { container } = render(<Rating value={3} onValueChange={() => {}} />);
    expect(container.querySelector('[data-slot="rating"]')).toBeTruthy();
  });

  it("renders correct number of star buttons", () => {
    const { container } = render(
      <Rating value={3} max={5} onValueChange={() => {}} />,
    );
    expect(container.querySelectorAll("button").length).toBe(5);
  });

  it("renders SVG icons", () => {
    const { container } = render(<Rating value={3} onValueChange={() => {}} />);
    expect(container.querySelectorAll("svg").length).toBeGreaterThan(0);
  });

  it("calls onValueChange when star clicked", () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <Rating value={0} onValueChange={onValueChange} />,
    );
    const buttons = container.querySelectorAll("button");
    fireEvent.click(buttons[2]);
    expect(onValueChange).toHaveBeenCalledWith(3);
  });

  it("shows value when showValue", () => {
    const { container } = render(
      <Rating value={3} showValue onValueChange={() => {}} />,
    );
    expect(container.textContent).toContain("3");
  });

  it("disables buttons when disabled", () => {
    const { container } = render(
      <Rating value={3} disabled onValueChange={() => {}} />,
    );
    const buttons = container.querySelectorAll("button");
    buttons.forEach((btn) => {
      expect(btn.hasAttribute("disabled")).toBe(true);
    });
  });

  it("sets aria-valuenow", () => {
    const { container } = render(<Rating value={3} onValueChange={() => {}} />);
    expect(
      container
        .querySelector('[data-slot="rating"]')
        ?.getAttribute("aria-valuenow"),
    ).toBe("3");
  });

  it("sets aria-valuemax", () => {
    const { container } = render(
      <Rating value={3} max={5} onValueChange={() => {}} />,
    );
    expect(
      container
        .querySelector('[data-slot="rating"]')
        ?.getAttribute("aria-valuemax"),
    ).toBe("5");
  });

  it("clears value when clearable and same star clicked", () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <Rating value={3} clearable onValueChange={onValueChange} />,
    );
    const buttons = container.querySelectorAll("button");
    fireEvent.click(buttons[2]);
    expect(onValueChange).toHaveBeenCalledWith(0);
  });

  it("renders radiogroup role", () => {
    const { container } = render(<Rating value={3} onValueChange={() => {}} />);
    expect(container.querySelector('[role="radiogroup"]')).toBeTruthy();
  });

  it("renders radio role for each star", () => {
    const { container } = render(
      <Rating value={3} max={5} onValueChange={() => {}} />,
    );
    expect(container.querySelectorAll('[role="radio"]').length).toBe(5);
  });

  it("uses defaultValue when uncontrolled", () => {
    const { container } = render(<Rating defaultValue={4} />);
    expect(
      container
        .querySelector('[data-slot="rating"]')
        ?.getAttribute("aria-valuenow"),
    ).toBe("4");
  });

  it("does not call onValueChange when disabled and clicked", () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <Rating value={3} disabled onValueChange={onValueChange} />,
    );
    const buttons = container.querySelectorAll("button");
    fireEvent.click(buttons[2]);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("renders filled stars for current value", () => {
    const { container } = render(
      <Rating value={3} max={5} onValueChange={() => {}} />,
    );
    const fullIcons = container.querySelectorAll(".rating-star-full-icon");
    expect(fullIcons.length).toBe(3);
  });
});
