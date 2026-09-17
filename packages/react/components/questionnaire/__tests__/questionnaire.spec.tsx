import { afterEach, describe, it, expect } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { Questionnaire } from "../questionnaire";
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
  afterEach(() => cleanup());

  it('renders with data-slot="questionnaire"', () => {
    const { container } = render(<Questionnaire items={items} />);
    expect(container.querySelector('[data-slot="questionnaire"]')).toBeTruthy();
  });

  it("shows question 1 of 2", () => {
    const { container } = render(<Questionnaire items={items} />);
    expect(
      container.querySelector('[data-slot="questionnaire-progress"]')
        ?.textContent,
    ).toContain("Question 1 of 2");
  });

  it("hides progress when showProgress is false", () => {
    const { container } = render(
      <Questionnaire items={items} showProgress={false} />,
    );
    expect(
      container.querySelector('[data-slot="questionnaire-progress"]'),
    ).toBeFalsy();
  });

  it("blocks next when required and unanswered", () => {
    const { container } = render(<Questionnaire items={items} />);
    fireEvent.click(
      container.querySelector('[data-slot="questionnaire-next"]')!,
    );
    expect(
      container.querySelector('[data-slot="questionnaire-error"]')?.textContent,
    ).toContain("Choose an answer");
  });

  it("advances after a choice", () => {
    const { container } = render(<Questionnaire items={items} />);
    fireEvent.click(container.querySelector('input[value="chat"]')!);
    fireEvent.click(
      container.querySelector('[data-slot="questionnaire-next"]')!,
    );
    expect(
      container.querySelector('[data-slot="questionnaire-progress"]')
        ?.textContent,
    ).toContain("Question 2 of 2");
    expect(
      container.querySelector('[data-slot="questionnaire-submit"]'),
    ).toBeTruthy();
  });
});
