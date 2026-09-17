import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { VirtualList } from "../index";

const items = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  label: `Item ${i}`,
}));

function mountVirtualList(props: Record<string, unknown> = {}) {
  return mount(
    {
      components: { VirtualList },
      template: `
        <VirtualList
          :items="items"
          :item-size="itemSize"
          :height="height"
          :direction="direction"
          :overscan="overscan"
        >
          <template #default="{ item }">
            <div>{{ item.label }}</div>
          </template>
        </VirtualList>`,
      data() {
        return {
          items: props.items ?? items,
          itemSize: props.itemSize ?? 40,
          height: props.height ?? 200,
          direction: props.direction ?? "vertical",
          overscan: props.overscan ?? 3,
        };
      },
    },
    { attachTo: document.body },
  );
}

describe("VirtualList", () => {
  it('renders container with data-slot="virtual-list"', () => {
    const w = mountVirtualList();
    expect(w.find('[data-slot="virtual-list"]').exists()).toBe(true);
    w.unmount();
  });

  it("has data-uipkge on container", () => {
    const w = mountVirtualList();
    expect(
      w.find('[data-slot="virtual-list"]').attributes("data-uipkge"),
    ).toBeDefined();
    w.unmount();
  });

  it("renders visible items (not all 100)", () => {
    const w = mountVirtualList();
    const rendered = w.findAll('[data-slot="virtual-list"] > div > div > div');
    expect(rendered.length).toBeGreaterThan(0);
    expect(rendered.length).toBeLessThan(100);
    w.unmount();
  });

  it("applies vertical styles by default (height set)", () => {
    const w = mountVirtualList({ height: 300 });
    const el = w.find('[data-slot="virtual-list"]').element as HTMLElement;
    expect(el.style.height).toBe("300px");
    w.unmount();
  });

  it("applies horizontal styles when direction is horizontal", () => {
    const w = mountVirtualList({ direction: "horizontal", height: 400 });
    const el = w.find('[data-slot="virtual-list"]').element as HTMLElement;
    expect(el.style.width).toBe("400px");
    w.unmount();
  });

  it("renders item content via slot", () => {
    const w = mountVirtualList();
    expect(w.text()).toContain("Item 0");
    w.unmount();
  });

  it("emits scroll event on scroll", async () => {
    const w = mountVirtualList();
    await w.find('[data-slot="virtual-list"]').trigger("scroll");
    expect(w.emitted("scroll")).toBeTruthy();
    w.unmount();
  });
});
