import { type NextRequest, NextResponse } from "next/server"
import { mockRatings } from "@/lib/data/mockRatings"

export async function GET(request: NextRequest, { params }: { params: { recipeId: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // Get ratings for this recipe
    const recipeRatings = mockRatings.filter((rating) => rating.recipeId === params.recipeId)

    // Sort by creation date (newest first)
    recipeRatings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Calculate statistics
    const totalRatings = recipeRatings.length
    const averageRating = totalRatings > 0 ? recipeRatings.reduce((sum, r) => sum + r.rating, 0) / totalRatings : 0

    const ratingDistribution = {
      1: recipeRatings.filter((r) => r.rating === 1).length,
      2: recipeRatings.filter((r) => r.rating === 2).length,
      3: recipeRatings.filter((r) => r.rating === 3).length,
      4: recipeRatings.filter((r) => r.rating === 4).length,
      5: recipeRatings.filter((r) => r.rating === 5).length,
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedRatings = recipeRatings.slice(startIndex, endIndex)

    return NextResponse.json({
      ratings: paginatedRatings,
      statistics: {
        totalRatings,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingDistribution,
      },
      pagination: {
        page,
        limit,
        total: totalRatings,
        totalPages: Math.ceil(totalRatings / limit),
      },
    })
  } catch (error) {
    console.error("Recipe ratings error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
