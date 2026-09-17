import { describe, it, expect } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { nextTick } from "vue";
import { Mentions, type MentionOption } from "../index";

const options: MentionOption[] = [
  { value: "alice", label: "Alice" },
  { value: "bob", label: "Bob" },
];

function mountMentions(props: Record<string, unknown> = {}) {
  return mount(Mentions, {
    props: { options, ...props },
    attachTo: document.body,
  });
}

async function typeInMentions(
  w: ReturnType<typeof mountMentions>,
  text: string,
) {
  const ta = w.find("textarea").element as HTMLTextAreaElement;
  ta.value = text;
  ta.selectionStart = text.length;
  await w.find("textarea").trigger("input");
  await flushPromises();
  await nextTick();
}

describe("Mentions", () => {
  it("renders a textarea input", () => {
    const w = mountMentions();
    expect(w.find("textarea").exists()).toBe(true);
    w.unmount();
  });

  it('has data-slot="mentions" and data-uipkge', () => {
    const w = mountMentions();
    const el = w.find('[data-slot="mentions"]');
    expect(el.exists()).toBe(true);
    expect(el.attributes("data-uipkge")).toBeDefined();
    w.unmount();
  });

  it('textarea has role="combobox"', () => {
    const w = mountMentions();
    expect(w.find("textarea").attributes("role")).toBe("combobox");
    w.unmount();
  });

  it("renders placeholder text", () => {
    const w = mountMentions({ placeholder: "Type @ to mention" });
    expect(w.find("textarea").attributes("placeholder")).toBe(
      "Type @ to mention",
    );
    w.unmount();
  });

  it("shows suggestions when trigger character is typed", async () => {
    const w = mountMentions({ modelValue: "" });
    await typeInMentions(w, "@");
    const listbox = document.body.querySelector('[role="listbox"]');
    expect(listbox).toBeTruthy();
    w.unmount();
  });

  it("suggestions list contains option labels", async () => {
    const w = mountMentions({ modelValue: "" });
    await typeInMentions(w, "@");
    const items = document.body.querySelectorAll('[role="option"]');
    expect(items.length).toBe(2);
    expect(document.body.textContent).toContain("Alice");
    expect(document.body.textContent).toContain("Bob");
    w.unmount();
  });

  it("supports custom trigger character", async () => {
    const w = mountMentions({ triggers: ["#"], prefix: "#", modelValue: "" });
    await typeInMentions(w, "#");
    const listbox = document.body.querySelector('[role="listbox"]');
    expect(listbox).toBeTruthy();
    w.unmount();
  });

  it("does not show suggestions without trigger character", async () => {
    const w = mountMentions({ modelValue: "" });
    await typeInMentions(w, "hello");
    const listbox = document.body.querySelector('[role="listbox"]');
    expect(listbox).toBeFalsy();
    w.unmount();
  });
});
