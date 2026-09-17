import { describe, it, expect } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { Plus, Mail, Share } from "lucide-vue-next";
import { SpeedDial, type SpeedDialAction } from "../index";

const actions: SpeedDialAction[] = [
  { icon: Mail, label: "Email" },
  { icon: Share, label: "Share" },
];

function mountSpeedDial(props: Record<string, unknown> = {}) {
  return mount(SpeedDial, {
    props: { actions, ...props },
    attachTo: document.body,
  });
}

describe("SpeedDial", () => {
  it('renders a trigger with data-slot="speed-dial" and data-uipkge', () => {
    const w = mountSpeedDial();
    const trigger = w.find('[data-slot="speed-dial"]');
    expect(trigger.exists()).toBe(true);
    expect(trigger.attributes("data-uipkge")).toBeDefined();
    w.unmount();
  });

  it("renders the main FAB trigger button", () => {
    const w = mountSpeedDial();
    expect(w.find('[data-slot="fab"]').exists()).toBe(true);
    w.unmount();
  });

  it("renders default Plus icon when no icon prop given", () => {
    const w = mountSpeedDial();
    expect(w.findComponent(Plus).exists()).toBe(true);
    w.unmount();
  });

  it("renders action items when popover is open", async () => {
    const w = mountSpeedDial();
    await w.find('[data-slot="fab"]').trigger("click");
    await flushPromises();
    const actionButtons = document.body.querySelectorAll(
      '[data-slot="speed-dial-action"]',
    );
    expect(actionButtons.length).toBe(2);
    w.unmount();
  });

  it("action items have aria-label from action label", async () => {
    const w = mountSpeedDial();
    await w.find('[data-slot="fab"]').trigger("click");
    await flushPromises();
    const labels = Array.from(
      document.body.querySelectorAll('[data-slot="speed-dial-action"]'),
    ).map((b) => b.getAttribute("aria-label"));
    expect(labels).toEqual(["Email", "Share"]);
    w.unmount();
  });

  it("action items render icons", async () => {
    const w = mountSpeedDial();
    await w.find('[data-slot="fab"]').trigger("click");
    await flushPromises();
    const actionButtons = document.body.querySelectorAll(
      '[data-slot="speed-dial-action"]',
    );
    // Each action button should contain an svg icon
    actionButtons.forEach((btn) => {
      expect(btn.querySelector("svg")).toBeTruthy();
    });
    w.unmount();
  });

  it("renders custom icon when icon prop is provided", () => {
    const w = mountSpeedDial({ icon: Mail });
    expect(w.findComponent(Mail).exists()).toBe(true);
    expect(w.findComponent(Plus).exists()).toBe(false);
    w.unmount();
  });
});
