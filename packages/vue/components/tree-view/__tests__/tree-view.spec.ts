import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { TreeView } from "../index";

const items = [
  {
    id: "1",
    label: "Folder 1",
    children: [{ id: "1-1", label: "File 1" }],
  },
  { id: "2", label: "Folder 2" },
];

function mountTreeView(props: Record<string, unknown> = {}) {
  return mount(TreeView, {
    props: { items, ...props },
    attachTo: document.body,
  });
}

describe("TreeView", () => {
  it('renders with role="tree"', () => {
    const w = mountTreeView();
    expect(w.find('[role="tree"]').exists()).toBe(true);
    w.unmount();
  });

  it("renders treeitem elements for each item", () => {
    const w = mountTreeView();
    expect(w.findAll('[role="treeitem"]').length).toBe(2);
    w.unmount();
  });

  it("renders item labels", () => {
    const w = mountTreeView();
    expect(w.text()).toContain("Folder 1");
    expect(w.text()).toContain("Folder 2");
    w.unmount();
  });

  it("shows expand/collapse chevron for items with children", () => {
    const w = mountTreeView();
    const treeitems = w.findAll('[role="treeitem"]');
    // Folder 1 has children -> chevron button present
    expect(treeitems[0].find('button[aria-label="Expand"]').exists()).toBe(
      true,
    );
    // Folder 2 has no children -> no chevron button
    expect(treeitems[1].find('button[aria-label="Expand"]').exists()).toBe(
      false,
    );
    w.unmount();
  });

  it("expands items when chevron is clicked", async () => {
    const w = mountTreeView();
    expect(w.text()).not.toContain("File 1");
    const chevron = w.find('button[aria-label="Expand"]');
    await chevron.trigger("click");
    expect(w.text()).toContain("File 1");
    w.unmount();
  });

  it("shows icons when showIcons is true", () => {
    const w = mountTreeView({ showIcons: true });
    // Icons render as svg (lucide-vue-next components)
    expect(w.findAll("svg").length).toBeGreaterThan(0);
    w.unmount();
  });

  it("hides icons when showIcons is false", () => {
    const w = mountTreeView({ showIcons: false });
    // Chevron svgs still render for parent items, but file/folder icons are absent.
    // With icons on: 2 file/folder icons + 1 chevron = 3 svgs.
    // With icons off: only 1 chevron svg.
    expect(w.findAll("svg").length).toBe(1);
    w.unmount();
  });

  it("disables items when disabled is true", () => {
    const w = mountTreeView({
      items: [
        { id: "1", label: "Folder 1", disabled: true },
        { id: "2", label: "Folder 2" },
      ],
    });
    const rows = w.findAll("[data-tree-row]");
    expect(rows[0].attributes("data-disabled")).toBe("true");
    expect(rows[0].attributes("tabindex")).toBe("-1");
    expect(rows[1].attributes("data-disabled")).toBeUndefined();
    w.unmount();
  });

  it("renders nested children when expanded", async () => {
    const w = mountTreeView({ defaultExpanded: true });
    await nextTick();
    expect(w.findAll('[role="treeitem"]').length).toBe(3);
    expect(w.text()).toContain("File 1");
    w.unmount();
  });

  it("renders nested children inside a group role", async () => {
    const w = mountTreeView({ defaultExpanded: true });
    await nextTick();
    expect(w.find('[role="group"]').exists()).toBe(true);
    w.unmount();
  });
});
