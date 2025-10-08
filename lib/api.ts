const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

// Simple fetch-based API client to avoid axios import issues
class ApiClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>

  constructor(baseURL: string) {
    this.baseURL = baseURL
    this.defaultHeaders = {
      "Content-Type": "application/json",
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}/api${endpoint}`
    console.log("[v0] Making API request to:", url) // Debug log

    // Add auth token if available (client-side only)
    const headers = { ...this.defaultHeaders }
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    }

    console.log("[v0] Request config:", config) // Debug log

    try {
      const response = await fetch(url, config)
      console.log("[v0] Response status:", response.status) // Debug log

      if (!response.ok) {
        if (response.status === 401 && typeof window !== "undefined") {
          localStorage.removeItem("token")
          window.location.href = "/login"
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Response data:", data) // Debug log
      return data
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  async get(endpoint: string, params?: Record<string, any>) {
    const url = params ? `${endpoint}?${new URLSearchParams(params).toString()}` : endpoint
    return this.request(url, { method: "GET" })
  }

  async post(endpoint: string, data?: any) {
    return this.request(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put(endpoint: string, data?: any) {
    return this.request(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete(endpoint: string) {
    return this.request(endpoint, { method: "DELETE" })
  }
}

export const api = new ApiClient(API_BASE_URL)

export const recipesAPI = {
  getRecipes: (params?: {
    page?: number
    limit?: number
    category?: string
    difficulty?: string
    authorId?: string
  }) => api.get("/recipes", params),
  getRecipe: (id: string) => api.get(`/recipes/${id}`),
  createRecipe: (data: any) => api.post("/recipes", data),
  updateRecipe: (id: string, data: any) => api.put(`/recipes/${id}`, data),
  deleteRecipe: (id: string) => api.delete(`/recipes/${id}`),
  getCategories: () => api.get("/recipes/categories"),
  getStats: () => api.get("/recipes/stats"),
}

export const authAPI = {
  register: (data: { email: string; password: string; firstName: string; lastName: string }) =>
    api.post("/auth/register", data),
  login: (data: { email: string; password: string }) => api.post("/auth/login", data),
  getProfile: () => api.get("/users/profile"),
  updateProfile: (data: { firstName: string; lastName: string; bio?: string }) => api.put("/users/profile", data),
}

export const searchAPI = {
  search: (params: {
    q?: string
    page?: number
    limit?: number
    category?: string
    difficulty?: string
    minCookingTime?: number
    maxCookingTime?: number
  }) => api.get("/search", params),
  getSuggestions: (q: string) => api.get("/search/suggestions", { q }),
  getPopularTerms: () => api.get("/search/popular"),
  getFilters: () => api.get("/search/filters"),
}

export const ratingsAPI = {
  getRatings: (params?: {
    recipeId?: string
    userId?: string
    page?: number
    limit?: number
  }) => api.get("/ratings", params),
  getRating: (id: string) => api.get(`/ratings/${id}`),
  createRating: (data: { recipeId: string; rating: number; comment?: string }) => api.post("/ratings", data),
  updateRating: (id: string, data: { rating?: number; comment?: string }) => api.put(`/ratings/${id}`, data),
  deleteRating: (id: string) => api.delete(`/ratings/${id}`),
  getRecipeRatings: (recipeId: string, params?: { page?: number; limit?: number }) =>
    api.get(`/ratings/recipe/${recipeId}`, params),
  getStats: () => api.get("/ratings/stats"),
}
