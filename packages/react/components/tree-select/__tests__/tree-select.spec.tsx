import { describe, it, expect, afterEach } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { TreeSelect } from "../index";
import type { TreeSelectNode as TreeNode } from "../types";

afterEach(() => {
  cleanup();
  document.body.innerHTML = "";
});

const data: TreeNode[] = [
  {
    value: "fruits",
    label: "Fruits",
    children: [
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana" },
    ],
  },
  {
    value: "vegs",
    label: "Vegetables",
    children: [
      { value: "carrot", label: "Carrot" },
      { value: "potato", label: "Potato" },
    ],
  },
];

describe("TreeSelect", () => {
  it('renders container with data-slot="tree-select"', () => {
    const { container } = render(<TreeSelect data={data} />);
    expect(container.querySelector('[data-slot="tree-select"]')).toBeTruthy();
  });

  it("has data-uipkge on trigger", () => {
    const { container } = render(<TreeSelect data={data} />);
    expect(
      container
        .querySelector('[data-slot="tree-select"]')
        ?.hasAttribute("data-uipkge"),
    ).toBe(true);
  });

  it("renders trigger button with combobox role", () => {
    const { container } = render(<TreeSelect data={data} />);
    const trigger = container.querySelector('[data-slot="tree-select"]');
    expect(trigger?.tagName.toLowerCase()).toBe("button");
    expect(trigger?.getAttribute("role")).toBe("combobox");
  });

  it("renders placeholder text when no value selected", () => {
    const { container } = render(
      <TreeSelect data={data} placeholder="Pick an item" />,
    );
    expect(container.textContent).toContain("Pick an item");
  });

  it("renders tree options when open", async () => {
    const { container } = render(<TreeSelect data={data} defaultExpandAll />);
    fireEvent.click(container.querySelector('[data-slot="tree-select"]')!);
    const tree = document.querySelector('[role="tree"]');
    expect(tree).toBeTruthy();
    const rows = document.querySelectorAll("[data-tree-row]");
    expect(rows.length).toBeGreaterThanOrEqual(2);
  });

  it("supports multiple selection with checkboxes", () => {
    const { container } = render(
      <TreeSelect data={data} multiple defaultExpandAll />,
    );
    fireEvent.click(container.querySelector('[data-slot="tree-select"]')!);
    const checkboxes = document.querySelectorAll(
      '[role="tree"] input[type="checkbox"]',
    );
    expect(checkboxes.length).toBeGreaterThan(0);
  });

  it("disables trigger when disabled is true", () => {
    const { container } = render(<TreeSelect data={data} disabled />);
    expect(
      container
        .querySelector('[data-slot="tree-select"]')
        ?.hasAttribute("disabled"),
    ).toBe(true);
  });
});
