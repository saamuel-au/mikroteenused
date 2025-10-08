import { type NextRequest, NextResponse } from "next/server"
import { mockRecipes } from "@/lib/data/mockRecipes"
import { getAutocompleteSuggestions } from "@/lib/utils/search"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""

    if (!query.trim()) {
      return NextResponse.json({ suggestions: [] })
    }

    const suggestions = getAutocompleteSuggestions(query, mockRecipes)

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error("Search suggestions error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
