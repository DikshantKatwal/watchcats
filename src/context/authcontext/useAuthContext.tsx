import { createContext, useContext } from "react"

// ── Types ──────────────────────────────────────────────────────────────────

type AuthState = {
    accessToken: string | null
    isAuthenticated: boolean
    isLoading: boolean
    setAccessToken: (token: string | null) => void
    logout: () => void
}

// ── Context ────────────────────────────────────────────────────────────────

export const AuthContext = createContext<AuthState | null>(null)

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useAuth must be used within AuthProvider")
    return ctx
}