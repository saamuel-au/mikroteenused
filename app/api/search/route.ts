import { type NextRequest, NextResponse } from "next/server"
import { mockRecipes } from "@/lib/data/mockRecipes"
import { searchRecipes } from "@/lib/utils/search"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category")
    const difficulty = searchParams.get("difficulty")
    const minCookingTime = searchParams.get("minCookingTime")
    const maxCookingTime = searchParams.get("maxCookingTime")

    // Get search results
    let searchResults = searchRecipes(mockRecipes, query)

    // Apply additional filters
    if (category) {
      searchResults = searchResults.filter((result) => result.recipe.category.toLowerCase() === category.toLowerCase())
    }
    if (difficulty) {
      searchResults = searchResults.filter((result) => result.recipe.difficulty === difficulty)
    }
    if (minCookingTime) {
      searchResults = searchResults.filter((result) => result.recipe.cookingTime >= Number.parseInt(minCookingTime))
    }
    if (maxCookingTime) {
      searchResults = searchResults.filter((result) => result.recipe.cookingTime <= Number.parseInt(maxCookingTime))
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedResults = searchResults.slice(startIndex, endIndex)

    return NextResponse.json({
      query,
      results: paginatedResults.map((result) => result.recipe),
      scores: paginatedResults.map((result) => result.score),
      pagination: {
        page,
        limit,
        total: searchResults.length,
        totalPages: Math.ceil(searchResults.length / limit),
      },
    })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
