import { createContext, useContext } from "react"

const FormSectionContext = createContext<string | null>(null)

export const FormSection = ({
    name,
    children,
}: {
    name: string
    children: React.ReactNode
}) => {
    return (
        <FormSectionContext.Provider value={name}>
            <div className="space-y-3 border p-3 rounded">
                {children}
            </div>
        </FormSectionContext.Provider>
    )
}

export const useFormSection = () => {
    return useContext(FormSectionContext)
}