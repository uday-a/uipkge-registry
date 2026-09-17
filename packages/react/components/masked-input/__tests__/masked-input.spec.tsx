import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { MaskedInput } from "../masked-input";

describe("MaskedInput", () => {
  it('renders with data-slot="masked-input"', () => {
    const { container } = render(
      <MaskedInput mask="##/##/####" value="" onValueChange={() => {}} />,
    );
    expect(container.querySelector('[data-slot="masked-input"]')).toBeTruthy();
    expect(container.querySelector("[data-uipkge]")).toBeTruthy();
  });

  it("renders a native input element", () => {
    const { container } = render(
      <MaskedInput mask="##/##/####" value="" onValueChange={() => {}} />,
    );
    expect(container.querySelector("input")).toBeTruthy();
  });

  it("disables input when disabled prop is true", () => {
    const { container } = render(
      <MaskedInput
        mask="##/##/####"
        value=""
        disabled
        onValueChange={() => {}}
      />,
    );
    expect(container.querySelector("input")?.hasAttribute("disabled")).toBe(
      true,
    );
  });

  it("sets input as readonly when readOnly prop is true", () => {
    const { container } = render(
      <MaskedInput
        mask="##/##/####"
        value=""
        readOnly
        onValueChange={() => {}}
      />,
    );
    expect(container.querySelector("input")?.hasAttribute("readonly")).toBe(
      true,
    );
  });

  it("calls onValueChange when typing", () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <MaskedInput mask="##/##/####" value="" onValueChange={onValueChange} />,
    );
    fireEvent.change(container.querySelector("input")!, {
      target: { value: "12" },
    });
    expect(onValueChange).toHaveBeenCalled();
  });

  it("uses defaultValue when uncontrolled", () => {
    const { container } = render(
      <MaskedInput mask="##/##/####" defaultValue="" />,
    );
    expect(container.querySelector("input")).toBeTruthy();
  });

  it("applies mask format when user types", () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <MaskedInput mask="##-##" value="" onValueChange={onValueChange} />,
    );
    const input = container.querySelector("input")!;
    fireEvent.change(input, { target: { value: "12" } });
    expect(onValueChange).toHaveBeenCalled();
    const emittedValue = onValueChange.mock.calls[0][0];
    expect(emittedValue).toContain("-");
  });

  it("blocks non-digits in numeric slots", () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <MaskedInput mask="##-##" value="" onValueChange={onValueChange} />,
    );
    const input = container.querySelector("input")!;
    fireEvent.change(input, { target: { value: "ab" } });
    expect(onValueChange).toHaveBeenCalled();
    expect(onValueChange.mock.calls[0][0]).toBe("__-__");
  });

  it("displays placeholder text", () => {
    const { container } = render(
      <MaskedInput mask="##/##/####" placeholder="MM/DD/YYYY" />,
    );
    expect(container.querySelector("input")?.getAttribute("placeholder")).toBe(
      "MM/DD/YYYY",
    );
  });

  it("renders error message and aria-invalid", () => {
    const { container } = render(
      <MaskedInput
        mask="##/##/####"
        value="12"
        invalid
        errorMessage="Date is incomplete"
      />,
    );
    expect(container.querySelector("input")?.getAttribute("aria-invalid")).toBe(
      "true",
    );
    const err = container.querySelector('[data-slot="masked-input-error"]');
    expect(err).toBeTruthy();
    expect(err?.textContent).toBe("Date is incomplete");
  });
});
