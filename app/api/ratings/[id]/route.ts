import { type NextRequest, NextResponse } from "next/server"
import { mockRatings } from "@/lib/data/mockRatings"
import { verifyToken } from "@/lib/utils/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const rating = mockRatings.find((r) => r.id === params.id)
    if (!rating) {
      return NextResponse.json({ error: "Rating not found" }, { status: 404 })
    }

    return NextResponse.json({ rating })
  } catch (error) {
    console.error("Rating fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const ratingIndex = mockRatings.findIndex((r) => r.id === params.id)
    if (ratingIndex === -1) {
      return NextResponse.json({ error: "Rating not found" }, { status: 404 })
    }

    const existingRating = mockRatings[ratingIndex]
    if (existingRating.userId !== payload.userId) {
      return NextResponse.json({ error: "Not authorized to update this rating" }, { status: 403 })
    }

    const { rating, comment } = await request.json()

    // Validation
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    // Update rating
    mockRatings[ratingIndex] = {
      ...existingRating,
      rating: rating !== undefined ? Number.parseInt(rating) : existingRating.rating,
      comment: comment !== undefined ? comment : existingRating.comment,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      message: "Rating updated successfully",
      rating: mockRatings[ratingIndex],
    })
  } catch (error) {
    console.error("Rating update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    const ratingIndex = mockRatings.findIndex((r) => r.id === params.id)
    if (ratingIndex === -1) {
      return NextResponse.json({ error: "Rating not found" }, { status: 404 })
    }

    const rating = mockRatings[ratingIndex]
    if (rating.userId !== payload.userId) {
      return NextResponse.json({ error: "Not authorized to delete this rating" }, { status: 403 })
    }

    mockRatings.splice(ratingIndex, 1)

    return NextResponse.json({ message: "Rating deleted successfully" })
  } catch (error) {
    console.error("Rating deletion error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
