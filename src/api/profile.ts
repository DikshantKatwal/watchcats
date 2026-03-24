import { apiClient } from "./client"

// Just define types + call apiClient — token is injected automatically, always.

export type Profile = {
    id: string
    email: string
    first_name: string
    last_name: string
    full_name: string
}

export type Roles = {
    id: number
    mane: string
    code: string
}

export type CreateOrderPayload = {
    items: { product_id: number; quantity: number }[]
}

export const profileApi = {
    get: () => apiClient<Profile>(`/accounts/profile/`),
    roles: () => apiClient<Roles>("/accounts/profile/roles/"),
}