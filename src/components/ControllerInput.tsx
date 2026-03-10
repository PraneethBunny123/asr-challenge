import { authFormSchema } from "@/lib/utils";
import { Control, Controller, FieldPath } from "react-hook-form";
import z from "zod";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = authFormSchema("sign-up");

type formValues = z.infer<typeof formSchema>;

interface ControllerInputProps {
  control: Control<formValues>;
  name: FieldPath<formValues>;
  label: string;
  placeholder: string;
}

export default function ControllerInput({
  control,
  name,
  label,
  placeholder,
}: ControllerInputProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <Input 
            id={name} 
            placeholder={placeholder} 
            {...field} 
            type={name === 'password' ? 'password' : 'text'}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
