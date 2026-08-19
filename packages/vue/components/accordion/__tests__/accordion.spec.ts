import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../index";

function mountAccordion(overrides: Record<string, unknown> = {}) {
  return mount(
    {
      components: {
        Accordion,
        AccordionItem,
        AccordionTrigger,
        AccordionContent,
      },
      template:
        '<Accordion :default-value="val"><AccordionItem value="item1"><AccordionTrigger>Section 1</AccordionTrigger><AccordionContent>Content 1</AccordionContent></AccordionItem></Accordion>',
      data() {
        return { val: overrides.defaultValue ?? "item1" };
      },
    },
    { attachTo: document.body },
  );
}

describe("Accordion", () => {
  it('renders with data-slot="accordion"', () => {
    const w = mountAccordion();
    expect(w.find('[data-slot="accordion"]').exists()).toBe(true);
    w.unmount();
  });

  it("has data-uipkge", () => {
    const w = mountAccordion();
    expect(
      w.find('[data-slot="accordion"]').attributes("data-uipkge"),
    ).toBeDefined();
    w.unmount();
  });

  it('AccordionItem renders with data-slot="accordion-item"', () => {
    const w = mountAccordion();
    expect(w.find('[data-slot="accordion-item"]').exists()).toBe(true);
    w.unmount();
  });

  it('AccordionTrigger renders with data-slot="accordion-trigger"', () => {
    const w = mountAccordion();
    expect(w.find('[data-slot="accordion-trigger"]').exists()).toBe(true);
    w.unmount();
  });

  it('AccordionContent renders with data-slot="accordion-content"', () => {
    const w = mountAccordion();
    expect(w.find('[data-slot="accordion-content"]').exists()).toBe(true);
    w.unmount();
  });

  it('AccordionTrigger has role="button" or is a button', () => {
    const w = mountAccordion();
    const trigger = w.find('[data-slot="accordion-trigger"]');
    expect(
      trigger.attributes("role") === "button" ||
        trigger.element.tagName.toLowerCase() === "button",
    ).toBe(true);
    w.unmount();
  });

  it('AccordionTrigger shows data-state="open" when open', () => {
    const w = mountAccordion({ defaultValue: "item1" });
    const trigger = w.find('[data-slot="accordion-trigger"]');
    expect(trigger.attributes("data-state")).toBe("open");
    w.unmount();
  });

  it('AccordionTrigger shows data-state="closed" when closed', () => {
    const w = mountAccordion({ defaultValue: "" });
    const trigger = w.find('[data-slot="accordion-trigger"]');
    expect(trigger.attributes("data-state")).toBe("closed");
    w.unmount();
  });

  it("AccordionTrigger renders chevron icon (svg)", () => {
    const w = mountAccordion();
    const trigger = w.find('[data-slot="accordion-trigger"]');
    expect(trigger.find("svg").exists()).toBe(true);
    w.unmount();
  });

  it("AccordionContent renders slot content when open", () => {
    const w = mountAccordion({ defaultValue: "item1" });
    const content = w.find('[data-slot="accordion-content"]');
    expect(content.text()).toContain("Content 1");
    w.unmount();
  });

  it("Accordion applies data-variant attribute", () => {
    const w = mount(
      {
        components: {
          Accordion,
          AccordionItem,
          AccordionTrigger,
          AccordionContent,
        },
        template:
          '<Accordion variant="separated" :default-value="val"><AccordionItem value="item1"><AccordionTrigger>Section 1</AccordionTrigger><AccordionContent>Content 1</AccordionContent></AccordionItem></Accordion>',
        data() {
          return { val: "item1" };
        },
      },
      { attachTo: document.body },
    );
    expect(w.find('[data-slot="accordion"]').attributes("data-variant")).toBe(
      "separated",
    );
    w.unmount();
  });

  it("AccordionTrigger renders slot text", () => {
    const w = mountAccordion();
    const trigger = w.find('[data-slot="accordion-trigger"]');
    expect(trigger.text()).toContain("Section 1");
    w.unmount();
  });
});
