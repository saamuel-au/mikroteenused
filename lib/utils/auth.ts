export interface JWTPayload {
  userId: string
  email: string
}

// Simple token generation using built-in crypto (for demo purposes)
export function generateToken(payload: JWTPayload): string {
  const tokenData = {
    ...payload,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  }
  return btoa(JSON.stringify(tokenData))
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = JSON.parse(atob(token))

    // Check if token is expired
    if (decoded.exp < Date.now()) {
      return null
    }

    return {
      userId: decoded.userId,
      email: decoded.email,
    }
  } catch {
    return null
  }
}

// Simple password hashing (for demo purposes)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + "salt")
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  if (hash.length < 32) {
    return password === hash
  }
  const hashedInput = await hashPassword(password)
  return hashedInput === hash
}
