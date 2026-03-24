const BASE_URL = "http://localhost:8001/api/v1"

// ── Token Store ────────────────────────────────────────────────────────────

let _accessToken: string | null = null

export const tokenStore = {
    get: () => _accessToken,
    set: (token: string | null) => { _accessToken = token },
}

// ── Logout Callback ────────────────────────────────────────────────────────
// AuthContext registers this so the client can trigger logout without
// importing React hooks (which would cause a circular dependency).

let _onLogout: (() => void) | null = null

export const logoutHandler = {
    register: (fn: () => void) => { _onLogout = fn },
    call: () => _onLogout?.(),
}

// ── Types ──────────────────────────────────────────────────────────────────

type RequestOptions = {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
    body?: unknown
    headers?: Record<string, string>
    withCredentials?: boolean
    public?: boolean  // skip Authorization header (login, refresh, etc.)
    _retry?: boolean  // internal — prevents infinite refresh loop
}
export class ApiError extends Error {
    // 1. Explicitly declare properties
    public status: number;
    public data: unknown;

    constructor(
        status: number, // 2. Remove 'public' from parameters
        data: unknown,
        message?: string
    ) {
        super(message ?? `API Error ${status}`);

        // 3. Manually assign values
        this.status = status;
        this.data = data;
        this.name = "ApiError";
    }
}
// export class ApiError extends Error {
//   constructor(
//     public status: number,
//     public data: unknown,
//     message?: string
//   ) {
//     super(message ?? `API Error ${status}`)
//     this.name = "ApiError"
//   }
// }

// ── Client ─────────────────────────────────────────────────────────────────



async function fetchWithToken<T>(endpoint: string, options: RequestOptions): Promise<T> {
    const {
        method = "GET",
        body,
        headers = {},
        withCredentials = true,
        public: isPublic = false,
    } = options

    const token = tokenStore.get()

    const config: RequestInit = {
        method,
        credentials: withCredentials ? "include" : "omit",
        headers: {
            "Content-Type": "application/json",
            ...(!isPublic && token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
        ...(body !== undefined && { body: JSON.stringify(body) }),
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, config)

    if (response.status === 204) return undefined as T

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        throw new ApiError(response.status, data, data?.detail ?? data?.message ?? "Request failed")
    }

    return data as T
}


export async function apiClient<T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> {
    try {
        return await fetchWithToken<T>(endpoint, options)
    } catch (err) {
        const isUnauthorized = err instanceof ApiError && err.status === 401
        const alreadyRetried = options._retry
        const isPublic = options.public

        // Only attempt refresh for protected endpoints that haven't been retried yet
        if (!isUnauthorized || alreadyRetried || isPublic) throw err

        try {
            // Attempt silent refresh (uses httpOnly cookie)
            const res = await fetchWithToken<{ access: string }>("/accounts/refresh/", {
                method: "POST",
                public: true,
            })

            tokenStore.set(res.access)

            // Retry the original request with the new token
            return await fetchWithToken<T>(endpoint, { ...options, _retry: true })
        } catch {
            // Refresh also failed — session is dead, force logout
            tokenStore.set(null)
            logoutHandler.call()
            throw err
        }
    }
}
