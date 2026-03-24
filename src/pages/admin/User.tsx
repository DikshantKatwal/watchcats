import { useQuery } from "@tanstack/react-query"
import { FormProvider, useFieldArray, useForm, type SubmitHandler } from "react-hook-form"
import type { FieldConfig } from "../../lib/types/FieldConfig"
import { Card, CardContent, CardFooter } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { FormFields } from "../../components/form/FormRendered"
import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { userSchema, type TUser } from "../../lib/validators/userSchema"
import { FieldInput } from "../../components/form/FieldInput"


const fields = [
    {
        name: "email",
        label: "Email",
        type: "email",
    },
    {
        name: "username",
        label: "Username",
        type: "text",
    },
    {
        name: "address.street",
        label: "Street",
        type: "text",
    },
    {
        name: "address.city",
        label: "City",
        type: "text",
    },
] satisfies FieldConfig<TUser>[];


const User = () => {
    const { data } = useQuery<TUser>({
        queryKey: ['test'],
        queryFn: async () => {
            const res = await fetch('https://jsonplaceholder.typicode.com/users/1')
            return res.json()
        },
        staleTime: 1000 * 60 * 5,
    })

    const methods = useForm<TUser>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: "",
            username: "",
            email: "",
            address: {
                street: "",
                city: "",
            },
            numbers: [{ value: "" }]
        },
        mode: "onSubmit",

    })

    /*  Array validation and Array form setup */
    const { control } = methods
    const { fields: phoneFields, append, remove } = useFieldArray<TUser>({
        control,
        name: "numbers",
    })

    const onSubmit: SubmitHandler<TUser> = (data) => {
        const payload = {
            ...data,
            numbers: (data.numbers || []).map((num) => (num.value))
        }
        console.log(payload)
    }
    useEffect(() => {
        if (data) {
            const defaultValue = {
                ...data,
                numbers: [
                    "9843819707",
                    "9845672187"
                ]
            }
            const defaultValues = {
                ...data,
                numbers: (defaultValue.numbers || []).map((num) => ({ value: num }))
            };
            methods.reset(defaultValues)
        }
    }, [data, methods])

    if (!data) return <div>Loading...</div>

    return (
        <div className="h-screen">
            <div className="h-full flex items-center justify-center">
                <FormProvider {...methods} >
                    <Card size="sm" className="w-96" >
                        <CardContent>
                            <form id="login-form" onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
                                <FormFields<TUser> fields={fields} />
                                <FieldInput<TUser> name="address.zipcode" label="Zip Code" />
                                <div className="space-y-2">
                                    <label className="font-medium">Phone Numbers</label>

                                    {phoneFields.map((field, index) => (
                                        <div key={field.id} className="flex gap-2 items-center">

                                            <FieldInput<TUser>
                                                name={`numbers.${index}.value`}
                                                label={index === 0 ? "Primary Phone" : `Secondary Phone ${index}`}
                                            />

                                            {index > 0 && (
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    onClick={() => remove(index)}
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </div>
                                    ))}

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => append({ value: "" })}
                                    >
                                        + Add Phone
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="flex-col gap-2 border-0">
                            <Button type="submit" form="login-form" className="w-full">
                                Login
                            </Button>
                        </CardFooter>

                    </Card>

                </FormProvider>
            </div>
        </div>
    )
}
export default User