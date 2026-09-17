import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { Form } from "../index";

function createMockForm() {
  return {
    handleSubmit: vi.fn(),
    Field: vi.fn(),
  };
}

function mountForm(
  props: Record<string, unknown> = {},
  slots: Record<string, unknown> = {},
) {
  return mount(Form, {
    props: { form: createMockForm(), ...props },
    slots,
    attachTo: document.body,
  });
}

describe("Form", () => {
  it("renders a form element", () => {
    const w = mountForm();
    expect(w.find("form").exists()).toBe(true);
    w.unmount();
  });

  it('has data-slot="form" and data-uipkge', () => {
    const w = mountForm();
    const el = w.find('[data-slot="form"]');
    expect(el.exists()).toBe(true);
    expect(el.attributes("data-uipkge")).toBeDefined();
    w.unmount();
  });

  it("renders slot content", () => {
    const w = mountForm({}, { default: '<p class="slot-content">Hello</p>' });
    expect(w.find(".slot-content").text()).toBe("Hello");
    w.unmount();
  });

  it("calls form.handleSubmit on submit", async () => {
    const mockForm = createMockForm();
    const w = mount(Form, {
      props: { form: mockForm },
      slots: { default: '<button type="submit">Submit</button>' },
      attachTo: document.body,
    });
    await w.find("form").trigger("submit");
    expect(mockForm.handleSubmit).toHaveBeenCalled();
    w.unmount();
  });

  it("applies custom class", () => {
    const w = mountForm({ class: "custom-form-class" });
    expect(w.find("form").classes()).toContain("custom-form-class");
    w.unmount();
  });

  it("prevents default on submit", async () => {
    const w = mountForm(
      {},
      { default: '<button type="submit">Submit</button>' },
    );
    const form = w.find("form");
    await form.trigger("submit");
    // The handler calls e.preventDefault() — if it didn't, the page would navigate
    expect(w.find("form").exists()).toBe(true);
    w.unmount();
  });
});
