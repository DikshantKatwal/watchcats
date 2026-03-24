const BASE_URL = "http://localhost:8001/api/v1"

// ── Token Store ────────────────────────────────────────────────────────────
// A simple singleton that holds the access token in memory.
// AuthContext calls tokenStore.set() after login/refresh — no prop drilling,
// no manual token passing to any API call.

let _accessToken: string | null = null

export const tokenStore = {
    get: () => _accessToken,
    set: (token: string | null) => { _accessToken = token },
}

// ── Types ──────────────────────────────────────────────────────────────────

type RequestOptions = {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
    body?: unknown
    headers?: Record<string, string>
    withCredentials?: boolean
    public?: boolean // set true to skip Authorization header (login, refresh, etc.)
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

export async function apiClient<T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> {
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