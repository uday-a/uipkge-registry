import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { h } from "vue";
import { Plus } from "lucide-vue-next";
import { Fab } from "../index";

function mountFab(
  props: Record<string, unknown> = {},
  slots: Record<string, unknown> = {},
) {
  return mount(Fab, { props, slots, attachTo: document.body });
}

describe("Fab", () => {
  it("renders a button element", () => {
    const w = mountFab({});
    expect(w.find("button").exists()).toBe(true);
    w.unmount();
  });

  it('has data-slot="fab" and data-uipkge', () => {
    const w = mountFab({});
    const el = w.find('[data-slot="fab"]');
    expect(el.exists()).toBe(true);
    expect(el.attributes("data-uipkge")).toBeDefined();
    w.unmount();
  });

  it("applies data-position attribute", () => {
    const w = mountFab({ position: "top-left" });
    expect(w.find('[data-slot="fab"]').attributes("data-position")).toBe(
      "top-left",
    );
    w.unmount();
  });

  it("applies data-variant attribute", () => {
    const w = mountFab({ variant: "destructive" });
    expect(w.find('[data-slot="fab"]').attributes("data-variant")).toBe(
      "destructive",
    );
    w.unmount();
  });

  it("renders icon from default slot", () => {
    const w = mountFab({}, { default: () => h(Plus) });
    expect(w.findComponent(Plus).exists()).toBe(true);
    w.unmount();
  });

  it("emits click event when clicked", async () => {
    const w = mountFab({});
    await w.find("button").trigger("click");
    expect(w.emitted("click")).toBeTruthy();
    w.unmount();
  });

  it("does not emit click when disabled", async () => {
    const w = mountFab({ disabled: true });
    await w.find("button").trigger("click");
    expect(w.emitted("click")).toBeFalsy();
    w.unmount();
  });
});
