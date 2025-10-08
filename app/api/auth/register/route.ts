import { type NextRequest, NextResponse } from "next/server"
import { mockUsers, type User } from "@/lib/data/mockUsers"
import { generateToken, hashPassword } from "@/lib/utils/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = mockUsers.find((user) => user.email === email)
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Create new user
    const hashedPassword = await hashPassword(password)
    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      email,
      password: hashedPassword,
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockUsers.push(newUser)

    // Generate token
    const token = generateToken({ userId: newUser.id, email: newUser.email })

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: userWithoutPassword,
        token,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
