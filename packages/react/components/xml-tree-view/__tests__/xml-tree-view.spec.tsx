import { describe, expect, it } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { XmlTreeView } from "../index";

const xml = "<catalog><book><title>Example</title></book></catalog>";

describe("XmlTreeView layout", () => {
  it("contains a max-height tree inside its own scroll region", () => {
    const { container } = render(<XmlTreeView data={xml} />);
    const root = container.querySelector('[data-slot="xml-tree-view"]')!;
    const tree = container.querySelector('[role="tree"]')!;

    expect(root.classList.contains("flex")).toBe(true);
    expect(root.classList.contains("flex-col")).toBe(true);
    expect(root.classList.contains("overflow-hidden")).toBe(true);
    expect(tree.classList.contains("min-h-0")).toBe(true);
    expect(tree.classList.contains("flex-1")).toBe(true);
    expect(tree.classList.contains("overflow-auto")).toBe(true);
  });

  it("does not insert a path row when a tree row is hovered", () => {
    const { container } = render(<XmlTreeView data={xml} />);
    const root = container.querySelector('[data-slot="xml-tree-view"]')!;
    const childCount = root.children.length;

    fireEvent.mouseEnter(container.querySelector("[data-tree-row]")!);

    expect(root.children.length).toBe(childCount);
  });
});
