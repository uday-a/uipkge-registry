import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Checkbox, CheckboxGroup } from "../checkbox";

describe("Checkbox", () => {
  it('renders with data-slot="checkbox"', () => {
    const { container } = render(
      <Checkbox checked={false} onCheckedChange={() => {}} />,
    );
    expect(container.querySelector('[data-slot="checkbox"]')).toBeTruthy();
  });

  it("renders checkbox role", () => {
    const { container } = render(
      <Checkbox checked={false} onCheckedChange={() => {}} />,
    );
    expect(container.querySelector('[role="checkbox"]')).toBeTruthy();
  });

  it('shows checked state (data-state="checked")', () => {
    const { container } = render(
      <Checkbox checked={true} onCheckedChange={() => {}} />,
    );
    expect(
      container
        .querySelector('[data-slot="checkbox"]')
        ?.getAttribute("data-state"),
    ).toBe("checked");
  });

  it('shows unchecked state (data-state="unchecked")', () => {
    const { container } = render(
      <Checkbox checked={false} onCheckedChange={() => {}} />,
    );
    expect(
      container
        .querySelector('[data-slot="checkbox"]')
        ?.getAttribute("data-state"),
    ).toBe("unchecked");
  });

  it("calls onCheckedChange when clicked", () => {
    const onCheckedChange = vi.fn();
    const { container } = render(
      <Checkbox checked={false} onCheckedChange={onCheckedChange} />,
    );
    const checkbox = container.querySelector('[data-slot="checkbox"]')!;
    fireEvent.click(checkbox);
    expect(onCheckedChange).toHaveBeenCalled();
  });

  it("renders label text", () => {
    const { getByText } = render(
      <Checkbox
        checked={false}
        label="Accept terms"
        onCheckedChange={() => {}}
      />,
    );
    expect(getByText("Accept terms")).toBeTruthy();
  });

  it("renders hint text", () => {
    const { getByText } = render(
      <Checkbox
        checked={false}
        hint="Read carefully"
        onCheckedChange={() => {}}
      />,
    );
    expect(getByText("Read carefully")).toBeTruthy();
  });

  it("renders error messages", () => {
    const { getByText } = render(
      <Checkbox
        checked={false}
        errorMessages="Required field"
        onCheckedChange={() => {}}
      />,
    );
    expect(getByText("Required field")).toBeTruthy();
  });

  it("shows indeterminate state", () => {
    const { container } = render(
      <Checkbox checked="indeterminate" onCheckedChange={() => {}} />,
    );
    expect(
      container
        .querySelector('[data-slot="checkbox"]')
        ?.getAttribute("data-state"),
    ).toBe("indeterminate");
  });

  it("shows indeterminate state via indeterminate prop", () => {
    const { container } = render(
      <Checkbox indeterminate onCheckedChange={() => {}} />,
    );
    expect(
      container
        .querySelector('[data-slot="checkbox"]')
        ?.getAttribute("data-state"),
    ).toBe("indeterminate");
  });

  it("disables when disabled", () => {
    const { container } = render(
      <Checkbox checked={false} disabled onCheckedChange={() => {}} />,
    );
    expect(
      container
        .querySelector('[data-slot="checkbox"]')
        ?.hasAttribute("disabled"),
    ).toBe(true);
  });

  it("applies size classes (sm)", () => {
    const { container } = render(
      <Checkbox checked={false} size="sm" onCheckedChange={() => {}} />,
    );
    const checkbox = container.querySelector('[data-slot="checkbox"]')!;
    expect(checkbox.className).toContain("size-3.5");
  });

  it("applies size classes (lg)", () => {
    const { container } = render(
      <Checkbox checked={false} size="lg" onCheckedChange={() => {}} />,
    );
    const checkbox = container.querySelector('[data-slot="checkbox"]')!;
    expect(checkbox.className).toContain("size-5");
  });

  it('renders indicator with data-slot="checkbox-indicator"', () => {
    const { container } = render(
      <Checkbox checked={true} onCheckedChange={() => {}} />,
    );
    expect(
      container.querySelector('[data-slot="checkbox-indicator"]'),
    ).toBeTruthy();
  });
});

describe("CheckboxGroup", () => {
  it('renders with data-slot="checkbox-group"', () => {
    const { container } = render(
      <CheckboxGroup value={[]} onValueChange={() => {}} />,
    );
    expect(
      container.querySelector('[data-slot="checkbox-group"]'),
    ).toBeTruthy();
  });

  it("renders label", () => {
    const { getByText } = render(
      <CheckboxGroup value={[]} label="Options" onValueChange={() => {}} />,
    );
    expect(getByText("Options")).toBeTruthy();
  });

  it("renders hint", () => {
    const { getByText } = render(
      <CheckboxGroup value={[]} hint="Choose any" onValueChange={() => {}} />,
    );
    expect(getByText("Choose any")).toBeTruthy();
  });

  it("renders error messages", () => {
    const { getByText } = render(
      <CheckboxGroup
        value={[]}
        errorMessages="At least one required"
        onValueChange={() => {}}
      />,
    );
    expect(getByText("At least one required")).toBeTruthy();
  });

  it("renders options as checkboxes", () => {
    const { container } = render(
      <CheckboxGroup
        value={[]}
        onValueChange={() => {}}
        options={[
          { label: "A", value: "a" },
          { label: "B", value: "b" },
        ]}
      />,
    );
    const checkboxes = container.querySelectorAll('[data-slot="checkbox"]');
    expect(checkboxes.length).toBe(2);
  });

  it("renders string options", () => {
    const { container } = render(
      <CheckboxGroup
        value={[]}
        onValueChange={() => {}}
        options={["x", "y"]}
      />,
    );
    const checkboxes = container.querySelectorAll('[data-slot="checkbox"]');
    expect(checkboxes.length).toBe(2);
  });

  it("emits onValueChange when checkbox toggled", () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <CheckboxGroup
        value={[]}
        onValueChange={onValueChange}
        options={[{ label: "A", value: "a" }]}
      />,
    );
    const checkbox = container.querySelector('[data-slot="checkbox"]')!;
    fireEvent.click(checkbox);
    expect(onValueChange).toHaveBeenCalledWith(["a"]);
  });

  it("disables all checkboxes when group disabled", () => {
    const { container } = render(
      <CheckboxGroup
        value={[]}
        disabled
        onValueChange={() => {}}
        options={[{ label: "A", value: "a" }]}
      />,
    );
    expect(
      container
        .querySelector('[data-slot="checkbox"]')
        ?.hasAttribute("disabled"),
    ).toBe(true);
  });

  it("marks option as checked when in value", () => {
    const { container } = render(
      <CheckboxGroup
        value={["a"]}
        onValueChange={() => {}}
        options={[{ label: "A", value: "a" }]}
      />,
    );
    expect(
      container
        .querySelector('[data-slot="checkbox"]')
        ?.getAttribute("data-state"),
    ).toBe("checked");
  });
});
