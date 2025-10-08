import { type NextRequest, NextResponse } from "next/server"
import { mockRatings, type Rating } from "@/lib/data/mockRatings"
import { verifyToken } from "@/lib/utils/auth"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const recipeId = searchParams.get("recipeId")
    const userId = searchParams.get("userId")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    let filteredRatings = [...mockRatings]

    // Apply filters
    if (recipeId) {
      filteredRatings = filteredRatings.filter((rating) => rating.recipeId === recipeId)
    }
    if (userId) {
      filteredRatings = filteredRatings.filter((rating) => rating.userId === userId)
    }

    // Sort by creation date (newest first)
    filteredRatings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedRatings = filteredRatings.slice(startIndex, endIndex)

    return NextResponse.json({
      ratings: paginatedRatings,
      pagination: {
        page,
        limit,
        total: filteredRatings.length,
        totalPages: Math.ceil(filteredRatings.length / limit),
      },
    })
  } catch (error) {
    console.error("Ratings list error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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

    const { recipeId, rating, comment } = await request.json()

    // Validation
    if (!recipeId || rating === undefined) {
      return NextResponse.json({ error: "Recipe ID and rating are required" }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    // Check if user already rated this recipe
    const existingRating = mockRatings.find((r) => r.recipeId === recipeId && r.userId === payload.userId)
    if (existingRating) {
      return NextResponse.json({ error: "You have already rated this recipe" }, { status: 409 })
    }

    // Create new rating
    const newRating: Rating = {
      id: (mockRatings.length + 1).toString(),
      recipeId,
      userId: payload.userId,
      rating: Number.parseInt(rating),
      comment: comment || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockRatings.push(newRating)

    return NextResponse.json(
      {
        message: "Rating added successfully",
        rating: newRating,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Rating creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
