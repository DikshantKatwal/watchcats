import {
    useState,
    useEffect,
    useCallback,
    type ReactNode,
} from "react"
import { authApi } from "../../api/auth"
import { AuthContext } from "./useAuthContext"
import { ApiError, logoutHandler, tokenStore } from "../../api/client"



export function AuthProvider({ children }: { children: ReactNode }) {
    const [accessToken, setAccessTokenState] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // On mount, try to silently refresh using the httpOnly cookie
    const setAccessToken = useCallback((token: string | null) => {
        tokenStore.set(token)        // ← apiClient reads this automatically
        setAccessTokenState(token)
    }, [])



    const logout = useCallback(() => {
        authApi.logout().catch(() => { })
        setAccessToken(null)
    }, [setAccessToken])

    useEffect(() => {
        logoutHandler.register(logout)
    }, [logout])

    useEffect(() => {
        authApi
            .refresh()
            .then((res) => setAccessToken(res.access))
            .catch((err) => {
                if (err instanceof ApiError && err.status === 401) {
                    setAccessToken(null)
                }
                // any other error (network down, 500, etc.) — leave token as-is
            })
            .finally(() => setIsLoading(false))
    }, [setAccessToken])
    return (
        <AuthContext.Provider
            value={{
                accessToken,
                isAuthenticated: !!accessToken,
                isLoading,
                setAccessToken,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

