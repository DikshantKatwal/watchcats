import type { PaginatedRequest } from "../lib/types/PaginatedRequest"
import type { PaginatedResponse } from "../lib/types/PaginatedResponse"
import { apiClient } from "./client"

// Just define types + call apiClient — token is injected automatically, always.

export type USER = {
    id: string
    email: string
    first_name: string
    last_name: string
    full_name: string
}

export type CreateUSERPayload = { email: string; first_name: string; last_name: string }

export const usersApi = {
    list: (params: PaginatedRequest) => {
        const query = new URLSearchParams(params).toString();
        return apiClient<PaginatedResponse<USER>>(
            `/admin/users/profiles/?${query}`
        );
    },
    get: (id: number) => apiClient<USER>(`/admin/users/profiles/${id}/`),
    create: (body: CreateUSERPayload) => apiClient<USER>("/admin/users/profiles/", { method: "POST", body }),
    update: (id: number) => apiClient<void>(`/admin/users/profiles/${id}/`, { method: "PATCH" }),
}