import { createRecordSchema } from "@/lib/utils";
import { Control, Controller, FieldPath } from "react-hook-form";
import z from "zod";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

type formValues = z.infer<typeof createRecordSchema>;

interface CreateInputProps {
  control: Control<formValues>;
  name: FieldPath<formValues>;
  label: string;
  placeholder: string;
  type?: string;
}

export default function CreateInput({
  control,
  name,
  label,
  placeholder,
  type,
}: CreateInputProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          {type === "input" ? (
            <Input id={name} placeholder={placeholder} {...field} />
          ) : (
            <Textarea id={name} placeholder={placeholder} {...field} />
          )}
          {name === 'note' && (
            <p className="text-xs text-muted-foreground">
              Notes help other reviewers understand decisions.
            </p>
          )}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} role="create-record-zod-error" />}
        </Field>
      )}
    />
  );
}
