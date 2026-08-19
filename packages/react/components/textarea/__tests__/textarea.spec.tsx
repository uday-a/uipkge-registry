import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Textarea } from "../Textarea";

describe("Textarea", () => {
  it("renders a textarea element", () => {
    const { container } = render(
      <Textarea value="" onValueChange={() => {}} />,
    );
    expect(container.querySelector("textarea")).toBeTruthy();
  });

  it("binds value to the textarea element", () => {
    const { container } = render(
      <Textarea value="hello world" onValueChange={() => {}} />,
    );
    expect(container.querySelector("textarea")?.value).toBe("hello world");
  });

  it("calls onValueChange when typing", () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <Textarea value="" onValueChange={onValueChange} />,
    );
    const textarea = container.querySelector("textarea")!;
    fireEvent.change(textarea, { target: { value: "new text" } });
    expect(onValueChange).toHaveBeenCalled();
  });

  it("renders placeholder", () => {
    const { container } = render(
      <Textarea value="" placeholder="Enter text" onValueChange={() => {}} />,
    );
    expect(
      container.querySelector("textarea")?.getAttribute("placeholder"),
    ).toBe("Enter text");
  });

  it("renders label text", () => {
    const { getByText } = render(
      <Textarea value="" label="Description" onValueChange={() => {}} />,
    );
    expect(getByText("Description")).toBeTruthy();
  });

  it("renders hint text", () => {
    const { getByText } = render(
      <Textarea value="" hint="Some hint" onValueChange={() => {}} />,
    );
    expect(getByText("Some hint")).toBeTruthy();
  });

  it("renders error messages", () => {
    const { getByText } = render(
      <Textarea
        value=""
        errorMessages="Required field"
        onValueChange={() => {}}
      />,
    );
    expect(getByText("Required field")).toBeTruthy();
  });

  it("sets aria-invalid when error is present", () => {
    const { container } = render(
      <Textarea value="" error="Error" onValueChange={() => {}} />,
    );
    expect(
      container.querySelector("textarea")?.getAttribute("aria-invalid"),
    ).toBe("true");
  });

  it("disables textarea when disabled prop is true", () => {
    const { container } = render(
      <Textarea value="" disabled onValueChange={() => {}} />,
    );
    expect(container.querySelector("textarea")?.hasAttribute("disabled")).toBe(
      true,
    );
  });

  it("uses defaultValue when uncontrolled", () => {
    const { container } = render(<Textarea defaultValue="default" />);
    expect(container.querySelector("textarea")?.value).toBe("default");
  });

  it("sets rows attribute", () => {
    const { container } = render(
      <Textarea value="" rows={5} onValueChange={() => {}} />,
    );
    expect(container.querySelector("textarea")?.getAttribute("rows")).toBe("5");
  });
});
