import { useForm, FormProvider, type SubmitHandler } from "react-hook-form"
import type { FieldConfig } from "../../lib/types/FieldConfig"
import { FormFields } from "../../components/form/FormRendered"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { useNavigate } from "react-router-dom"
import { InputGroupAddon } from "../../components/ui/input-group"
import { InfoIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "../../components/ui/tooltip"
import { useLogin } from "../../hooks/useLogin"
import { ApiError } from "@/api/client"

type LoginFormValues = {
    email: string
    password: string
}
const fields = [
    {
        name: "email",
        label: "Email",
        type: "email",
        rules: {
            required: "Email is required",
            pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
            },
        },
    },
    {
        name: "password",
        label: "Password",
        type: "password",
        rules: { required: "Password is required" },
        endAddon: (
            <>
                <InputGroupAddon
                    align="inline-end"
                    className="cursor-pointer"
                    onClick={undefined}
                >
                    <Tooltip >
                        <TooltipTrigger> <InfoIcon size={16} /></TooltipTrigger>
                        <TooltipContent align="center" side="bottom">
                            <p>Password must contain atleast 8 characters</p>
                        </TooltipContent>
                    </Tooltip>
                </InputGroupAddon>
            </>
        )

    },
] satisfies FieldConfig<LoginFormValues>[];

export default function LoginForm() {
    const navigate = useNavigate()
    const methods = useForm<LoginFormValues>({
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onSubmit",
    })
    const { mutate: login, isPending, error } = useLogin()
    const onSubmit: SubmitHandler<LoginFormValues> = (data) => {
        login(data, {
            onSuccess: () => navigate("/admin"),
        })
    }

    // Derive a human-readable error message
    const errorMessage =
        error instanceof ApiError
            ? typeof error.data === "object" && error.data !== null
                ? // Try common Django REST error shapes
                (error.data as Record<string, string[]>)?.non_field_errors?.[0] ??
                (error.data as Record<string, string>)?.detail ??
                "Invalid credentials."
                : "Invalid credentials."
            : error
                ? "Something went wrong. Please try again."
                : null
    return (
        <div className="h-screen">
            <div className="h-full flex items-center justify-center">
                <FormProvider {...methods}>
                    <Card size="sm" className="w-96">
                        <CardHeader>
                            <CardTitle >Login to your account</CardTitle>
                            <CardDescription>
                                Enter your email below to login to your account
                            </CardDescription>
                            <CardAction>
                                <Button variant="link">Sign Up</Button>
                            </CardAction>
                        </CardHeader>
                        <CardContent>
                            <form id="login-form" onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
                                <FormFields<LoginFormValues> fields={fields} />
                                {errorMessage && (
                                    <p className="text-sm text-destructive">{errorMessage}</p>
                                )}
                            </form>
                        </CardContent>
                        <CardFooter className="flex-col gap-2 border-0">
                            <Button type="submit"
                                form="login-form"
                                className="w-full"
                                disabled={isPending}>
                                {isPending ? "Logging in…" : "Login"}
                            </Button>
                        </CardFooter>
                    </Card>
                </FormProvider>
            </div>
        </div>
    )
}