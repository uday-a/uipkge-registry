import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { Attachment } from "../index";

describe("Attachment", () => {
  it('renders with data-slot="attachment"', () => {
    const w = mount(Attachment, {
      props: { title: "notes.pdf" },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="attachment"]').exists()).toBe(true);
    w.unmount();
  });

  it("shows title and description", () => {
    const w = mount(Attachment, {
      props: { title: "notes.pdf", description: "PDF · 2.4 MB" },
      attachTo: document.body,
    });
    expect(w.text()).toContain("notes.pdf");
    expect(w.text()).toContain("PDF · 2.4 MB");
    w.unmount();
  });

  it("sets state from the state prop", () => {
    const w = mount(Attachment, {
      props: { title: "a", state: "uploading" },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="attachment"]').attributes("data-state")).toBe(
      "uploading",
    );
    w.unmount();
  });

  it("sets size and orientation from props", () => {
    const w = mount(Attachment, {
      props: { title: "a", size: "xs", orientation: "vertical" },
      attachTo: document.body,
    });
    const el = w.find('[data-slot="attachment"]');
    expect(el.attributes("data-size")).toBe("xs");
    expect(el.attributes("data-orientation")).toBe("vertical");
    w.unmount();
  });

  it("emits remove when removable", async () => {
    const w = mount(Attachment, {
      props: { title: "notes.pdf", removable: true },
      attachTo: document.body,
    });
    await w.find('[data-slot="attachment-remove"]').trigger("click");
    expect(w.emitted("remove")).toHaveLength(1);
    w.unmount();
  });
});
