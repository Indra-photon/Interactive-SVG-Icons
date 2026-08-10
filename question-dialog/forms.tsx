"use client";

import { useId, useState, type ComponentType, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  InputShortTextIcon,
  Link04Icon,
  PlusSignIcon,
  TextAlignLeftIcon,
} from "@hugeicons/core-free-icons";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  FADE,
  Field,
  ICON_STROKE_SMALL,
  Reveal,
  Section,
  SegmentedControl,
  SubmitButton,
  ToggleRow,
} from "./primitives";
import type { QuestionType, QuestionTypeId } from "./question-types";

export type QuestionDraft = {
  type: QuestionTypeId;
  question: string;
  required: boolean;
  settings: Record<string, unknown>;
};

export type QuestionFormProps = {
  type: QuestionType;
  onSubmit: (draft: QuestionDraft) => void;
};

/* --------------------------------------------------------------- call-site
 * Base shadcn classes stay untouched; every visual change lands here.
 * ------------------------------------------------------------------------ */

const inputClass =
  "h-11 rounded-xl border-border bg-background px-3.5 text-[15px] shadow-none placeholder:text-muted-foreground/70 focus-visible:border-foreground focus-visible:ring-0 focus-visible:ring-offset-0";

const textareaClass =
  "min-h-28 rounded-xl border-border bg-background px-3.5 py-3 text-[15px] shadow-none placeholder:text-muted-foreground/70 focus-visible:border-foreground focus-visible:ring-0 focus-visible:ring-offset-0";

/** Fields, then the submit button — the layout every step screen shares. */
function FormLayout({
  children,
  onSubmit,
}: {
  children: ReactNode;
  onSubmit: () => void;
}) {
  return (
    <>
      <Section className="space-y-5 py-5">{children}</Section>
      <Section className="pb-7">
        <SubmitButton onClick={onSubmit}>Add Question</SubmitButton>
      </Section>
    </>
  );
}

