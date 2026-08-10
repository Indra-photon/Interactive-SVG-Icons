import type { IconSvgElement } from "@hugeicons/react";
import {
  Building03Icon,
  CheckmarkSquare02Icon,
  InputShortTextIcon,
  Link04Icon,
  ParagraphBulletsPoint01Icon,
  SignatureIcon,
  SmartPhone01Icon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons";

export type QuestionTypeId =
  | "text"
  | "options"
  | "social"
  | "company"
  | "checkbox"
  | "terms"
  | "phone"
  | "website";

export type QuestionType = {
  id: QuestionTypeId;
  label: string;
  /** Shown under the label once the type is picked. */
  description: string;
  icon: IconSvgElement;
  /** Prefills the question field so the step never opens empty-handed. */
  defaultQuestion: string;
};

/** Grid order is column-major-by-row: [Text, Options], [Social, Company], … */
export const QUESTION_TYPES: QuestionType[] = [
  {
    id: "text",
    label: "Text",
    description: "Ask for a free-form response",
    icon: InputShortTextIcon,
    defaultQuestion: "",
  },
  {
    id: "options",
    label: "Options",
    description: "Let guests choose from a list",
    icon: ParagraphBulletsPoint01Icon,
    defaultQuestion: "",
  },
  {
    id: "social",
    label: "Social Profile",
    description: "Ask for a social profile",
    icon: UserCircleIcon,
    defaultQuestion: "",
  },
  {
    id: "company",
    label: "Company",
    description: "Ask for the company the guest works for",
    icon: Building03Icon,
    defaultQuestion: "What company do you work for?",
  },
  {
    id: "checkbox",
    label: "Checkbox",
    description: "Ask guests to confirm something",
    icon: CheckmarkSquare02Icon,
    defaultQuestion: "",
  },
  {
    id: "terms",
    label: "Terms",
    description: "Collect consent to terms and conditions",
    icon: SignatureIcon,
    defaultQuestion: "",
  },
  {
    id: "phone",
    label: "Phone",
    description: "Ask for a phone number",
    icon: SmartPhone01Icon,
    defaultQuestion: "",
  },
  {
    id: "website",
    label: "Website",
    description: "Ask for a website URL",
    icon: Link04Icon,
    defaultQuestion: "",
  },
];

export function getQuestionType(id: QuestionTypeId) {
  return QUESTION_TYPES.find((type) => type.id === id)!;
}
