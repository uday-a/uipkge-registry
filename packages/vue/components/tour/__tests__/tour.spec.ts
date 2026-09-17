import { describe, it, expect, afterEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { Tour } from "../index";
import type { TourStep } from "../index";

afterEach(() => {
  document.body.innerHTML = "";
});

const steps: TourStep[] = [
  { title: "Welcome", description: "Get started with the app" },
  { title: "Features", description: "Explore the features" },
  { title: "Finish", description: "You are all set" },
];

function mountTour(props: Record<string, unknown> = {}) {
  return mount(
    {
      components: { Tour },
      data() {
        return {
          open: props.open ?? false,
          current: props.current ?? 0,
          ...props,
        };
      },
      template: `
        <div>
          <button data-testid="trigger" @click="open = true">Start Tour</button>
          <Tour
            :open="open"
            :current="current"
            :steps="tourSteps"
            :mask="mask"
            :type="type"
            @update:open="open = $event"
            @update:current="current = $event"
          />
        </div>
      `,
      computed: {
        tourSteps: () => props.steps ?? steps,
        mask: () => props.mask ?? true,
        type: () => props.type ?? "default",
      },
    },
    { attachTo: document.body },
  );
}

describe("Tour", () => {
  it("renders trigger button", () => {
    const w = mountTour();
    expect(w.find('[data-testid="trigger"]').exists()).toBe(true);
    w.unmount();
  });

  it("opens tour card when open is true", async () => {
    const w = mountTour({ open: true });
    await flushPromises();
    expect(document.querySelector('[data-slot="tour-card"]')).toBeTruthy();
    w.unmount();
  });

  it("renders step title", async () => {
    const w = mountTour({ open: true });
    await flushPromises();
    expect(document.body.textContent).toContain("Welcome");
    w.unmount();
  });

  it("renders step description", async () => {
    const w = mountTour({ open: true });
    await flushPromises();
    expect(document.body.textContent).toContain("Get started with the app");
    w.unmount();
  });

  it("renders close button with aria-label", async () => {
    const w = mountTour({ open: true });
    await flushPromises();
    const closeBtn = document.querySelector('button[aria-label="Close tour"]');
    expect(closeBtn).toBeTruthy();
    w.unmount();
  });

  it("renders next button on first step", async () => {
    const w = mountTour({ open: true, current: 0 });
    await flushPromises();
    const buttons = document.querySelectorAll("button");
    const texts = Array.from(buttons).map((b) => b.textContent?.trim());
    expect(texts).toContain("Next");
    w.unmount();
  });

  it("renders prev button on non-first step", async () => {
    const w = mountTour({ open: true, current: 1 });
    await flushPromises();
    const buttons = document.querySelectorAll("button");
    const texts = Array.from(buttons).map((b) => b.textContent?.trim());
    expect(texts).toContain("Previous");
    w.unmount();
  });

  it("renders finish button on last step", async () => {
    const w = mountTour({ open: true, current: 2 });
    await flushPromises();
    const buttons = document.querySelectorAll("button");
    const texts = Array.from(buttons).map((b) => b.textContent?.trim());
    expect(texts).toContain("Finish");
    w.unmount();
  });

  it("shows step counter", async () => {
    const w = mountTour({ open: true, current: 0 });
    await flushPromises();
    expect(document.body.textContent).toContain("1 / 3");
    w.unmount();
  });

  it("does not render card when closed", () => {
    const w = mountTour({ open: false });
    expect(document.querySelector('[data-slot="tour-card"]')).toBeNull();
    w.unmount();
  });
});