function QuestionField({
  value,
  onChange,
  placeholder = "",
  autoFocus = true,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  const id = useId();
  return (
    <Field label="Question" htmlFor={id}>
      <Input
        id={id}
        autoFocus={autoFocus}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      />
    </Field>
  );
}

/* ------------------------------------------------------------------- text */

export function TextForm({ type, onSubmit }: QuestionFormProps) {
  const [question, setQuestion] = useState(type.defaultQuestion);
  const [length, setLength] = useState<"short" | "multi">("short");
  const [required, setRequired] = useState(false);
  const requiredId = useId();

  return (
    <FormLayout
      onSubmit={() =>
        onSubmit({ type: type.id, question, required, settings: { length } })
      }
    >
      <QuestionField value={question} onChange={setQuestion} />

      <Field label="Response Length">
        <SegmentedControl
          name="text-length"
          value={length}
          onValueChange={setLength}
          options={[
            { value: "short", label: "Short", icon: InputShortTextIcon },
            { value: "multi", label: "Multi-Line", icon: TextAlignLeftIcon },
          ]}
        />
      </Field>

      <ToggleRow
        id={requiredId}
        label="Required"
        checked={required}
        onCheckedChange={setRequired}
      />
    </FormLayout>
  );
}

/* ------------------------------------------------------------------ phone */

export function PhoneForm({ type, onSubmit }: QuestionFormProps) {
  const [question, setQuestion] = useState(type.defaultQuestion);
  const [required, setRequired] = useState(false);
  const requiredId = useId();

  return (
    <FormLayout
      onSubmit={() =>
        onSubmit({ type: type.id, question, required, settings: {} })
      }
    >
      <QuestionField value={question} onChange={setQuestion} />

      <p className="text-muted-foreground text-[14px] leading-[20px]">
        Please use the Phone Number question under the Personal Information
        section to get the phone number of the guest.
      </p>

      <ToggleRow
        id={requiredId}
        label="Required"
        checked={required}
        onCheckedChange={setRequired}
      />
    </FormLayout>
  );
}

/* ---------------------------------------------------------------- company */

export function CompanyForm({ type, onSubmit }: QuestionFormProps) {
  const [question, setQuestion] = useState(type.defaultQuestion);
  const [collectJobTitle, setCollectJobTitle] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [required, setRequired] = useState(false);
  const jobTitleId = useId();
  const requiredId = useId();

  return (
    <FormLayout
      onSubmit={() =>
        onSubmit({
          type: type.id,
          question,
          required,
          settings: { collectJobTitle, jobTitle },
        })
      }
    >
      <QuestionField value={question} onChange={setQuestion} />

      <div className="space-y-3">
        <ToggleRow
          id={jobTitleId}
          label="Collect Job Title"
          checked={collectJobTitle}
          onCheckedChange={setCollectJobTitle}
        />
        <Reveal show={collectJobTitle}>
          <Input
            value={jobTitle}
            placeholder="What is your job title?"
            onChange={(event) => setJobTitle(event.target.value)}
            className={inputClass}
          />
        </Reveal>
      </div>

      <ToggleRow
        id={requiredId}
        label="Required"
        checked={required}
        onCheckedChange={setRequired}
      />
    </FormLayout>
  );
}

/* ------------------------------------------------------------------ terms */

export function TermsForm({ type, onSubmit }: QuestionFormProps) {
  const [contentType, setContentType] = useState<"text" | "link">("text");
  const [content, setContent] = useState("");
  const [showBeforeAccept, setShowBeforeAccept] = useState(false);
  const [collectSignature, setCollectSignature] = useState(false);
  const [required, setRequired] = useState(true);
  const showId = useId();
  const signatureId = useId();
  const requiredId = useId();

  return (
    <FormLayout
      onSubmit={() =>
        onSubmit({
          type: type.id,
          question: content,
          required,
          settings: { contentType, showBeforeAccept, collectSignature },
        })
      }
    >
      <Field label="Content Type">
        <SegmentedControl
          name="terms-content-type"
          value={contentType}
          onValueChange={(next) => {
            setContentType(next);
            setContent("");
          }}
          options={[
            { value: "text", label: "Text", icon: TextAlignLeftIcon },
            { value: "link", label: "Link", icon: Link04Icon },
          ]}
        />
      </Field>

      {/* Swapping the control changes the dialog's height — the shell springs. */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={contentType}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={FADE}
        >
          {contentType === "text" ? (
            <Field label="Terms Content">
              <Textarea
                autoFocus
                value={content}
                onChange={(event) => setContent(event.target.value)}
                className={textareaClass}
              />
            </Field>
          ) : (
            <Field label="Terms Link">
              <Input
                autoFocus
                type="url"
                value={content}
                placeholder="https://"
                onChange={(event) => setContent(event.target.value)}
                className={inputClass}
              />
            </Field>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="space-y-3">
        <ToggleRow
          id={showId}
          label="Show Text Before Accept"
          description="Guests must view terms before accepting"
          checked={showBeforeAccept}
          onCheckedChange={setShowBeforeAccept}
        />
        <ToggleRow
          id={signatureId}
          label="Collect Signature"
          checked={collectSignature}
          onCheckedChange={setCollectSignature}
        />
        <ToggleRow
          id={requiredId}
          label="Required"
          checked={required}
          onCheckedChange={setRequired}
        />
      </div>
    </FormLayout>
  );
}

/* ---------------------------------------------------------------- options */

export function OptionsForm({ type, onSubmit }: QuestionFormProps) {
  const [question, setQuestion] = useState(type.defaultQuestion);
  const [options, setOptions] = useState([
    { id: "option-1", value: "" },
    { id: "option-2", value: "" },
  ]);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [required, setRequired] = useState(false);
  const multipleId = useId();
  const requiredId = useId();

  return (
    <FormLayout
      onSubmit={() =>
        onSubmit({
          type: type.id,
          question,
          required,
          settings: { allowMultiple, options: options.map((o) => o.value) },
        })
      }
    >
      <QuestionField value={question} onChange={setQuestion} />

      <div className="space-y-2">
        <p className="text-muted-foreground text-[13px] font-medium">Options</p>
        <AnimatePresence initial={false} mode="popLayout">
          {options.map((option, index) => (
            <motion.div
              key={option.id}
              layout
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={FADE}
              className="flex items-center gap-2 pb-2"
            >
              <Input
                value={option.value}
                placeholder={`Option ${index + 1}`}
                onChange={(event) =>
                  setOptions((current) =>
                    current.map((item) =>
                      item.id === option.id
                        ? { ...item, value: event.target.value }
                        : item,
                    ),
                  )
                }
                className={inputClass}
              />
              <button
                type="button"
                aria-label={`Remove option ${index + 1}`}
                disabled={options.length <= 1}
                onClick={() =>
                  setOptions((current) =>
                    current.filter((item) => item.id !== option.id),
                  )
                }
                className="text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-foreground/15 flex size-9 shrink-0 items-center justify-center rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-40"
              >
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  size={16}
                  strokeWidth={ICON_STROKE_SMALL}
                />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        <button
          type="button"
          onClick={() =>
            setOptions((current) => [
              ...current,
              { id: `option-${Date.now()}`, value: "" },
            ])
          }
          className="text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-foreground/15 flex h-9 items-center gap-1.5 rounded-full px-3 text-[14px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-0"
        >
          <HugeiconsIcon
            icon={PlusSignIcon}
            size={16}
            strokeWidth={ICON_STROKE_SMALL}
          />
          Add option
        </button>
      </div>

      <ToggleRow
        id={multipleId}
        label="Allow Multiple"
        description="Guests can select more than one option"
        checked={allowMultiple}
        onCheckedChange={setAllowMultiple}
      />
      <ToggleRow
        id={requiredId}
        label="Required"
        checked={required}
        onCheckedChange={setRequired}
      />
    </FormLayout>
  );
}

/* ---------------------------------------------------------------- checkbox */

export function CheckboxForm({ type, onSubmit }: QuestionFormProps) {
  const [question, setQuestion] = useState(type.defaultQuestion);
  const [helperText, setHelperText] = useState("");
  const [required, setRequired] = useState(false);
  const helperId = useId();
  const requiredId = useId();

  return (
    <FormLayout
      onSubmit={() =>
        onSubmit({
          type: type.id,
          question,
          required,
          settings: { helperText },
        })
      }
    >
      <QuestionField value={question} onChange={setQuestion} />

      <Field label="Helper Text" htmlFor={helperId}>
        <Input
          id={helperId}
          value={helperText}
          placeholder="Optional"
          onChange={(event) => setHelperText(event.target.value)}
          className={inputClass}
        />
      </Field>

      <ToggleRow
        id={requiredId}
        label="Required"
        checked={required}
        onCheckedChange={setRequired}
      />
    </FormLayout>
  );
}

/* ------------------------------------------------------------------ social */

export function SocialForm({ type, onSubmit }: QuestionFormProps) {
  const [question, setQuestion] = useState(type.defaultQuestion);
  const [network, setNetwork] = useState<"any" | "linkedin" | "x">("any");
  const [required, setRequired] = useState(false);
  const requiredId = useId();

  return (
    <FormLayout
      onSubmit={() =>
        onSubmit({ type: type.id, question, required, settings: { network } })
      }
    >
      <QuestionField value={question} onChange={setQuestion} />

      <Field label="Network">
        <SegmentedControl
          name="social-network"
          value={network}
          onValueChange={setNetwork}
          options={[
            { value: "any", label: "Any" },
            { value: "linkedin", label: "LinkedIn" },
            { value: "x", label: "X" },
          ]}
        />
      </Field>

      <ToggleRow
        id={requiredId}
        label="Required"
        checked={required}
        onCheckedChange={setRequired}
      />
    </FormLayout>
  );
}

/* ----------------------------------------------------------------- website */

export function WebsiteForm({ type, onSubmit }: QuestionFormProps) {
  const [question, setQuestion] = useState(type.defaultQuestion);
  const [required, setRequired] = useState(false);
  const requiredId = useId();

  return (
    <FormLayout
      onSubmit={() =>
        onSubmit({ type: type.id, question, required, settings: {} })
      }
    >
      <QuestionField value={question} onChange={setQuestion} />

      <ToggleRow
        id={requiredId}
        label="Required"
        checked={required}
        onCheckedChange={setRequired}
      />
    </FormLayout>
  );
}

/* ------------------------------------------------------------------ lookup */

export const QUESTION_FORMS: Record<
  QuestionTypeId,
  ComponentType<QuestionFormProps>
> = {
  text: TextForm,
  options: OptionsForm,
  social: SocialForm,
  company: CompanyForm,
  checkbox: CheckboxForm,
  terms: TermsForm,
  phone: PhoneForm,
  website: WebsiteForm,
};
