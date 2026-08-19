import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { ToggleGroup, ToggleGroupItem } from "../toggle-group";

describe("ToggleGroup", () => {
  it('renders with data-slot="toggle-group"', () => {
    const { container } = render(
      <ToggleGroup type="single" value="" onValueChange={() => {}}>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
      </ToggleGroup>,
    );
    expect(container.querySelector('[data-slot="toggle-group"]')).toBeTruthy();
  });

  it("renders items", () => {
    const { container } = render(
      <ToggleGroup type="single" value="" onValueChange={() => {}}>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>,
    );
    expect(
      container.querySelectorAll('[data-slot="toggle-group-item"]').length,
    ).toBe(2);
  });

  it("renders item slot content", () => {
    const { getByText } = render(
      <ToggleGroup type="single" value="" onValueChange={() => {}}>
        <ToggleGroupItem value="a">Item A</ToggleGroupItem>
      </ToggleGroup>,
    );
    expect(getByText("Item A")).toBeTruthy();
  });

  it("shows indicator for single-select", () => {
    const { container } = render(
      <ToggleGroup type="single" value="a" onValueChange={() => {}}>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
      </ToggleGroup>,
    );
    expect(
      container.querySelector('[data-slot="toggle-group-indicator"]'),
    ).toBeTruthy();
  });

  it("applies data-size", () => {
    const { container } = render(
      <ToggleGroup type="single" value="" size="sm" onValueChange={() => {}}>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
      </ToggleGroup>,
    );
    expect(
      container
        .querySelector('[data-slot="toggle-group"]')
        ?.getAttribute("data-size"),
    ).toBe("sm");
  });

  it("applies data-variant", () => {
    const { container } = render(
      <ToggleGroup
        type="single"
        value=""
        variant="outline"
        onValueChange={() => {}}
      >
        <ToggleGroupItem value="a">A</ToggleGroupItem>
      </ToggleGroup>,
    );
    expect(
      container
        .querySelector('[data-slot="toggle-group"]')
        ?.getAttribute("data-variant"),
    ).toBe("outline");
  });

  it("disables items when group disabled", () => {
    const { container } = render(
      <ToggleGroup type="single" value="" disabled onValueChange={() => {}}>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
      </ToggleGroup>,
    );
    expect(
      container
        .querySelector('[data-slot="toggle-group-item"]')
        ?.hasAttribute("disabled"),
    ).toBe(true);
  });

  it("supports multiple type", () => {
    const { container } = render(
      <ToggleGroup type="multiple" value={[]} onValueChange={() => {}}>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>,
    );
    expect(container.querySelector('[data-slot="toggle-group"]')).toBeTruthy();
    expect(
      container.querySelectorAll('[data-slot="toggle-group-item"]').length,
    ).toBe(2);
  });

  it("does not show indicator for multiple type by default", () => {
    const { container } = render(
      <ToggleGroup type="multiple" value={["a"]} onValueChange={() => {}}>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
      </ToggleGroup>,
    );
    expect(
      container.querySelector('[data-slot="toggle-group-indicator"]'),
    ).toBeNull();
  });

  it("emits onValueChange when item clicked (single)", () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <ToggleGroup type="single" value="" onValueChange={onValueChange}>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
      </ToggleGroup>,
    );
    const item = container.querySelector('[data-slot="toggle-group-item"]')!;
    fireEvent.click(item);
    expect(onValueChange).toHaveBeenCalled();
  });

  it("marks item as on when selected (single)", () => {
    const { container } = render(
      <ToggleGroup type="single" value="a" onValueChange={() => {}}>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>,
    );
    const items = container.querySelectorAll('[data-slot="toggle-group-item"]');
    expect(items[0].getAttribute("data-state")).toBe("on");
    expect(items[1].getAttribute("data-state")).toBe("off");
  });
});
