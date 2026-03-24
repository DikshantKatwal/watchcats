import { z } from "zod"

export const addressSchema = z.object({
    street: z.string().optional(),
    city: z.string().min(1, "City is required"),
    zipcode: z.string().min(1, "zipcode is required"),
})


export const userSchema = z.object({
    name: z.string().optional(),
    username: z.string().min(1, "Username is required"),
    email: z.email({ error: "Email is required" }),
    address: addressSchema,
    numbers: z.array(
        z.object({
            value: z.string().min(1, "Phone required")
        })
    ).min(1, "At least one phone number is required"),
})



export type TUser = z.infer<typeof userSchema>