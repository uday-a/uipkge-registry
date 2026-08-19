import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { h } from "vue";
import Dock from "../Dock.vue";

describe("Dock (Vue)", () => {
  const dummyIcon = () => h("svg");
  const items = [
    { id: "1", label: "Home", icon: dummyIcon },
    { id: "2", label: "Search", icon: dummyIcon },
  ];

  it('renders container with data-slot="dock"', () => {
    const wrapper = mount(Dock, {
      props: { items },
    });
    expect(wrapper.find('[data-slot="dock"]').exists()).toBe(true);
    wrapper.unmount();
  });

  it("renders dock items with accessible labels", () => {
    const wrapper = mount(Dock, {
      props: { items },
    });
    const dockItems = wrapper.findAll('[data-slot="dock-item"]');
    expect(dockItems.length).toBe(2);
    expect(dockItems[0].attributes("aria-label")).toBe("Home");
    expect(dockItems[1].attributes("aria-label")).toBe("Search");
    wrapper.unmount();
  });
});
