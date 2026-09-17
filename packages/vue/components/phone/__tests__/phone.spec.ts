import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { Phone } from "../index";

describe("Phone", () => {
  it("renders the iPhone geometry and preserves screen content by default", () => {
    const wrapper = mount(Phone, {
      slots: { default: '<img src="/app.png" alt="App screenshot">' },
      attachTo: document.body,
    });

    const root = wrapper.find('[data-slot="phone"]');
    expect(root.attributes("data-model")).toBe("iphone-17-pro");
    expect(root.attributes("role")).toBe("group");
    expect(wrapper.find('[data-slot="phone-chassis"]').exists()).toBe(true);
    expect(wrapper.find('[data-slot="phone-bezel"]').exists()).toBe(true);
    expect(wrapper.find('[data-slot="phone-screen"]').exists()).toBe(true);
    expect(wrapper.find('[data-slot="phone-island"]').exists()).toBe(true);
    expect(
      wrapper
        .find('[data-slot="phone-camera-control"][data-side="right"]')
        .exists(),
    ).toBe(true);
    expect(
      wrapper.findAll('[data-slot="phone-volume-button"][data-side="left"]'),
    ).toHaveLength(2);
    expect(wrapper.find('img[alt="App screenshot"]').exists()).toBe(true);
    wrapper.unmount();
  });

  it("uses the official iPhone chassis aspect ratio", () => {
    const wrapper = mount(Phone, {
      props: { model: "iphone-17-pro" },
      attachTo: document.body,
    });
    expect(
      (wrapper.find('[data-slot="phone-chassis"]').element as HTMLElement).style
        .aspectRatio,
    ).toBe("71.9 / 150");
    wrapper.unmount();
  });

  it("renders Galaxy controls on the right only", () => {
    const wrapper = mount(Phone, {
      props: { model: "galaxy-s26-ultra" },
      attachTo: document.body,
    });

    expect(wrapper.find('[data-slot="phone"]').attributes("data-model")).toBe(
      "galaxy-s26-ultra",
    );
    expect(
      (wrapper.find('[data-slot="phone-chassis"]').element as HTMLElement).style
        .aspectRatio,
    ).toBe("78.1 / 163.6");
    expect(wrapper.find('[data-slot="phone-camera"]').exists()).toBe(true);
    expect(
      wrapper
        .find('[data-slot="phone-volume-button"][data-side="right"]')
        .exists(),
    ).toBe(true);
    expect(
      wrapper
        .find('[data-slot="phone-side-button"][data-side="right"]')
        .exists(),
    ).toBe(true);
    expect(wrapper.find('[data-side="left"]').exists()).toBe(false);
    expect(wrapper.find('[data-slot="phone-camera-control"]').exists()).toBe(
      false,
    );
    wrapper.unmount();
  });

  it("keeps the deprecated android variant working", () => {
    const wrapper = mount(Phone, {
      props: { variant: "android" },
      attachTo: document.body,
    });
    expect(wrapper.find('[data-slot="phone"]').attributes("data-model")).toBe(
      "galaxy-s26-ultra",
    );
    wrapper.unmount();
  });

  it("uses the selected size as the chassis width without wrapper padding", () => {
    const wrapper = mount(Phone, {
      props: { size: "lg" },
      attachTo: document.body,
    });
    expect(wrapper.find('[data-slot="phone"]').classes()).toContain(
      "w-[340px]",
    );
    expect(wrapper.find('[data-slot="phone"]').classes()).not.toContain("px-1");
    wrapper.unmount();
  });
});
