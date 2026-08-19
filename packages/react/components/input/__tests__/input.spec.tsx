import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Input } from "../Input";

describe("Input", () => {
  it('renders with data-slot="input"', () => {
    const { container } = render(<Input value="" onChange={() => {}} />);
    expect(container.querySelector('[data-slot="input"]')).toBeTruthy();
    expect(container.querySelector("[data-uipkge]")).toBeTruthy();
  });

  it("renders a native input element", () => {
    const { container } = render(<Input value="" onChange={() => {}} />);
    expect(container.querySelector("input")).toBeTruthy();
  });

  it("binds value to the input element", () => {
    const { container } = render(<Input value="hello" onChange={() => {}} />);
    expect(container.querySelector("input")?.value).toBe("hello");
  });

  it("calls onChange when typing", () => {
    const onChange = vi.fn();
    const { container } = render(<Input value="" onChange={onChange} />);
    const input = container.querySelector("input")!;
    fireEvent.change(input, { target: { value: "test" } });
    expect(onChange).toHaveBeenCalled();
  });

  it("renders placeholder", () => {
    const { container } = render(
      <Input value="" placeholder="Enter text" onChange={() => {}} />,
    );
    expect(container.querySelector("input")?.getAttribute("placeholder")).toBe(
      "Enter text",
    );
  });

  it("sets aria-invalid when status is error", () => {
    const { container } = render(
      <Input value="" status="error" onChange={() => {}} />,
    );
    expect(
      container
        .querySelector('[data-slot="input"]')
        ?.getAttribute("aria-invalid"),
    ).toBe("true");
  });

  it("disables input when disabled prop is true", () => {
    const { container } = render(
      <Input value="" disabled onChange={() => {}} />,
    );
    expect(container.querySelector("input")?.hasAttribute("disabled")).toBe(
      true,
    );
  });

  it("renders prefix text", () => {
    const { getByText } = render(
      <Input value="" prefix="$" onChange={() => {}} />,
    );
    expect(getByText("$")).toBeTruthy();
  });

  it("renders suffix text", () => {
    const { getByText } = render(
      <Input value="" suffix="kg" onChange={() => {}} />,
    );
    expect(getByText("kg")).toBeTruthy();
  });

  it("renders addonBefore", () => {
    const { getByText } = render(
      <Input value="" addonBefore="https://" onChange={() => {}} />,
    );
    expect(getByText("https://")).toBeTruthy();
  });

  it("renders addonAfter", () => {
    const { getByText } = render(
      <Input value="" addonAfter=".com" onChange={() => {}} />,
    );
    expect(getByText(".com")).toBeTruthy();
  });

  it("uses defaultValue when uncontrolled", () => {
    const { container } = render(<Input defaultValue="default text" />);
    expect(container.querySelector("input")?.value).toBe("default text");
  });

  it("sets type on the input element", () => {
    const { container } = render(
      <Input value="" type="email" onChange={() => {}} />,
    );
    expect(container.querySelector("input")?.getAttribute("type")).toBe(
      "email",
    );
  });

  it("toggles password visibility when showPasswordToggle is set", () => {
    const { container } = render(
      <Input
        value="secret"
        type="password"
        showPasswordToggle
        onChange={() => {}}
      />,
    );
    const input = container.querySelector("input")!;
    expect(input.getAttribute("type")).toBe("password");
    const toggleBtn = container.querySelector("button")!;
    expect(toggleBtn).toBeTruthy();
    fireEvent.click(toggleBtn);
    expect(container.querySelector("input")?.getAttribute("type")).toBe("text");
  });

  it("clears value when allowClear button is clicked", () => {
    const onChange = vi.fn();
    const { container } = render(
      <Input value="text" allowClear onChange={onChange} />,
    );
    const input = container.querySelector("input")!;
    fireEvent.focus(input);
    const clearBtn = container.querySelector("button")!;
    expect(clearBtn).toBeTruthy();
    fireEvent.click(clearBtn);
    expect(onChange).toHaveBeenCalled();
  });

  it("shows count when showCount and maxLength are set", () => {
    const { container } = render(
      <Input value="abc" showCount maxLength={10} onChange={() => {}} />,
    );
    expect(container.textContent).toContain("3");
    expect(container.textContent).toContain("10");
  });
});
