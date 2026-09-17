import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { Questionnaire } from "../index";
import type { QuestionnaireItemDef } from "../types";

const items: QuestionnaireItemDef[] = [
  {
    name: "direction",
    prompt: "What next?",
    required: true,
    choices: [
      { value: "chat", label: "Chat" },
      { value: "crop", label: "Crop" },
    ],
  },
  {
    name: "notes",
    prompt: "Anything else?",
    choices: [{ value: "none", label: "None" }],
  },
];

describe("Questionnaire", () => {
  it('renders with data-slot="questionnaire"', () => {
    const w = mount(Questionnaire, {
      props: { items },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="questionnaire"]').exists()).toBe(true);
    w.unmount();
  });

  it("shows question 1 of 2", () => {
    const w = mount(Questionnaire, {
      props: { items },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="questionnaire-progress"]').text()).toContain(
      "Question 1 of 2",
    );
    w.unmount();
  });

  it("hides progress when showProgress is false", () => {
    const w = mount(Questionnaire, {
      props: { items, showProgress: false },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="questionnaire-progress"]').exists()).toBe(false);
    w.unmount();
  });

  it("blocks next when required and unanswered", async () => {
    const w = mount(Questionnaire, {
      props: { items },
      attachTo: document.body,
    });
    await w.find('[data-slot="questionnaire-next"]').trigger("click");
    expect(w.find('[data-slot="questionnaire-error"]').exists()).toBe(true);
    expect(w.find('[data-slot="questionnaire-progress"]').text()).toContain(
      "Question 1 of 2",
    );
    w.unmount();
  });

  it("advances after a choice", async () => {
    const w = mount(Questionnaire, {
      props: { items },
      attachTo: document.body,
    });
    await w.find('input[value="chat"]').trigger("change");
    await w.find('[data-slot="questionnaire-next"]').trigger("click");
    expect(w.find('[data-slot="questionnaire-progress"]').text()).toContain(
      "Question 2 of 2",
    );
    expect(w.find('[data-slot="questionnaire-submit"]').exists()).toBe(true);
    w.unmount();
  });
});
