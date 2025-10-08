import { type NextRequest, NextResponse } from "next/server"
import { mockUsers } from "@/lib/data/mockUsers"
import { verifyToken } from "@/lib/utils/auth"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Authorization token required" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Return users without passwords
    const usersWithoutPasswords = mockUsers.map(({ password, ...user }) => user)

    return NextResponse.json({
      users: usersWithoutPasswords,
      total: usersWithoutPasswords.length,
    })
  } catch (error) {
    console.error("Users list error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
