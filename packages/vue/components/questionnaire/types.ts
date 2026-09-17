export type QuestionnaireValue = string | string[];

export type QuestionnaireAnswers = Record<
  string,
  QuestionnaireValue | undefined
>;

export interface QuestionnaireChoiceDef {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface QuestionnaireItemDef {
  name: string;
  prompt: string;
  description?: string;
  required?: boolean;
  multiple?: boolean;
  choices?: QuestionnaireChoiceDef[];
  input?: { label?: string; placeholder?: string };
}

export type QuestionnaireShortcuts = "letters" | "numbers" | false;
