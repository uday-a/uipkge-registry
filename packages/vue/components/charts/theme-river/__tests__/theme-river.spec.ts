import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { ThemeRiver } from "../index";

describe("ThemeRiver", () => {
  const sampleProps = { data: [["2024-01-01", 10, "Theme1"]] };

  it("renders without crashing", () => {
    const wrapper = mount(ThemeRiver, {
      props: sampleProps,
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.element).toBeDefined();
    wrapper.unmount();
  });

  it("renders expected content or unique feature", () => {
    const wrapper = mount(ThemeRiver, {
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
