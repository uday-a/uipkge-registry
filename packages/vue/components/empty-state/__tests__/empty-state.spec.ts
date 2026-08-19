import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { markRaw, defineComponent, h } from "vue";
import { EmptyState } from "../index";

const TestIcon = markRaw(
  defineComponent({
    name: "TestIcon",
    render() {
      return h("svg", { "data-testid": "test-icon" });
    },
  }),
);

describe("EmptyState", () => {
  it("renders a container div", () => {
    const w = mount(EmptyState, { attachTo: document.body });
    expect(w.find("div").exists()).toBe(true);
    w.unmount();
  });

  it("renders icon when icon prop is provided", () => {
    const w = mount(EmptyState, {
      props: { icon: TestIcon },
      attachTo: document.body,
    });
    expect(w.find('[data-testid="test-icon"]').exists()).toBe(true);
    w.unmount();
  });

  it("renders title text when title prop is provided", () => {
    const w = mount(EmptyState, {
      props: { title: "No results" },
      attachTo: document.body,
    });
    expect(w.text()).toContain("No results");
    expect(w.find("h3").exists()).toBe(true);
    w.unmount();
  });

  it("renders description text when description prop is provided", () => {
    const w = mount(EmptyState, {
      props: { description: "Try adjusting filters" },
      attachTo: document.body,
    });
    expect(w.text()).toContain("Try adjusting filters");
    w.unmount();
  });

  it("renders action button via default slot", () => {
    const w = mount(EmptyState, {
      slots: { default: "<button>Action</button>" },
      attachTo: document.body,
    });
    expect(w.find("button").exists()).toBe(true);
    expect(w.text()).toContain("Action");
    w.unmount();
  });

  it('has role="status" by default', () => {
    const w = mount(EmptyState, { attachTo: document.body });
    expect(w.find("div").attributes("role")).toBe("status");
    w.unmount();
  });

  it("uses custom heading tag when headingTag prop is set", () => {
    const w = mount(EmptyState, {
      props: { title: "Title", headingTag: "h2" },
      attachTo: document.body,
    });
    expect(w.find("h2").exists()).toBe(true);
    w.unmount();
  });
});
