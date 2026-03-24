import { useMutation } from "@tanstack/react-query"
import { authApi, type LoginPayload } from "../api/auth"
import { useAuth } from "../context/authcontext/useAuthContext"

export function useLogin() {
    const { setAccessToken } = useAuth()

    return useMutation({
        mutationFn: (payload: LoginPayload) => authApi.login(payload),
        onSuccess: (data) => {
            setAccessToken(data.access)
        },
    })
}