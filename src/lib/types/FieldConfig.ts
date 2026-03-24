import type { ReactNode } from "react"
import { type FieldValues, type Path, type RegisterOptions } from "react-hook-form"

export type FieldConfig<T extends FieldValues> = {
    name: Path<T>
    label: string
    type?: React.HTMLInputTypeAttribute
    rules?: RegisterOptions<T, Path<T>>
    helperText?: ReactNode[]
    endAddon?: ReactNode
}