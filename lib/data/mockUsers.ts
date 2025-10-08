export interface User {
  id: string
  email: string
  password: string
  name: string
  createdAt: string
  updatedAt: string
  isPremium?: boolean
  avatar?: string
  bio?: string
}

export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@example.com",
    password: "admin123", // Simple password for demo
    name: "Admin User",
    isPremium: true,
    avatar: "/placeholder-user.jpg",
    bio: "Platform administrator and cooking enthusiast",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    email: "user@example.com",
    password: "user123", // Simple password for demo
    name: "Regular User",
    isPremium: false,
    avatar: "/placeholder-user.jpg",
    bio: "Home cook learning new recipes",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "3",
    email: "chef@example.com",
    password: "chef123", // Simple password for demo
    name: "Chef Maria",
    isPremium: true,
    avatar: "/placeholder-user.jpg",
    bio: "Professional chef with 15 years of experience",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
]
