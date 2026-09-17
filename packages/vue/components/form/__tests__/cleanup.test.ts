import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { h } from "vue";
import FormFieldInner from "../FormFieldInner.vue";

describe("form field subscriptions", () => {
  for (const format of ["function", "object"]) {
    it(`updates and releases ${format} subscriptions on replacement and unmount`, async () => {
      const makeField = () => {
        const cleanup = vi.fn();
        let notify = () => {};
        const field = {
          name: "email",
          state: {
            value: "before",
            meta: {
              errors: [],
              isDirty: false,
              isTouched: false,
              isValid: true,
            },
          },
          store: {
            subscribe: (cb: () => void) => {
              notify = cb;
              return format === "function" ? cleanup : { unsubscribe: cleanup };
            },
          },
          handleChange: vi.fn(),
          handleBlur: vi.fn(),
        };
        return { field, cleanup, notify: () => notify() };
      };
      const first = makeField();
      const second = makeField();
      const wrapper = mount(FormFieldInner, {
        props: { field: first.field as never },
        slots: {
          default: ({ componentField }: any) =>
            h("span", componentField.modelValue),
        },
      });
      first.field.state.value = "updated";
      first.notify();
      await wrapper.vm.$nextTick();
      expect(wrapper.text()).toBe("updated");
      await wrapper.setProps({ field: second.field as never });
      expect(first.cleanup).toHaveBeenCalledOnce();
      wrapper.unmount();
      expect(second.cleanup).toHaveBeenCalledOnce();
    });
  }
});
