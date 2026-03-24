import {
  type FieldErrors,
  type FieldValues,
  get,
  type Path,
  type RegisterOptions,
  useFormContext,
} from "react-hook-form"
import { cn } from "../../lib/utils"
import { Field, FieldDescription, FieldLabel } from "../ui/field"
import { useState, type ReactNode } from "react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useFormSection } from "./FormSection"

type FieldInputProps<T extends FieldValues> = {
  name: Path<T>
  label?: string
  rules?: RegisterOptions<T, Path<T>>
  error?: FieldErrors<T>[Path<T>]
  helperText?: ReactNode[]
  endAddon?: ReactNode
} & Omit<React.ComponentProps<"input">, "name">

export function FieldInput<T extends FieldValues>({
  name,
  label,
  rules,
  type,
  helperText,
  endAddon,
  ...props
}: FieldInputProps<T>) {
  const { register, formState: { errors } } = useFormContext<T>()
  // const error = get(errors, name)
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === "password"
  const section = useFormSection()
  const fullName = section ? `${section}.${name}` : name
  const error = get(errors, fullName)
  return (
    <Field className="gap-0">
      <FieldLabel htmlFor={name} className={cn("", error && "text-destructive")} >
        {label || name}
      </FieldLabel>
      <InputGroup
        id={name}
        unstyled
        className={cn(
          "rounded-sm aria-invalid:ring-0 outline-none focus:outline-none focus-visible:ring-0 focus:border-transparent invalid:ring-0",
          error && "border-red-500",
          props.className
        )}
      >
        <InputGroupInput
          id={name}
          type={isPassword && showPassword ? "text" : type}
          placeholder={props.placeholder || ""}
          className="p-1"
          {...register(name, rules)}
          {...props}
        />
        {isPassword && (
          <InputGroupAddon
            align="inline-end"
            className="cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
          </InputGroupAddon>
        )}
        {endAddon && (
          <>
            {endAddon}
          </>
        )}
      </InputGroup>
      <FieldDescription hidden={!!error}>
        {(helperText || []).map((_text) => _text)}
      </FieldDescription>
      {error && (
        <p className="text-xs text-red-500">
          {error.message?.toString()}
        </p>
      )}
    </Field>
  )
}