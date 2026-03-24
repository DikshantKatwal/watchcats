import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { authApi } from "../api/auth"
import { useAuth } from "../context/authcontext/useAuthContext"

export function useLogout() {
    const { setAccessToken } = useAuth()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: () => authApi.logout(), // token comes from tokenStore automatically
        onSettled: () => {
            setAccessToken(null)
            queryClient.clear()
            navigate("/login", { replace: true })
        },
    })
}