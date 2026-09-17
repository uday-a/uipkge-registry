import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { TagsInput } from "../tags-input";

describe("TagsInput", () => {
  it('renders with data-slot="tags-input"', () => {
    const { container } = render(
      <TagsInput value={["tag1"]} onValueChange={() => {}} />,
    );
    expect(container.querySelector('[data-slot="tags-input"]')).toBeTruthy();
  });

  it("renders input", () => {
    const { container } = render(
      <TagsInput value={[]} onValueChange={() => {}} />,
    );
    expect(container.querySelector("input")).toBeTruthy();
  });

  it("renders placeholder", () => {
    const { container } = render(
      <TagsInput
        value={[]}
        placeholder="Add tag..."
        onValueChange={() => {}}
      />,
    );
    expect(container.querySelector("input")?.getAttribute("placeholder")).toBe(
      "Add tag...",
    );
  });

  it("renders existing tags", () => {
    const { container } = render(
      <TagsInput value={["tag1", "tag2"]} onValueChange={() => {}} />,
    );
    expect(container.textContent).toContain("tag1");
    expect(container.textContent).toContain("tag2");
  });

  it("removes tag when delete button clicked", () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <TagsInput value={["tag1", "tag2"]} onValueChange={onValueChange} />,
    );
    const deleteBtn = container.querySelector(
      '[data-slot="tags-input-item-delete"]',
    )!;
    fireEvent.click(deleteBtn);
    expect(onValueChange).toHaveBeenCalledWith(["tag2"]);
  });

  it("calls onValueChange when adding tag", () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <TagsInput value={[]} onValueChange={onValueChange} />,
    );
    const input = container.querySelector("input")!;
    fireEvent.change(input, { target: { value: "newtag" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onValueChange).toHaveBeenCalledWith(["newtag"]);
  });

  it("uses defaultValue when uncontrolled", () => {
    const { getByText } = render(<TagsInput defaultValue={["default-tag"]} />);
    expect(getByText("default-tag")).toBeTruthy();
  });

  it("disables when disabled", () => {
    const { container } = render(
      <TagsInput value={["tag1"]} disabled onValueChange={() => {}} />,
    );
    expect(
      container.querySelector('[data-slot="tags-input"]')?.className,
    ).toContain("opacity-50");
  });

  it("does not render input when disabled", () => {
    const { container } = render(
      <TagsInput value={["tag1"]} disabled onValueChange={() => {}} />,
    );
    expect(container.querySelector("input")).toBeNull();
  });

  it("renders tag items with data-slot", () => {
    const { container } = render(
      <TagsInput value={["tag1", "tag2"]} onValueChange={() => {}} />,
    );
    expect(
      container.querySelectorAll('[data-slot="tags-input-item"]').length,
    ).toBe(2);
  });

  it("removes last tag on backspace when input empty", () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <TagsInput value={["tag1", "tag2"]} onValueChange={onValueChange} />,
    );
    const input = container.querySelector("input")!;
    fireEvent.keyDown(input, { key: "Backspace" });
    expect(onValueChange).toHaveBeenCalledWith(["tag1"]);
  });

  it("rejects duplicate tags by default", () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <TagsInput value={["tag1"]} onValueChange={onValueChange} />,
    );
    const input = container.querySelector("input")!;
    fireEvent.change(input, { target: { value: "tag1" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
