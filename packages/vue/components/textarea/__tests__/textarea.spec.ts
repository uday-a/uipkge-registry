import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Textarea from "../Textarea.vue";

describe("Textarea", () => {
  it("renders a textarea element", () => {
    const w = mount(Textarea, { props: { modelValue: "" } });
    expect(w.find("textarea").exists()).toBe(true);
    w.unmount();
  });

  it("binds modelValue to the textarea element", () => {
    const w = mount(Textarea, { props: { modelValue: "hello world" } });
    expect(w.find("textarea").element.value).toBe("hello world");
    w.unmount();
  });

  it("emits update:modelValue when typing", async () => {
    const w = mount(Textarea, { props: { modelValue: "" } });
    await w.find("textarea").setValue("new text");
    expect(w.emitted("update:modelValue")).toBeTruthy();
    expect(w.emitted("update:modelValue")![0]).toEqual(["new text"]);
    w.unmount();
  });

  it("renders placeholder", () => {
    const w = mount(Textarea, {
      props: { modelValue: "", placeholder: "Enter text" },
    });
    expect(w.find("textarea").attributes("placeholder")).toBe("Enter text");
    w.unmount();
  });

  it("renders label text", () => {
    const w = mount(Textarea, {
      props: { modelValue: "", label: "Description" },
    });
    expect(w.text()).toContain("Description");
    w.unmount();
  });

  it("renders hint text", () => {
    const w = mount(Textarea, { props: { modelValue: "", hint: "Some hint" } });
    expect(w.text()).toContain("Some hint");
    w.unmount();
  });

  it("renders error messages", () => {
    const w = mount(Textarea, {
      props: { modelValue: "", errorMessages: "Required field" },
    });
    expect(w.text()).toContain("Required field");
    w.unmount();
  });

  it("sets aria-invalid when error is present", () => {
    const w = mount(Textarea, { props: { modelValue: "", error: "Error" } });
    expect(w.find("textarea").attributes("aria-invalid")).toBe("true");
    w.unmount();
  });

  it("disables textarea when disabled prop is true", () => {
    const w = mount(Textarea, { props: { modelValue: "", disabled: true } });
    expect(w.find("textarea").attributes("disabled")).toBeDefined();
    w.unmount();
  });

  it("sets textarea as readonly when readonly prop is true", () => {
    const w = mount(Textarea, { props: { modelValue: "", readonly: true } });
    expect(w.find("textarea").attributes("readonly")).toBeDefined();
    w.unmount();
  });

  it("uses defaultValue when modelValue is not provided", () => {
    const w = mount(Textarea, { props: { defaultValue: "default" } });
    expect(w.find("textarea").element.value).toBe("default");
    w.unmount();
  });

  it("sets rows attribute", () => {
    const w = mount(Textarea, { props: { modelValue: "", rows: 5 } });
    expect(w.find("textarea").attributes("rows")).toBe("5");
    w.unmount();
  });

  it("shows required indicator in label", () => {
    const w = mount(Textarea, {
      props: { modelValue: "", label: "Bio", required: true },
    });
    expect(w.text()).toContain("Bio");
    w.unmount();
  });

  it("emits focus event", async () => {
    const w = mount(Textarea, { props: { modelValue: "" } });
    await w.find("textarea").trigger("focus");
    expect(w.emitted("focus")).toBeTruthy();
    w.unmount();
  });

  it("emits blur event", async () => {
    const w = mount(Textarea, { props: { modelValue: "" } });
    await w.find("textarea").trigger("blur");
    expect(w.emitted("blur")).toBeTruthy();
    w.unmount();
  });

  it("clears value when allowClear button is clicked", async () => {
    const w = mount(Textarea, {
      props: { modelValue: "text", allowClear: true },
    });
    const clearBtn = w.find("button");
    expect(clearBtn.exists()).toBe(true);
    await clearBtn.trigger("click");
    expect(w.emitted("update:modelValue")![0]).toEqual([""]);
    w.unmount();
  });
});
