"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { api } from "@/lib/api"

interface User {
  id: number | string
  email: string
  name: string
  firstName?: string
  lastName?: string
  avatar?: string
  bio?: string
  isPremium?: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (email: string, password: string, name: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      api
        .get("/users/profile")
        .then((response) => {
          setUser(response.user)
        })
        .catch(() => {
          localStorage.removeItem("token")
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password })
    const { user, token } = response
    localStorage.setItem("token", token)
    setUser(user)
  }

  const register = async (email: string, password: string, name: string) => {
    const response = await api.post("/auth/register", { email, password, name })
    const { user, token } = response
    localStorage.setItem("token", token)
    setUser(user)
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, login, logout, register }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
