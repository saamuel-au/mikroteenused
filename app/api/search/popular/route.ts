import { NextResponse } from "next/server"
import { getPopularSearchTerms } from "@/lib/utils/search"

export async function GET() {
  try {
    const popularTerms = getPopularSearchTerms()

    return NextResponse.json({ popularTerms })
  } catch (error) {
    console.error("Popular search terms error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
