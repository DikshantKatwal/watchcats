import { type FieldValues } from "react-hook-form"
import { FieldInput } from "./FieldInput"
import type { FieldConfig } from "../../lib/types/FieldConfig"
import { FieldGroup } from "../ui/field"

type FormFieldsProps<T extends FieldValues> = {
    fields: FieldConfig<T>[]
}

export function FormFields<T extends FieldValues>({
    fields,
}: FormFieldsProps<T>) {
    return (
        <FieldGroup className="gap-1">
            {fields.map((field) => (
                <FieldInput<T>
                    key={field.name}
                    name={field.name}
                    label={field.label}
                    type={field.type}
                    rules={field.rules}
                    helperText={field.helperText}
                    endAddon={field.endAddon}
                />
            ))}
        </FieldGroup>
    )
}