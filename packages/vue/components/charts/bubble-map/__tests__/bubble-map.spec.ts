import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { BubbleMap } from "../index";

describe("BubbleMap", () => {
  const sampleProps = {
    bubbles: [{ id: "1", name: "Node", lat: 0, lng: 0, value: 10 }],
  };

  it("renders without crashing", () => {
    const wrapper = mount(BubbleMap, {
      props: sampleProps,
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.element).toBeDefined();
    wrapper.unmount();
  });

  it("renders expected content or unique feature", () => {
    const wrapper = mount(BubbleMap, {
      props: {
        ...sampleProps,
        class: "custom-chart-test",
        height: 380,
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.classes()).toContain("custom-chart-test");
    wrapper.unmount();
  });
});
