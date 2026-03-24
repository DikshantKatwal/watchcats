import { apiClient } from "./client"

// ── Types ──────────────────────────────────────────────────────────────────

export type LoginPayload = {
    email: string
    password: string
}

export type LoginResponse = {
    access: string
    // refresh is auto-saved to httpOnly cookie by the backend
}

export type RefreshResponse = {
    access: string
}

// ── Endpoints ──────────────────────────────────────────────────────────────

export const authApi = {
    login: (payload: LoginPayload) =>
        apiClient<LoginResponse>("/accounts/login/", {
            method: "POST",
            body: payload,
            public: true,
        }),

    refresh: () =>
        apiClient<RefreshResponse>("/accounts/refresh/", {
            method: "POST",
            public: true,
        }),

    logout: () =>
        apiClient<void>("/accounts/logout/", {
            method: "POST",
        }),
}